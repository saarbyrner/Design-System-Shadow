import {
  selectKitManagementPanel,
  selectKitManagementModal,
  selectKitManagementSelectedRow,
} from '../kitManagementSelectors';
import { REDUCER_KEY } from '../../slice/kitManagementSlice';

describe('[kitManagementSelectors]', () => {
  const MOCK_PANEL = { isOpen: true };
  const MOCK_MODAL = { isOpen: false, mode: 'delete' };
  const MOCK_SELECTED_ROW = { id: 42, name: 'Kit 42' };

  const MOCK_STATE = {
    [REDUCER_KEY]: {
      panel: MOCK_PANEL,
      modal: MOCK_MODAL,
      selectedRow: MOCK_SELECTED_ROW,
    },
  };

  it('selectKitManagementPanel returns the panel state', () => {
    expect(selectKitManagementPanel(MOCK_STATE)).toBe(MOCK_PANEL);
  });

  it('selectKitManagementModal returns the modal state', () => {
    expect(selectKitManagementModal(MOCK_STATE)).toBe(MOCK_MODAL);
  });

  it('selectKitManagementSelectedRow returns the selectedRow state', () => {
    expect(selectKitManagementSelectedRow(MOCK_STATE)).toBe(MOCK_SELECTED_ROW);
  });

  it('returns undefined if kitManagement state is missing', () => {
    const EMPTY_STATE = {};
    expect(selectKitManagementPanel(EMPTY_STATE)).toBeUndefined();
    expect(selectKitManagementModal(EMPTY_STATE)).toBeUndefined();
    expect(selectKitManagementSelectedRow(EMPTY_STATE)).toBeUndefined();
  });

  it('returns undefined if panel/modal/selectedRow is missing', () => {
    const PARTIAL_STATE = { [REDUCER_KEY]: {} };
    expect(selectKitManagementPanel(PARTIAL_STATE)).toBeUndefined();
    expect(selectKitManagementModal(PARTIAL_STATE)).toBeUndefined();
    expect(selectKitManagementSelectedRow(PARTIAL_STATE)).toBeUndefined();
  });
});
