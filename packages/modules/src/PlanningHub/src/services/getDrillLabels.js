// @flow
import $ from 'jquery';
import type { Squads } from '@kitman/services/src/services/getSquads';

export type DrillLabel = {
  id: number | string,
  name: string,
  squads?: Squads,
  archived?: boolean,
  isNewItem?: boolean,
};

const getDrillLabels = (currentSquad: ?boolean): Promise<Array<DrillLabel>> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url:
        currentSquad === true
          ? '/ui/planning_hub/event_activity_drill_labels?current_squad=true'
          : '/ui/planning_hub/event_activity_drill_labels',
    })
      .done((data) => {
        resolve(data);
      })
      .fail(() => {
        reject();
      });
  });

export default getDrillLabels;
