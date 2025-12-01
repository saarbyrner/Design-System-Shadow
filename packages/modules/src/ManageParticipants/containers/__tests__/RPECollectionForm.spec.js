import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import sinon from 'sinon';
import i18n from '@kitman/common/src/utils/i18n';
import { I18nextProvider } from 'react-i18next';
import RPECollectionFormContainer from '../RPECollectionForm';
import RPECollectionFormComponent from '../../components/RPECollectionForm';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('RPECollectionForm Container', () => {
  let Component;
  let store;
  let wrapper;
  const dispatchSpy = sinon.spy();

  const staticData = {
    availableSquads: [],
  };

  const participantForm = {
    event: {
      type: 'GAME',
      id: '123',
      name: 'Carlow 1 - 2 Dublin',
    },
    participants: [],
  };

  beforeEach(() => {
    store = storeFake({ staticData, participantForm });
    store.dispatch = dispatchSpy;

    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <RPECollectionFormContainer />
        </Provider>
      </I18nextProvider>
    );

    Component = wrapper.find(RPECollectionFormComponent);
  });

  afterEach(() => {
    dispatchSpy.resetHistory();
  });

  it('sets props correctly', () => {
    expect(Component.props().event).to.deep.eq(participantForm.event);
  });

  it('dispatches the correct action when onRpeCollectionAthleteChange is called', () => {
    const expectedAction = {
      type: 'UPDATE_RPE_COLLECTION_ATHLETE',
      payload: {
        rpeCollectionAthlete: true,
      },
    };

    Component.props().onRpeCollectionAthleteChange(true);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onRpeCollectionKioskChange is called', () => {
    const expectedAction = {
      type: 'UPDATE_RPE_COLLECTION_KIOSK',
      payload: {
        rpeCollectionKiosk: true,
      },
    };

    Component.props().onRpeCollectionKioskChange(true);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });

  it('dispatches the correct action when onMassInputChange is called', () => {
    const expectedAction = {
      type: 'UPDATE_MASS_INPUT',
      payload: {
        massInput: true,
      },
    };

    Component.props().onMassInputChange(true);

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });
});
