// @flow
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { LineLoader } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import type { NoteAction, ViewType } from '../../types';
import { PresentationViewTranslated as PresentationView } from './components/PresentationView';
import getStyles from './styles';

type Props = {
  note: MedicalNote,
  actions?: Array<NoteAction>,
  isLoading?: boolean,
  showAthleteInformations?: boolean,
  withVerticalLayout?: boolean,
  withBorder?: boolean,
};

const NoteCard = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const style = getStyles(props.withVerticalLayout, props.withBorder);

  return (
    <div data-testid="Note|Content" css={style.content} id={props.note.id}>
      {props.isLoading && (
        <div css={style.loaderWrapper} data-testid="NoteCardLoader|lineLoader">
          <LineLoader />
        </div>
      )}
      {viewType === 'PRESENTATION' && (
        <PresentationView
          note={props.note}
          actions={props.actions}
          showAthleteInformations={props.showAthleteInformations}
          layoutProps={{
            withVerticalLayout: props.withVerticalLayout,
            withBorder: props.withBorder,
          }}
          isLoading={props.isLoading}
        />
      )}
    </div>
  );
};

NoteCard.defaultProps = {
  showAthleteInformations: false,
  withVerticalLayout: false,
  withBorder: false,
};

export const NoteCardTranslated: ComponentType<Props> =
  withNamespaces()(NoteCard);
export default NoteCard;
