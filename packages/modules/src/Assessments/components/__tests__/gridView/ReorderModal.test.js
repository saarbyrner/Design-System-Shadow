import { screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import mockedStore from '@kitman/modules/src/Assessments/redux/store';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import IndividualAssessment from '../../listView/IndividualAssessment';

describe('IndividualAssessment component', () => {
  let baseProps;
  let preloadedState;

  beforeEach(() => {
    // Mock API calls that child components are known to make
    server.use(
      rest.post(
        '/assessments/:assessmentId/statuses/calculate_value',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ value: 9 }));
        }
      ),
      rest.get(
        '/assessments/:assessmentId/items/previous_answer',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ value: '2' }));
        }
      )
    );

    baseProps = {
      selectedAthlete: 1,
      assessment: {
        id: 1,
        assessment_template: { id: 1, name: 'Template name' },
        assessment_date: '2020-06-05',
        name: 'Assessment 1',
        items: [
          {
            id: 1,
            item_type: 'AssessmentMetric',
            item: {
              assessmentId: 1,
              training_variable: { id: 1, name: 'Mood' },
              answers: [
                {
                  value: '3',
                  note: { content: 'This is a note' },
                  users: [{ id: 1, fullname: 'John Doe' }],
                },
              ],
            },
          },
          {
            id: 2,
            item_type: 'AssessmentMetric',
            item: {
              assessmentId: 1,
              training_variable: { id: 2, name: 'Fatigue' },
              answers: [{ value: null, note: null, users: [] }],
            },
          },
        ],
      },
      availableOrganisationTrainingVariables: [
        { id: 11, training_variable: { id: 2, name: 'Fatigue' } },
      ],
      organisationTrainingVariables: [
        { id: 10, training_variable: { id: 1, name: 'Mood' } },
        { id: 11, training_variable: { id: 2, name: 'Fatigue' } },
        { id: 12, training_variable: { id: 3, name: 'Sleep duration' } },
      ],
      statusVariables: [
        { source_key: 'statsports|total_distance', name: 'Total distance' },
      ],
      trainingVariablesAlreadySelected: [],
      onClickItemHeader: jest.fn(),
      onClickSaveMetric: jest.fn(),
      onClickCloseMetricForm: jest.fn(),
      onClickSaveStatus: jest.fn(),
      onClickCloseStatusForm: jest.fn(),
      onClickCancelReordering: jest.fn(),
      onClickSaveReordering: jest.fn(),
      deleteAssessmentItem: jest.fn(),
      saveAssessmentItem: jest.fn(),
      expandedItems: [],
      users: [{ id: 1, name: 'John Doe' }],
      t: i18nextTranslateStub(),
    };
  });

  it('renders the assessment list with its items', async () => {
    renderWithRedux(<IndividualAssessment {...baseProps} />, {
      useGlobalStore: false,
      mockedStore,
    });
    expect(
      await screen.findByRole('heading', { name: 'Mood' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Fatigue' })
    ).toBeInTheDocument();
  });

  it('renders the metric form when showNewMetricForm is true', async () => {
    renderWithRedux(<IndividualAssessment {...baseProps} showNewMetricForm />, {
      useGlobalStore: false,
      preloadedState,
    });
    expect(screen.getByText('Add metric')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument();
  });

  it('renders the status form when showNewStatusForm is true', async () => {
    renderWithRedux(<IndividualAssessment {...baseProps} showNewStatusForm />, {
      useGlobalStore: false,
      mockedStore,
    });
    expect(screen.getByText('Add status')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument();
  });

  it('calls onClickItemHeader when clicking an item header', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} />, {
      useGlobalStore: false,
      mockedStore,
    });

    const moodHeader = await screen.findByRole('heading', { name: 'Mood' });
    await user.click(moodHeader);

    expect(baseProps.onClickItemHeader).toHaveBeenCalledWith(1);
  });

  it('calls onClickCancelReordering when canceling reordering', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} showReordering />, {
      useGlobalStore: false,
      mockedStore,
    });
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(baseProps.onClickCancelReordering).toHaveBeenCalledTimes(1);
  });

  it('calls onClickSaveReordering when saving reordering', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} showReordering />, {
      useGlobalStore: false,
      mockedStore,
    });
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(baseProps.onClickSaveReordering).toHaveBeenCalledWith(
      1,
      expect.any(Array)
    );
  });

  it('calls onClickSaveMetric when saving a new metric', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} showNewMetricForm />, {
      useGlobalStore: false,
      mockedStore,
    });

    const metricDropdownContainer = (
      await screen.findByText('Metric', { selector: 'label' })
    ).closest('.customDropdown');
    const metricDropdownButton = within(metricDropdownContainer).getByRole(
      'button'
    );
    await user.click(metricDropdownButton);

    const menu = await within(metricDropdownContainer).findByRole('list');
    await user.click(within(menu).getByText('Fatigue'));

    await user.click(await screen.findByRole('button', { name: 'Save' }));

    expect(baseProps.onClickSaveMetric).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ item_type: 'AssessmentMetric' })
    );
  });

  it('calls onClickCloseMetricForm when closing a metric form', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} showNewMetricForm />, {
      useGlobalStore: false,
      mockedStore,
    });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(baseProps.onClickCloseMetricForm).toHaveBeenCalledTimes(1);
  });

  it('calls onClickSaveStatus when saving a status', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} showNewStatusForm />, {
      useGlobalStore: false,
      mockedStore,
    });

    const dataSourceContainer = screen
      .getByText('Data Source')
      .closest('.groupedDropdown');
    await user.click(within(dataSourceContainer).getByRole('button'));
    await user.click(await screen.findByText('Total distance'));

    const calculationContainer = screen
      .getByText('Calculation')
      .closest('.customDropdown');
    await user.click(within(calculationContainer).getByRole('button'));
    await user.click(await screen.findByText('Sum'));

    const periodLengthInput = await screen.findByRole('spinbutton');
    fireEvent.change(periodLengthInput, { target: { value: '7' } });

    await user.click(await screen.findByRole('button', { name: 'Save' }));

    expect(baseProps.onClickSaveStatus).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ item_type: 'AssessmentStatus' })
    );
  });

  it('calls onClickCloseStatusForm when closing a status form', async () => {
    const user = userEvent.setup();
    renderWithRedux(<IndividualAssessment {...baseProps} showNewStatusForm />, {
      useGlobalStore: false,
      mockedStore,
    });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(baseProps.onClickCloseStatusForm).toHaveBeenCalledTimes(1);
  });
});
