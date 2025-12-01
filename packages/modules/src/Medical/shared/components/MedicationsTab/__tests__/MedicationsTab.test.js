import { render, screen, within } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { useGetMedicationProvidersQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useGetMedicationListSourcesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import MedicationsTab from '..';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetMedicationProvidersQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetMedicationListSourcesQuery: jest.fn(),
  })
);

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
      stockManagement: {
        ...defaultMedicalPermissions.stockManagement,
        canDispense: true,
      },
      medications: {
        ...defaultMedicalPermissions.medications,
        canLog: true,
        canEdit: true,
        canArchive: true,
      },
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const t = i18nextTranslateStub();

const onOpenDispenseMedicationsSidePanelMock = jest.fn();
const props = {
  athleteId: 1234,
  includesToggle: true,
  onOpenDispenseMedicationsSidePanel: onOpenDispenseMedicationsSidePanelMock,
  t,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {
    useGetMedicationProvidersQuery: jest.fn(),
  },
  medicalSharedApi: {
    useGetMedicationListSourcesQuery: jest.fn(),
  },
  addMedicationSidePanel: {
    isOpen: true,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalHistory: {},
});

describe('<MedicationsTab />', () => {
  beforeEach(() => {
    useGetMedicationProvidersQuery.mockReturnValue({
      refetch: jest.fn(),
    });
    useGetMedicationListSourcesQuery.mockReturnValue({
      data: null,
      error: false,
      isLoading: true,
    });
  });

  describe('[FEATURE FLAG] dr-first-integration ON', () => {
    beforeEach(() => {
      window.featureFlags['dr-first-integration'] = true;
    });
    afterEach(() => {
      window.featureFlags['dr-first-integration'] = false;
    });

    it('displays the iframe', async () => {
      render(
        <Provider store={store}>
          <MedicationsTab {...props} />
        </Provider>
      );

      // Toggle to trigger drfirst flow
      await userEvent.click(
        screen.getByText('ePrescription').closest('button')
      );

      const drFirst = await screen.findByTitle(
        'Kitman Labs Dr. First Integration'
      );

      expect(drFirst).toBeInTheDocument();
    });

    it('displays the error message when the request fails', async () => {
      server.use(
        rest.get('/ui/medical/drfirst/portal_url', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      render(
        <Provider store={store}>
          <MedicationsTab {...props} />
        </Provider>
      );

      // Toggle to trigger drfirst flow
      await userEvent.click(
        screen.getByText('ePrescription').closest('button')
      );

      const error = await screen.findByRole('heading', {
        level: 3,
        name: 'Something went wrong, contact support',
      });
      expect(error).toBeInTheDocument();
    });

    it('shows the medications table', async () => {
      render(
        <Provider store={store}>
          <MedicationsTab {...props} />
        </Provider>
      );
      await screen.findByRole('heading', { level: 3, name: 'Medication' });
      expect(screen.getByTestId('MedicationCardList')).toBeInTheDocument();
      expect(screen.getByTestId('MedicationFilters')).toBeInTheDocument();
    });

    it('shows the medications toggle if includestoggle is true', async () => {
      render(
        <Provider store={store}>
          <MedicationsTab {...props} includesToggle />
        </Provider>
      );
      await screen.findByRole('heading', { level: 3, name: 'Medication' });

      expect(
        screen.getByTestId('Medications|TypeSelector')
      ).toBeInTheDocument();
    });

    it('shows report and message icon buttons', async () => {
      render(
        <Provider store={store}>
          <MedicationsTab {...props} />
        </Provider>
      );
      await screen.findByRole('heading', { level: 3, name: 'Medication' });

      const reportButton = document.querySelectorAll('.icon-alarm');
      expect(reportButton).toHaveLength(1);

      const messageButton = document.querySelectorAll('.icon-messaging');
      expect(messageButton).toHaveLength(1);
    });
  });

  describe('[FEATURE FLAG] dr-first-integration off', () => {
    beforeEach(() => {
      window.featureFlags['dr-first-integration'] = false;
    });

    it('does not show report and message icon buttons', async () => {
      render(
        <Provider store={store}>
          <MedicationsTab {...props} />
        </Provider>
      );

      await screen.findByRole('heading', { level: 3, name: 'Medication' });
      const meatballMenus = screen.getAllByTestId('MeatballMenu');
      expect(meatballMenus).toHaveLength(2);

      const reportButton = document.querySelectorAll('.icon-alarm');
      expect(reportButton).toHaveLength(0);

      const messageButton = document.querySelectorAll('.icon-messaging');
      expect(messageButton).toHaveLength(0);
    });

    it('renders the attachments viewer when selected medication has attachments', async () => {
      const user = userEvent.setup();

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <Provider store={store}>
            <MedicationsTab {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByRole('heading', { level: 3, name: 'Medication' });
      const meatballMenus = screen.getAllByTestId('MeatballMenu');
      expect(meatballMenus).toHaveLength(2);
      const secondMedMenu = meatballMenus[1];

      await user.click(within(secondMedMenu).getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      await user.click(screen.getByText('Edit'));
      expect(onOpenDispenseMedicationsSidePanelMock).toHaveBeenCalled();

      expect(screen.getByTestId('AttachmentsViewerModal')).toBeInTheDocument();
    });

    it('does not render the attachments viewer when no attachments', async () => {
      const user = userEvent.setup();

      render(
        <MockedPermissionContextProvider
          permissionsContext={mockedPermissionsContextValue}
        >
          <Provider store={store}>
            <MedicationsTab {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );

      await screen.findByRole('heading', { level: 3, name: 'Medication' });
      const meatballMenus = screen.getAllByTestId('MeatballMenu');
      expect(meatballMenus).toHaveLength(2);
      const firstMedMenu = meatballMenus[0];

      await user.click(within(firstMedMenu).getByRole('button'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      await user.click(screen.getByText('Edit'));
      expect(onOpenDispenseMedicationsSidePanelMock).toHaveBeenCalled();

      expect(
        screen.queryByTestId('AttachmentsViewerModal')
      ).not.toBeInTheDocument();
    });
  });
});
