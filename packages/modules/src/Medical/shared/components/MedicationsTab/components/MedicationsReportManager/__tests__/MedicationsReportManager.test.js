import { screen, waitFor } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import MedicationsReportManager from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationsReportManager/MedicationsReportManager';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

const store = storeFake({
  globalApi: {},
  medicalApi: {},
});

const defaultProps = {
  t: i18nextTranslateStub(),
};

const defaultPermissions = {
  medical: {
    ...defaultMedicalPermissions,
    medications: {
      ...defaultMedicalPermissions.medications,
      canView: true,
    },
  },
};

const waitForLoading = async () =>
  waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Loading report data...' })
    ).not.toBeInTheDocument()
  );

const renderComponent = ({
  props = defaultProps,
  permissions = defaultPermissions,
} = {}) => {
  useGetPermissionsQuery.mockReturnValue({
    data: {
      ...defaultPermissions,
      ...permissions,
    },
  });

  return renderWithUserEventSetup(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider store={store}>
        <MedicationsReportManager {...props} />
      </Provider>
    </LocalizationProvider>
  );
};

describe('MedicationsTab | <MedicationsReportManager />', () => {
  let jsdomPrint;
  const windowDotPrint = jest.fn();

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: defaultPermissions,
    });

    jsdomPrint = window.print;
    jest.spyOn(window, 'print').mockImplementation(windowDotPrint);
  });

  afterEach(() => {
    window.print = jsdomPrint;
  });

  it('renders nothing when there is no feature flags or permissions activated', () => {
    // this test is deliberately not asyncronous as we want to make sure no requests are being
    // fired as well
    const { container } = renderComponent();

    expect(container).toBeEmptyDOMElement();
  });

  describe('when more than one report is available', () => {
    beforeEach(() => {
      window.featureFlags['medications-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['medications-report'] = false;
    });

    it('renders the tooltip menu', async () => {
      const { user } = renderComponent();

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      expect(
        screen.getByRole('button', {
          name: 'Medication Report PDF',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', {
          name: 'Medication Report CSV',
        })
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] medications-report', () => {
    beforeEach(() => {
      window.featureFlags['medications-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['medications-report'] = false;
    });

    it('does not render the report buttons without permission', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: false,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.queryByRole('button', {
          name: 'Download',
        })
      ).not.toBeInTheDocument();

      expect(screen.queryByText('Medication report')).not.toBeInTheDocument();
    });

    it('opens the export setting medication report side panel when clicked', async () => {
      const { user } = renderComponent();

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await user.click(
        screen.getByRole('button', {
          name: 'Medication Report PDF',
        })
      );

      await expect(screen.getByText('Medication report')).toBeInTheDocument();
    });
  });

  describe('[feature-flag] medications-report-export', () => {
    beforeEach(() => {
      window.featureFlags['medications-report'] = true;
      window.featureFlags['medications-report-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['medications-report'] = false;
      window.featureFlags['medications-report-export'] = false;
    });

    it('does not render the report buttons without permission', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: false,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.queryByRole('button', {
          name: 'Download',
        })
      ).not.toBeInTheDocument();

      expect(screen.queryByText('Medication Report')).not.toBeInTheDocument();
    });

    it('opens the export setting medication report side panel when clicked', async () => {
      const { user } = renderComponent();

      await waitForLoading();

      const menuButton = screen.getByRole('button', {
        name: 'Download',
      });

      expect(menuButton).toBeInTheDocument();

      await user.click(menuButton);

      const medicationReportButton = screen.getByRole('button', {
        name: 'Medication Report',
      });

      await user.click(medicationReportButton);

      await expect(screen.getAllByText('Medication Report')).toHaveLength(2);
    });
  });
});
