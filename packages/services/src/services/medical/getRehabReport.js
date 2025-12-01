// @flow
import $ from 'jquery';
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { SquadAthletesSelection } from '@kitman/components/src/types';

export type ExerciseInstance = {
  id: number,
  exercise_template_id: number,
  exercise_name: string,
  variations: Array<{
    key: string,
    parameters: Array<{
      key: string,
      label: string,
      value: string,
      config: Object,
    }>,
  }>,
  comment: null,
  order_index: 1,
  section_id: 19,
  reason?: string,
};

export type AthleteRehabSessions = {
  athlete_id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  sessions: Array<{
    id: number,
    annotations: Annotation[],
    start_time: string,
    end_time: string,
    timezone: string,
    title: string,
    created_at: string,
    sections: Array<{
      id: number,
      title: string,
      theme_color: ?string,
      order_index: number,
      issues: [
        {
          id: number,
          full_pathology: string,
          occurrence_date: string,
          issue_occurrence_title: string,
          exercise_instances: Array<ExerciseInstance>,
          body_area: string,
          body_side: string,
        }
      ],
      maintenance_exercise_instances: Array<ExerciseInstance>,
    }>,
  }>,
};

export type FullRehabReport = Array<AthleteRehabSessions>;

export type ReportParams = {
  squad_ids?: Array<number>,
  population?: SquadAthletesSelection,
  start_date: string,
  end_date: string,
};

const getRehabReport = (params: ReportParams): Promise<FullRehabReport> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/medical/rehab/sessions/multi_athlete_report`,
      data: JSON.stringify(params),
      contentType: 'application/json',
    })
      .done(resolve)
      .fail(reject);
  });

export default getRehabReport;
