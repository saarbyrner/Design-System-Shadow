import { render, screen } from '@testing-library/react';
import * as Redux from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetSquadsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useSearchConsentAthletesQuery,
  useSaveAthletesConsentMutation,
  useSaveSingleAthleteConsentMutation,
  useUpdateSingleAthleteConsentMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { response as mockAthleteList } from '@kitman/services/src/mocks/handlers/consent/searchAthletes.mock';
import ClubConsentTab from '@kitman/modules/src/ConditionalFields/OrganisationApp/src/components/ClubConsentTab';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
jest.mock('@kitman/common/src/hooks/useEventTracking');

const props = {
  rulesetId: 1,
  t: i18nextTranslateStub(),
};
const mockDispatch = jest.fn();
const renderComponent = () => render(<ClubConsentTab {...props} />);

describe('ClubConsentTab', () => {
  beforeEach(() => {
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    useGetSquadsQuery.mockReturnValue({
      data: [],
    });
    useSearchConsentAthletesQuery.mockReturnValue({
      data: mockAthleteList.data,
    });
    useSaveAthletesConsentMutation.mockReturnValue([{}, {}]);
    useSaveSingleAthleteConsentMutation.mockReturnValue([{}, {}]);
    useUpdateSingleAthleteConsentMutation.mockReturnValue([{}, {}]);
  });

  it('renders correctly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Consent', level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByText('Athlete')).toBeInTheDocument();
    expect(screen.getAllByText('Squads')).toHaveLength(3);
    expect(screen.getByText('Consented')).toBeInTheDocument();
    expect(screen.getByText('Consent date')).toBeInTheDocument();
  });

  it('displays No athletes if no athletes', () => {
    useSearchConsentAthletesQuery.mockReturnValue({
      data: {
        data: [],
        meta: {
          current_page: 0,
          next_page: null,
          prev_page: null,
          total_count: 0,
          total_pages: 0,
        },
      },
    });

    const { getByText } = renderComponent();

    expect(getByText('No athletes')).toBeInTheDocument();
  });
});
