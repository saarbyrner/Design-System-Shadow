// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton, TooltipMenu } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import style from './styles';

type Props = {
  onOpenAddDiagnosticAttachmentSidePanel: Function,
  onOpenAddDiagnosticLinkSidePanel: Function,
};

const AttachmentsHeader = (props: I18nProps<Props>) => {
  const { diagnostic } = useDiagnostic();
  const { organisation } = useOrganisation();

  const canAddAttachments = () => {
    return diagnostic.organisation_id === organisation.id;
  };

  return (
    <header css={style.header}>
      <h2 className="kitmanHeading--L2">{props.t('Attachments')}</h2>
      {canAddAttachments() && (
        <div>
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
                  props.onOpenAddDiagnosticAttachmentSidePanel(
                    diagnostic.id,
                    diagnostic.athlete.id
                  ),
              },
              {
                description: props.t('Link'),
                onClick: () =>
                  props.onOpenAddDiagnosticLinkSidePanel(
                    diagnostic.id,
                    diagnostic.athlete.id
                  ),
              },
            ]}
            placement="bottom-start"
            appendToParent
            kitmanDesignSystem
          />
        </div>
      )}
    </header>
  );
};

export const AttachmentsHeaderTranslated = withNamespaces()(AttachmentsHeader);
export default AttachmentsHeader;
