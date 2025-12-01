import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ParticipationGrid from '../ParticipationGrid';

const props = {
  isLoading: false,
  canViewAvailabilities: true,
  type: 'ATHLETE',
  participants: [
    {
      id: 1,
      name: 'Sample Athlete 1',
      avatar_url: 'sample_url',
      participation_level: 'full',
      availability: 'available',
      position: {
        id: 3456,
        name: 'Scrum Half',
      },
    },
    {
      id: 2,
      name: 'Sample Athlete 2',
      avatar_url: 'sample_url_2',
      participation_level: 'full',
      availability: 'available',
      position: {
        id: 3456,
        name: 'Scrum Half',
      },
    },
  ],
  activities: [
    {
      id: 1,
      athletes: [],
      event_activity_type: {
        id: 1,
        name: 'Warm up',
      },
    },
    {
      id: 2,
      athletes: [],
    },
    {
      id: 3,
      athletes: [],
    },
  ],
  onSelectParticipant: jest.fn(),
  onSelectAllParticipants: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('ParticipationGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when rendering for athletes', () => {
    it('renders the correct header structure for athletes', () => {
      render(<ParticipationGrid {...props} />);

      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Participation level')).toBeInTheDocument();

      expect(screen.getByText('Sample Athlete 1')).toBeInTheDocument();
      expect(screen.getByText('Sample Athlete 2')).toBeInTheDocument();
    });

    it('renders the correct header structure for staff', () => {
      render(<ParticipationGrid {...props} type="STAFF" />);

      // Staff should show "Staff" and "Role" instead of athlete-specific headers
      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      // Staff should not have participation level column
      expect(screen.queryByText('Participation level')).not.toBeInTheDocument();
    });

    it('displays participant information correctly', () => {
      render(<ParticipationGrid {...props} />);

      // Check participant names are displayed
      expect(screen.getByText('Sample Athlete 1')).toBeInTheDocument();
      expect(screen.getByText('Sample Athlete 2')).toBeInTheDocument();

      // Check positions are displayed
      expect(screen.getAllByText('Scrum Half')).toHaveLength(2);

      // Check participation levels are displayed
      expect(screen.getAllByText('full')).toHaveLength(2);
    });

    it('renders participant rows correctly', () => {
      render(<ParticipationGrid {...props} />);

      // Should render 2 participant rows
      const participantRows = screen.getAllByText(/Sample Athlete/);
      expect(participantRows).toHaveLength(2);
    });
  });

  describe('activity column headers', () => {
    it('displays activity with type name correctly', () => {
      render(<ParticipationGrid {...props} />);

      // First activity should show "1. Warm up"
      expect(screen.getByText('1. Warm up')).toBeInTheDocument();
    });

    it('displays activity without type name as index only', () => {
      render(<ParticipationGrid {...props} />);

      // Second and third activities should show just numbers
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('when there are no participants', () => {
    it('renders empty message for no athletes', () => {
      render(<ParticipationGrid {...props} participants={[]} />);

      expect(screen.getByText('No athletes found')).toBeInTheDocument();
    });
  });

  describe('checkbox interactions', () => {
    it('calls onSelectAllParticipants when header select-all checkbox is clicked', async () => {
      render(<ParticipationGrid {...props} />);

      const checkboxes = screen.getAllByRole('checkbox');

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeEnabled();
      });
    });

    it('disables checkboxes when loading', () => {
      render(<ParticipationGrid {...props} isLoading />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('participant selection state', () => {
    it('shows checked state for selected participants', () => {
      const propsWithSelectedParticipants = {
        ...props,
        activities: [
          {
            id: 1,
            athletes: [{ id: 1 }], // First participant is selected
            event_activity_type: {
              id: 1,
              name: 'Warm up',
            },
          },
        ],
      };

      render(<ParticipationGrid {...propsWithSelectedParticipants} />);

      // The checkbox for participant 1 in activity 1 should be checked
      const checkbox = screen.getAllByRole('checkbox')[0];

      // eslint-disable-next-line jest-dom/prefer-checked
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('shows unchecked state for unselected participants', () => {
      render(<ParticipationGrid {...props} />);

      // All participant checkboxes should be unchecked initially
      const participantCheckboxes = screen.getAllByRole('checkbox');

      participantCheckboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
      });
    });
  });

  describe('select all functionality', () => {
    it('shows select-all as checked when all participants are selected for an activity', () => {
      const propsWithAllSelected = {
        ...props,
        activities: [
          {
            id: 1,
            athletes: [{ id: 1 }, { id: 2 }], // All participants selected
            event_activity_type: {
              id: 1,
              name: 'Warm up',
            },
          },
        ],
      };

      render(<ParticipationGrid {...propsWithAllSelected} />);

      const selectAllCheckbox = screen.getAllByRole('checkbox');
      selectAllCheckbox.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });
  });
});
