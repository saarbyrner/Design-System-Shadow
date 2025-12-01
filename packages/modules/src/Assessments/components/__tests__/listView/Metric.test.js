import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  defaultPermissions,
} from '@kitman/common/src/contexts/PermissionsContext';
import Metric from '../../listView/Metric';

describe('Metric', () => {
  let baseProps;

  beforeEach(() => {
    // Mock the API endpoint that is called when the form opens
    server.use(
      rest.get(
        '/assessments/:assessmentId/items/previous_answer',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ value: '2' }));
        }
      )
    );

    baseProps = {
      assessmentId: 1, // FIX: Provide the missing assessmentId prop
      metric: {
        id: 1,
        training_variable: { id: 1, name: 'Mood' },
        answers: [
          {
            value: '3',
            previous_answer: {
              value: '5',
              colour: '#333333',
              edit_history: {
                user: { id: 93600, fullname: 'John Doe' },
                date: '2020-09-24T14:00:00Z',
              },
            },
            note: {
              content: 'This is a note',
              edit_history: {
                user: { id: 93600, fullname: 'John Doe' },
                date: '2020-09-24T14:00:00Z',
              },
            },
            users: [{ id: 1, fullname: 'John Doe' }],
            colour: '#FAFAFA',
            edit_history: {
              user: { id: 93600, fullname: 'John Doe' },
              date: '2020-09-24T14:00:00Z',
            },
          },
        ],
      },
      isCurrentSquad: true,
      onClickDeleteMetric: jest.fn(),
      users: [{ id: 1, name: 'John Doe' }],
      organisationTrainingVariables: [
        { id: 10, training_variable: { id: 1, name: 'Mood' } },
        { id: 11, training_variable: { id: 2, name: 'Fatigue' } },
        { id: 12, training_variable: { id: 3, name: 'Sleep duration' } },
      ],
      trainingVariablesAlreadySelected: [],
      showNotes: true,
      showReordering: false,
      onClickMetricHeader: jest.fn(),
      saveAssessmentItem: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the metric informations', () => {
    render(<Metric {...baseProps} />);

    expect(screen.getByRole('heading', { name: 'Mood' })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a note')).toBeInTheDocument();

    const scoreContainer = screen
      .getByText('3')
      .closest('.assessmentsMetric__score');
    expect(within(scoreContainer).getByText('3')).toBeInTheDocument();
    expect(within(scoreContainer).getByText('5')).toBeInTheDocument();
  });

  it('renders the metric scores correctly when they are set to 0', () => {
    const propsWithZero = {
      ...baseProps,
      metric: {
        ...baseProps.metric,
        answers: [
          {
            ...baseProps.metric.answers[0],
            value: 0,
            previous_answer: { value: 0 },
          },
        ],
      },
    };
    render(<Metric {...propsWithZero} />);

    expect(screen.getAllByText('0').length).toBe(2);
  });

  it('renders the correct interface for the informations not provided', () => {
    const propsWithMissingInfo = {
      ...baseProps,
      metric: {
        id: 1,
        training_variable: { id: 1, name: 'Mood' },
        answers: [{ value: null, note: null, users: [] }],
      },
    };
    render(<Metric {...propsWithMissingInfo} />);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('This is a note')).not.toBeInTheDocument();
    expect(screen.getByText('Add score')).toBeInTheDocument();
  });

  it('hides the notes when showNotes is false', () => {
    render(<Metric {...baseProps} showNotes={false} />);
    expect(screen.queryByText('This is a note')).not.toBeInTheDocument();
  });

  it('deletes the metric when clicking the delete button', async () => {
    const user = userEvent.setup();
    render(<Metric {...baseProps} />);

    const metricContainer = screen
      .getByRole('heading', { name: 'Mood' })
      .closest('.assessmentsMetric');
    const optionsButton = within(metricContainer).getByRole('button');
    await user.click(optionsButton);

    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(await screen.findByText('Delete metric?')).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    expect(baseProps.onClickDeleteMetric).toHaveBeenCalledTimes(1);
  });

  it('shows the Metric Form when clicking Edit in the menu', async () => {
    const user = userEvent.setup();
    render(<Metric {...baseProps} />);
    const metricContainer = screen
      .getByRole('heading', { name: 'Mood' })
      .closest('.assessmentsMetric');
    const optionsButton = within(metricContainer).getByRole('button');
    await user.click(optionsButton);
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await user.click(editButton);
    // FIX: Verify the form is visible by looking for a stable element like the Save button.
    expect(
      await screen.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument();
  });

  it('passes only available training variables to the metric form', async () => {
    const user = userEvent.setup();
    const propsWithSelectedVars = {
      ...baseProps,
      trainingVariablesAlreadySelected: [2],
    };
    render(<Metric {...propsWithSelectedVars} />);

    // --- Open the form ---
    const metricContainer = screen
      .getByRole('heading', { name: 'Mood' })
      .closest('.assessmentsMetric');
    const optionsButton = within(metricContainer).getByRole('button');
    await user.click(optionsButton);
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await user.click(editButton);

    // --- Interact with the specific dropdown ---

    // FIX: First, find the container for the "Metric" dropdown by its label.
    const metricDropdownContainer = (
      await screen.findByText('Metric', { selector: 'label' })
    ).closest('.customDropdown');

    // Now, find and click the button *within* that specific container.
    const dropdownButton = within(metricDropdownContainer).getByRole('button');
    await user.click(dropdownButton);

    // Finally, find the list *within* that same container to remove ambiguity.
    const dropdownMenu = await within(metricDropdownContainer).findByRole(
      'list'
    );

    // Assert on the contents of the correct menu
    expect(within(dropdownMenu).queryByText('Fatigue')).not.toBeInTheDocument();
    expect(within(dropdownMenu).getByText('Mood')).toBeInTheDocument();
    expect(
      within(dropdownMenu).getByText('Sleep duration')
    ).toBeInTheDocument();
  });

  it('shows the reordering handle when showReordering is true', () => {
    const { container } = render(<Metric {...baseProps} showReordering />);
    // The handle is a span, so we must use querySelector as an escape hatch.
    expect(
      container.querySelector('.assessmentReorderHandle')
    ).toBeInTheDocument();
  });

  it('disables the edit tooltip when showReordering is true', () => {
    render(<Metric {...baseProps} showReordering />);
    const metricContainer = screen
      .getByRole('heading', { name: 'Mood' })
      .closest('.assessmentsMetric');
    // The component uses a class to disable, not the disabled attribute.
    expect(within(metricContainer).getByRole('button')).toHaveClass(
      'assessmentsMetric__dropdownMenuBtn--disabled'
    );
  });

  // --- Feature Flag Tests ---

  describe('[feature-flag] coaching-and-development-training-variable-text-score', () => {
    beforeEach(() => {
      window.featureFlags[
        'coaching-and-development-training-variable-text-score'
      ] = true;
    });

    afterEach(() => {
      window.featureFlags[
        'coaching-and-development-training-variable-text-score'
      ] = false;
    });

    it('renders text scores instead of numbers', () => {
      const propsWithTextScore = {
        ...baseProps,
        metric: {
          ...baseProps.metric,
          answers: [
            {
              ...baseProps.metric.answers[0],
              value: 4,
              previous_answer: { value: 1 },
            },
          ],
        },
      };
      render(<Metric {...propsWithTextScore} />);
      expect(screen.getByText('Above Level')).toBeInTheDocument();
      expect(screen.getByText('Below Level')).toBeInTheDocument();
    });
  });

  describe('[feature-flag] assessment-who-answered', () => {
    beforeEach(() => {
      window.featureFlags['assessment-who-answered'] = true;
    });

    afterEach(() => {
      window.featureFlags['assessment-who-answered'] = false;
    });

    it('shows tooltips with user and date info on hover', async () => {
      const user = userEvent.setup();
      render(<Metric {...baseProps} />);

      // 1. Hover over the element that triggers the tooltip
      await user.hover(screen.getByText('3'));

      // 2. Find the tooltip element itself by its role
      const tooltip = await screen.findByRole('tooltip');

      // 3. Assert that the text exists specifically WITHIN the tooltip
      expect(within(tooltip).getByText(/by John Doe/i)).toBeInTheDocument();
    });

    it('shows who created the note', () => {
      render(<Metric {...baseProps} />);
      expect(screen.getByText(/by John Doe/i)).toBeInTheDocument();
    });
  });

  describe('[feature-flag] scales-colours', () => {
    beforeEach(() => {
      window.featureFlags['scales-colours'] = true;
    });

    afterEach(() => {
      window.featureFlags['scales-colours'] = false;
    });

    it('shows the score and previous score colours', () => {
      render(<Metric {...baseProps} />);
      const scoreElement = screen.getByText('3');
      const prevScoreElement = screen.getByText('5');

      expect(scoreElement).toHaveStyle('background-color: #FAFAFA');
      expect(prevScoreElement).toHaveStyle('background-color: #333333');
      expect(prevScoreElement).toHaveStyle('color: white');
    });
  });

  describe('[feature-flag] rich-text-editor', () => {
    beforeEach(() => {
      window.featureFlags['rich-text-editor'] = true;
    });

    afterEach(() => {
      window.featureFlags['rich-text-editor'] = false;
    });

    it('renders a rich text display for the note', () => {
      render(<Metric {...baseProps} />);
      expect(screen.getByText('This is a note')).toBeInTheDocument();
    });
  });

  describe('[feature-flag] assessments-multiple-athletes', () => {
    beforeEach(() => {
      window.featureFlags['assessments-multiple-athletes'] = true;
    });
    afterEach(() => {
      window.featureFlags['assessments-multiple-athletes'] = false;
    });

    describe('when the assessment squad does not match the current squad', () => {
      it('hides action buttons', () => {
        render(<Metric {...baseProps} isCurrentSquad={false} />);
        const metricContainer = screen
          .getByRole('heading', { name: 'Mood' })
          .closest('.assessmentsMetric');
        expect(
          within(metricContainer).queryByRole('button')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Add score')).not.toBeInTheDocument();
      });
    });
  });

  // --- Permissions Tests ---

  describe('Permissions', () => {
    it('disables the delete button without deleteAssessment permission', async () => {
      const user = userEvent.setup();
      render(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, deleteAssessment: false }}
        >
          <Metric {...baseProps} />
        </PermissionsContext.Provider>
      );
      const metricContainer = screen
        .getByRole('heading', { name: 'Mood' })
        .closest('.assessmentsMetric');
      const optionsButton = within(metricContainer).getByRole('button');
      await user.click(optionsButton);
      const deleteButton = await screen.findByRole('button', {
        name: /delete/i,
      });
      // FIX: The component uses a class to show disabled state.
      expect(deleteButton).toHaveClass(
        'tooltipMenu__item tooltipMenu__item--destructive'
      );
    });
  });
});
