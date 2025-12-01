// @flow

const leagueOperationsEventNames = {
  // Scout Access Management
  scoutAccessExported: 'Scout access exported',
  scoutAttendeesExported: 'Scout attendees exported',

  scoutAccessApproved: 'Scout access approved',
  scoutAccessRejected: 'Scout access rejected',
  scoutAccessBulkApproved: 'Scout access bulk approved',
  scoutAccessBulkRejected: 'Scout access bulk rejected',
  scoutAccessBulkUploadAttachmentClicked:
    'Scout access bulk upload attachment clicked',

  leagueGameCreationClicked: 'League game creation clicked',
  editFixtureClicked: 'Edit fixture clicked',

  viewScoutRequestsClicked: 'Scout requests clicked',
  leagueGamesUploadClicked: 'League games upload clicked',

  requestAccessClicked: 'Request access clicked',
  withdrawRequestClicked: 'Withdraw request clicked',
  withdrawRequestSubmitted: 'Withdraw request submitted',

  // Match Monitor
  matchMonitorAssigned: 'Match monitor assigned',
  matchMonitorsUploaded: 'Match monitors uploaded',

  viewMatchMonitorReportClicked: 'View match monitor report clicked',
  resetMatchMonitorReportClicked: 'Reset match monitor report clicked',
  unlockMatchMonitorReportClicked: 'Unlock match monitor report clicked',

  addRemovePlayersClicked: 'Add/remove players clicked',
  addNewPlayerClicked: 'Add new player clicked',
  deletePlayerClicked: 'Delete player clicked',

  registrationTypeToggled: 'Registration type toggled',
  matchMonitorReportSubmitted: 'Match monitor report submitted',
};

export default leagueOperationsEventNames;
