import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { formMetaDataMockData } from '@kitman/modules/src/FormTemplates/shared/consts';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { SettingsTabTranslated as SettingsTab } from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');
const mockTrackEvent = jest.fn();

const mockStructureWithId = {
  name: '',
  form_elements: [],
  structure: {
    config: null,
  },
  id: 'test-form-id',
};

const mockStructureWithConfigAndId = {
  name: '',
  form_elements: [],
  structure: {
    config: {
      settings: {
        can_edit_submitted_forms: false,
        can_save_drafts: false,
        autosave_as_draft: false,
        autopopulate_from_previous_answerset: false,
        input_method: {
          athlete_app: true,
          kiosk_app: true,
          web: true,
        },
      },
    },
  },
  id: 'test-form-id',
};

describe('<SettingsTab />', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    mockTrackEvent.mockClear();

    window.setFlag('cp-eforms-autosave-as-draft', true);
    window.setFlag('cp-eforms-auto-populate-last-response', true);
  });

  const renderComponent = (preloadedState = {}) => {
    const { mockedStore } = renderWithRedux(<SettingsTab />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: {
          ...initialState,
          metaData: { ...formMetaDataMockData, productArea: 'Medical' },
          structure: mockStructureWithId,

          ...preloadedState,
        },
      },
    });
    return mockedStore;
  };

  it('renders settings tab', async () => {
    renderComponent();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(
      screen.getByText('Input method for athletes to submit answer sets')
    ).toBeInTheDocument();
  });

  it('renders default settings when no config is provided', async () => {
    renderComponent();
    expect(
      screen.getByLabelText('Athletes can edit submitted forms')
    ).not.toBeChecked();
    expect(
      screen.getByLabelText('Athletes can save a draft')
    ).not.toBeChecked();
    expect(screen.getByLabelText('Autosave as draft')).not.toBeChecked();
    expect(screen.getByLabelText('Athlete app')).toBeChecked();
    expect(screen.getByLabelText('Kiosk app')).toBeChecked();
    expect(screen.getByLabelText('Athlete Web')).toBeChecked();
  });

  it('does not render "Autosave as draft" toggle when feature flag is disabled', () => {
    // feature flag as disabled
    window.setFlag('cp-eforms-autosave-as-draft', false);

    renderComponent();

    expect(screen.queryByLabelText('Autosave as draft')).not.toBeInTheDocument();
  });

  it('renders settings from preloaded state', async () => {
    const preloadedState = {
      structure: mockStructureWithConfigAndId,
    };
    renderComponent(preloadedState);
    expect(
      screen.getByLabelText('Athletes can edit submitted forms')
    ).not.toBeChecked();
    expect(
      screen.getByLabelText('Athletes can save a draft')
    ).not.toBeChecked();
    expect(screen.getByLabelText('Athlete app')).toBeChecked();
    expect(screen.getByLabelText('Kiosk app')).toBeChecked();
    expect(screen.getByLabelText('Athlete Web')).toBeChecked();
  });

  it('dispatches correct action on "can edit" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const editSubmittedSwitch = screen.getByLabelText(
      'Athletes can edit submitted forms'
    );

    await user.click(editSubmittedSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: true,
            can_save_drafts: false,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      })
    );
  });

  it('tracks event when "can edit" toggle is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const editSubmittedSwitch = screen.getByLabelText(
      'Athletes can edit submitted forms'
    );

    await user.click(editSubmittedSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Athletes Can Edit Toggled',
      { formTemplateId: 'test-form-id', can_edit_submitted_forms: true }
    );
  });

  it('dispatches correct action on "can save draft" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const saveDraftSwitch = screen.getByLabelText('Athletes can save a draft');

    await user.click(saveDraftSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      })
    );
  });

  it('tracks event when "can save draft" toggle is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const saveDraftSwitch = screen.getByLabelText('Athletes can save a draft');

    await user.click(saveDraftSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Athletes Can Save Draft Toggled',
      { formTemplateId: 'test-form-id', can_save_drafts: true }
    );
  });

  it('dispatches correct action on "can save draft" toggle when turned off', async () => {
    const user = userEvent.setup();
    // Start with can_save_drafts: true
    const mockedStore = renderComponent({
      structure: {
        ...mockStructureWithId,
        config: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: true,
            autopopulate_from_previous_answerset: false,
          },
        },
      },
    });
    const saveDraftSwitch = screen.getByLabelText('Athletes can save a draft');

    await user.click(saveDraftSwitch); // Turn it off

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: false,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      })
    );
  });

  it('disables "Autosave as draft" toggle when "can save draft" is off', () => {
    renderComponent(); // Defaults to can_save_drafts: false
    const autosaveSwitch = screen.getByLabelText('Autosave as draft');

    expect(autosaveSwitch).toBeDisabled();
  });

  it('enables "Autosave as draft" toggle when "can save draft" is on', () => {
    renderComponent({
      structure: {
        ...mockStructureWithId,
        config: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      },
    });
    const autosaveSwitch = screen.getByLabelText('Autosave as draft');

    expect(autosaveSwitch).toBeEnabled();
  });

  it('dispatches correct action on "Autosave as draft" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      structure: {
        ...mockStructureWithId,
        config: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      },
    });
    const autosaveSwitch = screen.getByLabelText('Autosave as draft');

    await user.click(autosaveSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: true,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      })
    );
  });

  it('tracks event when "Autosave as draft" toggle is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({
      structure: {
        ...mockStructureWithId,
        config: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      },
    });
    const autosaveSwitch = screen.getByLabelText('Autosave as draft');

    await user.click(autosaveSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Autosave as Draft Toggled',
      { formTemplateId: 'test-form-id', autosave_as_draft: true }
    );
  });

  it('dispatches correct action on "Auto-populate from previous answers" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      structure: {
        ...mockStructureWithId,
        config: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: true,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      },
    });
    const autosaveSwitch = screen.getByLabelText('Auto-populate from previous answers');

    await user.click(autosaveSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: true,
            autosave_as_draft: true,
            autopopulate_from_previous_answerset: true,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: true,
            },
          },
        },
      })
    );
  });

  it('does not render Save as PDF toggle if form category is not medical', () => {
    renderComponent({
      structure: {
        ...mockStructureWithId,
        productArea: 'General',
      },
      metaData: { ...formMetaDataMockData, productArea: 'General' },
    });

    expect(
      screen.queryByLabelText('Save form as a PDF after submission')
    ).not.toBeInTheDocument();
  });

  it('renders Save as PDF toggle if form category is medical', () => {
    renderComponent();

    expect(
      screen.getByLabelText('Save form as a PDF after submission')
    ).toBeInTheDocument();
  });

  it('dispatches correct action on "Save as PDF" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const saveAsPdfSwitch = screen.getByLabelText(
      'Save form as a PDF after submission'
    );

    await user.click(saveAsPdfSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setPostProcessorsConfig',
        payload: {
          postProcessors: [
            '::Forms::Private::PostProcessors::PdfExportProcessor',
          ],
        },
      })
    );
  });

  it('tracks event when "Save as PDF" toggle is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    const saveAsPdfSwitch = screen.getByLabelText(
      'Save form as a PDF after submission'
    );
    await user.click(saveAsPdfSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Save form as PDF after submission Toggled',
      { formTemplateId: 'test-form-id', saveFormAsPdf: true }
    );
  });

  it('dispatches correct action on "Athlete app" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const athleteAppSwitch = screen.getByLabelText('Athlete app');

    await user.click(athleteAppSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: false,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: false, // Toggled from true to false
              kiosk_app: true,
              web: true,
            },
          },
        },
      })
    );
  });

  it('tracks event when "Athlete app" toggle is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const athleteAppSwitch = screen.getByLabelText('Athlete app');

    await user.click(athleteAppSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Athlete App Toggled',
      { formTemplateId: 'test-form-id', athlete_app: false }
    );
  });

  it('dispatches correct action on "Kiosk app" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const kioskAppSwitch = screen.getByLabelText('Kiosk app');

    await user.click(kioskAppSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: false,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: false, // Toggled from true to false
              web: true,
            },
          },
        },
      })
    );
  });

  it('tracks event when "Kiosk app" toggle is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const kioskAppSwitch = screen.getByLabelText('Kiosk app');

    await user.click(kioskAppSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Kiosk App Toggled',
      { formTemplateId: 'test-form-id', kiosk_app: false }
    );
  });

  it('dispatches correct action on "Athlete Web" toggle', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const webSwitch = screen.getByLabelText('Athlete Web');

    await user.click(webSwitch);

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'formBuilderSlice/setSettingsConfig',
        payload: {
          settings: {
            can_edit_submitted_forms: false,
            can_save_drafts: false,
            autosave_as_draft: false,
            autopopulate_from_previous_answerset: false,
            input_method: {
              athlete_app: true,
              kiosk_app: true,
              web: false, // Toggled from true to false
            },
          },
        },
      })
    );
  });

  it('tracks event when "Athlete Web" toggle is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const webSwitch = screen.getByLabelText('Athlete Web');

    await user.click(webSwitch);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Form Builder Settings - Athlete Web Toggled',
      { formTemplateId: 'test-form-id', web: false }
    );
  });
});
