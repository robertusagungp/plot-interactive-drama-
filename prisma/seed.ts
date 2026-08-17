import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getAll20NewStories } from "./stories-data";
import { SEEDED_COIN_PACKAGES, SEEDED_DIAMOND_PACKAGES } from "../src/lib/services/payments";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting PLOT Database Seeding & Production Upgrade...");

  // 1. Seed / Upsert Currency Packages
  console.log("💎 Seeding Currency Packages (IDR)...");
  const allPackages = [...SEEDED_COIN_PACKAGES, ...SEEDED_DIAMOND_PACKAGES];
  for (let i = 0; i < allPackages.length; i++) {
    const pkg = allPackages[i];
    await prisma.currencyPackage.upsert({
      where: { code: pkg.code },
      update: {
        amount: pkg.amount,
        bonusAmount: pkg.bonusAmount,
        priceIDR: pkg.priceIDR,
        label: pkg.label,
        labelId: pkg.labelId,
        featured: pkg.featured || false,
        sortOrder: i + 1,
      },
      create: {
        id: pkg.id,
        code: pkg.code,
        currencyType: pkg.currencyType,
        amount: pkg.amount,
        bonusAmount: pkg.bonusAmount,
        priceIDR: pkg.priceIDR,
        label: pkg.label,
        labelId: pkg.labelId,
        featured: pkg.featured || false,
        sortOrder: i + 1,
      },
    });
  }

  // 2. Admin and Demo Accounts
  console.log("👤 Seeding Accounts...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const readerPassword = await bcrypt.hash("reader123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@plot.drama" },
    update: { role: "ADMIN" },
    create: {
      name: "Admin Director",
      email: "admin@plot.drama",
      passwordHash: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Studio Admin",
          bio: "PLOT Head of Content & Live Operations",
          level: 99,
          exp: 99999,
        },
      },
      wallet: {
        create: {
          coins: 9999,
          diamonds: 999,
        },
      },
      dailyRewardState: {
        create: {
          streak: 7,
          currentDayIndex: 7,
          totalClaimed: 7,
        },
      },
    },
  });

  const reader = await prisma.user.upsert({
    where: { email: "reader@plot.drama" },
    update: {},
    create: {
      name: "Demo Reader",
      email: "reader@plot.drama",
      passwordHash: readerPassword,
      role: "USER",
      profile: {
        create: {
          displayName: "RomanceAddict",
          bio: "Loving enemies-to-lovers & chaebol romance dramas!",
          level: 3,
          exp: 240,
        },
      },
      wallet: {
        create: {
          coins: 150,
          diamonds: 30,
        },
      },
      dailyRewardState: {
        create: {
          streak: 3,
          currentDayIndex: 4,
          totalClaimed: 3,
        },
      },
    },
  });

  // 3. Genres
  console.log("📚 Seeding Genres...");
  const genresList = [
    { name: "Romance", nameId: "Romantis", slug: "romance", icon: "heart" },
    { name: "Enemies to Lovers", nameId: "Musuh Jadi Cinta", slug: "enemies-to-lovers", icon: "flame" },
    { name: "Drama", nameId: "Drama", slug: "drama", icon: "sparkles" },
    { name: "Celebrity", nameId: "Selebriti & Idol", slug: "celebrity", icon: "award" },
    { name: "Thriller", nameId: "Thriller", slug: "thriller", icon: "shield" },
    { name: "Comedy", nameId: "Komedi", slug: "comedy", icon: "smile" },
    { name: "Mystery", nameId: "Misteri", slug: "mystery", icon: "eye" },
    { name: "Fantasy", nameId: "Fantasi", slug: "fantasy", icon: "zap" },
    { name: "Time Travel", nameId: "Perjalanan Waktu", slug: "time-travel", icon: "clock" },
  ];

  const genreMap: Record<string, string> = {};
  for (const g of genresList) {
    const record = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: { name: g.name, nameId: g.nameId },
      create: g,
    });
    genreMap[g.name] = record.id;
    genreMap[g.slug] = record.id;
  }

  // 4. Update Original Story: "I Married My Enemy" with Indonesian Localization
  console.log("📖 Seeding Story 1 (Flagship): I Married My Enemy...");
  const enemyStory = await prisma.story.upsert({
    where: { slug: "i-married-my-enemy" },
    update: {
      titleId: "Aku Menikahi Musuhku",
      shortDescriptionId: "Demi menyelamatkan kerajaan bisnis keluarganya, Sarah menandatangani kontrak pernikahan dengan Adrian Hartono—musuh bebuyutan yang ia tuduh menghancurkan ayahnya.",
      descriptionId: "Sarah Wijaya, 26 tahun, berjuang keras menyelamatkan Wijaya Holdings setelah skandal keuangan yang dirancang musuhnya menjatuhkan keluarganya. Adrian Hartono, 29 tahun, pewaris dingin dan cemerlang dari Hartono Corp, menawarkan jalan keluar mustahil: pernikahan kontrak satu tahun.",
    },
    create: {
      title: "I Married My Enemy",
      titleId: "Aku Menikahi Musuhku",
      slug: "i-married-my-enemy",
      shortDescription: "To save her crumbling empire, Sarah signs a marriage contract with Adrian Hartono—the arrogant rival she blames for her father's ruin.",
      shortDescriptionId: "Demi menyelamatkan kerajaan bisnis keluarganya, Sarah menandatangani kontrak pernikahan dengan Adrian Hartono—musuh bebuyutan yang ia tuduh menghancurkan ayahnya.",
      description: "Sarah Wijaya, 26, is fighting with every ounce of strength to save Wijaya Holdings after an orchestrated scandal brought her family's shipping empire to its knees. Adrian Hartono, 29, the brilliant, icy heir to Hartono Corp, offers her an impossible lifeline: a one-year marriage of convenience. But in a game where secrets cut deeper than blade edges, who is hunting whom?",
      descriptionId: "Sarah Wijaya, 26 tahun, berjuang keras menyelamatkan Wijaya Holdings setelah skandal keuangan yang dirancang musuhnya menjatuhkan keluarganya. Adrian Hartono, 29 tahun, pewaris dingin dan cemerlang dari Hartono Corp, menawarkan jalan keluar mustahil: pernikahan kontrak satu tahun.",
      coverImage: "/assets/covers/married_enemy_cover.jpg",
      bannerImage: "/assets/covers/married_enemy_banner.jpg",
      author: "PLOT Studio",
      ageRating: "16+",
      status: "PUBLISHED",
      featured: true,
      viewCount: 2450,
      startCount: 1680,
      completionCount: 420,
      publishedAt: new Date(),
    },
  });

  // 5. Seed all 20 NEW interactive visual drama series
  const newStories = getAll20NewStories();
  console.log(`🎬 Seeding ${newStories.length} new complete dramas (15–20 episodes each)...`);

  for (let sIdx = 0; sIdx < newStories.length; sIdx++) {
    const sDef = newStories[sIdx];
    console.log(`[${sIdx + 1}/${newStories.length}] Seeding: ${sDef.title}`);

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
        viewCount: 850 + (sIdx * 45),
        startCount: 520 + (sIdx * 25),
        completionCount: 110 + (sIdx * 8),
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
            text: `Seoul. The tension builds in episode ${ep.number} of ${sDef.title}.`,
            textId: `Seoul. Ketegangan semakin memuncak di episode ${ep.number} dari ${sDef.titleId}.`,
            style: "standard",
          },
          nextNodeId: `ep${ep.number}_d1`,
        },
      ];

      let currentIndex = 2;
      let lastNodeId = `ep${ep.number}_d1`;

      // 3. Dialogue Sequence
      ep.dialogues.forEach((d, dIdx) => {
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

      // 5. Branch A Resolution
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
        nextNodeId: `ep${ep.number}_merge`,
      });

      // 6. Branch B Resolution
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
        },
        nextNodeId: `ep${ep.number}_merge`,
      });

      // 7. Merged Climax Dialogues
      nodesToCreate.push({
        nodeId: `ep${ep.number}_merge`,
        nodeIndex: currentIndex++,
        type: "DIALOGUE",
        config: {
          speaker: ep.climaxDialogues[0]?.speakerEn || "Rival",
          speakerId: ep.climaxDialogues[0]?.speakerId || "Rival",
          characterSlug: ep.climaxDialogues[0]?.charSlug || "rival",
          text: ep.climaxDialogues[0]?.textEn || "This is not over.",
          textId: ep.climaxDialogues[0]?.textId || "Ini belum berakhir.",
          expression: "angry",
          position: "center",
          sfx: ep.climaxDialogues[0]?.sfx || "door_slam",
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
