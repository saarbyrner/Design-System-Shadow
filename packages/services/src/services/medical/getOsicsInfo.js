// @flow
import $ from 'jquery';

export type OsicsInfo = {
  id: string,
  osics_classification_id: string,
  osics_body_area_id: string,
  osics_pathology_id: string,
  bamic: boolean,
};

const getOsicsInfo = (
  athleteId: number,
  pathologyId: number
): Promise<OsicsInfo> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/athletes/${athleteId}/issues/osics_info`,
      data: { id: pathologyId, scope_to_org: true },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOsicsInfo;
