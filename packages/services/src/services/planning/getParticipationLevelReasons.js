// @flow
import $ from 'jquery';

export type ParticipationLevelReason = {
  id: number,
  name: string,
  require_issue: boolean,
};

const getParticipationLevelReasons = (): Promise<
  Array<ParticipationLevelReason>
> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/participation_level_reasons`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getParticipationLevelReasons;
