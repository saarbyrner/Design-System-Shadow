// @flow
import { useEffect, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import Menu from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Menu';
import { RecoveryModalTranslated as RecoveryModal } from '@kitman/modules/src/HumanInput/shared/components/RecoveryModal';
import Form from '@kitman/modules/src/HumanInput/shared/components/UIElements/Form';
import { FooterNavigationTranslated as FooterNavigation } from '@kitman/modules/src/HumanInput/shared/components/FooterNavigation/FooterNavigation';
import useFormNavigation from '@kitman/modules/src/HumanInput/hooks/useFormNavigation';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import useAutosave from '@kitman/modules/src/HumanInput/hooks/useAutosave';
import useGenericActionButtons from '@kitman/modules/src/HumanInput/hooks/useGenericActionButtons';
import DrawerToggle from '@kitman/modules/src/HumanInput/shared/components/UIElements/DrawerToggle';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '@kitman/modules/src/AthleteProfile/src/components/UnsavedChangesModal/UnsavedChangesModal';
import { onToggleDrawer } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import {
  getFormTitleFactory,
  getActiveMenuItemFactory,
  getShouldShowMenuFactory,
  getFormSettingsConfigFactory,
  getFormStatusFactory,
  getAthleteFactory,
  getModeFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  useUpdateFormAnswersSetMutation,
  useBulkCreateFormAnswersSetMutation,
} from '@kitman/services/src/services/humanInput/humanInput';
import {
  FORMS_PRODUCT_AREAS,
  MODES,
} from '@kitman/modules/src/HumanInput/shared/constants';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type {
  FormUpdateRequestBody,
  BulkCreateFormAnswersSetRequestBody,
} from '@kitman/services/src/services/humanInput/api/types';
import {
  getActiveMenuState,
  getDrawerState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';
import { alertUser } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer/utils/helpers';
import useGetFormAnswersSetIdFromPath from '@kitman/modules/src/HumanInput/hooks/useGetFormAnswersSetIdFromPath';
import Header from './Header';

const GENERIC_FORM_RENDERER_ERROR_TOAST_ID =
  'GENERIC_FORM_RENDERER_ERROR_TOAST_ID';
const GENERIC_FORM_RENDERER_SUCCESS_TOAST_ID =
  'GENERIC_FORM_RENDERER_SUCCESS_TOAST_ID';

type Props = {
  hideHeader?: boolean,
  isFormTemplatePreview?: boolean,
};

export const GenericFormRenderer = ({
  hideHeader,
  isFormTemplatePreview,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationSearch = useLocationSearch();
  const mode = useSelector(getModeFactory());
  const formAnswersSetId = useGetFormAnswersSetIdFromPath();
  const formId = locationSearch.get('formId');
  const userId = locationSearch.get('uid') || null;
  const organisationId = locationSearch.get('oid') || null;

  const {
    isNextDisabled,
    isPreviousDisabled,
    onHandleNext: originalOnNext,
    onHandlePrevious: originalOnPrevious,
  } = useFormNavigation();
  const { isOpen } = useSelector(getDrawerState);
  const {
    showModal,
    handleCloseModal,
    handleDiscardChanges,
    handleBack,
    hasUnsavedChanges,
  } = useUnsavedChanges();
  const formTitle = useSelector(getFormTitleFactory());
  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);
  const activeForm = useSelector(
    getActiveMenuItemFactory(menuGroupIndex, menuItemIndex)
  );
  const shouldShowMenu = useSelector(getShouldShowMenuFactory());
  const formTemplateSettingsConfig = useSelector(
    getFormSettingsConfigFactory()
  );
  const formStatus = useSelector(getFormStatusFactory());
  const athlete = useSelector(getAthleteFactory());

  const { data: currentUserData = {} }: { data: Object } =
    useGetCurrentUserQuery();

  const isAthlete = currentUserData?.is_athlete;

  const [updateFormAnswersSet]: [
    ReduxMutation<FormUpdateRequestBody, HumanInputForm>,
    { isLoading: boolean }
  ] = useUpdateFormAnswersSetMutation();

  const [createBulkFormAnswersSet]: [
    ReduxMutation<BulkCreateFormAnswersSetRequestBody, HumanInputForm>,
    { isLoading: boolean }
  ] = useBulkCreateFormAnswersSetMutation();

  const { isAutosaving, lastSaved, autosaveError, triggerSave } = useAutosave({
    formTemplateId: formId,
    formAnswersSetId,
    userId: +userId || currentUserData?.id || null,
    organisationId: +organisationId || undefined,
    hasUnsavedChanges,
  });

  const { actionButtons, isSaving: isManualSaving } = useGenericActionButtons({
    onUpdate: async (requestBody) => {
      const res = await updateFormAnswersSet(requestBody).unwrap();
      return res;
    },
    onBulkCreate: async (requestBody) => {
      const res = await createBulkFormAnswersSet(requestBody).unwrap();
      return res;
    },
    toastIds: {
      errorToastId: GENERIC_FORM_RENDERER_ERROR_TOAST_ID,
      successToastId: GENERIC_FORM_RENDERER_SUCCESS_TOAST_ID,
    },
    isGenericForm: true,
    userId: +userId || currentUserData?.id || null,
    formId: formId || '',
    formTemplateSettingsConfig,
    productArea: isAthlete
      ? FORMS_PRODUCT_AREAS.GENERIC_FORMS_ATHLETE_FLOW
      : FORMS_PRODUCT_AREAS.GENERIC_FORMS_STAFF_FLOW,
    formStatus,
    organisationId: +organisationId || undefined,
  });

  const isAutosaveAsDraftSettingEnabled =
    formTemplateSettingsConfig?.autosave_as_draft || false;

  const isAutosaveEnabled =
    window.getFlag('cp-eforms-autosave-as-draft') &&
    isAutosaveAsDraftSettingEnabled &&
    mode !== MODES.VIEW &&
    !isFormTemplatePreview;

  const prevMenuGroupIndex = useRef(menuGroupIndex);
  const prevMenuItemIndex = useRef(menuItemIndex);

  const onHandleNext = () => {
    // Autosave on "Next" only if the feature flag and template setting is enabled.
    if (isAutosaveEnabled && hasUnsavedChanges) {
      triggerSave();
    }
    originalOnNext();
  };

  const onHandlePrevious = () => {
    // Autosave on "Previous" only if the feature flag and template settingis enabled.
    if (isAutosaveEnabled && hasUnsavedChanges) {
      triggerSave();
    }
    originalOnPrevious();
  };

  // Autosave when navigating through the form menu (changing menu item or group)
  useEffect(() => {
    const menuHasChanged =
      prevMenuGroupIndex.current !== menuGroupIndex ||
      prevMenuItemIndex.current !== menuItemIndex;

    if (!menuHasChanged) {
      return;
    }

    // Update the references with the new values for the next run
    prevMenuGroupIndex.current = menuGroupIndex;
    prevMenuItemIndex.current = menuItemIndex;

    // If autosave is enabled and there are unsaved changes, trigger a save.
    if (isAutosaveEnabled && hasUnsavedChanges) {
      triggerSave();
    }
  }, [
    menuGroupIndex,
    menuItemIndex,
    isAutosaveEnabled,
    hasUnsavedChanges,
    triggerSave,
  ]);

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);

  return (
    <FormLayout>
      {isManualSaving && <FormLayout.Loading />}
      {!hideHeader && (
        <FormLayout.Title>
          <Header
            title={formTitle}
            athlete={athlete}
            handleBack={handleBack}
            actionButtons={actionButtons}
            isAutosaving={isAutosaving}
            lastSaved={lastSaved}
            autosaveError={autosaveError}
            isAutosaveEnabled={isAutosaveEnabled}
          />
        </FormLayout.Title>
      )}

      <FormLayout.Body withTabs>
        {shouldShowMenu && (
          <FormLayout.Menu isOpen={isOpen}>
            {isManualSaving ? (
              <FormLayout.MenuSkeleton />
            ) : (
              <>
                <DrawerToggle
                  isOpen={isOpen}
                  onToggle={() => dispatch(onToggleDrawer())}
                />
                <Menu />
              </>
            )}
          </FormLayout.Menu>
        )}
        <FormLayout.Content>
          <FormLayout.Form>
            {isManualSaving ? (
              <FormLayout.ContentSkeleton />
            ) : (
              <Form
                isOpen
                scrollSectionToTop
                formElements={
                  shouldShowMenu
                    ? activeForm.form_elements
                    : activeForm.form_elements[0]?.form_elements
                }
                title={activeForm.config?.title}
                actionButtons={[]}
                shouldShowMenu={shouldShowMenu}
              />
            )}
          </FormLayout.Form>
          {shouldShowMenu && (
            <FormLayout.Footer>
              <FooterNavigation
                canNavigateBack={!isPreviousDisabled}
                canNavigateForward={!isNextDisabled}
                onBackTriggered={onHandlePrevious}
                onForwardTriggered={onHandleNext}
              />
            </FormLayout.Footer>
          )}
        </FormLayout.Content>
        <UnsavedChangesModal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          handleDiscardChanges={handleDiscardChanges}
        />
      </FormLayout.Body>
      {isAutosaveEnabled && <RecoveryModal />}
    </FormLayout>
  );
};

export const GenericFormRendererTranslated =
  withNamespaces()(GenericFormRenderer);
export default GenericFormRenderer;
