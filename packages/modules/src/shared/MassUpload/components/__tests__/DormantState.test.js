import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import DormantState from '../DormantState';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({});

const mockCSV = new File(['mock-csv'], 'mock-csv.csv', {
  type: 'document/csv',
});

describe('<DormantState/>', () => {
  const defaultProps = {
    queueState: mockCSV,
    onParseCSV: jest.fn(),
    onRemoveCSV: jest.fn(),
    setHasFilePondErrored: jest.fn(),
    setHasFilePondProcessed: jest.fn(),
  };

  it('renders', () => {
    render(
      <Provider store={store}>
        <DormantState {...defaultProps} />
      </Provider>
    );
    expect(
      screen.getByTestId('RegistrationForm|FormDocumentUploader')
    ).toBeInTheDocument();
  });
});
