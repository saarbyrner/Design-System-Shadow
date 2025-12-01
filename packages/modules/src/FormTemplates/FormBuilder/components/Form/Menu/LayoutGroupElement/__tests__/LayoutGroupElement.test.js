import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { createQuestion } from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import LayoutGroupElement from '../index';

describe('<LayoutGroupElement />', () => {
  const props = {
    name: 'Group',
    elementId: 'char-char',
    menuItemIndex: 1,
    menuGroupIndex: 2,
    groupIndex: 0,
    questions: [createQuestion(), createQuestion()],
    isConditional: false,
  };

  const renderComponent = (componentProps = props) => {
    const { mockedStore } = renderWithRedux(
      <LayoutGroupElement {...componentProps} />,
      {
        useGlobalStore: false,
        preloadedState: { [REDUCER_KEY]: initialState },
      }
    );

    return mockedStore;
  };

  const expandIconTestId = 'ExpandMoreIcon';

  it('should render the layout group element properly', () => {
    renderComponent();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getAllByText('Question').length).toBe(props.questions.length);
    expect(
      screen.queryByTestId(`${KITMAN_ICON_NAMES.Link}Icon`)
    ).not.toBeInTheDocument();
  });

  it('should render the layout group element properly with the contional icon', () => {
    renderComponent({ ...props, isConditional: true });

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getAllByText('Question').length).toBe(props.questions.length);

    const iconReferences = screen.getAllByTestId(
      `${KITMAN_ICON_NAMES.Link}Icon`
    );
    expect(iconReferences).toHaveLength(3);
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
});
