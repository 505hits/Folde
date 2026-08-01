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
                    message: g.message || ''
                }));
            } else if (error) {
                console.warn('[API /api/rsvp GET] Supabase select notice:', error.message);
            }
        } catch (err) {
            console.warn('[API /api/rsvp GET] Exception:', err);
        }

        // Merge in-memory guests for this slug (deduplicate by id/name)
        const localList = inMemoryGuests[slug] || [];
        const combinedMap = new Map();

        dbGuests.forEach(g => combinedMap.set(g.id || g.name.toLowerCase(), g));
        localList.forEach(g => {
            const key = g.id || g.name.toLowerCase();
            if (!combinedMap.has(key)) {
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
            side
        } = body;

        if (!slug || !name) {
            return NextResponse.json({ success: false, error: 'Slug and name are required' }, { status: 400 });
        }

        const cleanName = name.trim();
        const formattedStatus = (status === 'yes' || status === 'Attending') ? 'Attending' : (status === 'no' || status === 'Declined') ? 'Declined' : status || 'Attending';
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        const newGuestObj = {
            id: guestId,
            name: cleanName,
            email: email ? email.trim() : '',
            status: formattedStatus,
            side: side || 'Both',
            meal: meal || '-',
            hasPlusOne: hasPlusOne || false,
            plusOneName: plusOneName ? plusOneName.trim() : '',
            accompaniedStatus: accompaniedStatus || 'alone',
            message: message || ''
        };

        // 1. Always store in server fallback memory first
        if (!inMemoryGuests[slug]) {
            inMemoryGuests[slug] = [];
        }
        inMemoryGuests[slug].unshift(newGuestObj);

        // 2. Try inserting into Supabase DB
        try {
            let invitationId = null;
            const { data: inv } = await supabase
                .from('invitations')
                .select('id')
                .eq('slug', slug)
                .single();
            invitationId = inv?.id || null;

            const { data, error } = await supabase
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

            if (error) {
                console.warn('[API /api/rsvp POST] Supabase insert warning:', error.message);
            } else if (data) {
                console.log('[API /api/rsvp POST] Supabase insert success:', data.id);
                newGuestObj.id = data.id;
            }
        } catch (err) {
            console.warn('[API /api/rsvp POST] Supabase insert exception:', err);
        }

        return NextResponse.json({ success: true, guest: newGuestObj });
    } catch (error) {
        console.error('[API /api/rsvp POST] Critical error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
