import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import i18n from '@kitman/common/src/utils/i18n';
import App from '../App';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('manageUsers <App /> Container', () => {
  let Container;
  let store;
  let wrapper;
  const dispatchSpy = sinon.spy();

  const ownProps = {
    languages: [
      {
        id: 'en',
        title: 'English',
      },
      {
        id: 'de',
        title: 'German',
      },
    ],
  };

  beforeEach(() => {
    store = storeFake({
      manageUsers: {
        currentUser: {
          athlete_id: null,
          created: '2017-08-18T09:35:14.000+01:00',
          created_by: 17709,
          email: 'jon.doe@test.com',
          firstname: 'Jon',
          group_id: 1,
          id: 1234,
          is_active: true,
          is_admin: false,
          kitman_super_admin: false,
          lastname: 'Doe',
          locale: 'en',
          mobile_number: {
            country: null,
            national_number: null,
          },
          mobile_number_verified: null,
          permission_group_id: 1,
          squad_id: null,
          timezone: null,
          updated: '2020-11-25T13:41:11.000+00:00',
          user_role_id: null,
          username: 'jondoe',
        },
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: '',
      },
      manageUserProfileImage: {
        status: 'IDLE',
        imageUploadModalOpen: false,
        toasts: [],
      },
      appStatus: {
        message: null,
        status: null,
      },
    });
    store.dispatch = dispatchSpy;

    wrapper = mount(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App {...ownProps} />
        </I18nextProvider>
      </Provider>
    );

    Container = wrapper.find(App);
  });

  it('renders', () => {
    expect(Container).to.have.length(1);
  });
});
