// @flow
import i18n from '@kitman/common/src/utils/i18n';

// Helper for Units we might expect to encounter:
// TIME: seconds, minutes, days, hours, weeks, months, years
// DISTANCE IMPERIAL: inches, feet, yards, miles
// DISTANCE METRIC: cm, m, km (and their long forms)
// WEIGHT: lbs, kg (and their long forms)

/**
 * Defines the structure for a unit's translations.
 * A unit has a `long` form (e.g., "seconds") and an optional `short` form (e.g., "s").
 */
type UnitTranslation = {
  long: {
    singular: string,
    plural: string,
  },
  short?: {
    singular: string,
    plural: string,
  },
};

/**
 * A dictionary of canonical unit definitions.
 * This object is defined once at the module level for performance.
 * Each key is the canonical, singular name of the unit.
 */
const UNITS_DICTIONARY: { [key: string]: UnitTranslation } = {
  // TIME
  second: {
    long: { singular: i18n.t('second'), plural: i18n.t('seconds') },
    short: { singular: i18n.t('sec'), plural: i18n.t('secs') },
  },
  minute: {
    long: { singular: i18n.t('minute'), plural: i18n.t('minutes') },
    short: { singular: i18n.t('min'), plural: i18n.t('mins') },
  },
  hour: {
    long: { singular: i18n.t('hour'), plural: i18n.t('hours') },
    short: { singular: i18n.t('hr'), plural: i18n.t('hrs') }, // Added short form for consistency
  },
  day: {
    long: { singular: i18n.t('day'), plural: i18n.t('days') },
  },
  week: {
    long: { singular: i18n.t('week'), plural: i18n.t('weeks') },
  },
  month: {
    long: { singular: i18n.t('month'), plural: i18n.t('months') },
  },
  year: {
    long: { singular: i18n.t('year'), plural: i18n.t('years') },
  },

  // DISTANCE IMPERIAL
  inch: {
    long: { singular: i18n.t('inch'), plural: i18n.t('inches') },
  },
  foot: {
    long: { singular: i18n.t('foot'), plural: i18n.t('feet') },
    short: { singular: 'ft', plural: 'ft' },
  },
  yard: {
    long: { singular: i18n.t('yard'), plural: i18n.t('yards') },
  },
  mile: {
    long: { singular: i18n.t('mile'), plural: i18n.t('miles') },
  },

  // DISTANCE METRIC
  centimeter: {
    long: { singular: i18n.t('centimeter'), plural: i18n.t('centimeters') },
    short: { singular: 'cm', plural: 'cm' },
  },
  meter: {
    long: { singular: i18n.t('meter'), plural: i18n.t('meters') },
    short: { singular: 'm', plural: 'm' },
  },
  kilometer: {
    long: { singular: i18n.t('kilometer'), plural: i18n.t('kilometers') },
    short: { singular: 'km', plural: 'km' },
  },

  // WEIGHT IMPERIAL
  pound: {
    long: { singular: i18n.t('pound'), plural: i18n.t('pounds') },
    short: { singular: 'lb', plural: 'lbs' },
  },

  // WEIGHT METRIC
  kilogram: {
    long: { singular: i18n.t('kilogram'), plural: i18n.t('kilograms') },
    short: { singular: 'kg', plural: 'kg' },
  },
};

/**
 * Maps common aliases and plural forms to their canonical, singular key
 * in the UNITS_DICTIONARY. This reduces code duplication and provides flexibility.
 */
const UNIT_ALIASES: { [alias: string]: string } = {
  // Time
  secs: 'second',
  seconds: 'second',
  mins: 'minute',
  minutes: 'minute',
  hours: 'hour',
  days: 'day',
  weeks: 'week',
  months: 'month',
  years: 'year',

  // Distance Imperial
  inches: 'inch',
  feet: 'foot',
  yards: 'yard',
  miles: 'mile',

  // Distance Metric
  cm: 'centimeter',
  centimeters: 'centimeter',
  m: 'meter',
  meters: 'meter',
  km: 'kilometer',
  kilometers: 'kilometer',

  // Weight Imperial
  lb: 'pound',
  lbs: 'pound',
  pounds: 'pound',

  // Weight Metric
  kg: 'kilogram',
  kilograms: 'kilogram',
};

/**
 * Translates a given unit based on a count for pluralization.
 * Can return a full or shortened version of the unit.
 *
 * @param unit - The unit to translate (e.g., "seconds", "kg", "mile"). Case-insensitive.
 * @param count - The number associated with the unit, used to determine pluralization.
 * @param returnShortened - If true, returns the short form of the unit if available (e.g., "sec" instead of "second").
 * @returns The translated and pluralized unit string.
 */
const translateUnits = (
  unit: string,
  count: number,
  returnShortened: boolean = false
): string => {
  const unitLower = unit.toLowerCase();
  // Find the canonical key (e.g., 'secs' -> 'second') or use the input if not an alias.
  const canonicalUnit = UNIT_ALIASES[unitLower] || unitLower;

  const unitData = UNITS_DICTIONARY[canonicalUnit];

  if (!unitData) {
    // Fallback for units not in our dictionary.
    // i18next can handle pluralization if configured correctly.
    // https://www.i18next.com/translation-function/plurals
    return i18n.t(unitLower, { count });
  }

  // Determine if we should use the short or long form.
  // Default to 'long' if 'short' is requested but not available.
  const form =
    returnShortened && unitData.short ? unitData.short : unitData.long;

  // Select singular or plural based on the count.
  return count === 1 ? form.singular : form.plural;
};

export default translateUnits;
