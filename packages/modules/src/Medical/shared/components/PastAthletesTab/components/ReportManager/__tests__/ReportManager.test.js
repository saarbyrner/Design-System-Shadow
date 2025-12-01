import { screen, waitFor } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { defaultGeneralPermissions } from '@kitman/common/src/contexts/PermissionsContext/general';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import ReportManager from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/ReportManager';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

const defaultProps = {
  squads: [1],
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  renderWithRedux(<ReportManager {...props} />, {
    useGlobalStore: false,
    preloadedState: { globalApi: {}, medicalApi: {} },
  });

const waitForLoading = async () =>
  waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Loading report data...' })
    ).not.toBeInTheDocument()
  );

describe('PastAthletesTab | <ReportManager />', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        general: {
          ...defaultGeneralPermissions,
        },
        medical: {
          ...defaultMedicalPermissions,
        },
      },
      isSuccess: true,
    });
  });

  it('renders nothing when there is no feature flags or permissions activated', () => {
    /*
     * this test is deliberately not asynchronous as we want
     * to make sure no requests are being fired as well
     */
    const { container } = renderComponent();

    expect(container).toBeEmptyDOMElement();
  });

  describe('when only one report is available', () => {
    beforeEach(() => {
      window.featureFlags['medical-bulk-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-bulk-export'] = false;
    });

    it('renders only one button', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          general: {
            ...defaultGeneralPermissions,
            pastAthletes: {
              ...defaultGeneralPermissions.pastAthletes,
              canView: true,
            },
          },
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
        isSuccess: true,
      });

      renderComponent();

      await waitForLoading();

      await waitFor(() =>
        expect(
          screen.getByRole('button', {
            name: 'Medical History',
          })
        ).toBeEnabled()
      );
    });
  });
});
