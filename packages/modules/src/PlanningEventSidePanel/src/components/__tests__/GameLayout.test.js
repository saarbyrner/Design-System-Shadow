import { render, screen } from '@testing-library/react';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import GameLayout from '../game/GameLayout';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
}));

const defaultEvent = {
  type: 'game_event',
  title: '',
  turnaround_prefix: '',
  turnaround_fixture: true,
  are_participants_duplicated: false,
  local_timezone: 'Europe/Dublin',
  start_time: '2021-07-12T10:00:16+00:00',
  duration: '20',
  description: '',
};

const defaultProps = {
  event: defaultEvent,
  panelMode: 'CREATE',
  eventValidity: {},
  onUpdateEventStartTime: jest.fn(),
  onUpdateEventDuration: jest.fn(),
  onUpdateEventDate: jest.fn(),
  onUpdateEventTimezone: jest.fn(),
  onUpdateEventTitle: jest.fn(),
  onUpdateEventDetails: jest.fn(),
  onDataLoadingStatusChanged: jest.fn(),
  t: (key) => key,
};

const renderComponent = (customProps = {}) => {
  return render(<GameLayout {...defaultProps} {...customProps} />);
};

beforeEach(() => {
  window.featureFlags = {
    'mls-emr-advanced-options': false,
    'event-collection-show-sports-specific-workload-units': false,
  };

  window.getFlag = jest.fn((flag) => {
    return !!window.featureFlags[flag];
  });

  useGetOrganisationQuery.mockReturnValue({
    data: {
      id: 1,
      name: 'Liverpool',
      association_name: 'Premier League',
    },
  });
});

describe('<GameLayout />', () => {
  test('renders CommonFields and GameFields', () => {
    renderComponent();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  test('renders checkbox for duplicate participants in DUPLICATE mode', () => {
    renderComponent({ panelMode: 'DUPLICATE' });

    const checkbox = screen.getByRole('checkbox', {
      name: /Duplicate participants/i,
    });
    expect(checkbox).toBeInTheDocument();
  });

  test('does not render OrgCustomFields or EventConditionFields by default', () => {
    renderComponent();
    expect(screen.queryByText('Additional details')).not.toBeInTheDocument();
  });

  describe('when planning-custom-org-event-details flag is true', () => {
    beforeEach(() => {
      window.featureFlags['planning-custom-org-event-details'] = true;
      window.getFlag.mockImplementation(
        (flag) => flag === 'planning-custom-org-event-details'
      );
    });

    test('renders SectionHeading and OrgCustomFields without secondary text', () => {
      renderComponent();

      expect(screen.getByText('Additional details')).toBeInTheDocument();
      expect(screen.queryByText('(Optional)')).not.toBeInTheDocument();
    });
  });

  describe('when mls-emr-advanced-options flag is true', () => {
    beforeEach(() => {
      window.featureFlags['mls-emr-advanced-options'] = true;
      window.getFlag.mockImplementation((flag) => !!window.featureFlags[flag]);
    });

    test('renders SectionHeading with secondary text and EventConditionFields', () => {
      renderComponent();

      expect(screen.getByText('Additional details')).toBeInTheDocument();
      expect(screen.getByText('(Optional)')).toBeInTheDocument();
    });
  });

  describe('when event-collection-show-sports-specific-workload-units flag is true', () => {
    beforeEach(() => {
      window.featureFlags[
        'event-collection-show-sports-specific-workload-units'
      ] = true;
      window.getFlag.mockImplementation((flag) => !!window.featureFlags[flag]);
    });

    test('renders WorkloadUnitFields section', () => {
      renderComponent();
      expect(
        screen.getByTestId('GameLayout|WorkloadUnitFields')
      ).toBeInTheDocument();
    });
  });

  test('renders and wires DescriptionField correctly', () => {
    renderComponent();

    const descriptionField = screen.getByTestId('GameLayout|DescriptionField');
    expect(descriptionField).toBeInTheDocument();
  });
});
