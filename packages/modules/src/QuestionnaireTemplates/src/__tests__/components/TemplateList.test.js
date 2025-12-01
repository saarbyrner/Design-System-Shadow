import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { buildTemplates } from '../test_utils';
import TemplateList from '../../components/TemplateList';

describe('Questionnaire Templates <TemplateList /> component', () => {
  let user;
  let baseProps;
  let preloadedState;
  const templates = buildTemplates(5);
  const templateIds = Object.keys(templates);

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {}; // Reset feature flags

    baseProps = {
      templates,
      rename: jest.fn(),
      duplicate: jest.fn(),
      delete: jest.fn(),
      onClickOpenSidePanel: jest.fn(),
      t: i18nextTranslateStub(),
    };

    // Define a minimal preloaded state for any connected child components.
    preloadedState = {
      templates, // The ActivateButton container might need access to the templates state.
      dialogues: {
        delete: { isVisible: false, templateId: null },
        activate: { isVisible: false, templateId: null },
      },
    };
  });

  it('renders the correct number of template rows', () => {
    renderWithRedux(<TemplateList {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });
    // Get all rows from the table body (tbody has a role of rowgroup)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(Object.keys(templates).length + 1); // +1 for the header row
  });

  it('displays the template data correctly in the rows', () => {
    renderWithRedux(<TemplateList {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const firstRow = screen.getAllByRole('row')[1];

    const firstTemplateId = templateIds[0];
    const firstTemplate = templates[firstTemplateId];

    // Check for name, platforms, and last edited info
    expect(
      within(firstRow).getByRole('link', { name: firstTemplate.name })
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText(
        firstTemplate.platforms.sort().reverse().join(', ')
      )
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText(new RegExp(firstTemplate.last_edited_by, 'i'))
    ).toBeInTheDocument();
  });

  it('displays the platform types in the correct sorted order', () => {
    const customProps = {
      ...baseProps,
      templates: {
        8: {
          id: 8,
          name: 'Template 1',
          active: true,
          platforms: ['Capture', 'Well-being', 'MSK'],
        },
      },
    };
    renderWithRedux(<TemplateList {...customProps} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const row = screen.getAllByRole('row')[1];
    expect(
      within(row).getByText('Well-being, MSK, Capture')
    ).toBeInTheDocument();
  });

  it('disables the delete button when a template is active', () => {
    const activeTemplate = { ...templates[templateIds[0]], active: true };
    const propsWithActive = {
      ...baseProps,
      templates: { [activeTemplate.id]: activeTemplate },
    };
    renderWithRedux(<TemplateList {...propsWithActive} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const row = screen.getAllByRole('row')[1]; // First row after header

    const deleteButton = within(row).getAllByRole('button')[3];

    expect(deleteButton).toBeDisabled();
  });

  it('calls the correct prop when clicking the rename button', async () => {
    renderWithRedux(<TemplateList {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });
    const firstRow = screen.getAllByRole('row')[1]; // First row after header
    const renameButton = within(firstRow).getAllByRole('button')[1];

    await user.click(renameButton);

    expect(baseProps.rename).toHaveBeenCalledTimes(1);
    expect(baseProps.rename).toHaveBeenCalledWith(templates[templateIds[0]].id);
  });

  describe('[feature-flag] forms-scheduling', () => {
    beforeEach(() => {
      window.featureFlags['forms-scheduling'] = true;
    });

    it('calls onClickOpenSidePanel when clicking the calendar icon for an active template', async () => {
      const activeTemplate = { ...templates[templateIds[0]], active: true };
      const propsWithActive = {
        ...baseProps,
        templates: { [activeTemplate.id]: activeTemplate },
      };
      renderWithRedux(<TemplateList {...propsWithActive} />, {
        useGlobalStore: false,
        preloadedState,
      });
      const row = screen.getAllByRole('row')[1]; // First row after header
      const calendarButton = within(row).getAllByRole('button')[1];

      await user.click(calendarButton);
      expect(baseProps.onClickOpenSidePanel).toHaveBeenCalledTimes(1);
    });

    it('shows the active state for the calendar icon when scheduled and active', () => {
      const scheduledTemplate = {
        ...templates[templateIds[0]],
        active: true,
        scheduled_time: '08:20:00',
      };
      const propsWithScheduled = {
        ...baseProps,
        templates: { [scheduledTemplate.id]: scheduledTemplate },
      };

      renderWithRedux(<TemplateList {...propsWithScheduled} />, {
        useGlobalStore: false,
        preloadedState,
      });
      const row = screen.getAllByRole('row')[1];
      const calendarButton = within(row).getAllByRole('button')[1];
      expect(calendarButton).toHaveClass(
        'questionnaireTemplates__button--active'
      );
    });

    it('shows the disabled state for the calendar icon when template is inactive', () => {
      const inactiveTemplate = { ...templates[templateIds[0]], active: false };
      const propsWithInactive = {
        ...baseProps,
        templates: { [inactiveTemplate.id]: inactiveTemplate },
      };
      renderWithRedux(<TemplateList {...propsWithInactive} />, {
        useGlobalStore: false,
        preloadedState,
      });
      const row = screen.getAllByRole('row')[1];
      const calendarButton = within(row).getAllByRole('button')[1];

      expect(calendarButton).toHaveClass(
        'questionnaireTemplates__button--disabled'
      );
    });
  });
});
