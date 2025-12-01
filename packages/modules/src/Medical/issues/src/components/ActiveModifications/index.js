// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { NoteCardTranslated as NoteCard } from '../../../../shared/components/NoteCard';

const style = {
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  modificationWrapper: css`
    &:not(:last-of-type) {
      border-bottom: 2px solid ${colors.neutral_300};
      margin-bottom: 16px;
    }
  `,
};

type Props = {
  isLoading: boolean,
  canDeactivate: boolean,
  modifications: Array<MedicalNote>,
  deactivateModification: (noteId: number) => void,
};

const ActiveModifications = (props: I18nProps<Props>) => {
  const [deactivableModificationId, setDeactivableModificationId] = useState<
    number | null
  >(null);

  const buildActions = () => {
    const modificationActions = [];
    if (props.canDeactivate) {
      modificationActions.push({
        id: 1,
        text: props.t('Deactivate'),
        onCallAction: (modificationId: number) => {
          setDeactivableModificationId(modificationId);
          props.deactivateModification(modificationId);
        },
      });
    }
    return modificationActions;
  };

  return (
    <section css={style.section}>
      <h2 className="kitmanHeading--L2">{props.t('Active modifications')}</h2>
      {props.modifications.map((modification) => (
        <div css={style.modificationWrapper} key={modification.id}>
          <NoteCard
            note={modification}
            withVerticalLayout
            actions={buildActions()}
            isLoading={
              props.isLoading && deactivableModificationId === modification.id
            }
          />
        </div>
      ))}
    </section>
  );
};

export const ActiveModificationsTranslated: ComponentType<Props> =
  withNamespaces()(ActiveModifications);
export default ActiveModifications;
