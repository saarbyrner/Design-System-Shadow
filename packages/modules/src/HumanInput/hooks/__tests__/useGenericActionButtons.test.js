import { renderHook, act as hooksAct } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useGenericActionButtons from '@kitman/modules/src/HumanInput/hooks/useGenericActionButtons';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import {
  MODES,
  FORMS_PRODUCT_AREAS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/modules/src/HumanInput/hooks/useStatus');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

const generateStore = (mode) => {
  return storeFake({
    formStateSlice: {
      ...initialFormState,
      config: {
        mode,
      },
    },
    formValidationSlice: {
      validation: {},
    },
  });
};

const createStore = generateStore(MODES.CREATE);
const viewStore = generateStore(MODES.VIEW);
const editStore = generateStore(MODES.EDIT);

const saveProgressButtonText = 'Save as draft';
const cancelButtonText = 'Cancel';
const submitButtonText = 'Submit';
const editButtonText = 'Edit';

const generalProvider = (store) => {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

describe('useGenericActionButtons - Product Area specific behavior', () => {
  let renderHookResult;
  const baseProps = {
    onUpdate: jest.fn(),
    onBulkCreate: jest.fn(),
    toastIds: [],
    doesUserHaveRequiredPermissions: true,
    isGenericForm: true,
    formId: 1,
    userId: 2,
  };

  const trackEventMock = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    useStatus.mockReturnValue('VALID');
    window.featureFlags['form-renderer-draft-mode'] = true;
    baseProps.onBulkCreate.mockReturnValue(humanInputFormMockData);
    baseProps.onUpdate.mockReturnValue(humanInputFormMockData);

    useGetPermissionsQuery.mockReturnValue({
      data: {
        eforms: {
          canViewForms: true,
          canDeleteForms: true,
          canSubmitForms: true,
          canEditForms: true,
        },
      },
      error: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    window.featureFlags['form-renderer-draft-mode'] = false;
    jest.clearAllMocks();
  });

  describe('GENERIC_FORMS_STAFF_FLOW', () => {
    const staffFlowProps = {
      ...baseProps,
      productArea: FORMS_PRODUCT_AREAS.GENERIC_FORMS_STAFF_FLOW,
    };

    const staffFlowPropsNoPermissions = {
      ...staffFlowProps,
      doesUserHaveRequiredPermissions: false,
    };

    it('shows correct buttons in CREATE mode and handles clicks properly', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(staffFlowProps),
          {
            wrapper: generalProvider(createStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;
      expect(actionButtons).toHaveLength(2);
      expect(actionButtons[0].props.children).toEqual(saveProgressButtonText);
      expect(actionButtons[1].props.children).toEqual(submitButtonText);

      await act(async () => {
        render(actionButtons[1]);
        await user.click(
          screen.getByRole('button', { name: submitButtonText })
        );
        expect(baseProps.onBulkCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            answers: [],
            status: 'complete',
            formId: 1,
            userId: 2,
          })
        );
      });

      await act(async () => {
        render(actionButtons[0]);
        await user.click(
          screen.getByRole('button', { name: saveProgressButtonText })
        );
        expect(baseProps.onBulkCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            answers: [],
            status: 'draft',
            formId: 1,
            userId: 2,
          })
        );
      });

      expect(trackEventMock).toHaveBeenNthCalledWith(
        1,
        'Staff - Form Answer Set Created for Athlete',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );

      expect(trackEventMock).toHaveBeenNthCalledWith(
        2,
        'Staff - Form Answer Set Saved as Draft for Athlete',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );
    });

    it('shows no buttons in CREATE mode without permissions', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: true,
            canDeleteForms: true,
            canSubmitForms: false,
            canEditForms: true,
          },
        },
        error: false,
        isLoading: false,
      });

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(staffFlowPropsNoPermissions),
          {
            wrapper: generalProvider(createStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(0);
    });

    it('shows correct buttons in EDIT mode for a complete form and handles clicks properly', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(staffFlowProps),
          {
            wrapper: generalProvider(editStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(1);
      expect(actionButtons[0].props.children).toEqual(submitButtonText);

      await act(async () => {
        render(actionButtons[0]);
        await user.click(
          screen.getByRole('button', { name: submitButtonText })
        );

        expect(baseProps.onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            isSavingProgress: false,
          })
        );
      });

      expect(trackEventMock).toHaveBeenNthCalledWith(
        1,
        'Staff - Form Answer Set Edited for Athlete',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );
    });

    it('shows correct buttons in EDIT mode for a Draft form and handles clicks properly', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () =>
            useGenericActionButtons({
              ...staffFlowProps,
              formStatus: FORM_STATUS.DRAFT,
            }),
          {
            wrapper: generalProvider(editStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(2);
      expect(actionButtons[0].props.children).toEqual(saveProgressButtonText);
      expect(actionButtons[1].props.children).toEqual(submitButtonText);

      await act(async () => {
        render(actionButtons[1]);
        await user.click(
          screen.getByRole('button', { name: submitButtonText })
        );

        expect(baseProps.onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            isSavingProgress: false,
          })
        );
      });

      await act(async () => {
        render(actionButtons[0]);
        await user.click(
          screen.getByRole('button', { name: saveProgressButtonText })
        );
        expect(baseProps.onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            isSavingProgress: true,
          })
        );
      });

      expect(trackEventMock).toHaveBeenNthCalledWith(
        1,
        'Staff - Form Answer Set Edited for Athlete',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );

      expect(trackEventMock).toHaveBeenNthCalledWith(
        2,
        'Staff - Form Answer Set Saved as Draft for Athlete',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );
    });

    it('shows no buttons in EDIT mode without permissions', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: true,
            canDeleteForms: true,
            canSubmitForms: true,
            canEditForms: false,
          },
        },
        error: false,
        isLoading: false,
      });

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(staffFlowPropsNoPermissions),
          {
            wrapper: generalProvider(editStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(0);
    });
  });

  describe('GENERIC_FORMS_ATHLETE_FLOW', () => {
    const athleteFlowProps = {
      ...baseProps,
      productArea: FORMS_PRODUCT_AREAS.GENERIC_FORMS_ATHLETE_FLOW,
      formTemplateSettingsConfig: {
        can_edit_submitted_forms: true,
        can_save_drafts: true,
      },
    };

    it('shows correct buttons in CREATE mode and handles clicks properly', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteFlowProps),
          {
            wrapper: generalProvider(createStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;
      expect(actionButtons).toHaveLength(2);
      expect(actionButtons[0].props.children).toEqual(saveProgressButtonText);
      expect(actionButtons[1].props.children).toEqual(submitButtonText);

      await act(async () => {
        render(actionButtons[1]);
        await user.click(
          screen.getByRole('button', { name: submitButtonText })
        );
        expect(baseProps.onBulkCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'complete',
          })
        );
      });

      await act(async () => {
        render(actionButtons[0]);
        await user.click(
          screen.getByRole('button', { name: saveProgressButtonText })
        );
        expect(baseProps.onBulkCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'draft',
          })
        );
      });

      expect(trackEventMock).toHaveBeenNthCalledWith(
        1,
        'Athlete - Form Answer Set Submitted',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );

      expect(trackEventMock).toHaveBeenNthCalledWith(
        2,
        'Athlete - Form Answer Set Saved as Draft',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );
    });

    it('shows correct buttons in EDIT mode and handles clicks properly', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteFlowProps),
          {
            wrapper: generalProvider(editStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(2);
      expect(actionButtons[0].props.children).toEqual(saveProgressButtonText);
      expect(actionButtons[1].props.children).toEqual(submitButtonText);

      await act(async () => {
        render(actionButtons[1]);
        await user.click(
          screen.getByRole('button', { name: submitButtonText })
        );

        expect(baseProps.onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            isSavingProgress: false,
          })
        );
      });

      await act(async () => {
        render(actionButtons[0]);
        await user.click(
          screen.getByRole('button', { name: saveProgressButtonText })
        );
        expect(baseProps.onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            isSavingProgress: true,
          })
        );
      });

      expect(trackEventMock).toHaveBeenNthCalledWith(
        1,
        'Athlete - Form Answer Set Edited',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );

      expect(trackEventMock).toHaveBeenNthCalledWith(
        2,
        'Athlete - Form Answer Set Saved as Draft',
        {
          category: 'registration',
          editorId: 155134,
          formId: 140,
          name: 'Premier League Athlete Profile',
          type: 'athlete_profile',
          athleteId: 40211,
        }
      );
    });

    it('shows only submit button when drafts are not allowed', async () => {
      const propsWithoutDrafts = {
        ...athleteFlowProps,
        formTemplateSettingsConfig: {
          ...athleteFlowProps.formTemplateSettingsConfig,
          can_save_drafts: false,
        },
      };

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(propsWithoutDrafts),
          {
            wrapper: generalProvider(createStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(1);
      expect(actionButtons[0].props.children).toEqual(submitButtonText);
    });

    it('shows edit button when editing submitted forms is allowed', async () => {
      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteFlowProps),
          {
            wrapper: generalProvider(viewStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(1);
      expect(actionButtons[0].props.children).toEqual(editButtonText);
    });

    it('shows no edit button when editing submitted forms is not allowed', async () => {
      const propsWithoutEdit = {
        ...athleteFlowProps,
        formTemplateSettingsConfig: {
          ...athleteFlowProps.formTemplateSettingsConfig,
          can_edit_submitted_forms: false,
        },
      };

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(propsWithoutEdit),
          {
            wrapper: generalProvider(viewStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(0);
    });
  });

  describe('ATHLETE_PROFILE', () => {
    const athleteProfileProps = {
      ...baseProps,
      isGenericForm: false,
      productArea: FORMS_PRODUCT_AREAS.ATHLETE_PROFILE,
    };

    const athleteProfilePropsNoPermissions = {
      ...athleteProfileProps,
      doesUserHaveRequiredPermissions: false,
    };

    it('shows submit and cancel buttons in CREATE mode and handles clicks', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteProfileProps),
          {
            wrapper: generalProvider(createStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(2);
      expect(actionButtons[0].props.children).toEqual(submitButtonText);
      expect(actionButtons[1].props.children).toEqual(cancelButtonText);

      await act(async () => {
        render(actionButtons[0]);
        await user.click(
          screen.getByRole('button', { name: submitButtonText })
        );

        expect(baseProps.onBulkCreate).toHaveBeenCalledWith(expect.any(Object));
      });
    });

    it('shows no buttons in CREATE mode without permissions', async () => {
      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteProfilePropsNoPermissions),
          {
            wrapper: generalProvider(createStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(0);
    });

    it('shows save and cancel buttons in EDIT mode and handles clicks', async () => {
      const user = userEvent.setup();

      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteProfileProps),
          {
            wrapper: generalProvider(editStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(2);
      expect(actionButtons[0].props.children).toEqual('Save');
      expect(actionButtons[1].props.children).toEqual(cancelButtonText);

      await act(async () => {
        render(actionButtons[0]);

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(baseProps.onUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            isSavingProgress: false,
          })
        );
      });
    });

    it('shows no buttons in EDIT mode without permissions', async () => {
      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteProfilePropsNoPermissions),
          {
            wrapper: generalProvider(editStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(0);
    });

    it('shows edit button in VIEW mode', async () => {
      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteProfileProps),
          {
            wrapper: generalProvider(viewStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(1);
      expect(actionButtons[0].props.children).toEqual(editButtonText);
    });

    it('shows no buttons in VIEW mode without permissions', async () => {
      await hooksAct(async () => {
        renderHookResult = renderHook(
          () => useGenericActionButtons(athleteProfilePropsNoPermissions),
          {
            wrapper: generalProvider(viewStore),
          }
        ).result;
      });

      const { actionButtons } = renderHookResult.current;

      expect(actionButtons).toHaveLength(0);
    });
  });
});
