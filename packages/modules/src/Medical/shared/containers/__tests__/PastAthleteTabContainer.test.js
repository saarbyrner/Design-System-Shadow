import { screen, render } from '@testing-library/react';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { Provider } from 'react-redux';
import { data as pastAthletes } from '@kitman/services/src/mocks/handlers/medical/getPastAthletes';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import PastAthletesTabContainer from '@kitman/modules/src/Medical/shared/containers/PastAthletesTab';
import { MEDICAL_TRIAL } from '@kitman/modules/src/UserMovement/shared/constants';
import {
  useSearchMovementOrganisationsListQuery,
  usePostMovementRecordMutation,
} from '@kitman/modules/src/UserMovement/shared/redux/services';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

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
  medicalApi: {},
};

const renderComponent = () =>
  render(
    <Provider store={storeFake(defaultStore)}>
      <PastAthletesTabContainer />
    </Provider>
  );

describe('<PastAthletesTabContainer />', () => {
  beforeEach(() => {
    useSearchMovementOrganisationsListQuery.mockReturnValue({
      pastAthletes,
      isSuccess: true,
    });
    usePostMovementRecordMutation.mockReturnValue([
      'onCreateMovementRecord',
      { isLoading: false, isError: false, isSuccess: false },
    ]);
  });

  it('renders correctly', async () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Past athletes', level: 5 })
    ).toBeInTheDocument();
  });
});
