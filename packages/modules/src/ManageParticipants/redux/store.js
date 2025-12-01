/* eslint-disable flowtype/require-valid-file-annotation */

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import rootReducer from './reducers';

const composeEnhancers = setupReduxDevTools(compose);

export default (manageParticipantsData) =>
  createStore(
    rootReducer,
    {
      staticData: {
        availableSquads: manageParticipantsData.squads_position_groups.sort(
          (squadA, squadB) => {
            // The first squad should be the current squad
            if (squadA.id === manageParticipantsData.currentSquadId) {
              return -1;
            }
            if (squadB.id === manageParticipantsData.currentSquadId) {
              return 1;
            }

            // Then they should be ordered alphabetically
            return squadA.name.toUpperCase() < squadB.name.toUpperCase()
              ? -1
              : 1;
          }
        ),
        participationLevels: manageParticipantsData.participation_levels,
        primarySquads: manageParticipantsData.primary_squads,
      },
      participantForm: {
        event: manageParticipantsData.event,
        participants: manageParticipantsData.participants,
      },
      appStatus: {
        status: null,
      },
    },
    composeEnhancers(applyMiddleware(...[thunkMiddleware]))
  );
