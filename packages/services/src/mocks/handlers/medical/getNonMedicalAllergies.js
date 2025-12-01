import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Celery',
    allergen_type: 'Food allergy',
  },
  {
    id: 2,
    name: 'Cereals containing gluten',
    allergen_type: 'Food allergy',
  },
  {
    id: 3,
    name: 'Crustaceans',
    allergen_type: 'Food allergy',
  },
  {
    id: 4,
    name: 'Eggs',
    allergen_type: 'Food allergy',
  },
  {
    id: 5,
    name: 'Fish',
    allergen_type: 'Food allergy',
  },
  {
    id: 6,
    name: 'Lupin',
    allergen_type: 'Food allergy',
  },
  {
    id: 7,
    name: 'Milk',
    allergen_type: 'Food allergy',
  },
  {
    id: 8,
    name: 'Molluscs',
    allergen_type: 'Food allergy',
  },
  {
    id: 9,
    name: 'Mustard',
    allergen_type: 'Food allergy',
  },
  {
    id: 10,
    name: 'Peanuts',
    allergen_type: 'Food allergy',
  },
  {
    id: 11,
    name: 'Tree nuts',
    allergen_type: 'Food allergy',
  },
  {
    id: 12,
    name: 'Sesame',
    allergen_type: 'Food allergy',
  },
  {
    id: 13,
    name: 'Soya',
    allergen_type: 'Food allergy',
  },
  {
    id: 14,
    name: 'Sulphur dioxide (Sulphites)',
    allergen_type: 'Food allergy',
  },
  {
    id: 15,
    name: 'Banana',
    allergen_type: 'Food allergy',
  },
  {
    id: 16,
    name: 'Buckwheat',
    allergen_type: 'Food allergy',
  },
  {
    id: 17,
    name: 'Coconut',
    allergen_type: 'Food allergy',
  },
  {
    id: 18,
    name: 'Fenugreek',
    allergen_type: 'Food allergy',
  },
  {
    id: 19,
    name: 'Pollen food syndrome',
    allergen_type: 'Food allergy',
  },
  {
    id: 20,
    name: 'Kiwifruit',
    allergen_type: 'Food allergy',
  },
  {
    id: 21,
    name: 'Legumes (including pulses)',
    allergen_type: 'Food allergy',
  },
  {
    id: 22,
    name: 'Lipid transfer protein syndrome',
    allergen_type: 'Food allergy',
  },
  {
    id: 23,
    name: 'Nutmeg',
    allergen_type: 'Food allergy',
  },
  {
    id: 24,
    name: 'Onion and garlic',
    allergen_type: 'Food allergy',
  },
  {
    id: 25,
    name: 'Pine nuts',
    allergen_type: 'Food allergy',
  },
  {
    id: 26,
    name: 'Quorn',
    allergen_type: 'Food allergy',
  },
  {
    id: 27,
    name: 'Shea nuts',
    allergen_type: 'Food allergy',
  },
  {
    id: 28,
    name: 'Shellfish',
    allergen_type: 'Food allergy',
  },
  {
    id: 29,
    name: 'Chestnuts',
    allergen_type: 'Food allergy',
  },
  {
    id: 30,
    name: 'Vegetable oils',
    allergen_type: 'Food allergy',
  },
  {
    id: 31,
    name: 'Allergy to vegetables',
    allergen_type: 'Food allergy',
  },
  {
    id: 32,
    name: 'Allergy to fruits',
    allergen_type: 'Food allergy',
  },
  {
    id: 33,
    name: 'Propylene glycol (Additive)',
    allergen_type: 'Food allergy',
  },
  {
    id: 34,
    name: 'Stinging insects (Including bees and wasps)',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 35,
    name: 'Cockroaches',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 36,
    name: 'Dustmites',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 37,
    name: 'Cats',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 38,
    name: 'Dogs',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 39,
    name: 'Animals with fur (including cats and dogs)',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 40,
    name: 'Rabbits',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 41,
    name: 'Pigs',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 42,
    name: 'Hamsters',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 43,
    name: 'Ferrets',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 44,
    name: 'Horses',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 45,
    name: 'Animals/birds with feathers',
    allergen_type: 'Animal / Insect allergy',
  },
  {
    id: 46,
    name: 'Nickel',
    allergen_type: 'Metal allergy',
  },
  {
    id: 47,
    name: 'Mercury',
    allergen_type: 'Metal allergy',
  },
  {
    id: 48,
    name: 'Chromium',
    allergen_type: 'Metal allergy',
  },
  {
    id: 49,
    name: 'Gold',
    allergen_type: 'Metal allergy',
  },
  {
    id: 50,
    name: 'Palladium',
    allergen_type: 'Metal allergy',
  },
  {
    id: 51,
    name: 'Cobalt',
    allergen_type: 'Metal allergy',
  },
  {
    id: 52,
    name: 'Mold',
    allergen_type: 'Mold allergy',
  },
  {
    id: 53,
    name: 'Pollen',
    allergen_type: 'Pollen allergy',
  },
  {
    id: 54,
    name: 'Tree pollen',
    allergen_type: 'Pollen allergy',
  },
  {
    id: 55,
    name: 'Grass pollen',
    allergen_type: 'Pollen allergy',
  },
  {
    id: 56,
    name: 'Ragweed pollen',
    allergen_type: 'Pollen allergy',
  },
  {
    id: 57,
    name: 'Pine tree',
    allergen_type: 'Tree allergy',
  },
  {
    id: 58,
    name: 'Cosmetics',
    allergen_type: 'Cosmetics and cleaning products allergy',
  },
  {
    id: 59,
    name: 'Fragrances',
    allergen_type: 'Cosmetics and cleaning products allergy',
  },
  {
    id: 60,
    name: 'Dyes',
    allergen_type: 'Cosmetics and cleaning products allergy',
  },
  {
    id: 61,
    name: 'Balsam of peru',
    allergen_type: 'Cosmetics and cleaning products allergy',
  },
  {
    id: 62,
    name: 'Latex',
    allergen_type: 'Latex and rubber allergy',
  },
  {
    id: 63,
    name: 'Rubber',
    allergen_type: 'Latex and rubber allergy',
  },
  {
    id: 64,
    name: 'Carba mix',
    allergen_type: 'Latex and rubber allergy',
  },
  {
    id: 65,
    name: 'Chlorine',
    allergen_type: 'Chlorine allergy',
  },
];

const handler = rest.get('/ui/medical/misc_allergies', (req, res, ctx) =>
  res(ctx.json(data))
);
export { handler, data };
