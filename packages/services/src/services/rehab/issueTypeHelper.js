// @flow
import type { IssueType } from '../../../../modules/src/Medical/shared/types';

const convertIssueType = (issueType: ?IssueType | string) => {
  if (issueType == null) {
    return undefined;
  }

  switch (issueType) {
    case 'ChronicInjury':
    case 'ChronicIllness':
    case 'Emr::Private::Models::ChronicIssue':
      return 'chronic';
    default:
      return issueType.toLowerCase();
  }
};

export default convertIssueType;
