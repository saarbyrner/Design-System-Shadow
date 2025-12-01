import {
  screen,
  render,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { Provider } from 'react-redux';
import { getClinicalImpressionsBodyAreas } from '@kitman/services';
import useDocuments from '@kitman/modules/src/Medical/shared/hooks/useDocuments';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import { defaultMedicalPermissions } from '../../../../../shared/utils/testUtils';
import { getPathologyTitle } from '../../../../../shared/utils';
import { useGetSidesQuery } from '../../../../../shared/redux/services/medical';
import WorkersComp from '../index';

jest.mock('../../../../../shared/utils');
jest.mock('../../../../../shared/redux/services/medical');
jest.mock('@kitman/services');
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
  addWorkersCompSidePanel: {
    showPrintPreview: {
      card: false,
      sidePanel: false,
    },
  },
});

const mockStoreWithPrintPreview = storeFake({
  addWorkersCompSidePanel: {
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
      workersComp: {
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
          <WorkersComp {...props} />
        </MockedIssueContextProvider>
      </MockedPermissionContextProvider>
    </Provider>
  );
};

describe('Workers Comp', () => {
  beforeEach(() => {
    useGetSidesQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Left' },
        { id: 2, name: 'Right' },
      ],
    });
    getClinicalImpressionsBodyAreas.mockResolvedValue([
      { id: 1, name: 'Head' },
      { id: 2, name: 'Arm' },
    ]);
    useDocuments.mockReturnValue({
      documents: [],
      fetchDocuments: jest.fn().mockResolvedValue('SUCCESS'),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders when draft', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: mockedIssueContextValue.issue,
      },
      getMockedPermissionsContextValue()
    );

    const workersCompContainer = await screen.findByTestId(
      'WorkersComp|Container'
    );
    expect(workersCompContainer).toBeInTheDocument();
    expect(screen.getByText("Workers' comp claim")).toBeInTheDocument();
    expect(screen.getByText('WC - 01/13/2022')).toBeInTheDocument();
    expect(screen.getByText('12/16/2022')).toBeInTheDocument();
    expect(
      screen.getByText('Reporter first name Reporter last name')
    ).toBeInTheDocument();
    expect(screen.getByText('Last edited on:')).toBeInTheDocument();
    expect(screen.getByText('Last edited by:')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders when submitted', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          workers_comp: {
            ...mockedIssueContextValue.issue.workers_comp,
            status: 'submitted',
          },
        },
      },
      getMockedPermissionsContextValue()
    );

    const workersCompContainer = await screen.findByTestId(
      'WorkersComp|Container'
    );
    expect(workersCompContainer).toBeInTheDocument();
    expect(screen.getByText("Workers' comp claim")).toBeInTheDocument();
    expect(screen.getByText('WC - 01/13/2022')).toBeInTheDocument();
    expect(screen.getByText('Submitted on:')).toBeInTheDocument();
    expect(screen.getByText('Submitted by:')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('should render edit button if permissions are canEdit', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          workers_comp: {
            ...mockedIssueContextValue.issue.workers_comp,
            status: 'draft',
          },
        },
      },
      getMockedPermissionsContextValue(true)
    );

    const workersCompContainer = await screen.findByTestId(
      'WorkersComp|Container'
    );

    expect(workersCompContainer).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should not render edit button if permissions are canView', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          workers_comp: {
            ...mockedIssueContextValue.issue.workers_comp,
            status: 'draft',
          },
        },
      },
      getMockedPermissionsContextValue(false, true)
    );

    const workersCompContainer = await screen.findByTestId(
      'WorkersComp|Container'
    );

    expect(workersCompContainer).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('should render edit button if status is draft', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          workers_comp: {
            ...mockedIssueContextValue.issue.workers_comp,
            status: 'draft',
          },
        },
      },
      getMockedPermissionsContextValue(true)
    );

    const workersCompContainer = await screen.findByTestId(
      'WorkersComp|Container'
    );

    expect(workersCompContainer).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('Print')).not.toBeInTheDocument();
  });

  it('should render print button if status is submitted', async () => {
    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          workers_comp: {
            ...mockedIssueContextValue.issue.workers_comp,
            status: 'submitted',
          },
        },
      },
      getMockedPermissionsContextValue(true)
    );

    const workersCompContainer = await screen.findByTestId(
      'WorkersComp|Container'
    );

    expect(workersCompContainer).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('should render WC - Date if pathology title doesnt exists', async () => {
    getPathologyTitle.mockReturnValue(undefined);

    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: mockedIssueContextValue.issue,
      },
      getMockedPermissionsContextValue()
    );

    await screen.findByTestId('WorkersComp|Container');

    expect(screen.getByText('WC - 01/13/2022')).toBeInTheDocument();
  });

  it('should render WC - Pathology title - Date if pathology title exists', async () => {
    getPathologyTitle.mockReturnValue('Test pathology title');

    renderWithContext(
      {
        ...mockedIssueContextValue,
        issue: mockedIssueContextValue.issue,
      },
      getMockedPermissionsContextValue()
    );

    await screen.findByTestId('WorkersComp|Container');

    expect(screen.getByTestId('WorkersComp|Title')).toHaveTextContent(
      'WC - Test pathology title - 01/13/2022'
    );
  });

  describe('Printing logic', () => {
    const useDispatchMockUpdated = jest.fn();
    mockStoreWithPrintPreview.dispatch = useDispatchMockUpdated;

    it('should trigger print if showPrintPreview is true', async () => {
      jest.spyOn(window, 'print').mockImplementation(() => {});

      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: mockedIssueContextValue.issue,
        },
        getMockedPermissionsContextValue(),
        mockStoreWithPrintPreview
      );

      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });
    });

    it('should call dispatch to set showPrintPreview to true, and with side and body area values on click of print button', async () => {
      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            workers_comp: {
              status: 'submitted',
              side_id: 1,
              body_area_id: 1,
            },
          },
        },
        getMockedPermissionsContextValue(),
        mockStoreWithPrintPreview
      );

      await waitFor(() => {
        expect(getClinicalImpressionsBodyAreas).toHaveBeenCalled();
      });

      fireEvent.click(screen.getByText('Print'));

      await waitFor(() => {
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(6, {
          showPrintPreview: true,
          type: 'PRINT_WORKERS_COMP_FROM_CARD',
          side: 'Left',
          bodyArea: 'Head',
        });
      });
    });

    it('should call dispatch to set showPrintPreview to false on afterprint', async () => {
      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            workers_comp: {
              status: 'submitted',
              side_id: 1,
              body_area_id: 1,
            },
          },
        },
        getMockedPermissionsContextValue(),
        mockStoreWithPrintPreview
      );

      jest.spyOn(window, 'print').mockImplementation(() => {});

      await waitFor(() => {
        expect(useDispatchMockUpdated).toHaveBeenNthCalledWith(1, {
          showPrintPreview: false,
          type: 'PRINT_WORKERS_COMP_FROM_CARD',
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
              name: 'WC - Test pathology title - 01-13-2022',
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
            workers_comp: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      expect(
        screen.getByText('WC - Test pathology title - 01-13-2022.pdf')
      ).toBeInTheDocument();
      expect(screen.getByTestId('WorkersComp|Icon')).toBeInTheDocument();
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
            workers_comp: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      expect(
        screen.getByText('WC - Test pathology title - 01/13/2022')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="WorkersComp|Icon"]')
      ).not.toBeInTheDocument();
    });

    it('should NOT render pdf document link with icon if document exists but permission doesnt', () => {
      getPathologyTitle.mockReturnValue('Test pathology title');
      useDocuments.mockReturnValue({
        documents: [
          {
            attachment: {
              name: 'WC - Test pathology title - 01-13-2022',
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
            workers_comp: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true)
      );

      expect(
        screen.queryByText('WC - Test pathology title - 01-13-2022.pdf')
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
            workers_comp: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });

    it('should render error app status if body area request fails', async () => {
      act(() => {
        getClinicalImpressionsBodyAreas.mockRejectedValue('FAILURE');
      });

      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            workers_comp: { status: 'submitted' },
          },
        },
        getMockedPermissionsContextValue(true, true, true)
      );

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });

    it('should NOT render error app status if both requests are successfull', async () => {
      act(() => {
        getClinicalImpressionsBodyAreas.mockResolvedValue('SUCCESS');
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
            workers_comp: { status: 'submitted' },
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

  describe('[feature flag] pm-mls-emr-demo-froi', () => {
    beforeEach(() => {
      window.featureFlags['pm-mls-emr-demo-froi'] = true;
    });

    afterEach(() => {
      window.featureFlags['pm-mls-emr-demo-froi'] = false;
    });

    it('renders FROI when draft', async () => {
      renderWithContext(
        {
          ...mockedIssueContextValue,
          issue: mockedIssueContextValue.issue,
        },
        getMockedPermissionsContextValue()
      );

      const workersCompContainer = await screen.findByTestId(
        'WorkersComp|Container'
      );
      expect(workersCompContainer).toBeInTheDocument();
      expect(screen.getByText('FROI')).toBeInTheDocument();
      expect(screen.getByText('FROI - 01/13/2022')).toBeInTheDocument();
    });
  });
});
