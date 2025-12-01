// @flow
import { formatToDate } from '../utils';

export const mockRows = [
  {
    athlete_id: 50980,
    bio_age: 15,
    g_and_m_decimal_age: 15.01,
    g_and_m_maturity_offset: -6.88873995,
    g_and_m_phv_age: 21.599,
    g_and_m_est_adult_height: 156.21,
    g_and_m_percent_adult_height_att: 91.64,
    g_and_m_percent_adult_height_z: -0.79144,
    g_and_m_phv_date: '2030-10-09T16:47:20Z',
    g_and_m_maturity_offset_status: 'late',
    g_and_m_est_adult_height_l_50: 153.91,
    g_and_m_est_adult_height_u_50: 158.51,
    g_and_m_est_adult_height_l_90: 150.39,
    g_and_m_est_adult_height_u_90: 162.03,
    g_and_m_khamis_roche_status: 'on time',
    most_recent_measurement: '2023-11-21T16:47:20Z',
    g_and_m_height_velocity: 10,
    g_and_m_weight_velocity: 12,
    g_and_m_seated_height_ratio: 10,
    position: 'Forward',
  },
  {
    athlete_id: 81233,
    bio_age: 15,
    g_and_m_decimal_age: 15.01,
    g_and_m_maturity_offset: -4.51152788,
    g_and_m_phv_age: 19.222,
    g_and_m_est_adult_height: 170.53,
    g_and_m_percent_adult_height_att: 89.28,
    g_and_m_percent_adult_height_z: -1.42246,
    g_and_m_phv_date: '2028-05-25T16:47:24Z',
    g_and_m_maturity_offset_status: 'late',
    g_and_m_est_adult_height_l_50: 168.23,
    g_and_m_est_adult_height_u_50: 172.83,
    g_and_m_est_adult_height_l_90: 164.71,
    g_and_m_est_adult_height_u_90: 176.35,
    g_and_m_khamis_roche_status: 'on time',
    most_recent_measurement: '2023-11-21T16:47:24Z',
    g_and_m_height_velocity: 10,
    g_and_m_weight_velocity: 12,
    g_and_m_seated_height_ratio: 10,
    position: 'Forward',
  },
];

export const mockSquadAthletes = {
  squads: [
    {
      id: 8,
      name: 'International Squad',
      position_groups: [
        {
          id: 25,
          name: 'Forward',
          order: 1,
          positions: [
            {
              id: 72,
              name: 'Loose-head Prop',
              order: 1,
              athletes: [
                {
                  id: 50980,
                  firstname: 'A Athlete',
                  lastname: 'One',
                  fullname: 'A Athlete One',
                  shortname: 'A. One',
                  user_id: 1,
                  avatar_url: 'url_string',
                },
                {
                  id: 81233,
                  firstname: 'B Athlete',
                  lastname: 'Two',
                  fullname: 'B Athlete Two',
                  shortname: 'B. Two',
                  user_id: 2,
                  avatar_url: 'url_string',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const testCases = [
  {
    input: 'bio_age',
    expected: 15,
  },
  {
    input: 'g_and_m_decimal_age',
    expected: '15.0',
  },
  {
    input: 'g_and_m_maturity_offset',
    expected: '-6.889',
  },
  {
    input: 'g_and_m_phv_age',
    expected: '21.6',
  },
  {
    input: 'g_and_m_est_adult_height',
    expected: '156.21',
  },
  {
    input: 'g_and_m_percent_adult_height_att',
    expected: '91.6',
  },
  {
    input: 'g_and_m_percent_adult_height_z',
    expected: '-0.79',
  },
  {
    input: 'g_and_m_phv_date',
    expected: formatToDate('2030-10-09T16:47:20Z'),
  },
  {
    input: 'g_and_m_maturity_offset_status',
    expected: 'Late',
  },
  {
    input: 'g_and_m_est_adult_height_l_50',
    expected: '153.91',
  },
  {
    input: 'g_and_m_est_adult_height_u_50',
    expected: '158.51',
  },
  {
    input: 'g_and_m_est_adult_height_l_90',
    expected: '150.39',
  },
  {
    input: 'g_and_m_est_adult_height_u_90',
    expected: '162.03',
  },
  {
    input: 'g_and_m_khamis_roche_status',
    expected: 'On time',
  },
  {
    input: 'most_recent_measurement',
    expected: formatToDate('2023-11-21T16:47:20Z'),
  },
  { input: 'position', expected: 'Forward' },
  { input: 'g_and_m_height_velocity', expected: '10.00' },
  { input: 'g_and_m_weight_velocity', expected: '12.00' },
  { input: 'g_and_m_seated_height_ratio', expected: '10.00' },
];
