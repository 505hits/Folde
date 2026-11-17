import { NextResponse } from 'next/server';

import { aiAccess, readTask, signTask } from '@/lib/ai-access';
import { refundAiCredit, reserveAiCredit } from '@/lib/ai-credits';

const KIE_API_KEY = process.env.KIE_API_KEY;

export async function POST(req) {
    try {
        const access = await aiAccess(req);
        if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
        const body = await req.json();
        const { prompt, imageUrls, imageSize = '1:1', outputFormat = 'png' } = body;

        if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        if (!KIE_API_KEY) {
            return NextResponse.json({ error: 'AI image generation is not configured.' }, { status: 503 });
        }

        const defaultImage = "https://static.aiquickdraw.com/tools/example/1773473208660_6EO8TFjh.webp";
        const formattedUrls = Array.isArray(imageUrls) && imageUrls.length > 0
            ? imageUrls.filter(url => url && typeof url === 'string').slice(0, 2)
            : [defaultImage];

        const reservation = await reserveAiCredit(access, body.slug, 'photo');
        if (reservation.error) return NextResponse.json({ error: reservation.error }, { status: reservation.status });

        const hasTwoReferences = formattedUrls.length === 2;
        const payload = hasTwoReferences ? {
            // Qwen3 supports an image_urls array; Qwen2 accepts only one image_url.
            model: "qwen3/image-to-image",
            input: {
                prompt: `Use both reference photos as two distinct people. Preserve each person's facial identity, features, and skin tone. ${prompt.trim()}`,
                image_urls: formattedUrls,
                resolution: "1K",
                image_size: imageSize,
                output_format: outputFormat,
                prompt_extend: true,
                negative_prompt: "missing person, duplicate person, merged faces, distorted face, blurry, low quality",
                seed: Math.floor(Math.random() * 1000000),
                nsfw_checker: true
            }
        } : {
            model: "qwen2/image-edit",
            input: {
                prompt: prompt.trim(),
                image_url: formattedUrls[0] || defaultImage,
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

        const data = await response.json().catch(() => ({}));
        const providerTaskId = data.data?.taskId;

        if (!response.ok || data.code !== 200 || typeof providerTaskId !== 'string' || !providerTaskId) {
            console.error('KIE Qwen createTask error:', data?.code, data?.msg);
            await refundAiCredit(reservation, 'photo');
            return NextResponse.json({ error: 'Unable to create the AI image task. Please try again.' }, { status: 502 });
        }
        return NextResponse.json({
            success: true,
            taskId: signTask(providerTaskId, access.user.id, 'photo'),
            creditsUsed: reservation.used
        });

    } catch (err) {
        console.error('ai-photo POST exception:', err?.message);
        return NextResponse.json({ error: 'Unable to create the AI image task. Please try again.' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const access = await aiAccess(req);
        if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
        const { searchParams } = new URL(req.url);
        const taskId = readTask(searchParams.get('taskId'), access.user.id, 'photo');

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
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
