import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';

import GridSearch from '../index';

const props = {
  requestStatus: { isFetching: false, isError: false, isLoading: false },
  value: '',
  onUpdate: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('<GridSearch/>', () => {
  it('renders', async () => {
    render(<GridSearch {...props} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('correctly calls the onUpdate', async () => {
    render(<GridSearch {...props} />);
    await userEvent.type(screen.getByRole('textbox'), `s`);
    expect(props.onUpdate).toHaveBeenCalledWith('s');
  });

  test.each(['isError', 'isFetching', 'isLoading'])(
    'is disabled when requestStatus.$status',
    (status) => {
      const requestStatus = {
        ...props.requestStatus,
        [status]: true,
      };

      render(<GridSearch {...props} requestStatus={requestStatus} />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    }
  );
});
