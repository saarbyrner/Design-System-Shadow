import {
  getDocumentSidePanelState,
  getDocumentFormState,
  getDocumentFormFactory,
  getIsOpenDocumentSidePanelFactory,
} from '../documentsTabSelectors';

const MOCK_STATE = {
  documentsTabSlice: {
    documentSidePanel: {
      isOpen: true,
      form: {},
    },
  },
};

describe('[documentsTabSlice] - selectors', () => {
  test('getExportSidePanelState()', () => {
    expect(getDocumentSidePanelState(MOCK_STATE)).toBe(
      MOCK_STATE.documentsTabSlice.documentSidePanel
    );
  });

  test('getDocumentFormState()', () => {
    expect(getDocumentFormState(MOCK_STATE)).toBe(
      MOCK_STATE.documentsTabSlice.documentSidePanel.form
    );
  });

  test('getIsOpenDocumentSidePanelFactory()', () => {
    const selector = getIsOpenDocumentSidePanelFactory();
    expect(selector(MOCK_STATE)).toStrictEqual(true);
  });

  test('getDocumentFormFactory()', () => {
    const selector = getDocumentFormFactory();
    expect(selector(MOCK_STATE)).toStrictEqual({});
  });
});
