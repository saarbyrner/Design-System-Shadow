// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Accordion } from '@kitman/components';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isPermittedUserCurrentUser, isPermittedUserOwner } from './utils';
import style from './styles';

type Props = {
  currentUser?: CurrentUserData,
  note: MedicalNote,
};

const ConfidentialNotesVisibility = (props: I18nProps<Props>) => {
  const renderConfidentialNotesUsers = props.note?.allow_list
    ?.map((permittedUser) => {
      if (
        isPermittedUserCurrentUser(permittedUser.id, props.currentUser?.id) &&
        isPermittedUserOwner(permittedUser.id, props.note.created_by.id)
      ) {
        return `${permittedUser.fullname} ${props.t('(You - Owner)')}`;
      }
      if (isPermittedUserOwner(permittedUser.id, props.note.created_by.id)) {
        return `${permittedUser.fullname} ${props.t('(Owner)')}`;
      }
      return permittedUser.fullname;
    })
    .reverse();

  return (
    <section
      css={[style.noteVisibility]}
      data-testid="PresentationView|NoteVisibility"
    >
      <h4>{props.t('Visibility')}</h4>

      {!props.note.allow_list?.length && props.t('Default')}

      {props.note.allow_list &&
        props.note.allow_list.length === 1 &&
        (props.note.allow_list[0]?.id === props.currentUser?.id
          ? props.t('Only me')
          : props.note.allow_list[0]?.fullname)}

      {props.note.allow_list &&
        props.note.allow_list.length > 1 &&
        renderConfidentialNotesUsers?.length && (
          <Accordion
            title={`${props.t('Private - Specific users')} (${
              renderConfidentialNotesUsers.length
            })`}
            content={renderConfidentialNotesUsers.join(', ')}
          />
        )}
    </section>
  );
};

export const ConfidentialNotesTranslated: ComponentType<Props> =
  withNamespaces()(ConfidentialNotesVisibility);

export default ConfidentialNotesVisibility;
