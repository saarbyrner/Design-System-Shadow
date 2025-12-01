import { screen, render } from '@testing-library/react';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import {
  useGetAnnotationMedicalTypesQuery,
  useGetMultipleCoachesNotesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import CoachesReportRefactorTab from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetMultipleCoachesNotesQuery: jest.fn(),
  useGetAnnotationMedicalTypesQuery: jest.fn(),
}));

const defaultProps = {
  isCoachesNotesError: false,
  isCoachesNotesSuccess: true,
  isCoachesNotesFetching: false,
  isCoachesNotesLoading: false,
  t: i18nextTranslateStub(),
  filters: {},
  canCreateNotes: true,
  rowSelectionModel: [40211],
  fetchNextGridRows: jest.fn(),
  updateCoachesNotePayLoad: jest.fn(),
  rehydrateGrid: jest.fn(),
  dataGridCurrentDate: '2024-04-14T18:00:00.000Z',
  permissions: {
    medical: { issues: { canView: true }, notes: { canCreate: true } },
  },
  grid: {
    rows: [
      {
        id: 40211,
        athlete: {
          fullname: 'Tomas Albornoz',
          position: 'Second Row',
          avatar_url: 'url_here',
          availability: 'unavailable',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'unavailable',
          unavailable_since: '282 days',
        },
        most_recent_coaches_note: {
          id: 6988898,
          title: 'Note Title 6988898',
          content: '<p>coach note here tomas</p>',
          annotation_date: '2024-05-07T23:00:00Z',
          created_by: {
            id: 137860,
            fullname: 'Kendrick woo',
          },
          updated_by: {
            id: 16860,
            fullname: 'Fredrick foo',
          },
          created_at: '2024-05-07T23:00:00Z',
          updated_at: '2024-05-07T23:00:00Z',
        },
        open_injuries_illnesses: {
          has_more: false,
          issues: [
            {
              id: 13899,
              issue_id: 13900,
              name: 'Oct  6, 2022 - Abcess Ankle (excl. Joint) [Left]',
              status: 'Causing unavailability (time-loss)',
              causing_unavailability: true,
              issue_type: 'Illness',
            },
          ],
        },
        squad: [
          {
            name: 'International Squad',
            primary: true,
          },
        ],
      },
    ],
    next_id: null,
  },
};

const store = storeFake({
  medicalApi: {
    useGetAnnotationMedicalTypesQuery: jest.fn(),
    useGetMultipleCoachesNotesQuery: jest.fn(),
  },
});

const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={store}>
      <CoachesReportRefactorTab {...props} />
    </Provider>
  );

describe('<CoachesReportRefactorTab />', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: { issues: { canView: true }, notes: { canCreate: true } },
      },
    });

    const fakeDate = new Date('2024-04-14T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);

    useGetAnnotationMedicalTypesQuery.mockReturnValue({
      data: [
        { id: 11446, type: 'OrganisationAnnotationTypes::DailyStatusNote' },
      ],
      error: false,
      isLoading: false,
    });

    useGetMultipleCoachesNotesQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isFetching: false,
      isSuccess: true,
    });
  });

  it('renders correctly', () => {
    renderComponent();

    const expectedHeader = `Daily Status Report - ${formatStandard({
      date: moment(defaultProps.dataGridCurrentDate),
    })}`;

    expect(
      screen.getByRole('heading', {
        name: expectedHeader,
        level: 3,
      })
    ).toBeInTheDocument();
  });

  it('calls correct endpoint for copy multiple notes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderComponent();

    const firstAthleteCheckBox = screen.getAllByRole('checkbox')[1];

    await user.click(firstAthleteCheckBox);

    await user.click(screen.getByText('Copy last note'));
    expect(defaultProps.updateCoachesNotePayLoad).toHaveBeenCalledTimes(1);
    expect(defaultProps.updateCoachesNotePayLoad).toHaveBeenCalledWith({
      athleteIds: defaultProps.rowSelectionModel,
      organisationAnnotationTypes: [
        'OrganisationAnnotationTypes::DailyStatusNote',
      ],
      annotationDate: defaultProps.dataGridCurrentDate,
      includeCopiedFrom: true,
    });
  });

  it('calls correct prop/endpoint for copy last report', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderComponent();

    await user.click(screen.getByText('Copy last report'));

    expect(defaultProps.updateCoachesNotePayLoad).toHaveBeenCalledWith({
      athleteIds: [],
      organisationAnnotationTypes: [
        'OrganisationAnnotationTypes::DailyStatusNote',
      ],
      annotationDate: defaultProps.dataGridCurrentDate,
      includeCopiedFrom: true,
    });
  });
});
