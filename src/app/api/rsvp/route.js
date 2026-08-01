import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// In-memory server fallback storage in case Supabase table/RLS fails
const inMemoryGuests = {};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
        }

        let dbGuests = [];
        try {
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .eq('slug', slug)
                .order('created_at', { ascending: false });

            if (!error && Array.isArray(data)) {
                dbGuests = data.map(g => ({
                    id: g.id,
                    name: g.name,
                    email: g.email || '',
                    status: g.status,
                    side: g.side || 'Both',
                    meal: g.meal || '-',
                    hasPlusOne: g.has_plus_one || false,
                    plusOneName: g.plus_one_name || '',
                    accompaniedStatus: g.accompanied_status || 'alone',
                    message: g.message || '',
                    tableId: g.table_id || null
                }));
            } else if (error) {
                console.warn('[API /api/rsvp GET] Supabase select notice:', error.message);
            }
        } catch (err) {
            console.warn('[API /api/rsvp GET] Exception:', err);
        }

        // Merge in-memory guests for this slug
        const localList = inMemoryGuests[slug] || [];
        const combinedMap = new Map();

        dbGuests.forEach(g => combinedMap.set(g.name.toLowerCase().trim(), g));
        localList.forEach(g => {
            const key = g.name.toLowerCase().trim();
            if (!combinedMap.has(key) || g.status !== 'Pending') {
                combinedMap.set(key, g);
            }
        });

        const finalGuests = Array.from(combinedMap.values());

        return NextResponse.json({ success: true, guests: finalGuests });
    } catch (error) {
        console.error('[API /api/rsvp GET] Critical error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            slug,
            name,
            email,
            status,
            meal,
            hasPlusOne,
            plusOneName,
            accompaniedStatus,
            message,
            side,
            tableId
        } = body;

        if (!slug || !name) {
            return NextResponse.json({ success: false, error: 'Slug and name are required' }, { status: 400 });
        }

        const cleanName = name.trim();
        const formattedStatus = (status === 'yes' || status === 'Attending') ? 'Attending' : (status === 'no' || status === 'Declined') ? 'Declined' : status || 'Attending';
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        let newGuestObj = {
            id: guestId,
            name: cleanName,
            email: email ? email.trim() : '',
            status: formattedStatus,
            side: side || 'Both',
            meal: meal || '-',
            hasPlusOne: hasPlusOne || false,
            plusOneName: plusOneName ? plusOneName.trim() : '',
            accompaniedStatus: accompaniedStatus || 'alone',
            message: message || '',
            tableId: tableId || null
        };

        if (!inMemoryGuests[slug]) {
            inMemoryGuests[slug] = [];
        }

        const existingIdx = inMemoryGuests[slug].findIndex(
            g => g.name.toLowerCase().trim() === cleanName.toLowerCase()
        );

        if (existingIdx !== -1) {
            inMemoryGuests[slug][existingIdx] = {
                ...inMemoryGuests[slug][existingIdx],
                status: formattedStatus,
                email: email ? email.trim() : inMemoryGuests[slug][existingIdx].email,
                meal: meal || inMemoryGuests[slug][existingIdx].meal,
                hasPlusOne: hasPlusOne || inMemoryGuests[slug][existingIdx].hasPlusOne,
                plusOneName: plusOneName ? plusOneName.trim() : inMemoryGuests[slug][existingIdx].plusOneName,
                accompaniedStatus: accompaniedStatus || inMemoryGuests[slug][existingIdx].accompaniedStatus,
                message: message || inMemoryGuests[slug][existingIdx].message,
                tableId: tableId !== undefined ? tableId : inMemoryGuests[slug][existingIdx].tableId
            };
            newGuestObj = inMemoryGuests[slug][existingIdx];
        } else {
            inMemoryGuests[slug].unshift(newGuestObj);
        }

        try {
            let invitationId = null;
            const { data: inv } = await supabase
                .from('invitations')
                .select('id')
                .eq('slug', slug)
                .single();
            invitationId = inv?.id || null;

            const { data: existingDb } = await supabase
                .from('guests')
                .select('id')
                .eq('slug', slug)
                .ilike('name', cleanName);

            if (existingDb && existingDb.length > 0) {
                const dbId = existingDb[0].id;
                await supabase
                    .from('guests')
                    .update({
                        status: formattedStatus,
                        email: email ? email.trim() : null,
                        meal: meal || '-',
                        has_plus_one: hasPlusOne || false,
                        plus_one_name: plusOneName ? plusOneName.trim() : null,
                        accompanied_status: accompaniedStatus || 'alone',
                        side: side || 'Both',
                        message: message || null
                    })
                    .eq('id', dbId);
                newGuestObj.id = dbId;
            } else {
                const { data } = await supabase
                    .from('guests')
                    .insert({
                        invitation_id: invitationId,
                        slug: slug,
                        name: cleanName,
                        email: email ? email.trim() : null,
                        status: formattedStatus,
                        meal: meal || '-',
                        has_plus_one: hasPlusOne || false,
                        plus_one_name: plusOneName ? plusOneName.trim() : null,
                        accompanied_status: accompaniedStatus || 'alone',
                        side: side || 'Both',
                        message: message || null
                    })
                    .select()
                    .single();

                if (data) newGuestObj.id = data.id;
            }
        } catch (err) {
            console.warn('[API /api/rsvp POST] Supabase exception:', err);
        }

        return NextResponse.json({ success: true, guest: newGuestObj });
    } catch (error) {
        console.error('[API /api/rsvp POST] Critical error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const guestId = searchParams.get('id');

        if (!slug || !guestId) {
            return NextResponse.json({ success: false, error: 'Slug and id are required' }, { status: 400 });
        }

        // 1. Remove from in-memory fallback
        if (inMemoryGuests[slug]) {
            inMemoryGuests[slug] = inMemoryGuests[slug].filter(g => String(g.id) !== String(guestId) && g.name !== guestId);
        }

        // 2. Remove from Supabase DB
        try {
            await supabase.from('guests').delete().eq('slug', slug).eq('id', guestId);
        } catch (err) {
            console.warn('[API /api/rsvp DELETE] Supabase delete notice:', err.message);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API /api/rsvp DELETE] Critical error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
