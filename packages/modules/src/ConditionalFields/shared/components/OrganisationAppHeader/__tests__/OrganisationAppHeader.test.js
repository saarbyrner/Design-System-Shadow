import { act, screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { useUpdateOwnerRulesetsMutation } from '../../../services/conditionalFields';
import OrganisationAppHeader from '..';

jest.mock('../../../services/conditionalFields');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  conditionalFieldsApi: {
    useUpdateOwnerRulesetsMutation: jest.fn(),
  },
});

describe('<RulesetAppHeader/>', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    organisationId: 42,
    t: i18nT,
  };
  describe('Success state', () => {
    beforeEach(() => {
      useUpdateOwnerRulesetsMutation.mockReturnValue([
        'updateOwnerRulesets',
        { isError: false, isLoading: false, isSuccess: true },
      ]);
    });
    it('renders', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <OrganisationAppHeader {...props} />
          </Provider>
        );
      });
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Logic builder'
      );
      expect(
        screen.getByRole('button', { name: 'Add ruleset' })
      ).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    beforeEach(() => {
      useUpdateOwnerRulesetsMutation.mockReturnValue([
        'updateOwnerRulesets',
        { isError: true, isLoading: false, isSuccess: false },
      ]);
    });

    it('renders the error state', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <OrganisationAppHeader {...props} />
          </Provider>
        );
      });

      act(() => {
        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
      });
    });
  });
  describe('Loading state', () => {
    beforeEach(() => {
      useUpdateOwnerRulesetsMutation.mockReturnValue([
        'updateOwnerRulesets',
        { isError: false, isLoading: true, isSuccess: false },
      ]);
    });

    it('renders the loading state', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <OrganisationAppHeader {...props} />
          </Provider>
        );
      });

      act(() => {
        expect(
          screen.getByRole('button', { role: 'progressbar' })
        ).toBeInTheDocument();
      });
    });
  });
});
