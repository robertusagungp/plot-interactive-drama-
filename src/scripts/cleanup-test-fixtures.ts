import { db } from "../lib/db";

async function cleanup() {
  const result = await db.episode.deleteMany({
    where: { number: { gte: 100 } },
  });
  console.log(`Cleaned up ${result.count} test episode fixtures.`);
}

cleanup()
  .catch(console.error)
  .finally(() => db.$disconnect());
