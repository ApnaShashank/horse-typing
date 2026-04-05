import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'words';
  const count = parseInt(searchParams.get('count') || '50', 10);
  const punctuation = searchParams.get('punctuation') === 'true';
  const numbers = searchParams.get('numbers') === 'true';

  try {
    // 1. Fetch a random WordPool from Supabase using Prisma
    console.log('Fetching word pools from Prisma...');
    const poolCount = await prisma.wordPool.count();
    console.log('Database Pool Count:', poolCount);
    
    if (poolCount === 0) {
      console.warn('No pools found in database, using hardcoded fallback.');
      return NextResponse.json({ 
        words: ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"].slice(0, count) 
      });
    }

    const skip = Math.floor(Math.random() * poolCount);
    const selectedPool = await prisma.wordPool.findFirst({
      skip: skip,
    });

    if (!selectedPool || !selectedPool.words.length) {
       throw new Error("No words found in pool");
    }

    let selectedWords = [...selectedPool.words];

    // 2. Shuffle and pick the requested count
    selectedWords = selectedWords.sort(() => Math.random() - 0.5);
    
    // Ensure we have enough words by repeating if the pool is smaller than count
    let resultWords = [];
    while (resultWords.length < count) {
      resultWords.push(...selectedWords);
    }
    resultWords = resultWords.slice(0, count);

    // 3. Apply random modifications for numbers and punctuation if requested
    if (punctuation) {
      const puncts = [',', '.', '?', '!', ';', '-'];
      resultWords = resultWords.map(w => {
         // 20% chance to add punctuation
         if (Math.random() > 0.8) return w + puncts[Math.floor(Math.random() * puncts.length)];
         // 10% chance to capitalize
         if (Math.random() > 0.9) return w.charAt(0).toUpperCase() + w.slice(1);
         return w;
      });
    }

    if (numbers) {
      resultWords = resultWords.map(w => {
        // 15% chance to replace with a number or append
        const rand = Math.random();
        if (rand > 0.9) return Math.floor(Math.random() * 1000).toString();
        if (rand > 0.85) return w + Math.floor(Math.random() * 10).toString();
        return w;
      });
    }

    return NextResponse.json({ 
      words: resultWords,
      poolName: selectedPool.name,
      category: selectedPool.category
    });

  } catch (e) {
    console.error('API Error:', e);
    // Secure Fallback to keep the app working
    const fallback = ["system", "offline", "data", "connection", "error", "retry", "typing", "precision", "fallback", "engine"];
    return NextResponse.json({ words: fallback.slice(0, count) });
  }
}
