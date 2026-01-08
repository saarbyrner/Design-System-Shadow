// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { InputTextField, TextButton } from '@kitman/components';
import { containsWhitespace, validateURL } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';

type Link = {
  title: string,
  uri: string,
  id?: string,
};

type Props = {
  visibleHeader: boolean,
  currentLinks: Link[],
  onAddLink: (Link[]) => void,
  onRemoveLink: (Link) => void,
  onRemove?: Function,
  resetLinks?: () => void,
};

const ManageLinksInformation = (props: I18nProps<Props>) => {
  const {
    t: translate,
    visibleHeader,
    onRemove,
    currentLinks,
    onAddLink,
    onRemoveLink,
    resetLinks,
  } = props;

  const [isLinkValidationCheckAllowed, setLinkValidationCheckAllowed] =
    useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUri, setLinkUri] = useState('');

  const onSaveLink = () => {
    setLinkValidationCheckAllowed(true);
    const requiredLinkFields = [
      linkTitle.length > 0,
      validateURL(linkUri) && !containsWhitespace(linkUri),
    ];
    const allRequiredLinkFieldsAreValid = requiredLinkFields.every(
      (item) => item
    );

    // If the validation fails, abort
    if (!allRequiredLinkFieldsAreValid) {
      return;
    }
    // If validation passes, dispatch
    onAddLink([...currentLinks, { title: linkTitle, uri: linkUri }]);
    setLinkTitle('');
    setLinkUri('');
    setLinkValidationCheckAllowed(false);
  };

  return (
    <div
      css={[
        visibleHeader
          ? css`
              padding: 0 24px;
            `
          : css``,
        style.linkContainer,
        style.gridRow11,
      ]}
    >
      {visibleHeader && (
        <div css={[style.linksHeader, style.span3]}>
          <h3>{translate('Links')}</h3>
          <TextButton
            onClick={() => {
              resetLinks?.();
              onRemove?.();
            }}
            testId="section-bin"
            iconBefore="icon-bin"
            type="subtle"
            kitmanDesignSystem
          />
        </div>
      )}
      <div css={style.linkTitle}>
        <InputTextField
          label={translate('Title')}
          value={linkTitle}
          onChange={(e) => setLinkTitle(e.target.value)}
          invalid={isLinkValidationCheckAllowed && linkTitle.length === 0}
          kitmanDesignSystem
        />
      </div>
      <div css={style.linkUri}>
        <InputTextField
          label={translate('Link')}
          value={linkUri}
          onChange={(e) => setLinkUri(e.target.value)}
          invalid={
            isLinkValidationCheckAllowed &&
            (!validateURL(linkUri) || containsWhitespace(linkUri)) &&
            linkUri.length >= 0
          }
          kitmanDesignSystem
        />
      </div>
      <div css={style.linkAddButton}>
        <TextButton
          text={translate('Add')}
          type="secondary"
          onClick={onSaveLink}
          kitmanDesignSystem
        />
      </div>
      {currentLinks.length > 0 && (
        <div css={style.span3}>
          {currentLinks.map((link) => {
            const textForURI = link.uri.startsWith('//')
              ? link.uri.substring(2)
              : link.uri;
            return (
              <div css={style.linkRender} key={`${link.title}-${link.uri}`}>
                <TextButton
                  onClick={() => {
                    onRemoveLink(link);
                  }}
                  iconBefore="icon-bin"
                  type="subtle"
                  kitmanDesignSystem
                />
                <span>{link.title} -</span>
                <a
                  href={link.uri}
                  css={style.attachmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &nbsp;
                  {textForURI}
                </a>
              </div>
            );
          })}
        </div>
      )}
      {visibleHeader && <hr css={[style.hr, style.span3]} />}
    </div>
  );
};

export const ManageLinksInformationTranslated: ComponentType<Props> =
  withNamespaces()(ManageLinksInformation);

export default ManageLinksInformation;
