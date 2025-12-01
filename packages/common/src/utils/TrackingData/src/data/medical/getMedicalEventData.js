// @flow
import {
  type Level,
  type Tab,
  type NoteActionElement,
  type DocumentActionElement,
} from '@kitman/common/src/utils/TrackingData/src/types/medical';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';

export const determineMedicalLevelAndTab = (): {
  level: Level,
  tab: 'unknown' | Tab,
} => {
  const issueLevelTypes = ['injuries', 'illnesses', 'chronic_issues'];
  const urlParts = window.location.pathname.split('/'); // e.g. ['', 'medical', 'athletes', '32774', 'diagnostics', '168868']

  let level = 'team'; // Suitable default. Could check urlParts[2] === 'rosters';
  let tab;

  const currentTab = window.location.hash;
  if (currentTab) {
    tab = Object.values(tabHashes).includes(currentTab)
      ? currentTab
      : 'unknown'; // Unknown when tab not one present in tabHashes
  }

  if (urlParts.length > 2 && urlParts[2] === 'athletes') {
    if (urlParts.length > 4 && issueLevelTypes.includes(urlParts[4])) {
      level = 'issue';
      tab = tab || '#issue'; // #issue is the default tab at issue level
    } else {
      level = 'athlete';
      tab = tab || tabHashes.ISSUES; // #issues is the default tab at athlete level
    }
  }
  tab = tab || tabHashes.OVERVIEW;
  return { level, tab };
};

export const getNoteActionElement = (actionElement: NoteActionElement) => {
  return { actionElement };
};

export const getDocumentActionElement = (actionElement: DocumentActionElement) => {
  return { actionElement };
};

export const getLevelAndTab = (level: Level, tab: Tab) => {
  return { level, tab };
};

export const getIssueType = (issueType: string) => {
  return { issueType };
};

export const getAthleteId = (athleteId: string | number) => {
  return { athleteId };
};
