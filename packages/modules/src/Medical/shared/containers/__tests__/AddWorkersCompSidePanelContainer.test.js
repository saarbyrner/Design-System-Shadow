import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { data as mockStaffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { getClinicalImpressionsBodyAreas } from '@kitman/services';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import {
  useGetStaffUsersQuery,
  useFetchOrganisationPreferenceQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useGetSidesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import useCurrentUser from '@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser';
import AddWorkersCompSidePanelContainer from '@kitman/modules/src/Medical/shared/containers/AddWorkersCompSidePanelContainer';

jest.mock('@kitman/services');

jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  getClinicalImpressionsBodyAreas: jest.fn(),
}));

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetStaffUsersQuery: jest.fn(),
  useFetchOrganisationPreferenceQuery: jest.fn(),
}));
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetSidesQuery: jest.fn(),
}));
jest.mock('@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser');

const defaultStore = {
  addWorkersCompSidePanel: {
    isOpen: true,
    page: 1,
    showPrintPreview: {
      sidePanel: false,
      card: false,
    },
    claimInformation: {
      personName: 'Option 1',
      policyNumber: '12345',
      contactNumber: '07827162731',
      lossDate: '20 Dec 2022',
      lossTime: '5:35 pm',
      lossCity: 'Test City',
      lossState: 'Test State',
      lossJurisdiction: 'Optional',
      lossDescription: 'Test',
    },
    additionalInformation: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
    },
  },
  globalApi: {
    useGetStaffUsersQuery: jest.fn(),
    useFetchOrganisationPreferenceQuery: jest.fn(),
  },
  medicalApi: {
    useGetSidesQuery: jest.fn(),
  },
};
const mockAthleteData = {
  firstname: 'John',
  lastname: 'Doe',
  date_of_birth: '23/08/1997',
  social_security_number: '12345',
  position: 'Forward',
};

const renderComponent = () =>
  render(
    <Provider store={storeFake(defaultStore)}>
      <AddWorkersCompSidePanelContainer athleteData={mockAthleteData} />
    </Provider>
  );

describe('<AddWorkersCompSidePanelContainer />', () => {
  beforeEach(() => {
    useGetStaffUsersQuery.mockReturnValue({
      data: mockStaffUsers,
    });
    useCurrentUser.mockReturnValue({
      currentUser: null,
      fetchCurrentUser: jest.fn(),
    });
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
    useFetchOrganisationPreferenceQuery.mockReturnValue({
      data: { isOptionalWorkersCompClaimPolicyNumber: false },
    });
  });

  it('renders the title correctly', async () => {
    renderComponent();
    await screen.findByText("Workers' comp claim");
    expect(screen.getByText("Workers' comp claim")).toBeInTheDocument();
    expect(
      screen.queryByText('First Report of Injury (FROI)')
    ).not.toBeInTheDocument();
  });

  describe('[feature flag]  pm-mls-emr-demo-froi on', () => {
    beforeEach(() => {
      window.featureFlags['pm-mls-emr-demo-froi'] = true;
    });
    afterEach(() => {
      window.featureFlags['pm-mls-emr-demo-froi'] = false;
    });

    it('renders the title correctly', async () => {
      renderComponent();
      await screen.findByText('First Report of Injury (FROI)');
      expect(
        screen.getByText('First Report of Injury (FROI)')
      ).toBeInTheDocument();
      expect(screen.queryByText("Workers' comp claim")).not.toBeInTheDocument();
    });
  });
});
