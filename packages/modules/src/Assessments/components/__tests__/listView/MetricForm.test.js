import { screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { server, rest } from '@kitman/services/src/mocks/server';
import PermissionsContext, {
  defaultPermissions,
} from '@kitman/modules/src/Assessments/contexts/PermissionsContext';
import MetricForm from '../../listView/MetricForm';

setI18n(i18n);

describe('MetricForm', () => {
  const baseProps = {
    assessmentId: 7,
    selectedAthlete: 3,
    onClickClose: jest.fn(),
    onClickSaveMetric: jest.fn(),
    users: [{ id: 1, name: 'John Doe' }],
    organisationTrainingVariables: [
      {
        id: 53,
        training_variable: { id: 1, name: 'Mood', min: -2, max: 2 },
        scale_increment: '1',
      },
      {
        id: 54,
        training_variable: { id: 2, name: 'Effort', min: 1, max: 10 },
        scale_increment: '1',
      },
    ],
    t: i18nextTranslateStub(),
  };

  const getDropdownButtonByLabel = async (labelText) => {
    const label = await screen.findByText(labelText);
    const container = label.closest('.dropdown');
    if (!container)
      throw new Error(
        `Could not find a '.dropdown' container for the label: ${labelText}`
      );
    return within(container).getByRole('button');
  };

  const getTextareaByLabel = async (labelText) => {
    const label = await screen.findByText(labelText);
    const container = label.closest('.textarea');
    if (!container)
      throw new Error(
        `Could not find a '.textarea' container for the label: ${labelText}`
      );
    return within(container).getByRole('textbox');
  };

  beforeEach(() => {
    // 1. Setup default network handlers that will be reset after each test.
    server.use(
      rest.get('/assessments/7/items/previous_answer', (req, res, ctx) =>
        res(ctx.json({ previous_answer: null }))
      ),
      rest.get('/assessment_groups/7/items/previous_answer', (req, res, ctx) =>
        res(ctx.json({ previous_answer: null }))
      )
    );

    // 2. Enable fake timers
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-23T11:00:00+01:00'));

    // 3. Reset any other test-specific state
    window.featureFlags = {};
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('UI and Initial State', () => {
    it('shows all fields when training variables are available', async () => {
      renderWithProviders(<MetricForm {...baseProps} />);
      expect(await getDropdownButtonByLabel('Metric')).toBeEnabled();
      expect(await getDropdownButtonByLabel('Score')).toBeInTheDocument();
      expect(await getTextareaByLabel('Comment')).toBeInTheDocument();
      expect(await getDropdownButtonByLabel('User')).toBeInTheDocument();
      expect(
        screen.queryByText('All metrics are currently in use')
      ).not.toBeInTheDocument();
    });

    it('shows a warning and disables the form when no training variables are available', async () => {
      renderWithProviders(
        <MetricForm {...baseProps} organisationTrainingVariables={[]} />
      );
      expect(await getDropdownButtonByLabel('Metric')).toBeDisabled();
      expect(screen.queryByText('Score')).not.toBeInTheDocument();
      expect(
        screen.getByText('All metrics are currently in use')
      ).toBeInTheDocument();
    });

    it('disables the score field when a training variable is not selected', async () => {
      renderWithProviders(<MetricForm {...baseProps} />);
      expect(await getDropdownButtonByLabel('Score')).toBeDisabled();
    });
  });

  describe('Field Interactions', () => {
    it('populates the score dropdown with values from the selected training variable', async () => {
      renderWithProviders(<MetricForm {...baseProps} />);

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const scoreDropdownButton = await getDropdownButtonByLabel('Score');
      expect(scoreDropdownButton).toBeDisabled();

      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(
        screen.getByText('Mood', { selector: 'span.customDropdown__textwrap' })
      );

      await waitFor(() => expect(scoreDropdownButton).toBeEnabled());
      await user.click(scoreDropdownButton);

      const scoreMenu = (await getDropdownButtonByLabel('Score'))
        .nextElementSibling;
      expect(within(scoreMenu).getByText(/^\s*-2\s*$/)).toBeInTheDocument();
      expect(within(scoreMenu).getByText(/^\s*-1\s*$/)).toBeInTheDocument();
      expect(within(scoreMenu).getByText(/^\s*0\s*$/)).toBeInTheDocument();
      expect(within(scoreMenu).getByText(/^\s*1\s*$/)).toBeInTheDocument();
      expect(within(scoreMenu).getByText(/^\s*2\s*$/)).toBeInTheDocument();
    });

    it('clears the score dropdown when clicking the clear button', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const metric = {
        id: 1,
        training_variable: { id: 1 },
        answers: [{ id: 1, value: 2, users: [] }],
      };
      renderWithProviders(<MetricForm {...baseProps} metric={metric} />);

      const scoreDropdownButton = await getDropdownButtonByLabel('Score');
      expect(scoreDropdownButton).toHaveTextContent('2');

      await user.click(scoreDropdownButton);

      const scoreMenu = scoreDropdownButton.nextElementSibling;
      const clearButton = within(scoreMenu).getByText('clear');
      await user.click(clearButton);

      expect(scoreDropdownButton).not.toHaveTextContent('2');
    });

    it('resets the score when selecting a new metric while editing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const metric = {
        id: 1,
        training_variable: { id: 1 },
        answers: [{ id: 1, value: 2, users: [] }],
      };
      renderWithProviders(<MetricForm {...baseProps} metric={metric} />);

      const scoreDropdownButton = await getDropdownButtonByLabel('Score');
      expect(scoreDropdownButton).toHaveTextContent('2');

      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(screen.getByText('Effort'));

      expect(scoreDropdownButton).not.toHaveTextContent('2');
    });
  });

  describe('Form Submission', () => {
    it('saves a new metric when clicking save', async () => {
      renderWithProviders(<MetricForm {...baseProps} />);

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(screen.getByText('Effort'));

      const scoreDropdownButton = await getDropdownButtonByLabel('Score');
      expect(scoreDropdownButton).toBeEnabled();
      await user.click(scoreDropdownButton);

      const scoreMenu = (await getDropdownButtonByLabel('Score'))
        .nextElementSibling;
      await user.click(within(scoreMenu).getByText(/^\s*5\s*$/));
      fireEvent.change(await getTextareaByLabel('Comment'), {
        target: { value: 'New note' },
      });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(baseProps.onClickSaveMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          id: null,
          training_variable_id: 2,
          answers: [
            expect.objectContaining({ id: null, value: 5, note: 'New note' }),
          ],
        })
      );
    });

    it('saves an edited metric when clicking save', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const metric = {
        id: 1,
        training_variable: { id: 1 },
        answers: [{ id: 1, value: 3, users: [] }],
      };
      renderWithProviders(<MetricForm {...baseProps} metric={metric} />);

      const scoreDropdownButton = await getDropdownButtonByLabel('Score');
      await user.click(scoreDropdownButton);

      const scoreMenu = (await getDropdownButtonByLabel('Score'))
        .nextElementSibling;
      await user.click(within(scoreMenu).getByText(/^\s*1\s*$/));

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(baseProps.onClickSaveMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          training_variable_id: 1,
          answers: [expect.objectContaining({ id: 1, value: 1 })],
        })
      );
    });

    it('allows saving with optional score and note fields', async () => {
      renderWithProviders(<MetricForm {...baseProps} />);

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      // Select only the required metric field
      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(screen.getByText('Mood'));

      // Save without filling score or note
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // The save handler should still be called
      expect(baseProps.onClickSaveMetric).toHaveBeenCalled();
    });
  });

  describe('Permissions', () => {
    it('disables fields when user does not have create permission', async () => {
      renderWithProviders(
        <PermissionsContext.Provider
          value={{
            ...defaultPermissions,
            createAssessment: false,
          }}
        >
          <MetricForm {...baseProps} />
        </PermissionsContext.Provider>
      );

      expect(await getDropdownButtonByLabel('Metric')).toBeDisabled();
      expect(await getDropdownButtonByLabel('User')).toBeDisabled();
    });

    it('disables fields when user does not have answer permission', async () => {
      renderWithProviders(
        <PermissionsContext.Provider
          value={{
            ...defaultPermissions,
            answerAssessment: false,
          }}
        >
          <MetricForm {...baseProps} />
        </PermissionsContext.Provider>
      );

      // The score/comment fields are disabled by this permission
      expect(await getDropdownButtonByLabel('Score')).toBeDisabled();
      expect(await getTextareaByLabel('Comment')).toBeDisabled();
    });

    it('disables fields when metric is protected and user lacks permission', async () => {
      // Define a metric that is marked as protected
      const protectedMetric = {
        id: 1,
        training_variable: { id: 1 },
        answers: [],
        is_protected: true,
      };

      // Applying the same pattern with the viewProtectedMetrics key
      renderWithProviders(
        <PermissionsContext.Provider
          value={{
            ...defaultPermissions,
            viewProtectedMetrics: false,
          }}
        >
          <MetricForm {...baseProps} metric={protectedMetric} />
        </PermissionsContext.Provider>
      );

      // The score/comment fields should be disabled because the metric
      // is protected and the user does not have the required permission.
      expect(await getDropdownButtonByLabel('Score')).toBeDisabled();
      expect(await getTextareaByLabel('Comment')).toBeDisabled();
    });
  });

  describe('Network Requests', () => {
    it('fetches and shows the previous score', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      window.featureFlags['scales-colours'] = true;

      // This handler will temporarily override the default one for this specific scenario.
      server.use(
        rest.get('/assessments/7/items/previous_answer', (req, res, ctx) =>
          res(ctx.json({ previous_answer: { value: 9, colour: '#333333' } }))
        )
      );

      renderWithProviders(<MetricForm {...baseProps} />);
      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(
        screen.getByText('Mood', { selector: 'span.customDropdown__textwrap' })
      );

      const previousValue = await screen.findByText('9');
      expect(previousValue).toBeInTheDocument();
      expect(previousValue).toHaveStyle({
        backgroundColor: '#333333',
        color: 'white',
      });
    });

    it('shows an error icon when fetching the previous score fails', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      server.use(
        rest.get('/assessments/7/items/previous_answer', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      // Destructure container to use querySelector as a last resort
      const { container } = renderWithProviders(<MetricForm {...baseProps} />);

      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(
        screen.getByText('Mood', { selector: 'span.customDropdown__textwrap' })
      );

      // Use waitFor to poll the DOM for the element with the specific class.
      await waitFor(() => {
        const errorIcon = container.querySelector(
          '.assessmentsMetricForm__fetchPreviousValueError'
        );
        expect(errorIcon).toBeInTheDocument();
      });
    });
  });

  describe('[feature-flag] specific behaviors', () => {
    it('[coaching-and-development-training-variable-text-score] populates score dropdown with text values', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      window.featureFlags[
        'coaching-and-development-training-variable-text-score'
      ] = true;
      renderWithProviders(<MetricForm {...baseProps} />);

      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(screen.getByText('Mood'));

      const scoreDropdownButton = await getDropdownButtonByLabel('Score');
      await waitFor(() => expect(scoreDropdownButton).toBeEnabled());
      await user.click(scoreDropdownButton);

      expect(await screen.findByText('Below Level')).toBeInTheDocument();
    });

    it('[assessments-multiple-athletes] uses a different endpoint to fetch previous score', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      window.featureFlags['assessments-multiple-athletes'] = true;
      const spy = jest.fn();
      // Set a specific handler to be spied on for this test
      server.use(
        rest.get(
          '/assessment_groups/7/items/previous_answer',
          (req, res, ctx) => {
            spy();
            return res(ctx.json({ previous_answer: { value: 9 } }));
          }
        )
      );

      renderWithProviders(<MetricForm {...baseProps} />);
      await user.click(await getDropdownButtonByLabel('Metric'));
      await user.click(screen.getByText('Mood'));

      await waitFor(() => expect(spy).toHaveBeenCalled());
    });
  });
});
