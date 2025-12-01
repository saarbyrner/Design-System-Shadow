import { REDUCER_KEY as disciplinaryIssueSlice } from '../../slices/disciplinaryIssueSlice';

import {
  getIsCreatePanelOpen,
  getIsUpdatePanelOpen,
  getDisciplineProfile,
  getDisciplineProfileId,
  getDisciplinaryIssueMode,
} from '../disciplinaryIssueSelectors';

const MOCK_STATE = {
  [disciplinaryIssueSlice]: {
    panel: {
      isOpen: false,
      profile: {
        id: 1,
        name: 'something',
      },
      mode: 'EDIT',
    },
  },
};

describe('[disciplinaryIssueSelectors] - selectors', () => {
  test('getIsCreatePanelOpen()', () => {
    expect(getIsCreatePanelOpen(MOCK_STATE)).toStrictEqual(false);
  });
  test('getIsUpdatePanelOpen()', () => {
    expect(getIsUpdatePanelOpen(MOCK_STATE)).toStrictEqual(false);
  });
  test('getDisciplineProfile()', () => {
    expect(getDisciplineProfile(MOCK_STATE)).toStrictEqual({
      id: 1,
      name: 'something',
    });
  });
  test('getDisciplineProfileId()', () => {
    expect(getDisciplineProfileId(MOCK_STATE)).toStrictEqual(1);
  });
  test('getDisciplinaryIssueMode()', () => {
    expect(getDisciplinaryIssueMode(MOCK_STATE)).toStrictEqual('EDIT');
  });
});
