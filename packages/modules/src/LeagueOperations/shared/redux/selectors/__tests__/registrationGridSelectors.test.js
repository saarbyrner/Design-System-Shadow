import { MOCK_REGISTRATION_GRIDS } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import {
  getGrids,
  getModal,
  getSelectedRow,
  getBulkActionsState,
  getSelectedLabelIds,
  getOriginalSelectedLabelIds,
  getSelectedAthleteIds,
} from '../registrationGridSelectors';

const MOCK_BULK_ACTIONS = {
  selectedLabelIds: [1, 2, 3],
  originalSelectedLabelIds: [1, 2],
  selectedAthleteIds: [101, 102],
};

const MOCK_STATE = {
  'LeagueOperations.registration.slice.grids': {
    grids: MOCK_REGISTRATION_GRIDS,
    modal: true,
    selectedRow: { id: 1, name: 'Row 1' },
    bulkActions: MOCK_BULK_ACTIONS,
  },
};

describe('[registrationGridSelectors] - selectors', () => {
  test('getProfile()', () => {
    expect(getGrids(MOCK_STATE)).toStrictEqual(MOCK_REGISTRATION_GRIDS);
  });

  test('getModal()', () => {
    expect(getModal(MOCK_STATE)).toBe(true);
  });

  test('getSelectedRow()', () => {
    expect(getSelectedRow(MOCK_STATE)).toStrictEqual({ id: 1, name: 'Row 1' });
  });

  test('getBulkActionsState()', () => {
    expect(getBulkActionsState(MOCK_STATE)).toStrictEqual(MOCK_BULK_ACTIONS);
  });

  test('getSelectedLabelIds()', () => {
    expect(getSelectedLabelIds(MOCK_STATE)).toStrictEqual([1, 2, 3]);
  });

  test('getOriginalSelectedLabelIds()', () => {
    expect(getOriginalSelectedLabelIds(MOCK_STATE)).toStrictEqual([1, 2]);
  });

  test('getSelectedAthleteIds()', () => {
    expect(getSelectedAthleteIds(MOCK_STATE)).toStrictEqual([101, 102]);
  });
});
