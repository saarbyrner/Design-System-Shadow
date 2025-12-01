import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import GameEventsFooter from '..';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('GameEventsFooter', () => {
  const defaultProps = {
    isAutoSaveComplete: true,
    isMatchDayFlowLocked: false,
    isImportedGame: false,
    isMatchDayGameStartingPeriod: false,
    hasPlayersBeenAssigned: false,
    onFinishPeriod: jest.fn(),
    saveEnabled: false,
    pageRequestStatus: 'SUCCESS',
    onSave: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = ({ props = defaultProps, preferences = {} }) => {
    usePreferences.mockReturnValue({
      preferences,
    });
    render(<GameEventsFooter {...props} />);
  };

  describe('default footer render', () => {
    it('renders no buttons', () => {
      renderComponent({});
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders the finish period button', () => {
      renderComponent({
        props: { ...defaultProps, hasPlayersBeenAssigned: true },
      });
      expect(screen.getByText('Finish period')).toBeInTheDocument();
    });

    it('renders the save progress button', () => {
      renderComponent({ props: { ...defaultProps, saveEnabled: true } });
      expect(screen.getByText('Save progress')).toBeInTheDocument();
    });

    it('fires off onSave and onFinishPeriod when buttons are clicked', async () => {
      renderComponent({
        props: {
          ...defaultProps,
          saveEnabled: true,
          hasPlayersBeenAssigned: true,
        },
      });
      await userEvent.click(screen.getByText('Save progress'));
      expect(defaultProps.onSave).toHaveBeenCalled();
      await userEvent.click(screen.getByText('Finish period'));
      expect(defaultProps.onFinishPeriod).toHaveBeenCalled();
    });
  });

  describe('Match Day Flow imported games render', () => {
    const matchDayProps = {
      ...defaultProps,
      isImportedGame: true,
      isMatchDayGameStartingPeriod: true,
      footerValidationValues: {
        isCaptainEnabled: true,
        minNumberOfPlayersSelected: 20,
        minNumberOfSubs: 2,
        minNumberOfStaff: 3,
        isPhysicianEnabled: true,
      },
      footerValidationChecks: {
        playersSelected: false,
        captainAssigned: false,
        lineupDone: true,
        subsSelected: false,
        staffSelected: false,
        physicianSelected: false,
      },
    };

    const expectBuisnessRulesAssertions = () => {
      expect(screen.getByText('Select players (min 22)')).toBeInTheDocument();
      expect(screen.getByText('Select captain')).toBeInTheDocument();
      expect(screen.getByText('Select starting 20')).toBeInTheDocument();
      expect(screen.getByText('Substitutions (min 2)')).toBeInTheDocument();
      expect(
        screen.getByText('Select staff personnel (min 3)')
      ).toBeInTheDocument();
      expect(screen.getByText('Select club physician')).toBeInTheDocument();
    };

    it('renders the appropriate info match day info segments', () => {
      renderComponent({
        props: matchDayProps,
        preferences: { league_game_team: true },
      });
      expectBuisnessRulesAssertions();

      expect(
        screen.queryByText('Share with officials')
      ).not.toBeInTheDocument();
    });

    it('does not render the club physician check if physician enabled is false', () => {
      renderComponent({
        props: {
          ...matchDayProps,
          footerValidationValues: {
            ...matchDayProps.footerValidationValues,
            isPhysicianEnabled: false,
          },
        },
        preferences: { league_game_team: true },
      });

      expect(
        screen.queryByText('Select club physician')
      ).not.toBeInTheDocument();
    });

    it('does not render the captain check if captain enabled is false', () => {
      renderComponent({
        props: {
          ...matchDayProps,
          footerValidationValues: {
            ...matchDayProps.footerValidationValues,
            isCaptainEnabled: false,
          },
        },
        preferences: { league_game_team: true },
      });

      expect(screen.queryByText('Select captain')).not.toBeInTheDocument();
    });

    describe('league_game_match_report preference', () => {
      it('renders the share with officials button and business rules if league_game_match_report preference is true', () => {
        renderComponent({
          props: matchDayProps,
          preferences: {
            league_game_team: true,
            league_game_match_report: true,
          },
        });

        expectBuisnessRulesAssertions();

        expect(screen.queryByText('Share with officials')).toBeInTheDocument();
      });
    });

    describe('league match day locked footer', () => {
      it('does not render the finish period button if isMatchDayFlowLocked is false', () => {
        renderComponent({
          props: matchDayProps,
          preferences: {
            league_game_team: true,
          },
        });
        expect(screen.queryByText('Finish period')).not.toBeInTheDocument();
      });

      it('does not render the finish period if isMatchDayFlowLocked is true and it is the starting lineup period', () => {
        renderComponent({
          props: { ...matchDayProps, isMatchDayFlowLocked: true },
          preferences: {
            league_game_team: true,
          },
        });
        expect(screen.queryByText('Finish period')).not.toBeInTheDocument();
      });

      it('does render the finish period if isMatchDayFlowLocked is true and it is the starting lineup period as well as the relevant buisness rules are complete', () => {
        renderComponent({
          props: {
            ...matchDayProps,
            isMatchDayFlowLocked: true,
            footerValidationChecks: {
              ...matchDayProps.footerValidationChecks,
              captainAssigned: true,
            },
          },
          preferences: {
            league_game_team: true,
          },
        });
        expect(screen.getByText('Finish period')).toBeInTheDocument();
      });
    });

    it('renders the save progress, finish period and business rules if league_game_match_report preference is true and it isnt the starting period', () => {
      renderComponent({
        props: {
          ...matchDayProps,
          isMatchDayGameStartingPeriod: false,
          saveEnabled: true,
          hasPlayersBeenAssigned: true,
        },
        preferences: {
          league_game_team: true,
          league_game_match_report: true,
        },
      });

      expectBuisnessRulesAssertions();

      expect(
        screen.queryByText('Share with officials')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Finish period')).toBeInTheDocument();
      expect(screen.getByText('Save progress')).toBeInTheDocument();
    });
  });

  describe('window.featureFlags["pitch-view-autosave"] render', () => {
    it('does not render the save button if the auto save feature flag is on', () => {
      window.featureFlags = { 'pitch-view-autosave': true };
      renderComponent({
        props: {
          ...defaultProps,
          isImportedGame: true,
          footerValidationValues: {
            isCaptainEnabled: true,
            minNumberOfPlayersSelected: 20,
            minNumberOfSubs: 2,
            minNumberOfStaff: 3,
            isPhysicianEnabled: true,
          },
          footerValidationChecks: {
            playersSelected: false,
            captainAssigned: false,
            lineupDone: true,
            subsSelected: false,
            staffSelected: false,
            physicianSelected: false,
          },
        },
      });

      expect(
        screen.queryByText('Share with officials')
      ).not.toBeInTheDocument();
      window.featureFlags = { 'pitch-view-autosave': false };
    });
  });
});
