// @flow
import type {
  GroupBy,
  Template,
  QuestionnaireVariable,
} from '@kitman/common/src/types';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { PlatformType } from '@kitman/common/src/types/__common';

export type State = {
  variables: {
    byId: {
      [string]: QuestionnaireVariable,
    },
    byPlatform: {
      [PlatformType]: Array<QuestionnaireVariable>,
    },
    currentlyVisible: Array<QuestionnaireVariable>,
    selectedPlatform: PlatformType,
  },
  athletes: {
    all: Array<Athlete>,
    grouped: {
      [string]: {
        [string]: Array<Athlete>,
      },
    },
    currentlyVisible: {
      [string]: Array<Athlete>,
    },
    groupBy: GroupBy,
    searchTerm?: string,
    squadFilter: string | number | null,
  },
  checkedVariables: {
    string?: boolean,
  },
  squadOptions: {
    squads: Array<{ name: string, key_name: number | string }>,
  },
  variablePlatforms: Array<{ name: string, value: string }>,
  groupingLabels: { [$PropertyType<Athlete, 'availability'>]: string },
  templateData: Template,
  templateNames: Array<string>,
  modals: {
    status?: string,
    message?: string,
  },
};
