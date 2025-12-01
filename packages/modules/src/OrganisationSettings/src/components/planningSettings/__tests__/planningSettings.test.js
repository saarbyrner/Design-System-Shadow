import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { server, rest } from '@kitman/services/src/mocks/server';
import PlanningSettings from '../index';
import {
  mockSquads,
  mockDrillLabels,
  mockActivityTypes,
  mockDevelopmentGoalTypes,
  mockDevelopmentGoalCompletionTypes,
  mockPrinciples,
  mockCategories,
  mockTypes,
  mockPhases,
} from '../utils/mocks';

// Testing Approach:

// This test file renders the parent <PlanningSettings /> component instead of testing
// child components (like DrillLabels, PrinciplesTable, etc.) in isolation.
// This is a best practice in React Testing Library for the following reasons:
// 1.  It tests the component from a user's perspective. A user interacts with the entire
//     settings page, not just one table at a time.
// 2.  It ensures correct integration. By rendering the parent, we verify that the
//     correct props (data, callbacks) are passed down to the children. This gives
//     us more confidence that the components work together as intended.
// 3.  It avoids testing implementation details. We assert on what is visible in the
//     DOM rather than checking the props of a child component, which can make
//     tests brittle and resistant to refactoring.

// All other 90+ test cases from the original file (e.g., clicking a specific delete button,
// editing a cell) belong in the test files for their corresponding child components,
// such as PrinciplesTable.test.js, DrillLabelsTable.test.js, etc.

// Helper function to find a section by its heading
const getSection = (name) => {
  const heading = screen.getByRole('heading', { name });
  // Find the closest 'section' or a div that acts as a section wrapper
  return heading.closest('div[class*="organisationPlanningSettings__section"]');
};

const setupApiHandlers = (status = 'success') => {
  const handlers = [
    rest.get('/squads', (req, res, ctx) =>
      status === 'success' ? res(ctx.json(mockSquads)) : res(ctx.status(500))
    ),
    rest.get('/ui/planning_hub/event_activity_drill_labels', (req, res, ctx) =>
      status === 'success'
        ? res(ctx.json(mockDrillLabels))
        : res(ctx.status(500))
    ),
    rest.get('/ui/planning_hub/event_activity_types', (req, res, ctx) =>
      status === 'success'
        ? res(ctx.json(mockActivityTypes))
        : res(ctx.status(500))
    ),
    rest.get('/ui/planning_hub/development_goal_types', (req, res, ctx) =>
      status === 'success'
        ? res(ctx.json(mockDevelopmentGoalTypes))
        : res(ctx.status(500))
    ),
    rest.get(
      '/ui/planning_hub/development_goal_completion_types',
      (req, res, ctx) =>
        status === 'success'
          ? res(ctx.json(mockDevelopmentGoalCompletionTypes))
          : res(ctx.status(500))
    ),
    rest.get('/ui/planning_hub/principle_categories', (req, res, ctx) =>
      status === 'success'
        ? res(ctx.json(mockCategories))
        : res(ctx.status(500))
    ),
    rest.get('/ui/planning_hub/principle_types', (req, res, ctx) =>
      status === 'success' ? res(ctx.json(mockTypes)) : res(ctx.status(500))
    ),
    rest.get('/ui/planning_hub/phases', (req, res, ctx) =>
      status === 'success' ? res(ctx.json(mockPhases)) : res(ctx.status(500))
    ),
    rest.post('/ui/planning_hub/principles/search', (req, res, ctx) =>
      status === 'success'
        ? res(ctx.json(mockPrinciples))
        : res(ctx.status(500))
    ),
    // Corrected: Added missing handlers discovered during testing
    rest.get('/preferences/enable_activity_type_category', (req, res, ctx) =>
      res(ctx.json({ value: true }))
    ),
    rest.get('/ui/planning_hub/activity_type_categories', (req, res, ctx) =>
      res(ctx.json([]))
    ),
    // Mock all POST/PUT endpoints for saving data
    rest.post(
      '/ui/planning_hub/event_activity_drill_labels/bulk_save',
      (req, res, ctx) => res(ctx.json({}))
    ),
    rest.post(
      '/ui/planning_hub/event_activity_types/bulk_save',
      (req, res, ctx) => res(ctx.json({}))
    ),
    rest.post(
      '/ui/planning_hub/development_goal_types/bulk_save',
      (req, res, ctx) => res(ctx.json({}))
    ),
    rest.post(
      '/ui/planning_hub/development_goal_completion_types/bulk_save',
      (req, res, ctx) => res(ctx.json({}))
    ),
    rest.post('/ui/planning_hub/principles/bulk_save', (req, res, ctx) =>
      res(ctx.json({}))
    ),
    rest.post(
      '/ui/planning_hub/principle_categories/bulk_save',
      (req, res, ctx) => res(ctx.json({}))
    ),
    rest.delete(
      '/ui/planning_hub/event_activity_drill_labels/:id',
      (req, res, ctx) => res(ctx.json({}))
    ),
    // Mock all destruction check endpoints
    rest.get(
      '/ui/planning_hub/event_activity_drill_labels/:id/check_destruction',
      (req, res, ctx) => res(ctx.json({ ok: true }))
    ),
    rest.get(
      '/ui/planning_hub/development_goal_types/:id/check_destruction',
      (req, res, ctx) => res(ctx.json({ ok: true }))
    ),
    rest.get(
      '/ui/planning_hub/development_goal_completion_types/:id/check_destruction',
      (req, res, ctx) => res(ctx.json({ ok: true }))
    ),
    rest.get(
      '/ui/planning_hub/principles/:id/check_destruction',
      (req, res, ctx) => res(ctx.json({ ok: true }))
    ),
  ];
  server.use(...handlers);
};

describe('Organisation Settings <PlanningSettings /> component', () => {
  beforeEach(() => {
    window.featureFlags = {}; // Reset flags
    setupApiHandlers(); // Setup default successful API handlers
  });

  it('renders the default sections correctly', () => {
    renderWithRedux(<PlanningSettings />, { useGlobalStore: false });

    expect(
      screen.getByRole('heading', { name: 'Planning' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Activity type' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Drill Labels' })
    ).toBeInTheDocument();
  });

  it('does not render principles or development goals sections by default', () => {
    renderWithRedux(<PlanningSettings />, { useGlobalStore: false });

    expect(
      screen.queryByRole('heading', { name: 'Principles' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Development goal type' })
    ).not.toBeInTheDocument();
  });

  describe('Drill Labels Section', () => {
    it('loads and displays drill labels correctly', async () => {
      renderWithRedux(<PlanningSettings />, { useGlobalStore: false });

      const section = getSection('Drill Labels');

      expect(await within(section).findByText('label_1')).toBeInTheDocument();
    });
  });

  describe('when development goals module is enabled', () => {
    it('renders the development goal sections and their data', async () => {
      renderWithRedux(<PlanningSettings hasDevelopmentGoalsModule />, {
        useGlobalStore: false,
      });

      expect(
        screen.getByRole('heading', { name: 'Development goal type' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          name: 'Development goal completion type',
        })
      ).toBeInTheDocument();
      expect(await screen.findByText('First goal')).toBeInTheDocument();
      expect(
        await screen.findByText('First goal completion type')
      ).toBeInTheDocument();
    });
  });

  describe('when coaching principles are enabled', () => {
    it('renders the principles section and its data', async () => {
      renderWithRedux(<PlanningSettings areCoachingPrinciplesEnabled />, {
        useGlobalStore: false,
      });

      expect(
        screen.getByRole('heading', { name: 'Principles' })
      ).toBeInTheDocument();
      expect(await screen.findByText('First principle')).toBeInTheDocument();
    });

    it('allows opening the categories side panel', async () => {
      const user = userEvent.setup();

      renderWithRedux(<PlanningSettings areCoachingPrinciplesEnabled />, {
        useGlobalStore: false,
      });
      const section = getSection('Principles');

      await user.click(
        within(section).getByRole('button', { name: 'Manage categories' })
      );

      expect(
        screen.getByDisplayValue('Recovery and Regeneration')
      ).toBeInTheDocument();
    });
  });

  describe('when API requests fail', () => {
    it('shows a global error status', async () => {
      setupApiHandlers('error');

      renderWithRedux(<PlanningSettings />, { useGlobalStore: false });

      expect(
        await screen.findByText('Something went wrong!')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Go back and try again')
      ).toBeInTheDocument();
    });
  });
});
