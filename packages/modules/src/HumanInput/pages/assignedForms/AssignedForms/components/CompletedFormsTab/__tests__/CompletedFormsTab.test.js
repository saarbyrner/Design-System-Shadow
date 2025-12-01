import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  completedFormsMock,
  mockMeta,
} from '@kitman/services/src/services/formAnswerSets/api/mocks/data/search';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useFormAnswerSets } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSets';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { CompletedFormsTabTranslated as CompletedFormsTab } from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSets');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetCurrentUserQuery: jest.fn(),
}));

describe('<CompletedFormsTab />', () => {
  const renderComponent = (state) => {
    const { mockedStore, container } = renderWithRedux(<CompletedFormsTab />, {
      useGlobalStore: false,
      preloadedState: {
        globalApi: {},
        [REDUCER_KEY]: { ...initialState, ...(state || {}) },
      },
    });
    return { mockedStore, container };
  };

  const trackEventMock = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    window.setFlag('pm-eforms-tryout', false);
    useGetCurrentUserQuery.mockReturnValue({
      data: {
        id: 2,
      },
    });
    useFormAnswerSets.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      rows: completedFormsMock,
      meta: mockMeta,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should display the table data properly', () => {
    renderComponent();

    expect(screen.getByRole('grid')).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', { name: 'Forms' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Form status' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Last edited' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /test template/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /org branding test/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /form branding/i })
    ).toBeInTheDocument();
  });

  it('should show error message if api call fails', () => {
    useFormAnswerSets.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      rows: [],
      meta: {},
    });
    renderComponent();

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(
      screen.getByText('Error fetching form assignments. Please try again')
    ).toBeInTheDocument();
  });

  it('should render skeleton on load', async () => {
    useFormAnswerSets.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      rows: [],
      meta: {
        currentPage: 1,
        totalCount: 0,
      },
    });

    const { container } = renderComponent();

    /**
     * 25 rows times 3 columns
     */
    expect(container.querySelectorAll('.MuiSkeleton-rectangular')).toHaveLength(
      75
    );
  });

  describe('AthleteStatusFilter', () => {
    beforeEach(() => {
      window.setFlag('pm-eforms-tryout', true);
    });

    afterEach(() => {
      window.setFlag('pm-eforms-tryout', false);
    });

    it('should render AthleteStatusFilter when pm-eforms-tryout feature flag is true', () => {
      renderComponent();
      expect(screen.getByLabelText('Athlete status')).toBeInTheDocument();
    });

    it('should not render AthleteStatusFilter when pm-eforms-tryout feature flag is false', () => {
      window.setFlag('pm-eforms-tryout', false);
      renderComponent();
      expect(screen.queryByLabelText('Athlete status')).not.toBeInTheDocument();
    });

    it('should render the correct columns when athlete_status is free_agent', () => {
      renderComponent({ athlete_status: 'free_agent' });

      expect(
        screen.getByRole('columnheader', { name: 'Forms' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Form status' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Last edited' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Latest PDF' })
      ).toBeInTheDocument();
    });

    it('should render the correct columns when athlete_status is not free_agent', () => {
      renderComponent({ athlete_status: 'active' });

      expect(
        screen.getByRole('columnheader', { name: 'Forms' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Form status' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Last edited' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('columnheader', { name: 'Latest PDF' })
      ).not.toBeInTheDocument();
    });
  });
});
