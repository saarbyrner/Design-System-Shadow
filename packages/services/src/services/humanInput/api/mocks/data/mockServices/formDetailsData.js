// Used in the absence of a backend API
// @flow

import type { FormDetails } from '@kitman/modules/src/HumanInput/types/forms';

// Temporary data source until API created
export const data: FormDetails = {
  formDetails: {
    assigned: '10:00 am, April 20 2023',
    assignedBy: 'Valeri Lucks',
    formType: 'Survey',
    category: 'Medical',
    template: 'Pre-season screening',
  },
  schedule: {
    startDate: 'April 30, 2023',
  },
  additionalPreferences: {
    reminders: 'Schedule push notification to be sent to recipients',
    time: '9:00 am',
    repeats: 'S,M,T,W,T,F,S',
  },
  assignAndVisibility: {
    assign: {
      whoReceivesForm: 'Staff',
      usedToEvaluateOthers: true,
      groupToBeEvaluated: 'First Team',
      assignTo: 'Kosta Aaron, Morgan Adam',
      whoIsEvaluated: 'Athletes',
    },
    visibility: {
      resultsViewedBy: 'Medical',
      alertsEmailedTo: 'Valeri Lucks, Alexander Sokolov',
    },
  },
};

export default data;
