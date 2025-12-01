import { rest } from 'msw';

const data = [
  {
    athlete_id: 8085,
    bio_age: null,
    chrono_age: 15,
    date_of_birth_quarter: 4,
    discrepancy: null,
    g_and_m_decimal_age: 15.01,
    g_and_m_maturity_offset: 4.51152788,
    g_and_m_phv_age: 19.222,
    g_and_m_est_adult_height: 170.53,
    g_and_m_percent_adult_height_att: 64.1,
    g_and_m_percent_adult_height_z: 1.42246,
    g_and_m_phv_date: '2028-05-25T16:47:24Z',
    g_and_m_maturity_offset_status: 'late',
    g_and_m_est_adult_height_l_50: 168.23,
    g_and_m_est_adult_height_u_50: 172.83,
    g_and_m_est_adult_height_l_90: 164.71,
    g_and_m_est_adult_height_u_90: 176.35,
    g_and_m_khamis_roche_status: 'on time',
    g_and_m_growth_rate: null,
    most_recent_measurement: '2023-11-21T16:47:24Z',
  },
];

const handler = rest.post(
  '/reporting/growth_maturation/preview',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
