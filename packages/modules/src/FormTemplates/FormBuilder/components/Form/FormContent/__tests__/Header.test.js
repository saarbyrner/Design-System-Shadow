import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import Header from '../Header';

describe('<Header />', () => {
  const currentMenuGroupIndex = 0;
  const currentMenuItemIndex = 0;
  const currentMenuGroup =
    initialState.structure.form_elements[0].form_elements[0].form_elements[
      currentMenuGroupIndex
    ];
  const currentMenuItem =
    initialState.structure.form_elements[0].form_elements[0].form_elements[
      currentMenuGroupIndex
    ].form_elements[currentMenuItemIndex];

  const props = {
    currentMenuGroupIndex,
    currentMenuItemIndex,
    currentMenuGroup,
    currentMenuItem,
  };
  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<Header {...props} />, {
      useGlobalStore: false,
      preloadedState: { [REDUCER_KEY]: initialState },
    });
    return mockedStore;
  };

  const editIconName = 'EditIcon';

  it('should display and enable editing of the menu group title', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const initialMenuGroupTitle = `Section ${currentMenuGroupIndex + 1}`;
    const newTitle = 'Pallet Town';
    expect(screen.getByText(initialMenuGroupTitle)).toBeInTheDocument();
    await user.click(screen.getAllByTestId(editIconName)[0]);
    const input = screen.getByDisplayValue(initialMenuGroupTitle);
    await user.clear(input);
    await user.type(input, newTitle);
    await user.click(screen.getAllByRole('button')[0]);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: newTitle,
      type: `${REDUCER_KEY}/setCurrentMenuGroupTitle`,
    });
  });

  it('should display and enable editing of the menu item title', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const initialMenuItemTitle = `Sub-section ${currentMenuGroupIndex + 1}.${
      currentMenuItemIndex + 1
    }`;
    const newTitle = 'Viridian Town';
    expect(screen.getByText(initialMenuItemTitle)).toBeInTheDocument();
    await user.click(screen.getAllByTestId(editIconName)[1]);
    const input = screen.getByDisplayValue(initialMenuItemTitle);
    await user.clear(input);
    await user.type(input, newTitle);
    await user.click(screen.getAllByRole('button')[1]);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: newTitle,
      type: `${REDUCER_KEY}/setCurrentMenuItemTitle`,
    });
  });
});
