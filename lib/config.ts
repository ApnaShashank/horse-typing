import prisma from './prisma';

export async function getSystemConfig() {
  try {
    let config = await prisma.systemConfig.findFirst();
    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          freeAiLimit: 3,
          freeLearnLimit: 5,
          freePracticeLimitBeforeLogin: 3,
        },
      });
    }
    return config;
  } catch (error) {
    console.error('Error fetching SystemConfig:', error);
    return {
      freeAiLimit: 3,
      freeLearnLimit: 5,
      freePracticeLimitBeforeLogin: 3,
    };
  }
}
