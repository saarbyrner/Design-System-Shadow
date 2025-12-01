// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { Dropdown, Textarea, Checkbox } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Note } from '@kitman/common/src/types/Issues';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  notes: Array<Note>,
  currentNote: Note,
  formType: 'INJURY' | 'ILLNESS',
  isRestricted: boolean,
  psychOnly: boolean,
  updateNote: (string) => void,
  updateIsRestricted: Function,
  updatePsychOnly: Function,
};

const formatDate = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatStandard({
      date,
      showTime: true,
    });
  }

  return date.format('D MMM YYYY, h:mm a');
};

const Notes = (props: I18nProps<Props>) => {
  const getExistingNotes = () =>
    props.notes.map((note) => (
      <div className="injuryNotes__note" key={note.id} data-testid="note-item">
        <p>{note.note}</p>
        <p>
          {note.restricted || note.psych_only ? (
            <i className="icon-lock" />
          ) : null}
          {` ${formatDate(
            moment(note.date, DateFormatter.dateTransferFormat)
          )}`}
          <span className="athleteIssueEditor__userName">{` ${props.t(
            'by {{user}}',
            { user: note.created_by, interpolation: { escapeValue: false } }
          )}`}</span>
        </p>
      </div>
    ));

  const displayIsRestrictedCheckbox = () => (
    <div>
      <div className="injuryNotes__checkbox">
        <Checkbox
          label={props.t('Restrict note to Doctors')}
          id="isRestricted"
          isChecked={props.isRestricted}
          toggle={(checkbox) => props.updateIsRestricted(checkbox.checked)}
          name="injuryNotes__checkbox"
        />
      </div>
    </div>
  );

  const getVisibilityDropdownValue = () => {
    if (props.isRestricted) {
      return 'isRestricted';
    }

    if (props.psychOnly) {
      return 'psychOnly';
    }

    return 'all';
  };

  const displayVisibilityDropdown = () => {
    return (
      <div className="injuryNotes__visibilityDropdown">
        <Dropdown
          onChange={(visibility) => {
            if (visibility === 'isRestricted') {
              props.updateIsRestricted(true);
              props.updatePsychOnly(false);
            } else if (visibility === 'psychOnly') {
              props.updateIsRestricted(false);
              props.updatePsychOnly(true);
            } else {
              props.updateIsRestricted(false);
              props.updatePsychOnly(false);
            }
          }}
          items={[
            {
              id: 'all',
              title: props.t('Default Visibility'),
            },
            {
              id: 'isRestricted',
              title: props.t('Doctors'),
            },
            {
              id: 'psychOnly',
              title: props.t('Psych Team'),
            },
          ]}
          label={props.t('Restrict access to')}
          value={getVisibilityDropdownValue()}
        />
      </div>
    );
  };

  return (
    <div className="injuryNotes">
      {getExistingNotes()}
      <Textarea
        label={
          props.formType === 'INJURY'
            ? props.t('Injury Note')
            : props.t('Illness Note')
        }
        value={props.currentNote.note || ''}
        onChange={(note) => props.updateNote(note)}
        name="injuryNotes_textarea"
        t={props.t}
      />
      {window.featureFlags['mls-emr-psych-notes']
        ? displayVisibilityDropdown()
        : displayIsRestrictedCheckbox()}
    </div>
  );
};

export const NotesTranslated = withNamespaces()(Notes);
export default Notes;
