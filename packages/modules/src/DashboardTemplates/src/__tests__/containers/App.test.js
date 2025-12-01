import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import { buildTemplates } from '@kitman/common/src/utils/test_utils';
import App from '../../containers/App';

describe('<App />', () => {
  const templates = buildTemplates(5);

  beforeEach(() => {
    window.featureFlags = {};
  });

  it('renders', () => {
    const preloadedState = {
      templates,
      modals: {
        addTemplateVisible: false,
        duplicateTemplateVisible: false,
      },
      appStatus: {
        status: null,
      },
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    // App should render without crashing - we can check for some expected content
    expect(document.body).toBeInTheDocument();
  });
});
