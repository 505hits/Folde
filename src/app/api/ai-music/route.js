import { NextResponse } from 'next/server';

const KIE_API_KEY = process.env.KIE_API_KEY;

export async function POST(req) {
    try {
        if (!KIE_API_KEY) {
            return NextResponse.json({ error: 'AI music is not configured.' }, { status: 503 });
        }
        const body = await req.json();
        const { prompt, instrumental = true, model = 'V4', style, title } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://folde-wedding.com';
        const payload = {
            prompt: prompt.trim().slice(0, 500),
            customMode: false,
            instrumental: Boolean(instrumental),
            model: model || 'V4',
            // Required by KIE. Polling still retrieves the result for the UI.
            callBackUrl: `${productionUrl.replace(/\/$/, '')}/api/ai-music-callback`
        };

        if (style) payload.style = style;
        if (title) payload.title = title;

        const response = await fetch('https://api.kie.ai/api/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KIE_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || (data.code !== 200 && data.code !== undefined && data.code !== 0)) {
            console.error('KIE Suno generate error:', data);
            return NextResponse.json({ error: data.msg || 'Failed to generate AI music task' }, { status: response.status || 500 });
        }

        return NextResponse.json({
            success: true,
            taskId: data.data?.taskId || data.taskId
        });

    } catch (err) {
        console.error('ai-music POST exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        if (!KIE_API_KEY) {
            return NextResponse.json({ error: 'AI music is not configured.' }, { status: 503 });
        }
        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json({ error: 'taskId parameter is required' }, { status: 400 });
        }

        // Music tasks use KIE's music-specific status endpoint. The generic jobs
        // endpoint does not expose the generated Suno audio URLs.
        const response = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${KIE_API_KEY}`
            }
        });

        const data = await response.json();

        if (!response.ok || (data.code !== 200 && data.code !== undefined)) {
            return NextResponse.json({ error: data.msg || 'Failed to query music task status' }, { status: response.status || 500 });
        }

        const record = data.data || {};
        const rawState = String(record.status || record.state || '').toUpperCase();
        const tracks = record.response?.sunoData || record.response?.data || record.sunoData || [];
        const firstTrack = Array.isArray(tracks) ? tracks[0] : null;
        const audioUrl = firstTrack?.audioUrl || firstTrack?.audio_url || firstTrack?.streamAudioUrl || firstTrack?.stream_audio_url || null;
        const failedStates = ['FAIL', 'FAILED', 'GENERATE_AUDIO_FAILED', 'CREATE_TASK_FAILED', 'CALLBACK_EXCEPTION', 'SENSITIVE_WORD_ERROR'];
        const state = rawState === 'SUCCESS' || rawState === 'FIRST_SUCCESS'
            ? 'success'
            : failedStates.includes(rawState) ? 'fail' : 'processing';

        return NextResponse.json({
            success: true,
            state,
            audioUrl,
            coverImageUrl: firstTrack?.imageUrl || firstTrack?.image_url || null,
            failMsg: record.errorMessage || record.failMsg,
            costTime: record.costTime
        });

    } catch (err) {
        console.error('ai-music GET exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
