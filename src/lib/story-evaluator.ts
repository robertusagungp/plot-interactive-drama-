import { StoryCondition } from "./types/story";

export function evaluateCondition(
  condition: StoryCondition,
  context: {
    stats: Record<string, number>;
    relationships: Record<string, { love: number; trust: number }>;
    choicesMade: Record<string, string>;
  }
): boolean {
  let actualValue: number | string | boolean | undefined;

  switch (condition.type) {
    case "stat":
      actualValue = context.stats[condition.targetKey] ?? 50;
      break;
    case "relationship_love":
      actualValue = context.relationships[condition.targetKey]?.love ?? 0;
      break;
    case "relationship_trust":
      actualValue = context.relationships[condition.targetKey]?.trust ?? 0;
      break;
    case "choice_made":
      actualValue = context.choicesMade[condition.targetKey];
      break;
    default:
      return true;
  }

  const targetValue = condition.value;

  switch (condition.operator) {
    case "eq":
      return actualValue === targetValue;
    case "neq":
      return actualValue !== targetValue;
    case "gt":
      return typeof actualValue === "number" && typeof targetValue === "number"
        ? actualValue > targetValue
        : false;
    case "gte":
      return typeof actualValue === "number" && typeof targetValue === "number"
        ? actualValue >= targetValue
        : false;
    case "lt":
      return typeof actualValue === "number" && typeof targetValue === "number"
        ? actualValue < targetValue
        : false;
    case "lte":
      return typeof actualValue === "number" && typeof targetValue === "number"
        ? actualValue <= targetValue
        : false;
    default:
      return true;
  }
}

export function evaluateAllConditions(
  conditions: StoryCondition[] | undefined,
  context: {
    stats: Record<string, number>;
    relationships: Record<string, { love: number; trust: number }>;
    choicesMade: Record<string, string>;
  }
): boolean {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((c) => evaluateCondition(c, context));
}
