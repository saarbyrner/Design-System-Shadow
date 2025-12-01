// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import {
  DateRangePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
  TextTag,
  TooltipMenu,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { SelectOption as Option } from '@kitman/components/src/types';
import {
  saveReconciledDiagnostic,
  saveReviewedDiagnostics,
} from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { OrderProviderType } from '@kitman/services/src/services/medical/getOrderProviders';
import { colors } from '@kitman/common/src/variables';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { Toast } from '@kitman/components/src/Toast/types';

import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { convertDateRangeToTuple } from '@kitman/playbook/components/wrappers/CustomDateRangePicker/utils';
import { getDefaultDiagnosticFilters } from '../../../../utils';
import type {
  Diagnostic,
  DiagnosticFilter,
  IssueType,
  RequestStatus,
} from '../../../../types';
import { useDiagnosticTabForm } from '../../contexts/DiagnosticTabFormContext';
import PACSButton from './components/PACSButton';
import {
  getPACSUploaderLink,
  getPACSViewerLink,
  getProviderOptions,
} from './utils';
import style from './style';
import { useBulkActions } from '../../contexts/BulkActions';
import {
  ADD_DIAGNOSTIC_BUTTON,
  SAVE_DIAGNOSTIC_BUTTON,
} from '../../../../constants/elementTags';

type SetRequestStatusFunction = (
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
) => void;
type Props = {
  squads: Array<Option>,
  filters: DiagnosticFilter,
  athleteId?: number,
  issueId?: number,
  issueType: IssueType,
  issue: IssueOccurrenceRequested,
  onChangeFilter: (filter: DiagnosticFilter) => void,
  onClickAddDiagnostic: Function,
  onClickExportRosterBilling: Function,
  onClickDownloadDiagnostics: Function,
  initialDataRequest: RequestStatus,
  hiddenFilters?: Array<string>,
  isExporting: boolean,
  showDownloadDiagnostics: boolean,
  currentUser: CurrentUserData,
  currentOrganisation: Organisation,
  athleteExternalId?: string,
  statuses: Array<Option>,
  medicalLocations: Array<Option>,
  diagnosticReasons: Array<{
    value: number,
    label: string,
    isInjuryIllness: boolean,
  }>,
  diagnosticResultTypes: Array<Option>,
  orderProviders: OrderProviderType,
  isRedoxOrg: boolean,
  diagnostics: Array<Diagnostic>,
  onSaveReconciledDiagnostics: Function,
  onSavedReviewDiagnostics: () => void,
  setRequestStatus: SetRequestStatusFunction,
  athleteData?: AthleteData,
  toasts: Array<Toast>,
  toastAction: Function,
};

type HandleSaveParams = {
  saveData: () => Promise<any>,
  onSuccessAction: () => void,
  successToastId: string,
  errorToastId: string,
  countItems: () => number,
  additionalActions: (() => void)[],
};

const styles = {
  titleContainer: css`
    display: flex;
    align-items: center;
    width: 100%;
  `,
  button: css`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    outline: inherit;
    margin-left: 16px;
  `,
};

const DiagnosticFilters = (props: I18nProps<Props>) => {
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);
  const { permissions } = usePermissions();
  const playerOnTrial =
    props.athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE';

  // this requestStatus is only for the saveButton
  // so only care if pending or not. Also, still need to
  // set request status for whole app for error handling
  const [saveRequestStatus, setSaveRequestStatus] = useState<
    'DORMANT' | 'PENDING'
  >('DORMANT');

  const [statusOptionValue, setStatusOptionValue] = useState(null);

  const { diagnosticTabFormState, clearQueuedReconciledDiagnostics } =
    useDiagnosticTabForm();

  const { bulkActionsState, updateBulkActionsMode, clearBulkActions } =
    useBulkActions();

  const renderSearchFilter = (
    <div css={style.filter}>
      <InputTextField
        data-testid="DiagnosticFilters|Search"
        placeholder={props.t('Search')}
        value={props.filters.search_expression}
        onChange={({ target: { value } }) =>
          props.onChangeFilter({
            ...props.filters,
            search_expression: value,
          })
        }
        searchIcon
        kitmanDesignSystem
        disabled={props.initialDataRequest === 'PENDING'}
      />
    </div>
  );

  const renderDateFilter = () => {
    return (
      <div css={[style.filter, style['filter--daterange']]}>
        {!window.getFlag('pm-date-range-picker-custom') && (
          <DateRangePicker
            data-testid="DiagnosticFilters|DateRange"
            value={props.filters.date_range}
            placeholder={props.t('Date range')}
            onChange={(daterange) =>
              props.onChangeFilter({
                ...props.filters,
                date_range: daterange,
              })
            }
            isClearable
            turnaroundList={[]}
            allowFutureDate
            position="center"
            kitmanDesignSystem
            disabled={props.initialDataRequest === 'PENDING'}
          />
        )}

        {window.getFlag('pm-date-range-picker-custom') && (
          <CustomDateRangePicker
            variant="menuFilters"
            value={
              props.filters.date_range
                ? convertDateRangeToTuple(props.filters.date_range)
                : undefined
            }
            onChange={(daterange) => {
              if (props.onChangeFilter) {
                props.onChangeFilter({
                  ...props.filters,
                  date_range: daterange,
                });
              }
            }}
          />
        )}
      </div>
    );
  };

  const squadFilter = (
    <div css={style.filter} data-testid="DiagnosticFilters|SquadFilter">
      <Select
        placeholder={props.t('Roster')}
        value={props.filters.squads}
        options={props.squads}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            squads: id,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const getStatusOptions = () => {
    return (
      props.statuses?.filter((status) =>
        props.athleteId ? status.label !== 'Unreconciled' : status
      ) || []
    );
  };

  const reviewedFilterOptions = [
    { value: false, label: props.t('Unreviewed') },
    { value: true, label: props.t('Reviewed') },
  ];

  const combinedOptions = [
    {
      label: 'Statuses',
      options: getStatusOptions(),
    },
    {
      label: 'Review',
      options: reviewedFilterOptions,
    },
  ];

  const handleStatusChange = (selectedOptions) => {
    const selectedReviewBooleansOptions = selectedOptions.filter(
      (option) => typeof option === 'boolean'
    );

    const isBothReviewOptionsSelected =
      selectedReviewBooleansOptions.includes(true) &&
      selectedReviewBooleansOptions.includes(false);

    let reviewedValue;

    if (isBothReviewOptionsSelected) {
      reviewedValue = null;
    } else if (selectedReviewBooleansOptions.length > 0) {
      reviewedValue = selectedReviewBooleansOptions[0];
    } else {
      reviewedValue = null;
    }

    const statusesOptions = selectedOptions.filter(
      (option) => typeof option !== 'boolean'
    );

    const combinedSelectedOptions = [
      ...statusesOptions,
      ...selectedReviewBooleansOptions,
    ];

    setStatusOptionValue(combinedSelectedOptions);

    props.onChangeFilter({
      ...props.filters,
      statuses: statusesOptions,
      reviewed: reviewedValue,
    });
  };

  const statusFilter = (
    <div css={style.filter} data-testid="DiagnosticFilters|StatusFilter">
      <Select
        placeholder={props.t('Status')}
        value={statusOptionValue}
        options={combinedOptions}
        onChange={handleStatusChange}
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const locationFilter = (
    <div css={style.filter} data-testid="DiagnosticFilters|LocationFilter">
      <Select
        placeholder={props.t('Company')}
        value={props.filters.diagnostic_location_ids}
        options={props.medicalLocations || []}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            diagnostic_location_ids: id,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const resultTypeFilter = (
    <div css={style.filter} data-testid="DiagnosticFilters|ResultTypeFilter">
      <Select
        placeholder={props.t('Type')}
        value={props.filters.result_type}
        options={props.diagnosticResultTypes || []}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            result_type: id,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const providerFilter = (
    <div css={[style.filter]} data-testid="DiagnosticFilters|ProviderFilter">
      <Select
        placeholder={props.t('Order provider')}
        value={props.filters.provider_sgids}
        options={getProviderOptions(props.orderProviders) || []}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            provider_sgids: id,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const reasonFilter = (
    <div css={style.filter} data-testid="DiagnosticFilters|ReasonFilter">
      <Select
        placeholder={props.t('Reason')}
        value={props.filters.diagnostic_reason_ids}
        options={props.diagnosticReasons || []}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            diagnostic_reason_ids: id,
          })
        }
        isDisabled={props.initialDataRequest === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const handleSave = ({
    saveData,
    onSuccessAction,
    successToastId,
    errorToastId,
    countItems,
    additionalActions,
  }: HandleSaveParams) => {
    props.setRequestStatus('PENDING');
    setSaveRequestStatus('PENDING');
    saveData()
      .then(() => {
        props.setRequestStatus('SUCCESS');
        onSuccessAction();
        if (window.featureFlags['diagnostics-tab-bulk-actions']) {
          const count = countItems();
          props.toastAction({
            type: 'UPDATE_TOAST',
            toast: {
              id: successToastId,
              status: 'SUCCESS',
              title: `${count} ${
                count === 1 ? props.t('diagnostic') : props.t('diagnostics')
              } updated successfully`,
            },
          });
        }
        additionalActions.forEach((action) => action());
        setSaveRequestStatus('DORMANT');
      })
      .catch(() => {
        props.setRequestStatus('FAILURE');
        if (window.featureFlags['diagnostics-tab-bulk-actions']) {
          props.toastAction({
            type: 'UPDATE_TOAST',
            toast: {
              id: errorToastId,
              title: props.t('There was an error'),
              description: props.t(
                'There was an error while updating diagnostics'
              ),
              status: 'ERROR',
              links: [
                {
                  id: 1,
                  text: props.t('Try again'),
                  link: '#',
                  withHashParam: true,
                  metadata: {
                    action: 'RETRY_REQUEST',
                  },
                },
              ],
            },
          });
        }
        setSaveRequestStatus('DORMANT');
      });
  };

  const onSave = () => {
    const allRequiredFieldsAreValid =
      diagnosticTabFormState.queuedReconciledDiagnostics.every(
        ({ athleteId, diagnosticId }) => athleteId && diagnosticId
      );
    if (!allRequiredFieldsAreValid) return;

    const data = () => {
      return Promise.all(
        diagnosticTabFormState.queuedReconciledDiagnostics.map(
          ({ athleteId, diagnosticId, reasonId, issue }) => {
            return saveReconciledDiagnostic(
              athleteId,
              diagnosticId,
              reasonId,
              issue
            );
          }
        )
      );
    };

    handleSave({
      saveData: data,
      onSuccessAction: props.onSaveReconciledDiagnostics,
      successToastId: 'reconcileDiagnosticsSuccess',
      errorToastId: 'reconcileDiagnosticsError',
      countItems: () =>
        diagnosticTabFormState.queuedReconciledDiagnostics.filter(
          (item) => item
        ).length,
      additionalActions: [clearQueuedReconciledDiagnostics, clearBulkActions],
    });
  };

  const onSaveReview = () => {
    const checkedDiagnostics = props.diagnostics.filter((item) =>
      bulkActionsState.bulkActionsDiagnostics.includes(item.id)
    );
    const redoxResults = checkedDiagnostics.map((diagnostic) => ({
      diagnostic_id: diagnostic.id,
      reviewed: true,
    }));

    const data = () => {
      return saveReviewedDiagnostics(redoxResults);
    };

    handleSave({
      saveData: data,
      onSuccessAction: props.onSavedReviewDiagnostics,
      successToastId: 'reviewDiagnosticsSuccess',
      errorToastId: 'reviewDiagnosticsError',
      countItems: () => checkedDiagnostics.length,
      additionalActions: [clearBulkActions],
    });
  };

  const onCancel = () => {
    clearQueuedReconciledDiagnostics();
    clearBulkActions();
  };

  const closeToast = (id) => {
    props.toastAction({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const onClickToastLink = (toastLink) => {
    if (toastLink?.metadata?.action === 'RETRY_RECONCILE_REQUEST') {
      closeToast('reconcileDiagnosticsError');
      onSave();
    } else if (toastLink?.metadata?.action === 'RETRY_REVIEW_REQUEST') {
      closeToast('reviewDiagnosticsError');
      onSaveReview();
    }
  };

  const showReconcileButton = () => {
    const diagnosticsSelected = props.diagnostics.filter((item) =>
      bulkActionsState.bulkActionsDiagnostics.includes(item.id)
    );

    const rowsToReconcilePlayer = diagnosticsSelected.filter(
      (item) => !item.athlete
    );

    const rowsToReconcileReason = diagnosticsSelected.filter(
      (item) => !item.diagnostic_reason
    );

    if (!rowsToReconcilePlayer.length && !rowsToReconcileReason.length) {
      return false;
    }

    return true;
  };

  const showReviewButton = () => {
    const diagnosticsSelected = props.diagnostics.filter((item) =>
      bulkActionsState.bulkActionsDiagnostics.includes(item.id)
    );

    const hasReviewedItem = diagnosticsSelected.some(
      (item) => item.reviewed !== null
    );
    const allItemsMeetCriteria = diagnosticsSelected.every(
      (item) => item.athlete && item.diagnostic_reason
    );

    const isSingleReviewedItem =
      diagnosticsSelected.length === 1 &&
      diagnosticsSelected[0].reviewed === true;

    return hasReviewedItem && allItemsMeetCriteria && !isSingleReviewedItem;
  };

  const visibleOnBulkActionsMode =
    (diagnosticTabFormState.rowsToReconcile.length !== 0 &&
      !bulkActionsState.bulkActionsMode) ||
    (diagnosticTabFormState.rowsToReconcile.length === 0 &&
      bulkActionsState.bulkActionsMode) ||
    diagnosticTabFormState?.queuedReconciledDiagnostics?.length !== 0;

  const visibleOnBulkActionsSelect =
    !bulkActionsState.bulkActionsMode &&
    bulkActionsState.bulkActionsDiagnostics.length !== 0 &&
    showReconcileButton();

  const visibleOnBulkReviewActionsSelect =
    !bulkActionsState.bulkActionsMode &&
    bulkActionsState.bulkActionsDiagnostics.length > 0 &&
    showReviewButton();

  const visibleByDefault =
    bulkActionsState.bulkActionsDiagnostics.length === 0 &&
    diagnosticTabFormState.rowsToReconcile.length === 0 &&
    diagnosticTabFormState.queuedReconciledDiagnostics.length === 0;

  const renderDesktopActionButtons = () => {
    if (props.hiddenFilters?.includes(ADD_DIAGNOSTIC_BUTTON)) return null;
    const desktopActionButtons = [
      {
        key: 'save',
        text: props.t('Save'),
        type: 'primary',
        onClick: () => onSave(),
        isVisible: props.isRedoxOrg && visibleOnBulkActionsMode,
        isDisabled:
          diagnosticTabFormState.queuedReconciledDiagnostics.length === 0,
        isLoading: saveRequestStatus === 'PENDING',
      },
      {
        key: 'discardChanges',
        text: props.t('Discard changes'),
        type: 'secondary',
        onClick: () => onCancel(),
        isVisible: props.isRedoxOrg && visibleOnBulkActionsMode,
      },
      {
        key: 'add',
        text: props.t('Add diagnostic'),
        type: 'primary',
        onClick: () => props.onClickAddDiagnostic(),
        isVisible:
          permissions.medical.diagnostics.canCreate && visibleByDefault,
        isDisabled:
          props.isRedoxOrg &&
          diagnosticTabFormState.queuedReconciledDiagnostics.length !== 0,
      },
      {
        key: 'exportRosterBilling',
        text: props.t('Export billing'),
        type: 'secondary',
        onClick: () => props.onClickExportRosterBilling(),
        isVisible:
          window.featureFlags['export-billing-buttons-team-level'] &&
          permissions.medical.issues.canExport &&
          !props.isRedoxOrg &&
          !props.showDownloadDiagnostics &&
          visibleByDefault,
        isDisabled: props.isExporting,
      },
      {
        key: 'downloadDiagnostics',
        testId: 'DiagnosticFilters|ExportBilling',
        text: props.t('Export billing'),
        type: 'secondary',
        onClick: () => props.onClickDownloadDiagnostics(),
        isVisible:
          !props.isRedoxOrg &&
          window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] &&
          permissions.medical.issues.canExport &&
          props.showDownloadDiagnostics &&
          visibleByDefault,
        isDisabled: props.isExporting,
      },
      {
        key: 'bulkReconcile',
        text: props.t('Reconcile'),
        type: 'secondary',
        onClick: () => updateBulkActionsMode({ status: true }),
        isVisible: props.isRedoxOrg && visibleOnBulkActionsSelect,
      },
      {
        key: 'bulkReview',
        text: props.t('Review'),
        type: 'secondary',
        onClick: () => onSaveReview(),
        isVisible: props.isRedoxOrg && visibleOnBulkReviewActionsSelect,
      },
    ];

    return desktopActionButtons
      .filter((btn) => btn.isVisible || false)
      .map((btn) => {
        return (
          <div key={btn.key}>
            <TextButton
              data-testid={btn.testId || ''}
              key={btn.key}
              text={btn.text}
              type={btn.type}
              onClick={btn.onClick}
              isDisabled={btn.isDisabled || false}
              isLoading={btn.isLoading || false}
              kitmanDesignSystem
            />
          </div>
        );
      });
  };

  const renderPacsButtons = () => {
    const pacsButtons = [
      {
        key: 'pacsViewer',
        textForButton: props.t('PACS viewer'),
        href: getPACSViewerLink(
          props.issue,
          props.athleteData || null,
          props.athleteExternalId || null,
          props.currentOrganisation
        ),
        isVisible:
          window.featureFlags['medical-diagnostics-ambra'] && visibleByDefault,
      },
      {
        key: 'pacsUploader',
        textForButton: props.t('PACS uploader'),
        href: getPACSUploaderLink(
          props.athleteData || null,
          props.athleteExternalId || null,
          props.currentOrganisation,
          props.currentUser
        ),
        isVisible:
          window.featureFlags['medical-diagnostics-ambra'] &&
          visibleByDefault &&
          !props.hiddenFilters?.includes(ADD_DIAGNOSTIC_BUTTON),
      },
    ];

    return pacsButtons
      .filter((btn) => btn.isVisible)
      .map((btn) => {
        return (
          <PACSButton
            key={btn.key}
            textForButton={btn.textForButton}
            href={btn.href}
            isRedoxOrg={props.isRedoxOrg}
            diagnosticTabFormState={diagnosticTabFormState}
          />
        );
      });
  };

  const getMobileMenuItems = () => {
    const mobileMenuItems: Array<TooltipItem> = [];

    if (permissions.medical.diagnostics.canCreate) {
      mobileMenuItems.push({
        description: props.t('Add diagnostic'),
        onClick: props.onClickAddDiagnostic,
      });
    }

    if (window.featureFlags['medical-diagnostics-ambra'] && !playerOnTrial) {
      mobileMenuItems.push(
        {
          description: props.t('PACS Viewer'),
          href: getPACSViewerLink(
            props.issue,
            props.athleteData || null,
            props.athleteExternalId || null,
            props.currentOrganisation
          ),
          isExternalLink: true,
        },
        {
          description: props.t('PACS Uploader'),
          href: getPACSUploaderLink(
            props.athleteData || null,
            props.athleteExternalId || null,
            props.currentOrganisation,
            props.currentUser
          ),
          isExternalLink: true,
        }
      );
    }
    return mobileMenuItems;
  };

  const renderAddDiagnosticButton = () => {
    if (props.hiddenFilters?.includes(ADD_DIAGNOSTIC_BUTTON)) return null;
    return (
      permissions.medical.diagnostics.canCreate && (
        <TextButton
          data-testid="DiagnosticFilters|AddDiagnostic"
          text={props.t('Add diagnostic')}
          type="primary"
          kitmanDesignSystem
          onClick={props.onClickAddDiagnostic}
          isDisabled={
            props.isRedoxOrg &&
            diagnosticTabFormState.queuedReconciledDiagnostics.length > 0
          }
        />
      )
    );
  };

  const renderSaveDiagnosticButton = () => {
    if (props.hiddenFilters?.includes(SAVE_DIAGNOSTIC_BUTTON)) return null;
    return (
      props.isRedoxOrg && (
        <div>
          <TextButton
            text={props.t('Save')}
            type="primary"
            onClick={onSave}
            isLoading={saveRequestStatus === 'PENDING'}
            kitmanDesignSystem
            isDisabled={
              diagnosticTabFormState.queuedReconciledDiagnostics.length === 0
            }
          />
        </div>
      )
    );
  };

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <div css={styles.titleContainer}>
          <h3 css={style.title}>{props.t('Diagnostics')}</h3>
          {props.isRedoxOrg && (
            <div css={styles.button}>
              <TextTag
                content={props.t('{{numFields}} incomplete', {
                  numFields: props.diagnostics.filter((diagnostic) => {
                    return !diagnostic.diagnostic_reason;
                  }).length,
                })}
                backgroundColor={colors.red_100_20}
                textColor={colors.red_300}
              />
            </div>
          )}
        </div>
        <div css={style.actions}>
          {window.featureFlags['diagnostics-tab-bulk-actions'] ? (
            <>
              {renderDesktopActionButtons()}
              {!playerOnTrial && renderPacsButtons()}
            </>
          ) : (
            <>
              {renderSaveDiagnosticButton()}

              {renderAddDiagnosticButton()}
              {window.featureFlags['export-billing-buttons-team-level'] &&
                permissions.medical.issues.canExport &&
                !props.isRedoxOrg &&
                !props.showDownloadDiagnostics && (
                  <TextButton
                    data-testid="DiagnosticFilters|ExportRosterBilling"
                    text={props.t('Export billing')}
                    isDisabled={props.isExporting}
                    type="secondary"
                    kitmanDesignSystem
                    onClick={props.onClickExportRosterBilling}
                  />
                )}
              {!props.isRedoxOrg &&
                window.featureFlags[
                  'medical-diagnostics-iteration-3-billing-cpt'
                ] &&
                permissions.medical.issues.canExport &&
                props.showDownloadDiagnostics && (
                  <TextButton
                    data-testid="DiagnosticFilters|ExportBilling"
                    text={props.t('Export billing')}
                    type="secondary"
                    kitmanDesignSystem
                    onClick={props.onClickDownloadDiagnostics}
                  />
                )}
              {window.featureFlags['medical-diagnostics-ambra'] &&
                !playerOnTrial && (
                  <div css={style.actions}>
                    <PACSButton
                      textForButton={props.t('PACS viewer')}
                      href={getPACSViewerLink(
                        props.issue,
                        props.athleteData || null,
                        props.athleteExternalId || null,
                        props.currentOrganisation
                      )}
                      isRedoxOrg={props.isRedoxOrg}
                      diagnosticTabFormState={diagnosticTabFormState}
                    />
                    {!props.hiddenFilters?.includes(ADD_DIAGNOSTIC_BUTTON) && (
                      <PACSButton
                        textForButton={props.t('PACS uploader')}
                        href={getPACSUploaderLink(
                          props.athleteData || null,
                          props.athleteExternalId || null,
                          props.currentOrganisation,
                          props.currentUser
                        )}
                        isRedoxOrg={props.isRedoxOrg}
                        diagnosticTabFormState={diagnosticTabFormState}
                      />
                    )}
                  </div>
                )}
            </>
          )}
        </div>
        <div css={style.mobileActions}>
          {diagnosticTabFormState.queuedReconciledDiagnostics.length === 0 && (
            <TooltipMenu
              data-testid="DiagnosticTab|MobileActions"
              placement="bottom-end"
              menuItems={getMobileMenuItems()}
              tooltipTriggerElement={
                <TextButton
                  iconAfter="icon-more"
                  type="subtle"
                  kitmanDesignSystem
                />
              }
              kitmanDesignSystem
            />
          )}
          {diagnosticTabFormState.queuedReconciledDiagnostics.length > 0 && (
            <TextButton
              text={props.t('Save')}
              type="primary"
              onClick={onSave}
              kitmanDesignSystem
              isDisabled={
                diagnosticTabFormState.queuedReconciledDiagnostics.length === 0
              }
            />
          )}
        </div>
      </div>

      <div css={style.filters}>
        {renderSearchFilter}
        {props.isRedoxOrg && resultTypeFilter}
        {renderDateFilter()}
        {!props.hiddenFilters?.includes('squads') && squadFilter}
        {props.isRedoxOrg && statusFilter}
        {props.isRedoxOrg && reasonFilter}
        {props.isRedoxOrg && locationFilter}
        {props.isRedoxOrg && providerFilter}
        {props.isRedoxOrg && (
          <div css={style.filter} data-testid="DiagnosticFilters|ClearButton">
            <TextButton
              text={props.t('Clear filters')}
              type="secondary"
              kitmanDesignSystem
              onClick={() => {
                setStatusOptionValue(null);
                const filters = getDefaultDiagnosticFilters({
                  athleteId: props.athleteId || null,
                  issueType: props.issueType || null,
                  issueId: props.issueId || null,
                });
                props.onChangeFilter(filters);
              }}
            />
          </div>
        )}
      </div>
      <div css={style.tabletFilters}>
        {renderDateFilter()}
        <div css={style.tableFiltersButtons}>
          <TextButton
            text={props.t('Filters')}
            iconAfter="icon-filter"
            type="secondary"
            onClick={() => setIsFilterPanelShown(true)}
            kitmanDesignSystem
          />
          {props.isRedoxOrg && (
            <div data-testid="DiagnosticFilters|ClearButton">
              <TextButton
                text={props.t('Clear filters')}
                type="secondary"
                kitmanDesignSystem
                onClick={() => {
                  const filters = getDefaultDiagnosticFilters({
                    athleteId: props.athleteId || null,
                    issueType: props.issueType || null,
                    issueId: props.issueId || null,
                    reviewed: null,
                  });
                  props.onChangeFilter(filters);
                }}
              />
            </div>
          )}
        </div>

        <SlidingPanelResponsive
          isOpen={isFilterPanelShown}
          title={props.t('Filters')}
          onClose={() => setIsFilterPanelShown(false)}
        >
          <div css={style.tabletFiltersPanel}>
            {!props.hiddenFilters?.includes('squads') && squadFilter}
            {renderSearchFilter}
            {props.isRedoxOrg && resultTypeFilter}
            {props.isRedoxOrg && statusFilter}
            {props.isRedoxOrg && reasonFilter}
            {props.isRedoxOrg && locationFilter}
            {props.isRedoxOrg && providerFilter}
          </div>
        </SlidingPanelResponsive>
      </div>
      <div css={style.mobileFilters}>
        <div css={style.mobileDateFilterContainer}>{renderDateFilter()}</div>
        <div css={style.tableFiltersButtons}>
          <TextButton
            text={props.t('Filters')}
            iconAfter="icon-filter"
            type="secondary"
            onClick={() => setIsFilterPanelShown(true)}
            kitmanDesignSystem
          />
          <div data-testid="DiagnosticFilters|ClearButton">
            <TextButton
              text={props.t('Clear filters')}
              type="secondary"
              kitmanDesignSystem
              onClick={() => {
                const filters = getDefaultDiagnosticFilters({
                  athleteId: props.athleteId || null,
                  issueType: props.issueType || null,
                  issueId: props.issueId || null,
                  reviewed: null,
                });
                props.onChangeFilter(filters);
              }}
            />
          </div>
        </div>
        <SlidingPanelResponsive
          isOpen={isFilterPanelShown}
          title={props.t('Filters')}
          onClose={() => setIsFilterPanelShown(false)}
        >
          <div css={style.mobileFiltersPanel}>
            {renderSearchFilter}
            {!props.hiddenFilters?.includes('squads') && squadFilter}
            {props.isRedoxOrg && resultTypeFilter}
            {props.isRedoxOrg && statusFilter}
            {props.isRedoxOrg && reasonFilter}
            {props.isRedoxOrg && locationFilter}
            {props.isRedoxOrg && providerFilter}
          </div>
        </SlidingPanelResponsive>
      </div>

      <ToastDialog
        toasts={props.toasts}
        onClickToastLink={onClickToastLink}
        onCloseToast={closeToast}
      />
    </header>
  );
};

export const DiagnosticFiltersTranslated: ComponentType<Props> =
  withNamespaces()(DiagnosticFilters);
export default DiagnosticFilters;
