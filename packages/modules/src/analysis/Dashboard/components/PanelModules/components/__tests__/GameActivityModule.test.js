import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetPositionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';
import { useGetFormationsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

import GameActivityModule from '../GameActivityModule';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/medical');
jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');

describe('PanelModules|GameActivityModule', () => {
  const mockProps = {
    t: i18nextTranslateStub(),
    title: undefined,
    calculation: undefined,
    onSetCalculation: jest.fn(),
    onSetTitle: jest.fn(),
    onSetGameActivityKinds: jest.fn(),
    onSetGameActivityResult: jest.fn(),
    onSetTimeInPositions: jest.fn(),
    selectedEvent: undefined,
  };

  beforeEach(() => {
    useGetPositionsQuery.mockReturnValue({
      data: [
        {
          id: 25,
          name: 'Forward',
          positions: [
            {
              id: 72,
              name: 'Loose-head Prop',
            },
          ],
        },
      ],
    });
  });

  useGetFormationsQuery.mockReturnValue({
    data: [
      {
        id: 68,
        number_of_players: 11,
        name: 'Sweeper',
      },
      {
        id: 4,
        number_of_players: 11,
        name: '5-4-1 - Flat',
      },
    ],
  });

  afterAll(() => {
    window.featureFlags = {};
  });

  it('renders the GameActivityModule', () => {
    render(<GameActivityModule {...mockProps} />);
    const gameActivity = screen.getByText('Game Event');
    expect(gameActivity).toBeInTheDocument();
  });

  describe('Game Event field', () => {
    it('renders the game event select component and the drop down options', async () => {
      const user = userEvent.setup();
      render(<GameActivityModule {...mockProps} />);

      const gameEventElement = screen.getByLabelText('Game Event');

      expect(gameEventElement).toBeInTheDocument();

      // click the drop down option
      await user.click(gameEventElement);

      const goals = screen.getByText('Goals');
      const assists = screen.getByText('Assists');
      const cards = screen.getByText('Cards');

      expect(goals).toBeInTheDocument();
      expect(assists).toBeInTheDocument();
      expect(cards).toBeInTheDocument();
    });

    it('renders the "Results" game event option', async () => {
      const user = userEvent.setup();
      render(<GameActivityModule {...mockProps} />);

      const gameEventElement = screen.getByLabelText('Game Event');

      expect(gameEventElement).toBeInTheDocument();

      // click the drop down option
      await user.click(gameEventElement);

      const results = screen.getByText('Results');

      expect(results).toBeInTheDocument();
    });

    describe('when Goals is selected in the drop down', () => {
      it('calls onSetGameActivityKinds', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');
        // click the drop down option
        await user.click(gameEventElement);

        const goals = screen.getByText('Goals');
        await user.click(goals);

        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledTimes(1);
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledWith(
          ['goal'],
          'Goals'
        );
      });

      it('calls onSetTitle to populate the column title', async () => {
        const user = userEvent.setup();
        const updatedProps = {
          ...mockProps,
          kinds: ['goal'],
          title: 'Goals',
        };
        render(<GameActivityModule {...updatedProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        // click the drop down option
        await user.click(gameEventElement);

        // find and click Goal
        const goals = screen.getByText('Goals');
        await user.click(goals);

        const titleElement = screen.getByLabelText('Column Title');

        expect(titleElement.value).toBe('Goals');
        expect(mockProps.onSetTitle).toHaveBeenCalledWith('Goals');
      });
    });

    describe('when Assists is selected in the drop down', () => {
      it('calls onSetGameActivityKinds', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');
        // click the drop down option
        await user.click(gameEventElement);

        const assists = screen.getByText('Assists');
        await user.click(assists);

        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledTimes(1);
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledWith(
          ['assist'],
          'Assists'
        );
      });

      it('calls onSetTitle to populate the column title', async () => {
        const user = userEvent.setup();
        const updatedProps = {
          ...mockProps,
          kinds: ['assists'],
          title: 'Assists',
        };
        render(<GameActivityModule {...updatedProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        // click the drop down option
        await user.click(gameEventElement);

        // find and click Assist
        const assists = screen.getByText('Assists');
        await user.click(assists);

        const titleElement = screen.getByLabelText('Column Title');

        expect(titleElement.value).toBe('Assists');
        expect(mockProps.onSetTitle).toHaveBeenCalledWith('Assists');
      });
    });

    describe('when Cards is selected in the drop down', () => {
      it('does not call onSetGameActivityKinds', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');
        // click the drop down option
        await user.click(gameEventElement);

        const cards = screen.getByText('Cards');
        await user.click(cards);

        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledTimes(1);
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledWith([], '');
      });

      it('calls onSetTitle with an empty string', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');
        // click the drop down option
        await user.click(gameEventElement);

        const cards = screen.getByText('Cards');
        await user.click(cards);

        expect(mockProps.onSetTitle).toHaveBeenCalledWith('');
      });
    });

    describe('when Results is selected in the drop down', () => {
      it('does not call onSetGameActivityKinds', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');
        // click the drop down option
        await user.click(gameEventElement);

        const results = screen.getByText('Results');
        await user.click(results);

        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledTimes(1);
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledWith([], '');
      });

      it('calls onSetTitle with an empty string', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');
        // click the drop down option
        await user.click(gameEventElement);

        const cards = screen.getByText('Cards');
        await user.click(cards);

        expect(mockProps.onSetTitle).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Game Event Types field', () => {
    describe('when Cards is selected in the Game Event drop down', () => {
      it('renders the Cards Types drop down', async () => {
        const user = userEvent.setup();
        // simulates Cards being selected
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const cards = screen.getByText('Cards');
        await user.click(cards);
        // find Game Event Types element
        const cardsElement = screen.getByLabelText('Cards');

        expect(cardsElement).toBeInTheDocument();
      });

      it('renders the yellow and red as options', async () => {
        const user = userEvent.setup();
        // simulates Cards being selected
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const cards = screen.getByText('Cards');
        await user.click(cards);

        // find Cards element
        const cardsElement = screen.getByLabelText('Cards');

        // click Game Event Types element
        await user.click(cardsElement);

        const yellow = screen.getByText('Yellow');
        const red = screen.getByText('Red');

        expect(yellow).toBeInTheDocument();
        expect(red).toBeInTheDocument();
      });

      it('calls onSetGameActivityKinds and onSetTitle with "Cards"', async () => {
        const user = userEvent.setup();
        // simulates Cards being selected
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const cards = screen.getByText('Cards');
        await user.click(cards);

        // find Cards element
        const cardsElement = screen.getByLabelText('Cards');

        // click Game Event Types element
        await user.click(cardsElement);
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalled();
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledWith([], '');

        const yellow = screen.getByText('Yellow');

        // select yellow
        await user.click(yellow);

        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalled();
        expect(mockProps.onSetGameActivityKinds).toHaveBeenCalledWith(
          ['yellow_card'],
          'Cards'
        );

        expect(mockProps.onSetTitle).toHaveBeenCalledTimes(2); // 2 - for the first call when selecting cards with '' & second call when selecting yellow.
        expect(mockProps.onSetTitle).toHaveBeenCalledWith('Cards');
      });
    });
  });

  describe('when Results is selected in the Game Event drop down', () => {
    it('renders the Results Types drop down', async () => {
      const user = userEvent.setup();
      // simulates Results being selected
      render(<GameActivityModule {...mockProps} />);

      const gameEventElement = screen.getByLabelText('Game Event');

      await user.click(gameEventElement);

      const results = screen.getByText('Results');
      await user.click(results);
      // find Results element
      const resultsElement = screen.getByLabelText('Results');

      expect(resultsElement).toBeInTheDocument();
    });

    it('renders the "Win", "Draw" and "Loss" as options', async () => {
      const user = userEvent.setup();
      // simulates Cards being selected
      render(<GameActivityModule {...mockProps} />);

      const gameEventElement = screen.getByLabelText('Game Event');

      await user.click(gameEventElement);

      const results = screen.getByText('Results');
      await user.click(results);

      // find and click Results element
      const resultsElement = screen.getByLabelText('Results');
      await user.click(resultsElement);

      const win = screen.getByText('Win');
      const draw = screen.getByText('Draw');
      const loss = screen.getByText('Loss');

      expect(win).toBeInTheDocument();
      expect(draw).toBeInTheDocument();
      expect(loss).toBeInTheDocument();
    });

    it('calls onSetGameActivityResult and onSetTitle with "Cards"', async () => {
      const user = userEvent.setup();
      // simulates Results being selected
      render(<GameActivityModule {...mockProps} />);

      const gameEventElement = screen.getByLabelText('Game Event');

      await user.click(gameEventElement);

      const results = screen.getByText('Results');
      await user.click(results);

      // find Results element
      const resultsElement = screen.getByLabelText('Results');

      // click Results element
      await user.click(resultsElement);

      // find and click Win
      const win = screen.getByText('Win');
      await user.click(win);

      expect(mockProps.onSetGameActivityResult).toHaveBeenCalledTimes(1);
      expect(mockProps.onSetGameActivityResult).toHaveBeenCalledWith(
        'win',
        'Win'
      );

      expect(mockProps.onSetTitle).toHaveBeenCalledTimes(2); // 2 - for the first call when selecting cards with '' & second call when selecting yellow.
      expect(mockProps.onSetTitle).toHaveBeenCalledWith('Win');
    });
  });

  describe('Column Title', () => {
    it('renders the Column title field', () => {
      render(<GameActivityModule {...mockProps} />);

      const title = screen.getByLabelText('Column Title');

      expect(title).toBeInTheDocument();
    });

    it('populates automatically when a game event is selected', async () => {
      const user = userEvent.setup();
      const updatedProps = {
        ...mockProps,
        kinds: ['goal'],
        title: 'Goals',
      };
      render(<GameActivityModule {...updatedProps} />);

      const gameEventElement = screen.getByLabelText('Game Event');

      // click the drop down option
      await user.click(gameEventElement);

      // find and click first goals found
      const goals = screen.getAllByText('Goals');
      await user.click(goals[0]);

      const titleElement = screen.getByLabelText('Column Title');

      expect(titleElement.value).toBe('Goals');
    });

    it('calls onSetTitle when inputing in column title field', async () => {
      const user = userEvent.setup();
      render(<GameActivityModule {...mockProps} />);

      const title = screen.getByLabelText('Column Title');
      await user.type(title, 'T');

      expect(mockProps.onSetTitle).toHaveBeenCalledTimes(1);
      expect(mockProps.onSetTitle).toHaveBeenCalledWith('T');
    });

    describe('when on a scorecard panel', () => {
      it('displays row title', () => {
        render(<GameActivityModule {...mockProps} panelType="row" />);

        const rowTitle = screen.getByText('Row Title');

        expect(rowTitle).toBeInTheDocument();
      });
    });

    describe('when hide column title is true', () => {
      it('does not show the title selector', () => {
        render(<GameActivityModule {...mockProps} hideColumnTitle />);
        expect(screen.queryByLabelText('Column Title')).not.toBeInTheDocument();
      });
    });
  });

  describe('Calculation', () => {
    it('renders the calucation select component', () => {
      render(<GameActivityModule {...mockProps} />);

      const title = screen.getByLabelText('Calculation');

      expect(title).toBeInTheDocument();
    });

    it('renders the drop down options', async () => {
      const user = userEvent.setup();
      // wraping in a Virtuoso wrapper due the number of options in the select component
      render(<GameActivityModule {...mockProps} />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });

      const calculationElement = screen.getByLabelText('Calculation');

      await user.click(calculationElement);

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.getByText('Sum')).toBeInTheDocument();
      expect(screen.getByText('Sum (Absolute)')).toBeInTheDocument();
      expect(screen.getByText('Mean')).toBeInTheDocument();
      expect(screen.queryByText('Mean (Absolute)')).not.toBeInTheDocument();
      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.queryByText('Min (Absolute)')).not.toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.queryByText('Max (Absolute)')).not.toBeInTheDocument();
      expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('calls onSetCalculation once selected', async () => {
      const user = userEvent.setup();
      // wraping in a Virtuoso wrapper due the number of options in the select component
      render(<GameActivityModule {...mockProps} />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });
      // find calculation field
      await user.click(screen.getByLabelText('Calculation'));

      const count = screen.getByText('Count');

      await user.click(count);

      expect(mockProps.onSetCalculation).toHaveBeenCalledTimes(1);
      expect(mockProps.onSetCalculation).toHaveBeenCalledWith('count');
    });
  });

  describe('Time in Formation', () => {
    describe('when rep-show-time-in-formation-table-widget is on', () => {
      beforeEach(() => {
        window.setFlag('rep-show-time-in-formation-table-widget', true);
      });

      afterEach(() => {
        window.setFlag('rep-show-time-in-formation-table-widget', false);
      });

      it('render Time in Formation in dropdown and associated options', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const cards = screen.getByText('Time in Formation');

        await user.click(cards);

        const timeInFormationText = screen.getByLabelText('Formations');

        await user.click(timeInFormationText);

        expect(timeInFormationText).toBeInTheDocument();
      });
    });

    describe('when rep-show-time-in-formation-table-widget is off', () => {
      beforeEach(() => {
        window.setFlag('rep-show-time-in-formation-table-widget', false);
      });

      afterEach(() => {
        window.setFlag('rep-show-time-in-formation-table-widget', false);
      });

      it('render Time in Formation in dropdown', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const timeInFormationText = screen.queryByText('Time in Formation');

        expect(timeInFormationText).not.toBeInTheDocument();
      });
    });
  });

  describe('Time in Position', () => {
    describe('when rep-show-time-in-position-table-widget is on', () => {
      beforeEach(() => {
        window.setFlag('rep-show-time-in-position-table-widget', true);
      });

      afterEach(() => {
        window.setFlag('rep-show-time-in-position-table-widget', false);
      });

      it('render Time in Position in dropdown and associated options', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const cards = screen.getByText('Time in Position');

        await user.click(cards);

        const timeInPositionText = screen.getByLabelText('Positions');

        await user.click(timeInPositionText);

        expect(timeInPositionText).toBeInTheDocument();
        expect(screen.getByText('Forward')).toBeInTheDocument();
        expect(screen.getByText('Loose-head Prop')).toBeInTheDocument();
      });
    });

    describe('when rep-show-time-in-position-table-widget is off', () => {
      beforeEach(() => {
        window.setFlag('rep-show-time-in-position-table-widget', false);
      });

      afterEach(() => {
        window.setFlag('rep-show-time-in-position-table-widget', false);
      });

      it('render Time in Position in dropdown', async () => {
        const user = userEvent.setup();
        render(<GameActivityModule {...mockProps} />);

        const gameEventElement = screen.getByLabelText('Game Event');

        await user.click(gameEventElement);

        const timeInPositionText = screen.queryByText('Time in Position');

        expect(timeInPositionText).not.toBeInTheDocument();
      });
    });
  });

  describe('when editing a game event data source', () => {
    beforeEach(() => {
      window.setFlag('rep-show-time-in-position-table-widget', true);
      window.setFlag('rep-show-time-in-formation-table-widget', true);
      window.setFlag('league-ops-game-events-own-goal', true);
    });

    it('displays Goals in the Game Event drop down for event type goal', () => {
      render(<GameActivityModule {...mockProps} selectedEvent={['goal']} />);

      expect(screen.getByText('Goals')).toBeVisible();
    });

    it('displays Assists in the Game Event drop down for event type assist', () => {
      render(<GameActivityModule {...mockProps} selectedEvent={['assist']} />);

      expect(screen.getByText('Assists')).toBeVisible();
    });

    it('displays Cards in the Game Event drop down for event type yellow_card', () => {
      render(
        <GameActivityModule {...mockProps} selectedEvent={['yellow_card']} />
      );

      const cardElements = screen.getAllByText('Cards');

      expect(cardElements).toHaveLength(2);
      expect(cardElements[0]).toBeVisible(); // Cards as the Game Event display name
      expect(cardElements[1]).toBeVisible(); // Cards as the label text for the drop down

      expect(screen.getByText('Yellow')).toBeVisible();
    });

    it('displays Cards in the Game Event drop down for event type red_card', () => {
      render(
        <GameActivityModule {...mockProps} selectedEvent={['red_card']} />
      );

      const cardElements = screen.getAllByText('Cards');

      expect(cardElements).toHaveLength(2);
      expect(cardElements[0]).toBeVisible(); // Cards as the Game Event display name
      expect(cardElements[1]).toBeVisible(); // Cards as the label text for the drop down

      expect(screen.getByText('Red')).toBeVisible();
    });

    it('displays Results in the Game Event drop down for event type win', () => {
      render(<GameActivityModule {...mockProps} selectedEvent="win" />);

      const resultsElements = screen.getAllByText('Results');

      expect(resultsElements).toHaveLength(2);
      expect(resultsElements[0]).toBeVisible(); // Results as the Game Event display name
      expect(resultsElements[1]).toBeVisible(); // Results as the label text for the drop down

      expect(screen.getByText('Win')).toBeVisible();
    });

    it('displays Results in the Game Event drop down for event type draw', () => {
      render(<GameActivityModule {...mockProps} selectedEvent="draw" />);

      const resultsElements = screen.getAllByText('Results');

      expect(resultsElements).toHaveLength(2);
      expect(resultsElements[0]).toBeVisible(); // Results as the Game Event display name
      expect(resultsElements[1]).toBeVisible(); // Results as the label text for the drop down

      expect(screen.getByText('Draw')).toBeVisible();
    });

    it('displays Results in the Game Event drop down for event type loss', () => {
      render(<GameActivityModule {...mockProps} selectedEvent="loss" />);

      const resultsElements = screen.getAllByText('Results');

      expect(resultsElements).toHaveLength(2);
      expect(resultsElements[0]).toBeVisible(); // Results as the Game Event display name
      expect(resultsElements[1]).toBeVisible(); // Results as the label text for the drop down

      expect(screen.getByText('Loss')).toBeVisible();
    });

    it('displays Time in Formation in the Game Event drop down for event type formation_change', () => {
      render(
        <GameActivityModule
          {...mockProps}
          selectedEvent={['formation_change']}
        />
      );

      expect(screen.getByText('Time in Formation')).toBeVisible();
    });

    it('displays Time in Position in the Game Event drop down for event type position_change', () => {
      render(
        <GameActivityModule
          {...mockProps}
          selectedEvent={['position_change']}
        />
      );

      expect(screen.getByText('Time in Position')).toBeVisible();
    });

    it('displays Own Goals in the Game Event drop down for event type own_goal', () => {
      render(
        <GameActivityModule {...mockProps} selectedEvent={['own_goal']} />
      );

      expect(screen.getByText('Own Goal')).toBeVisible();
    });
  });
});
