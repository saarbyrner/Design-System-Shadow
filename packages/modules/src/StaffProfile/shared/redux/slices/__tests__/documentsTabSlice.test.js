import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import documentsTabSlice, {
  onOpenDocumentSidePanel,
  onCloseDocumentSidePanel,
  onResetSidePanelForm,
  onUpdateDocumentForm,
  onSetMode,
  onUpdateFilter,
} from '../documentsTabSlice';

describe('documentsTabSlice', () => {
  const initialState = {
    documentSidePanel: {
      isOpen: false,
      mode: MODES.CREATE,
      form: {
        filename: '',
        organisation_generic_document_categories: [],
        attachment: null,
        document_date: null,
        expires_at: null,
        document_note: '',
      },
    },
    filters: {
      search: '',
      organisation_generic_document_categories: [],
      statuses: [],
    },
  };

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(documentsTabSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on onOpenDocumentSidePanel', () => {
    const action = onOpenDocumentSidePanel();

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      documentSidePanel: {
        ...initialState.documentSidePanel,
        isOpen: true,
      },
    });
  });

  it('should correctly update state on onCloseDocumentSidePanel', () => {
    let action = onOpenDocumentSidePanel();

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      documentSidePanel: {
        ...initialState.documentSidePanel,
        isOpen: true,
      },
    });

    action = onCloseDocumentSidePanel();

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      documentSidePanel: {
        ...initialState.documentSidePanel,
        isOpen: false,
      },
    });
  });

  it('should correctly update state on onResetSidePanelForm', () => {
    const action = onResetSidePanelForm();

    expect(documentsTabSlice.reducer(initialState, action)).toEqual(
      initialState
    );
  });

  it('should correctly update state on onUpdateDocumentForm', () => {
    const action = onUpdateDocumentForm({ filename: 'test name' });

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      documentSidePanel: {
        isOpen: false,
        mode: MODES.CREATE,
        form: {
          ...initialState.documentSidePanel.form,
          filename: 'test name',
        },
      },
    });
  });

  it('should correctly update state on onUpdateFilter - categories', () => {
    const action = onUpdateFilter({
      key: 'organisation_generic_document_categories',
      value: [1, 2],
    });

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        organisation_generic_document_categories: [1, 2],
      },
    });
  });

  it('should correctly update state on onUpdateFilter - search', () => {
    const action = onUpdateFilter({ key: 'search', value: 'test' });

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        search: 'test',
      },
    });
  });

  it('should correctly update state on onUpdateFilter - status', () => {
    const action = onUpdateFilter({ key: 'statuses', value: ['active'] });

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        statuses: ['active'],
      },
    });
  });

  it('should correctly update state on onSetMode', () => {
    const action = onSetMode({ mode: MODES.EDIT });

    expect(documentsTabSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      documentSidePanel: {
        ...initialState.documentSidePanel,
        mode: MODES.EDIT,
      },
    });
  });
});
