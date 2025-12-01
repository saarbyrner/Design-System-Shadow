import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { data as pastAthletes } from '@kitman/services/src/mocks/handlers/medical/getPastAthletes';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import PastAthletesTab from '@kitman/modules/src/Medical/shared/components/PastAthletesTab';
import { MEDICAL_TRIAL } from '@kitman/modules/src/UserMovement/shared/constants';
import {
  useSearchMovementOrganisationsListQuery,
  usePostMovementRecordMutation,
} from '@kitman/modules/src/UserMovement/shared/redux/services';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

const mockOnSetPage = jest.fn();

const defaultProps = {
  pastAthletes,
  setPage: mockOnSetPage,
  requestStatus: 'SUCCESS',
  t: i18nextTranslateStub(),
};

const defaultStore = {
  userMovementDrawerSlice: {
    profile: null,
    drawer: {
      isOpen: false,
    },
    step: 0,
    form: {
      user_id: null,
      transfer_type: MEDICAL_TRIAL,
      join_organisation_ids: [],
      leave_organisation_ids: [],
      joined_at: moment().format(dateTransferFormat),
    },
  },
  globalApi: {},
};

const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={storeFake(defaultStore)}>
      <PastAthletesTab {...props} />
    </Provider>
  );

describe('<PastAthletesTab />', () => {
  beforeEach(() => {
    window.organisationSport = 'nfl';
    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: {
          issues: {
            canView: true,
          },
        },
      },
      isSuccess: true,
    });
    useSearchMovementOrganisationsListQuery.mockReturnValue({
      pastAthletes,
      isSuccess: true,
    });
    usePostMovementRecordMutation.mockReturnValue([
      'onCreateMovementRecord',
      { isLoading: false, isError: false, isSuccess: false },
    ]);
  });

  it('renders correctly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Past athletes', level: 5 })
    ).toBeInTheDocument();

    ['Athlete', 'Player ID', 'Departed date', 'Open Injury/ Illness'].forEach(
      (column) => {
        expect(screen.getByText(column)).toBeInTheDocument();
      }
    );

    expect(screen.getByLabelText('Search')).toBeInTheDocument();

    expect(
      screen.getByText(pastAthletes.athletes[0].fullname)
    ).toBeInTheDocument();
  });

  it('hides Player ID column when window.organisationSport !== "nfl"', async () => {
    window.organisationSport = 'test';

    renderComponent();

    expect(screen.queryByText('Player ID')).not.toBeInTheDocument();
  });

  it('hides Open Injury/ Illness column when permissions.medical.issues.canView = false', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: {
          issues: {
            canView: false,
          },
        },
      },
      isSuccess: true,
    });

    renderComponent();

    expect(screen.queryByText('Open Injury/ Illness')).not.toBeInTheDocument();
  });

  it('renders medical trial option in row actions menu when past-athletes-medical-trial = TRUE and player.medicalTrial = TRUE', async () => {
    window.featureFlags['past-athletes-medical-trial'] = true;
    const user = userEvent.setup();
    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: {
          issues: {
            canView: true,
          },
        },
        userMovement: {
          player: {
            medicalTrial: true,
          },
        },
      },
      isSuccess: true,
    });

    renderComponent();
    const moreActionsButton = screen
      .getAllByRole('row')[1]
      .querySelector('button');

    // Option not rendered until row actions button clicked
    expect(screen.queryByText('Medical trial')).not.toBeInTheDocument();

    await user.click(moreActionsButton);

    expect(screen.queryByText('Medical trial')).toBeInTheDocument();
  });

  it('does not renders medical trial option in row actions menu when past-athletes-medical-trial = FALSE and player.medicalTrial = FALSE', async () => {
    window.featureFlags['past-athletes-medical-trial'] = false;
    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: {
          issues: {
            canView: true,
          },
        },
        userMovement: {
          player: {
            medicalTrial: false,
          },
        },
      },
      isSuccess: true,
    });

    renderComponent();
    const moreActionsButton = screen
      .queryAllByRole('row')[1]
      .querySelector('button');

    expect(screen.queryByText('Medical trial')).not.toBeInTheDocument();
    expect(moreActionsButton).not.toBeInTheDocument();
  });
});
