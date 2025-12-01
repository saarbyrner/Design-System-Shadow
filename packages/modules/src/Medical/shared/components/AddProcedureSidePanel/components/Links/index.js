// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { InputTextField, TextButton } from '@kitman/components';
import { containsWhitespace, validateURL } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormState } from '../../hooks/useProcedureForm';
import style from '../../styles';

type Props = {
  formState: FormState,
  procedureIndex: number,
  isLinkValidationCheckAllowed: Array<boolean>,
  setIsLinkValidationCheckAllowed: Function,
  onClearQueuedLinks: Function,
  onRemoveLink: Function,
  onSetLinkUri: Function,
  onSetLinkTitle: Function,
  onSaveLink: Function,
};

const Links = (props: I18nProps<Props>) => {
  const { formState, procedureIndex } = props;

  return (
    <div css={[style.linkContainer]} data-testid="AddProcedureSidePanel|Links">
      <div css={[style.linksHeader, style.span3]}>
        <h3>{props.t('Links')}</h3>
        <TextButton
          onClick={() => {
            props.onClearQueuedLinks(procedureIndex);
            props.setIsLinkValidationCheckAllowed(procedureIndex);
          }}
          iconBefore="icon-bin"
          type="subtle"
          kitmanDesignSystem
        />
      </div>
      <div css={style.linkTitle}>
        <InputTextField
          label={props.t('Title')}
          value={formState.queuedProcedures[procedureIndex]?.linkTitle || ''}
          onChange={(e) => {
            props.onSetLinkTitle(e.target.value);
          }}
          invalid={
            props.isLinkValidationCheckAllowed[procedureIndex] === true &&
            formState.queuedProcedures[procedureIndex].linkTitle.length === 0
          }
          kitmanDesignSystem
        />
      </div>
      <div css={style.linkUri}>
        <InputTextField
          label={props.t('Link')}
          value={formState.queuedProcedures[procedureIndex]?.linkUri || ''}
          onChange={(e) => {
            props.onSetLinkUri(e.target.value);
          }}
          invalid={
            props.isLinkValidationCheckAllowed[procedureIndex] === true &&
            (!validateURL(formState.queuedProcedures[procedureIndex].linkUri) ||
              containsWhitespace(
                formState.queuedProcedures[procedureIndex].linkUri
              )) &&
            formState.queuedProcedures[procedureIndex].linkUri.length >= 0
          }
          kitmanDesignSystem
        />
      </div>
      <div css={style.linkAddButton}>
        <TextButton
          text={props.t('Add')}
          type="secondary"
          onClick={() => props.onSaveLink(procedureIndex)}
          kitmanDesignSystem
        />
      </div>

      {formState.queuedProcedures[procedureIndex]?.queuedLinks.length > 0 && (
        <div css={style.span3}>
          {formState.queuedProcedures[procedureIndex]?.queuedLinks.map(
            (queuedLink) => {
              const textForURI = queuedLink?.uri.startsWith('//')
                ? queuedLink?.uri.substring(2)
                : queuedLink?.uri;
              return (
                <div
                  css={style.linkRender}
                  key={queuedLink.id}
                  data-testid="AddProcedureSidePanel|SingleLink"
                >
                  <TextButton
                    onClick={() => props.onRemoveLink(queuedLink.id)}
                    iconBefore="icon-bin"
                    type="subtle"
                    kitmanDesignSystem
                  />
                  <span>{queuedLink?.title}</span>-
                  <a
                    href={queuedLink?.uri}
                    css={style.attachmentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {textForURI}
                  </a>
                </div>
              );
            }
          )}
        </div>
      )}
      <hr css={[style.hr, style.span3]} />
    </div>
  );
};

export const LinksTranslated: ComponentType<Props> = withNamespaces()(Links);
export default Links;
