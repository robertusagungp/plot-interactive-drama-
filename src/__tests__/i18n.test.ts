import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatIDR,
  getLocalizedStoryTitle,
  getLocalizedStoryDescription,
  dictionaries,
} from "../lib/i18n";

test("I18n - IDR Currency Formatter", () => {
  const formatted10k = formatIDR(10000);
  const formatted50k = formatIDR(50000);
  const formatted100k = formatIDR(100000);

  assert.ok(formatted10k.includes("10.000"), "Must format 10000 with dots");
  assert.ok(formatted50k.includes("50.000"), "Must format 50000 with dots");
  assert.ok(formatted100k.includes("100.000"), "Must format 100000 with dots");
});

test("I18n - Translation Dictionary Completeness", () => {
  const idKeys = Object.keys(dictionaries.id);
  const enKeys = Object.keys(dictionaries.en);

  assert.ok(idKeys.length >= 40, "Indonesian dictionary must contain core keys");
  assert.ok(enKeys.length >= 40, "English dictionary must contain core keys");

  // Key parity
  idKeys.forEach((key) => {
    assert.ok(key in dictionaries.en, `Key '${key}' in 'id' must also exist in 'en'`);
  });
});

test("I18n - Story & Episode Localization Resolution", () => {
  const sampleStory = {
    title: "I Woke Up Married to Korea's Coldest Idol",
    titleId: "Aku Bangun dan Ternyata Menikah dengan Idol Paling Dingin di Korea",
    shortDescription: "A stylist wakes up married to an idol.",
    shortDescriptionId: "Seorang stylist terbangun dan menikah dengan idol.",
  };

  // When locale is id
  const titleId = getLocalizedStoryTitle(sampleStory, "id");
  assert.equal(titleId, "Aku Bangun dan Ternyata Menikah dengan Idol Paling Dingin di Korea");

  // When locale is en
  const titleEn = getLocalizedStoryTitle(sampleStory, "en");
  assert.equal(titleEn, "I Woke Up Married to Korea's Coldest Idol");

  // Fallback when titleId is missing
  const fallbackStory = {
    title: "Fallback Title",
    titleId: null,
    shortDescription: "Fallback Description",
    shortDescriptionId: null,
  };
  assert.equal(getLocalizedStoryTitle(fallbackStory, "id"), "Fallback Title");
});
