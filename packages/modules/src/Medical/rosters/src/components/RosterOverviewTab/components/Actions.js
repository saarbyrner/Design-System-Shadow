// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo } from 'react';
import { TextButton, TooltipMenu } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  getLevelAndTab,
  determineMedicalLevelAndTab,
  getNoteActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import { ReportManagerTranslated as ReportManager } from '../ReportManager';
import type { RosterFilters } from '../../../../types';

const style = {
  actionButtons: {
    margin: '0',
    display: 'flex',
    gap: '4px',
  },
};

type Props = {
  filters: RosterFilters,
  isDisabled: boolean,
  onOpenPanel: Function,
};

const Actions = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const { permissions } = usePermissions();

  const menuItems: Array<TooltipItem> = useMemo(
    () =>
      [
        {
          description: props.t('Injury/ Illness'),
          onClick: () => {
            props.onOpenPanel('ISSUE');
            trackEvent(
              performanceMedicineEventNames.clickAddInjuryIllness,
              getLevelAndTab('team', tabHashes.OVERVIEW)
            );
          },
          isVisible: permissions.medical.issues.canCreate,
        },
        {
          description: props.t('Note'),
          onClick: () => {
            trackEvent(performanceMedicineEventNames.clickAddMedicalNote, {
              ...determineMedicalLevelAndTab(),
              ...getNoteActionElement('Add menu'),
            });
            props.onOpenPanel('MEDICAL_NOTE');
          },
          isVisible: permissions.medical.notes.canCreate,
        },
        {
          description: props.t('Modification'),
          onClick: () => {
            props.onOpenPanel('MODIFICATION');
          },
          isVisible: permissions.medical.modifications.canCreate,
        },
        {
          description: props.t('Diagnostic'),
          onClick: () => {
            props.onOpenPanel('DIAGNOSTIC');
          },
          isVisible: permissions.medical.diagnostics.canCreate,
        },
        {
          description: props.t('File'),
          onClick: () => {
            props.onOpenPanel('FILE');
          },
          isVisible:
            window.featureFlags['medical-documents-files-area'] &&
            permissions.medical.documents.canCreate,
        },
        {
          description: props.t('Treatment'),
          onClick: () => {
            props.onOpenPanel('TREATMENT');
          },
          isVisible: permissions.medical.treatments.canCreate,
        },
        {
          description: props.t('Allergy'),
          onClick: () => {
            props.onOpenPanel('ALLERGY');
          },
          isVisible: permissions.medical.allergies.canCreate,
        },
        {
          description: props.t('Chronic condition'),
          onClick: () => {
            props.onOpenPanel('CHRONIC_CONDITION');
          },
          isVisible:
            window.featureFlags['chronic-injury-illness'] &&
            permissions.medical.issues.canCreate,
        },
        {
          description: props.t('Medical Alert'),
          onClick: () => {
            props.onOpenPanel('MEDICAL_ALERT');
          },
          isVisible:
            window.featureFlags['medical-alerts-side-panel'] &&
            permissions.medical.alerts.canCreate,
        },
        {
          description: props.t('Procedure'),
          onClick: () => {
            props.onOpenPanel('PROCEDURE');
          },
          isVisible:
            window.featureFlags['medical-procedure'] &&
            permissions.medical.procedures.canCreate,
        },
        {
          description: props.t('Vaccination'),
          onClick: () => {
            props.onOpenPanel('VACCINATION');
          },
          isVisible: permissions.medical.vaccinations.canCreate,
        },
        {
          description: props.t('TUE'),
          onClick: () => {
            props.onOpenPanel('TUE');
          },
          isVisible: permissions.medical.tue.canCreate && window.getFlag('pm-show-tue'),
        },
        {
          description: props.t('Concussion test'),
          subMenuAlignment: 'left',
          subMenuItems: [
            {
              description: props.t('Near point of convergence (NPC)'),
              onClick: () => {
                props.onOpenPanel('NPC');
              },
              isVisible:
                permissions.concussion.canManageConcussionAssessments ||
                permissions.concussion.canManageNpcAssessments,
            },
            {
              description: props.t('King-Devick'),
              onClick: () => {
                props.onOpenPanel('KING_DEVICK');
              },
              isVisible:
                permissions.concussion.canManageConcussionAssessments ||
                permissions.concussion.canManageKingDevickAssessments,
            },
          ]
            .filter((i) => i.isVisible)
            .map(({ isVisible, ...attrs }) => attrs),

          isVisible:
            window.featureFlags['concussion-medical-area'] &&
            (permissions.concussion.canManageConcussionAssessments ||
              permissions.concussion.canManageNpcAssessments ||
              permissions.concussion.canManageKingDevickAssessments),
        },
      ]
        .filter((i) => i.isVisible)
        .map(({ isVisible, ...attrs }) => attrs),
    [permissions, props]
  );

  return (
    <div css={style.actionButtons}>
      {menuItems.length > 0 && (
        <TooltipMenu
          appendToParent
          placement="bottom-end"
          offset={[0, 5]}
          menuItems={menuItems}
          tooltipTriggerElement={
            <TextButton
              text={props.t('Add')}
              iconAfter="icon-chevron-down"
              type="primary"
              kitmanDesignSystem
              isDisabled={props.isDisabled}
            />
          }
          kitmanDesignSystem
          data-testid="ActionButtons|TooltipMenu"
        />
      )}
      <ReportManager squads={props.filters.squads} />
    </div>
  );
};

export const ActionsTranslated = withNamespaces()(Actions);
export default Actions;
