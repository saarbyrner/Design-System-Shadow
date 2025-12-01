// @flow
import { useRef, useState } from 'react';
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';
import { RichTextDisplay } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { LatestNote as NoteType } from '../../../types';

const style = {
  latestNoteCell: css`
    display: flex;
    flex-direction: column;
  `,
  latestNoteTitle: css`
    font-size: 14px;
    font-weight: 600;
    white-space: pre-line;
  `,
  latestNoteContent: css`
    display: block;
    width: 500px;
    overflow-wrap: normal;
    white-space: normal;
    font-size: 12px;
    @media only screen and (max-width: ${breakPoints.tablet}) {
      width: 300px;
    }
    &:hover {
      cursor: pointer;
    }
    p {
      margin: 0;
    }
  `,
  lockIcon: css`
    color: ${colors.grey_100};
  `,
};

type Props = {
  latestNote: NoteType,
};

const LatestNote = (props: I18nProps<Props>) => {
  const wrapperElement = useRef(null);
  const [showMore, setShowMore] = useState(false);

  const showMoreText = () => {
    // dangerouslySetInnerHTML prop in richTextDisplay expects a string version of html
    return `<span style='font-weight:400; font-style: normal;'>${props.t(
      'Show more'
    )}</span>`;
  };

  const richTextContent = () => {
    // show longer note content after click
    if (!showMore && props.latestNote.content.length > 70) {
      return `${props.latestNote.content
        .substring(0, 70)
        .trim()}... ${showMoreText()}`;
    }

    // Short notes
    return props.latestNote.content;
  };

  return (
    <div css={style.latestNoteCell} role="cell">
      <span role="heading" aria-level="5" css={style.latestNoteTitle}>
        {props.latestNote.restricted_annotation && (
          <i
            aria-label="Lock Icon"
            role="img"
            css={style.lockIcon}
            className="icon-lock"
          />
        )}
        {props.latestNote.date} - {props.latestNote.title}
      </span>
      <section
        css={style.latestNoteContent}
        ref={wrapperElement}
        onClick={() => setShowMore(!showMore)}
        data-testid="NoteContent"
      >
        <RichTextDisplay
          value={richTextContent()}
          isAbbreviated={showMore}
          removeDefaultStyles
        />
      </section>
    </div>
  );
};

export const LatestNoteTranslated = withNamespaces()(LatestNote);
export default LatestNote;
