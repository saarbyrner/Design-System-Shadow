// @flow
import $ from 'jquery';
import type { DateRange } from '@kitman/common/src/types';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportParticipantExposure = ({
  dateRange,
  squadIds,
  name,
}: {
  dateRange: ?DateRange,
  squadIds: string[],
  name?: string,
}): Promise<ExportsItem> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/export_jobs/participant_exposure',
      data: {
        date_range: dateRange,
        squad_ids: squadIds,
        ...(name && { name }),
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default exportParticipantExposure;
