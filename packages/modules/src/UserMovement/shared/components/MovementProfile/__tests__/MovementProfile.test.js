import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  getId,
  getUserProfile,
  getProfileResult,
} from '../../../redux/selectors/movementProfileSelectors';

import { REDUCER_KEY as movementProfileState } from '../../../redux/slices/movementProfileSlice';

import {
  mockUserResult,
  mockUserWithOrgsResult,
} from '../../../utils/test_utils';

import MovementProfile from '..';

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementProfile {...props} />
    </Provider>
  );
};

const mockLocalState = () => {
  return {
    [movementProfileState]: {
      id: 1,
    },

    'UserMovement.services': {
      useSearchMovementOrganisationsListQuery: jest.fn(),
    },
  };
};

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getId: jest.fn(),
  getProfileResult: jest.fn(),
  getUserProfile: jest.fn(),
}));

const mockSelectors = (res = mockUserResult) => {
  getId.mockReturnValue(1);
  getProfileResult.mockReturnValue(res);
  getUserProfile.mockReturnValue(() => res.data);
};

let localStore;

describe('<MovementProfile/>', () => {
  beforeEach(() => {
    localStore = storeFake(mockLocalState());
  });

  it('renders the profile when passed', () => {
    mockSelectors();
    renderWithProviders(localStore);
    expect(screen.getByText(/Freddy Adu/i)).toBeInTheDocument();
    expect(screen.getByText(/96417/i)).toBeInTheDocument();
    expect(screen.getByText(/mail@mail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/KL Galaxy/i)).toBeInTheDocument();
    expect(screen.getByText(/2 June 1989/i)).toBeInTheDocument();
  });

  it('renders multi organisations when the user is in multiple', () => {
    mockSelectors(mockUserWithOrgsResult);
    renderWithProviders(localStore);

    expect(screen.getByText(/KL Galaxy/i)).toBeInTheDocument();
    expect(screen.getByText(/Kinter Miami/i)).toBeInTheDocument();
    expect(screen.getByText(/KL Quakes/i)).toBeInTheDocument();
    expect(screen.getByText(/KL Revolution/i)).toBeInTheDocument();
  });

  it('renders no organisatiion when exclude_org is true', () => {
    mockSelectors();
    render(
      <Provider store={localStore}>
        <MovementProfile {...props} exclude_org />
      </Provider>
    );
    expect(screen.queryByText(/KL Galaxy/i)).not.toBeInTheDocument();
  });
});
