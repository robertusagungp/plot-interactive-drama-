import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { validateEpisodeGraph } from "@/lib/services/story";
import { StoryNodeData } from "@/lib/types/story";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const episode = await db.episode.findUnique({
      where: { id },
      include: {
        story: true,
        nodes: {
          orderBy: { nodeIndex: "asc" },
        },
      },
    });

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    const parsedNodes: StoryNodeData[] = episode.nodes.map((n) => ({
      id: n.id,
      nodeId: n.nodeId,
      nodeIndex: n.nodeIndex,
      type: n.type as any,
      config: JSON.parse(n.configJson || "{}"),
      nextNodeId: n.nextNodeId,
    }));

    return NextResponse.json({ episode, nodes: parsedNodes });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { title, synopsis, status, unlockType, coinPrice, nodes } = body;

    // Validate story graph
    const validation = validateEpisodeGraph(nodes);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Atomic update of episode metadata & nodes
    await db.$transaction(async (tx) => {
      await tx.episode.update({
        where: { id },
        data: {
          title: title || undefined,
          synopsis: synopsis || undefined,
          status: status || undefined,
          unlockType: unlockType || undefined,
          coinPrice: coinPrice !== undefined ? coinPrice : undefined,
        },
      });

      // Clear existing nodes and reinsert updated ordered nodes
      await tx.storyNode.deleteMany({
        where: { episodeId: id },
      });

      for (let i = 0; i < nodes.length; i++) {
        const n: StoryNodeData = nodes[i];
        await tx.storyNode.create({
          data: {
            episodeId: id,
            nodeId: n.nodeId || `node_${i + 1}`,
            nodeIndex: i,
            type: n.type,
            configJson: JSON.stringify(n.config),
            nextNodeId: n.nextNodeId || null,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update episode" }, { status: 500 });
  }
}
