import { getDefaultColumns } from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Columns';
import {
  GRID_ROW_FIELD_KEYS as FIELD_KEYS,
  DOCUMENT_SPLITTER_USAGE,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import IssuesCell from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/IssuesCell';

jest.mock(
  '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/IssuesCell',
  () => ({
    __esModule: true,
    default: jest.fn(() => null), // Mock IssuesCell to return null for snapshot testing
  })
);

describe('getDefaultColumns', () => {
  const defaultColumnProps = {
    onUpdateRowCallback: jest.fn(),
    onDeleteRowCallback: jest.fn(),
    validationResults: {},
    players: [],
    isPlayerPreselected: false,
    documentCategories: [],
    isFetchingPlayers: false,
    isFetchingDocumentCategories: false,
    shouldDisable: false,
    usage: DOCUMENT_SPLITTER_USAGE.massScanning,
  };

  const columnsOrder = [
    { key: FIELD_KEYS.pages, headerName: 'Pages' },
    { key: FIELD_KEYS.player, headerName: 'Player' },
    { key: FIELD_KEYS.categories, headerName: 'Categories' },
    { key: FIELD_KEYS.fileName, headerName: 'File name' },
    { key: FIELD_KEYS.dateOfDocument, headerName: 'Date of document' },
    { key: FIELD_KEYS.actions, headerName: null },
  ];

  it('has the correct number of columns by default', () => {
    const columns = getDefaultColumns(defaultColumnProps);
    expect(columns.length).toEqual(columnsOrder.length);
  });

  it.each(columnsOrder.filter((column) => column.key !== FIELD_KEYS.actions))(
    'has expected properties for column %s',
    ({ key, headerName }) => {
      const columns = getDefaultColumns(defaultColumnProps);
      const column = columns.find((col) => col.field === key);
      expect(column).toMatchObject({
        field: key,
        sortable: false,
        visible: true,
        headerName,
      });
    }
  );

  it('has expected properties for actions column', () => {
    const columns = getDefaultColumns(defaultColumnProps);
    const actionsColumn = columns.find(
      (column) => column.field === FIELD_KEYS.actions
    );
    expect(actionsColumn).toMatchObject({
      field: FIELD_KEYS.actions,
      type: 'actions',
      visible: true,
      sortable: false,
    });
    expect(actionsColumn).toHaveProperty('getActions');
  });

  describe('[feature-flag] pm-mass-scan-with-issue', () => {
    beforeEach(() => {
      window.setFlag('pm-mass-scan-with-issue', true);
    });

    afterEach(() => {
      window.setFlag('pm-mass-scan-with-issue', false);
    });

    it('includes associated issues column when flag is true', () => {
      const columns = getDefaultColumns(defaultColumnProps);
      expect(columns.length).toEqual(columnsOrder.length + 1); // +1 for associatedIssues
      const associatedIssuesColumn = columns.find(
        (column) => column.field === FIELD_KEYS.associatedIssues
      );
      expect(associatedIssuesColumn).toBeDefined();
      expect(associatedIssuesColumn).toMatchObject({
        field: FIELD_KEYS.associatedIssues,
        headerName: 'Associated injury/illness',
        minWidth: 310,
        visible: true,
        sortable: false,
      });
      expect(associatedIssuesColumn).toHaveProperty('renderCell');
      // Verify that IssuesCell is used for rendering
      const issuesCellElement = associatedIssuesColumn.renderCell({
        id: '1',
        row: {},
      });
      expect(issuesCellElement.type).toBe(IssuesCell);
      expect(issuesCellElement.props).toEqual(
        expect.objectContaining({
          params: { id: '1', row: {} },
          onUpdateRowCallback: defaultColumnProps.onUpdateRowCallback,
          shouldShowError: false,
          shouldDisable: false,
        })
      );
    });

    it('does not include associated issues column when flag is false', () => {
      window.setFlag('pm-mass-scan-with-issue', false); // Explicitly set flag to false
      const columns = getDefaultColumns(defaultColumnProps);
      expect(columns.length).toEqual(columnsOrder.length);
      const associatedIssuesColumn = columns.find(
        (column) => column.field === FIELD_KEYS.associatedIssues
      );
      expect(associatedIssuesColumn).toBeUndefined();
    });
  });

  describe('[feature-flag] pm-efax-with-issue', () => {
    beforeEach(() => {
      window.setFlag('pm-efax-with-issue', true);
    });

    afterEach(() => {
      window.setFlag('pm-efax-with-issue', false);
    });

    it('includes associated issues column when flag is true and usage is electronicFiles', () => {
      const columns = getDefaultColumns({
        ...defaultColumnProps,
        usage: DOCUMENT_SPLITTER_USAGE.electronicFiles,
      });
      expect(columns.length).toEqual(columnsOrder.length + 1); // +1 for associatedIssues
      const associatedIssuesColumn = columns.find(
        (column) => column.field === FIELD_KEYS.associatedIssues
      );
      expect(associatedIssuesColumn).toBeDefined();
      expect(associatedIssuesColumn).toMatchObject({
        field: FIELD_KEYS.associatedIssues,
        headerName: 'Associated injury/illness',
        minWidth: 310,
        visible: true,
        sortable: false,
      });
      expect(associatedIssuesColumn).toHaveProperty('renderCell');
      // Verify that IssuesCell is used for rendering
      const issuesCellElement = associatedIssuesColumn.renderCell({
        id: '1',
        row: {},
      });
      expect(issuesCellElement.type).toBe(IssuesCell);
      expect(issuesCellElement.props).toEqual(
        expect.objectContaining({
          params: { id: '1', row: {} },
          onUpdateRowCallback: defaultColumnProps.onUpdateRowCallback,
          shouldShowError: false,
          shouldDisable: false,
        })
      );
    });

    it('does not include associated issues column when flag is false and usage is electronicFiles', () => {
      window.setFlag('pm-efax-with-issue', false); // Explicitly set flag to false
      const columns = getDefaultColumns({
        ...defaultColumnProps,
        usage: DOCUMENT_SPLITTER_USAGE.electronicFiles,
      });
      expect(columns.length).toEqual(columnsOrder.length);
      const associatedIssuesColumn = columns.find(
        (column) => column.field === FIELD_KEYS.associatedIssues
      );
      expect(associatedIssuesColumn).toBeUndefined();
    });
  });
});
