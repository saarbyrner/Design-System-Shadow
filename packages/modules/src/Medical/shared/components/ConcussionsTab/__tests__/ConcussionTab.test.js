import { screen, waitFor } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useGetConcussionFormTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { concussionBaselineForms } from '@kitman/services/src/mocks/handlers/medical/getConcussionFormTypes';
import ConcussionTab from '../index';

setI18n(i18n);

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetConcussionFormTypesQuery: jest.fn(),
}));

const props = {
  reloadData: false,
  athleteId: 1,
  t: i18nextTranslateStub(),
};

const defaultStore = {
  medicalApi: {},
  medicalHistory: {},
};

describe('<ConcussionTab />', () => {
  let requestSubmitMock;
  let originalRequestSubmit;

  beforeEach(() => {
    useGetConcussionFormTypesQuery.mockReturnValue({
      data: concussionBaselineForms,
      isLoading: false,
      isSuccess: true,
    });

    // Mock requestSubmit using Object.defineProperty to ensure it's in place before render
    originalRequestSubmit = HTMLFormElement.prototype.requestSubmit;
    requestSubmitMock = jest.fn();
    Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
      configurable: true,
      value: requestSubmitMock,
    });
  });

  afterEach(() => {
    // Restore original requestSubmit
    Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
      configurable: true,
      value: originalRequestSubmit,
    });
    jest.restoreAllMocks(); // Ensure all other spies are restored
  });

  describe('<ConcussionTab with athleteId />', () => {
    it('renders', async () => {
      renderWithRedux(<ConcussionTab {...props} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      const concussionsTitle = await screen.findByText('Concussions');
      expect(concussionsTitle).toBeInTheDocument();
    });

    it('renders the data grids', async () => {
      renderWithRedux(<ConcussionTab {...props} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );

      expect(
        screen.getByRole('heading', { level: 2, name: 'Concussions (1)' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Baselines' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Test history' })
      ).toBeInTheDocument();

      expect(screen.getByText('King Devick')).toBeInTheDocument();
      expect(screen.getAllByText('Near Point of Convergence')).toHaveLength(2);
    });
  });

  describe('<ConcussionTab with no athleteId />', () => {
    it('renders', async () => {
      renderWithRedux(<ConcussionTab {...props} athleteId={null} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      expect(
        screen.getByRole('heading', { level: 2, name: 'Concussions' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Baselines' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Test history' })
      ).not.toBeInTheDocument();
    });

    it('renders the data grids', async () => {
      renderWithRedux(<ConcussionTab {...props} athleteId={null} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() =>
        expect(screen.queryByText('Loading ...')).not.toBeInTheDocument()
      );
      expect(
        screen.getByRole('heading', { level: 2, name: 'Concussions' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', { level: 2, name: 'Baselines' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Test history' })
      ).not.toBeInTheDocument();

      expect(screen.getByText('Concussion Assessment')).toBeInTheDocument();
    });
  });

  describe('[feature-flag] c3logix-concussion', () => {
    beforeEach(() => {
      window.setFlag('c3logix-concussion', true);
    });

    afterEach(() => {
      window.setFlag('c3logix-concussion', false);
    });

    it('renders C3LogixIframe when flag is true', async () => {
      renderWithRedux(<ConcussionTab {...props} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() => {
        expect(screen.getByTitle('C3Logix Athlete Iframe')).toBeInTheDocument();
      });
    });

    it('does not render Baselines and Test history grids when flag is true', async () => {
      renderWithRedux(<ConcussionTab {...props} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() => {
        expect(
          screen.queryByRole('heading', { level: 2, name: 'Baselines' })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('heading', { level: 2, name: 'Test history' })
        ).not.toBeInTheDocument();
      });
    });

    it('does not render C3LogixIframe at all when c3logix-concussion is false', async () => {
      window.setFlag('c3logix-concussion', false);
      renderWithRedux(<ConcussionTab {...props} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() => {
        expect(
          screen.queryByTitle('C3Logix Athlete Iframe')
        ).not.toBeInTheDocument();
      });
    });

    it('renders C3LogixIframe when flag is true and athleteId is null', async () => {
      renderWithRedux(<ConcussionTab {...props} athleteId={null} />, {
        preloadedState: defaultStore,
        useGlobalStore: false,
      });
      await waitFor(() => {
        expect(screen.getByTitle('C3Logix Roster Iframe')).toBeInTheDocument();
      });
    });
  });
});
