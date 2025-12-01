import { screen, within } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { rest, server } from '@kitman/services/src/mocks/server';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import Toasts from '@kitman/modules/src/Toasts';
import {
  useSearchDocumentsQuery,
  useFetchGenericDocumentsCategoriesQuery,
} from '@kitman/services/src/services/documents/generic';
import userEvent from '@testing-library/user-event';
import { data as documentsData } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import { data as genericDocumentCategoriesData } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';
import DocumentsTab from '..';

jest.mock('@kitman/services/src/services/documents/generic', () => ({
  ...jest.requireActual('@kitman/services/src/services/documents/generic'),
  useFetchGenericDocumentsCategoriesQuery: jest.fn(),
  useSearchDocumentsQuery: jest.fn(),
}));

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

describe('<DocumentsTab />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  const localState = {
    genericDocumentsSlice: {
      genericDocuments: {},
      genericDocumentsCategories: [],
    },
    toastsSlice: {
      value: [],
    },
  };

  beforeEach(() => {
    useSearchDocumentsQuery.mockReturnValue({
      data: documentsData,
      error: false,
      isLoading: false,
    });

    useFetchGenericDocumentsCategoriesQuery.mockReturnValue({
      data: genericDocumentCategoriesData,
      error: false,
      isLoading: false,
    });

    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: { canManageStaffUsers: true },
      },
    });
  });

  it('renders content of the documents data grid and filters', async () => {
    renderWithProviders(<DocumentsTab {...props} />, {
      preloadedState: localState,
    });

    const tableGrid = within(await screen.findByRole('grid'));

    // Table Columns
    expect(tableGrid.getByText('Document')).toBeInTheDocument();
    expect(tableGrid.getByText('Category')).toBeInTheDocument();
    expect(tableGrid.getByText('Issue date')).toBeInTheDocument();
    expect(tableGrid.getByText('Expiry date')).toBeInTheDocument();
    expect(tableGrid.getByText('Notes')).toBeInTheDocument();
    expect(tableGrid.getByText('Status')).toBeInTheDocument();

    // Table Rows
    expect(screen.getAllByRole('row')).toHaveLength(11);
    expect(screen.getByText('Example Document 1')).toBeInTheDocument();
    expect(screen.getAllByText('Certificate')).toHaveLength(10);
    expect(screen.queryAllByText('test_pdf.PDF')).toHaveLength(10);
    expect(screen.getAllByText('Active')).toHaveLength(8);
    expect(screen.getAllByText('Expired')).toHaveLength(2);
    expect(screen.getByText('This is a note example.')).toBeInTheDocument();
    expect(screen.getAllByLabelText('options-button')).toHaveLength(10);

    // Filters
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Category')[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText('Status')[0]).toBeInTheDocument();
  });

  it('renders empty table label if there are no documents to display', () => {
    useSearchDocumentsQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });

    renderWithProviders(<DocumentsTab {...props} />, {
      preloadedState: localState,
    });

    expect(screen.getByText('No documents found')).toBeInTheDocument();
  });

  it('opens side panel on CREATE mode when clicking Add button', async () => {
    renderWithProviders(<DocumentsTab {...props} />, {
      preloadedState: localState,
    });

    const addButton = screen.getByRole('button', { name: 'Add' });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    await userEvent.click(addButton);

    // check side panel fields empty (Create mode)
    expect(screen.getAllByText('Document')).toHaveLength(2);
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Category *')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Issue date' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Expiry date' })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('opens side panel on EDIT mode when clicking an action button on a specific row (edit)', async () => {
    renderWithProviders(<DocumentsTab {...props} />, {
      preloadedState: localState,
    });

    const actionButton = screen.getAllByRole('button', {
      name: 'options-button',
    })[0];

    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toBeEnabled();

    await userEvent.click(actionButton);

    const editMenu = screen.getByText('Edit');

    expect(editMenu).toBeInTheDocument();

    await userEvent.click(editMenu);

    expect(screen.getAllByText('Document')).toHaveLength(2);

    // check side panel fields with populated data from document 1
    expect(screen.getByDisplayValue('Example Document 1')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Issue date' })).toHaveValue(
      '03/08/2024'
    );
    expect(screen.getByRole('textbox', { name: 'Expiry date' })).toHaveValue(
      ''
    );
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue(
      'This is a note example.'
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeEnabled();
  });

  describe('archive document', () => {
    it('renders success toast when clicking archive action button on a specific row', async () => {
      server.use(
        rest.post('generic_documents/1/archive', (req, res, ctx) => {
          return res(ctx.json({}));
        })
      );

      renderWithProviders(
        <>
          <DocumentsTab {...props} />
          <Toasts />
        </>,
        {
          preloadedState: localState,
        }
      );

      const actionButton = screen.getAllByRole('button', {
        name: 'options-button',
      })[0];

      expect(actionButton).toBeInTheDocument();
      expect(actionButton).toBeEnabled();

      await userEvent.click(actionButton);

      const archiveButton = screen.getByText('Archive');

      expect(archiveButton).toBeInTheDocument();

      await userEvent.click(archiveButton);

      expect(
        screen.queryByText('Unable to archive document. Try again')
      ).not.toBeInTheDocument();

      expect(
        screen.getByText('Example Document 1 archived successfully')
      ).toBeInTheDocument();
    });

    it('renders error toast when clicking archive action button on a specific row', async () => {
      server.use(
        rest.post('generic_documents/1/archive', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      renderWithProviders(
        <>
          <DocumentsTab {...props} />
          <Toasts />
        </>,
        {
          preloadedState: localState,
        }
      );

      const actionButton = screen.getAllByRole('button', {
        name: 'options-button',
      })[0];

      expect(actionButton).toBeInTheDocument();
      expect(actionButton).toBeEnabled();

      await userEvent.click(actionButton);

      const archiveButton = screen.getByText('Archive');

      expect(archiveButton).toBeInTheDocument();

      await userEvent.click(archiveButton);

      expect(
        screen.queryByText('Example Document 1 archived successfully')
      ).not.toBeInTheDocument();

      expect(
        screen.getByText('Unable to archive document. Try again')
      ).toBeInTheDocument();
    });
  });
});
