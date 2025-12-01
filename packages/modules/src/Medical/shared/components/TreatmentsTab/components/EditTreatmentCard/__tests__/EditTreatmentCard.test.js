import { screen, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import EditTreatmentCard from '..';

setI18n(i18n);

const editedTreatment = {
  athlete_id: 33925,
  date: '2022-07-25T15:26:58Z',
  user_id: 31369,
  start_time: '2021-08-12T16:00:00Z',
  end_time: '2021-08-12T16:30:00Z',
  timezone: 'Europe/Dublin',
  title: 'Treatment Note',
  treatments_attributes: [
    {
      treatment_modality_id: 2,
      issue_id: 2,
      issue_type: 2,
      duration: '10',
      reason: 2,
      treatment_body_areas_attributes: [],
      note: 'Hello world note',
    },
  ],
  annotation_attributes: {
    content: 'Note content',
    attachments_attributes: [],
  },
};

const props = {
  athleteId: 33925,
  athleteData: {
    id: 33925,
    fullname: 'McClune AJ',
    avatar_url: '',
    date_of_birth: null,
    age: null,
    height: '123 cm',
    country: 'Albania',
    squad_names: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    allergy_names: [],
    position_group_id: 25,
    position_group: 'Forward',
    position_id: 72,
    position: 'Loose-head Prop',
    availability: 'available',
    unresolved_issues_count: 0,
  },
  editedTreatment,
  initialDataRequestStatus: jest.fn(),
  isDeleteAthleteDisabeld: false,
  isInvalid: false,
  onClickAddTreatment: jest.fn(),
  onClickRemoveAthlete: jest.fn(),
  onClickRemoveTreatment: jest.fn(),

  staffUsers: [{ value: 31369, label: 'Practitioner guy' }],
  treatmentSessionOptions: {
    modalityOptions: [
      {
        value: 1,
        label: 'Modality One',
      },
      {
        value: 2,
        label: 'Modality Two',
      },
    ],
    bodyAreaOptions: [
      {
        value: 1,
        label: 'Arm',
      },
      {
        value: 2,
        label: 'Bicep',
      },
    ],
    reasonOptions: [
      {
        value: 1,
        label: 'Broken Arm [Left]',
      },
      {
        value: 2,
        label: 'Sore Head [N/A]',
      },
    ],
  },
  t: i18nextTranslateStub(),
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  treatmentCardList: {
    athleteTreatments: {
      33925: editedTreatment,
    },
    invalidEditTreatmentCards: [],
  },
});

describe('<EditTreatmentCard />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-15T18:00:00Z')); // UTC FORMAT
    window.featureFlags['replicate-treatments-clear-actions'] = true;
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    window.featureFlags['replicate-treatments-clear-actions'] = false;
    moment.tz.setDefault();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders the correct loading content', async () => {
    renderWithRedux(
      <EditTreatmentCard {...props} initialDataRequestStatus="PENDING" />,
      {
        preloadedState: store.getState(),
        useGlobalStore: false,
      }
    );

    jest.advanceTimersByTime(400);
    await waitFor(() => {
      expect(screen.getByText('Loading ...')).toBeInTheDocument();
    });
  });

  it('renders the correct content', async () => {
    renderWithRedux(
      <EditTreatmentCard {...props} initialDataRequestStatus="SUCCESS" />,
      {
        preloadedState: store.getState(),
        useGlobalStore: false,
      }
    );

    jest.advanceTimersByTime(400);

    await waitFor(() => {
      expect(screen.getByText('McClune AJ')).toBeInTheDocument();

      expect(screen.getByText('Note')).toBeInTheDocument();
      expect(screen.getByText('Note content')).toBeInTheDocument();

      const inputs = screen.getAllByRole('textbox');

      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(inputs[0]).toHaveValue('25 Jul 2022');

      expect(screen.getByText('Timezone')).toBeInTheDocument();
      expect(screen.getByText('Europe/Dublin')).toBeInTheDocument();

      expect(screen.getByText('Practitioner guy')).toBeInTheDocument();

      expect(screen.getByText('Start time')).toBeInTheDocument();
      expect(inputs[2]).toHaveValue('4:00 pm');

      expect(screen.getByText('End time')).toBeInTheDocument();
      expect(inputs[3]).toHaveValue('4:30 pm');

      expect(screen.getByText('Modality')).toBeInTheDocument();
      expect(screen.getByText('Modality Two')).toBeInTheDocument();

      expect(screen.getByText('Reason')).toBeInTheDocument();
      expect(screen.getByText('Body area')).toBeInTheDocument();

      expect(screen.getByText('Duration')).toBeInTheDocument();
      const durationMins = screen.getByRole('spinbutton');
      expect(durationMins).toHaveValue(10);

      expect(screen.getByText('Comment')).toBeInTheDocument();
      expect(screen.getByText('Hello world note')).toBeInTheDocument();

      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });
  });

  it('renders warning text when times are the same', async () => {
    renderWithRedux(
      <EditTreatmentCard
        {...props}
        initialDataRequestStatus="SUCCESS"
        isInvalid
        editedTreatment={{
          ...props.editedTreatment,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T16:05:00Z',
        }}
      />,
      {
        preloadedState: store.getState(),
        useGlobalStore: false,
      }
    );

    jest.advanceTimersByTime(400);
    await waitFor(() => {
      expect(
        screen.getByText('End time cannot be the same as start time')
      ).toBeInTheDocument();
    });
  });
});
