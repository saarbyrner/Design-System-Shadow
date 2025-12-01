import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import mockedStore from '@kitman/modules/src/Assessments/redux/store';
import ItemsList from '../../listView/ItemsList';

describe('ItemsList', () => {
  let baseProps;

  beforeEach(() => {
    // Mock all required API endpoints
    server.use(
      rest.post(
        'http://localhost/assessments/:assessmentId/statuses/calculate_value',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ value: '10.5 km' }));
        }
      ),
      rest.get(
        'http://localhost/assessments/:assessmentId/items/previous_answer',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ value: '2' }));
        }
      )
    );

    baseProps = {
      selectedAthlete: 1,
      assessment: {
        id: 1,
        name: 'Assessment 1',
        items: [
          {
            id: 1,
            item_type: 'AssessmentMetric',
            item: {
              training_variable: { id: 1, name: 'Session RPE' },
              answers: [{ value: '3', users: [] }],
            },
          },
          {
            id: 2,
            item_type: 'AssessmentHeader',
            item: { id: 1, name: 'Header name' },
          },
          {
            id: 3,
            item_type: 'AssessmentStatus',
            item: { variable: 'total_distance', notes: [{ users: [] }] },
          },
        ],
      },
      expandedAssessmentItems: [],
      users: [],
      statusVariables: [],
      organisationTrainingVariables: [],
      trainingVariablesAlreadySelected: [],
      showReordering: false,
      viewType: 'LIST',
      saveAssessmentItem: jest.fn(),
      onClickSaveReordering: jest.fn(),
      onClickCancelReordering: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the list of items', async () => {
    renderWithRedux(<ItemsList {...baseProps} />);
    expect(await screen.findByText('Session RPE')).toBeInTheDocument();
    expect(await screen.findByText('Header name')).toBeInTheDocument();
    expect(await screen.findByText('10.5 km')).toBeInTheDocument();
  });

  it('allows a user to initiate editing a metric', async () => {
    const user = userEvent.setup();

    renderWithRedux(<ItemsList {...baseProps} />, {
      useGlobalStore: false,
      mockedStore,
    });

    const metricItem = (
      await screen.findByRole('heading', { name: 'Session RPE' })
    ).closest('.assessmentsMetric');

    const optionsButton = within(metricItem).getByRole('button');
    await user.click(optionsButton);

    const editButton = await screen.findByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(
      await screen.findByRole('button', { name: /save/i })
    ).toBeInTheDocument();
  });

  it('allows a user to initiate editing a status', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ItemsList {...baseProps} />, {
      useGlobalStore: false,
      mockedStore,
    });

    // FIX: Find the status item by its rendered value ("10.5 km"), not its name.
    const statusItem = (await screen.findByText('10.5 km')).closest(
      '.assessmentsStatus'
    );

    const optionsButton = within(statusItem).getByRole('button');
    await user.click(optionsButton);

    const editButton = await screen.findByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(
      await screen.findByRole('button', { name: /save/i })
    ).toBeInTheDocument();
  });

  describe('when reordering is enabled', () => {
    it('calls onClickSaveReordering with the current item order when saving', async () => {
      const user = userEvent.setup();
      const props = { ...baseProps, showReordering: true };
      renderWithRedux(<ItemsList {...props} />);

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(props.onClickSaveReordering).toHaveBeenCalledWith([1, 2, 3]);
    });

    it('calls onClickCancelReordering when canceling', async () => {
      const user = userEvent.setup();
      const props = { ...baseProps, showReordering: true };
      renderWithRedux(<ItemsList {...props} />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(props.onClickCancelReordering).toHaveBeenCalledTimes(1);
    });
  });
});
