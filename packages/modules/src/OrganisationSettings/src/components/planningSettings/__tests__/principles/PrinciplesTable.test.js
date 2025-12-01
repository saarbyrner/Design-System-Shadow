import { screen, render, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import PlanningSettings from '../../index';
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
} from '../../utils/mocks';

// This test file renders the parent <PlanningSettings /> component instead of testing
// child components (like DrillLabels, PrinciplesTable, etc.) in isolation.

// Helper function to find a section by its heading
const getSection = (name) => {
  const heading = screen.getByRole('heading', { name });
  // Find the closest 'section' or a div that acts as a section wrapper
  return heading.closest('div.organisationPlanningSettings__section');
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
    rest.get('/ui/planning_hub/principles/search', (req, res, ctx) =>
      status === 'success'
        ? res(ctx.json(mockPrinciples))
        : res(ctx.status(500))
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
  ];
  server.use(...handlers);
};

describe('Organisation Settings <PlanningSettings /> component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {}; // Reset flags
    setupApiHandlers(); // Setup default successful API handlers
  });

  it('renders the default sections correctly', () => {
    render(<PlanningSettings />);

    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Activity type')).toBeInTheDocument();
    expect(screen.getByText('Drill Labels')).toBeInTheDocument();
  });

  it('does not render principles or development goals sections by default', () => {
    render(<PlanningSettings />);

    expect(screen.queryByText('Principles')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Development Goal Types')
    ).not.toBeInTheDocument();
  });

  describe('Drill Labels Section', () => {
    it('loads and displays drill labels correctly', async () => {
      render(<PlanningSettings />);
      const section = getSection('Drill Labels');

      expect(await within(section).findByText('label_1')).toBeInTheDocument();
      expect(within(section).getByText('label_2')).toBeInTheDocument();
    });

    describe('when editing', () => {
      beforeEach(async () => {
        render(<PlanningSettings />);
        const section = getSection('Drill Labels');
        await user.click(within(section).getByText('Edit values'));
      });

      it('disables save button initially', () => {
        const section = getSection('Drill Labels');
        expect(
          within(section).getByText('Save').closest('button')
        ).toBeDisabled();
      });

      it('enables save button after an edit', async () => {
        const section = getSection('Drill Labels');

        const firstInput = within(section).getByDisplayValue('label_1');

        fireEvent.change(firstInput, {
          target: { value: 'edited' },
        });

        expect(
          within(section).getByText('Save').closest('button')
        ).toBeEnabled();
      });

      it('adds a new empty row when "Add Label" is clicked', async () => {
        const section = getSection('Drill Labels');
        // Corrected: Use a more specific selector to only count the name inputs.
        // We find the cells that are designated for names.
        const initialNameCells = section.querySelectorAll(
          '.planningSettingsTable__rowCell--name'
        );

        await user.click(
          within(section).getByRole('button', { name: 'Add drill label' })
        );

        const finalNameCells = section.querySelectorAll(
          '.planningSettingsTable__rowCell--name'
        );

        expect(finalNameCells.length).toBe(initialNameCells.length + 1);

        // The last input found within the name cells should be the new, empty one.
        const newNameInput = within(
          finalNameCells[finalNameCells.length - 1]
        ).getByRole('textbox');
        expect(newNameInput).toHaveValue('');
      });

      it('removes a newly added row when its delete button is clicked', async () => {
        const section = getSection('Drill Labels');
        const initialNameCells = section.querySelectorAll(
          '.planningSettingsTable__rowCell--name'
        );

        await user.click(
          within(section).getByRole('button', { name: 'Add drill label' })
        );

        let finalNameCells = section.querySelectorAll(
          '.planningSettingsTable__rowCell--name'
        );
        expect(finalNameCells.length).toBe(initialNameCells.length + 1);

        const newRow = finalNameCells[finalNameCells.length - 1].closest('tr');
        const deleteButton = within(newRow).getByRole('button');

        await user.click(deleteButton);

        finalNameCells = section.querySelectorAll(
          '.planningSettingsTable__rowCell--name'
        );
        expect(finalNameCells.length).toBe(initialNameCells.length);
      });

      it('reverts changes when cancel is clicked', async () => {
        const section = getSection('Drill Labels');
        const firstInput = within(section).getByDisplayValue('label_1');

        fireEvent.change(firstInput, {
          target: { value: 'this will be cancelled' },
        });

        await user.click(
          within(section).getByRole('button', { name: 'Cancel' })
        );

        // View should switch back, and original value should be present
        expect(
          within(section).queryByRole('button', { name: 'Cancel' })
        ).not.toBeInTheDocument();
        expect(within(section).getByText('label_1')).toBeInTheDocument();
      });
    });
  });

  describe('when development goals module is enabled', () => {
    it('renders the development goal section', async () => {
      render(<PlanningSettings hasDevelopmentGoalsModule />);

      expect(
        screen.getByText('Development goal completion type')
      ).toBeInTheDocument();
    });
  });

  describe('when coaching principles are enabled', () => {
    it('renders the principles section and its data', async () => {
      render(<PlanningSettings areCoachingPrinciplesEnabled />);

      expect(
        screen.getByRole('heading', { name: 'Principles' })
      ).toBeInTheDocument();
      expect(screen.getByText('Principle name')).toBeInTheDocument();
    });

    it('allows opening the categories side panel', async () => {
      render(<PlanningSettings areCoachingPrinciplesEnabled />);
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
      server.use(rest.get('/squads', (req, res, ctx) => res(ctx.status(500))));

      render(<PlanningSettings />);

      expect(
        await screen.findByText('Something went wrong!')
      ).toBeInTheDocument();
    });
  });
});
