// @flow
export const rosterLevelTabHashes = {
  COACHES_REPORT_REFACTOR: '#daily_status_report',
  COACHES_REPORT: '#nfl_coaches_report',
  CONCUSSION: '#concussion',
  DIAGNOSTICS: '#diagnostics',
  DOCUMENT: '#document',
  DOCUMENTS: '#documents',
  FILES: '#files',
  FORMS: '#forms',
  INACTIVE_ATHLETES: '#inactive_athletes',
  MEDICAL_FLAGS: '#medical_flags',
  MEDICAL_NOTES: '#medical_notes',
  MODIFICATIONS: '#modifications',
  OVERVIEW: '#overview',
  PAST_ATHLETES: '#past_athletes',
  PROCEDURES: '#procedures',
  REPORTS: '#reports',
  TREATMENTS: '#treatments',
  TRYOUTS: '#tryouts',
};

export const athleteLevelTabHashes = {
  ATHLETE_DETAILS: '#athleteDetails',
  CONCUSSION: '#concussion',
  DIAGNOSTICS: '#diagnostics',
  DOCUMENTS: '#documents',
  FILES: '#files',
  FORMS: '#forms',
  ISSUES: '#issues',
  MAINTENANCE: '#maintenance',
  MEDICAL_HISTORY: '#medical-history',
  MEDICAL_NOTES: '#medical_notes',
  MEDICATIONS: '#medications',
  MODIFICATIONS: '#modifications',
  PROCEDURES: '#procedures',
  TREATMENTS: '#treatments',
};

export const issueLevelTabHashes = {
  CONCUSSION: '#concussion',
  DIAGNOSTICS: '#diagnostics',
  DOCUMENTS: '#documents',
  FILES: '#files',
  FORMS: '#forms',
  ISSUE: '#issue',
  MEDICAL_NOTES: '#medical_notes',
  MEDICATIONS: '#medications',
  MODIFICATIONS: '#modifications',
  PROCEDURES: '#procedures',
  REHAB: '#rehab',
  TREATMENTS: '#treatments',
};

const tabHashes = {
  ...issueLevelTabHashes,
  ...athleteLevelTabHashes,
  ...rosterLevelTabHashes,
};

export default tabHashes;
