// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import {
  EditableInput,
  Link,
  TextButton,
  TextTag,
  TooltipMenu,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { useMemo, useState } from 'react';
import { saveIssue } from '@kitman/services';
import LoadingSpinner from '@kitman/components/src/LoadingSpinner';
import type { RequestResponse as AthleteMedicalAlertResponse } from '@kitman/modules/src/Medical/shared/types/medical/MedicalAlertData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  getLevelAndTab,
  getNoteActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import type { ConcussionTestProtocol } from '@kitman/modules/src/Medical/shared/types';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import {
  getRequestedIssueTitle,
  getPathologyTitle,
  getBamicGradeTitle,
} from '../../../../shared/utils';

type Props = {
  isConcussion: boolean,
  athleteData: AthleteData,
  tabHash: string,
  athleteMedicalAlerts: Array<AthleteMedicalAlertResponse>,
  onOpenAddDiagnosticSidePanel: () => void,
  onOpenAddMedicalNotePanel: () => void,
  onOpenAddModificationSidePanel: () => void,
  onOpenAddAllergySidePanel: () => void,
  onOpenAddMedicalAlertSidePanel: () => void,
  onOpenAddProcedureSidePanel: () => void,
  onOpenAddTreatmentsSidePanel: () => void,
  onOpenAddConcussionTestResultSidePanel: (
    testProtocol: ConcussionTestProtocol
  ) => void,
  onOpenAddTUESidePanel: () => void,
  onOpenAddWorkersCompSidePanel: () => void,
  onOpenAddOshaFormSidePanel: () => void,
  setIsMedicalDocumentPanelOpen: (boolean) => void,
  setIsMedicalFilePanelOpen: (boolean) => void,
  openInjuryExportSidePanel: () => void,
  openAncillaryRangeSidePanel: () => void,
};

const style = {
  header: css`
    background-color: ${colors.white};
    ${!window.featureFlags['update-perf-med-headers'] && `padding: 24px;`}
    ${window.featureFlags['update-perf-med-headers'] &&
    `padding: 10px 24px 0px;`}
  `,
  flex: {
    display: 'flex',
    gap: '6px',
  },
  actions: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  athleteSection: css`
    display: flex;
    width: 100%;
    ${window.featureFlags['update-perf-med-headers'] && `align-items: center;`}
  `,
  backlink: css`
    align-items: center;
    color: ${colors.grey_100} !important;
    display: flex;
    ${!window.featureFlags['update-perf-med-headers'] && `margin-bottom: 16px;`}
    ${window.featureFlags['update-perf-med-headers'] && `margin-bottom: 8px;`}
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;

    &:hover {
      color: ${colors.grey_100};
      text-decoration: underline;
    }

    i {
      display: inline-block;
      margin-right: 4px;
    }
  `,
  athleteAvatar: css`
    border-radius: 50%;
    ${!window.featureFlags['update-perf-med-headers'] &&
    `height: 84px; width: 84px;`}
    ${window.featureFlags['update-perf-med-headers'] &&
    `height: 40px; width: 40px;`}
  `,
  athleteContent: css`
    ${!window.featureFlags['update-perf-med-headers'] &&
    `margin: 4px 0 0 24px;`}
    ${window.featureFlags['update-perf-med-headers'] && `margin: 4px 0 0 8px;`}
    width: 100%;
    overflow: hidden;
    margin-right: 0px;
  `,
  dayOfInjury: css`
    color: ${colors.grey_300};
    ${window.featureFlags['update-perf-med-headers'] && `margin-bottom: 0px;`}
  `,
  athleteNameWrapper: css`
    ${!window.featureFlags['update-perf-med-headers'] && `margin-bottom: 12px;`}
    ${window.featureFlags['update-perf-med-headers'] && `display: flex;`}
  `,
  athleteName: css`
    ${!window.featureFlags['update-perf-med-headers'] &&
    `font-size: 24px; margin: 0 22px 0 0;`}
    ${window.featureFlags['update-perf-med-headers'] &&
    `font-size: 20px; line-height: 24px; margin: 0 16px 0 0;`}
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    margin: 0 16px 0 0;
    white-space: nowrap;
    display: flex;
    gap: 8px;
  `,
  editTitleIcon: css`
    margin-left: 8px;
    cursor: pointer;
  `,
  athleteAllergies: css`
    ${!window.featureFlags['update-perf-med-headers'] &&
    `margin-top: 7px; margin-right: 12px;`}
    ${window.featureFlags['update-perf-med-headers'] && `align-items: center;`}
    display: flex;
    overflow: auto;
  `,
  athleteAllergy: css`
    ${!window.featureFlags['update-perf-med-headers'] && `margin-right: 12px;`}
    ${window.featureFlags['update-perf-med-headers'] && `margin-right: 4px;`}
  `,
  noDataContent: css`
    text-align: center;
    display: block;
  `,
  loaderWrapper: css`
    margin: 0 8px;
  `,
  exportBtn: css`
    margin-left: 6px;
  `,
};

const AppHeader = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { issue, issueType, updateIssue, isChronicIssue, isReadOnly } =
    useIssue();
  const isPastAthlete = !!props.athleteData?.org_last_transfer_record?.left_at;

  const { trackEvent } = useEventTracking();

  const getMenuItems = () => {
    const menuItems: Array<TooltipItem> = [];

    if (permissions.medical.notes.canCreate) {
      menuItems.push({
        description: props.t('Note'),
        onClick: () => {
          trackEvent(performanceMedicineEventNames.clickAddMedicalNote, {
            ...getLevelAndTab('issue', tabHashes.ISSUE),
            ...getNoteActionElement('Add menu'),
          });
          props.onOpenAddMedicalNotePanel();
        },
      });
    }

    if (permissions.medical.modifications.canCreate && !isPastAthlete) {
      menuItems.push({
        description: props.t('Modification'),
        onClick: props.onOpenAddModificationSidePanel,
      });
    }

    if (permissions.medical.diagnostics.canCreate) {
      menuItems.push({
        description: props.t('Diagnostic'),
        onClick: props.onOpenAddDiagnosticSidePanel,
      });
    }

    if (
      window.featureFlags['medical-documents-files-area'] &&
      permissions.medical.documents.canCreate
    ) {
      menuItems.push({
        description: props.t('File'),
        onClick: () => {
          props.setIsMedicalFilePanelOpen(true);
        },
      });
    }

    if (permissions.medical.treatments.canCreate) {
      menuItems.push({
        description: props.t('Treatment'),
        onClick: props.onOpenAddTreatmentsSidePanel,
      });
    }

    if (permissions.medical.allergies.canCreate && !isPastAthlete) {
      menuItems.push({
        description: props.t('Allergy'),
        onClick: props.onOpenAddAllergySidePanel,
      });
    }

    if (
      window.featureFlags['medical-alerts-side-panel'] &&
      permissions.medical.alerts.canCreate &&
      !isPastAthlete
    ) {
      menuItems.push({
        description: props.t('Medical alert'),
        onClick: props.onOpenAddMedicalAlertSidePanel,
      });
    }

    if (
      window.featureFlags['medical-procedure'] &&
      permissions.medical.procedures.canCreate
    ) {
      menuItems.push({
        description: props.t('Procedure'),
        onClick: props.onOpenAddProcedureSidePanel,
      });
    }

    if (permissions.medical.tue.canCreate && !isPastAthlete && window.getFlag('pm-show-tue')) {
      menuItems.push({
        description: props.t('TUE'),
        onClick: props.onOpenAddTUESidePanel,
      });
    }

    if (
      window.featureFlags['concussion-medical-area'] &&
      props.isConcussion &&
      (permissions.concussion.canManageConcussionAssessments ||
        permissions.concussion.canManageNpcAssessments ||
        permissions.concussion.canManageKingDevickAssessments)
    ) {
      const subMenuItems = [];
      if (
        permissions.concussion.canManageConcussionAssessments ||
        permissions.concussion.canManageNpcAssessments
      ) {
        subMenuItems.push({
          description: props.t('Near point of convergence (NPC)'),
          onClick: () => {
            props.onOpenAddConcussionTestResultSidePanel('NPC');
          },
        });
      }
      if (
        permissions.concussion.canManageConcussionAssessments ||
        permissions.concussion.canManageKingDevickAssessments
      ) {
        subMenuItems.push({
          description: props.t('King-Devick'),
          onClick: () => {
            props.onOpenAddConcussionTestResultSidePanel('KING-DEVICK');
          },
        });
      }

      menuItems.push({
        description: props.t('Concussion test'),
        subMenuItems,
        subMenuAlignment: 'left',
      });
    }

    if (
      window.featureFlags['workers-comp'] &&
      permissions.medical.workersComp.canEdit &&
      !issue.workers_comp?.status
    ) {
      menuItems.push({
        description: props.t("Workers' comp claim"),
        onClick: props.onOpenAddWorkersCompSidePanel,
      });
    }

    if (
      window.getFlag('pm-mls-emr-demo-froi') &&
      permissions.medical.workersComp.canEdit &&
      !issue.workers_comp?.status
    ) {
      menuItems.push({
        description: props.t('FROI'),
        onClick: props.onOpenAddWorkersCompSidePanel,
      });
    }

    if (
      window.featureFlags['osha-form'] &&
      permissions.medical.osha.canEdit &&
      !issue.osha?.status
    ) {
      menuItems.push({
        description: props.t('OSHA Form 301'),
        onClick: props.onOpenAddOshaFormSidePanel,
      });
    }

    return menuItems;
  };

  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const title = useMemo(() => {
    return getRequestedIssueTitle(issue);
  }, [issue]);

  const setTitle = (newTitle) => {
    updateIssue({
      ...issue,
      issue_occurrence_title: newTitle,
    });
  };

  const getTitle = (): string => {
    if (isChronicIssue) {
      // TODO, remove this when we have a typesafe
      // way of supporting IssueOccurrenceRequested & ChronicIssueRequested
      // $FlowFixMe
      const issueTitle: string = issue.title || issue.pathology || '';

      if (window.featureFlags['injury-illness-name']) {
        return issueTitle || getBamicGradeTitle(issue);
      }
      return issueTitle || '';
    }

    return getPathologyTitle(issue);
  };

  const saveIssueTitle = (inputValue) => {
    const oldTitle = title;
    const newTitle = inputValue === '' ? null : inputValue;
    const updatedParams = {
      issue_occurrence_title: newTitle,
      // The following keys (which hold id values) are only sent/populated on update, we receive and store them as object
      presentation_type_id: issue.presentation_type?.id,
      issue_contact_type_id: issue.issue_contact_type?.id,
    };

    setTitle(newTitle);
    setIsSavingTitle(true);
    saveIssue(issueType, issue, updatedParams)
      .catch(() => {
        // If theres an error then setting the old title
        setTitle(oldTitle);
      })
      .finally(() => {
        setIsSavingTitle(false);
      });
  };

  const saveChronicConditionTitle = (inputValue: string) => {
    const oldTitle = getTitle();
    const newTitle = inputValue !== '' ? inputValue : null;

    setTitle(inputValue);
    setIsSavingTitle(true);
    saveIssue(issueType, issue, { title: newTitle }, true)
      .catch(() => {
        // If theres an error then setting the old title
        setTitle(oldTitle);
      })
      .finally(() => {
        setIsSavingTitle(false);
      });
  };

  const canEditTitle = () => {
    return window.featureFlags['injury-illness-name'] && !isReadOnly;
  };

  const renderMenuDropdown = () => {
    if (isReadOnly) return <></>;
    return (
      permissions.medical.issues.canEdit &&
      !['#rehab', '#medical_notes', '#forms', '#medications'].includes(
        props.tabHash
      ) && (
        <TooltipMenu
          appendToParent
          placement="bottom-end"
          offset={[0, 5]}
          menuItems={getMenuItems()}
          tooltipTriggerElement={
            <TextButton
              text={props.t('Add')}
              iconAfter="icon-chevron-down"
              type="primary"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      )
    );
  };

  const renderDateOfInjury = () => {
    const daysSinceInjury = moment().diff(
      moment(issue.occurrence_date),
      'days'
    );
    const dayOrDays = daysSinceInjury === 1 ? 'day' : 'days';
    const formattedDate = DateFormatter.formatStandard({
      date: moment(issue.occurrence_date),
    });
    return `${props.t(
      'Date of'
    )} ${issueType}: ${formattedDate} (${daysSinceInjury} ${dayOrDays})`;
  };

  const renderAthleteName = () => (
    <span>{`${props.athleteData.fullname} - `}</span>
  );

  const renderTitle = () => {
    const renderEditableTitle = () => (
      <EditableInput
        value={isChronicIssue ? getTitle() : title}
        onSubmit={isChronicIssue ? saveChronicConditionTitle : saveIssueTitle}
        styles={{
          container: css`
            margin-top: -18px;
            input {
              min-width: 100px;
              max-width: 1000px;
              width: calc(${title.length}ch + 8px);
            }
          `,
        }}
        renderContent={({ value, onClick }) => (
          <span>
            {value}
            {!isSavingTitle && permissions.medical.issues.canEdit && (
              <i
                css={style.editTitleIcon}
                onClick={onClick}
                className="icon-edit"
              />
            )}
            {isSavingTitle && (
              <div css={style.loaderWrapper}>
                <LoadingSpinner size={30} color={colors.grey_400} />
              </div>
            )}
          </span>
        )}
        allowSavingEmpty
        maxWidth={1000}
        label={props.t('Title')}
        placeholder={`${getTitle()}${getBamicGradeTitle(issue)}`}
        maxLength={191}
        withMaxLengthCounter
      />
    );

    return (
      <>
        <h2 css={style.athleteName}>
          {renderAthleteName()}
          {canEditTitle() ? renderEditableTitle() : title}
        </h2>
        {!window.featureFlags['update-perf-med-headers'] &&
          props.tabHash === '#rehab' && (
            <p css={style.dayOfInjury}>{renderDateOfInjury()}</p>
          )}
      </>
    );
  };

  return (
    <header css={style.header}>
      <div css={style.actions}>
        <Link
          css={style.backlink}
          href={`/medical/athletes/${props.athleteData.id}`}
        >
          <i className="icon-next-left" />
          {props.t('Player overview')}
        </Link>
        {/* TODO: This should only be visible when on the Overview tab */}
        <div css={style.flex}>
          {renderMenuDropdown()}
          {window.featureFlags['nfl-ancillary-data'] &&
            permissions.general.ancillaryRange.canManage && (
              <TextButton
                text={props.t('Ancillary range')}
                type="secondary"
                onClick={() => props.openAncillaryRangeSidePanel()}
                kitmanDesignSystem
              />
            )}
          {window.featureFlags['injury-export-side-panel'] &&
            permissions.medical.issues.canExport && (
              <span css={style.exportBtn}>
                <TextButton
                  text={props.t('Export')}
                  type="secondary"
                  onClick={() => props.openInjuryExportSidePanel()}
                  kitmanDesignSystem
                />
              </span>
            )}
        </div>
      </div>
      <section css={style.athleteSection}>
        <img
          css={style.athleteAvatar}
          src={props.athleteData.avatar_url}
          alt={props.athleteData.fullname}
        />
        <div css={style.athleteContent}>
          <div css={style.athleteNameWrapper}>
            {renderTitle()}
            <div css={style.athleteAllergies}>
              {permissions.medical.allergies.canView &&
                (props.athleteData.allergy_names?.length > 0 ||
                  // $FlowIgnore[incompatible-use]
                  // $FlowIgnore[invalid-compare]
                  props.athleteData.allergies?.length > 0) &&
                props.athleteData.allergies?.map((allergy) => (
                  <div key={allergy.id} css={style.athleteAllergy}>
                    <TextTag
                      content={allergy.display_name}
                      backgroundColor={severityLabelColour(allergy.severity)}
                      textColor={
                        allergy.severity === 'severe'
                          ? colors.white
                          : colors.grey_400
                      }
                      fontSize={12}
                    />
                  </div>
                ))}
              {permissions.medical.alerts.canView &&
                window.featureFlags['medical-alerts-side-panel'] &&
                props.athleteMedicalAlerts?.length > 0 && (
                  // $FlowIgnore[incompatible-use]
                  // $FlowIgnore[invalid-compare]
                  <>
                    {props.athleteMedicalAlerts?.map((alert) => (
                      <div key={alert.id} css={style.athleteAllergy}>
                        <TextTag
                          content={
                            alert.alert_title || alert.medical_alert.name
                          }
                          backgroundColor={severityLabelColour(alert.severity)}
                          textColor={
                            alert.severity === 'severe'
                              ? colors.white
                              : colors.grey_300
                          }
                        />
                      </div>
                    ))}
                  </>
                )}
            </div>
          </div>
          {window.featureFlags['update-perf-med-headers'] && (
            <p css={style.dayOfInjury}>{renderDateOfInjury()}</p>
          )}
        </div>
      </section>
    </header>
  );
};

export const AppHeaderTranslated = withNamespaces()(AppHeader);
export default AppHeader;
