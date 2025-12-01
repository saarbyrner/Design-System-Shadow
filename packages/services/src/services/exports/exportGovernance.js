// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

export type ExportGovernanceParams = {
  competitionIds?: ?(string[]),
};

const exportGovernance = async ({
  competitionIds,
}: ExportGovernanceParams): Promise<ExportsItem> => {
  const { data } = await axios.post('/export_jobs/governance_export', {
    competition_ids: competitionIds,
  });
  return data;
};

export default exportGovernance;
