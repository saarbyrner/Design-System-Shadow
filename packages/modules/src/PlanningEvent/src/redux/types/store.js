// @flow
import type {
  GameActivityStorage,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import type {
  Athlete,
  Column,
  Comments,
  CommentsViewType,
  GridRow,
  SelectedGridDetails,
  AssessmentTemplate,
  AssessmentGroup,
} from '@kitman/modules/src/PlanningEvent/types';
import type { Event } from '@kitman/common/src/types/Event';

export type Store = {
  comments: {
    athleteComments: Comments,
    athleteLinkedToComments: Athlete | {},
    isPanelOpen: boolean,
    panelViewType: CommentsViewType,
  },
  grid: {
    columns: Array<Column>,
    nextId: ?number,
    rows: Array<GridRow>,
  },
  gridDetails: SelectedGridDetails,
  assessmentTemplates: Array<AssessmentTemplate>,
  eventAssessments: { assessments: Array<AssessmentGroup> },
  appState: {
    requestStatus: 'FAILURE' | 'LOADING' | 'SUCCESS',
  },
  gameActivities: GameActivityStorage,
  eventPeriods: GamePeriodStorage,
  gameEvent: {
    event: ?Event,
    matchDayView: string,
  },
};
