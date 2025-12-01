import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import Ruleset from '../Ruleset';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({});

const props = {
  ruleset: {
    GenericKey: {
      description: 'Such description',
      exampleText: 'Very example',
      exampleList: ['So list', 'Much example'],
    },
  },
};

describe('<Ruleset/>', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <Ruleset {...props} />
      </Provider>
    );
    expect(screen.getByText('GenericKey')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Such description')).toBeInTheDocument();
    expect(screen.getByText('Example:')).toBeInTheDocument();
    expect(screen.getByText('Very example')).toBeInTheDocument();
    expect(screen.getByText('Accepted values:')).toBeInTheDocument();
    expect(screen.getByText('So list')).toBeInTheDocument();
    expect(screen.getByText('Much example')).toBeInTheDocument();
  });

  it('should render with React nodes as props', () => {
    const ruleset = <h1>Test header</h1>;

    render(
      <Provider store={store}>
        <Ruleset ruleset={ruleset} />
      </Provider>
    );
    expect(screen.getByText('Test header')).toBeInTheDocument();
  });
});
