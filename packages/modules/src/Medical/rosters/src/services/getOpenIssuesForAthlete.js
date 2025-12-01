// @flow
import $ from 'jquery';
import type { AthleteOpenIssues } from '../../types';

const getOpenIssuesForAthlete = (
  athleteId: string
): Promise<AthleteOpenIssues> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/athletes/${athleteId}/issues/open_issues`,
      ...(window.featureFlags['hide-player-left-club'] && {
        data: { hide_player_left_club: true },
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOpenIssuesForAthlete;
