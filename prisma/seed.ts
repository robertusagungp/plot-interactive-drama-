import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getAll20NewStories } from "./stories-data";

const prisma = new PrismaClient();

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 1.5);
    }
    throw err;
  }
}

async function seedSingleDrama(sDef: any, sIdx: number, total: number, genreMap: Record<string, string>) {
  return withRetry(async () => {
    console.log(`⏳ [${sIdx + 1}/${total}] Memproses: ${sDef.title}`);

    const story = await prisma.story.upsert({
      where: { slug: sDef.slug },
      update: {
        title: sDef.title,
        titleId: sDef.titleId,
        shortDescription: sDef.shortDescription,
        shortDescriptionId: sDef.shortDescriptionId,
        description: sDef.description,
        descriptionId: sDef.descriptionId,
        featured: sDef.featured || false,
      },
    create: {
      title: sDef.title,
      titleId: sDef.titleId,
      slug: sDef.slug,
      shortDescription: sDef.shortDescription,
      shortDescriptionId: sDef.shortDescriptionId,
      description: sDef.description,
      descriptionId: sDef.descriptionId,
      coverImage: `/assets/covers/${sDef.slug}.jpg`,
      bannerImage: `/assets/covers/${sDef.slug}_banner.jpg`,
      author: sDef.author,
      ageRating: sDef.ageRating,
      status: "PUBLISHED",
      featured: sDef.featured || false,
      viewCount: 850 + sIdx * 45,
      startCount: 520 + sIdx * 25,
      completionCount: 110 + sIdx * 8,
      publishedAt: new Date(),
    },
  });

  // Link Genres
  for (const gName of sDef.genres) {
    const gId = genreMap[gName] || genreMap["Romance"];
    if (gId) {
      await prisma.storyGenre.upsert({
        where: {
          storyId_genreId: { storyId: story.id, genreId: gId },
        },
        update: {},
        create: { storyId: story.id, genreId: gId },
      });
    }
  }

  // Seed Characters
  for (const c of sDef.characters) {
    await prisma.character.upsert({
      where: { id: `${story.id}_${c.slug}` },
      update: {
        name: c.name,
        nameId: c.nameId,
        biography: c.biography,
        biographyId: c.biographyId,
      },
      create: {
        id: `${story.id}_${c.slug}`,
        storyId: story.id,
        name: c.name,
        nameId: c.nameId,
        slug: c.slug,
        role: c.role,
        biography: c.biography,
        biographyId: c.biographyId,
        relationshipEnabled: c.relationshipEnabled,
        defaultLove: c.defaultLove,
        defaultTrust: c.defaultTrust,
      },
    });
  }

  // Seed Stat Definitions
  for (const stat of sDef.statDefinitions) {
    await prisma.storyStatDefinition.upsert({
      where: {
        storyId_key: { storyId: story.id, key: stat.key },
      },
      update: { label: stat.label, labelId: stat.labelId },
      create: {
        storyId: story.id,
        key: stat.key,
        label: stat.label,
        labelId: stat.labelId,
        description: stat.description,
        defaultValue: stat.defaultValue,
      },
    });
  }

  // Seed Endings
  for (const ending of sDef.endings) {
    await prisma.ending.upsert({
      where: {
        storyId_slug: { storyId: story.id, slug: ending.slug },
      },
      update: {
        title: ending.title,
        titleId: ending.titleId,
        description: ending.description,
        descriptionId: ending.descriptionId,
        badgeTitle: ending.badgeTitle,
        badgeTitleId: ending.badgeTitleId,
      },
      create: {
        storyId: story.id,
        slug: ending.slug,
        title: ending.title,
        titleId: ending.titleId,
        description: ending.description,
        descriptionId: ending.descriptionId,
        badgeTitle: ending.badgeTitle,
        badgeTitleId: ending.badgeTitleId,
        endingType: ending.endingType,
      },
    });
  }

  // Seed 16 Episodes with rich playable nodes
  for (const ep of sDef.episodeArcs) {
    const coinPrice = ep.number <= 3 ? 0 : ep.number <= 7 ? 10 : ep.number <= 12 ? 15 : ep.number <= 15 ? 20 : 25;
    const unlockType = ep.number <= 3 ? "FREE" : "COIN_LOCKED";

    const episode = await prisma.episode.upsert({
      where: {
        storyId_number: { storyId: story.id, number: ep.number },
      },
      update: {
        title: ep.title,
        titleId: ep.titleId,
        synopsis: ep.synopsis,
        synopsisId: ep.synopsisId,
        coverImage: ep.coverImage,
        unlockType,
        coinPrice,
      },
      create: {
        storyId: story.id,
        number: ep.number,
        title: ep.title,
        titleId: ep.titleId,
        synopsis: ep.synopsis,
        synopsisId: ep.synopsisId,
        coverImage: ep.coverImage,
        unlockType,
        coinPrice,
        diamondPrice: 0,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    // Construct Node Sequence for this Episode
    const nodesToCreate: Array<{
      nodeId: string;
      nodeIndex: number;
      type: string;
      config: any;
      nextNodeId: string | null;
    }> = [
      // 1. Scene Change
      {
        nodeId: `ep${ep.number}_sc1`,
        nodeIndex: 0,
        type: "SCENE_CHANGE",
        config: {
          backgroundSlug: ep.bgSlug,
          backgroundUrl: ep.coverImage,
          musicTrack: ep.bgMusic,
          transition: "fade",
        },
        nextNodeId: `ep${ep.number}_n1`,
      },
      // 2. Narration Hook
      {
        nodeId: `ep${ep.number}_n1`,
        nodeIndex: 1,
        type: "NARRATION",
        config: {
          text: `${ep.title}. ${ep.synopsis}`,
          textId: `${ep.titleId}. ${ep.synopsisId}`,
          style: "standard",
        },
        nextNodeId: `ep${ep.number}_d1`,
      },
    ];

    let currentIndex = 2;

    // 3. Dialogue Sequence
    ep.dialogues.forEach((d: any, dIdx: number) => {
      const dNodeId = `ep${ep.number}_d${dIdx + 1}`;
      const nextDId = dIdx < ep.dialogues.length - 1 ? `ep${ep.number}_d${dIdx + 2}` : `ep${ep.number}_ch1`;

      nodesToCreate.push({
        nodeId: dNodeId,
        nodeIndex: currentIndex++,
        type: "DIALOGUE",
        config: {
          speaker: d.speakerEn,
          speakerId: d.speakerId,
          characterSlug: d.charSlug || "lead",
          text: d.textEn,
          textId: d.textId,
          expression: d.expr || "normal",
          position: d.pos || "right",
          activity: d.activity,
          activityTextId: d.activityTextId,
          activityTextEn: d.activityTextEn,
          reactionFx: d.reactionFx || "none",
          sfx: d.sfx,
        },
        nextNodeId: nextDId,
      });
    });

    // 4. Branching Choice
    nodesToCreate.push({
      nodeId: `ep${ep.number}_ch1`,
      nodeIndex: currentIndex++,
      type: "CHOICE",
      config: {
        prompt: ep.choicePromptEn,
        promptId: ep.choicePromptId,
        options: [
          {
            id: `ep${ep.number}_opt_a`,
            text: ep.choiceA.textEn,
            textId: ep.choiceA.textId,
            nextNodeId: `ep${ep.number}_branch_a`,
            effects: [
              ...(ep.choiceA.statKey ? [{ type: "stat", targetKey: ep.choiceA.statKey, amount: ep.choiceA.statAmount || 10 }] : []),
              ...(ep.choiceA.relChar ? [{ type: `relationship_${ep.choiceA.relType || "love"}`, targetKey: ep.choiceA.relChar, amount: ep.choiceA.relAmount || 10 }] : []),
            ],
          },
          {
            id: `ep${ep.number}_opt_b`,
            text: ep.choiceB.textEn,
            textId: ep.choiceB.textId,
            nextNodeId: `ep${ep.number}_branch_b`,
            diamondCost: ep.choiceB.diamondCost || 0,
            coinCost: ep.choiceB.coinCost || 0,
            isPremium: (ep.choiceB.diamondCost || 0) > 0,
            effects: [
              ...(ep.choiceB.statKey ? [{ type: "stat", targetKey: ep.choiceB.statKey, amount: ep.choiceB.statAmount || 15 }] : []),
              ...(ep.choiceB.relChar ? [{ type: `relationship_${ep.choiceB.relType || "love"}`, targetKey: ep.choiceB.relChar, amount: ep.choiceB.relAmount || 20 }] : []),
            ],
          },
        ],
      },
      nextNodeId: null,
    });

    // 5. Branch A Resolution (2 Turns)
    nodesToCreate.push({
      nodeId: `ep${ep.number}_branch_a`,
      nodeIndex: currentIndex++,
      type: "DIALOGUE",
      config: {
        speaker: ep.dialogues[0]?.speakerEn || "Lead",
        speakerId: ep.dialogues[0]?.speakerId || "Lead",
        characterSlug: ep.dialogues[0]?.charSlug || "lead",
        text: ep.choiceA.replyEn,
        textId: ep.choiceA.replyId,
        expression: "normal",
        position: "right",
      },
      nextNodeId: `ep${ep.number}_branch_a2`,
    });

    nodesToCreate.push({
      nodeId: `ep${ep.number}_branch_a2`,
      nodeIndex: currentIndex++,
      type: "NARRATION",
      config: {
        text: ep.choiceA.reply2En || "You stand firm together, ready for whatever happens next.",
        textId: ep.choiceA.reply2Id || "Kalian berdiri berdampingan dengan penuh keyakinan menghadapi apa pun yang terjadi.",
        style: "standard",
      },
      nextNodeId: `ep${ep.number}_climax_1`,
    });

    // 6. Branch B Resolution (2 Turns)
    nodesToCreate.push({
      nodeId: `ep${ep.number}_branch_b`,
      nodeIndex: currentIndex++,
      type: "DIALOGUE",
      config: {
        speaker: ep.dialogues[0]?.speakerEn || "Lead",
        speakerId: ep.dialogues[0]?.speakerId || "Lead",
        characterSlug: ep.dialogues[0]?.charSlug || "lead",
        text: ep.choiceB.replyEn,
        textId: ep.choiceB.replyId,
        expression: "happy",
        position: "right",
        sfx: "heartbeat",
      },
      nextNodeId: `ep${ep.number}_branch_b2`,
    });

    nodesToCreate.push({
      nodeId: `ep${ep.number}_branch_b2`,
      nodeIndex: currentIndex++,
      type: "NARRATION",
      config: {
        text: ep.choiceB.reply2En || "A breathless romantic spark ignites between you both.",
        textId: ep.choiceB.reply2Id || "Percikan cinta yang mendebarkan menyala di antara kalian berdua.",
        style: "internal_thought",
      },
      nextNodeId: `ep${ep.number}_climax_1`,
    });

    // 7. Climax Dialogues
    nodesToCreate.push({
      nodeId: `ep${ep.number}_climax_1`,
      nodeIndex: currentIndex++,
      type: "DIALOGUE",
      config: {
        speaker: ep.climaxDialogues[0]?.speakerEn || "Rival",
        speakerId: ep.climaxDialogues[0]?.speakerId || "Rival",
        characterSlug: ep.climaxDialogues[0]?.charSlug || "rival",
        text: ep.climaxDialogues[0]?.textEn || "This is not over!",
        textId: ep.climaxDialogues[0]?.textId || "Ini belum berakhir!",
        expression: "angry",
        position: "center",
        activity: ep.climaxDialogues[0]?.activity || "confrontation",
        activityTextId: ep.climaxDialogues[0]?.activityTextId || "Membanting dokumen & menuntut kejelasan",
        activityTextEn: ep.climaxDialogues[0]?.activityTextEn || "Slamming dossier in intense confrontation",
        reactionFx: ep.climaxDialogues[0]?.reactionFx || "sparks",
        sfx: ep.climaxDialogues[0]?.sfx || "door_slam",
      },
      nextNodeId: `ep${ep.number}_climax_2`,
    });

    nodesToCreate.push({
      nodeId: `ep${ep.number}_climax_2`,
      nodeIndex: currentIndex++,
      type: "DIALOGUE",
      config: {
        speaker: ep.climaxDialogues[1]?.speakerEn || ep.dialogues[0]?.speakerEn || "Lead",
        speakerId: ep.climaxDialogues[1]?.speakerId || ep.dialogues[0]?.speakerId || "Lead",
        characterSlug: ep.climaxDialogues[1]?.charSlug || ep.dialogues[0]?.charSlug || "lead",
        text: ep.climaxDialogues[1]?.textEn || "You need to step back now.",
        textId: ep.climaxDialogues[1]?.textId || "Mending kamu mundur sekarang.",
        expression: "determined",
        position: "right",
        activity: ep.climaxDialogues[1]?.activity || "guarding",
        activityTextId: ep.climaxDialogues[1]?.activityTextId || "Melangkah maju & pasang badan melindungi",
        activityTextEn: ep.climaxDialogues[1]?.activityTextEn || "Stepping forward to shield and protect",
        reactionFx: ep.climaxDialogues[1]?.reactionFx || "sparks",
        sfx: ep.climaxDialogues[1]?.sfx || "stat_up",
      },
      nextNodeId: `ep${ep.number}_end`,
    });

    // 8. Ending Node or End Episode Node
    if (ep.number === 16) {
      nodesToCreate.push({
        nodeId: `ep${ep.number}_end`,
        nodeIndex: currentIndex++,
        type: "ENDING",
        config: {
          endingSlug: "true-love",
          endingTitle: sDef.endings[0]?.title || "Everlasting Love",
          endingTitleId: sDef.endings[0]?.titleId || "Cinta Abadi",
          endingType: "TRUE_LOVE",
          summary: sDef.endings[0]?.description || "Your destiny is complete.",
          summaryId: sDef.endings[0]?.descriptionId || "Takdir cintamu telah terwujud sempurna.",
          badgeTitle: sDef.endings[0]?.badgeTitle || "TRUE LOVE ENDING",
          badgeTitleId: sDef.endings[0]?.badgeTitleId || "TRUE LOVE ENDING",
        },
        nextNodeId: null,
      });
    } else {
      nodesToCreate.push({
        nodeId: `ep${ep.number}_end`,
        nodeIndex: currentIndex++,
        type: "END_EPISODE",
        config: {
          episodeNumber: ep.number,
          nextEpisodeNumber: ep.number + 1,
          teaserText: ep.cliffhangerEn,
          teaserTextId: ep.cliffhangerId,
          rewardCoins: 10,
          rewardDiamonds: 2,
        },
        nextNodeId: null,
      });
    }

    // Fast bulk batch insertion for high-speed cloud database seeding
    await prisma.storyNode.deleteMany({ where: { episodeId: episode.id } });
    await prisma.storyNode.createMany({
      data: nodesToCreate.map((node) => ({
        episodeId: episode.id,
        nodeId: node.nodeId,
        nodeIndex: node.nodeIndex,
        type: node.type,
        configJson: JSON.stringify(node.config),
        nextNodeId: node.nextNodeId,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`✅ [${sIdx + 1}/${total}] Selesai: ${sDef.title}`);
});
}

async function main() {
  console.log("🌱 Starting PLOT Database Seeding & Production Upgrade...");

  // 1. Seed IDR Currency Packages
  console.log("💎 Seeding Currency Packages (IDR)...");
  const currencyPackages = [
    { code: "C1", currencyType: "COINS", amount: 100, bonusAmount: 0, priceIDR: 10000, label: null, labelId: null, featured: false, sortOrder: 1 },
    { code: "C2", currencyType: "COINS", amount: 300, bonusAmount: 0, priceIDR: 25000, label: "BEST STARTER", labelId: "BEST STARTER", featured: false, sortOrder: 2 },
    { code: "C3", currencyType: "COINS", amount: 700, bonusAmount: 0, priceIDR: 50000, label: "POPULAR", labelId: "POPULER", featured: true, sortOrder: 3 },
    { code: "C4", currencyType: "COINS", amount: 1500, bonusAmount: 0, priceIDR: 100000, label: "BEST VALUE", labelId: "PALING HEMAT", featured: false, sortOrder: 4 },
    { code: "D1", currencyType: "DIAMONDS", amount: 50, bonusAmount: 0, priceIDR: 10000, label: null, labelId: null, featured: false, sortOrder: 5 },
    { code: "D2", currencyType: "DIAMONDS", amount: 150, bonusAmount: 0, priceIDR: 25000, label: null, labelId: null, featured: false, sortOrder: 6 },
    { code: "D3", currencyType: "DIAMONDS", amount: 350, bonusAmount: 0, priceIDR: 50000, label: "POPULAR", labelId: "POPULER", featured: true, sortOrder: 7 },
    { code: "D4", currencyType: "DIAMONDS", amount: 800, bonusAmount: 0, priceIDR: 100000, label: "BEST VALUE", labelId: "PALING HEMAT", featured: false, sortOrder: 8 },
  ];

  for (const pkg of currencyPackages) {
    await prisma.currencyPackage.upsert({
      where: { code: pkg.code },
      update: pkg,
      create: pkg,
    });
  }

  // 2. Seed Accounts
  console.log("👤 Seeding Accounts...");
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const readerPasswordHash = await bcrypt.hash("reader123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@plot.drama" },
    update: { role: "ADMIN" },
    create: {
      name: "PLOT Executive Admin",
      email: "admin@plot.drama",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "PLOT Director",
          bio: "Platform Administrator and Executive Story Producer.",
          avatarUrl: "/assets/placeholders/avatar-admin.png",
          level: 50,
          exp: 99999,
          preferredLocale: "id",
        },
      },
      wallet: {
        create: {
          coins: 99999,
          diamonds: 9999,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "reader@plot.drama" },
    update: {},
    create: {
      name: "Sarah Wijaya",
      email: "reader@plot.drama",
      passwordHash: readerPasswordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "Sarah W.",
          bio: "Drama lover & romance novel enthusiast.",
          avatarUrl: "/assets/placeholders/avatar-sarah.png",
          level: 3,
          exp: 350,
          preferredLocale: "id",
        },
      },
      wallet: {
        create: {
          coins: 150,
          diamonds: 30,
        },
      },
    },
  });

  // 3. Seed Genres
  console.log("📚 Seeding Genres...");
  const genres = [
    { name: "Romance", nameId: "Romansa", slug: "romance", icon: "heart" },
    { name: "Drama", nameId: "Drama", slug: "drama", icon: "sparkles" },
    { name: "Revenge", nameId: "Balas Dendam", slug: "revenge", icon: "flame" },
    { name: "Celebrity", nameId: "Selebriti", slug: "celebrity", icon: "star" },
    { name: "Thriller", nameId: "Misteri & Suspense", slug: "thriller", icon: "shield" },
    { name: "Comedy", nameId: "Komedi", slug: "comedy", icon: "smile" },
    { name: "Fantasy", nameId: "Fantasi", slug: "fantasy", icon: "moon" },
    { name: "Enemies to Lovers", nameId: "Benci Jadi Cinta", slug: "enemies-to-lovers", icon: "zap" },
    { name: "Time Travel", nameId: "Lintas Waktu", slug: "time-travel", icon: "clock" },
    { name: "Music", nameId: "Musik", slug: "music", icon: "music" },
  ];

  const genreMap: Record<string, string> = {};
  for (const g of genres) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: { nameId: g.nameId },
      create: g,
    });
    genreMap[g.name] = genre.id;
  }

  // 4. Seed all 20 NEW interactive visual drama series in parallel batches
  const newStories = getAll20NewStories();
  console.log(`🎬 Seeding ${newStories.length} new complete dramas (16 episodes each)...`);

  // Process in chunks of 2 concurrent stories with brief delay for rock-solid cloud DB throughput
  const CHUNK_SIZE = 2;
  for (let i = 0; i < newStories.length; i += CHUNK_SIZE) {
    const chunk = newStories.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map((sDef, idx) => seedSingleDrama(sDef, i + idx, newStories.length, genreMap))
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("✅ Seeding completed successfully! 21 stories & 330+ episodes ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
