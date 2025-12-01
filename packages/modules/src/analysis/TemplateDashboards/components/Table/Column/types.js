// @flow

// discrepancy, g_and_m_growth_rate have been de-scoped for now, but backend are still sending the data.
// They will likely be added at a later date.
export type RowData = {
  athlete_id: number,
  bio_age: number,
  date_of_birth_quarter: number,
  discrepancy?: number,
  g_and_m_decimal_age: number,
  g_and_m_maturity_offset: number,
  g_and_m_phv_age: number,
  g_and_m_est_adult_height: number,
  g_and_m_percent_adult_height_att: number,
  g_and_m_percent_adult_height_z: number,
  g_and_m_phv_date: string,
  g_and_m_maturity_offset_status: string,
  g_and_m_est_adult_height_l_50: number,
  g_and_m_est_adult_height_u_50: number,
  g_and_m_est_adult_height_l_90: number,
  g_and_m_est_adult_height_u_90: number,
  g_and_m_khamis_roche_status: string,
  g_and_m_growth_rate?: number,
  g_and_m_height_velocity: number,
  g_and_m_weight_velocity: number,
  g_and_m_seated_height_ratio: number,
  g_and_m_height: number,
  g_and_m_weight: number,
  most_recent_measurement: string,
  position: string,
};

export type Athlete = {
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  shortname: string,
  user_id: number,
};
