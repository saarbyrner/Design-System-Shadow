import { I18nextProvider } from 'react-i18next';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import Header from '../Header';
import { getHeaderTranslations } from '../utils/helpers';

describe('<Header />', () => {
  const translations = getHeaderTranslations();

  const renderComponent = (customState = initialState) => {
    const { mockedStore } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>,
      {
        useGlobalStore: false,
        preloadedState: { [REDUCER_KEY]: customState },
      }
    );
    return mockedStore;
  };

  const buttonAriaLabel = 'options-button';

  it('should render the header properly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { level: 6, name: translations.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: buttonAriaLabel })
    ).toBeInTheDocument();
  });

  it('should enable adding menu groups and menu items', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    await user.click(screen.getByRole('button', { name: buttonAriaLabel }));

    await user.click(
      screen.getByRole('menuitem', { name: translations.menuGroup })
    );
    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: `${REDUCER_KEY}/addMenuGroup`,
    });
    expect(
      screen.queryByRole('menuitem', { name: translations.menuGroup })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: translations.menuItem })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: buttonAriaLabel }));
    await user.click(
      screen.getByRole('menuitem', { name: translations.menuItem })
    );
    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: `${REDUCER_KEY}/addMenuItemToCurrentMenuGroup`,
    });
    expect(
      screen.queryByRole('menuitem', { name: translations.menuGroup })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: translations.menuItem })
    ).not.toBeInTheDocument();
  });

  it('should dispatch setShowFormHeaderModal when clicking Form Header option inside Add menu', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    await user.click(screen.getByRole('button', { name: buttonAriaLabel }));

    await user.click(
      screen.getByRole('menuitem', { name: translations.formHeader })
    );

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: `${REDUCER_KEY}/setShowFormHeaderModal`,
    });
    expect(
      screen.queryByRole('menuitem', { name: translations.menuGroup })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: translations.menuItem })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: translations.formHeader })
    ).not.toBeInTheDocument();
  });

  it('should render add form header option as disabled when branding header config is not null', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...initialState,
      structure: {
        ...initialState.structure,
        config: { header: { enabled: true } },
      },
    });

    await user.click(screen.getByRole('button', { name: buttonAriaLabel }));

    expect(
      screen.getByRole('menuitem', { name: translations.formHeader })
    ).toHaveAttribute('aria-disabled', 'true');
  });
});
