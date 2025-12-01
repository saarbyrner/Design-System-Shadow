// @flow
import { css } from '@emotion/react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { breakPoints, colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import { LineLoader, TextButton, TooltipMenu } from '@kitman/components';
import type { DateRange } from '@kitman/common/src/types';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import { ADD_ISSUE_BUTTON } from '@kitman/modules/src/Medical/shared/constants/elementTags';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  getLevelAndTab,
  getNoteActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import type { AthleteIssueStatuses } from '@kitman/modules/src/Medical/rosters/src/services/getAthleteIssueStatuses';

import { IssuesFiltersTranslated as IssuesFilters } from './IssuesFilters';
import type { AthleteIssueTypes } from '../../types';

type Props = {
  isLoading: boolean,
  isPastAthlete: boolean,
  athleteIssueTypes: AthleteIssueTypes,
  athleteIssueStatuses: AthleteIssueStatuses,
  dateRange: ?DateRange,
  hiddenFilters: Array<string>,
  onFilterBySearch: Function,
  onFilterByType: Function,
  onFilterByStatus: Function,
  onFilterByDateRange: Function,
  onOpenAddDiagnosticSidePanel: Function,
  onOpenAddIssuePanel: Function,
  onOpenAddMedicalNotePanel: Function,
  onOpenAddModificationSidePanel: Function,
  onOpenAddAllergySidePanel: Function,
  onOpenAddMedicalAlertSidePanel: Function,
  onOpenAddProcedureSidePanel: Function,
  onOpenAddVaccinationSidePanel: Function,
  onOpenAddConcussionTestResultSidePanel: Function,
  onOpenAddTreatmentsSidePanel: Function,
  onOpenAddTUESidePanel: Function,
  setIsMedicalDocumentPanelOpen: Function,
  setIsMedicalFilePanelOpen: Function,
  showArchivedIssues: boolean,
  setShowArchivedIssues: Function,
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },
  isAthleteOnTrial?: boolean,
};

const style = {
  header: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    position: relative;
    @media only screen and (min-width: ${breakPoints.desktop}) {
      border: 1px solid ${colors.neutral_300};
      border-radius: 3px;
      background-color: ${colors.white};
      margin-bottom: 8px;
      padding: 24px;
    }
  `,
  titleWrapper: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media only screen and (max-width: ${breakPoints.desktop}) {
      margin-bottom: 12px;
    }
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
  `,
  headerLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  buttons: css`
    display: flex;
    gap: 5px;
  `,
};

const IssuesHeader = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const { permissions } = usePermissions();

  const getMenuItems = () => {
    const menuItems = [
      {
        description: props.t('Injury/ Illness'),
        onClick: () => {
          props.onOpenAddIssuePanel({ isChronicCondition: false });
          trackEvent(
            performanceMedicineEventNames.clickAddInjuryIllness,
            getLevelAndTab('athlete', tabHashes.ISSUES)
          );
        },
      },
    ];

    if (permissions.medical.notes.canCreate) {
      menuItems.push({
        description: props.t('Note'),
        onClick: () => {
          trackEvent(performanceMedicineEventNames.clickAddMedicalNote, {
            ...getLevelAndTab('athlete', tabHashes.ISSUES),
            ...getNoteActionElement('Add menu'),
          });
          props.onOpenAddMedicalNotePanel();
        },
      });
    }

    if (permissions.medical.modifications.canCreate && !props.isPastAthlete) {
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

    if (permissions.medical.allergies.canCreate && !props.isPastAthlete) {
      menuItems.push({
        description: props.t('Allergy'),
        onClick: props.onOpenAddAllergySidePanel,
      });
    }

    if (
      window.featureFlags['chronic-injury-illness'] &&
      permissions.medical.issues.canCreate &&
      !props.isPastAthlete
    ) {
      menuItems.push({
        description: props.t('Chronic condition'),
        onClick: () => props.onOpenAddIssuePanel({ isChronicCondition: true }),
      });
    }

    if (
      window.featureFlags['medical-alerts-side-panel'] &&
      permissions.medical.alerts.canCreate &&
      !props.isPastAthlete
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

    if (permissions.medical.vaccinations.canCreate) {
      menuItems.push({
        description: props.t('Vaccination'),
        onClick: props.onOpenAddVaccinationSidePanel,
      });
    }

    if (permissions.medical.tue.canCreate && !props.isPastAthlete && window.getFlag('pm-show-tue')) {
      menuItems.push({
        description: props.t('TUE'),
        onClick: props.onOpenAddTUESidePanel,
      });
    }

    if (
      window.featureFlags['concussion-medical-area'] &&
      (permissions.concussion.canManageConcussionAssessments ||
        permissions.concussion.canManageNpcAssessments ||
        permissions.concussion.canManageKingDevickAssessments)
    ) {
      const subMenuItems: Array<TooltipItem> = [];
      if (permissions.concussion.canManageConcussionAssessments ||
          permissions.concussion.canManageNpcAssessments) {
        subMenuItems.push({
          description: props.t('Near point of convergence (NPC)'),
          onClick: () => {
            props.onOpenAddConcussionTestResultSidePanel('NPC');
          },
        });
      }
      if (permissions.concussion.canManageConcussionAssessments ||
          permissions.concussion.canManageKingDevickAssessments) {
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
    return menuItems;
  };

  const renderAddEntitiesMenu = () => {
    if (props.hiddenFilters?.includes(ADD_ISSUE_BUTTON)) return null;
    return (
      permissions.medical.issues.canEdit && (
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

  return (
    <header css={style.header}>
      <div css={style.titleWrapper}>
        <h3 css={style.title}>{props.t('Injury/ Illness')}</h3>
        <div css={style.buttons}>
          {renderAddEntitiesMenu()}
          {window.featureFlags['view-archive-injury-area'] &&
            props.permissions.medical.issues.canArchive &&
            !props.isAthleteOnTrial &&
            (!props.showArchivedIssues ? (
              <TextButton
                text={props.t('View archive')}
                type="secondary"
                onClick={() => {
                  props.setShowArchivedIssues(true);
                }}
                kitmanDesignSystem
              />
            ) : (
              <TextButton
                text={props.t('Exit archive')}
                type="primary"
                onClick={() => {
                  props.setShowArchivedIssues(false);
                }}
                kitmanDesignSystem
              />
            ))}
        </div>
      </div>
      <IssuesFilters
        dateRange={props.dateRange}
        athleteIssueStatuses={props.athleteIssueStatuses}
        athleteIssueTypes={props.athleteIssueTypes}
        onFilterBySearch={props.onFilterBySearch}
        onFilterByType={props.onFilterByType}
        onFilterByStatus={props.onFilterByStatus}
        onFilterByDateRange={props.onFilterByDateRange}
        showArchivedIssues={props.showArchivedIssues}
      />
      {props.isLoading && (
        <div
          css={style.headerLoader}
          data-testid="IssuesHeaderLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </header>
  );
};

export const IssuesHeaderTranslated = withNamespaces()(IssuesHeader);
export default IssuesHeader;
