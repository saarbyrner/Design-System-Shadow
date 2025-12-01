// @flow
import { type ComponentType, useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { Accordion } from '@kitman/components';
import type { VersionHistory } from '@kitman/modules/src/Medical/shared/types/medical';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { VersionTranslated as Version } from '../Version';

type Props = {
  history: Array<VersionHistory>,
};

const style = {
  noteHistory: {
    '.accordion': {
      padding: '8px',
      '&__content': {
        maxHeight: '15vh',
        overflowY: 'auto',
      },
    },
  },
  title: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '20px',
    color: colors.grey_200,
  },
};

const NoteHistory = (props: I18nProps<Props>) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // TODO: Temp until the empty changesets are understood
  const filteredEmptyChangsets: Array<VersionHistory> = props.history.filter(
    (v) => Object.keys(v.changeset).length > 0
  );

  const getTitle = () => {
    return isHistoryOpen
      ? props.t('Hide edits')
      : props.t('{{count}} {{edit}} since creation', {
          count: filteredEmptyChangsets.length,
          edit: filteredEmptyChangsets.length > 1 ? 'edits' : 'edit',
        });
  };

  return (
    <div css={style.noteHistory} data-testid="NoteHistory|root">
      <Accordion
        iconAlign="left"
        onChange={() =>
          setIsHistoryOpen((prevIsHistoryOpen) => !prevIsHistoryOpen)
        }
        title={
          <div css={style.title} data-testid="NoteHistory|title">
            {getTitle()}
          </div>
        }
        content={filteredEmptyChangsets.map((version, index) => {
          return (
            <Version
              version={version}
              versionNumber={filteredEmptyChangsets.length - index}
              key={`${version.updated_at}_${index + 1}`}
            />
          );
        })}
        isOpen={isHistoryOpen}
      />
    </div>
  );
};

export const NoteHistoryTranslated: ComponentType<Props> =
  withNamespaces()(NoteHistory);
export default NoteHistory;
