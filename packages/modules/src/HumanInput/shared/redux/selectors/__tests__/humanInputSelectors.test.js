import {
  getExportSidePanelState,
  getIsOpenExportSidePanelFactory,
} from '../humanInputSelectors';

const MOCK_STATE = {
  humanInputSlice: {
    exportSidePanel: {
      isOpen: true,
    },
  },
};

describe('[humanInputSelectors] - selectors', () => {
  test('getExportSidePanelState()', () => {
    expect(getExportSidePanelState(MOCK_STATE)).toBe(
      MOCK_STATE.humanInputSlice.exportSidePanel
    );
  });

  test('getIsOpenExportSidePanelFactory()', () => {
    const selector = getIsOpenExportSidePanelFactory();
    expect(selector(MOCK_STATE)).toStrictEqual(true);
  });
});
