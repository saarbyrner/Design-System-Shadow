import { screen, cleanup } from '@testing-library/react';
import {
  storeFake,
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useGetCoachesReportGridQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import CoachesReportRefactorTab from '../CoachesReportRefactorTab';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('@kitman/modules/src/Toasts/toastsSlice', () => ({
  ...jest.requireActual('@kitman/modules/src/Toasts/toastsSlice'),
  add: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetCoachesReportGridQuery: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');
const mockTrackEvent = jest.fn();

useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });

describe('Coaches Report Container', () => {
  const fetchGridResponse = {
    containers: [],
    columns: [
      {
        row_key: 'athlete',
        datatype: 'object',
        name: 'Athlete',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'availability_status',
        datatype: 'object',
        name: 'Availability Status',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'athlete_member_squads',
        datatype: 'plain',
        name: 'Athlete Member Squads',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'open_injuries_illnesses',
        datatype: 'plain',
        name: 'Open Injury/ Illness',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'most_recent_coaches_note',
        datatype: 'plain',
        name: 'Most Recent Coaches Note',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
    ],
    rows: [
      {
        id: 192866,
        athlete: {
          fullname: 'Mark AccessLink',
          position: 'Hooker',
          avatar_url: 'img_url',
          availability: 'available',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'available',
          unavailable_since: null,
        },
        athlete_member_squads: [
          {
            id: 8,
            name: 'International Squad',
          },
        ],
        open_injuries_illnesses: {
          issues: [],
          has_more: false,
        },
        most_recent_coaches_note: null,
      },
      {
        id: 40211,
        athlete: {
          fullname: 'Tomas Albornoz',
          position: 'Second Row',
          avatar_url: 'img_url',
          availability: 'unavailable',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'unavailable',
          unavailable_since: '808 days',
        },
        athlete_member_squads: [
          {
            id: 2731,
            name: '1st team',
          },
          {
            id: 73,
            name: 'Academy Squad',
          },
          {
            id: 2732,
            name: 'Academy team',
          },
          {
            id: 8,
            name: 'International Squad',
          },
          {
            id: 1374,
            name: 'Player view',
          },
          {
            id: 2431,
            name: 'team_1',
          },
          {
            id: 2432,
            name: 'team_2',
          },
          {
            id: 1038,
            name: 'Technical Director',
          },
        ],
        open_injuries_illnesses: {
          issues: [],
          has_more: false,
        },
        most_recent_coaches_note: null,
      },
      {
        id: 108269,
        athlete: {
          fullname: 'Mohamed Ali 2',
          position: 'Loose-head Prop',
          avatar_url: 'img_url',
          availability: 'available',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'available',
          unavailable_since: null,
        },
        athlete_member_squads: [
          {
            id: 8,
            name: 'International Squad',
          },
        ],
        open_injuries_illnesses: {
          issues: [],
          has_more: false,
        },
        most_recent_coaches_note: null,
      },
      {
        id: 1242,
        athlete: {
          fullname: 'Johnny Appleseed',
          position: 'No. 8',
          avatar_url: 'img_url',
          availability: 'available',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'available',
          unavailable_since: null,
        },
        athlete_member_squads: [
          {
            id: 73,
            name: 'Academy Squad',
          },
          {
            id: 8,
            name: 'International Squad',
          },
        ],
        open_injuries_illnesses: {
          issues: [],
          has_more: false,
        },
        most_recent_coaches_note: null,
      },
    ],
    next_id: 96765,
  };

  const initialStore = storeFake({
    app: { commentsGridRequestStatus: 'SUCCESS' },
    medicalApi: { useGetCoachesReportGridQuery: jest.fn() },
    commentsFilters: {
      athlete_name: '',
      positions: [],
      squads: [8],
      availabilities: [],
      issues: [],
    },
  });

  const defaultProps = {
    t: i18nextTranslateStub(),
    filters: {},
  };

  const componentRender = (mockStore = initialStore, props = defaultProps) => {
    return renderWithProvider(
      <CoachesReportRefactorTab {...props} />,
      mockStore
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks first
    const mockDate = new Date('2024-11-19T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    useGetCoachesReportGridQuery.mockReturnValue({
      data: fetchGridResponse,
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the component structure', async () => {
    componentRender(initialStore);
    const container = screen.getByTestId('CoachesReportRefactortab|Container');

    expect(container).toBeInTheDocument();
    expect(container.querySelector('h3')).toHaveTextContent(
      'Daily Status Report - Nov 19, 2024'
    );
  });

  it('should hit the initial data fetch endpoint and return data as expected', () => {
    componentRender(initialStore);
    // /medical/coaches/fetch
    expect(useGetCoachesReportGridQuery).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        filters: expect.objectContaining({
          athlete_name: '',
          availabilities: [],
          issues: [],
          positions: [],
          report_date: expect.any(String),
          squads: [],
        }),
        next_id: null,
      }),
      {}
    );

    const gridData = useGetCoachesReportGridQuery.mock.results[0].value.data;
    expect(gridData).toEqual(fetchGridResponse);
  });

  it('renders the filters', async () => {
    componentRender(initialStore);
    expect(
      screen.getByTestId('CoachesReport|DesktopFilters')
    ).toBeInTheDocument();
  });
});
