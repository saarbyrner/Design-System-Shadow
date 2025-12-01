// @flow
import { withNamespaces } from 'react-i18next';

import { TextButton, TooltipMenu } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useProcedure } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';
import style from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/Attachments/styles';

type Props = {
  onOpenAddProcedureAttachmentSidePanel: Function,
};

const AttachmentsHeader = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { procedure } = useProcedure();
  const { organisation } = useOrganisation();

  const canAddAttachments = () => {
    if (!permissions.medical.procedures.canCreate) return false;
    if (procedure.organisation_id !== organisation.id) return false;
    return true;
  };

  return (
    <header css={style.header}>
      <h2 css={style.sectionHeading}>{props.t('Attachments')}</h2>
      {canAddAttachments() && (
        <TooltipMenu
          tooltipTriggerElement={
            <TextButton
              text={props.t('Add')}
              type="secondary"
              iconAfter="icon-chevron-down"
              kitmanDesignSystem
            />
          }
          menuItems={[
            {
              description: props.t('File'),
              onClick: () =>
                props.onOpenAddProcedureAttachmentSidePanel(
                  procedure.id,
                  procedure.athlete.id
                ),
            },
          ]}
          placement="bottom-start"
          appendToParent
          kitmanDesignSystem
        />
      )}
    </header>
  );
};

export const AttachmentsHeaderTranslated = withNamespaces()(AttachmentsHeader);
export default AttachmentsHeader;
