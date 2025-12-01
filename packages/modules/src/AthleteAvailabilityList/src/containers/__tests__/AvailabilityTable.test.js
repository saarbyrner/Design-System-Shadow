import { render, screen, waitFor } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import AvailabilityTable from '../AvailabilityTable';
import * as AvailabilityTableActions from '../../actions';

jest.mock('../../actions', () => ({
  openAddAbsenceModal: jest.fn(),
  openAddNoteModal: jest.fn(),
  openModInfoModal: jest.fn(),
  openRTPModal: jest.fn(),
  openDiagnosticModal: jest.fn(),
  triggerTreatmentSessionModal: jest.fn(),
}));

const athleteData = () => [
  {
    id: 1644,
    fullname: 'John Doe',
    firstname: 'John',
    lastname: 'Doe',
    availability: 'unavailable',
    unavailable_since: '6 months',
    injuries: [
      {
        id: 1,
        issue_type: 'INJURY',
        last_event_date: '2018-04-30T00:00:00Z',
        status: 'Active',
      },
    ],
    illnesses: [],
    absences: [
      {
        id: 1,
        reason: 'Sick',
        start_date: '2019-07-26T00:00:00Z',
        end_date: '2019-07-26T00:00:00Z',
      },
    ],
    modification_info: 'New Test',
    rtp: null,
  },
  {
    id: 1941,
    fullname: 'Jane Smith',
    firstname: 'Jane',
    lastname: 'Smith',
    availability: 'available',
    unavailable_since: null,
    injuries: [],
    illnesses: [],
    absences: [],
    modification_info: null,
    rtp: null,
  },
];

describe('AvailabilityTable', () => {
  const athletes = athleteData();

  const initialState = {
    athletes: {
      currentlyVisible: {
        Forward: athletes,
      },
      groupBy: 'positionGroup',
      groupOrderingByType: {
        positionGroup: ['Forward', 'Back', 'Other'],
      },
      groupingLabels: {
        Forward: 'Forward',
      },
      availabilityByPositionGroup: {
        Forward: 100,
      },
    },
    issueStaticData: {
      injuryOsicsPathologies: [],
      illnessOsicsPathologies: [],
      issueStatusOptions: [
        { id: 1, description: 'Active' },
        { id: 2, description: 'Resolved' },
      ],
      bamicGrades: [],
      absenceReasons: [],
      canViewIssues: true,
      canManageIssues: true,
      canViewAbsences: true,
      canManageAbsences: true,
      canManageMedicalNotes: true,
      canViewNotes: true,
    },
    noteModal: {
      isModalOpen: false,
    },
    modInfoModal: {
      isModalOpen: false,
    },
  };

  beforeAll(() => {
    setI18n(i18n);
  });

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: jest.fn(),
    getState: () => ({ ...state }),
  });

  it('renders the component', () => {
    const store = storeFake(initialState);
    render(
      <Provider store={store}>
        <AvailabilityTable />
      </Provider>
    );
    expect(screen.getByText('#sport_specific__Athlete')).toBeInTheDocument();
  });

  it('renders no athletes message when there are no athletes', () => {
    const emptyState = {
      ...initialState,
      athletes: {
        ...initialState.athletes,
        currentlyVisible: {},
      },
    };
    const store = storeFake(emptyState);
    render(
      <Provider store={store}>
        <AvailabilityTable />
      </Provider>
    );
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders athlete names', () => {
    const store = storeFake(initialState);
    render(
      <Provider store={store}>
        <AvailabilityTable />
      </Provider>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('opens the add absence modal when "Add Absence" is clicked', async () => {
    const store = storeFake(initialState);
    const { user } = renderWithUserEventSetup(
      <Provider store={store}>
        <AvailabilityTable />
      </Provider>
    );
    // The original query screen.getAllByRole('button', { name: /more/i })[0] was failing, trying to find the element by class name
    const moreMenuIcon = document.querySelector('.icon-more');
    if (!moreMenuIcon) {
      throw new Error('More menu icon not found');
    }
    const moreMenu = moreMenuIcon;
    await user.click(moreMenu);
    const addAbsenceButton = screen.getByText('Add Absence');
    await user.click(addAbsenceButton);
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        AvailabilityTableActions.openAddAbsenceModal(athletes[0])
      );
    });
  });
});
