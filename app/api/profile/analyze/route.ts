import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user profile data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        userStat: true,
        testResults: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
        mistakes: {
          orderBy: { count: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const stats = user.userStat;
    const history = user.testResults || [];
    const mistakes = user.mistakes || [];

    if (!stats || history.length === 0) {
      return NextResponse.json({
        summary: "Practice more tests to generate detailed AI diagnostics. Take a few tests first!",
        strengths: [],
        weaknesses: [],
        tips: ["Complete at least 1-2 tests in practice mode."],
        lessons: [1],
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key is not configured.' }, { status: 500 });
    }

    const recentTestsText = history
      .map(
        (h) =>
          `WPM: ${h.wpm}, Acc: ${h.accuracy}%, Mode: ${h.mode}, Duration: ${h.duration}s, Mistakes: ${h.mistakes}`
      )
      .join('\n');

    const mistakesText = mistakes
      .map((m) => `Key: "${m.keyPressed}" (Miss count: ${m.count})`)
      .join('\n');

    const prompt = `
You are a highly experienced professional typing coach. Analyze this user's typing metrics and mistakes to provide personalized diagnostic feedback.

### User Overall Statistics:
- Average WPM: ${stats.avgWpm}
- Best WPM: ${stats.bestWpm}
- Average Accuracy: ${stats.avgAccuracy}%
- Total Tests Taken: ${stats.totalTests}

### Recent Test History (Last 30 sessions):
${recentTestsText || 'No history recorded yet.'}

### Weakest Keys (Frequently Missed):
${mistakesText || 'No recorded errors.'}

Based on these details, output a strictly valid JSON object representing a detailed typing analysis. Your JSON must follow this exact structure without any markdown formatting wrappers or extra text.

JSON Structure:
{
  "summary": "A friendly, expert coaching paragraph summarizing their current performance level, strengths, and areas needing focus.",
  "strengths": [
    "1-2 bullet points highlighting their strong areas (e.g. speed consistency, high accuracy under pressure, etc.)"
  ],
  "weaknesses": [
    "1-2 bullet points explaining specific key patterns or fingers they are struggling with based on their weak keys (e.g. stretching left pinky for z/x/c keys, number row reach, etc.)"
  ],
  "tips": [
    "2-3 highly actionable, concrete mechanical training tips to improve their speed and decrease errors."
  ],
  "lessons": [
    An array of up to 4 suggested lesson ID integers (ranging from 1 to 56) from our curriculum that target their weak keys.
    Use these guidelines to match key ranges to lesson IDs:
    - Home row keys (a, s, d, f, g, h, j, k, l, ';'): lessons 1 to 10
    - Top row keys (q, w, e, r, t, y, u, i, o, p, '[', ']'): lessons 11 to 20
    - Top/Home combos: lessons 21 to 24
    - Bottom row keys (z, x, c, v, b, n, m, ',', '.', '/'): lessons 25 to 34
    - 3-row combos: lessons 35 to 39
    - Number keys (1 to 0): lessons 40 to 43
    - Symbol keys (!, @, #, $, %, etc.): lessons 44 to 56
  ]
}
`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://horsetyping.vercel.app',
        'X-Title': 'Horse Typing AI Coach',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a strict JSON-only responder. Always output valid JSON objects.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter error details:', errorText);
      throw new Error(`OpenRouter API failed: ${openRouterResponse.statusText}`);
    }

    const data = await openRouterResponse.json();
    const assistantMessage = data?.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('Empty response from AI helper.');
    }

    // Parse completion content
    const parsedData = JSON.parse(assistantMessage.trim());
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Diagnostic error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze typing data.',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
