// @flow
import type { ModalStatus } from '@kitman/common/src/types';
import type { Template } from './__common';

export type State = {
  templates: { [$PropertyType<Template, 'id'>]: Template },
  modals: {
    addTemplateVisible: boolean,
    renameTemplateVisible: boolean,
    duplicateTemplateVisible: boolean,
    templateName: string,
  },
  appStatus: {
    status: ModalStatus,
  },
  dialogues: {
    delete: {
      isVisible: boolean,
      templateId: ?string,
    },
    activate: {
      isVisible: boolean,
      templateId: ?string,
    },
  },
  reminderSidePanel: {
    templateId: number | string,
    isOpen: boolean,
    notifyAthletes: boolean,
    scheduledTime: ?string,
    localTimeZone: string,
    scheduledDays: { [string]: boolean },
  },
  filters: {
    searchText: string,
    searchStatus: string,
    searchScheduled: string,
  },
  sorting: {
    column: string,
    direction: string,
  },
};
