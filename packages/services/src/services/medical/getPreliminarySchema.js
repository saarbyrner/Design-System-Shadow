// @flow
import { axios } from '@kitman/common/src/utils/services';

export type PreliminarySchema = {
  issue_type: string,
  athlete: {
    id: string,
  },
  occurrence_date: string,
  squad: {
    id: string,
  },
  created_by: string,
  title: string,
  issue_occurrence_onset_id: string,
  examination_date: string,
  statuses: string,
  primary_pathology: {
    type: string,
    id: string,
  },
  side: {
    id: string,
  },
  activity: {
    id: string,
  },
  position_when_injured_id: string,
  occurrence_min: string,
  event: {
    type: string,
    id: string,
  },
  session_completed: string,
  logic_builder: string,
};

export type GetPreliminarySchemaParams = {
  issue_type: string,
  issue_occurrence_date: string,
};

export const GET_PRELIMINARY_SCHEMA_URL =
  '/emr/preliminary_issues/issue_config';

const getPreliminarySchema = async (
  params: GetPreliminarySchemaParams
): Promise<PreliminarySchema> => {
  const { data } = await axios.get(GET_PRELIMINARY_SCHEMA_URL, { params });
  return data;
};

export default getPreliminarySchema;
