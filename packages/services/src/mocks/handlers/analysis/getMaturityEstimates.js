// @flow
import { rest } from 'msw';

import { GET_MATURITY_ESTIMATES_URL } from '@kitman/services/src/services/analysis/getMaturityEstimates';

const data = [
  {
    id: 18695,
    name: 'Biological age',
    perma_id: 'g_and_m_bio_age',
    unit: 'years',
    rounding_places: 2,
    platform: 'Growth \u0026 Maturation',
  },
  {
    id: 18696,
    name: 'Height velocity (%)',
    perma_id: 'g_and_m_height_velocity',
    unit: '%',
    rounding_places: 2,
    platform: 'Growth \u0026 Maturation',
  },
  {
    id: 18838,
    name: 'Date of birth quarter',
    perma_id: 'g_and_m_season_dob_quartile',
    unit: null,
    rounding_places: null,
    platform: 'Growth \u0026 Maturation',
  },
  {
    id: 16363,
    name: 'Standing Height 1',
    perma_id: 'g_and_m_standing_height_1',
    unit: null,
    rounding_places: 1,
    platform: 'Growth \u0026 Maturation',
  },
  {
    id: 16370,
    name: 'Weight 1',
    perma_id: 'g_and_m_weight_1',
    unit: null,
    rounding_places: 1,
    platform: 'Growth \u0026 Maturation',
  },
  {
    id: 18697,
    name: 'Weight velocity',
    perma_id: 'g_and_m_weight_velocity',
    unit: 'kg/yr',
    rounding_places: 2,
    platform: 'Growth \u0026 Maturation',
  },
  {
    id: 18698,
    name: 'Seated height / height ratio',
    perma_id: 'g_and_m_seated_height_ratio',
    unit: '%',
    rounding_places: 2,
    platform: 'Growth \u0026 Maturation',
  },
];

const handler = rest.get(GET_MATURITY_ESTIMATES_URL, (_, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
