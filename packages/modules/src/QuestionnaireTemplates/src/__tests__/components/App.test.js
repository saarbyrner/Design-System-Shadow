import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import App from '../../components/App';

describe('Questionnaire Templates <App /> component', () => {
  let baseProps;
  let preloadedState;

  beforeEach(() => {
    window.featureFlags = {}; // Reset feature flags

    baseProps = {
      templates: [],
      t: i18nextTranslateStub(),
    };

    preloadedState = {
      templates: {},
      modals: {
        addTemplateVisible: false,
        renameTemplateVisible: false,
        duplicateTemplateVisible: false,
        templateName: '',
      },
      appStatus: {
        status: null,
      },
      dialogues: {
        delete: { isVisible: false, templateId: null },
        activate: { isVisible: false, templateId: null },
      },
      reminderSidePanel: {
        templateId: '',
        isOpen: false,
        notifyAthletes: false,
        scheduledTime: null,
        localTimeZone: '',
        scheduledDays: {},
      },
      filters: {
        searchText: '',
        searchStatus: '',
        searchScheduled: '',
      },
      sorting: {
        column: 'name',
        direction: 'asc',
      },
    };
  });

  it('renders the Header and default TemplateList view', () => {
    renderWithRedux(<App {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Check that content from the Header component is rendered
    expect(screen.getByText('Manage Form')).toBeInTheDocument();

    // The new Filter component should not be visible
    expect(
      screen.queryByPlaceholderText('Search forms')
    ).not.toBeInTheDocument();
  });

  describe('when the "update-manage-forms" feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['update-manage-forms'] = true;
    });

    afterEach(() => {
      window.featureFlags['update-manage-forms'] = false;
    });

    it('shows the updated FormList and Filter components', () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      // Check that content from the Header component is rendered
      expect(
        screen.getByRole('heading', { name: 'Manage Form' })
      ).toBeInTheDocument();

      // Check for content from the Filter component
      expect(screen.getByPlaceholderText('Search forms')).toBeInTheDocument();

      // Check for content from the FormList component (which renders a DataGrid)
      expect(
        screen.getByRole('columnheader', { name: 'Form name' })
      ).toBeInTheDocument();
    });
  });
});
