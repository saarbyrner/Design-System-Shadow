// @flow
import $ from 'jquery';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportAthleteOwnData = (): Promise<ExportsItem> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/athlete_export_jobs/athlete_medical_export',
      data: {},
    })
      .done(resolve)
      .fail(reject);
  });
};

export default exportAthleteOwnData;
