import { initialState } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import {
  getPanelState,
  getBulkActionsState,
  getSelectedSquadIds,
  getShouldRemovePrimarySquad,
  getSearchQuery,
  getCurrentStatus,
} from '../index';

const MOCK_STATE = {
  athleteManagementSlice: {
    ...initialState,
  },
};

describe('[athleteManagementSelectors] - selectors', () => {
  it('should return the correct value from getPanelState', () => {
    expect(getPanelState(MOCK_STATE)).toBe(
      MOCK_STATE.athleteManagementSlice.panels
    );
  });

  it('should return the correct value from getBulkActionsState', () => {
    expect(getBulkActionsState(MOCK_STATE)).toBe(
      MOCK_STATE.athleteManagementSlice.bulkActions
    );
  });

  it('should return the correct value from getShouldRemovePrimarySquad', () => {
    expect(getShouldRemovePrimarySquad(MOCK_STATE)).toBe(
      MOCK_STATE.athleteManagementSlice.bulkActions.shouldRemovePrimarySquad
    );
  });
  it('should return the correct value from getSelectedSquadIds', () => {
    expect(getSelectedSquadIds(MOCK_STATE)).toBe(
      MOCK_STATE.athleteManagementSlice.bulkActions.selectedSquadIds
    );
  });
  it('should return the correct value from getSearchQuery', () => {
    expect(getSearchQuery(MOCK_STATE)).toBe(
      MOCK_STATE.athleteManagementSlice.searchQuery
    );
  });

  it('should return the correct value from getCurrentStatus()', () => {
    expect(getCurrentStatus(MOCK_STATE)).toBe(
      MOCK_STATE.athleteManagementSlice.statuses
    );
  });
});
