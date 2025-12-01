import { screen } from '@testing-library/react';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { createMenuItem } from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import MenuGroup from '../index';

describe('<MenuGroup />', () => {
  const props = {
    name: 'Bulbasaur',
    elementId: 'bulba-bulba',
    menuGroupIndex: 0,
    menuItems: [
      createMenuItem({ menuGroupIndex: 0, menuItemIndex: 0 }),
      createMenuItem({ menuGroupIndex: 0, menuItemIndex: 1 }),
    ],
  };

  const renderComponent = () => {
    renderWithRedux(<MenuGroup {...props} />, {
      useGlobalStore: false,
      preloadedState: { [REDUCER_KEY]: initialState },
    });
  };

  it('should render the menu group properly', () => {
    renderComponent();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText('Sub-section 1.1')).toBeInTheDocument();
    expect(screen.getByText('Sub-section 1.2')).toBeInTheDocument();
  });
});
