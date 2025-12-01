// @flow
/* eslint-disable no-nested-ternary */
import { colors } from '@kitman/common/src/variables';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import { InfoTooltip, TextLink } from '@kitman/components';
import type { LinkTarget } from '@kitman/components/src/TextLink/types';

const style = {
  cell: {
    display: 'flex',
    alignItems: 'start',
    color: colors.grey_300,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    background: colors.white,
  },
  fileTypeIcon: {
    marginRight: '5px',
    color: colors.grey_300,
    fontSize: '16px',
  },
  attachmentLink: {
    color: colors.grey_300,
    fontWeight: 600,

    '&:visited, &:hover, &:focus, &:active': {
      color: colors.grey_300,
    },

    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

type Props = {
  url: string,
  longText: string,
  valueLimit?: number,
  fileType?: string,
  includeIcon?: boolean,
  target?: LinkTarget,
  isLink?: ?boolean,
  isExternalLink?: boolean,
  onlyShowIcon?: boolean,
  downloadTitle?: string,
  onClick?: () => void,
};

const LinkTooltipCell = (props: Props) => {
  const VALUE_LENGTH_LIMIT = props.valueLimit ? props.valueLimit : 40;
  const shortText =
    props.longText && props.longText.length > VALUE_LENGTH_LIMIT
      ? `${props.longText.substring(0, VALUE_LENGTH_LIMIT - 4)} ...`
      : props.longText;

  const linkContentToRender = props.onlyShowIcon ? (
    <i
      css={style.fileTypeIcon}
      className={
        props.isLink
          ? 'icon-link'
          : getContentTypeIcon(props.fileType ? props.fileType : '')
      }
    />
  ) : (
    shortText
  );

  return (
    <InfoTooltip content={props.longText}>
      <div data-testid="LinkTooltipCell|Cell" css={style.cell}>
        {props.includeIcon && props.fileType && !props.onlyShowIcon && (
          <i
            css={style.fileTypeIcon}
            className={
              props.isLink ? 'icon-link' : getContentTypeIcon(props.fileType)
            }
          />
        )}
        {props.isExternalLink ? (
          <a
            href={props.url}
            css={style.attachmentLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={props.onClick}
          >
            {linkContentToRender}
          </a>
        ) : props.downloadTitle ? (
          <a
            download={props.downloadTitle}
            href={props.url}
            css={style.attachmentLink}
            onClick={props.onClick}
          >
            {linkContentToRender}
          </a>
        ) : (
          <TextLink
            text={linkContentToRender}
            href={props.url}
            target={props.target ? props.target : '_self'}
            kitmanDesignSystem
            onClick={props.onClick}
          />
        )}
      </div>
    </InfoTooltip>
  );
};

export default LinkTooltipCell;
