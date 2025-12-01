import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import sinon from 'sinon';
import i18n from '@kitman/common/src/utils/i18n';
import { I18nextProvider } from 'react-i18next';
import AppContainer from '../App';
import AppComponent from '../../components/App';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('App Container', () => {
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
    },
    participants: [],
  };

  const appStatus = {
    status: 'success',
  };

  beforeEach(() => {
    store = storeFake({ staticData, participantForm, appStatus });
    store.dispatch = dispatchSpy;

    wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AppContainer />
        </Provider>
      </I18nextProvider>
    );

    Component = wrapper.find(AppComponent);
  });

  afterEach(() => {
    dispatchSpy.resetHistory();
  });

  it('sets props correctly', () => {
    expect(Component.props().event).to.deep.eq(participantForm.event);
    expect(Component.props().appStatus).to.deep.eq(appStatus);
  });

  it('dispatches the correct action when onClickHideAppStatus is called', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    Component.props().onClickHideAppStatus();

    expect(dispatchSpy.calledWith(expectedAction)).to.equal(true);
  });
});
