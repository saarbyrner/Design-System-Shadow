import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';
import useCreateRegistration from '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateRegistration';

import ButtonSubmit from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateRegistration'
);

setI18n(i18n);

const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

const mockedUseCreateRegistration = useCreateRegistration;
const mockedUseRegistrationOperations = useRegistrationOperations;
const handleOnCreateRegistration = jest.fn();

const setup = ({ permissions = false, isDisabled = false }) => {
  mockedUseCreateRegistration.mockReturnValue({
    handleOnCreateRegistration,
    isDisabled: !!isDisabled,
  });
  mockedUseRegistrationOperations.mockReturnValue({
    registration: {
      athlete: {
        canCreate: !!permissions,
      },
      staff: {
        canCreate: !!permissions,
      },
    },
  });
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => state,
  });
  render(
    <Provider store={storeFake({})}>
      <ButtonSubmit {...props} />
    </Provider>
  );
};

describe('<ButtonSubmit/>', () => {
  describe('[PERMISSIONS]', () => {
    it('renders when canCreate is true', () => {
      setup({ permissions: true });

      expect(
        screen.getByRole('button', { name: 'Submit' })
      ).toBeInTheDocument();
    });
    it('does not render when canCreate is false', () => {
      setup({});
      expect(() => screen.getByRole('button', { name: 'Submit' })).toThrow();
    });
  });

  describe('[HOOK]: useCreateRegistration', () => {
    it('is disabled when isDisabled is true', () => {
      setup({ isDisabled: true, permissions: true });

      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
    it('is not disabled when isDisabled is false', () => {
      setup({ isDisabled: false, permissions: true });

      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    it('calls handleOnCreateRegistration when clicked', async () => {
      const user = userEvent.setup();

      setup({ isDisabled: false, permissions: true });

      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
      const button = screen.getByRole('button', { name: /Submit/i });
      await user.click(button);

      expect(handleOnCreateRegistration).toHaveBeenCalled();
    });
  });
});
