import {
  screen,
  render,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { Provider } from 'react-redux';
import useDocuments from '@kitman/modules/src/Medical/shared/hooks/useDocuments';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import OshaCard from '../index';
import { getPathologyTitle } from '../../../../../shared/utils';

jest.mock('../../../../../shared/utils');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useDocuments');

const props = {
  t: i18nextTranslateStub(),
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = storeFake({
  addOshaFormSidePanel: {
    showPrintPreview: {
      card: false,
      sidePanel: false,
    },
  },
});

const mockStoreWithPrintPreview = storeFake({
  addOshaFormSidePanel: {
    showPrintPreview: {
      card: true,
      sidePanel: false,
    },
  },
});

const getMockedPermissionsContextValue = (
  canEdit = false,
  canView = true,
  canViewDocuments = false
) => ({
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
      issues: {
        canEdit: true,
      },
      osha: {
        canEdit,
        canView,
      },
      documents: {
        canView: canViewDocuments,
      },
    },
  },
  permissionsRequestStatus: 'SUCCESS',
});

const renderWithContext = (
  mockedIssueContext,
  mockedPermissionsContext,
  store = mockStore
) => {
  return render(
    <Provider store={store}>
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContext}
      >
        <MockedIssueContextProvider issueContext={mockedIssueContext}>
          <OshaCard {...props} />
        </MockedIssueContextProvider>
      </MockedPermissionContextProvider>
    </Provider>
  );
};

const useDispatchMock = jest.fn();
mockStore.dispatch = useDispatchMock;

describe('Osha Card', () => {
  beforeEach(() => {
    useDocuments.mockReturnValue({
      documents: [],
      fetchDocuments: jest.fn().mockResolvedValue('SUCCESS'),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders once an issue is created', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          osha: {
            ...mockedIssueContextValue.issue.osha,
            status: 'draft',
          },
        },
      },
      getMockedPermissionsContextValue()
    );

    const oshaCardContainer = await screen.findByTestId('OshaCard|Container');
    expect(oshaCardContainer).toBeInTheDocument();
    expect(screen.getByTestId('OshaCard|Title')).toHaveTextContent('OSHA');
    expect(screen.getByText('OSHA - 01/13/2022')).toBeInTheDocument();
    expect(screen.getByText('Reporter full name')).toBeInTheDocument();
    expect(screen.getByText('Last edited on:')).toBeInTheDocument();
    expect(screen.getByText('Last edited by:')).toBeInTheDocument();
  });

  it('should render In progress status when status on issue is draft', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          osha: {
            ...mockedIssueContextValue.issue.osha,
            status: 'draft',
          },
        },
      },
      getMockedPermissionsContextValue()
    );

    const oshaCardContainer = await screen.findByTestId('OshaCard|Container');
    expect(oshaCardContainer).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('should render Saved status when status on issue is submitted', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          osha: {
            ...mockedIssueContextValue.issue.osha,
            status: 'submitted',
          },
        },
      },
      getMockedPermissionsContextValue()
    );

    const oshaCardContainer = await screen.findByTestId('OshaCard|Container');
    expect(oshaCardContainer).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('should render edit button permission is canEdit and status is draft', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          osha: {
            ...mockedIssueContextValue.issue.osha,
            status: 'draft',
          },
        },
      },
      getMockedPermissionsContextValue(true, true)
    );

    const oshaCardContainer = await screen.findByTestId('OshaCard|Container');
    expect(oshaCardContainer).toBeInTheDocument();

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('Print')).not.toBeInTheDocument();
  });

  it('should render just the print button if permission is canView and status is not draft', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          osha: {
            ...mockedIssueContextValue.issue.osha,
            status: 'submitted',
          },
        },
      },
      getMockedPermissionsContextValue(false, true)
    );

    const oshaCardContainer = await screen.findByTestId('OshaCard|Container');
    expect(oshaCardContainer).toBeInTheDocument();

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('should render OSHA - Date if pathology title doesnt exists', async () => {
    getPathologyTitle.mockReturnValue(undefined);

    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: mockedIssueContextValue.issue,
      },
      getMockedPermissionsContextValue()
    );

    await screen.findByTestId('OshaCard|Container');

    expect(screen.getByText('OSHA - 01/13/2022')).toBeInTheDocument();
  });

  it('should render OSHA - Pathology title - Date if pathology title exists', async () => {
    getPathologyTitle.mockReturnValue('Test pathology title');

    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: mockedIssueContextValue.issue,
      },
      getMockedPermissionsContextValue()
    );

    await screen.findByTestId('OshaCard|Container');

    expect(screen.getByTestId('OshaCard|Title')).toHaveTextContent(
      'OSHA - Test pathology title - 01/13/2022'
    );
  });

  it('should call openOshaFormSidePanel() on click of edit button', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: mockedIssueContextValue.issue,
      },
      getMockedPermissionsContextValue(true, true)
    );

    await screen.findByTestId('OshaCard|Container');
    fireEvent.click(screen.getByText('Edit'));

    expect(useDispatchMock).toHaveBeenCalledWith({
      type: 'OPEN_OSHA_FORM_SIDE_PANEL',
    });
  });

  describe('Printing logic', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const useDispatchMockUpdated = jest.fn();
    mockStoreWithPrintPreview.dispatch = useDispatchMockUpdated;

    it('should trigger print if showPrintPreview is true', async () => {
      jest.spyOn(window, 'print').mockImplementation(() => {});

      renderWithContext(
        mockedIssueContextValue,
        getMockedPermissionsContextValue(true, true),
        mockStoreWithPrintPreview
      );

      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });
    });

    it('should call dispatch to set showPrintPreview to true on click of print button', async () => {
      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true),
        mockStoreWithPrintPreview
      );

      fireEvent.click(screen.getByText('Print'));

      await waitFor(() => {
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(2, {
          showPrintPreview: true,
          type: 'PRINT_OSHA_FORM_FROM_CARD',
        });
      });
    });

    it('should call dispatch to set showPrintPreview to false on afterprint', async () => {
      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true),
        mockStoreWithPrintPreview
      );

      jest.spyOn(window, 'print').mockImplementation(() => {});

      await waitFor(() => {
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(1, {
          showPrintPreview: false,
          type: 'PRINT_OSHA_FORM_FROM_CARD',
        });
      });
    });
  });

  describe('PDF title link', () => {
    it('should render pdf document link with icon if document exists', () => {
      getPathologyTitle.mockReturnValue('Test pathology title');
      useDocuments.mockReturnValue({
        documents: [
          {
            attachment: {
              name: 'OSHA - Test pathology title - 01-13-2022',
            },
          },
        ],
        fetchDocuments: jest.fn().mockResolvedValue('SUCCESS'),
      });

      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      expect(
        screen.getByText('OSHA - Test pathology title - 01-13-2022.pdf')
      ).toBeInTheDocument();
      expect(screen.getByTestId('OshaCard|Icon')).toBeInTheDocument();
    });

    it('should render standard title without icon if document doesnt exist', () => {
      getPathologyTitle.mockReturnValue('Test pathology title');
      useDocuments.mockReturnValue({
        documents: [],
        fetchDocuments: jest.fn().mockResolvedValue('SUCCESS'),
      });

      const { container } = renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      expect(
        screen.getByText('OSHA - Test pathology title - 01/13/2022')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="OshaForm|Icon"]')
      ).not.toBeInTheDocument();
    });

    it('should NOT render pdf document link with icon if document exists but permission doesnt', () => {
      getPathologyTitle.mockReturnValue('Test pathology title');
      useDocuments.mockReturnValue({
        documents: [
          {
            attachment: {
              name: 'OSHA - Test pathology title - 01-13-2022',
            },
          },
        ],
        fetchDocuments: jest.fn().mockResolvedValue('SUCCESS'),
      });

      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true)
      );

      expect(
        screen.queryByText('OSHA - Test pathology title - 01-13-2022.pdf')
      ).not.toBeInTheDocument();
    });
  });

  describe('<AppStatus />', () => {
    it('should render error app status if documents request fails', async () => {
      act(() => {
        useDocuments.mockReturnValue({
          documents: [],
          fetchDocuments: jest.fn().mockRejectedValue('FAILURE'),
        });
      });

      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });

    it('should NOT render error app status if request is successfull', async () => {
      act(() => {
        useDocuments.mockReturnValue({
          documents: [],
          fetchDocuments: jest.fn().mockResolvedValue('SUCCESS'),
        });
      });

      const { container } = renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            osha: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      await waitFor(() => {
        expect(
          container.getElementsByClassName('appStatus--error')
        ).toHaveLength(0);
      });
    });
  });
});
