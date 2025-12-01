import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';

import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as squadAthletesData } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import {
  useGetSquadAthletesQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { labels as labelsData } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import { statusOptions } from '@kitman/services/src/mocks/handlers/availabilityStatusData/getAllAvailabilityStatuses';

import {
  toastAddType,
  toastRemoveType,
} from '@kitman/modules/src/Toasts/toastsSlice';
import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import { ActionBarTranslated as ActionBar } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar';
import {
  useBulkUpdatePrimarySquadMutation,
  useBulkUpdateAthleteLabelsMutation,
  useBulkUpdateActiveStatusMutation,
  useBulkUpdateAthleteAvailabilityStatusMutation,
} from '@kitman/modules/src/AthleteManagement/shared/redux/services/index';
import { REDUCER_KEY } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import { TAB_HASHES } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/utils/consts';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { getAllAvailabilityStatuses } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/utils/redux/services/AvailabilityStatusApi';
import {
  getPrimarySquadConfirmationModalTranslations,
  getChangeActiveStatusModalTranslations,
} from '../utils/helpers';
import {
  PRIMARY_SQUAD_ERROR_TOAST_ID,
  PRIMARY_SQUAD_SUCCESS_TOAST_ID,
} from '../utils/hooks/usePrimarySquadAction';
import {
  UPDATE_ACTIVE_STATUS_ERROR_TOAST_ID,
  UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID,
} from '../utils/hooks/useChangeActiveStatusAction';

setI18n(i18n);

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetSquadAthletesQuery: jest.fn(),
  useGetActiveSquadQuery: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useLocationHash', () => ({
  ...jest.requireActual('@kitman/common/src/hooks/useLocationHash'),
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/AthleteManagement/shared/redux/services/index',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/AthleteManagement/shared/redux/services/index'
    ),
    useBulkUpdatePrimarySquadMutation: jest.fn(),
    useBulkUpdateAthleteLabelsMutation: jest.fn(),
    useBulkUpdateActiveStatusMutation: jest.fn(),
    useBulkUpdateAthleteAvailabilityStatusMutation: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
    ),
    useGetAllLabelsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/utils/redux/services/AvailabilityStatusApi'
);

const t = i18nextTranslateStub();
const defaultProps = {
  selectedAthleteIds: [123],
  handleRefetchData: jest.fn(),
  t,
  permissions: { canViewSettingsAthletes: true },
  isAssociationAdmin: false,
  canManageGameStatus: false,
};

const initialState = {
  panels: {},
  bulkActions: {
    selectedAthleteIds: [
      { id: 1, user_id: 2 },
      { id: 12, user_id: 13 },
    ],
    selectedSquadIds: [],
    shouldRemovePrimarySquad: false,
  },
};

let store;

const renderComponent = ({ state = initialState, props = defaultProps }) => {
  store = storeFake({
    athleteManagementSlice: state,
  });
  return render(
    <Provider store={store}>
      <ActionBar {...props} />
    </Provider>
  );
};

describe('<ActionBar />', () => {
  const bulkUpdatePrimarySquad = jest.fn();
  const bulkUpdateAthleteLabels = jest.fn();
  const athleteIds = initialState.bulkActions.selectedAthleteIds.map(
    ({ id }) => id
  );
  const bulkUpdateActiveStatus = jest.fn();

  const bulkUpdateAthleteAvailabilityStatus = jest.fn();

  beforeEach(async () => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletesData,
      error: false,
      isLoading: false,
    });

    useBulkUpdatePrimarySquadMutation.mockReturnValue([
      bulkUpdatePrimarySquad,
      { isLoading: false },
    ]);

    bulkUpdatePrimarySquad.mockResolvedValue({});
    useBulkUpdateActiveStatusMutation.mockReturnValue([
      bulkUpdateActiveStatus,
      { isLoading: false },
    ]);
    bulkUpdateActiveStatus.mockResolvedValue({});

    useBulkUpdateAthleteAvailabilityStatusMutation.mockReturnValue([
      bulkUpdateAthleteAvailabilityStatus,
      { isLoading: false },
    ]);
    bulkUpdateAthleteAvailabilityStatus.mockResolvedValue({});

    useGetActiveSquadQuery.mockReturnValue({ data: mockSquads[0] });
    useGetAllLabelsQuery.mockReturnValue({
      data: labelsData,
      isFetching: false,
    });

    useBulkUpdateAthleteLabelsMutation.mockReturnValue([
      bulkUpdateAthleteLabels,
      { isLoading: false },
    ]);
    bulkUpdateAthleteLabels.mockResolvedValue({});

    useLocationHash.mockReturnValue(TAB_HASHES.active);

    getAllAvailabilityStatuses.mockResolvedValueOnce([
      'Available',
      'Unavailable',
      'Unavailable - Injured List',
      'Unavailable - On Loan',
    ]);
  });

  const assignPrimarySquadText = 'Assign Primary Squad';
  const deactivateButtonText = 'Deactivate';
  const activateButtonText = 'Activate';

  it('renders correctly', () => {
    renderComponent({});

    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /assign squad/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: assignPrimarySquadText })
    ).toBeInTheDocument();
  });

  it('renders Assign Squad selector when clicking Assign Squad button', async () => {
    const user = userEvent.setup();

    renderComponent({});

    const assignSquadButton = screen.getByRole('button', {
      name: /assign squad/i,
    });

    expect(assignSquadButton).toBeInTheDocument();

    await user.click(assignSquadButton);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /save/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
    squadAthletesData.squads.forEach((squad) => {
      expect(
        screen.getByRole('menuitem', { name: squad.name })
      ).toBeInTheDocument();
    });
  });

  it('does not render bulk actions buttons if user does not have permissions', async () => {
    renderComponent({ props: { ...defaultProps, permissions: {} } });

    const assignSquadButton = screen.queryByRole('button', {
      name: /assign squad/i,
    });

    expect(assignSquadButton).not.toBeInTheDocument();

    expect(screen.queryByText(assignPrimarySquadText)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Assign Labels' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: deactivateButtonText })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: activateButtonText })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: assignPrimarySquadText })
    ).not.toBeInTheDocument();
  });

  describe('bulk actions', () => {
    const expectToastRemoval = (idsToRemove) => {
      idsToRemove.forEach((id) => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { id },
          type: toastRemoveType,
        });
      });
    };

    const expectSuccessToast = (successId) => {
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: expect.objectContaining({
          id: successId,
        }),
        type: toastAddType,
      });
    };

    const expectErrorToast = (errorId) => {
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: expect.objectContaining({
          id: errorId,
        }),
        type: toastAddType,
      });
    };

    const bulkActionsProps = {
      ...defaultProps,
      selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
    };

    const openConfirmationModal = async ({
      user,
      translations,
      buttonText,
    }) => {
      await user.click(screen.getByRole('button', { name: buttonText }));

      expect(
        screen.getByRole('heading', {
          name: translations.title,
          level: 2,
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: translations.actions.ctaButton,
        })
      );
    };

    describe('primary squad', () => {
      const translations = getPrimarySquadConfirmationModalTranslations();
      const idsToRemove = [
        PRIMARY_SQUAD_ERROR_TOAST_ID,
        PRIMARY_SQUAD_SUCCESS_TOAST_ID,
      ];
      it('should display the modal after clicking on the button - assigning primary squad + post-CTA click', async () => {
        const user = userEvent.setup();

        renderComponent({
          props: bulkActionsProps,
        });

        await openConfirmationModal({
          user,
          translations: translations.assigning,
          buttonText: assignPrimarySquadText,
        });

        expect(bulkUpdatePrimarySquad).toHaveBeenCalledWith({
          primary_squad_id: mockSquads[0].id,
          athlete_ids: athleteIds,
        });

        expectToastRemoval(idsToRemove);

        expectSuccessToast(PRIMARY_SQUAD_SUCCESS_TOAST_ID);

        expect(store.dispatch).toHaveBeenCalledWith({
          payload: [],
          type: `${REDUCER_KEY}/onUpdateSelectedAthleteIds`,
        });
      });

      it('should display the modal after clicking on the button - removing primary squad + post-CTA click', async () => {
        const user = userEvent.setup();

        renderComponent({
          props: bulkActionsProps,
          state: {
            ...initialState,
            bulkActions: {
              ...initialState.bulkActions,
              shouldRemovePrimarySquad: true,
            },
          },
        });
        await openConfirmationModal({
          user,
          translations: translations.removing,
          buttonText: 'Remove Primary Squad',
        });

        expect(bulkUpdatePrimarySquad).toHaveBeenCalledWith({
          primary_squad_id: null,
          athlete_ids: athleteIds,
        });

        expectToastRemoval(idsToRemove);

        expectSuccessToast(PRIMARY_SQUAD_SUCCESS_TOAST_ID);

        expect(store.dispatch).toHaveBeenCalledWith({
          payload: [],
          type: `${REDUCER_KEY}/onUpdateSelectedAthleteIds`,
        });
      });

      it('should show the error toast', async () => {
        const user = userEvent.setup();
        bulkUpdatePrimarySquad.mockRejectedValue({});
        renderComponent({
          props: bulkActionsProps,
        });

        await openConfirmationModal({
          user,
          translations: translations.assigning,
          buttonText: assignPrimarySquadText,
        });

        expect(bulkUpdatePrimarySquad).toHaveBeenCalledWith({
          primary_squad_id: mockSquads[0].id,
          athlete_ids: athleteIds,
        });

        expectToastRemoval(idsToRemove);

        expectErrorToast(PRIMARY_SQUAD_ERROR_TOAST_ID);
      });
    });

    describe('active status', () => {
      const idsToRemove = [
        UPDATE_ACTIVE_STATUS_ERROR_TOAST_ID,
        UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID,
      ];

      beforeEach(() => {
        window.featureFlags['bulk-activate-deactivate'] = true;
      });

      afterEach(() => {
        window.featureFlags['bulk-activate-deactivate'] = false;
      });

      it('should not show the button because the FF is off', () => {
        window.featureFlags['bulk-activate-deactivate'] = false;
        renderComponent({
          props: bulkActionsProps,
        });

        expect(
          screen.queryByRole('button', { name: deactivateButtonText })
        ).not.toBeInTheDocument();
      });

      it('should display the modal after clicking on the button - deactivating + post-CTA click', async () => {
        const user = userEvent.setup();
        const translations = getChangeActiveStatusModalTranslations(false);

        renderComponent({
          props: bulkActionsProps,
        });

        await openConfirmationModal({
          user,
          translations,
          buttonText: deactivateButtonText,
        });

        expect(bulkUpdateActiveStatus).toHaveBeenCalledWith({
          is_active: false,
          athlete_ids: athleteIds,
        });

        expectToastRemoval(idsToRemove);

        expectSuccessToast(UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID);

        expect(store.dispatch).toHaveBeenCalledWith({
          payload: [],
          type: `${REDUCER_KEY}/onUpdateSelectedAthleteIds`,
        });
      });

      it('should display the modal after clicking on the button - making active + post-CTA click', async () => {
        const user = userEvent.setup();
        const translations = getChangeActiveStatusModalTranslations(true);
        useLocationHash.mockReturnValue(TAB_HASHES.inactive);

        renderComponent({
          props: bulkActionsProps,
        });

        await openConfirmationModal({
          user,
          translations,
          buttonText: activateButtonText,
        });

        expect(bulkUpdateActiveStatus).toHaveBeenCalledWith({
          is_active: true,
          athlete_ids: athleteIds,
        });

        expectToastRemoval(idsToRemove);

        expectSuccessToast(UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID);

        expect(store.dispatch).toHaveBeenCalledWith({
          payload: [],
          type: `${REDUCER_KEY}/onUpdateSelectedAthleteIds`,
        });
      });

      it('should show the error toast', async () => {
        const user = userEvent.setup();
        const translations = getChangeActiveStatusModalTranslations();
        bulkUpdateActiveStatus.mockRejectedValue({});

        renderComponent({
          props: bulkActionsProps,
        });

        await openConfirmationModal({
          user,
          translations,
          buttonText: deactivateButtonText,
        });

        expect(bulkUpdateActiveStatus).toHaveBeenCalledWith({
          is_active: false,
          athlete_ids: athleteIds,
        });

        expectToastRemoval(idsToRemove);

        expectErrorToast(UPDATE_ACTIVE_STATUS_ERROR_TOAST_ID);
      });
    });

    describe('assign labels', () => {
      beforeEach(() => {
        window.setFlag('labels-and-groups', true);
      });

      afterEach(() => {
        window.setFlag('labels-and-groups', false);
      });

      it('should display the assign labels button and labels options if FF and permissions constraints are true', async () => {
        const user = userEvent.setup();

        renderComponent({
          props: {
            ...defaultProps,
            selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
            permissions: {
              canViewSettingsAthletes: true,
              canAssignLabels: true,
            },
          },
        });

        await user.click(screen.getByRole('button', { name: 'Assign Labels' }));

        labelsData
          .map(({ id, name, color }) => ({ id, name, color }))
          .forEach((labelOption) => {
            expect(screen.getByText(labelOption.name)).toBeInTheDocument();
          });
      });

      it('should not display the assign labels button if FF and permissions constraints are not true', async () => {
        renderComponent({
          props: {
            ...defaultProps,
            selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
            permissions: {
              canViewSettingsAthletes: true,
              canAssignLabels: false,
            },
          },
        });

        expect(
          screen.queryByRole('button', { name: 'Assign Labels' })
        ).not.toBeInTheDocument();
      });

      it('should not display the assign labels button if FF is off', async () => {
        window.setFlag('labels-and-groups', false);

        renderComponent({
          props: {
            ...defaultProps,
            selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
            permissions: {
              canViewSettingsAthletes: true,
              canAssignLabels: true,
            },
          },
        });

        expect(
          screen.queryByRole('button', { name: 'Assign Labels' })
        ).not.toBeInTheDocument();
      });

      it('should call bulkUpdateAthleteLabels when clicking save button', async () => {
        const user = userEvent.setup();

        renderComponent({
          props: {
            ...defaultProps,
            selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
            permissions: {
              canViewSettingsAthletes: true,
              canAssignLabels: true,
            },
          },
        });

        await user.click(screen.getByRole('button', { name: 'Assign Labels' }));

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(bulkUpdateAthleteLabels).toHaveBeenCalledWith({
          labelsToAdd: [],
          labelsToRemove: [],
          athleteIds,
        });
      });
    });

    describe('availability status', () => {
      beforeEach(() => {
        window.featureFlags['league-ops-discipline-area'] = true;
      });

      afterEach(() => {
        window.featureFlags['league-ops-discipline-area'] = false;
      });

      it('should display the availability status button and status options if FF and preffereces are true', async () => {
        const user = userEvent.setup();

        renderComponent({
          props: {
            ...defaultProps,
            isAssociationAdmin: true,
            canManageGameStatus: true,
            selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
            permissions: {
              canViewSettingsAthletes: true,
              canAssignLabels: false,
            },
          },
        });

        await user.click(
          screen.getByRole('button', { name: 'Availability status' })
        );

        statusOptions
          .map((status) => status)
          .forEach((statusOption) => {
            expect(screen.getByText(statusOption)).toBeInTheDocument();
          });
      });

      it('should not display the availability status  button if FF and preference are not true', async () => {
        renderComponent({
          props: {
            ...defaultProps,
            isAssociationAdmin: true,
            canManageGameStatus: false,
            selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
            permissions: {
              canViewSettingsAthletes: true,
              canAssignLabels: false,
            },
          },
        });

        expect(
          screen.queryByRole('button', { name: 'Availability status' })
        ).not.toBeInTheDocument();
      });

      it('should not display the availability status button if FF is off', async () => {
        window.featureFlags['league-ops-discipline-area'] = false;

        renderComponent({
          ...defaultProps,
          isAssociationAdmin: true,
          canManageGameStatus: false,
          selectedAthleteIds: initialState.bulkActions.selectedAthleteIds,
          permissions: {
            canViewSettingsAthletes: true,
            canAssignLabels: false,
          },
        });

        expect(
          screen.queryByRole('button', { name: 'Availability status' })
        ).not.toBeInTheDocument();
      });
    });
  });
});
