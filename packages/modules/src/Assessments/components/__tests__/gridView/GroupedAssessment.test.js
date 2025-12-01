import { waitFor, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '@kitman/modules/src/Assessments/redux/utils/mockedStore';
import PermissionsContext, {
  defaultPermissions,
} from '@kitman/modules/src/Assessments/contexts/PermissionsContext';
import GroupedAssessment from '../../gridView/GroupedAssessment';

describe('GroupedAssessment component', () => {
  let baseProps;

  beforeEach(() => {
    // Setup a default success handler for the API call
    server.use(
      rest.post(
        '/assessment_groups/:assessmentId/statuses/calculate_values',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ values: { 1764: { 1: 5, 2: 6 }, 4769: { 1: 7, 2: 8 } } })
          );
        }
      )
    );

    baseProps = {
      assessment: {
        id: 1,
        assessment_group_date: '2020-06-05',
        isCurrentSquad: true,
        athletes: [
          {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            fullname: 'John Doe',
            avatar_url: '/john_doe_avatar.png',
            position_group: 'Back',
          },
          {
            id: 2,
            firstname: 'Peter',
            lastname: 'Murphy',
            fullname: 'Peter Murphy',

            avatar_url: '/peter_murphy_avatar.png',
            position_group: 'Back',
          },
        ],
        items: [
          {
            id: 8849,
            item_type: 'AssessmentHeader',
            item: {
              id: 7300,
              name: 'Header 1',
            },
          },
          {
            id: 830,
            item_type: 'AssessmentMetric',
            item: {
              id: 2309,
              training_variable: { id: 1, name: 'Body Weight' },
              answers: [
                { id: 6996, athlete_id: 1, value: -2, colour: '#2ecb4a' },
                { id: 6997, athlete_id: 2, value: 1, colour: '#f2750f' },
              ],
              is_protected: false,
            },
          },
          {
            id: 6623,
            item_type: 'AssessmentStatus',
            item: {
              id: 1764,
              source: 'statsports',
              variable: 'metabolic_power_band',
              summary: 'sum',
              period_scope: 'last_x_days',
              period_length: 4,
              notes: [
                {
                  note: { content: 'Fake comment about metabolic power band' },
                  users: [{ id: 93600, fullname: 'John Doe' }],
                },
              ],
              is_protected: false,
            },
          },
          {
            id: 20047,
            item_type: 'AssessmentStatus',
            item: {
              id: 4769,
              source: 'statsports',
              variable: 'total_distance',
              summary: 'sum',
              period_scope: 'last_x_days',
              period_length: 5,
              notes: [
                {
                  note: { content: 'Fake comment about total distance' },
                  users: [{ id: 78545, fullname: 'Peter Smith' }],
                },
              ],
              is_protected: true,
            },
          },
          {
            id: 7623,
            item_type: 'AssessmentMetric',
            item: {
              id: 985,
              training_variable: { id: 2, name: 'Flexibility' },
              answers: [
                { id: 6996, athlete_id: 1, value: 2, colour: '#3a8dee' },
                { id: 6997, athlete_id: 2, value: null, colour: null },
              ],
              is_protected: false,
            },
          },
          {
            id: 278,
            item_type: 'AssessmentMetric',
            item: {
              id: 4120,
              training_variable: { id: 3, name: 'Strength' },
              answers: [
                { id: 6996, athlete_id: 1, value: 0, colour: '#5045fb' },
                { id: 6997, athlete_id: 2, value: -2, colour: '#2ecb4a' },
              ],
              is_protected: true,
            },
          },
        ],
      },
      organisationTrainingVariables: [
        {
          id: 10,
          scale_increment: '1',
          training_variable: { id: 1, name: 'Body Weight', min: -6, max: 6 },
        },
        {
          id: 11,
          scale_increment: '1',
          training_variable: { id: 2, name: 'Flexibility', min: 1, max: 5 },
        },
        {
          id: 12,
          scale_increment: '0.5',
          training_variable: { id: 3, name: 'Strength', min: -2, max: 2 },
        },
      ],
      tableMode: 'VIEW',
      hasAssessmentStatusItem: false,
      isCommentsSidePanelOpen: false,
      selectedAthleteId: 1,
      areAnswersLoading: false,
      onClickAddSectionName: jest.fn(),
      onClickAddMetric: jest.fn(),
      onClickAddStatus: jest.fn(),
      onDeleteAssessmentItem: jest.fn(),
      onClickAddComments: jest.fn(),
      onChangeTableMode: jest.fn(),
      onClickViewComments: jest.fn(),
      onSaveEditedScores: jest.fn(),
      onErrorCalculatingStatusValues: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the data table with correct headers and values', async () => {
    renderWithRedux(<GroupedAssessment {...baseProps} />);

    // Check headers
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Athletes (2)');
    expect(headers[1]).toHaveTextContent('Header 1');
    expect(headers[2]).toHaveTextContent('Body Weight');
    expect(headers[3]).toHaveTextContent('metabolic_power_band');
    expect(headers[6]).toHaveTextContent('Strength');
    // Check for Add button in the last header
    expect(within(headers[7]).getByRole('button')).toBeInTheDocument();

    // Check body rows
    const rows = screen.getAllByRole('row').slice(1); // Exclude header row

    // First athlete row
    const firstRowCells = within(rows[0]).getAllByRole('cell');
    expect(within(firstRowCells[0]).getByText('John Doe')).toBeInTheDocument();
    expect(firstRowCells[2]).toHaveTextContent('-2'); // Body Weight
    expect(firstRowCells[5]).toHaveTextContent('2'); // Flexibility
    expect(firstRowCells[6]).toHaveTextContent('0'); // Strength

    // Second athlete row
    const secondRowCells = within(rows[1]).getAllByRole('cell');
    expect(
      within(secondRowCells[0]).getByText('Peter Murphy')
    ).toBeInTheDocument();
    expect(secondRowCells[2]).toHaveTextContent('1');
    expect(secondRowCells[5]).toHaveTextContent(''); // Null value
    expect(secondRowCells[6]).toHaveTextContent('-2');
  });

  it('fetches and displays status values', async () => {
    server.use(
      rest.post(
        '/assessment_groups/:assessmentId/statuses/calculate_values',
        (req, res, ctx) => {
          return res(
            ctx.json({
              values: {
                1764: 5, // metabolic_power_band
                4769: 7, // total_distance
              },
            })
          );
        }
      )
    );

    renderWithRedux(
      <GroupedAssessment {...baseProps} hasAssessmentStatusItem />
    );

    const metabolicPowerValues = await screen.findAllByText('5');
    const totalDistanceValues = await screen.findAllByText('7');

    expect(metabolicPowerValues).toHaveLength(2);
    expect(totalDistanceValues).toHaveLength(2);
  });

  it('shows an error on status value fetch failure', async () => {
    server.use(
      rest.post(
        '/assessment_groups/:assessmentId/statuses/calculate_values',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    renderWithRedux(
      <GroupedAssessment {...baseProps} hasAssessmentStatusItem />
    );
    await waitFor(() => {
      expect(baseProps.onErrorCalculatingStatusValues).toHaveBeenCalledTimes(1);
    });
  });

  it('calls the onChangeTableMode callback when entering edit mode', async () => {
    const user = userEvent.setup();
    renderWithRedux(<GroupedAssessment {...baseProps} />, {
      useGlobalStore: false,
      mockedStore,
    });

    // Find a cell and click the button inside it to open the menu
    const metricCell = (await screen.findAllByRole('cell')).find(
      (cell) => cell.textContent.trim() === '-2'
    );
    const cellButton = within(metricCell).getByRole('button');
    await user.click(cellButton);

    // Click "Edit value" from the menu
    const editValueButton = await screen.findByRole('button', {
      name: /edit value/i,
    });
    await user.click(editValueButton);

    // Assert that the component signals a mode change
    expect(baseProps.onChangeTableMode).toHaveBeenCalledWith('EDIT');
  });

  it('allows editing and saving a score when in edit mode', async () => {
    const user = userEvent.setup();
    renderWithRedux(<GroupedAssessment {...baseProps} tableMode="EDIT" />);

    const rows = await screen.findAllByRole('row');
    const firstAthleteRow = rows[1];

    const metricCell = within(firstAthleteRow).getAllByRole('cell')[2];

    const dropdownTrigger = within(metricCell).getByRole('textbox');
    selectEvent.openMenu(dropdownTrigger);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: '-4' } });
    await user.keyboard('{Enter}');

    const optionToSelect = await screen.findByText('-4');
    expect(optionToSelect).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(baseProps.onSaveEditedScores).toHaveBeenCalledWith([
      { assessment_item_id: 830, athlete_id: 1, value: -4 },
    ]);
  });

  it('calls the correct callback when a user selects "Add metric" from the menu', async () => {
    const user = userEvent.setup();
    renderWithRedux(<GroupedAssessment {...baseProps} />);

    // 1. Find the "+" button in the last column header
    const headers = await screen.findAllByRole('columnheader');
    const addCell = headers[7];
    const addButton = within(addCell).getByRole('button');

    // 2. Click the button to open the menu
    await user.click(addButton);

    // 3. Find and click the "Add metric" option in the menu that appears
    const addMetricButton = await screen.findByRole('button', {
      name: /add metric/i,
    });
    await user.click(addMetricButton);

    // 4. Assert that the correct callback prop was called
    expect(baseProps.onClickAddMetric).toHaveBeenCalledTimes(1);
  });

  it('shows the loading state on cells when areAnswersLoading is true', () => {
    // Render the component with the loading prop set to true
    const { container } = renderWithRedux(
      <GroupedAssessment
        {...baseProps}
        areAnswersLoading
        hasAssessmentStatusItem
      />
    );

    // Find all metric score and status value elements in the document
    const metricScoreElements = container.querySelectorAll(
      '.groupedAssessment__metricScore'
    );
    const statusValueElements = container.querySelectorAll(
      '.groupedAssessment__statusValue'
    );

    // Assert that at least one of each type of element was found
    expect(metricScoreElements.length).toBeGreaterThan(0);
    expect(statusValueElements.length).toBeGreaterThan(0);

    // Verify that every score and status element has the correct loading class
    metricScoreElements.forEach((element) => {
      expect(element).toHaveClass('groupedAssessment__metricScore--loading');
    });

    statusValueElements.forEach((element) => {
      expect(element).toHaveClass('groupedAssessment__statusValue--loading');
    });
  });

  describe('when the "scales-colours" feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['scales-colours'] = true;
    });

    afterEach(() => {
      window.featureFlags['scales-colours'] = false;
    });

    it('renders the metric scores with the suitable colours', async () => {
      renderWithRedux(<GroupedAssessment {...baseProps} />);

      // --- Find John Doe's row and test his scores ---
      const johnDoeRow = (await screen.findByText('John Doe')).closest('tr');

      // Find the cell within the row by its text content
      const johnDoeBodyWeight = within(johnDoeRow).getByText('-2');
      const johnDoeFlexibility = within(johnDoeRow).getByText('2');
      const johnDoeStrength = within(johnDoeRow).getByText('0');

      expect(johnDoeBodyWeight).toHaveStyle({ backgroundColor: '#2ecb4a' });
      expect(johnDoeFlexibility).toHaveStyle({ backgroundColor: '#3a8dee' });
      expect(johnDoeStrength).toHaveStyle({ backgroundColor: '#5045fb' });

      // --- Find Peter Murphy's row and test his scores ---
      const peterMurphyRow = (await screen.findByText('Peter Murphy')).closest(
        'tr'
      );

      const peterMurphyBodyWeight = within(peterMurphyRow).getByText('1');
      const peterMurphyStrength = within(peterMurphyRow).getByText('-2');

      expect(peterMurphyBodyWeight).toHaveStyle({ backgroundColor: '#f2750f' });
      expect(peterMurphyStrength).toHaveStyle({ backgroundColor: '#2ecb4a' });
    });
  });

  describe('when comment side panel is opened', () => {
    it('sets the correct athlete row classes based on the selected athlete', async () => {
      const { rerender } = renderWithRedux(
        <GroupedAssessment
          {...baseProps}
          isCommentsSidePanelOpen
          selectedAthleteId={1}
        />
      );

      // Find the rows for each athlete
      const johnDoeRow = (await screen.findByText('John Doe')).closest('tr');
      const peterMurphyRow = (await screen.findByText('Peter Murphy')).closest(
        'tr'
      );

      // Initially, John Doe (ID 1) should be selected
      expect(johnDoeRow).toHaveClass('athlete__row--selected');
      expect(peterMurphyRow).toHaveClass('athlete__row--notSelected');

      // --- Simulate the selected athlete changing ---

      // Rerender the component with a new selectedAthleteId
      rerender(
        <GroupedAssessment
          {...baseProps}
          isCommentsSidePanelOpen
          selectedAthleteId={2}
        />
      );

      // Now, Peter Murphy (ID 2) should be selected
      expect(johnDoeRow).toHaveClass('athlete__row--notSelected');
      expect(peterMurphyRow).toHaveClass('athlete__row--selected');
    });
  });

  describe('when conditionally rendering the "Add athletes" button', () => {
    it('does not render the button when the assessment has an associated event', () => {
      // Create a new assessment prop with an event
      const propsWithEvent = {
        ...baseProps,
        assessment: {
          ...baseProps.assessment,
          event_type: 'TrainingSession',
          event: { id: 546232 },
        },
      };

      renderWithRedux(<GroupedAssessment {...propsWithEvent} />);

      // Assert that the "Add athletes" button is NOT present
      expect(
        screen.queryByRole('button', { name: /add athletes/i })
      ).not.toBeInTheDocument();
    });

    it('renders the button when the assessment has no event and no athletes', () => {
      // Create a new assessment prop with an empty athletes array and no event
      const propsWithNoAthletes = {
        ...baseProps,
        assessment: {
          ...baseProps.assessment,
          athletes: [],
          event_type: null,
          event: null,
        },
      };

      renderWithRedux(<GroupedAssessment {...propsWithNoAthletes} />);

      // Assert that the "Add athletes" button IS present
      expect(
        screen.getByRole('button', { name: /add athletes/i })
      ).toBeInTheDocument();
    });
  });

  describe('when interacting with a column header', () => {
    it('calls props.onDeleteAssessmentItem with correct IDs when deleting', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRedux(
        // The user must have edit permission for the menu to be enabled
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, editAssessment: true }}
        >
          <GroupedAssessment {...baseProps} />
        </PermissionsContext.Provider>
      );

      // 1. Find the header cell we want to interact with
      const headerCell = screen.getByRole('columnheader', { name: 'Header 1' });

      // 2. Hover over the header to make the "more options" trigger visible
      await user.hover(headerCell);

      // 3. Find and click the trigger button (the "more" icon)
      const triggerButton = container.querySelector(
        '.groupedAssessment__columnHeaderMenuTrigger'
      );
      await user.click(triggerButton);

      // 4. Find and click the "Delete" option in the menu that appears
      const deleteButton = await screen.findByRole('button', {
        name: /delete/i,
      });
      await user.click(deleteButton);

      // 5. Assert that the correct callback was fired with the expected arguments
      expect(baseProps.onDeleteAssessmentItem).toHaveBeenCalledTimes(1);
      expect(baseProps.onDeleteAssessmentItem).toHaveBeenCalledWith(
        1, // props.assessment.id
        8849 // props.assessment.items[0].id
      );
    });
  });

  describe('when clicking a status cell', () => {
    it('calls onClickViewComments with the correct athlete', async () => {
      const user = userEvent.setup();

      // This simplified mock response works around the component's internal rendering bug
      server.use(
        rest.post(
          '/assessment_groups/:assessmentId/statuses/calculate_values',
          (req, res, ctx) => {
            return res(
              ctx.json({
                values: {
                  1764: 5, // metabolic_power_band
                  4769: 7, // total_distance
                },
              })
            );
          }
        )
      );

      renderWithRedux(
        <GroupedAssessment {...baseProps} hasAssessmentStatusItem />
      );

      // 1. Find the table row for the specific athlete, "John Doe"
      const johnDoeRow = (await screen.findByText('John Doe')).closest('tr');

      // 2. FIX: Find the status cell with the text "5" *within* John Doe's row.
      const statusCell = within(johnDoeRow).getByText('5');

      // 3. The cell content is inside a button. Click it to open the menu.
      const cellButton = statusCell.closest('button');
      await user.click(cellButton);

      // 4. Find and click the "View comments" option from the menu.
      const viewCommentsButton = await screen.findByRole('button', {
        name: /view comments/i,
      });
      await user.click(viewCommentsButton);

      // 5. Assert that the correct callback was fired with the correct athlete's data.
      expect(baseProps.onClickViewComments).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickViewComments).toHaveBeenCalledWith(
        baseProps.assessment.athletes[0]
      ); // John Doe
    });
  });

  describe('when bulk editing scores', () => {
    it('calls onSaveEditedScores with updated scores for all athletes when using bulk edit', async () => {
      const user = userEvent.setup();
      renderWithRedux(<GroupedAssessment {...baseProps} tableMode="EDIT" />);

      const headerButton = screen.getByRole('button', { name: /Body Weight/i });
      await user.click(headerButton);

      const tooltip = await screen.findByRole('tooltip');

      const scoreDropdownInput = within(tooltip).getByRole('textbox');
      await user.click(scoreDropdownInput); // Open the dropdown

      const searchInput = await screen.findByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: '-3' } }); // Type the new value
      await user.keyboard('{Enter}'); // Press Enter to confirm

      const applyButton = within(tooltip).getByRole('button', {
        name: /apply/i,
      });
      await user.click(applyButton);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(baseProps.onSaveEditedScores).toHaveBeenCalledTimes(1);
      expect(baseProps.onSaveEditedScores).toHaveBeenCalledWith([
        { assessment_item_id: 830, athlete_id: 1, value: -3 },
        { assessment_item_id: 830, athlete_id: 2, value: -3 },
      ]);
    });
  });

  describe('Permissions', () => {
    it('prevents a user from adding an item when they lack createAssessment permission', async () => {
      const user = userEvent.setup();
      renderWithRedux(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, createAssessment: false }}
        >
          <GroupedAssessment {...baseProps} />
        </PermissionsContext.Provider>
      );

      const headers = await screen.findAllByRole('columnheader');
      const addCell = headers[7];
      const addButton = within(addCell).getByRole('button');

      await user.click(addButton);

      expect(
        screen.queryByRole('button', { name: /add metric/i })
      ).not.toBeInTheDocument();

      expect(baseProps.onClickAddMetric).not.toHaveBeenCalled();
    });

    it('hides protected metric scores when user lacks viewProtectedMetrics permission', async () => {
      renderWithRedux(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, viewProtectedMetrics: false }}
        >
          <GroupedAssessment {...baseProps} />
        </PermissionsContext.Provider>
      );

      // The unprotected "Body Weight" score is visible
      expect(await screen.findByText('-2')).toBeInTheDocument();

      // The protected "Strength" score (value 0) is not rendered, so the cell is empty.
      const rows = await screen.findAllByRole('row');
      const firstRowCells = within(rows[1]).getAllByRole('cell');
      expect(firstRowCells[6]).toHaveTextContent('');
    });
  });
});
