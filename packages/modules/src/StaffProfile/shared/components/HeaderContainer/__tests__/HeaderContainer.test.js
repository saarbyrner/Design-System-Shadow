import { screen } from '@testing-library/react';
import { capitalize } from 'lodash';
import userEvent from '@testing-library/user-event';

import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { HeaderContainerTranslated as HeaderContainer } from '@kitman/modules/src/StaffProfile/shared/components/HeaderContainer';
import { setI18n } from 'react-i18next';

import {
  useGetCurrentUserQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';

import { getButtonTranslations, getModalTranslations } from '../utils/helpers';

setI18n(i18n);

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
}));

const activeUser = {
  id: 1,
  fullname: 'John Smith',
  is_active: true,
};

const currentUser = {
  id: 2,
};

const createStore = ({ mode, user = activeUser }) => {
  return {
    formStateSlice: {
      ...initialFormState,
      config: {
        mode,
      },
      structure: {
        user,
      },
    },
    formValidationSlice: {
      validation: {},
    },
  };
};

describe('HeaderContainer', () => {
  const permissions = { settings: { canManageStaffUsers: true } };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({ data: permissions });
    useGetCurrentUserQuery.mockReturnValue({ data: currentUser });
  });

  const i18nT = i18nextTranslateStub();

  const props = {
    user: activeUser,
    t: i18nT,
  };

  const fallbackProps = {
    t: i18nT,
  };

  const renderComponent = ({ store, customProps = props }) =>
    renderWithProvider(<HeaderContainer {...customProps} />, storeFake(store));

  it('renders create mode', () => {
    renderComponent({ store: createStore({ mode: MODES.CREATE }) });
    expect(screen.getByText('Create staff')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
  });

  it('renders view mode', () => {
    renderComponent({ store: createStore({ mode: MODES.VIEW }) });

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
  });

  it('renders view mode - fall back', () => {
    renderComponent({
      store: createStore({ mode: MODES.VIEW }),
      customProps: fallbackProps,
    });

    expect(screen.getByText('View staff')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
  });

  it('renders edit mode', () => {
    renderComponent({ store: createStore({ mode: MODES.EDIT }) });

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
  });

  it('renders edit mode - fall back', () => {
    renderComponent({
      store: createStore({ mode: MODES.EDIT }),
      customProps: fallbackProps,
    });

    expect(screen.getByText('Edit staff')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIosIcon')).toBeInTheDocument();
  });

  describe('de/activation  logic', () => {
    const buttonTexts = getButtonTranslations(i18nT);
    const modalTexts = getModalTranslations(i18nT);
    const inactiveUser = { ...activeUser, is_active: false };

    it("should render 'Deactivate User' for an active user and the modal", async () => {
      const user = userEvent.setup();
      renderComponent({
        store: createStore({ mode: MODES.VIEW }),
      });

      const button = screen.getByRole('button', {
        name: buttonTexts.deactivateUser,
      });

      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();

      await user.click(button);

      expect(
        screen.getByRole('button', { name: capitalize(modalTexts.deactivate) })
      ).toBeInTheDocument();
    });

    it("should render 'Activate User' for an inactive user and the modal", async () => {
      const user = userEvent.setup();

      renderComponent({
        store: createStore({ mode: MODES.VIEW, user: inactiveUser }),
        customProps: { ...props, user: inactiveUser },
      });

      const button = screen.getByRole('button', {
        name: buttonTexts.activateUser,
      });

      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();

      await user.click(button);

      expect(
        screen.getByRole('button', { name: capitalize(modalTexts.activate) })
      ).toBeInTheDocument();
    });

    it('should render the button disabled because the user does not have the permissions', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: { settings: { canManageStaffUsers: false } },
      });

      renderComponent({
        store: createStore({ mode: MODES.VIEW }),
      });

      expect(
        screen.getByRole('button', {
          name: buttonTexts.deactivateUser,
        })
      ).toBeDisabled();
    });

    it("should render the button disabled because the current user is identical to the page's user", () => {
      useGetCurrentUserQuery.mockReturnValue({ data: activeUser });

      renderComponent({
        store: createStore({ mode: MODES.VIEW }),
      });

      expect(
        screen.getByRole('button', { name: buttonTexts.deactivateUser })
      ).toBeDisabled();
    });
  });
});
