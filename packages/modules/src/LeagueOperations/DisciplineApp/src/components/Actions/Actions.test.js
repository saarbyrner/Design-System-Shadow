import i18n from 'i18next';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useCreateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateDisciplinaryIssue';
import useUpdateDisciplinaryIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateDisciplinaryIssue';
import {
  REDUCER_KEY as DISCIPLINARY_SLICE,
  initialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { getDisciplinaryIssueMode } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import {
  UPDATE_DISCIPLINARY_ISSUE,
  CREATE_DISCIPLINARY_ISSUE,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import Actions from '.';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useCreateDisciplinaryIssue'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateDisciplinaryIssue'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
);

const props = {
  t: i18nT,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [DISCIPLINARY_SLICE]: initialState,
};

describe('<Actions/>', () => {
  it('renders', () => {
    getDisciplinaryIssueMode.mockReturnValue(CREATE_DISCIPLINARY_ISSUE);
    useCreateDisciplinaryIssue.mockReturnValue({
      isDisabled: true,
      handleOnCancel: () => {},
    });
    useUpdateDisciplinaryIssue.mockReturnValue({
      isDisabled: true,
      handleOnCancel: jest.fn(),
    });
    render(
      <Provider store={storeFake(defaultStore)}>
        <Actions {...props} />
      </Provider>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  describe('isDisabled', () => {
    it('is correctly disabled when it should be', () => {
      getDisciplinaryIssueMode.mockReturnValue(CREATE_DISCIPLINARY_ISSUE);
      useCreateDisciplinaryIssue.mockReturnValue({
        isDisabled: true,
      });
      useUpdateDisciplinaryIssue.mockReturnValue({
        isDisabled: true,
        handleOnCancel: jest.fn(),
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <Actions {...props} />
        </Provider>
      );
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
    it('is correctly enabled when it should be', () => {
      getDisciplinaryIssueMode.mockReturnValue(CREATE_DISCIPLINARY_ISSUE);
      useCreateDisciplinaryIssue.mockReturnValue({
        isDisabled: false,
      });
      useUpdateDisciplinaryIssue.mockReturnValue({
        isDisabled: true,
        handleOnCancel: jest.fn(),
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <Actions {...props} />
        </Provider>
      );
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });

  describe('handleOnCancel', () => {
    it('calls the correct action when clicked', async () => {
      const handleOnCancelMock = jest.fn();
      const user = userEvent.setup();
      getDisciplinaryIssueMode.mockReturnValue(CREATE_DISCIPLINARY_ISSUE);
      useCreateDisciplinaryIssue.mockReturnValue({
        isSubmitStatusDisabled: false,
        handleOnCancel: handleOnCancelMock,
      });
      useUpdateDisciplinaryIssue.mockReturnValue({
        isDisabled: true,
        handleOnCancel: jest.fn(),
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <Actions {...props} />
        </Provider>
      );
      const cancel = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancel);
      expect(handleOnCancelMock).toHaveBeenCalled();
    });
  });

  describe('handleOnCreateDisciplinaryIssue', () => {
    it('calls the correct action when clicked', async () => {
      const handleOnCreateDisciplinaryIssueMock = jest.fn();
      const user = userEvent.setup();
      getDisciplinaryIssueMode.mockReturnValue(CREATE_DISCIPLINARY_ISSUE);
      useUpdateDisciplinaryIssue.mockReturnValue({
        isDisabled: true,
        handleOnCancel: jest.fn(),
      });

      useCreateDisciplinaryIssue.mockReturnValue({
        isSubmitStatusDisabled: false,
        handleOnCancel: handleOnCreateDisciplinaryIssueMock,
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <Actions {...props} />
        </Provider>
      );
      const cancel = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancel);
      expect(handleOnCreateDisciplinaryIssueMock).toHaveBeenCalled();
    });
  });

  describe('handleOnUpdateDisciplinaryIssue', () => {
    it('uses the useUpdateDisciplinaryIssue hook when the mode is UPDATE_DISCIPLINARY_ISSUE', async () => {
      getDisciplinaryIssueMode.mockReturnValue(UPDATE_DISCIPLINARY_ISSUE);
      useUpdateDisciplinaryIssue.mockReturnValue({
        isDisabled: false,
        handleOnCancel: jest.fn(),
      });

      useCreateDisciplinaryIssue.mockReturnValue({
        isDisabled: true,
        handleOnCancel: () => {},
      });

      render(
        <Provider store={storeFake(defaultStore)}>
          <Actions {...props} />
        </Provider>
      );
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });
});
