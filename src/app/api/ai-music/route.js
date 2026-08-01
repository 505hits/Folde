import { NextResponse } from 'next/server';

const KIE_API_KEY = process.env.KIE_API_KEY || '58d40e4696f76ab670356400c189d948';

export async function POST(req) {
    try {
        const body = await req.json();
        const { prompt, instrumental = true, model = 'V4', style, title } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const payload = {
            prompt: prompt.trim().slice(0, 500),
            customMode: false,
            instrumental: Boolean(instrumental),
            model: model || 'V4',
            callBackUrl: 'https://folde-gamma.vercel.app/api/ai-music-callback'
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
        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json({ error: 'taskId parameter is required' }, { status: 400 });
        }

        const response = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
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
        let audioUrl = null;

        if (record.state === 'success' && record.resultJson) {
            try {
                const parsed = JSON.parse(record.resultJson);
                audioUrl = parsed.audioUrl || parsed.resultUrls?.[0] || parsed.audio_url || null;
            } catch (e) {
                console.warn('Failed to parse music resultJson:', e);
            }
        }

        return NextResponse.json({
            success: true,
            state: record.state, // 'waiting', 'success', 'fail'
            audioUrl,
            resultJson: record.resultJson,
            failMsg: record.failMsg,
            costTime: record.costTime
        });

    } catch (err) {
        console.error('ai-music GET exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
