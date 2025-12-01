// @flow
import { rest } from 'msw';

const countries = [
  { value: 'afghanistan', label: 'Afghanistan' },
  { value: 'aland_islands', label: 'Åland Islands' },
  { value: 'albania', label: 'Albania' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'germany', label: 'Germany' },
  { value: 'ireland', label: 'Ireland' },
  { value: 'united_kingdom', label: 'United Kingdom' },
  { value: 'united_states', label: 'United States' },
];

const timezones = [
  { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala_Lumpur' },
  { value: 'Asia/Kuching', label: 'Asia/Kuching' },
  { value: 'Asia/Macau', label: 'Asia/Macau' },
  { value: 'Asia/Magadan', label: 'Asia/Magadan' },
  { value: 'Asia/Makassar', label: 'Asia/Makassar' },
  { value: 'Europe/Dublin', label: 'Europe/Dublin' },
  { value: 'Africa/Abidjan', label: 'Africa/Abidjan' },
  { value: 'Africa/Accra', label: 'Africa/Accra' },
];

const allIssues = [
  { value: 'afghanistan', label: 'Afghanistan' },
  { value: 'aland_islands', label: 'Åland Islands' },
  { value: 'albania', label: 'Albania' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala_Lumpur' },
  { value: 'Asia/Kuching', label: 'Asia/Kuching' },
  { value: 'Asia/Macau', label: 'Asia/Macau' },
  { value: 'Asia/Magadan', label: 'Asia/Magadan' },
  { value: 'Asia/Makassar', label: 'Asia/Makassar' },
];

const medicalDocumentCategories = [
  {
    value: 1,
    label: 'Concussion Docs',
  },
  {
    value: 19,
    label: 'Consultant Note',
  },
  {
    value: 13,
    label: 'Insurance Docs',
  },
  {
    value: 2,
    label: 'Lab Docs',
  },
  {
    value: 7,
    label: 'Misc',
  },
  {
    value: 4,
    label: 'Physical Exams',
  },
  {
    value: 3,
    label: 'Radiology Docs',
  },
];

const shoes = [
  { label: 'Adidas Shoe', value: 1 },
  { label: 'Nike Shoe', value: 2 },
  { label: 'Puma Shoe', value: 3 },
];

const shoesV2 = [
  {
    label: 'Adidas',
    value: 'adidas',
    children: [
      {
        label: 'Byw select',
        value: 'byw_select',
        children: [
          {
            value: 'signature',
            label: 'Player Signature Shoe',
          },
          {
            value: 'stock',
            label: 'Stock Model',
          },
        ],
      },
      {
        label: 'Dame 8',
        value: 'dame_8',
        children: [
          {
            value: 'dame_8_super',
            label: 'Super Shoe',
          },
          {
            value: 'dame_8_custom',
            label: 'Custom Model',
          },
        ],
      },
    ],
  },
  {
    label: 'Nike',
    value: 'nike',
    children: [
      {
        label: 'Cosmic unity',
        value: 'cosmic_unity',
      },
      {
        label: 'Freak 4',
        value: 'freak_4',
      },
      {
        label: 'Gt cut 2',
        value: 'gt_cut_2',
      },
    ],
  },
  {
    label: 'Other',
    value: 'other',
  },
];

const gameEvents = [{ label: 'Mar 12th 2024 vs Australia', value: '2626222' }];

const mockedSources = {
  countries,
  timezones,
  footwares: shoes,
  footwear_v2s: shoesV2,
  game_events: gameEvents,
  medical_document_categories: medicalDocumentCategories,
};

const handler = rest.get(
  '/forms/form_elements/data_source_items',
  (req, res, ctx) => {
    const query = req.url.searchParams;
    const type = query.get('data_source');

    if (mockedSources[type]) {
      return res(ctx.json(mockedSources[type]));
    }

    return res(ctx.json(allIssues));
  }
);

export {
  handler,
  allIssues,
  countries,
  timezones,
  shoes,
  shoesV2,
  medicalDocumentCategories,
  gameEvents,
};
