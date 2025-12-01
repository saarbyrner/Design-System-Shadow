import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import {
  groupAthletesByPosition,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByName,
  groupAthletesByPositionGroup,
} from '@kitman/common/src/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import App from '../App';
import athleteData from '../../../utils/dummyAthleteData';

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('../../containers/AvailabilityTable', () => () => (
  <div>Mocked AvailabilityTable</div>
));

jest.mock('@kitman/components', () => ({
  __esModule: true,
  AthleteFilters: () => <div>Mocked AthleteFilters</div>,
  IconButton: (props) => {
    const { onClick, isActive } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        data-is-active={isActive || false}
      >
        MockIconButton
      </button>
    );
  },
  PageHeader: ({ children }) => <div>{children}</div>,
  PrintHeader: () => <div>Mocked PrintHeader</div>,
}));

jest.mock('../../containers/TreatmentSessionModal', () => () => (
  <div>Mocked TreatmentSessionModal</div>
));

jest.mock('../../containers/AddDiagnosticInterventionModal', () => () => (
  <div>Mocked AddDiagnosticInterventionModal</div>
));

jest.mock('../../containers/RPTModal', () => () => <div>Mocked RPTModal</div>);

jest.mock('../../containers/ModInfoModal', () => () => (
  <div>Mocked ModInfoModal</div>
));

jest.mock('../../containers/AddNoteModal', () => () => (
  <div>Mocked AddNoteModal</div>
));

jest.mock('../../containers/AddAbsenceModal', () => () => (
  <div>Mocked AddAbsenceModal</div>
));

jest.mock('../../containers/InjuryUploadModal', () => () => (
  <div>Mocked InjuryUploadModal</div>
));

jest.mock('../../containers/AppStatus', () => () => (
  <div>Mocked AppStatus</div>
));

jest.mock('../../containers/Toast', () => () => <div>Mocked Toast</div>);

setI18n(i18n);

const mockStore = {
  getState: () => ({
    addAbsenceModal: {
      absenceData: {
        reasonId: null,
        fromDate: null,
        toDate: null,
      },
      athlete: null,
      isModalOpen: false,
    },
    issueStaticData: {
      absenceReasons: [],
    },
    appStatus: {
      status: 'success',
      message: '',
    },
    modInfo: {
      isModalOpen: false,
    },
    fileUploadToast: {
      fileOrder: [],
      fileMap: {},
    },
    noteModal: {
      athlete: null,
      isModalOpen: false,
      noteData: {
        date: moment('2025-06-15T18:00:00Z'),
        type: 'injury',
        note: '',
        restricted: false,
        psych_only: false,
        relevantIssueIds: [],
      },
    },
    injuryUploadModal: {
      isModalOpen: false,
    },
    treatmentSessionModal: {
      athlete: {},
      isModalOpen: false,
      treatmentSession: {
        date: moment('2025-06-15T18:00:00Z'),
        annotation_attributes: {
          content: '',
        },
        treatments_attributes: [],
      },
      staticData: {
        bodyAreaOptions: [],
        treatmentModalityOptions: [],
        reasonOptions: [],
        users: [],
      },
    },
    RPTModal: {
      isModalOpen: false,
    },
    addDiagnosticInterventionModal: {
      isModalOpen: false,
    },
    diagnosticIntervention: {
      isModalOpen: false,
    },
  }),
  subscribe: jest.fn(),
  dispatch: jest.fn(),
};

describe('Availability List <App /> component', () => {
  let props;
  const dummyAthleteData = athleteData();
  const groupOrderingByType = {
    availability: ['unavailable', 'injured', 'returning', 'available'],
    positionGroup: ['Forward', 'Back', 'Other'],
  };
  const groupedAthletes = {
    position: groupAthletesByPosition(dummyAthleteData),
    positionGroup: groupAthletesByPositionGroup(
      dummyAthleteData,
      groupOrderingByType.position
    ),
    availability: groupAthletesByAvailability(dummyAthleteData),
    last_screening: groupAthletesByScreening(dummyAthleteData),
    name: groupAthletesByName(dummyAthleteData),
  };
  const mockTrackEvent = jest.fn();

  beforeEach(() => {
    const fakeDate = new Date('2025-06-15T18:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
    mockTrackEvent.mockClear();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });

    props = {
      athletes: {
        all: dummyAthleteData,
        grouped: {
          position: groupedAthletes.position,
          positionGroup: groupedAthletes.positionGroup,
          availability: groupedAthletes.availability,
          last_screening: groupedAthletes.last_screening,
          name: groupedAthletes.name,
        },
        currentlyVisible: groupedAthletes.positionGroup,
        groupBy: 'positionGroup',
        groupOrderingByType,
        isFilterShown: false,
        athleteFilters: [],
        groupingLabels: {
          unavailable: 'Unavailable',
          available: 'Available',
          injured: 'Available (Injured/Ill)',
          returning: 'Available (Returning from injury/illness)',
          screened: 'Screened Today',
          not_screened: 'Not Screened Today',
          alphabetical: 'Alphabetical (A-Z)',
        },
        availabilityByPosition: {
          'Blindside Flanker': 100,
          Fullback: 100,
          Hooker: 50,
          'Inside Centre': 100,
          'Loose-head Prop': 0,
          'No. 8': 67,
          'Openside Flanker': 100,
          'Out Half': 50,
          'Scrum Half': 33,
          'Second Row': 100,
          'Tight-head Prop': 0,
          Wing: 100,
        },
        availabilityByPositionGroup: {
          Back: 30,
          Forward: 60,
        },
      },
      noteModal: {
        athlete: null,
        isModalOpen: false,
        noteData: {
          date: moment('2025-06-15T18:00:00Z'),
          type: 'injury',
          note: '',
          restricted: false,
          psych_only: false,
          relevantIssueIds: [],
        },
      },
      loadAthletes: jest.fn(),
      isInjuryUploadOpen: false,
      openAddNoteModal: jest.fn(),
      openInjuryUploadModal: jest.fn(),
      toggleAthleteFilters: jest.fn(),
      updateFilterOptions: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders', () => {
    renderWithRedux(<App {...props} />, {
      preloadedState: mockStore.getState(),
      useGlobalStore: false,
    });
    expect(screen.getByText('Current availability:')).toBeInTheDocument();
  });

  test('renders the availability table', () => {
    renderWithRedux(<App {...props} />, {
      preloadedState: mockStore.getState(),
      useGlobalStore: false,
    });
    expect(screen.getByText('Mocked AvailabilityTable')).toBeInTheDocument();
  });

  describe('when there are no athletes', () => {
    beforeEach(() => {
      props.athletes.all = [];
    });

    test('renders the empty text and hides the table', () => {
      renderWithRedux(<App {...props} />, {
        preloadedState: mockStore.getState(),
        useGlobalStore: false,
      });
      expect(
        screen.queryByText('Mocked AvailabilityTable')
      ).not.toBeInTheDocument();

      expect(
        screen.getByText(
          '#sport_specific__There_are_no_athletes_within_this_squad'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when the toggle filter button is clicked', () => {
    test('calls the correct callback', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithRedux(<App {...props} />, {
        preloadedState: mockStore.getState(),
        useGlobalStore: false,
      });

      const filterButton = screen.getAllByRole('button', {
        name: 'MockIconButton',
      })[0];
      await user.click(filterButton);

      expect(props.toggleAthleteFilters).toHaveBeenCalledTimes(1);
      expect(props.toggleAthleteFilters).toHaveBeenCalledWith(
        props.athletes.isFilterShown
      );
    });
  });

  describe('when there is an active athlete filtering', () => {
    beforeEach(() => {
      props.athletes.athleteFilters = [1644];
    });

    test('has the correct filter button', () => {
      renderWithRedux(<App {...props} />, {
        preloadedState: mockStore.getState(),
        useGlobalStore: false,
      });

      const filterButton = screen.getAllByRole('button', {
        name: 'MockIconButton',
      })[0];

      expect(filterButton).toHaveAttribute('data-is-active', 'true');
    });
  });

  describe('when the import injuries button is clicked', () => {
    test('calls the correct callback', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      renderWithRedux(<App {...props} />, {
        preloadedState: mockStore.getState(),
        useGlobalStore: false,
      });

      const importButton = screen.getAllByRole('button', {
        name: 'MockIconButton',
      })[1];
      await user.click(importButton);

      expect(props.openInjuryUploadModal).toHaveBeenCalledTimes(1);
      expect(props.openInjuryUploadModal).toHaveBeenCalledWith();
    });
  });
});
