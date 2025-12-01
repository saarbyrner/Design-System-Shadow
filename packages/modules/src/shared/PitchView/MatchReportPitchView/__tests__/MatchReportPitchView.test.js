import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';

import i18n from '@kitman/common/src/utils/i18n';
import {
  eventTypes,
  pitchViewFormats,
} from '@kitman/common/src/consts/gameEventConsts';
import { mockOrderedPlayerData } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/__tests__/mockTestSquadData';
import { defaultTeamPitchInfo } from '@kitman/modules/src/shared/MatchReport/src/consts/matchReportConsts';

import MatchReportPitchView from '..';

describe('MatchReportPitchView', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockField = {
    id: 1,
    width: 100,
    height: 100,
    cellSize: 50,
    columns: 11,
    rows: 11,
  };

  const selectedFormation = {
    id: 1,
    name: '5-3-2',
    number_of_players: 11,
  };

  const defaultFormationCoordinates = {
    '1_1': {
      id: 1,
      x: 1,
      y: 1,
      order: 1,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        id: 1,
        abbreviation: 'GK',
      },
    },
    '2_1': {
      id: 2,
      x: 2,
      y: 1,
      order: 2,
      position_id: 1,
      field_id: 1,
      formation_id: 1,
      position: {
        position: 2,
        abbreviation: 'CB',
      },
    },
  };

  const period = {
    id: 1,
    duration: 50,
    absolute_duration_start: 0,
    absolute_duration_end: 50,
    name: 'Period 1',
  };

  const gameActivities = [
    {
      absolute_minute: 0,
      relation: { id: 1, number_of_players: 11 },
      kind: eventTypes.formation_change,
    },
  ];

  const playerGameActivities = [
    ...gameActivities,
    {
      absolute_minute: 0,
      athlete_id: 1,
      kind: eventTypes.formation_position_view_change,
      relation: { id: 1 },
    },
  ];

  const defaultProps = {
    sport: 'soccer',
    pitchFormat: pitchViewFormats.matchReport,
    selectedTeamType: 'home',
    selectedSquadOrganisationId: 1,
    handleUpdateScoreline: jest.fn(),
  };

  const defaultStore = {
    planningEvent: {
      gameActivities: { localGameActivities: playerGameActivities },
      eventPeriods: {
        apiEventPeriods: [period],
      },
      pitchView: {
        teams: {
          home: {
            ...defaultTeamPitchInfo.home,
            players: [mockOrderedPlayerData[0], mockOrderedPlayerData[1]],
            listPlayers: [mockOrderedPlayerData[0], mockOrderedPlayerData[1]],
            formationCoordinates: defaultFormationCoordinates,
            formation: selectedFormation,
          },
          away: {
            ...defaultTeamPitchInfo.away,
            players: [mockOrderedPlayerData[2]],
            listPlayers: [mockOrderedPlayerData[2]],
            formationCoordinates: defaultFormationCoordinates,
            formation: selectedFormation,
          },
        },
        activeEventSelection: '',
        pitchActivities: [],
        field: mockField,
        selectedPitchPlayer: null,
      },
    },
  };

  const renderTestComponent = ({
    props = defaultProps,
    store = defaultStore,
  }) =>
    render(
      <Provider store={storeFake(store)}>
        <I18nextProvider i18n={i18n}>
          <DndContext>
            <MatchReportPitchView {...props} />
          </DndContext>
        </I18nextProvider>
      </Provider>
    );

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Match Report Pitch View Render', () => {
    it('renders only the appropriate pitch info needed for the match report', () => {
      renderTestComponent({
        props: defaultProps,
      });
      expect(screen.getByTestId('Pitch')).toBeInTheDocument();
      expect(screen.getByText('Substitutions')).toBeInTheDocument();
      expect(screen.queryByText('Event List')).not.toBeInTheDocument();
    });

    it('renders the appropriate player in the starting lineup', () => {
      renderTestComponent({
        props: defaultProps,
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          ...defaultStore.planningEvent.pitchView.teams,
          home: {
            ...defaultStore.planningEvent.pitchView.teams.home,
            inFieldPlayers: {
              '1_1': mockOrderedPlayerData[0],
            },
            players: [mockOrderedPlayerData[1]],
            positions: [],
            staff: [],
          },
        },
        type: 'pitchView/setTeams',
      });
    });

    it('clears any selectedPitchPlayer stored on initial render', () => {
      renderTestComponent({
        props: defaultProps,
        store: {
          planningEvent: {
            ...defaultStore.planningEvent,
            pitchView: {
              ...defaultStore.planningEvent.pitchView,
              selectedPitchPlayer: { name: 'Frank Reynolds' },
            },
          },
        },
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: null,
        type: 'pitchView/setSelectedPitchPlayer',
      });
    });
  });
});
