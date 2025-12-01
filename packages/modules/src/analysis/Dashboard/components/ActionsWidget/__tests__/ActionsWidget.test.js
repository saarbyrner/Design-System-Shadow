import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import ActionsWidget from '../index';

describe('<ActionsWidget />', () => {
  const props = {
    widgetId: 1,
    widgetSettings: {
      organisation_annotation_type_ids: [1],
      completed: true,
      population: emptySquadAthletes,
      hidden_columns: [],
    },
    currentUser: { id: 1 },
    actions: [
      {
        id: 1,
        content: 'First action',
        completed: true,
        due_date: '2020-02-27',
        annotation: {
          id: 6,
          annotationable: {
            avatar_url: '/avatar_url.png',
            fullname: 'Annotationable name',
          },
        },
        users: [
          { id: 1, fullname: 'Current user' },
          { id: 2, fullname: 'John Doh' },
        ],
      },
      {
        id: 2,
        content: 'Second action',
        completed: false,
        due_date: null,
        annotation: {
          id: 2,
          annotationable: {
            avatar_url: '/avatar_url.png',
            fullname: 'Annotationable name',
          },
        },
        users: [{ id: 1, fullname: 'Current user' }],
      },
    ],
    nextId: null,
    annotationTypes: [],
    squadAthletes: emptySquadAthletes,
    squads: [],
    onClickWidgetSettings: jest.fn(),
    onClickRemoveWidget: jest.fn(),
    onClickDuplicateWidget: jest.fn(),
    fetchActions: jest.fn(),
    onClickActionCheckbox: jest.fn(),
    onClickActionText: jest.fn(),
    canManageDashboard: true,
    canEditNotes: true,
    containerType: 'dashboard',
    t: i18nextTranslateStub(),
  };

  it('hides the widget menu when the user does not have the manage dashboard permission', () => {
    const { container } = renderWithStore(
      <ActionsWidget {...props} canManageDashboard={false} />
    );

    const menuButtonWithIcon = container.querySelector('.widgetMenu');
    expect(menuButtonWithIcon).not.toBeInTheDocument();
  });

  it('disables the action checkboxes when the user does not have edit notes permission', () => {
    renderWithStore(<ActionsWidget {...props} canEditNotes={false} />);

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveClass('actionCheckbox--disabled');
    });
  });

  it('calls the correct prop when clicking Widget Settings', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<ActionsWidget {...props} />);

    const menuButton = container.querySelector('.widgetMenu');
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);
    await waitFor(() => {
      expect(screen.getByText('Actions Widget Settings')).toBeInTheDocument();
    });

    const settingsButton = screen.getByText('Actions Widget Settings');
    await user.click(settingsButton);

    expect(props.onClickWidgetSettings).toHaveBeenCalledWith(
      1,
      [1],
      emptySquadAthletes,
      []
    );
  });

  it('has the correct text displayed on the delete confirmation modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsWidget {...props} />);

    const menuButton = document.querySelector('.widgetMenu');
    await user.click(menuButton);

    const removeButton = screen.getByText('Remove Actions Widget');
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('Delete Actions widget?')).toBeInTheDocument();
    });
  });

  it('calls the correct function on delete confirm', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsWidget {...props} />);

    const menuButton = document.querySelector('.widgetMenu');
    await user.click(menuButton);

    const removeButton = screen.getByText('Remove Actions Widget');
    await user.click(removeButton);
    await user.click(screen.getByText('Delete'));

    expect(props.onClickRemoveWidget).toHaveBeenCalledTimes(1);
  });

  it('calls the correct function when clicking Duplicate Widget', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <ActionsWidget {...props} containerType="AnalyticalDashboard" />
    );

    const menuButton = document.querySelector('.widgetMenu');
    await user.click(menuButton);

    const duplicateButton = screen.getByText('Duplicate Widget');
    await user.click(duplicateButton);

    expect(props.onClickDuplicateWidget).toHaveBeenCalledTimes(1);
  });

  describe('when the standard-date-formatting flag is off', () => {
    it('renders the data grid with the correct data', () => {
      renderWithStore(<ActionsWidget {...props} />);

      expect(screen.getByText('First action')).toBeInTheDocument();
      expect(screen.getByText('Second action')).toBeInTheDocument();
      expect(
        screen.getByText('Thursday, 27th February, 2020')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });
    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('renders the data grid with the correct date formatting', () => {
      renderWithStore(<ActionsWidget {...props} />);

      expect(screen.getByText('First action')).toBeInTheDocument();
      expect(screen.getByText('Second action')).toBeInTheDocument();
      expect(screen.getAllByText('Feb 27, 2020')).toHaveLength(2);
    });
  });

  it('hides the due date column when hidden_columns contains due_date', () => {
    renderWithStore(
      <ActionsWidget
        {...props}
        widgetSettings={{
          ...props.widgetSettings,
          hidden_columns: ['due_date'],
        }}
      />
    );

    expect(screen.queryByText('Due date')).not.toBeInTheDocument();
  });

  it('hides the time remaining column when hidden_columns contains time_remaining', () => {
    renderWithStore(
      <ActionsWidget
        {...props}
        widgetSettings={{
          ...props.widgetSettings,
          hidden_columns: ['time_remaining'],
        }}
      />
    );

    expect(screen.queryByText('Time remaining')).not.toBeInTheDocument();
  });

  it('hides the assignment column when hidden_columns contains assignment', () => {
    renderWithStore(
      <ActionsWidget
        {...props}
        widgetSettings={{
          ...props.widgetSettings,
          hidden_columns: ['assignment'],
        }}
      />
    );

    expect(screen.queryByText('Also assigned')).not.toBeInTheDocument();
  });

  it('calls fetchActions when the dataGrid triggers fetchMoreData', async () => {
    renderWithStore(<ActionsWidget {...props} nextId={12} />);

    const dataGrid = document.querySelector('.dataGrid');
    fireEvent.scroll(dataGrid, { target: { scrollTop: 1000 } });

    await waitFor(() => {
      expect(props.fetchActions).toHaveBeenCalledWith(1, {
        next_id: 12,
        population: props.widgetSettings.population,
        completed: props.widgetSettings.completed,
        organisation_annotation_type_ids:
          props.widgetSettings.organisation_annotation_type_ids,
      });
    });
  });

  it('calls fetchActions when the user completes an action and there is more actions to load', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <ActionsWidget
        {...props}
        widgetSettings={{ ...props.widgetSettings, completed: false }}
        actions={[
          { ...props.actions[0], completed: false },
          { ...props.actions[1], completed: false },
        ]}
        nextId={12}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(props.fetchActions).toHaveBeenCalledWith(1, {
      next_id: 12,
      population: props.widgetSettings.population,
      completed: false,
      organisation_annotation_type_ids:
        props.widgetSettings.organisation_annotation_type_ids,
    });
  });

  it('calls onClickActionCheckbox when clicking an action checkbox', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsWidget {...props} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(props.onClickActionCheckbox).toHaveBeenCalledWith(props.actions[0]);
  });

  it('calls onClickActionText when clicking an action text', async () => {
    const user = userEvent.setup();
    renderWithStore(<ActionsWidget {...props} />);

    const actionButton = screen.getByText('First action');
    await user.click(actionButton);

    expect(props.onClickActionText).toHaveBeenCalledWith(6);
  });

  it('sets isTableEmpty to true when there is no visible actions', () => {
    renderWithStore(
      <ActionsWidget
        {...props}
        widgetSettings={{ ...props.widgetSettings, completed: true }}
        actions={[{ ...props.actions[0], completed: false }]}
      />
    );

    expect(screen.getByText('There are no actions')).toBeInTheDocument();
  });

  it('updates the filters when the widget settings change', () => {
    const { rerender } = renderWithStore(<ActionsWidget {...props} />);

    const newWidgetSettings = {
      organisation_annotation_type_ids: [],
      completed: false,
      population: { ...emptySquadAthletes, applies_to_squad: true },
      hidden_columns: [],
    };

    rerender(<ActionsWidget {...props} widgetSettings={newWidgetSettings} />);

    expect(screen.queryByText('First action')).toBeInTheDocument();
    expect(screen.queryByText('Second action')).toBeInTheDocument();
  });
});
