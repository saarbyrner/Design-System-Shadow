import { Provider } from 'react-redux';
import { I18nextProvider, setI18n } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import i18n from '@kitman/common/src/utils/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import {
  groupAthletesByPosition,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  groupAthletesByName,
  groupAthletesByPositionGroup,
  getFilteredAthletes,
} from '@kitman/common/src/utils';
import athleteData from '../../../utils/dummyAthleteData';
import App from '../App';

setI18n(i18n);

jest.mock('@kitman/common/src/hooks/useEventTracking');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('Availability List <App /> Container', () => {
  let store;
  const dispatchSpy = jest.fn();
  const mockTrackEvent = jest.fn();

  const groupOrderingByType = {
    availability: ['unavailable', 'injured', 'returning', 'available'],
    positionGroup: ['Forward', 'Back', 'Other'],
  };
  const athletes = athleteData();
  const groupedAthletes = {
    position: groupAthletesByPosition(athletes),
    positionGroup: groupAthletesByPositionGroup(
      athletes,
      groupOrderingByType.position
    ),
    availability: groupAthletesByAvailability(athletes),
    last_screening: groupAthletesByScreening(athletes),
    name: groupAthletesByName(athletes),
  };

  beforeEach(() => {
    window.featureFlags = {};
    dispatchSpy.mockClear();
    mockTrackEvent.mockClear();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });

    store = storeFake({
      athletes: {
        all: athletes,
        grouped: {
          position: groupedAthletes.position,
          positionGroup: groupedAthletes.positionGroup,
          availability: groupedAthletes.availability,
          last_screening: groupedAthletes.last_screening,
          name: groupedAthletes.name,
        },
        currentlyVisible: getFilteredAthletes(
          groupedAthletes.positionGroup,
          '',
          null,
          [],
          [],
          {},
          null,
          ''
        ),
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
        availabilityByPositionGroup: {},
        availabilityByPosition: {},
      },
      issueStaticData: {
        injuryOsicsPathologies: [],
        illnessOsicsPathologies: [],
        absenceReasons: [],
        issueStatusOptions: [],
        diagnosticsWithExtraFields: [],
        sides: [],
      },
      addAbsenceModal: {
        absenceData: {
          reason_id: null,
          from: '',
          to: '',
          athlete_id: null,
        },
        absenceReasons: [],
        athlete: null,
        isModalOpen: false,
      },
      treatmentSessionModal: {
        isModalOpen: false,
        athlete: {
          fullname: '',
          id: null,
        },
        treatmentSession: {
          user_id: 1234,
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: null,
              duration: null,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              note: '',
            },
          ],
          annotation_attributes: {
            content: '',
            attachments_attributes: [],
          },
        },
        unUploadedFiles: [],
        staticData: {
          bodyAreaOptions: [],
          treatmentModalityOptions: [],
          reasonOptions: [],
          users: [],
        },
      },
      fileUploadToast: {
        fileOrder: [],
        fileMap: {},
      },
      noteModal: {
        athlete: null,
        isModalOpen: false,
        noteData: {},
        requestStatus: {
          status: null,
          message: null,
        },
      },
      injuryUploadModal: {
        isModalOpen: false,
      },
      modInfoModal: {
        athlete: null,
        isModalOpen: false,
        modInfoData: {
          text: '',
          rtp: '',
        },
      },
      modRTPModal: {
        athlete: null,
        isModalOpen: false,
        modRTPData: {
          rtp: '',
        },
      },
      diagnosticModal: {
        athlete: null,
        isModalOpen: false,
        athleteInjuries: [],
        athleteIllnesses: [],
        attachments: [],
        diagnosticData: {
          diagnostic_date: null,
          diagnostic_type: null,
          injury_ids: [],
          illness_ids: [],
          attachment_ids: [],
          medication_type: null,
          medication_dosage: null,
          medication_frequency: null,
          medication_notes: null,
          medication_completed: false,
          medication_completed_at: null,
        },
      },
      appStatus: {
        status: null,
        message: null,
      },
    });
    store.dispatch = dispatchSpy;
  });

  test('renders the component', () => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Current availability:')).toBeInTheDocument();
    expect(screen.getByText('Group By')).toBeInTheDocument();
  });
});
