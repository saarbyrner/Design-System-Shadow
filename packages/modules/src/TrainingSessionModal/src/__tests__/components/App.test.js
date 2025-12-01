import { render, screen, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { setI18n } from 'react-i18next';
import userEvent from '@testing-library/user-event';

import * as services from '@kitman/services';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';

import { AppTranslated as App } from '../../components/App';

jest.mock('@kitman/services');
jest.mock('@kitman/common/src/utils/test_utils.js');

const mockWorkloadTypes = [{ id: 1, title: 'Workload type 1' }];
const mockSessionTypes = [{ id: 1, title: 'Session type 1' }];
const mockEventConditions = {
  surface_types: [{ id: 1, name: 'Surface type 1' }],
  surface_qualities: [{ id: 1, name: 'Surface quality 1' }],
  weather_conditions: [{ id: 1, name: 'Weather condition 1' }],
  temperature_units: 'F',
};

const eventProp = {
  id: 2,
  local_timezone: 'Europe/Dublin',
  start_date: '2023-10-26T10:00:00.000Z',
  date: '2023-10-26T10:00:00.000Z',
  duration: 20,
  session_type: { id: 1 },
  sessionTypeId: 1,
  game_day_plus: null,
  game_day_minus: null,
  workload_type: { id: 1 },
  workloadType: 1,
  surface_quality: { id: 1 },
  surface_type: { id: 1 },
  weather: { id: 1 },
  temperature: 20,
};

setI18n(i18n);

describe('Training Session Modal <App /> component', () => {
  beforeEach(() => {
    services.getWorkloadTypes.mockResolvedValue(mockWorkloadTypes);
    services.getSessionTypes.mockResolvedValue(mockSessionTypes);
    services.getEventConditions.mockResolvedValue(mockEventConditions);
    moment.tz.setDefault('UTC');
    moment.tz.names = () => ['UTC', 'Europe/Dublin'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct title for EDIT mode', async () => {
    render(
      <App formMode="EDIT" event={eventProp} t={i18nextTranslateStub()} />
    );
    await waitFor(() => {
      expect(screen.getByText('Edit Session')).toBeInTheDocument();
    });
  });

  it('renders the correct title for DUPLICATE mode', async () => {
    render(<App formMode="DUPLICATE" event={eventProp} />);
    await waitFor(() => {
      expect(screen.getByText('Duplicate Session')).toBeInTheDocument();
    });
  });

  it('renders the correct title for CREATE mode', async () => {
    render(<App formMode="CREATE" event={eventProp} />);
    await waitFor(() => {
      expect(screen.getByText('New Session')).toBeInTheDocument();
    });
  });

  it('calls the correct callback when the modal is closed', async () => {
    const mockCloseModal = jest.fn();
    const user = userEvent.setup();
    render(
      <App
        calledOutsideReact={false}
        closeModal={mockCloseModal}
        isOpen
        formMode="CREATE"
        event={eventProp}
      />
    );

    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the form mode is EDIT', () => {
    it('initiates the modal correctly and populates the form', async () => {
      render(<App event={eventProp} formMode="EDIT" />);

      await waitFor(() => {
        expect(screen.getByText('Edit Session')).toBeInTheDocument();
      });

      expect(
        screen.getAllByText('Workload')[0].closest('div.customDropdown')
      ).toBeInTheDocument();

      expect(
        screen.getAllByText('Session Type')[0].closest('div.customDropdown')
      ).toBeInTheDocument();

      expect(
        screen.getAllByText('Timezone')[0].closest('div.customDropdown')
      ).toBeInTheDocument();
    });
  });
});
