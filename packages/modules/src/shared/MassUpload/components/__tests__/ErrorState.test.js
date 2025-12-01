import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import ErrorState from '../ErrorState';
import { USER_TYPES_WITH_ONLY_MISSING_COLUMNS_WHEN_ERROR } from '../../utils/consts';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  massUploadSlice: {
    isOpen: false,
  },
});

const props = {
  expectedFields: ['A', 'B', 'C'],
  providedFields: ['D', 'E', 'F'],
};

const propsWithAdditionalColumns = {
  expectedFields: ['A', 'B', 'C'],
  providedFields: ['A', 'B', 'C', 'D'],
};

describe('<ErrorState/>', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <ErrorState {...props} />
      </Provider>
    );

    expect(
      screen.getByText('You have an error in your provided CSV file')
    ).toBeInTheDocument();
    expect(screen.getByText('Expected columns: A, B, C')).toBeInTheDocument();
    expect(screen.getByText('Provided columns: D, E, F')).toBeInTheDocument();
  });

  it(
    'shows ‘Required columns’ instead of ‘Expected columns’ if' +
      ' ‘mustCheckExpectedHeadersOnly’ prop is passed',
    () => {
      render(
        <Provider store={store}>
          <ErrorState {...props} mustCheckExpectedHeadersOnly />
        </Provider>
      );

      expect(screen.getByText('Required columns: A, B, C')).toBeInTheDocument();
      expect(screen.queryByText(/expected/i)).not.toBeInTheDocument();
    }
  );

  it('renders with additional columns if user type is growth_and_maturation or baselines AND additional columns are provided', () => {
    render(
      <Provider store={store}>
        <ErrorState
          {...propsWithAdditionalColumns}
          userType="growth_and_maturation"
        />
      </Provider>
    );

    expect(
      screen.getByText('You have an error in your provided CSV file')
    ).toBeInTheDocument();
    expect(screen.getByText('Expected columns: A, B, C')).toBeInTheDocument();
    expect(
      screen.getByText('Please remove additional column(s): D', {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it.each(USER_TYPES_WITH_ONLY_MISSING_COLUMNS_WHEN_ERROR)(
    'renders with missing columns if userType is %s',
    (type) => {
      render(
        <Provider store={store}>
          <ErrorState {...props} userType={type} />
        </Provider>
      );

      expect(
        screen.getByText('You have an error in your provided CSV file')
      ).toBeInTheDocument();
      expect(screen.getByText('Expected columns: A, B, C')).toBeInTheDocument();
      expect(
        screen.getByText('Missing column(s): A, B, C', { exact: false })
      ).toBeInTheDocument();
    }
  );
});
