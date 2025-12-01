// @flow
import { useState, useEffect, useRef, useMemo } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import type { ToastId } from '@kitman/components/src/Toast/types';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { getAthleteData, formAnswerSetsDelete } from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { AppStatus, DelayedLoadingFeedback, TabBar } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AppHeaderTranslated as AppHeader } from '../AppHeader';
import FormOverviewTab from '../FormOverviewTab';
import useFormResultsData from '../../../../shared/hooks/useFormResultsData';
import FormAnswerSetsDelete from '../FormAnswerSetsDelete';

type Props = {
  formId: number,
  athleteId: string,
};

const ResultsFormDisplay = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { fetchFormResultsData, formResults, formInfo } = useFormResultsData();
  const [requestStatus, setRequestStatus] = useState('PENDING');
  const [concussionStatus, setConcussionStatus] = useState('PENDING');
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const locationAssign = useLocationAssign();
  const [tabHash, setTabHash] = useState(window.location.hash);
  // eslint-disable-next-line no-unused-vars
  const [reloadForm, setReloadForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialTab = useRef();
  const { toasts, toastDispatch } = useToasts();

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const openAndCloseModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const deleteSelectedForm = () => {
    setIsLoading(true);
    const formName = formInfo?.formMeta ? formInfo.formMeta.name : 'form';
    formAnswerSetsDelete(props.formId)
      .then(() => {
        setIsLoading(false);
        setOpenDeleteModal(false);

        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            id: 1,
            title: props.t('{{formName}} deleted', { formName }),
            status: 'SUCCESS',
          },
        });
        setTimeout(() => {
          locationAssign(`/medical/athletes/${props.athleteId}#concussion`);
        }, 1000);
      })
      .catch(() => {
        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            id: 1,
            title: props.t('Error deleting {{formName}}', { formName }),
            status: 'ERROR',
          },
        });
        setOpenDeleteModal(false);
        setIsLoading(false);
      });
  };

  const updateFormDetails = () => {
    setConcussionStatus('PENDING');

    if (
      !window.featureFlags['medical-forms-tab-iteration-1'] &&
      !window.featureFlags['concussion-entity-view']
    ) {
      return;
    }

    Promise.all([
      getAthleteData(parseInt(props.athleteId, 10)),
      fetchFormResultsData(props.formId),
    ])
      .then(([fetchedAthleteData]) => {
        setAthleteData(fetchedAthleteData);
        setRequestStatus('SUCCESS');
        setConcussionStatus('SUCCESS');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        setConcussionStatus('FAILURE');
      });
  };

  useEffect(() => {
    setReloadForm(tabHash === '#form');
  }, [tabHash]);

  useEffect(() => {
    updateFormDetails();
  }, [props.formId, permissions]);

  const tabPanes = useMemo(
    () =>
      [
        {
          title: props.t('Form overview'),
          content: (
            <FormOverviewTab
              sections={formResults || []}
              formInfo={formInfo}
              displayFormInfo={
                formInfo != null &&
                !formInfo.hideFormInfo &&
                formInfo.formMeta.key !== 'care_demographics'
              }
              concussionLoading={concussionStatus}
              requestStatus={requestStatus}
              formId={props.formId}
              athleteId={props.athleteId}
              updateForms={updateFormDetails}
            />
          ),
          tabHash: '#form',
          visible: true,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [formResults, permissions, requestStatus, concussionStatus]
  );

  initialTab.current =
    tabPanes.find((tabPane) => tabPane.tabHash === window.location.hash)
      ?.tabKey || '0';

  // Set the location hash when changing tab
  const onClickTab = (tabKey) => {
    const currentTabHash = tabPanes.find(
      (tabPane) => tabPane.tabKey === tabKey
    )?.tabHash;

    if (currentTabHash) {
      // We use location.replace so it does not push the page in the history.
      // This prevents the browser back button from redirecting the user to the
      // previous hash instead of the previous page
      window.location.replace(currentTabHash);
      setTabHash(currentTabHash);
    }
  };

  if (
    requestStatus === 'FAILURE' ||
    (!window.featureFlags['medical-forms-tab-iteration-1'] &&
      !window.featureFlags['concussion-entity-view'])
  ) {
    return <AppStatus status="error" isEmbed />;
  }

  if (Object.keys(permissions).length === 0 || requestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  return (
    <div>
      <AppHeader
        athleteData={athleteData}
        formInfo={formInfo?.formMeta}
        openDeleteModal={openAndCloseModal}
      />
      <TabBar
        customStyles=".rc-tabs-bar { padding: 0 24px; background-color:#ffffff }, .rc-tabs-tabpane { position: relative }"
        tabPanes={tabPanes.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={initialTab.current}
        kitmanDesignSystem
      />
      <FormAnswerSetsDelete
        isOpen={openDeleteModal}
        onClose={openAndCloseModal}
        onDelete={deleteSelectedForm}
        formMeta={formInfo?.formMeta}
        isLoading={isLoading}
        t={props.t}
      />
      <ToastDialog toasts={toasts} onCloseToast={closeToast} />
    </div>
  );
};

export const ResultsFormDisplayTranslated: ComponentType<Props> =
  withNamespaces()(ResultsFormDisplay);

export default ResultsFormDisplay;
