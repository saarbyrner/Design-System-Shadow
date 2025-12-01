import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import sinon from 'sinon';
import i18n from '@kitman/common/src/utils/i18n';
import { I18nextProvider } from 'react-i18next';
import ParticipantFormContainer from '../ParticipantForm';
import ParticipantFormComponent from '../../components/ParticipantForm';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('ParticipantForm Container', () => {
  let Component;
  let store;
  let wrapper;
  const dispatchSpy = sinon.spy();

  const staticData = {
    availableSquads: [
      {
        id: 1,
        name: 'Squad 1',
        position_groups: [],
      },
    ],
    primarySquads: [
      {
        id: 1,
        name: 'Squad 1',
      },
    ],
    participationLevels: [
      {
        id: 1,
        name: 'Full',
        canonical_participation_level: 'full',
      },
    ],
  };

  const participantForm = {
    event: {
      type: 'GAME',
      id: '123',
      name: 'Carlow 1 - 2 Dublin',
      rpe_collection_athlete: false,
      duration: 50,
    },
    participants: [
      {
        athlete_id: 1,
        athlete_fullname: 'John Doe',
        rpe: 5,
        duration: 30,
        squads: [73, 8, 262],
      },
    ],
  };

  beforeEach(() => {
    store = storeFake({ staticData, participantForm });
    store.dispatch = dispatchSpy;

    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ParticipantFormContainer />
        </Provider>
      </I18nextProvider>
    );

    Component = wrapper.find(ParticipantFormComponent);
  });

  afterEach(() => {
    dispatchSpy.resetHistory();
  });

  it('sets props correctly', () => {
    expect(Component.props().eventType).to.deep.eq('GAME');

    expect(Component.props().availableSquads).to.deep.eq(
      staticData.availableSquads
    );

    expect(Component.props().participants).to.deep.eq(
      participantForm.participants
    );
  });

  describe('when the session is a GAME', () => {
    it('shows the squad tab', () => {
      const ParticipantForm = mount(
        <I18nextProvider i18n={i18n}>
          <Provider
            store={storeFake({
              participantForm: {
                ...participantForm,
                event: {
                  ...store.event,
                  type: 'GAME',
                },
              },
              staticData,
            })}
          >
            <ParticipantFormContainer />
          </Provider>
        </I18nextProvider>
      ).find(ParticipantFormComponent);

      expect(ParticipantForm.props().showSquadTab).to.eq(true);
    });
  });

  describe('when the session is a TRAINING_SESSION', () => {
    it('hides the squad tab', () => {
      const ParticipantForm = mount(
        <I18nextProvider i18n={i18n}>
          <Provider
            store={storeFake({
              participantForm: {
                ...participantForm,
                event: {
                  ...store.event,
                  type: 'TRAINING_SESSION',
                },
              },
              staticData,
            })}
          >
            <ParticipantFormContainer />
          </Provider>
        </I18nextProvider>
      ).find(ParticipantFormComponent);

      expect(ParticipantForm.props().showSquadTab).to.eq(false);
    });
  });

  it('dispatches the correct action when onDurationChange is called', () => {
    const expectedAction = {
      type: 'UPDATE_DURATION',
      payload: {
        athleteId: 1,
        duration: 12,
      },
    };

    Component.props().onDurationChange(1, 12);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onRpeChange is called', () => {
    const expectedAction = {
      type: 'UPDATE_RPE',
      payload: {
        athleteId: 1,
        rpe: 9,
      },
    };

    Component.props().onRpeChange(1, 9);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onChangeAllDurations is called', () => {
    const expectedAction = {
      type: 'UPDATE_ALL_DURATIONS',
      payload: {
        filteredAthletes: [1],
        duration: true,
        participationLevels: staticData.participationLevels,
      },
    };

    Component.props().onChangeAllDurations([1], true);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onClickCancel is called', () => {
    const expectedAction = {
      type: 'SHOW_CANCEL_CONFIRM',
    };

    Component.props().onClickCancel();

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onParticipationLevelChange is called', () => {
    const expectedAction = {
      type: 'UPDATE_PARTICIPATION_LEVEL',
      payload: {
        athleteId: 1,
        participationLevel: 5,
        eventDuration: 50,
        isAthletePrimarySquadSelected: true,
      },
    };

    Component.props().onParticipationLevelChange(1, 5, true);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onChangeAllParticipationLevels is called', () => {
    const expectedAction = {
      type: 'UPDATE_ALL_PARTICIPATION_LEVELS',
      payload: {
        filteredAthletes: [1],
        participationLevel: 2,
        eventDuration: 50,
        selectedSquadId: 1,
      },
    };

    Component.props().onChangeAllParticipationLevels([1], 2, 1);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onToggleIncludeInGroupCalculations is called', () => {
    const expectedAction = {
      type: 'TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS',
      payload: {
        athleteId: 1,
      },
    };

    Component.props().onToggleIncludeInGroupCalculations(1);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onToggleAllIncludeInGroupCalculations is called', () => {
    const expectedAction = {
      type: 'TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION',
      payload: {
        filteredAthletes: [1],
        includeInGroupCalculations: true,
        participationLevels: staticData.participationLevels,
      },
    };

    Component.props().onToggleAllIncludeInGroupCalculations([1], true);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });
});
