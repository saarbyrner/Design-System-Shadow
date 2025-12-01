import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import LayoutGroupElementAccordionSummary from '../LayoutGroupElementAccordionSummary';
import { getDeleteLayoutGroupModalText } from '../../utils/helpers';

describe('<LayoutGroupElementAccordionSummary />', () => {
  const props = {
    isAccordionExpanded: true,
    setIsAccordionExpanded: jest.fn(),
    onClickAccordionSummary: jest.fn(),
    elementId: 'elementId',
    isCurrentMenuItem: true,
    numberOfQuestions: 1,
    name: 'Group',
    menuGroupIndex: 0,
    menuItemIndex: 1,
    groupIndex: 0,
    isConditional: false,
  };

  const expandIconTestId = 'ExpandMoreIcon';
  const linkIconTestId = 'LinkIcon';

  const renderComponent = (propsOverride) => {
    const { mockedStore } = renderWithRedux(
      <LayoutGroupElementAccordionSummary
        {...{ ...props, ...propsOverride }}
      />,
      {
        useGlobalStore: false,
        preloadedState: { [REDUCER_KEY]: initialState },
      }
    );
    return mockedStore;
  };
  it('should render the component properly - 1 child question', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('1 question')).toBeInTheDocument();
    expect(screen.queryByTestId(linkIconTestId)).not.toBeInTheDocument();

    await user.click(screen.getByText(props.name));

    expect(props.setIsAccordionExpanded).not.toHaveBeenCalled();

    expect(mockedStore.dispatch).not.toHaveBeenCalled();
    expect(screen.queryByTestId(linkIconTestId)).not.toBeInTheDocument();
  });

  it('should render the component properly - 1 child question conditional group', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({ isConditional: true });

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('1 question')).toBeInTheDocument();
    expect(screen.queryByTestId(linkIconTestId)).toBeInTheDocument();

    await user.click(screen.getByText(props.name));

    expect(props.setIsAccordionExpanded).not.toHaveBeenCalled();

    expect(mockedStore.dispatch).not.toHaveBeenCalled();
    expect(screen.queryByTestId(linkIconTestId)).toBeInTheDocument();
  });

  it('calls onClickAccordionSummary when clicking accordion', async () => {
    const user = userEvent.setup();
    renderComponent();

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

  it('should delete layout group element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    await user.click(screen.getByTestId('MoreVertIcon'));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    const translations = getDeleteLayoutGroupModalText();
    expect(
      screen.getByRole('heading', { name: translations.title })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        menuGroupIndex: props.menuGroupIndex,
        menuItemIndex: props.menuItemIndex,
        groupIndex: props.groupIndex,
      },
      type: `${REDUCER_KEY}/deleteLayoutGroup`,
    });
  });
});
