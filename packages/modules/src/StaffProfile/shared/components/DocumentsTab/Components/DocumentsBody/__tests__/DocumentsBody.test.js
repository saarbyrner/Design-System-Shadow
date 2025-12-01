import { screen, fireEvent } from '@testing-library/react';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { data as documentsData } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import { DocumentsBodyTranslated as DocumentsBody } from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

describe('<DocumentsBody />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    handleOnClosePanel: jest.fn(),
  };
  const documents = documentsData.documents;
  const documentsMap = {
    1: documents[0],
    2: documents[1],
    3: documents[2],
    4: documents[3],
    5: documents[4],
    6: documents[5],
    7: documents[6],
    8: documents[7],
    9: documents[8],
    10: documents[9],
  };

  const localState = {
    genericDocumentsSlice: {
      genericDocuments: documentsMap,
      genericDocumentsCategories: [],
    },
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: { canManageStaffUsers: true },
      },
    });
  });

  const actionButtonLabelText = 'options-button';

  it('renders content of the documents data grid', () => {
    renderWithProviders(<DocumentsBody {...props} />, {
      preloadedState: localState,
    });

    // Columns
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Issue date')).toBeInTheDocument();
    expect(screen.getByText('Expiry date')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Rows
    expect(screen.getAllByRole('row')).toHaveLength(11);
    expect(screen.getByText('Example Document 1')).toBeInTheDocument();
    expect(screen.getAllByText('Certificate')).toHaveLength(10);
    expect(screen.queryAllByText('test_pdf.PDF')).toHaveLength(10);
    expect(screen.getAllByText('Active')).toHaveLength(8);
    expect(screen.getAllByText('Expired')).toHaveLength(2);
    expect(screen.getByText('This is a note example.')).toBeInTheDocument();
    expect(screen.getAllByLabelText(actionButtonLabelText)).toHaveLength(10);
  });

  it('renders empty table label if there are no documents to display', () => {
    renderWithProviders(<DocumentsBody {...props} />, {
      preloadedState: {
        genericDocumentsSlice: {
          genericDocuments: {},
        },
      },
    });

    expect(screen.getByText('No documents found')).toBeInTheDocument();
  });

  it('renders loading spinner if request is loading', () => {
    renderWithProviders(<DocumentsBody {...props} isLoading />, {
      preloadedState: {
        genericDocumentsSlice: {
          genericDocuments: {},
        },
      },
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error message if request failed', () => {
    renderWithProviders(<DocumentsBody {...props} isError />, {
      preloadedState: {
        genericDocumentsSlice: {
          genericDocuments: {},
        },
      },
    });

    expect(
      screen.getByText('Error connecting to the database. Please try again')
    ).toBeInTheDocument();
  });

  it('does not render action column if the user does not have edit permissions', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: { canManageStaffUsers: false },
      },
    });
    renderWithProviders(<DocumentsBody {...props} />, {
      preloadedState: localState,
    });
    expect(
      screen.queryByLabelText(actionButtonLabelText)
    ).not.toBeInTheDocument();
  });

  it('renders notes tooltip on hover', async () => {
    renderWithProviders(<DocumentsBody {...props} />, {
      preloadedState: localState,
    });

    // Find the cell with the documents[0].document_note content
    const cell = screen.getByText(documents[0].document_note);

    // Simulate hover over the cell
    await fireEvent.mouseOver(cell);

    // Wait for the tooltip to appear
    const tooltip = await screen.findByRole('tooltip');

    // Assert that the tooltip content is correct
    expect(tooltip).toHaveTextContent(documents[0].document_note);
  });
});
