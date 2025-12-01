import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { Provider } from 'react-redux';
import { entityAttachments } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/mocks/entityAttachments.mock';
import FilesTable from '..';
import {
  medicalFiles,
  entityAttachments as entityFiles,
} from './mocks/filesData.mock';

const store = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
  medicalApi: {},
});

describe('<FilesTable/>', () => {
  const props = {
    onReachingEnd: jest.fn(),
    documents: medicalFiles,
    hasMoreDocuments: false,
    issueId: null,
    showPlayerColumn: true,
    setShowArchiveModal: jest.fn(),
    setSelectedRow: jest.fn(),
    setIsPanelOpen: jest.fn(),
    setIsEditing: jest.fn(),
    showActions: true,
    allAttachmentsChecked: false,
    updateAllAttachments: jest.fn(),
    exportAttachments: [{ id: 2 }],
    updateAttachment: jest.fn(),
    permissions: DEFAULT_CONTEXT_VALUE.permissions,
    requestStatus: 'SUCCESS',
    nextPage: null,
    t: i18nextTranslateStub(),
  };

  const renderComponent = (additionalProps) => {
    return render(
      <Provider store={store}>
        <FilesTable {...props} {...additionalProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('Basic component tests', () => {
    it('renders the table', () => {
      renderComponent({});
      const dataTable = screen.getByRole('table');
      expect(dataTable).toBeInTheDocument();
      expect(dataTable.className).toMatch(/dataTable/);
    });

    it('renders all roster level columns', () => {
      renderComponent();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toEqual(6);

      const headerTexts = headers.map((header) => header.textContent);
      expect(headerTexts).toEqual([
        'Player',
        'Title',
        'File name',
        'Upload date',
        'Category',
        'Associated injury/illness',
      ]);
    });

    it('renders all player level columns when player column is hidden', () => {
      renderComponent({ showPlayerColumn: false });

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toEqual(6);

      const headerTexts = headers.map((header) => header.textContent);
      expect(headerTexts).toEqual([
        'Title',
        'File name',
        'Upload date',
        'Category',
        'Associated injury/illness',
        'Note',
      ]);
    });

    it('does not render player and injury columns when showPlayerColumn is false and issueId is present', () => {
      renderComponent({ showPlayerColumn: false, issueId: 1 });

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toEqual(5);

      const headerTexts = headers.map((header) => header.textContent);
      expect(headerTexts).not.toContain('Player');
      expect(headerTexts).not.toContain('Associated injury/illness');
    });

    it('renders two rows of test data', () => {
      renderComponent();

      const rows = screen.getAllByRole('row');
      // 1 header row + 2 data rows
      expect(rows.length).toEqual(3);

      // Check that two data rows exist
      expect(rows[1]).toBeInTheDocument();
      expect(rows[2]).toBeInTheDocument();
    });

    it('renders archive action column', () => {
      window.featureFlags['medical-documents-files-area'] = true;

      renderComponent({
        permissions: {
          medical: {
            documents: {
              canArchive: true,
            },
          },
        },
      });

      const headers = screen.getAllByRole('columnheader');
      expect(headers.some((header) => header.textContent === '')).toBe(true);
    });

    it('does not render the checkbox column when FF is off', () => {
      // Ensure the feature flag is off
      window.featureFlags['export-multi-doc'] = false;

      renderComponent();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(6); // Ensure there are 6 columns

      // Verify that the parent checkbox is not rendered
      const parentCheckbox = screen.queryByTestId('ExportControl|Parent');
      expect(parentCheckbox).not.toBeInTheDocument();

      // Verify that child checkboxes are not rendered
      const childCheckboxChecked = screen.queryByTestId('Export|Child|1');
      const childCheckboxNotChecked = screen.queryByTestId('Export|Child|2');
      expect(childCheckboxChecked).not.toBeInTheDocument();
      expect(childCheckboxNotChecked).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] export-multi-doc', () => {
    beforeEach(() => {
      window.featureFlags['export-multi-doc'] = true;
    });

    afterEach(() => {
      window.featureFlags['export-multi-doc'] = false;
    });

    it('renders the checkbox header', async () => {
      renderComponent({ showActions: true, allAttachmentsChecked: false });

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(7);

      const { getByRole } = within(headers[0]);
      const checkbox = getByRole('checkbox');

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('renders the checkbox header as checked when allAttachmentsChecked is true', () => {
      renderComponent({ showActions: true, allAttachmentsChecked: true });

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(7);

      const { getByRole } = within(headers[0]);
      const checkbox = getByRole('checkbox');

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    it('renders the checkbox column correctly', () => {
      renderComponent({
        documents: [
          {
            attachmentId: 1,
            athlete: { fullname: 'John Doe', id: 123 },
            attachment: {
              id: 1,
              name: 'Doc 1',
              filename: 'doc1.pdf',
              filetype: 'pdf',
            },
            illness_occurrences: [],
            injury_occurrences: [],
            chronic_issues: [],
            document_categories: [],
            isChecked: false,
          },
          {
            attachmentId: 2,
            athlete: { fullname: 'Jane Smith', id: 456 },
            attachment: {
              id: 2,
              name: 'Doc 2',
              filename: 'doc2.pdf',
              filetype: 'pdf',
            },
            illness_occurrences: [],
            injury_occurrences: [],
            chronic_issues: [],
            document_categories: [],
            isChecked: true,
          },
        ],
      });

      // Get only the first two rows in the table (header row and first data row)
      const rows = screen.getAllByRole('row').slice(0, 3);

      // Validate the first child checkbox (attachmentId: 1)
      const firstRow = within(rows[1]); // First data row
      const firstCheckbox = firstRow.getByRole('checkbox');
      expect(firstCheckbox).toBeInTheDocument();
      expect(firstCheckbox).not.toBeChecked();

      // Validate the second child checkbox (attachmentId: 2)
      const secondRow = within(rows[2]); // Second data row
      const secondCheckbox = secondRow.getByRole('checkbox');
      expect(secondCheckbox).toBeInTheDocument();
      expect(secondCheckbox).toBeChecked();
    });

    it('does not render the checkboxes when it is in archive mode', () => {
      renderComponent({ showActions: false });

      const columns = screen.getAllByRole('columnheader');
      expect(columns.length).toBe(6);

      // Parent checkbox is not rendered
      expect(
        screen.queryByTestId('ExportControl|Parent')
      ).not.toBeInTheDocument();

      // Child checkboxes are not rendered
      const rows = screen.getAllByRole('row').slice(1); // Exclude the header row
      rows.forEach((row) => {
        const { queryByRole } = within(row);
        expect(queryByRole('checkbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('[FEATURE FLAG] - medical-files-sort-by-doc-date', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-sort-by-doc-date'] = true;
      window.featureFlags['medical-files-tab-enhancement'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-files-sort-by-doc-date'] = false;
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('renders Document date instead of Upload date and Documents not documents-v2', () => {
      renderComponent({ documents: entityFiles });
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const headers = tableDisplay.getAllByRole('columnheader');
      expect(headers[3]).toHaveTextContent('Date of Document');

      const rows = tableDisplay.getAllByRole('row');
      expect(rows.length).toEqual(3);

      const cellsR1 = within(rows[1]).getAllByRole('cell');
      expect(cellsR1[3]).toHaveTextContent('Feb 24, 2023');
      expect(cellsR1[6]).toHaveTextContent('Documents');

      const cellsR2 = within(rows[2]).getAllByRole('cell');
      expect(cellsR2[3]).toHaveTextContent('Feb 25, 2023');
      expect(cellsR2[6]).toHaveTextContent('Test title');
    });
  });

  describe('[feature-flag] medical-files-tab-enhancement false', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('renders expected roster level columns', () => {
      renderComponent();
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const headers = tableDisplay.getAllByRole('columnheader');
      expect(headers.length).toEqual(6);
      expect(headers[0]).toHaveTextContent('Player');
      expect(headers[1]).toHaveTextContent('Title');
      expect(headers[2]).toHaveTextContent('File name');
      expect(headers[3]).toHaveTextContent('Upload date');
      expect(headers[4]).toHaveTextContent('Category');
      expect(headers[5]).toHaveTextContent('Associated injury/illness');
    });

    it('renders expected roster level rows', () => {
      renderComponent();
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const rows = tableDisplay.getAllByRole('row');
      expect(rows.length).toEqual(3);

      expect(within(rows[1]).getByAltText('J')).toBeInTheDocument(); // Check for avatar image via alt text
      const cellsR1 = within(rows[1]).getAllByRole('cell');
      expect(cellsR1.length).toEqual(6);

      expect(cellsR1[0]).toHaveTextContent('John Doe');
      expect(cellsR1[1]).toHaveTextContent('');
      expect(cellsR1[2]).toHaveTextContent('testFile.pdf');
      expect(cellsR1[3]).toHaveTextContent('Feb 28, 2023');
      expect(cellsR1[4]).toHaveTextContent('Misc');
      expect(cellsR1[5]).toHaveTextContent('-');

      expect(within(rows[2]).getByAltText('J')).toBeInTheDocument(); // Check for avatar image via alt text
      const cellsR2 = within(rows[2]).getAllByRole('cell');
      expect(cellsR2.length).toEqual(6);
      expect(cellsR2[0]).toHaveTextContent('Jane DoeLeft Back');
      expect(cellsR2[1]).toHaveTextContent('');
      expect(cellsR2[2]).toHaveTextContent('testFile.pdf');
      expect(cellsR2[3]).toHaveTextContent('Feb 28, 2023');
      expect(cellsR2[4]).toHaveTextContent('Scan');
      expect(cellsR2[5]).toHaveTextContent('-');
    });
  });

  describe('[feature-flag] medical-files-tab-enhancement true', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = true;
    });
    afterEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });
    it('renders expected roster level columns including Source', () => {
      renderComponent();
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const headers = tableDisplay.getAllByRole('columnheader');
      expect(headers.length).toEqual(7);
      expect(headers[0]).toHaveTextContent('Player');
      expect(headers[1]).toHaveTextContent('Title');
      expect(headers[2]).toHaveTextContent('File name');
      expect(headers[3]).toHaveTextContent('Upload date');
      expect(headers[4]).toHaveTextContent('Category');
      expect(headers[5]).toHaveTextContent('Associated injury/illness');
      expect(headers[6]).toHaveTextContent('Source');
    });

    it('renders expected roster level rows', () => {
      renderComponent();
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const rows = tableDisplay.getAllByRole('row');
      expect(rows.length).toEqual(3);

      expect(within(rows[1]).getByAltText('J')).toBeInTheDocument(); // Check for avatar image via alt text
      const cellsR1 = within(rows[1]).getAllByRole('cell');
      expect(cellsR1.length).toEqual(7);

      expect(cellsR1[0]).toHaveTextContent('John Doe');
      expect(cellsR1[1]).toHaveTextContent('');
      expect(cellsR1[2]).toHaveTextContent('testFile.pdf');
      expect(cellsR1[3]).toHaveTextContent('Feb 28, 2023');
      expect(cellsR1[4]).toHaveTextContent('Misc');
      expect(cellsR1[5]).toHaveTextContent('-');
      expect(cellsR1[6]).toHaveTextContent('-');

      expect(within(rows[2]).getByAltText('J')).toBeInTheDocument(); // Check for avatar image via alt text
      const cellsR2 = within(rows[2]).getAllByRole('cell');
      expect(cellsR2.length).toEqual(7);

      expect(cellsR2[0]).toHaveTextContent('Jane DoeLeft Back');
      expect(cellsR2[1]).toHaveTextContent('');
      expect(cellsR2[2]).toHaveTextContent('testFile.pdf');
      expect(cellsR2[3]).toHaveTextContent('Feb 28, 2023');
      expect(cellsR2[4]).toHaveTextContent('Scan');
      expect(cellsR2[5]).toHaveTextContent('-');
      expect(cellsR2[6]).toHaveTextContent('-');
    });

    it('should set query param correctly on title', () => {
      renderComponent();

      expect(screen.getAllByRole('link')[1]).toHaveAttribute(
        'href',
        '/medical/documents/1?isV2Document=true'
      );
    });
  });

  describe('[MEDICAL TRIAL]', () => {
    beforeEach(() => {
      window.featureFlags['medical-documents-files-area'] = true;
    });
    afterEach(() => {
      window.featureFlags['medical-documents-files-area'] = false;
    });

    it('renders expected roster level columns', () => {
      const component = renderComponent({
        permissions: {
          ...props.permissions,
          medical: {
            ...props.permissions.medical,
            documents: {
              canView: true,
              canCreate: true,
              canArchive: true,
              canEdit: true,
            },
          },
        },
      });

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const headers = tableDisplay.getAllByRole('columnheader');
      expect(headers.length).toEqual(7);

      expect(headers[0]).toHaveTextContent('Player');
      expect(headers[1]).toHaveTextContent('Title');
      expect(headers[2]).toHaveTextContent('File name');
      expect(headers[3]).toHaveTextContent('Upload date');
      expect(headers[4]).toHaveTextContent('Category');
      expect(headers[5]).toHaveTextContent('Associated injury/illness');

      // only way to access action buttons
      const tooltip = component.container.querySelector('.icon-more');
      expect(tooltip).toBeInTheDocument();
    });

    it('does not rend actions column', () => {
      const component = renderComponent({
        permissions: {
          ...props.permissions,
          medical: {
            ...props.permissions.medical,
            documents: {
              canView: true,
              canCreate: true,
              canArchive: true,
              canEdit: true,
            },
          },
        },
        hiddenFilters: ['add_medical_file_button'],
      });

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const tableDisplay = within(table);

      const headers = tableDisplay.getAllByRole('columnheader');
      expect(headers.length).toEqual(6);

      expect(headers[0]).toHaveTextContent('Player');
      expect(headers[1]).toHaveTextContent('Title');
      expect(headers[2]).toHaveTextContent('File name');
      expect(headers[3]).toHaveTextContent('Upload date');
      expect(headers[4]).toHaveTextContent('Category');
      expect(headers[5]).toHaveTextContent('Associated injury/illness');

      // only way to access action buttons
      const tooltip = component.container.querySelector('.icon-more');
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  describe('actions tooltip', () => {
    beforeEach(() => {
      window.featureFlags['medical-documents-files-area'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-documents-files-area'] = false;
    });

    describe('[feature-flag] medical-files-tab-enhancement true', () => {
      beforeEach(() => {
        window.featureFlags['medical-files-tab-enhancement'] = true;
      });

      afterEach(() => {
        window.featureFlags['medical-files-tab-enhancement'] = false;
      });

      it('should render Archive action button if has allowed entity type', async () => {
        const component = renderComponent({
          documents: [
            {
              ...entityAttachments[0],
              entity: {
                ...entityAttachments[0].entity,
                entity_type: 'document_v2',
              },
            },
          ],
          permissions: {
            ...props.permissions,
            medical: {
              ...props.permissions.medical,
              documents: {
                canView: true,
                canCreate: true,
                canArchive: true,
                canEdit: true,
              },
            },
          },
          hiddenFilters: [],
        });
        // only way to access action buttons
        const tooltip = component.container.querySelector('.icon-more');
        expect(tooltip).toBeInTheDocument();

        fireEvent.click(tooltip);

        await waitFor(() => {
          expect(screen.getByText('Archive')).toBeInTheDocument();
          expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });
      });

      it('should not render action buttons if not allowed entity type', () => {
        const component = renderComponent({
          documents: [
            {
              ...entityAttachments[0],
              entity: {
                ...entityAttachments[0].entity,
                entity_type: 'something_else',
              },
            },
          ],
          permissions: {
            ...props.permissions,
            medical: {
              ...props.permissions.medical,
              documents: {
                canView: true,
                canCreate: true,
                canArchive: true,
                canEdit: true,
              },
            },
          },
          hiddenFilters: [],
        });

        // only way to access action buttons
        const tooltip = component.container.querySelector('.icon-more');
        expect(tooltip).not.toBeInTheDocument();
      });
    });

    describe('[feature-flag] medical-files-tab-enhancement false', () => {
      beforeEach(() => {
        window.featureFlags['medical-files-tab-enhancement'] = false;
      });

      it('should render Archive & Edit action buttons', async () => {
        const component = renderComponent({
          documents: [
            {
              ...entityAttachments[0],
              entity: {
                ...entityAttachments[0].entity,
                entity_type: 'something_else',
              },
            },
          ],
          permissions: {
            ...props.permissions,
            medical: {
              ...props.permissions.medical,
              documents: {
                canView: true,
                canCreate: true,
                canArchive: true,
                canEdit: true,
              },
            },
          },
          hiddenFilters: [],
        });

        // only way to access action buttons
        const tooltip = component.container.querySelector('.icon-more');
        expect(tooltip).toBeInTheDocument();

        fireEvent.click(tooltip);

        await waitFor(() => {
          expect(screen.getByText('Archive')).toBeInTheDocument();
          expect(screen.getByText('Edit')).toBeInTheDocument();
        });
      });
    });
  });
});
