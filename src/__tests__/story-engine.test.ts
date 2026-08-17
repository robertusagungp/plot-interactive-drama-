import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateCondition, evaluateAllConditions } from "../lib/story-evaluator";
import { validateEpisodeGraph } from "../lib/services/story";
import { StoryNodeData } from "../lib/types/story";

test("Story Condition Evaluator - Stats & Relationships", () => {
  const context = {
    stats: { REPUTATION: 70, REVENGE: 40 },
    relationships: {
      adrian: { love: 85, trust: 60 },
      luca: { love: 30, trust: 20 },
    },
    choicesMade: {
      ep1_ch1: "ep1_opt_refuse",
    },
  };

  // Test stat condition: REPUTATION >= 50 (should pass)
  const cond1 = evaluateCondition(
    { type: "stat", targetKey: "REPUTATION", operator: "gte", value: 50 },
    context
  );
  assert.equal(cond1, true);

  // Test stat condition: REVENGE >= 80 (should fail)
  const cond2 = evaluateCondition(
    { type: "stat", targetKey: "REVENGE", operator: "gte", value: 80 },
    context
  );
  assert.equal(cond2, false);

  // Test relationship love: adrian >= 80 (should pass)
  const cond3 = evaluateCondition(
    { type: "relationship_love", targetKey: "adrian", operator: "gte", value: 80 },
    context
  );
  assert.equal(cond3, true);

  // Test choice made condition
  const cond4 = evaluateCondition(
    { type: "choice_made", targetKey: "ep1_ch1", operator: "eq", value: "ep1_opt_refuse" },
    context
  );
  assert.equal(cond4, true);

  // Test multiple conditions evaluation
  const allPass = evaluateAllConditions(
    [
      { type: "stat", targetKey: "REPUTATION", operator: "gte", value: 50 },
      { type: "relationship_love", targetKey: "adrian", operator: "gte", value: 70 },
    ],
    context
  );
  assert.equal(allPass, true);
});

test("Episode Graph Validator - Detects Broken References", () => {
  // Valid linear graph
  const validNodes: StoryNodeData[] = [
    {
      id: "1",
      nodeId: "node_1",
      nodeIndex: 0,
      type: "DIALOGUE",
      config: { speaker: "Sarah", text: "Hello" },
      nextNodeId: "node_2",
    },
    {
      id: "2",
      nodeId: "node_2",
      nodeIndex: 1,
      type: "CHOICE",
      config: {
        prompt: "Choose",
        options: [
          { id: "opt1", text: "A", nextNodeId: "node_3" },
          { id: "opt2", text: "B", nextNodeId: "node_3" },
        ],
      },
    },
    {
      id: "3",
      nodeId: "node_3",
      nodeIndex: 2,
      type: "END_EPISODE",
      config: { episodeNumber: 1 },
    },
  ];

  const validResult = validateEpisodeGraph(validNodes);
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.errors.length, 0);

  // Invalid graph with missing destination
  const brokenNodes: StoryNodeData[] = [
    {
      id: "1",
      nodeId: "node_1",
      nodeIndex: 0,
      type: "DIALOGUE",
      config: { speaker: "Sarah", text: "Hello" },
      nextNodeId: "node_missing_404",
    },
  ];

  const brokenResult = validateEpisodeGraph(brokenNodes);
  assert.equal(brokenResult.isValid, false);
  assert.ok(brokenResult.errors.length > 0);
});
