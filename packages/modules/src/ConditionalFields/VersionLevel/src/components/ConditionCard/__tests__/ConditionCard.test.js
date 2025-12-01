import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ConditionCard from '..';
import { MOCK_CONDITIONS } from '../../../../../shared/utils/test_utils.mock';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  conditionBuildViewSlice: {
    activeCondition: MOCK_CONDITIONS[0],
  },
});

describe('<ConditionCard />', () => {
  const props = {
    condition: MOCK_CONDITIONS[0],
    index: 0,
    t: i18nextTranslateStub(),
    isPublished: false,
  };


  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays condition order and name when expected', () => {
    render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} />
      </Provider>
    );
    expect(screen.getByText(`Rule ${props.index + 1}`)).toBeInTheDocument();
    expect(screen.getByText(props.condition.name)).toBeInTheDocument();
  });

  it('renders activeConditionCard class when indices match', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} />
      </Provider>
    );
    expect(container.firstChild).toHaveClass(
      'css-p2kbeq-conditionCard-activeConditionCard-ConditionCardComponent'
    );
  });
  it('renders conditionCard class when indices DO NOT match', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} index={12} />
      </Provider>
    );
    expect(container.firstChild).toHaveClass(
      'css-1539k9r-conditionCard-notActiveConditionCard-ConditionCardComponent'
    );
  });
  it('renders delete icon if condition name is present', () => {
    render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} index={12} />
      </Provider>
    );
    expect(screen.getByTestId('DeleteOutlineIcon')).toBeInTheDocument();
  });
  it('opens the dialog when delete icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} index={12} />
      </Provider>
    );

    await user.click(screen.getByTestId('DeleteOutlineIcon'));

    expect(screen.getByText('Delete Rule')).toBeInTheDocument();
  });

  it('closes the dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} index={12} />
      </Provider>
    );
    await user.click(screen.getByTestId('DeleteOutlineIcon'));
    await user.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Delete Rule')).not.toBeInTheDocument();
    });
  });

  it('does not render the delete icon if condition is published', () => {
    render(
      <Provider store={defaultStore}>
        <ConditionCard {...props} index={12} isPublished />
      </Provider>
    );
    expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument();
  });
});
