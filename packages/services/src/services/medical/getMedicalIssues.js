// @flow
import { axios } from '@kitman/common/src/utils/services';

export type CodingSystemName =
  | 'ICD-10-CM'
  | 'OSICS-10'
  | 'Datalys'
  | 'Clinical Impressions';

const getMedicalIssues = async ({
  codingSystem,
  onlyActiveCodes = true,
}: {
  codingSystem: CodingSystemName,
  onlyActiveCodes?: boolean,
}): Promise<Array<Object>> => {
  const { data } = await axios.post(
    `/ui/medical/issues/get`,
    {
      coding_system: codingSystem,
      /*
       * default true, pass false in read-only flow like export to
       * also get the retired codes listing in the dropdown
       */
      only_active: onlyActiveCodes,
    },
    { timeout: 0 }
  );

  return data.results;
};

export default getMedicalIssues;
