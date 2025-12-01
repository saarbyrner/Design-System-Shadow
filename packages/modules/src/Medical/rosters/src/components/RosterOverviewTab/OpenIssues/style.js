// @flow

import { colors, breakPoints } from '@kitman/common/src/variables';

export const style = {
  openIssuesCell: {
    display: 'flex',
  },
  issuesContainer: {
    display: 'flex',
    width: '25em',
    flexDirection: 'column',
    [`@media only screen and (max-width: ${breakPoints.tablet})`]: {
      width: '250px',
    },
  },
  issue: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0.135em',
  },
  issueName: {
    color: colors.grey_200,
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'pre-line',
    marginLeft: '16px',
  },
  issueStatus: {
    color: colors.grey_100,
    fontSize: '12px',
    marginLeft: '16px',
  },
  issueAvailabilityMarker: {
    alignItems: 'center',
    border: `2px solid ${colors.p06}`,
    borderRadius: '10px',
    display: 'block',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    marginRight: '4px',
    marginTop: '4px',
    spanBorderRadius: '10px',
    height: '8px',
    width: '8px',
  },
  availabilityMarker__available: {
    backgroundColor: colors.green_200,
  },
  availabilityMarker__injured: {
    backgroundColor: colors.orange_100,
  },
  availabilityMarker__unavailable: {
    backgroundColor: colors.red_100,
  },
  availabilityMarker__returning: {
    backgroundColor: colors.yellow_100,
  },
  error: {
    color: colors.red_100,
    fontSize: '14px',
    marginTop: '8px',
  },
  loading: {
    color: colors.grey_100,
    fontSize: '14px',
    marginTop: '8px',
  },
  editContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginTop: '8px',
  },
  datePickerContainer: {
    '.MuiInputBase-root': {
      width: '165px',
    },
  },
  statusSelectContainer: {
    flex: '1',
  },
  validationError: {
    fontSize: '11px',
    color: '#dc2626',
    marginTop: '4px',
    lineHeight: '1.2',
  },
  lockMessage: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
    lineHeight: '1.2',
    fontStyle: 'italic',
  },
  issueBlock: {
    marginBottom: '16px',
  },
  loadingOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10',
    borderRadius: '4px',
  },
  loadingText: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  issuesContainerEditing: {
    marginTop: '16px',
    position: 'relative',
  },
  issuesContainerNormal: {
    marginTop: '0',
    position: 'static',
  },
  modalAthleteInfo: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '12px',
  },
  modalAthleteName: {
    marginLeft: '8px',
  },
  modalChangeGroup: {
    marginTop: '12px',
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  modalDateHeader: {
    fontWeight: '600',
    marginBottom: '4px',
  },
  modalChangeItem: {
    marginTop: '4px',
  },
  modalChangeContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalChangeDetails: {
    flex: '1',
  },
  modalIssueName: {
    fontWeight: '600',
    margin: '0',
  },
  modalStatusChange: {
    fontSize: '12px',
    margin: '0',
  },
  modalStatusDate: {
    fontSize: '11px',
    margin: '0',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  modalStatusPrevious: {
    textDecoration: 'line-through',
    color: '#6b7280',
  },
  modalStatusArrow: {
    margin: '0 6px',
  },
  modalIconContainer: {
    marginLeft: '8px',
    minWidth: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  modalErrorBox: {
    marginTop: '4px',
    padding: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#dc2626',
  },
  modalErrorIcon: {
    fontSize: '14px',
    marginRight: '4px',
    verticalAlign: 'middle',
  },
  statusIconSuccess: {
    color: 'green',
    fontSize: '16px',
  },
  statusIconError: {
    color: 'red',
    fontSize: '16px',
  },
};
