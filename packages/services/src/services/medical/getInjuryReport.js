// @flow
import $ from 'jquery';
import type { Coding } from '@kitman/common/src/types/Coding';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

export type InjuryReportRow = {
  athlete: {
    name: string,
    id: number,
    extended_attributes?: {
      nfl_player_id?: string,
    },
  },
  coding?: Coding,
  body_area: string,
  injury: string,
  occurrence_date: string,
  position: string,
  squad_number: number,
  latest_note: string,
  squads: Array<{ name: string, primary: boolean }>,
  status: {
    description: string,
    order: number,
  },
};

export type FullInjuryReport = {
  [string]: Array<InjuryReportRow>,
};

export type Config = {
  issueTypes: Array<'Injury' | 'Illness'>,
  population?: SquadAthletesSelection[],
};

const getInjuryReport = ({
  issueTypes,
  population,
}: Config): Promise<FullInjuryReport> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/medical/rosters/injury_report`,
      contentType: 'application/json',
      data: JSON.stringify({
        issue_types: issueTypes,
        population: population || [],
        ...(window.featureFlags['hide-player-left-club'] && {
          hide_player_left_club: true,
        }),
      }),
    })
      .done(resolve)
      .fail(reject);
  });

export default getInjuryReport;
