import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  createQuestion,
  createConditionalQuestion,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import MenuItem from '../index';

describe('<MenuItem />', () => {
  const props = {
    name: 'Charmander',
    elementId: 'char-char',
    menuItemIndex: 1,
    menuGroupIndex: 2,
    questions: [
      createQuestion(),
      createQuestion(),
      createConditionalQuestion(),
    ],
    isLastMenuItem: false,
  };

  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<MenuItem {...props} />, {
      useGlobalStore: false,
      preloadedState: { [REDUCER_KEY]: initialState },
    });

    return mockedStore;
  };

  const expandIconTestId = 'ExpandMoreIcon';
  const linkIconTestId = 'LinkIcon';

  it('should render the menu item properly', () => {
    renderComponent();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    // This could change in the future
    expect(screen.getAllByText('Question').length).toBe(props.questions.length);
  });

  it('should set the menu item as the current one when a question is being clicked upon', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    await user.click(screen.getByTestId(expandIconTestId));

    await user.click(screen.getAllByText('Question')[0]);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: props.menuGroupIndex,
      type: `${REDUCER_KEY}/setCurrentMenuGroupIndex`,
    });

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: props.menuItemIndex,
      type: `${REDUCER_KEY}/setCurrentMenuItemIndex`,
    });
  });

  it('should show one conditional icon', () => {
    renderComponent();

    expect(screen.getByTestId(linkIconTestId)).toBeInTheDocument();
  });
});
