// @flow
import $ from 'jquery';

export type ArchiveReason = {
  id: number,
  name: string,
};

export type ArchiveReasons = Array<ArchiveReason>;

const getArchiveMedicationReasons = (): Promise<ArchiveReasons> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/archive_reasons',
      data: {
        entity: 'medication',
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getArchiveMedicationReasons;
