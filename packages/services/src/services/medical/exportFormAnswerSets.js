// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

export type ExportedForms = {
  csvData: string,
  contentDisposition: string,
};

export type ExportFormsQuery = {
  category: string,
  formType: ?string,
  group: string,
  population: SquadAthletesSelection,
  startDate?: ?string,
  endDate?: ?string,
};

const exportFormAnswerSets = async (
  query: ExportFormsQuery
): Promise<ExportedForms> => {
  const response = await axios.post('/ui/concussion/form_answers_sets/export', {
    population: query.population,
    category: query.category,
    form_type: query.formType,
    group: query.group,
    start_date: query.startDate,
    end_date: query.endDate,
  });

  return {
    csvData: response.data,
    contentDisposition: response.headers['content-disposition'],
  };
};

export default exportFormAnswerSets;
