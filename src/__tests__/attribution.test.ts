import test from "node:test";
import assert from "node:assert/strict";
import { extractAttributionFromParams } from "../lib/analytics/attribution";

test("Attribution - Extract UTM parameters correctly", () => {
  const params = {
    utm_source: "tiktok",
    utm_medium: "paid",
    utm_campaign: "amm_acq_01",
    utm_content: "amm_choice_contract_01",
    utm_term: "kdrama",
  };

  const attribution = extractAttributionFromParams(params, "/play/i-married-my-enemy", "https://tiktok.com");
  assert.ok(attribution);
  assert.equal(attribution.source, "tiktok");
  assert.equal(attribution.medium, "paid");
  assert.equal(attribution.campaign, "amm_acq_01");
  assert.equal(attribution.content, "amm_choice_contract_01");
  assert.equal(attribution.term, "kdrama");
  assert.equal(attribution.landingPath, "/play/i-married-my-enemy");
});

test("Attribution - Handles organic TikTok referrer without query params", () => {
  const params = {};
  const attribution = extractAttributionFromParams(params, "/play/i-married-my-enemy", "https://www.tiktok.com/@plot_drama");
  assert.ok(attribution);
  assert.equal(attribution.source, "tiktok");
  assert.equal(attribution.medium, "organic");
});

test("Attribution - Returns null when no campaign or referrer present", () => {
  const attribution = extractAttributionFromParams({}, "/", "");
  assert.equal(attribution, null);
});
