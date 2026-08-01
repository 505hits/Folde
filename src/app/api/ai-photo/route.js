import { NextResponse } from 'next/server';

const KIE_API_KEY = process.env.KIE_API_KEY || '58d40e4696f76ab670356400c189d948';

export async function POST(req) {
    try {
        const body = await req.json();
        const { prompt, imageUrls, imageSize = '1:1', outputFormat = 'png' } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const defaultImage = "https://static.aiquickdraw.com/tools/example/1773473208660_6EO8TFjh.webp";
        const formattedUrls = Array.isArray(imageUrls) && imageUrls.length > 0
            ? imageUrls.filter(url => url && typeof url === 'string')
            : [defaultImage];

        const payload = {
            model: "qwen2/image-edit",
            input: {
                prompt: prompt.trim(),
                image_url: formattedUrls.length > 0 ? formattedUrls : [defaultImage],
                image_size: imageSize,
                output_format: outputFormat,
                seed: Math.floor(Math.random() * 1000000),
                nsfw_checker: true
            }
        };

        const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KIE_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || data.code !== 200) {
            console.error('KIE Qwen createTask error:', data);
            return NextResponse.json({ error: data.msg || 'Failed to create AI photo task' }, { status: response.status || 500 });
        }

        return NextResponse.json({
            success: true,
            taskId: data.data?.taskId
        });

    } catch (err) {
        console.error('ai-photo POST exception:', err);
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

        if (!response.ok || data.code !== 200) {
            return NextResponse.json({ error: data.msg || 'Failed to query task status' }, { status: response.status || 500 });
        }

        const record = data.data || {};
        let resultUrls = [];

        if (record.state === 'success' && record.resultJson) {
            try {
                const parsed = JSON.parse(record.resultJson);
                resultUrls = parsed.resultUrls || parsed.urls || [];
            } catch (e) {
                console.warn('Failed to parse resultJson:', e);
            }
        }

        return NextResponse.json({
            success: true,
            state: record.state, // 'waiting', 'success', 'fail'
            resultUrls,
            failMsg: record.failMsg,
            costTime: record.costTime
        });

    } catch (err) {
        console.error('ai-photo GET exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
