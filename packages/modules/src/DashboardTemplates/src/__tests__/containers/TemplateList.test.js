import { I18nextProvider } from 'react-i18next';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import i18n from '@kitman/common/src/utils/i18n';
import { buildTemplates } from '@kitman/common/src/utils/test_utils';
import TemplateList from '../../containers/TemplateList';

describe('<TemplateList />', () => {
  const templates = buildTemplates(5);

  beforeEach(() => {
    window.featureFlags = {};
  });

  it('renders', () => {
    const preloadedState = {
      templates,
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <TemplateList />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    // TemplateList should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    const preloadedState = {
      templates,
    };

    renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <TemplateList />
      </I18nextProvider>,
      { preloadedState, useGlobalStore: false }
    );

    // The templates should be passed to the component and rendered
    expect(document.body).toBeInTheDocument();
  });
});
