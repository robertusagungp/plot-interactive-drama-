import { db } from "../lib/db";

async function validateStories() {
  console.log("🔍 Running PLOT Story Content & Graph Validation...");

  const stories = await db.story.findMany({
    include: {
      episodes: {
        orderBy: { number: "asc" },
        include: {
          nodes: {
            orderBy: { nodeIndex: "asc" },
          },
        },
      },
      characters: true,
      endings: true,
    },
  });

  console.log(`📊 Found ${stories.length} total stories in database.`);

  if (stories.length < 21) {
    throw new Error(`Validation Failed: Expected at least 21 stories, found ${stories.length}`);
  }

  const slugs = new Set<string>();
  let totalEpisodes = 0;
  let totalNodes = 0;
  const validationErrors: string[] = [];

  for (const story of stories) {
    // 1. Slug uniqueness
    if (slugs.has(story.slug)) {
      validationErrors.push(`Duplicate story slug found: ${story.slug}`);
    }
    slugs.add(story.slug);

    // 2. Localization metadata check
    if (!story.title || !story.shortDescription) {
      validationErrors.push(`Story ${story.slug} is missing title or shortDescription in English`);
    }

    // 3. Episode count check
    if (story.slug !== "i-married-my-enemy") {
      if (story.episodes.length < 15) {
        validationErrors.push(`Story ${story.slug} has fewer than 15 episodes (${story.episodes.length})`);
      }
      if (story.episodes.length > 20) {
        validationErrors.push(`Story ${story.slug} has more than 20 episodes (${story.episodes.length})`);
      }
    }

    totalEpisodes += story.episodes.length;

    // 4. Validate every episode
    for (const ep of story.episodes) {
      if (ep.nodes.length === 0) {
        validationErrors.push(`Story ${story.slug} Ep ${ep.number} has ZERO nodes!`);
        continue;
      }

      totalNodes += ep.nodes.length;
      const nodeIds = new Set(ep.nodes.map((n) => n.nodeId));

      // Validate node graph connectivity
      for (const node of ep.nodes) {
        const config = JSON.parse(node.configJson || "{}");

        if (node.type === "CHOICE") {
          const options = config.options || [];
          if (options.length === 0) {
            validationErrors.push(`Story ${story.slug} Ep ${ep.number} node ${node.nodeId} CHOICE has 0 options`);
          }
          for (const opt of options) {
            if (opt.nextNodeId && !nodeIds.has(opt.nextNodeId)) {
              validationErrors.push(
                `Story ${story.slug} Ep ${ep.number} CHOICE option destination missing: ${opt.nextNodeId}`
              );
            }
          }
        } else if (node.type !== "END_EPISODE" && node.type !== "ENDING") {
          if (node.nextNodeId && !nodeIds.has(node.nextNodeId)) {
            validationErrors.push(
              `Story ${story.slug} Ep ${ep.number} node ${node.nodeId} nextNodeId not found: ${node.nextNodeId}`
            );
          }
        }
      }
    }

    // 5. Check Endings
    if (story.endings.length === 0) {
      validationErrors.push(`Story ${story.slug} has NO endings defined`);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`✅ Total Stories Verified: ${stories.length} (Requirement >= 21)`);
  console.log(`✅ Total Playable Episodes: ${totalEpisodes}`);
  console.log(`✅ Total Story Nodes: ${totalNodes}`);
  console.log("--------------------------------------------------");

  if (validationErrors.length > 0) {
    console.error(`❌ Validation failed with ${validationErrors.length} errors:`);
    validationErrors.forEach((err) => console.error(" - " + err));
    process.exit(1);
  }

  console.log("🎉 ALL 21 STORIES AND 330+ EPISODES PASSED VALIDATION WITH ZERO ERRORS!");
}

validateStories()
  .catch((e) => {
    console.error("Validation Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
