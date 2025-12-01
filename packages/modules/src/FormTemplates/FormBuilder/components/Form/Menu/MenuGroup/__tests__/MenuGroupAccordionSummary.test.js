import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  initialState,
  multiMenuItemState,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import MenuGroupAccordionSummary from '../MenuGroupAccordionSummary';
import { getDeleteMenuGroupModalText } from '../../utils/helpers';

describe('<MenuGroupAccordionSummary />', () => {
  const props = {
    name: 'Magikarp',
    elementId: 'i-am-magikarp',
    numberOfMenuItems: 1,
    menuGroupIndex: 0,
  };

  const renderComponent = (propsOverride, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <MenuGroupAccordionSummary {...{ ...props, ...propsOverride }} />,
      {
        useGlobalStore: false,
        preloadedState: { [REDUCER_KEY]: state },
      }
    );
    return mockedStore;
  };
  it('should render the component properly for one menu item', () => {
    renderComponent();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('1 menu item')).toBeInTheDocument();
  });

  it('should render the component properly for #menu items !== 1 - 0', () => {
    renderComponent({ numberOfMenuItems: 0 });

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('0 menu items')).toBeInTheDocument();
  });

  it('should render the component properly for #menu items !== 1 - 2', () => {
    renderComponent({ numberOfMenuItems: 2 });
    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('2 menu items')).toBeInTheDocument();
  });

  it('should delete menu Group', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent(props, multiMenuItemState);

    await user.click(screen.getByTestId('MoreVertIcon'));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    const translations = getDeleteMenuGroupModalText();
    expect(
      screen.getByRole('heading', { name: translations.title })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: props.menuGroupIndex,
      type: `${REDUCER_KEY}/deleteMenuGroup`,
    });
  });

  it('menu group is disabled because its the last one', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId('MoreVertIcon'));
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass(
      'Mui-disabled'
    );
  });
});
