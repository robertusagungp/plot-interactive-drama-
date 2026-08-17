import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { EpisodeEditor } from "@/components/admin/EpisodeEditor";
import { StoryNodeData } from "@/lib/types/story";

export default async function AdminEpisodeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    await requireAdmin();
  } catch {
    return <div className="p-8 text-center text-white">Admin access required</div>;
  }

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

  if (!episode) notFound();

  const parsedNodes: StoryNodeData[] = episode.nodes.map((n) => ({
    id: n.id,
    nodeId: n.nodeId,
    nodeIndex: n.nodeIndex,
    type: n.type as any,
    config: JSON.parse(n.configJson || "{}"),
    nextNodeId: n.nextNodeId,
  }));

  return (
    <EpisodeEditor
      episodeId={episode.id}
      storyId={episode.story.id}
      storySlug={episode.story.slug}
      storyTitle={episode.story.title}
      initialEpisode={{
        id: episode.id,
        number: episode.number,
        title: episode.title,
        synopsis: episode.synopsis,
        status: episode.status,
        unlockType: episode.unlockType,
        coinPrice: episode.coinPrice,
      }}
      initialNodes={parsedNodes}
    />
  );
}
