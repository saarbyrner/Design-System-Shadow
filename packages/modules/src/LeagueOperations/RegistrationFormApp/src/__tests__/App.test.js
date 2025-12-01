import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { REDUCER_KEY as registrationRequirementsSlice } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import { REDUCER_KEY as formStateSlice } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { REDUCER_KEY as formMenuSlice } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { REDUCER_KEY as formValidationSlice } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import RegistrationFormApp from '../App';

jest.mock('@kitman/common/src/hooks/useLocationSearch');

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
  isLoading: false,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = {
  [formStateSlice]: {
    originalForm: {},
    form: {},
    elements: {},
    structure: {},
    config: {
      mode: 'VIEW',
      showMenuIcons: false,
      showUnsavedChangesModal: false,
    },
  },
  [registrationRequirementsSlice]: {
    profile: MOCK_REGISTRATION_PROFILE,
  },
  [formMenuSlice]: {
    menu: {},
    drawer: {
      isOpen: true,
    },
    active: {
      menuGroupIndex: 0,
      menuItemIndex: 0,
    },
  },
  [formValidationSlice]: {},
  globalApi: {},
};

const store = storeFake(defaultStore);

const renderWithProviders = () => {
  render(
    <Provider store={store}>
      <RegistrationFormApp {...props} />
    </Provider>
  );
};

describe('<RegistrationFormApp/>', () => {
  beforeEach(() => {
    renderWithProviders();
    delete window.location;
    window.location = new URL(
      'http://localhost/registration/requirements?requirement_id=14&user_id=161978#details'
    );
    useLocationSearch.mockReturnValue(new URLSearchParams({ id: '115' }));
  });
  it('renders the loading state', () => {
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.SectionTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.FormTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.Menu')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('RegistrationFormLayout.Loading.FormBody')
    ).toBeInTheDocument();
  });
});
