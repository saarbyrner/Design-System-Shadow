import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useSelector } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  usePublishVersionMutation,
  useSaveVersionMutation,
  useFetchVersionQuery,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { MOCK_CONDITIONS } from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';
import { data as MOCK_VERSION } from '@kitman/modules/src/ConditionalFields/shared//services/mocks/data/mock_version';
import VersionAppHeader from '..';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
jest.mock('@kitman/components/src/DelayedLoadingFeedback');

// Mocking the useSelector hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  conditionalFieldsApi: {
    usePublishVersionMutation: jest.fn(),
    useSaveVersionMutation: jest.fn(),
    useFetchVersionQuery: jest.fn(),
  },
});

const defaultProps = {
  rulesetId: 42,
  versionId: 58,
  isPublished: true,
  allFieldsAreValid: false,
  t: i18nextTranslateStub(),
  title: 'Version Title',
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  useSelector.mockReturnValue(MOCK_CONDITIONS);
  render(
    <Provider store={store}>
      <VersionAppHeader {...props} />
    </Provider>
  );
};

describe('<VersionAppHeader/>', () => {
  beforeEach(() => {
    useFetchVersionQuery.mockReturnValue({
      data: MOCK_VERSION,
      isSuccess: true,
    });
    useSaveVersionMutation.mockReturnValue([{}, {}]);
    usePublishVersionMutation.mockReturnValue([{}, {}]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders title', () => {
    renderWithProviders();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Version Title'
    );
  });
  describe('[PROPS]', () => {
    it('isPublished - does not render edit icon button when true', () => {
      renderWithProviders();

      const iconElement = document.querySelector('.icon-edit');
      expect(iconElement).not.toBeInTheDocument();
    });
    it('isPublished - does not render edit icon button when false', () => {
      renderWithProviders(defaultStore, {
        ...defaultProps,
        isPublished: false,
      });
      const iconElement = document.querySelector('.icon-edit');
      expect(iconElement).toBeInTheDocument();
    });
    it('isPublished - renders Publish button when false', () => {
      renderWithProviders(defaultStore, {
        ...defaultProps,
        isPublished: false,
      });
      expect(
        screen.getByRole('button', { name: 'Publish' })
      ).toBeInTheDocument();
    });
    it('isPublished - does not render Publish button when true', () => {
      renderWithProviders();
      expect(screen.queryByText(/Publish/i)).not.toBeInTheDocument();
    });
    it('title - renders title when it exists', async () => {
      renderWithProviders();

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Version Title'
      );
    });
    it('title - renders "--" when title null', async () => {
      defaultProps.title = null;

      renderWithProviders();

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('--');
    });

    it('displays and closes the Confirmation Modal', async () => {
      renderWithProviders(defaultStore, {
        ...defaultProps,
        isPublished: false,
        allFieldsAreValid: true,
      });

      const publishButton = screen.getByRole('button', {
        name: 'Publish',
      });

      expect(publishButton).toBeInTheDocument();
      expect(publishButton).toBeEnabled();
      await userEvent.click(publishButton);

      const cancelButton = screen.getByRole('button', {
        name: 'Cancel',
        hidden: true,
      });

      expect(
        screen.getByRole('heading', { name: 'Publish', level: 4, hidden: true })
      ).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(
        screen.getAllByRole('button', { name: 'Publish', hidden: true })[1]
      ).toBeInTheDocument();

      await userEvent.click(cancelButton);

      expect(
        screen.queryByRole('heading', {
          name: 'Publish',
          level: 4,
          hidden: true,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Cancel',
          hidden: true,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Publish', hidden: true })
      ).toBeInTheDocument();
    });

    it('publish button is disabled when allFieldsAreValid is false', () => {
      renderWithProviders(defaultStore, {
        ...defaultProps,
        isPublished: false,
        allFieldsAreValid: false,
      });

      const publishButton = screen.getByRole('button', {
        name: 'Publish',
      });

      expect(publishButton).toBeInTheDocument();
      expect(publishButton).toBeDisabled();
    });
  });
});
