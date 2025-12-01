import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import Header from '../components/Header';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<Header/>', () => {
  const i18nT = i18nextTranslateStub();

  const store = storeFake({});

  const props = {
    t: i18nT,
  };

  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('renders the header', () => {
    it('renders the header', () => {
      render(
        <Provider store={store}>
          <Header {...props} />
        </Provider>
      );
      expect(screen.getByText('Create Official')).toBeInTheDocument();
    });
  });
});
