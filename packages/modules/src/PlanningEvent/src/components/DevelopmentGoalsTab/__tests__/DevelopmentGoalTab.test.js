import selectEvent from 'react-select-event';
import {
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';

import { server, rest } from '@kitman/services/src/mocks/server';
import { data as mockEventDevelopmentGoals } from '@kitman/services/src/mocks/handlers/planningHub/getEventDevelopmentGoals';
import { data as mockDevelopmentGoalCompletionTypes } from '@kitman/services/src/mocks/handlers/planningHub/getDevelopmentGoalCompletionTypes';
import { buildEvent } from '@kitman/common/src/utils/test_utils';
import render from '@kitman/common/src/utils/renderWithRedux';

import DevelopmentGoalTab from '..';

// DelayedLoadingFeedback is mocked because it contains
// a timeout that complicates testing this component

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('Plannings - DevelopmentGoalTab', () => {
  const props = {
    event: buildEvent(),
    reloadData: true,
    areCoachingPrinciplesEnabled: true,
    developmentGoalTerminology: null,
  };

  test('displays the correct content', async () => {
    render(<DevelopmentGoalTab {...props} />);

    const loader = screen.getByText('Loading ...');
    // Initially, the loader is shown
    expect(loader).toBeInTheDocument();
    // Once the data is loaded...
    await waitForElementToBeRemoved(loader);

    // The correct athletes names are displayed
    expect(
      screen.getByText(
        mockEventDevelopmentGoals[0].athlete_event.athlete.fullname
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        mockEventDevelopmentGoals[1].athlete_event.athlete.fullname
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        mockEventDevelopmentGoals[2].athlete_event.athlete.fullname
      )
    ).toBeInTheDocument();

    // The correct development goals descriptions are displayed
    const firstDescription = screen.getAllByText(
      mockEventDevelopmentGoals[0].event_development_goals[0].development_goal
        .description
    );
    expect(firstDescription).toHaveLength(2);

    const secondDescription = screen.getByText(
      mockEventDevelopmentGoals[0].event_development_goals[1].development_goal
        .description
    );
    expect(secondDescription).toBeInTheDocument();

    const thirdDescription = screen.getByText(
      mockEventDevelopmentGoals[1].event_development_goals[1].development_goal
        .description
    );
    expect(thirdDescription).toBeInTheDocument();

    const fourthDescription = screen.getByText(
      mockEventDevelopmentGoals[2].event_development_goals[0].development_goal
        .description
    );
    expect(fourthDescription).toBeInTheDocument();

    const fifthDescription = screen.getByText(
      mockEventDevelopmentGoals[2].event_development_goals[1].development_goal
        .description
    );
    expect(fifthDescription).toBeInTheDocument();

    // The correct development goals types are displayed
    const firstType = screen.getAllByText(
      mockEventDevelopmentGoals[0].event_development_goals[0].development_goal
        .development_goal_types[0].name
    );
    expect(firstType).toHaveLength(2);
    expect(firstType[0]).toBeInTheDocument();
    expect(firstType[1]).toBeInTheDocument();

    const secondType = screen.getAllByText(
      mockEventDevelopmentGoals[0].event_development_goals[1].development_goal
        .development_goal_types[0].name
    );
    expect(secondType).toHaveLength(4);
    expect(secondType[0]).toBeInTheDocument();
    expect(secondType[1]).toBeInTheDocument();
    expect(secondType[2]).toBeInTheDocument();
    expect(secondType[3]).toBeInTheDocument();

    // The correct development goals principles are displayed
    const firstPrinciple = screen.getAllByText((content) =>
      content.startsWith(
        mockEventDevelopmentGoals[0].event_development_goals[0].development_goal
          .principles[0].name
      )
    );
    expect(firstPrinciple).toHaveLength(3);
    expect(firstPrinciple[0]).toBeInTheDocument();
    expect(firstPrinciple[1]).toBeInTheDocument();
    expect(firstPrinciple[2]).toBeInTheDocument();

    const secondPrinciple = screen.getByText((content) =>
      content.startsWith(
        mockEventDevelopmentGoals[0].event_development_goals[1].development_goal
          .principles[0].name
      )
    );
    expect(secondPrinciple).toBeInTheDocument();

    const thirdPrinciple = screen.getByText((content) =>
      content.startsWith(
        mockEventDevelopmentGoals[0].event_development_goals[1].development_goal
          .principles[0].name
      )
    );
    expect(thirdPrinciple).toBeInTheDocument();

    const fourthPrinciple = screen.getByText((content) =>
      content.startsWith(
        mockEventDevelopmentGoals[2].event_development_goals[0].development_goal
          .principles[0].name
      )
    );
    expect(fourthPrinciple).toBeInTheDocument();

    const fifthPrinciple = screen.getByText((content) =>
      content.startsWith(
        mockEventDevelopmentGoals[2].event_development_goals[1].development_goal
          .principles[0].name
      )
    );
    expect(fifthPrinciple).toBeInTheDocument();
  });

  test('handles server error', async () => {
    server.use(
      rest.get(
        '/ui/planning_hub/development_goal_completion_types',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    render(<DevelopmentGoalTab {...props} />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });

  test('displays the correct completion actions', async () => {
    render(<DevelopmentGoalTab {...props} />);

    await screen.findByTestId('DevelopmentGoalsTab|developmentGoalsTab');
    const [headerCompletionActionsTrigger] = screen.getAllByRole('button', {
      name: 'Mark all',
    });

    // Show completion actions belonging to the tab header
    fireEvent.click(headerCompletionActionsTrigger);

    const completionActionTooltip = screen.getByRole('tooltip');
    const actions = completionActionTooltip.querySelectorAll('li');
    expect(actions).toHaveLength(3);
    expect(actions[0]).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[0].name
    );
    expect(actions[1]).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[1].name
    );
    expect(actions[2]).toHaveTextContent('Clear all');
  });

  test('displays the correct completion checkboxes', async () => {
    render(<DevelopmentGoalTab {...props} />);

    const developmentGoalsTab = await screen.findByTestId(
      'DevelopmentGoalsTab|developmentGoalsTab'
    );
    const completionName = developmentGoalsTab.querySelector(
      '.developmentGoalRow__completionName'
    );
    const [
      firstRowCompletion,
      secondRowCompletion,
      thirdRowCompletion,
      fourthRowCompletion,
    ] = developmentGoalsTab.querySelectorAll('.developmentGoalRow__completion');

    // FIRST ATHLETE DEVELOPMENT GOAL

    // 01 DEVELOPMENT GOAL ROW
    const firstRowCheckboxes = firstRowCompletion.children;
    expect(firstRowCheckboxes).toHaveLength(3);

    // First checkbox - default checkbox checked
    expect(firstRowCheckboxes[0]).not.toContainElement(completionName);
    expect(firstRowCheckboxes[0]).toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
    // Second checkbox - checkbox unchecked
    expect(firstRowCheckboxes[1].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[0].name
    );
    expect(firstRowCheckboxes[1].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
    // Third checkbox - checkbox unchecked
    expect(firstRowCheckboxes[2].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[1].name
    );
    expect(firstRowCheckboxes[2].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );

    // 02 DEVELOPMENT GOAL ROW
    const secondRowCheckboxes = secondRowCompletion.children;
    expect(secondRowCheckboxes).toHaveLength(2);
    // First checkbox - checkbox unchecked
    expect(secondRowCheckboxes[0].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[0].name
    );
    expect(secondRowCheckboxes[0].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
    // Second checkbox - checkbox unchecked
    expect(secondRowCheckboxes[1].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[1].name
    );
    expect(secondRowCheckboxes[1].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );

    // SECOND ATHLETE DEVELOPMENT GOAL

    // 03 DEVELOPMENT GOAL ROW
    const thirdRowCheckboxes = thirdRowCompletion.children;
    expect(thirdRowCheckboxes).toHaveLength(2);
    // First checkbox - checkbox unchecked
    expect(thirdRowCheckboxes[0].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[0].name
    );
    expect(thirdRowCheckboxes[0].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
    // Second checkbox - checkbox checked
    expect(thirdRowCheckboxes[1].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[1].name
    );
    expect(thirdRowCheckboxes[1].querySelector('i')).toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );

    // 04 DEVELOPMENT GOAL ROW
    const fourthRowCheckboxes = fourthRowCompletion.children;
    expect(fourthRowCheckboxes).toHaveLength(3);
    // First checkbox - checkbox unchecked
    expect(fourthRowCheckboxes[0].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[0].name
    );
    expect(fourthRowCheckboxes[0].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
    // Second checkbox - checkbox unchecked
    expect(fourthRowCheckboxes[1].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[1].name
    );
    expect(fourthRowCheckboxes[1].querySelector('i')).not.toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
    // Third checkbox - checkbox checked
    expect(fourthRowCheckboxes[2].querySelector('span')).toHaveTextContent(
      mockDevelopmentGoalCompletionTypes[2].name
    );
    expect(fourthRowCheckboxes[2].querySelector('i')).toHaveClass(
      'actionCheckbox--kitmanDesignSystem--checked'
    );
  });

  test('only displays the default completion actions when all the completion types are archived', async () => {
    const mockDevelopmentGoalCompletionTypesArchived =
      mockDevelopmentGoalCompletionTypes.map((completionType) => ({
        ...completionType,
        archived: true,
      }));

    // Override the initial "GET /ui/planning_hub/development_goal_completion_types" request handler
    // so it returns all the completion types archived
    server.use(
      rest.get(
        '/ui/planning_hub/development_goal_completion_types',
        (req, res, ctx) => {
          return res(ctx.json(mockDevelopmentGoalCompletionTypesArchived));
        }
      )
    );

    render(<DevelopmentGoalTab {...props} />);

    await screen.findByTestId('DevelopmentGoalsTab|developmentGoalsTab');
    const [headerCompletionActionsTrigger] = screen.getAllByRole('button', {
      name: 'Mark all',
    });

    // Show completion actions belonging to the tab header
    fireEvent.click(headerCompletionActionsTrigger);

    const completionActionTooltip = screen.getByRole('tooltip');
    const actions = completionActionTooltip.querySelectorAll('li');
    expect(actions).toHaveLength(2);
    expect(actions[0]).toHaveTextContent('Checked');
    expect(actions[1]).toHaveTextContent('Unchecked');
  });

  describe('when selecting completion types', () => {
    test('displays the completion checkboxes correctly when selecting a single goal', async () => {
      render(<DevelopmentGoalTab {...props} />);

      const developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
      const firstRowCheckboxes = developmentGoalsTab.querySelector(
        '.developmentGoalRow__completion'
      ).children;

      const firstCheckbox = firstRowCheckboxes[0];
      const secondCheckbox = firstRowCheckboxes[1].querySelector('i');
      const thirdCheckbox = firstRowCheckboxes[2].querySelector('i');

      fireEvent.click(secondCheckbox);
      // Disable the clicked checkbox while loading
      expect(secondCheckbox).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--disabled'
      );

      // Once the data is loaded, the first checkbox is removed
      await waitForElementToBeRemoved(firstCheckbox);
      expect(firstRowCheckboxes).toHaveLength(2);

      // the second checkbox is checked
      expect(secondCheckbox).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // the third checkbox is unchecked
      expect(thirdCheckbox).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
    });

    test('displays the completion checkboxes correctly when selecting all the goals of an athlete', async () => {
      render(<DevelopmentGoalTab {...props} />);

      const developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
      const [firstRowCompletion, secondRowCompletion] =
        developmentGoalsTab.querySelectorAll('.developmentGoalRow__completion');
      const [
        firstRowFirstCheckbox,
        firstRowSecondCheckbox,
        firstRowThirdCheckbox,
      ] = firstRowCompletion.children;
      const [secondRowFirstCheckbox, secondRowSecondCheckbox] =
        secondRowCompletion.children;

      const completionActionsTrigger = screen.getAllByRole('button', {
        name: 'Mark all',
      });

      // Show completion actions belonging to the first athlete
      fireEvent.click(completionActionsTrigger[1]);

      const completionActionTooltip = screen.getByRole('tooltip');
      const selectFirstCompletionTypeAction =
        completionActionTooltip.querySelector('li');

      // Override the "POST /ui/planning_hub/events/37196/event_development_goals/bulk_save" request handler
      // so it returns the correct list whose items contain the goal and the completion type ids
      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/bulk_save',
          (req, res, ctx) => {
            return res(
              ctx.json([
                {
                  development_goal_id: 1,
                  development_goal_completion_type_id: 1,
                },
                {
                  development_goal_id: 2,
                  development_goal_completion_type_id: 1,
                },
                {
                  development_goal_id: 3,
                  development_goal_completion_type_id: 2,
                },
                {
                  development_goal_id: 4,
                  development_goal_completion_type_id: 3,
                },
              ])
            );
          }
        )
      );

      // Select the first completion type of the first athlete goal
      fireEvent.click(selectFirstCompletionTypeAction);

      // Once the data is loaded, the first checkbox is removed
      await waitForElementToBeRemoved(firstRowFirstCheckbox);

      // 01 DEVELOPMENT GOAL ROW
      // Second checkbox of first row - checkbox checked
      expect(firstRowSecondCheckbox.querySelector('i')).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // Third checkbox of first row - checkbox unchecked
      expect(firstRowThirdCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // 02 DEVELOPMENT GOAL ROW
      // first checkbox of second row - checkbox checked
      expect(secondRowFirstCheckbox.querySelector('i')).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of second row - checkbox unchecked
      expect(secondRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
    });

    test('displays the completion checkboxes correctly when selecting all goals', async () => {
      render(<DevelopmentGoalTab {...props} />);

      const developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
      const [
        firstRowCompletion,
        secondRowCompletion,
        thirdRowCompletion,
        fourthRowCompletion,
      ] = developmentGoalsTab.querySelectorAll(
        '.developmentGoalRow__completion'
      );
      const [
        firstRowFirstCheckbox,
        firstRowSecondCheckbox,
        firstRowThirdCheckbox,
      ] = firstRowCompletion.children;
      const [secondRowFirstCheckbox, secondRowSecondCheckbox] =
        secondRowCompletion.children;
      const [thirdRowFirstCheckbox, thirdRowSecondCheckbox] =
        thirdRowCompletion.children;
      const [
        fourthRowFirstCheckbox,
        fourthRowSecondCheckbox,
        fourthRowThirdCheckbox,
      ] = fourthRowCompletion.children;

      const [headerCompletionActionsTrigger] = screen.getAllByRole('button', {
        name: 'Mark all',
      });

      // Show completion actions belonging to the tab header
      fireEvent.click(headerCompletionActionsTrigger);

      const completionActionTooltip = screen.getByRole('tooltip');
      const selectFirstCompletionTypeAction =
        completionActionTooltip.querySelector('li');

      // Override the "POST /ui/planning_hub/events/37196/event_development_goals/bulk_save" request handler
      // so it returns the correct list whose items contain the goal and the completion type ids
      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/bulk_save',
          (req, res, ctx) => {
            return res(
              ctx.json([
                {
                  development_goal_id: 1,
                  development_goal_completion_type_id: 1,
                },
                {
                  development_goal_id: 2,
                  development_goal_completion_type_id: 1,
                },
                {
                  development_goal_id: 3,
                  development_goal_completion_type_id: 1,
                },
                {
                  development_goal_id: 4,
                  development_goal_completion_type_id: 1,
                },
              ])
            );
          }
        )
      );

      // Select the first completion type for all the goals
      fireEvent.click(selectFirstCompletionTypeAction);

      // Once the data is loaded, the first checkbox is removed
      await waitForElementToBeRemoved(firstRowFirstCheckbox);

      // FIRST ATHLETE DEVELOPMENT GOAL

      // 01 DEVELOPMENT GOAL ROW
      // Second checkbox of first row - checkbox checked
      expect(firstRowSecondCheckbox.querySelector('i')).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // Third checkbox of first row - checkbox unchecked
      expect(firstRowThirdCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // 02 DEVELOPMENT GOAL ROW
      // first checkbox of second row - checkbox checked
      expect(secondRowFirstCheckbox.querySelector('i')).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of second row - checkbox unchecked
      expect(secondRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // SECOND ATHLETE DEVELOPMENT GOAL

      // 03 DEVELOPMENT GOAL ROW
      // first checkbox of third row - checkbox checked
      expect(thirdRowFirstCheckbox.querySelector('i')).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of third row - checkbox unchecked
      expect(thirdRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // 04 DEVELOPMENT GOAL ROW
      // first checkbox of fourth row - checkbox checked
      expect(fourthRowFirstCheckbox.querySelector('i')).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of fourth row - checkbox unchecked
      expect(fourthRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // third checkbox of fourth row - removed because the related completion type is archived
      expect(fourthRowThirdCheckbox).not.toBeInTheDocument();
    });
  });

  describe('when unselecting completion types', () => {
    test('displays the completion checkboxes correctly when unselecting a single goal', async () => {
      render(<DevelopmentGoalTab {...props} />);

      const developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
      const firstRowCheckboxes = developmentGoalsTab.querySelector(
        '.developmentGoalRow__completion'
      ).children;

      const firstCheckbox = firstRowCheckboxes[0];
      const secondCheckbox = firstRowCheckboxes[1].querySelector('i');
      const thirdCheckbox = firstRowCheckboxes[2].querySelector('i');

      // Override the "POST /ui/planning_hub/events/37196/event_development_goals/bulk_save" request handler
      // so it returns the correct list whose items contain the goal and the completion type ids
      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/bulk_save',
          (req, res, ctx) => {
            return res(
              ctx.json([
                {
                  development_goal_id: 3,
                  development_goal_completion_type_id: 2,
                },
                {
                  development_goal_id: 4,
                  development_goal_completion_type_id: 3,
                },
              ])
            );
          }
        )
      );

      fireEvent.click(firstCheckbox);
      // Disable the clicked checkbox while loading
      expect(firstCheckbox).toHaveClass(
        'actionCheckbox--kitmanDesignSystem--disabled'
      );

      // Once the data is loaded, the first checkbox is removed
      await waitForElementToBeRemoved(firstCheckbox);
      expect(firstRowCheckboxes).toHaveLength(2);

      // the second checkbox is unchecked
      expect(secondCheckbox).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // the third checkbox is unchecked
      expect(thirdCheckbox).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
    });

    test('displays the completion checkboxes correctly when unselecting all the goals of an athlete', async () => {
      render(<DevelopmentGoalTab {...props} />);

      const developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
      const [firstRowCompletion, secondRowCompletion] =
        developmentGoalsTab.querySelectorAll('.developmentGoalRow__completion');
      const [
        firstRowFirstCheckbox,
        firstRowSecondCheckbox,
        firstRowThirdCheckbox,
      ] = firstRowCompletion.children;
      const [secondRowFirstCheckbox, secondRowSecondCheckbox] =
        secondRowCompletion.children;

      const completionActionsTrigger = screen.getAllByRole('button', {
        name: 'Mark all',
      });

      // Show completion actions belonging to the first athlete
      fireEvent.click(completionActionsTrigger[1]);

      const completionActionTooltip = screen.getByRole('tooltip');
      const clearAllAction = completionActionTooltip.querySelectorAll('li')[2];

      // Override the "POST /ui/planning_hub/events/37196/event_development_goals/bulk_save" request handler
      // so it returns the correct list whose items contain the goal and the completion type ids
      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/bulk_save',
          (req, res, ctx) => {
            return res(
              ctx.json([
                {
                  development_goal_id: 3,
                  development_goal_completion_type_id: 2,
                },
                {
                  development_goal_id: 4,
                  development_goal_completion_type_id: 3,
                },
              ])
            );
          }
        )
      );

      // Clear all the completion types of the first athlete goal
      fireEvent.click(clearAllAction);

      // Once the data is loaded, the first checkbox is removed
      await waitForElementToBeRemoved(firstRowFirstCheckbox);

      // 01 DEVELOPMENT GOAL ROW
      // Second checkbox of first row - checkbox unchecked
      expect(firstRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // Third checkbox of first row - checkbox unchecked
      expect(firstRowThirdCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // 02 DEVELOPMENT GOAL ROW
      // first checkbox of second row - checkbox unchecked
      expect(secondRowFirstCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of second row - checkbox unchecked
      expect(secondRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
    });

    test('displays the completion checkboxes correctly when unselecting all goals', async () => {
      render(<DevelopmentGoalTab {...props} />);

      const developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
      const [
        firstRowCompletion,
        secondRowCompletion,
        thirdRowCompletion,
        fourthRowCompletion,
      ] = developmentGoalsTab.querySelectorAll(
        '.developmentGoalRow__completion'
      );
      const [
        firstRowFirstCheckbox,
        firstRowSecondCheckbox,
        firstRowThirdCheckbox,
      ] = firstRowCompletion.children;
      const [secondRowFirstCheckbox, secondRowSecondCheckbox] =
        secondRowCompletion.children;
      const [thirdRowFirstCheckbox, thirdRowSecondCheckbox] =
        thirdRowCompletion.children;
      const [
        fourthRowFirstCheckbox,
        fourthRowSecondCheckbox,
        fourthRowThirdCheckbox,
      ] = fourthRowCompletion.children;

      const [headerCompletionActionsTrigger] = screen.getAllByRole('button', {
        name: 'Mark all',
      });

      // Show completion actions belonging to the tab header
      fireEvent.click(headerCompletionActionsTrigger);

      const completionActionTooltip = screen.getByRole('tooltip');
      const clearAllAction = completionActionTooltip.querySelectorAll('li')[2];

      // Override the "POST /ui/planning_hub/events/37196/event_development_goals/bulk_save" request handler
      // so it returns the correct list whose items contain the goal and the completion type ids
      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/bulk_save',
          (req, res, ctx) => {
            return res(ctx.json([]));
          }
        )
      );

      // Clear all goals
      fireEvent.click(clearAllAction);

      // Once the data is loaded, the first checkbox is removed
      await waitForElementToBeRemoved(firstRowFirstCheckbox);

      // FIRST ATHLETE DEVELOPMENT GOAL

      // 01 DEVELOPMENT GOAL ROW
      // Second checkbox of first row - checkbox unchecked
      expect(firstRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // Third checkbox of first row - checkbox unchecked
      expect(firstRowThirdCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // 02 DEVELOPMENT GOAL ROW
      // first checkbox of second row - checkbox unchecked
      expect(secondRowFirstCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of second row - checkbox unchecked
      expect(secondRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // SECOND ATHLETE DEVELOPMENT GOAL

      // 03 DEVELOPMENT GOAL ROW
      // first checkbox of third row - checkbox unchecked
      expect(thirdRowFirstCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of third row - checkbox unchecked
      expect(thirdRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );

      // 04 DEVELOPMENT GOAL ROW
      // first checkbox of fourth row - checkbox unchecked
      expect(fourthRowFirstCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // second checkbox of fourth row - checkbox unchecked
      expect(fourthRowSecondCheckbox.querySelector('i')).not.toHaveClass(
        'actionCheckbox--kitmanDesignSystem--checked'
      );
      // third checkbox of fourth row - removed because the related completion type is archived
      expect(fourthRowThirdCheckbox).not.toBeInTheDocument();
    });
  });

  describe('when filtering development goals', () => {
    let developmentGoalsTab;
    let athleteDevelopmentGoals;

    beforeEach(async () => {
      render(<DevelopmentGoalTab {...props} />);

      developmentGoalsTab = await screen.findByTestId(
        'DevelopmentGoalsTab|developmentGoalsTab'
      );
    });

    test('displays the correct athlete development goals when typing in the search filter', async () => {
      expect(
        developmentGoalsTab.querySelectorAll('.athleteDevelopmentGoals')
      ).toHaveLength(3);

      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/search',
          (req, res, ctx) => {
            return res(ctx.json([{ ...mockEventDevelopmentGoals[1] }]));
          }
        )
      );

      const searchFilter = screen.getAllByPlaceholderText('Search')[0];

      fireEvent.change(searchFilter, { target: { value: 'cle' } });

      // Once the resquest is done, the correct athlete development goal is displayed
      await screen.findByTestId('DevelopmentGoalsTab|lineLoader');

      athleteDevelopmentGoals = developmentGoalsTab.querySelectorAll(
        '.athleteDevelopmentGoals'
      );
      expect(athleteDevelopmentGoals).toHaveLength(1);
      expect(
        athleteDevelopmentGoals[0].querySelector(
          '.athleteDevelopmentGoals__athleteName'
        )
      ).toHaveTextContent('Peter Grant');
    });

    test('displays the correct athlete development goals when selecting an item', async () => {
      expect(
        developmentGoalsTab.querySelectorAll('.athleteDevelopmentGoals')
      ).toHaveLength(3);

      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/search',
          (req, res, ctx) => {
            return res(
              ctx.json([
                { ...mockEventDevelopmentGoals[0] },
                { ...mockEventDevelopmentGoals[2] },
              ])
            );
          }
        )
      );

      const typesInput = developmentGoalsTab.querySelectorAll(
        '.developmentGoalsFilters__filter input'
      )[3];
      await selectEvent.select(typesInput, 'Tecnical');

      // Once the resquest is done, the correct athlete development goals are displayed
      await screen.findByTestId('DevelopmentGoalsTab|lineLoader');

      athleteDevelopmentGoals = developmentGoalsTab.querySelectorAll(
        '.athleteDevelopmentGoals'
      );
      expect(athleteDevelopmentGoals).toHaveLength(2);
      expect(
        athleteDevelopmentGoals[0].querySelector(
          '.athleteDevelopmentGoals__athleteName'
        )
      ).toHaveTextContent('John Doe');
      expect(
        athleteDevelopmentGoals[1].querySelector(
          '.athleteDevelopmentGoals__athleteName'
        )
      ).toHaveTextContent('Philip Callahan');
    });

    test('displays the correct athlete development goals when combining several filters', async () => {
      expect(
        developmentGoalsTab.querySelectorAll('.athleteDevelopmentGoals')
      ).toHaveLength(3);

      server.use(
        rest.post(
          '/ui/planning_hub/events/37196/event_development_goals/search',
          (req, res, ctx) => {
            return res(ctx.json([{ ...mockEventDevelopmentGoals[0] }]));
          }
        )
      );

      const typesInput = developmentGoalsTab.querySelectorAll(
        '.developmentGoalsFilters__filter input'
      )[3];
      await selectEvent.select(typesInput, 'Tecnical');

      await screen.findByTestId('DevelopmentGoalsTab|lineLoader');

      const principlesInput = developmentGoalsTab.querySelectorAll(
        '.developmentGoalsFilters__filter input'
      )[4];
      await selectEvent.select(principlesInput, 'Long pass');

      // Once the resquest is done, the correct athlete development goal is displayed
      await screen.findByTestId('DevelopmentGoalsTab|lineLoader');

      athleteDevelopmentGoals = developmentGoalsTab.querySelectorAll(
        '.athleteDevelopmentGoals'
      );
      expect(athleteDevelopmentGoals).toHaveLength(1);
      expect(
        athleteDevelopmentGoals[0].querySelector(
          '.athleteDevelopmentGoals__athleteName'
        )
      ).toHaveTextContent('John Doe');
    });
  });
});
