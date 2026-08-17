import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_ACHIEVEMENTS } from "../src/lib/services/achievements";

const prisma = new PrismaClient();

async function main() {
  console.log("🎬 Starting PLOT database seed...");

  // 1. Clear existing data in correct relation order
  await prisma.analyticsEvent.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.dailyRewardState.deleteMany();
  await prisma.episodeUnlock.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.userChoice.deleteMany();
  await prisma.userRelationship.deleteMany();
  await prisma.userStoryStat.deleteMany();
  await prisma.userEpisodeProgress.deleteMany();
  await prisma.userStoryProgress.deleteMany();
  await prisma.storyNode.deleteMany();
  await prisma.ending.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.characterAsset.deleteMany();
  await prisma.character.deleteMany();
  await prisma.storyStatDefinition.deleteMany();
  await prisma.storyTag.deleteMany();
  await prisma.storyGenre.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.story.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.asset.deleteMany();

  // 2. Create Users (Admin & Demo Reader)
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const readerPasswordHash = await bcrypt.hash("reader123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Director",
      email: "admin@plot.drama",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Plot Executive",
          bio: "Lead creator and producer at PLOT Studios.",
          level: 10,
          exp: 5000,
          streak: 14,
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
          streak: 5,
          currentDayIndex: 6,
          totalClaimed: 12,
        },
      },
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Sarah Explorer",
      email: "reader@plot.drama",
      passwordHash: readerPasswordHash,
      role: "USER",
      profile: {
        create: {
          displayName: "DramaLover99",
          bio: "Addicted to enemies-to-lovers plot twists.",
          level: 2,
          exp: 250,
          streak: 3,
        },
      },
      wallet: {
        create: {
          coins: 150, // Seed enough coins to test unlock flow immediately
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

  console.log("👤 Created Admin (admin@plot.drama) & Demo User (reader@plot.drama)");

  // 3. Seed Achievements
  for (const ach of DEFAULT_ACHIEVEMENTS) {
    await prisma.achievement.create({
      data: ach,
    });
  }

  // 4. Create Genres
  const genresData = [
    { name: "Romance", slug: "romance", icon: "heart" },
    { name: "Enemies to Lovers", slug: "enemies-to-lovers", icon: "zap" },
    { name: "Corporate Drama", slug: "corporate-drama", icon: "briefcase" },
    { name: "Thriller", slug: "thriller", icon: "flame" },
    { name: "Mystery", slug: "mystery", icon: "eye" },
  ];

  const createdGenres = await Promise.all(
    genresData.map((g) => prisma.genre.create({ data: g }))
  );

  // 5. Create Flagship Story: "I Married My Enemy"
  const story = await prisma.story.create({
    data: {
      title: "I Married My Enemy",
      slug: "i-married-my-enemy",
      shortDescription:
        "To save her crumbling empire, Sarah signs a marriage contract with Adrian Hartono—the arrogant rival she blames for her father's ruin.",
      description:
        "Sarah Wijaya, 26, is fighting with every ounce of strength to save Wijaya Holdings after an orchestrated scandal brought her family's shipping empire to its knees. Adrian Hartono, 29, the brilliant, icy heir to Hartono Corp, offers her an impossible lifeline: a one-year marriage of convenience. But in a game where secrets cut deeper than blade edges, who is hunting whom?",
      author: "PLOT Studio",
      ageRating: "16+",
      status: "PUBLISHED",
      featured: true,
      viewCount: 2450,
      startCount: 1680,
      completionCount: 420,
      coverImage: "/assets/covers/married_enemy_cover.jpg",
      bannerImage: "/assets/covers/married_enemy_banner.jpg",
      publishedAt: new Date(),
      genres: {
        create: [
          { genreId: createdGenres[0].id },
          { genreId: createdGenres[1].id },
          { genreId: createdGenres[2].id },
        ],
      },
      tags: {
        create: [
          { tag: "Contract Marriage" },
          { tag: "Billionaire" },
          { tag: "Revenge" },
          { tag: "Power Couple" },
          { tag: "Multiple Endings" },
        ],
      },
    },
  });

  // 6. Create Story Stats
  await prisma.storyStatDefinition.createMany({
    data: [
      {
        storyId: story.id,
        key: "REPUTATION",
        label: "Corporate Reputation",
        description: "Your standing and influence among the elite business circles.",
        defaultValue: 50,
        minVal: 0,
        maxVal: 100,
        icon: "shield",
      },
      {
        storyId: story.id,
        key: "REVENGE",
        label: "Revenge Drive",
        description: "How determined you are to destroy those who orchestrated your downfall.",
        defaultValue: 50,
        minVal: 0,
        maxVal: 100,
        icon: "flame",
      },
    ],
  });

  // 7. Create Characters
  const charactersData = [
    {
      name: "Sarah Wijaya",
      slug: "sarah",
      role: "PROTAGONIST",
      biography:
        "26. Fierce, brilliant, and protective of her legacy. Refuses to bow to the sharks circling her company.",
      avatarUrl: "/assets/characters/sarah_avatar.png",
      defaultLove: 0,
      defaultTrust: 0,
      relationshipEnabled: false,
    },
    {
      name: "Adrian Hartono",
      slug: "adrian",
      role: "MAIN_LOVE_INTEREST",
      biography:
        "29. Cold, calculated heir of Hartono Corp. Behind his ruthless facade lies a fiercely guarded secret.",
      avatarUrl: "/assets/characters/adrian_avatar.png",
      defaultLove: 10,
      defaultTrust: 15,
      relationshipEnabled: true,
    },
    {
      name: "Luca",
      slug: "luca",
      role: "LOVE_INTEREST",
      biography:
        "27. Sarah's charming childhood confidant and senior financial advisor with motives hidden behind a warm smile.",
      avatarUrl: "/assets/characters/luca_avatar.png",
      defaultLove: 25,
      defaultTrust: 60,
      relationshipEnabled: true,
    },
    {
      name: "Vanessa",
      slug: "vanessa",
      role: "ANTAGONIST",
      biography:
        "28. Adrian's glamorous ex-fiancée and heiress to the maritime syndicate. Sharp, poised, and lethal.",
      avatarUrl: "/assets/characters/vanessa_avatar.png",
      defaultLove: 0,
      defaultTrust: 10,
      relationshipEnabled: false,
    },
  ];

  for (const c of charactersData) {
    await prisma.character.create({
      data: {
        storyId: story.id,
        ...c,
      },
    });
  }

  // 8. Create Endings
  await prisma.ending.createMany({
    data: [
      {
        storyId: story.id,
        slug: "true-love",
        title: "Heart's Surrender",
        description: "You and Adrian tore down your walls, uncovering the real mastermind and building an unshakeable empire of love.",
        badgeTitle: "TRUE LOVE ENDING",
        endingType: "TRUE_LOVE",
        conditionJson: JSON.stringify({ love_adrian: 75, trust_adrian: 65 }),
      },
      {
        storyId: story.id,
        slug: "independent",
        title: "Queen of the Board",
        description: "You outplayed every rival, reclaimed Wijaya Holdings on your own terms, and stood alone at the summit.",
        badgeTitle: "INDEPENDENT ENDING",
        endingType: "INDEPENDENT",
        conditionJson: JSON.stringify({ reputation: 75 }),
      },
      {
        storyId: story.id,
        slug: "revenge",
        title: "Ashes of Hartono",
        description: "You executed a ruthless counter-strike, bringing Hartono Corp to its knees at the cost of your heart.",
        badgeTitle: "REVENGE ENDING",
        endingType: "REVENGE",
        conditionJson: JSON.stringify({ revenge: 75 }),
      },
      {
        storyId: story.id,
        slug: "secret",
        title: "The Silent Partner",
        description: "You forged a clandestine alliance with Luca and outmaneuvered the board in the shadows.",
        badgeTitle: "SECRET ENDING",
        endingType: "SECRET",
        conditionJson: JSON.stringify({ trust_luca: 80 }),
      },
    ],
  });

  // 9. Helper to generate Episode Node Blocks
  const episodesConfig = [
    {
      number: 1,
      title: "The Proposal",
      synopsis: "Sarah confronts Adrian at midnight. He proposes the unthinkable.",
      unlockType: "FREE",
      coinPrice: 0,
      nodes: [
        {
          nodeId: "ep1_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "penthouse", musicTrack: "tense", transition: "fade" },
          nextNodeId: "ep1_n1",
        },
        {
          nodeId: "ep1_n1",
          type: "NARRATION",
          config: {
            text: "Midnight in Jakarta. Rain hammers against the glass walls of Hartono Tower.",
            style: "standard",
          },
          nextNodeId: "ep1_d1",
        },
        {
          nodeId: "ep1_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "You leaked those forged audits, Adrian. You engineered my father's heart attack!",
            expression: "angry",
            position: "left",
            characterAnimation: "enter-left",
            sfx: "door_slam",
          },
          nextNodeId: "ep1_d2",
        },
        {
          nodeId: "ep1_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "If I wanted to destroy Wijaya Holdings, Sarah, I wouldn't need forged audits. I'd simply buy your debt.",
            expression: "smirk",
            position: "right",
            characterAnimation: "enter-right",
          },
          nextNodeId: "ep1_d3",
        },
        {
          nodeId: "ep1_d3",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Sign a one-year marriage contract with me. Tomorrow morning, fifty million dollars will clear your loans.",
            expression: "normal",
            position: "right",
          },
          nextNodeId: "ep1_ch1",
        },
        {
          nodeId: "ep1_ch1",
          type: "CHOICE",
          config: {
            prompt: "How do you respond to Adrian's outrageous proposal?",
            options: [
              {
                id: "ep1_opt_refuse",
                text: "Throw the contract in his face with pride",
                nextNodeId: "ep1_b1_refuse",
                effects: [
                  { type: "stat", targetKey: "REVENGE", amount: 10 },
                  { type: "relationship_love", targetKey: "adrian", amount: 5 },
                ],
              },
              {
                id: "ep1_opt_cold",
                text: "Demand full joint ownership before signing",
                nextNodeId: "ep1_b1_negotiate",
                effects: [
                  { type: "stat", targetKey: "REPUTATION", amount: 10 },
                  { type: "relationship_trust", targetKey: "adrian", amount: 10 },
                ],
              },
            ],
          },
        },
        {
          nodeId: "ep1_b1_refuse",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Fierce as ever. But pride won't pay the creditors at your gates on Monday.",
            expression: "smirk",
            position: "right",
          },
          nextNodeId: "ep1_merge1",
        },
        {
          nodeId: "ep1_b1_negotiate",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "A true shark. I expected nothing less. Joint custody of the port terminals it is.",
            expression: "happy",
            position: "right",
          },
          nextNodeId: "ep1_merge1",
        },
        {
          nodeId: "ep1_merge1",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "One year, Adrian. No physical intimacy, no interference with my board.",
            expression: "determined",
            position: "left",
          },
          nextNodeId: "ep1_d4",
        },
        {
          nodeId: "ep1_d4",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Agreed. Welcome to the family, wife.",
            expression: "smirk",
            position: "right",
          },
          nextNodeId: "ep1_end",
        },
        {
          nodeId: "ep1_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 1,
            teaserText: "Episode 2: The hostile board meets its new masters—and sparks fly.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 2,
      title: "Terms and Conditions",
      synopsis: "The board convenes. Sarah and Adrian face the media vultures together.",
      unlockType: "FREE",
      coinPrice: 0,
      nodes: [
        {
          nodeId: "ep2_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "boardroom", musicTrack: "dramatic" },
          nextNodeId: "ep2_n1",
        },
        {
          nodeId: "ep2_n1",
          type: "NARRATION",
          config: { text: "Flashbulbs explode as reporters swarm the lobby of Wijaya Holdings." },
          nextNodeId: "ep2_d1",
        },
        {
          nodeId: "ep2_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Luca",
            characterSlug: "luca",
            text: "Sarah! Tell me this marriage announcement is a prank. You're handing the keys of our kingdom to a wolf!",
            expression: "shocked",
            position: "left",
            characterAnimation: "enter-left",
          },
          nextNodeId: "ep2_d2",
        },
        {
          nodeId: "ep2_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "It's survival, Luca. Adrian is holding the debt notes.",
            expression: "sad",
            position: "center",
          },
          nextNodeId: "ep2_ch1",
        },
        {
          nodeId: "ep2_ch1",
          type: "CHOICE",
          config: {
            prompt: "What will you confide in Luca?",
            options: [
              {
                id: "ep2_opt_luca_trust",
                text: "Promise Luca that you're playing Adrian to find the truth",
                nextNodeId: "ep2_b_luca",
                effects: [
                  { type: "relationship_trust", targetKey: "luca", amount: 15 },
                  { type: "stat", targetKey: "REVENGE", amount: 5 },
                ],
              },
              {
                id: "ep2_opt_adrian_shield",
                text: "Warn Luca to stay out of it for his own safety",
                nextNodeId: "ep2_b_shield",
                effects: [
                  { type: "relationship_love", targetKey: "adrian", amount: 5 },
                  { type: "stat", targetKey: "REPUTATION", amount: 5 },
                ],
              },
            ],
          },
        },
        {
          nodeId: "ep2_b_luca",
          type: "DIALOGUE",
          config: {
            speaker: "Luca",
            characterSlug: "luca",
            text: "I'll be watching your back, Sarah. Always.",
            expression: "happy",
            position: "left",
          },
          nextNodeId: "ep2_merge1",
        },
        {
          nodeId: "ep2_b_shield",
          type: "DIALOGUE",
          config: {
            speaker: "Luca",
            characterSlug: "luca",
            text: "You've changed since he showed up. Don't forget who stood by you first.",
            expression: "sad",
            position: "left",
          },
          nextNodeId: "ep2_merge1",
        },
        {
          nodeId: "ep2_merge1",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Interviews are starting, darling. Shall we show high society our unified front?",
            expression: "smirk",
            position: "right",
            characterAnimation: "enter-right",
          },
          nextNodeId: "ep2_end",
        },
        {
          nodeId: "ep2_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 2,
            teaserText: "Episode 3: The Charity Gala—a single dance changes everything.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 3,
      title: "The Engagement",
      synopsis: "The Grand Charity Gala. Adrian pulls Sarah onto the ballroom floor.",
      unlockType: "FREE",
      coinPrice: 0,
      nodes: [
        {
          nodeId: "ep3_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "ballroom", musicTrack: "romantic" },
          nextNodeId: "ep3_n1",
        },
        {
          nodeId: "ep3_n1",
          type: "NARRATION",
          config: {
            text: "Crystal chandeliers shower the ballroom in golden light as the waltz begins.",
            style: "standard",
          },
          nextNodeId: "ep3_d1",
        },
        {
          nodeId: "ep3_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "You're breathtaking tonight, Sarah. The whole room is watching.",
            expression: "happy",
            position: "center",
          },
          nextNodeId: "ep3_ch1",
        },
        {
          nodeId: "ep3_ch1",
          type: "CHOICE",
          config: {
            prompt: "Adrian places his hand on your waist for the waltz...",
            options: [
              {
                id: "ep3_opt_waltz_close",
                text: "💎 Lean into his touch and whisper a seductive provocation",
                isPremium: true,
                diamondCost: 5,
                nextNodeId: "ep3_b_close",
                effects: [
                  { type: "relationship_love", targetKey: "adrian", amount: 20 },
                  { type: "relationship_trust", targetKey: "adrian", amount: 10 },
                ],
              },
              {
                id: "ep3_opt_waltz_formal",
                text: "Maintain a sharp, guarded distance",
                nextNodeId: "ep3_b_cold",
                effects: [{ type: "stat", targetKey: "REPUTATION", amount: 5 }],
              },
            ],
          },
        },
        {
          nodeId: "ep3_b_close",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Careful, Sarah... You play with fire, you might end up liking the burn.",
            expression: "embarrassed",
            position: "center",
            sfx: "heartbeat",
          },
          nextNodeId: "ep3_merge1",
        },
        {
          nodeId: "ep3_b_cold",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Always with the armor on. One day I'll find the chink.",
            expression: "normal",
            position: "center",
          },
          nextNodeId: "ep3_merge1",
        },
        {
          nodeId: "ep3_merge1",
          type: "DIALOGUE",
          config: {
            speaker: "Vanessa",
            characterSlug: "vanessa",
            text: "Adrian! What an adorable theatrical performance.",
            expression: "smirk",
            position: "right",
            characterAnimation: "enter-right",
          },
          nextNodeId: "ep3_end",
        },
        {
          nodeId: "ep3_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 3,
            teaserText: "Episode 4: Vanessa strikes back with a venomous ultimatum.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 4,
      title: "The Ex-Fiancée",
      synopsis: "Vanessa corners Sarah with dangerous corporate intelligence.",
      unlockType: "COIN_LOCKED",
      coinPrice: 10,
      nodes: [
        {
          nodeId: "ep4_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "ballroom", musicTrack: "tense" },
          nextNodeId: "ep4_d1",
        },
        {
          nodeId: "ep4_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Vanessa",
            characterSlug: "vanessa",
            text: "Do you really think Adrian chose you out of chivalry, darling? He needs your family's offshore dock permits to seal his overseas merger.",
            expression: "smirk",
            position: "right",
          },
          nextNodeId: "ep4_ch1",
        },
        {
          nodeId: "ep4_ch1",
          type: "CHOICE",
          config: {
            prompt: "How do you handle Vanessa's calculated insult?",
            options: [
              {
                id: "ep4_opt_put_down",
                text: "Remind Vanessa that Adrian chose you, not his ex",
                nextNodeId: "ep4_b_burn",
                effects: [
                  { type: "stat", targetKey: "REPUTATION", amount: 15 },
                  { type: "relationship_love", targetKey: "adrian", amount: 10 },
                ],
              },
              {
                id: "ep4_opt_inquire",
                text: "Secretly probe her about the dock permits",
                nextNodeId: "ep4_b_probe",
                effects: [{ type: "stat", targetKey: "REVENGE", amount: 10 }],
              },
            ],
          },
        },
        {
          nodeId: "ep4_b_burn",
          type: "DIALOGUE",
          config: {
            speaker: "Vanessa",
            characterSlug: "vanessa",
            text: "Enjoy your golden cage while it lasts, Wijaya.",
            expression: "angry",
            position: "right",
          },
          nextNodeId: "ep4_end",
        },
        {
          nodeId: "ep4_b_probe",
          type: "DIALOGUE",
          config: {
            speaker: "Vanessa",
            characterSlug: "vanessa",
            text: "Check Adrian's private safe at the mountain villa if you dare.",
            expression: "smirk",
            position: "right",
          },
          nextNodeId: "ep4_end",
        },
        {
          nodeId: "ep4_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 4,
            teaserText: "Episode 5: A dusty photograph reveals a buried 20-year conspiracy.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 5,
      title: "The Photograph",
      synopsis: "Sarah uncovers an old photograph tying their fathers' past together.",
      unlockType: "COIN_LOCKED",
      coinPrice: 10,
      nodes: [
        {
          nodeId: "ep5_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "office", musicTrack: "mystery" },
          nextNodeId: "ep5_d1",
        },
        {
          nodeId: "ep5_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "This photo... Adrian's father and my father, standing together at the Singapore harbor in 2004.",
            expression: "shocked",
            position: "center",
          },
          nextNodeId: "ep5_d2",
        },
        {
          nodeId: "ep5_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "They were partners before the betrayal, Sarah. My father didn't kill yours—they were both framed.",
            expression: "sad",
            position: "right",
            characterAnimation: "enter-right",
          },
          nextNodeId: "ep5_ch1",
        },
        {
          nodeId: "ep5_ch1",
          type: "CHOICE",
          config: {
            prompt: "Adrian looks genuinely pained. Do you believe him?",
            options: [
              {
                id: "ep5_opt_trust",
                text: "Offer him your trust and look into his eyes",
                nextNodeId: "ep5_b_trust",
                effects: [{ type: "relationship_trust", targetKey: "adrian", amount: 20 }],
              },
              {
                id: "ep5_opt_doubt",
                text: "Suspect another layer of deception",
                nextNodeId: "ep5_b_doubt",
                effects: [{ type: "stat", targetKey: "REVENGE", amount: 15 }],
              },
            ],
          },
        },
        {
          nodeId: "ep5_b_trust",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Thank you for listening. Let me show you the rest at my private estate.",
            expression: "happy",
            position: "right",
          },
          nextNodeId: "ep5_end",
        },
        {
          nodeId: "ep5_b_doubt",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "I suppose I have to earn every single shred of your faith.",
            expression: "normal",
            position: "right",
          },
          nextNodeId: "ep5_end",
        },
        {
          nodeId: "ep5_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 5,
            teaserText: "Episode 6: A mountain storm traps Sarah and Adrian in a secluded cabin.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 6,
      title: "One Bed",
      synopsis: "Stranded during a torrential thunderstorm. There is only one master suite.",
      unlockType: "COIN_LOCKED",
      coinPrice: 10,
      nodes: [
        {
          nodeId: "ep6_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "bedroom", musicTrack: "romantic" },
          nextNodeId: "ep6_d1",
        },
        {
          nodeId: "ep6_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "The bridge is washed out... and the generator only powers the master suite.",
            expression: "embarrassed",
            position: "left",
          },
          nextNodeId: "ep6_d2",
        },
        {
          nodeId: "ep6_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "I can take the floor, Sarah. Unless you get cold.",
            expression: "smirk",
            position: "right",
          },
          nextNodeId: "ep6_ch1",
        },
        {
          nodeId: "ep6_ch1",
          type: "CHOICE",
          config: {
            prompt: "Rain lashes the window panes. Adrian stands before you in a loosened shirt...",
            options: [
              {
                id: "ep6_opt_bed_kiss",
                text: "💎 Pull him onto the bed and kiss him passionately",
                isPremium: true,
                diamondCost: 8,
                nextNodeId: "ep6_b_passion",
                effects: [
                  { type: "relationship_love", targetKey: "adrian", amount: 30 },
                  { type: "relationship_trust", targetKey: "adrian", amount: 15 },
                ],
              },
              {
                id: "ep6_opt_bed_talk",
                text: "Sit beside him and talk until dawn about your pasts",
                nextNodeId: "ep6_b_talk",
                effects: [
                  { type: "relationship_trust", targetKey: "adrian", amount: 20 },
                  { type: "relationship_love", targetKey: "adrian", amount: 10 },
                ],
              },
            ],
          },
        },
        {
          nodeId: "ep6_b_passion",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Sarah... I've waited months for this.",
            expression: "happy",
            position: "center",
            sfx: "heartbeat",
          },
          nextNodeId: "ep6_end",
        },
        {
          nodeId: "ep6_b_talk",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "You're the only person who sees through all this corporate theater.",
            expression: "happy",
            position: "center",
          },
          nextNodeId: "ep6_end",
        },
        {
          nodeId: "ep6_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 6,
            teaserText: "Episode 7: An anonymous whistleblower leaks the contract marriage!",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 7,
      title: "The Betrayal",
      synopsis: "The contract marriage leaks to the stock exchange. Suspicion erupts.",
      unlockType: "COIN_LOCKED",
      coinPrice: 15,
      nodes: [
        {
          nodeId: "ep7_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "boardroom", musicTrack: "tense" },
          nextNodeId: "ep7_d1",
        },
        {
          nodeId: "ep7_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Luca",
            characterSlug: "luca",
            text: "The shares are crashing! Sarah, Adrian sold you out to the media!",
            expression: "angry",
            position: "left",
          },
          nextNodeId: "ep7_d2",
        },
        {
          nodeId: "ep7_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "Wait... the IP address from the press release came from inside our own advisory office.",
            expression: "shocked",
            position: "center",
          },
          nextNodeId: "ep7_ch1",
        },
        {
          nodeId: "ep7_ch1",
          type: "CHOICE",
          config: {
            prompt: "Who do you confront with the evidence?",
            options: [
              {
                id: "ep7_opt_confront_luca",
                text: "Demand Luca explain why his private server sent the leak",
                nextNodeId: "ep7_b_luca",
                effects: [
                  { type: "relationship_trust", targetKey: "luca", amount: -30 },
                  { type: "stat", targetKey: "REPUTATION", amount: 15 },
                ],
              },
              {
                id: "ep7_opt_confront_adrian",
                text: "Accuse Adrian of orchestrating the entire setup",
                nextNodeId: "ep7_b_adrian",
                effects: [
                  { type: "relationship_trust", targetKey: "adrian", amount: -20 },
                  { type: "stat", targetKey: "REVENGE", amount: 20 },
                ],
              },
            ],
          },
        },
        {
          nodeId: "ep7_b_luca",
          type: "DIALOGUE",
          config: {
            speaker: "Luca",
            characterSlug: "luca",
            text: "I did it to save you from him, Sarah! You're falling in love with your father's executioner!",
            expression: "angry",
            position: "left",
          },
          nextNodeId: "ep7_end",
        },
        {
          nodeId: "ep7_b_adrian",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "If you still believe I would sabotage what we built... then you don't know me at all.",
            expression: "sad",
            position: "right",
          },
          nextNodeId: "ep7_end",
        },
        {
          nodeId: "ep7_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 7,
            teaserText: "Episode 8: Rain on the docks—Adrian's greatest sacrifice comes to light.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 8,
      title: "What Adrian Knew",
      synopsis: "Adrian steps into the line of fire to shield Sarah from a hostile takeover.",
      unlockType: "COIN_LOCKED",
      coinPrice: 15,
      nodes: [
        {
          nodeId: "ep8_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "rain_street", musicTrack: "dramatic" },
          nextNodeId: "ep8_d1",
        },
        {
          nodeId: "ep8_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "I transferred fifty-one percent of Hartono Corp's voting rights to your name this morning.",
            expression: "determined",
            position: "right",
          },
          nextNodeId: "ep8_d2",
        },
        {
          nodeId: "ep8_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "What?! Why would you risk everything you own for me?",
            expression: "shocked",
            position: "left",
          },
          nextNodeId: "ep8_ch1",
        },
        {
          nodeId: "ep8_ch1",
          type: "CHOICE",
          config: {
            prompt: "Adrian stands in the pouring rain, his eyes locked on yours...",
            options: [
              {
                id: "ep8_opt_embrace",
                text: "Throw your arms around him in the rain",
                nextNodeId: "ep8_b_embrace",
                effects: [
                  { type: "relationship_love", targetKey: "adrian", amount: 25 },
                  { type: "relationship_trust", targetKey: "adrian", amount: 25 },
                ],
              },
              {
                id: "ep8_opt_strategic",
                text: "Accept the shares as a business commander",
                nextNodeId: "ep8_b_corp",
                effects: [
                  { type: "stat", targetKey: "REPUTATION", amount: 20 },
                  { type: "relationship_trust", targetKey: "adrian", amount: 15 },
                ],
              },
            ],
          },
        },
        {
          nodeId: "ep8_b_embrace",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Because without you, none of this empire matters to me anymore.",
            expression: "happy",
            position: "center",
            sfx: "heartbeat",
          },
          nextNodeId: "ep8_end",
        },
        {
          nodeId: "ep8_b_corp",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "Together, we are untouchable. Let's finish them tomorrow.",
            expression: "determined",
            position: "center",
          },
          nextNodeId: "ep8_end",
        },
        {
          nodeId: "ep8_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 8,
            teaserText: "Episode 9: The final shareholder showdown begins.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 9,
      title: "The Choice",
      synopsis: "The board vote begins. Vanessa and Luca make their final play.",
      unlockType: "COIN_LOCKED",
      coinPrice: 15,
      nodes: [
        {
          nodeId: "ep9_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "boardroom", musicTrack: "tense" },
          nextNodeId: "ep9_d1",
        },
        {
          nodeId: "ep9_d1",
          type: "DIALOGUE",
          config: {
            speaker: "Vanessa",
            characterSlug: "vanessa",
            text: "Ladies and gentlemen of the board, vote to dissolve Wijaya Holdings now!",
            expression: "angry",
            position: "right",
          },
          nextNodeId: "ep9_d2",
        },
        {
          nodeId: "ep9_d2",
          type: "DIALOGUE",
          config: {
            speaker: "Sarah Wijaya",
            characterSlug: "sarah",
            text: "Not while I hold the majority proxy of both dynasties.",
            expression: "determined",
            position: "left",
          },
          nextNodeId: "ep9_ch1",
        },
        {
          nodeId: "ep9_ch1",
          type: "CHOICE",
          config: {
            prompt: "What will you declare to the assembled board?",
            options: [
              {
                id: "ep9_opt_unite",
                text: "💎 Announce an authentic merger built on real love and trust",
                isPremium: true,
                diamondCost: 10,
                nextNodeId: "ep9_b_love",
                effects: [
                  { type: "relationship_love", targetKey: "adrian", amount: 30 },
                  { type: "relationship_trust", targetKey: "adrian", amount: 30 },
                  { type: "stat", targetKey: "REPUTATION", amount: 20 },
                ],
              },
              {
                id: "ep9_opt_dominate",
                text: "Announce complete hostile takeover of Hartono Corp",
                nextNodeId: "ep9_b_revenge",
                effects: [
                  { type: "stat", targetKey: "REVENGE", amount: 30 },
                  { type: "stat", targetKey: "REPUTATION", amount: 20 },
                ],
              },
            ],
          },
        },
        {
          nodeId: "ep9_b_love",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "To Sarah Wijaya-Hartono: the woman who owns my empire and my soul.",
            expression: "happy",
            position: "center",
          },
          nextNodeId: "ep9_end",
        },
        {
          nodeId: "ep9_b_revenge",
          type: "DIALOGUE",
          config: {
            speaker: "Adrian Hartono",
            characterSlug: "adrian",
            text: "So it was all revenge from the start. You played me brilliantly.",
            expression: "sad",
            position: "right",
          },
          nextNodeId: "ep9_end",
        },
        {
          nodeId: "ep9_end",
          type: "END_EPISODE",
          config: {
            episodeNumber: 9,
            teaserText: "Episode 10: The Grand Finale! Your choices decide your ultimate destiny.",
            rewardCoins: 10,
            rewardDiamonds: 2,
          },
        },
      ],
    },
    {
      number: 10,
      title: "The Truth & Final Destiny",
      synopsis: "The climax. Unravel the final conspiracy and unlock your story ending.",
      unlockType: "COIN_LOCKED",
      coinPrice: 20,
      nodes: [
        {
          nodeId: "ep10_sc1",
          type: "SCENE_CHANGE",
          config: { backgroundSlug: "penthouse", musicTrack: "triumphant" },
          nextNodeId: "ep10_n1",
        },
        {
          nodeId: "ep10_n1",
          type: "NARRATION",
          config: {
            text: "One year later. The sun rises over the gleaming skyline of the Wijaya-Hartono towers.",
            style: "standard",
          },
          nextNodeId: "ep10_jump",
        },
        {
          nodeId: "ep10_jump",
          type: "JUMP",
          config: {
            conditions: [
              { type: "relationship_love", targetKey: "adrian", operator: "gte", value: 65 },
              { type: "relationship_trust", targetKey: "adrian", operator: "gte", value: 50 },
            ],
            targetNodeId: "ep10_ending_truelove",
            fallbackNodeId: "ep10_check_revenge",
          },
        },
        {
          nodeId: "ep10_check_revenge",
          type: "JUMP",
          config: {
            conditions: [{ type: "stat", targetKey: "REVENGE", operator: "gte", value: 60 }],
            targetNodeId: "ep10_ending_revenge",
            fallbackNodeId: "ep10_ending_independent",
          },
        },
        // ENDING 1: TRUE LOVE
        {
          nodeId: "ep10_ending_truelove",
          type: "ENDING",
          config: {
            endingSlug: "true-love",
            endingTitle: "Heart's Surrender",
            endingType: "TRUE_LOVE",
            badgeTitle: "TRUE LOVE ENDING",
            summary:
              "You and Adrian tore down every wall between your families. Together, you turned a cold contract into an empire of authentic love and unshakeable trust.",
          },
        },
        // ENDING 2: REVENGE
        {
          nodeId: "ep10_ending_revenge",
          type: "ENDING",
          config: {
            endingSlug: "revenge",
            endingTitle: "Ashes of Hartono",
            endingType: "REVENGE",
            badgeTitle: "REVENGE ENDING",
            summary:
              "You conquered your enemies and exacted cold retribution for your family. You stand triumphant over the fallen titans, ruling alone in absolute power.",
          },
        },
        // ENDING 3: INDEPENDENT
        {
          nodeId: "ep10_ending_independent",
          type: "ENDING",
          config: {
            endingSlug: "independent",
            endingTitle: "Queen of the Board",
            endingType: "INDEPENDENT",
            badgeTitle: "INDEPENDENT ENDING",
            summary:
              "You outplayed every competitor on your own terms. Neither dependent on Adrian nor blinded by hatred, you built Wijaya Holdings into a global powerhouse.",
          },
        },
      ],
    },
  ];

  // Insert all 10 episodes and their StoryNodes
  for (const ep of episodesConfig) {
    const createdEp = await prisma.episode.create({
      data: {
        storyId: story.id,
        number: ep.number,
        title: ep.title,
        synopsis: ep.synopsis,
        status: "PUBLISHED",
        unlockType: ep.unlockType,
        coinPrice: ep.coinPrice,
        publishedAt: new Date(),
      },
    });

    for (let i = 0; i < ep.nodes.length; i++) {
      const node = ep.nodes[i];
      await prisma.storyNode.create({
        data: {
          episodeId: createdEp.id,
          nodeId: node.nodeId,
          nodeIndex: i,
          type: node.type,
          configJson: JSON.stringify(node.config),
          nextNodeId: (node as any).nextNodeId || null,
        },
      });
    }
  }

  console.log("📚 Seeded 10 dramatic episodes with choices and branching for 'I Married My Enemy'!");
  console.log("✨ PLOT Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
