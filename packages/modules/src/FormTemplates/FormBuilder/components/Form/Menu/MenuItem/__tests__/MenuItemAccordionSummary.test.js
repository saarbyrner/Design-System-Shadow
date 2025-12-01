import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  initialState,
  multiMenuItemState,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import MenuItemAccordionSummary from '../MenuItemAccordionSummary';
import { getDeleteMenuItemModalText } from '../../utils/helpers';

describe('<MenuItemAccordionSummary />', () => {
  const props = {
    isAccordionExpanded: true,
    setIsAccordionExpanded: jest.fn(),
    onClickAccordionSummary: jest.fn(),
    elementId: 'odd',
    isCurrentMenuItem: true,
    numberOfQuestions: 1,
    name: 'Oddish',
    menuGroupIndex: 0,
    menuItemIndex: 1,
  };

  const expandIconTestId = 'ExpandMoreIcon';

  const renderComponent = (propsOverride, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <MenuItemAccordionSummary {...{ ...props, ...propsOverride }} />,
      {
        useGlobalStore: false,
        preloadedState: { [REDUCER_KEY]: state },
      }
    );
    return mockedStore;
  };
  it('should render the component properly - the menu item is the current menu item, 1 question', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('1 question')).toBeInTheDocument();

    await user.click(screen.getByText(props.name));

    expect(props.setIsAccordionExpanded).not.toHaveBeenCalled();

    expect(mockedStore.dispatch).not.toHaveBeenCalled();
  });

  it('should render the component properly - the menu item is NOT the current menu item', async () => {
    const user = userEvent.setup();
    renderComponent({ isCurrentMenuItem: false });

    expect(screen.getByText(props.name)).toBeInTheDocument();

    await user.click(screen.getByText(props.name));

    expect(props.onClickAccordionSummary).toHaveBeenCalled();
  });

  it('should close the accordion when clicking on the icon', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId(expandIconTestId));

    expect(props.setIsAccordionExpanded).toHaveBeenCalledWith(false);
  });

  it('should expand the accordion when clicking on the icon', async () => {
    const user = userEvent.setup();
    renderComponent({ isAccordionExpanded: false });

    await user.click(screen.getByTestId(expandIconTestId));

    expect(props.setIsAccordionExpanded).toHaveBeenCalledWith(true);
  });

  it('should render the component properly for #questions !== 1 - 0', () => {
    renderComponent({ numberOfQuestions: 0 });

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('0 questions')).toBeInTheDocument();
  });

  it('should render the component properly for #questions !== 1 - 2', () => {
    renderComponent({ numberOfQuestions: 2 });

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('2 questions')).toBeInTheDocument();
  });

  it('menu item is disabled because its the last one', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId('MoreVertIcon'));
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass(
      'Mui-disabled'
    );
  });

  it('should delete menu item when multiple menu items are present', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent(props, multiMenuItemState);

    await user.click(screen.getByTestId('MoreVertIcon'));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    const translations = getDeleteMenuItemModalText();
    expect(
      screen.getByRole('heading', { name: translations.title })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        menuGroupIndex: props.menuGroupIndex,
        menuItemIndex: props.menuItemIndex,
      },
      type: `${REDUCER_KEY}/deleteMenuItem`,
    });
  });
});
