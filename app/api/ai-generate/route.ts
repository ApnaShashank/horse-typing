import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getSystemConfig } from '@/lib/config';

export async function GET() {
  try {
    const recents = await prisma.aIGeneration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
    });
    return NextResponse.json({ success: true, recents });
  } catch (error: any) {
    console.error('Error fetching recents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent generations.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isPro: true, aiPracticeCount: true }
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 404 }
      );
    }

    if (!dbUser.isPro) {
      const config = await getSystemConfig();
      if (dbUser.aiPracticeCount >= config.freeAiLimit) {
        return NextResponse.json(
          { success: false, error: `You have reached your limit of ${config.freeAiLimit} free AI generations. Please upgrade to Pro.` },
          { status: 403 }
        );
      }
    }

    const { prompt, category } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required and must be a string.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenRouter API key is not configured.' },
        { status: 500 }
      );
    }

    const selectedCategory = category || 'general';

    // System instruction based on the chosen category (code vs paragraph)
    let systemPrompt = 
      'You are an assistant that generates custom typing practice text. ' +
      'Generate ONLY the text to be typed. Do NOT write any conversational intro, explanation, or markdown fences (like ```). ' +
      'Start directly with the generated text. Keep it between 250 to 550 characters.';

    if (selectedCategory === 'code') {
      systemPrompt = 
        'You are an assistant that generates realistic programming code snippets for typing practice. ' +
        'Generate ONLY the code snippet. Do NOT include markdown fences (like ```python or ```). ' +
        'Use clean indentation (preferably 2 spaces) and write realistic code (like a small algorithm, utility function, or class). ' +
        'Start directly with the code. Keep it between 200 to 500 characters and around 5 to 15 lines.';
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://horsetyping.vercel.app',
        'X-Title': 'Horse Typing AI Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate typing practice text for: ${prompt}` },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter generation error:', errText);
      throw new Error(`OpenRouter API failed: ${response.statusText}`);
    }

    const data = await response.json();
    let generatedContent = data?.choices?.[0]?.message?.content || '';

    // Trim markdown backticks if any slipped through
    generatedContent = generatedContent.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim();

    if (!generatedContent) {
      throw new Error('AI returned an empty content.');
    }

    // Save to global history in database
    const saved = await prisma.aIGeneration.create({
      data: {
        prompt,
        content: generatedContent,
        category: selectedCategory,
      },
    });

    // Increment user's AI practice count
    await prisma.user.update({
      where: { id: session.userId },
      data: { aiPracticeCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, generation: saved });
  } catch (error: any) {
    console.error('Generation handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate practice paragraph.', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
