import { render, screen } from '@testing-library/react';

import MetaData from '../MetaData';

describe('<MetaData/>', () => {
  const props = {
    metaData: [
      {
        text: 'Item 1',
        value: 'value 1',
      },
    ],
  };

  test('renders successfully', () => {
    render(<MetaData {...props} />);
    expect(screen.getByTestId('MetaData|Title').innerHTML).toBe('Item 1');
    expect(screen.getByTestId('MetaData|Value').innerHTML).toBe('value 1');
  });
});
