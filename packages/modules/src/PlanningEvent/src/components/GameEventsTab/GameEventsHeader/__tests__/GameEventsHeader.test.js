import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { gameViews } from '@kitman/common/src/consts/gameEventConsts';
import GameEventsHeader from '../GameEventsHeader';

describe('GameEventsHeader', () => {
  const mockSetSelectedView = jest.fn();
  const mockSetGameScores = jest.fn();
  const mockOnAddPeriod = jest.fn();
  const mockSetShowPrompt = jest.fn();
  const mockSetCurrentView = jest.fn();
  const mockSetIsFormationEditorOpen = jest.fn();

  const mockEvent = {
    organisation_team: {
      name: 'test org name',
      logo_full_path: 'testOrgPath.png',
    },
    opponent_team: {
      name: 'test opponent name',
      logo_full_path: 'testOpponentName.png',
    },
  };

  const mockEventPeriods = [
    {
      id: 2,
      duration: 30,
      name: 'Period 1',
      absolute_duration_start: 0,
      absolute_duration_end: 30,
    },
    {
      id: 3,
      name: 'Period 2',
      duration: 45,
      absolute_duration_start: 30,
      absolute_duration_end: 75,
    },
  ];

  const renderComponent = (currentView, isCustomPeriods = false) =>
    render(
      <GameEventsHeader
        hasUnsavedChanges={false}
        setShowPrompt={mockSetShowPrompt}
        currentView={currentView}
        setCurrentView={mockSetCurrentView}
        selectedView={currentView}
        setSelectedView={mockSetSelectedView}
        gameEvent={mockEvent}
        gameViews={gameViews}
        eventPeriods={mockEventPeriods}
        gameScores={{ orgScore: 2, opponentScore: 0 }}
        setGameScores={mockSetGameScores}
        onAddPeriod={mockOnAddPeriod}
        isAddPeriodDisabled={false}
        hasAPeriodStarted={false}
        isCustomPeriods={isCustomPeriods}
        t={(t) => t}
        setIsFormationEditorOpen={mockSetIsFormationEditorOpen}
      />
    );

  describe('Initial render', () => {
    describe('Pitch selected', () => {
      beforeEach(() => {
        renderComponent('PITCH');
      });

      it('renders out the two view buttons', () => {
        expect(screen.getByText('Pitch view')).toBeInTheDocument();
        expect(screen.getByText('List view')).toBeInTheDocument();
      });

      it('renders the org image and opponent crest image', () => {
        expect(screen.getByTestId('org-crest')).toHaveAttribute(
          'src',
          mockEvent.organisation_team.logo_full_path
        );
        expect(screen.getByTestId('opponent-crest')).toHaveAttribute(
          'src',
          mockEvent.opponent_team.logo_full_path
        );
      });

      it('renders out the add period button', () => {
        expect(screen.getByText('Add period')).toBeInTheDocument();
      });

      it('fires off setCurrentView when List View is clicked', async () => {
        await userEvent.click(screen.getByText('List view'));
        expect(mockSetCurrentView).toHaveBeenCalledWith('LIST');
      });

      it('fires off the onAddPeriod function when clicked', async () => {
        await userEvent.click(screen.getByText('Add period'));
        expect(mockOnAddPeriod).toHaveBeenCalled();
      });
    });

    describe('List View Selected', () => {
      it('fires off setCurrentView when Pitch View is clicked', async () => {
        renderComponent('LIST');
        await userEvent.click(screen.getByText('Pitch view'));
        expect(mockSetCurrentView).toHaveBeenCalledWith('PITCH');
      });
    });
  });

  describe('Period In Progress', () => {
    it('shows the add period modal when the add period button is clicked and there is a period that has started', async () => {
      render(
        <GameEventsHeader
          hasUnsavedChanges={false}
          setShowPrompt={mockSetShowPrompt}
          currentView="PITCH"
          setCurrentView={mockSetCurrentView}
          selectedView=""
          setSelectedView={mockSetSelectedView}
          gameEvent={mockEvent}
          gameViews={gameViews}
          eventPeriods={mockEventPeriods}
          gameScores={{ orgScore: 33, opponentScore: 0 }}
          setGameScores={mockSetGameScores}
          onAddPeriod={mockOnAddPeriod}
          isAddPeriodDisabled={false}
          hasAPeriodStarted
          t={(t) => t}
        />
      );
      await userEvent.click(screen.getByText('Add period'));
      expect(screen.getByText('Add Period')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Confirm'));
      expect(mockOnAddPeriod).toHaveBeenCalled();
    });
  });

  describe('When user has unsaved changes and wants to navigate to List view', () => {
    it('fires off setShowPrompt and setSelectedView when List View is clicked', async () => {
      render(
        <GameEventsHeader
          hasUnsavedChanges
          setShowPrompt={mockSetShowPrompt}
          currentView="PITCH"
          setCurrentView={mockSetCurrentView}
          selectedView=""
          setSelectedView={mockSetSelectedView}
          gameEvent={mockEvent}
          gameViews={gameViews}
          eventPeriods={mockEventPeriods}
          gameScores={{ orgScore: 2, opponentScore: 2 }}
          setGameScores={mockSetGameScores}
          onAddPeriod={mockOnAddPeriod}
          isAddPeriodDisabled={false}
          hasAPeriodStarted={false}
          t={(t) => t}
        />
      );
      await userEvent.click(screen.getByText('List view'));
      expect(mockSetShowPrompt).toHaveBeenCalledWith(true);
      expect(mockSetSelectedView).toHaveBeenCalledWith('LIST');
    });
  });

  describe('[Feature-flag: games-custom-duration-and-additional-time] custom period times modal', () => {
    it('renders the custom period times modal when add period clicked', async () => {
      renderComponent('PITCH', true);
      await userEvent.click(screen.getByText('Add period'));
      expect(screen.getByText('Custom Period Times')).toBeInTheDocument();
      expect(screen.getByText('Period 1')).toBeInTheDocument();
      expect(screen.getByText('Period 2')).toBeInTheDocument();
      expect(screen.getByText('Period 3')).toBeInTheDocument();
    });

    it('closes the modal when cancel is clicked', async () => {
      renderComponent('PITCH', true);
      await userEvent.click(screen.getByText('Add period'));
      expect(screen.getByText('Custom Period Times')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Custom Period Times')).not.toBeInTheDocument();
    });

    it('closes the modal when confirm is clicked and the period is added', async () => {
      renderComponent('PITCH', true);
      await userEvent.click(screen.getByText('Add period'));
      expect(screen.getByText('Custom Period Times')).toBeInTheDocument();
      fireEvent.change(screen.getByDisplayValue(''), {
        target: { value: '20' },
      });
      fireEvent.blur(screen.getByDisplayValue('20'));
      await userEvent.click(screen.getByText('Confirm'));
      expect(screen.queryByText('Custom Period Times')).not.toBeInTheDocument();
      expect(mockOnAddPeriod).toHaveBeenCalledWith([
        {
          absolute_duration_end: 30,
          absolute_duration_start: 0,
          duration: 30,
          id: 2,
          name: 'Period 1',
        },
        {
          absolute_duration_end: 75,
          absolute_duration_start: 30,
          duration: 45,
          id: 3,
          name: 'Period 2',
        },
        {
          absolute_duration_end: 95,
          absolute_duration_start: 75,
          duration: 20,
          localId: 4,
          name: 'Period 3',
        },
      ]);
    });
  });

  describe('[Feature-flag: game-formations-editor]', () => {
    describe('when true', () => {
      beforeEach(() => {
        window.featureFlags = {
          'game-formations-editor': true,
        };
      });

      afterEach(() => {
        window.featureFlags = {
          'game-formations-editor': false,
        };
      });

      it('renders "Edit formations" button', () => {
        renderComponent('PITCH');
        expect(screen.getByText('Edit formations')).toBeInTheDocument();
      });

      it('calls setIsFormationEditorOpen when click on "Edit formations"', async () => {
        renderComponent('PITCH');
        await userEvent.click(screen.getByText('Edit formations'));
        expect(mockSetIsFormationEditorOpen).toHaveBeenCalled();
      });
    });

    describe('when false', () => {
      it('hides "Edit formations" button', () => {
        window.featureFlags = {
          'game-formations-editor': false,
        };
        renderComponent('PITCH');
        expect(screen.queryByText('Edit formations')).not.toBeInTheDocument();
      });
    });
  });
});
