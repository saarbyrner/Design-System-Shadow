/* eslint-disable flowtype/require-valid-file-annotation */
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

export const getOsicsPathologyName = (
  injuryOsicsPathologies,
  illnessOsicsPathologies,
  issueType,
  issue
) => {
  if (
    issue.supplementary_pathology &&
    window.featureFlags['custom-pathologies']
  ) {
    return issue.supplementary_pathology;
  }

  let pathologiesById;
  if (issueType === 'INJURY') {
    pathologiesById = injuryOsicsPathologies.reduce((hash, pathology) => {
      Object.assign(hash, { [pathology.id]: pathology.name });
      return hash;
    }, {});
  } else {
    pathologiesById = illnessOsicsPathologies.reduce((hash, pathology) => {
      Object.assign(hash, { [pathology.id]: pathology.name });
      return hash;
    }, {});
  }

  const osicsInfo = window.featureFlags['emr-multiple-coding-systems']
    ? issue?.coding[codingSystemKeys.OSICS_10]
    : issue?.osics;

  return pathologiesById[osicsInfo?.osics_pathology_id] || 'N/A';
};

export const getSide = (classname, sides, sideId) => {
  const bodyAreasById = sides.reduce((hash, side) => {
    Object.assign(hash, { [side.id]: side.name });
    return hash;
  }, {});
  return <span className={classname}>{` (${bodyAreasById[sideId]})`}</span>;
};

export const getGradeSite = (issueType, issue, grades) => {
  if (
    issue.supplementary_pathology &&
    window.featureFlags['custom-pathologies']
  ) {
    return '';
  }

  if (issueType === 'INJURY' && issue.bamic_grade_id) {
    const gradeId = issue.bamic_grade_id;
    if ([1, 2, 3, 4, 5].includes(gradeId)) {
      const grade = grades.find(({ id }) => id === gradeId);
      if (grade && issue.bamic_site_id) {
        const siteId = issue.bamic_site_id;
        let siteLetter = '';

        // eslint-disable-next-line max-depth
        switch (siteId) {
          case 1:
            siteLetter = 'a';
            break;
          case 2:
            siteLetter = 'b';
            break;
          case 3:
            siteLetter = 'c';
            break;
          default:
            siteLetter = '';
        }
        return ` - ${grade.name}${siteLetter}`;
      }
      if (grade) {
        return ` - ${grade.name}`;
      }
    }
  }
  return '';
};
