import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, duration, wordCount, wpm, accuracy, mistakes, rawSpeed, weakKeys } = await request.json();

    // In a production environment, transactions should be used to guarantee atomicity and speed.
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Save the actual test result
      const newTest = await tx.testResult.create({
        data: {
          userId: session.userId,
          mode,
          duration,
          wordCount,
          wpm,
          accuracy,
          mistakes,
          rawSpeed
        }
      });

      // 2. Fetch the current stats to update them mathematically
      const stats = await tx.userStat.findUnique({ where: { userId: session.userId } });
      
      if (stats) {
        const totalTests = stats.totalTests + 1;
        const totalTimeSpent = stats.totalTimeSpent + duration;
        
        // Simple moving average calculation is close enough
        const newAvgWpm = ((stats.avgWpm * stats.totalTests) + wpm) / totalTests;
        const newAvgAcc = ((stats.avgAccuracy * stats.totalTests) + accuracy) / totalTests;
        const bestWpm = Math.max(stats.bestWpm, wpm);

        await tx.userStat.update({
          where: { userId: session.userId },
          data: {
            totalTests,
            totalTimeSpent,
            avgWpm: newAvgWpm,
            avgAccuracy: newAvgAcc,
            bestWpm
          }
        });
      }

      // 3. Update the global leaderboard if 15s/30s/60s time mode or standard words to keep it competitive
      if ((mode === 'time' && (duration === 15 || duration === 30 || duration === 60)) || 
          (mode === 'words' && (wordCount === 25 || wordCount === 50))) {
         const leaderboardMode = `${mode} ${mode === 'time' ? duration : wordCount}`;
         
         const existingLeaderboard = await tx.leaderboard.findFirst({
            where: {
               userId: session.userId,
               mode: leaderboardMode
            }
         });

         if (existingLeaderboard) {
            if (wpm > existingLeaderboard.wpm) {
               await tx.leaderboard.update({
                  where: { id: existingLeaderboard.id },
                  data: {
                     wpm,
                     accuracy,
                     createdAt: new Date()
                  }
               });
            }
         } else {
            await tx.leaderboard.create({
               data: {
                  userId: session.userId,
                  mode: leaderboardMode,
                  wpm,
                  accuracy
               }
            });
         }
      }

      // 4. Log specific mistakes to the DB for user's personal training weak points
      if (weakKeys && typeof weakKeys === 'object') {
        for (const [key, count] of Object.entries(weakKeys)) {
           // Prisma doesn't natively do pure basic mathematically upsert without checking,
           // but we can use upsert nicely
           const typedCount = count as number;
           if (typedCount > 0) {
              await tx.mistake.upsert({
                where: {
                  userId_keyPressed: {
                    userId: session.userId,
                    keyPressed: key
                  }
                },
                update: {
                  count: { increment: typedCount }
                },
                create: {
                  userId: session.userId,
                  keyPressed: key,
                  count: typedCount
                }
              });
           }
        }
      }

      return newTest;
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
