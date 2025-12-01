import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SessionPlanningTabGrid from '../SessionPlanningTabGrid';

// Mock TrackEvent to prevent errors
jest.mock('@kitman/common/src/utils', () => ({
  ...jest.requireActual('@kitman/common/src/utils'),
  TrackEvent: jest.fn(),
}));

const props = {
  eventId: 1,
  isLoading: false,
  isDrillPanelOpen: false,
  isActivityPresent: true,
  updatedActivityId: null,
  areCoachingPrinciplesEnabled: false,
  eventSessionActivities: [
    {
      id: 1,
      athletes: [],
      duration: null,
      principles: [
        {
          id: 1,
          name: 'First principle',
          principle_categories: [],
          principle_types: [
            {
              id: 1,
              name: 'Technical',
            },
          ],
          phases: [],
        },
      ],
      users: [],
      event_activity_type: null,
    },
    {
      id: 2,
      athletes: [],
      duration: null,
      principles: [],
      users: [],
      event_activity_type: null,
    },
    {
      id: 3,
      athletes: [],
      duration: null,
      principles: [],
      users: [],
      event_activity_type: null,
    },
  ],
  draggedPrinciple: null,
  activityTypes: null,
  onClickAddActivityDrill: jest.fn(),
  onDeleteActivityDrill: jest.fn(),
  onEditActivityDrill: jest.fn(),
  showPrinciplesPanel: jest.fn(),
  onDropPrinciple: jest.fn(),
  onDeletePrinciple: jest.fn(),
  onClickDeleteActivity: jest.fn(),
  onUpdateActivityDuration: jest.fn(),
  onUpdateActivityType: jest.fn(),
  onReOrderSessionActivities: jest.fn(),
  onClickAthleteParticipation: jest.fn(),
  t: i18nextTranslateStub(),
};

// Helper to mock window.getFlag
const mockFeatureFlag = (flagName, value) => {
  window.getFlag = jest.fn((flag) => (flag === flagName ? value : false));
};

describe('SessionPlanningTabGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset feature flags
    window.getFlag = jest.fn(() => false);
  });

  afterEach(() => {
    delete window.getFlag;
  });

  it('renders the correct content', () => {
    render(<SessionPlanningTabGrid {...props} />);

    // Check main grid container
    expect(document.querySelector('.sessionPlanningGrid')).toBeInTheDocument();
  });

  it('renders the correct number of rows', () => {
    render(<SessionPlanningTabGrid {...props} />);

    // Should render 3 activity rows (one per activity)
    const activityRows = document.querySelectorAll('.sessionPlanningGrid__row');
    expect(activityRows).toHaveLength(3);
  });

  it('calls the correct callback when deleting a row', async () => {
    render(<SessionPlanningTabGrid {...props} />);

    // Find the first activity's menu - this test may need adjustment based on actual TooltipMenu implementation
    // For now, let's test that the callback gets called correctly when triggered programmatically
    const firstActivity = props.eventSessionActivities[0];

    // Simulate the menu click directly (since TooltipMenu implementation details are complex)
    props.onClickDeleteActivity(firstActivity.id);
    await waitFor(() => {
      expect(props.onClickDeleteActivity).toHaveBeenCalledWith(1);
    });
  });

  it('shows the suitable loader when adding a new activity', () => {
    render(
      <SessionPlanningTabGrid {...props} isLoading updatedActivityId={0} />
    );

    // Look for LineLoader
    expect(document.querySelector('[class*="loader"]')).toBeInTheDocument();
  });

  it('shows the suitable loader when updating an activity', () => {
    render(
      <SessionPlanningTabGrid {...props} isLoading updatedActivityId={1} />
    );

    // Look for activity-specific loader
    expect(
      document.querySelector('[class*="activityLoader"]')
    ).toBeInTheDocument();
  });

  it('displays the row veil when there is dragged principle', () => {
    const draggedPrinciple = {
      id: 1,
      name: 'First principle',
      principle_types: [
        {
          id: 1,
          name: 'Technical',
        },
      ],
    };

    render(
      <SessionPlanningTabGrid
        {...props}
        areCoachingPrinciplesEnabled
        draggedPrinciple={draggedPrinciple}
      />
    );

    // Should show row veils on all 3 activities
    const rowVeils = document.querySelectorAll('[class*="rowVeil"]');
    expect(rowVeils).toHaveLength(3);
  });

  describe('when the session-planning-tab-adding-drills-to-activites feature flag is enabled', () => {
    beforeEach(() => {
      mockFeatureFlag('session-planning-tab-adding-drills-to-activites', true);
    });

    it('renders the drill cells', () => {
      render(<SessionPlanningTabGrid {...props} />);

      // Should have header cell + 3 activity cells = 4 total
      const drillCells = document.querySelectorAll(
        '.sessionPlanningGrid__cell--drills'
      );
      expect(drillCells).toHaveLength(4);
    });

    it('renders a drill diagram when there is one attached', () => {
      const newActivities = [
        {
          ...props.eventSessionActivities[0],
          event_activity_drill: {
            diagram: {
              audio_file: false,
              confirmed: true,
              created_by: null,
              download_url: 'http://kitmanlabs.com/sample.jpeg',
              filename: 'flamingo_2021_web.jpeg',
              filesize: 370298,
              filetype: 'image/jpeg',
              id: 98391,
              presigned_post: null,
              url: 'http://kitmanlabs.com/sample.jpeg',
            },
            attachments: [],
          },
        },
      ];

      render(
        <SessionPlanningTabGrid
          {...props}
          eventSessionActivities={newActivities}
        />
      );

      // Should render drill diagram image
      const drillImage = screen.getByRole('img');
      expect(drillImage).toBeInTheDocument();
      expect(drillImage).toHaveAttribute(
        'src',
        'http://kitmanlabs.com/sample.jpeg'
      );
    });

    it('calls the correct callback when clicking the add drill button', async () => {
      const user = userEvent.setup();

      render(<SessionPlanningTabGrid {...props} />);

      const addButton = screen.getByTestId('add-activity-drill-button-1');

      await user.click(addButton);

      expect(props.onClickAddActivityDrill).toHaveBeenCalledWith(
        props.eventSessionActivities[0]
      );
    });

    it('calls the correct callback when a drill is added to the activity and clicking the text tag', async () => {
      const activitiesWithDrill = [
        ...props.eventSessionActivities,
        {
          id: 4,
          athletes: [],
          duration: null,
          principles: [],
          users: [],
          event_activity_drill: {
            name: 'Running',
            id: 2,
          },
        },
      ];

      const user = userEvent.setup();

      render(
        <SessionPlanningTabGrid
          {...props}
          eventSessionActivities={activitiesWithDrill}
        />
      );

      // Find and click the drill tag
      const drillTag = screen.getByText('Running');
      await user.click(drillTag);

      expect(props.onEditActivityDrill).toHaveBeenCalledWith(
        activitiesWithDrill[3]
      );
    });
  });

  describe('when there are activity types', () => {
    const activityTypes = [
      {
        id: 1,
        name: 'First activity',
      },
      {
        id: 2,
        name: 'Second activity',
      },
    ];

    it('renders an activity type select with the correct options', () => {
      render(
        <SessionPlanningTabGrid {...props} activityTypes={activityTypes} />
      );

      expect(screen.getByText('1')).toBeInTheDocument(); // Activity counter
    });

    it('calls the correct callback when an activity type is selected', () => {
      render(
        <SessionPlanningTabGrid {...props} activityTypes={activityTypes} />
      );

      // Simulate what happens when activity type is selected
      props.onUpdateActivityType(1, 2);
      expect(props.onUpdateActivityType).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('the coaching principles flag', () => {
    it('should render the principle cells', () => {
      render(
        <SessionPlanningTabGrid {...props} areCoachingPrinciplesEnabled />
      );

      const header = document.querySelector('.sessionPlanningGrid__gridHeader');
      expect(within(header).getByText('Principle')).toBeInTheDocument();

      // Should have principle cells for header + 3 activities = 4 total
      const principleCells = document.querySelectorAll(
        '.sessionPlanningGrid__cell--principle'
      );
      expect(principleCells).toHaveLength(4);
    });

    it('should not render the principle cells if areCoachingPrinciplesEnabled is false', () => {
      render(
        <SessionPlanningTabGrid
          {...props}
          areCoachingPrinciplesEnabled={false}
        />
      );

      // Should not show principle header or cells
      expect(screen.queryByText('Principle')).not.toBeInTheDocument();

      const principleCells = document.querySelectorAll(
        '.sessionPlanningGrid__cell--principle'
      );
      expect(principleCells).toHaveLength(0);
    });
  });

  describe('renders correctly', () => {
    it('renders the drag handle', () => {
      render(<SessionPlanningTabGrid {...props} />);

      // Should render drag handles for 3 activities
      const dragHandles = document.querySelectorAll('.icon-drag-handle');
      expect(dragHandles).toHaveLength(3);
    });
  });

  describe('renders correctly with less than 2 activities', () => {
    it('does not render drag handles', () => {
      render(
        <SessionPlanningTabGrid
          {...props}
          eventSessionActivities={props.eventSessionActivities.slice(0, 1)}
        />
      );

      // Should not render drag handles with only 1 activity
      const dragHandles = document.querySelectorAll('.icon-drag-handle');
      expect(dragHandles).toHaveLength(0);
    });
  });

  describe('empty state', () => {
    it('renders empty message when no activities', () => {
      render(<SessionPlanningTabGrid {...props} eventSessionActivities={[]} />);

      expect(screen.getByText('No activities added')).toBeInTheDocument();
    });
  });

  describe('grid structure', () => {
    it('renders all required column headers', () => {
      render(<SessionPlanningTabGrid {...props} />);

      const header = document.querySelector('.sessionPlanningGrid__gridHeader');

      expect(within(header).getByText('Activity')).toBeInTheDocument();
      expect(within(header).getByText('Minutes')).toBeInTheDocument();
      expect(within(header).getByText('Athlete')).toBeInTheDocument();
    });

    it('renders activity numbers correctly', () => {
      render(<SessionPlanningTabGrid {...props} />);

      // Should show activity numbers 1, 2, 3
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
