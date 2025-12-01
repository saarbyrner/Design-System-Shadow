// @flow
import { withNamespaces } from 'react-i18next';
import { useRef } from 'react';

import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';

import {
  InputText,
  TextTag,
  DatePicker,
  RichTextEditor,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const styles = {
  editNote: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
  `,
  title: css`
    align-items: center;
    display: flex;
    gap: 12px;
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
  row: css`
    display: flex;
    flex-direction-row;
    gap: 12px;
    align-items: end;
    width: 80%;
    .richTextEditor--kitmanDesignSystem {
      width: 100%;
      margin-bottom: 16px;
    }   
    .datePicker {
      width: 100%;
    }
  `,
  date: css`
    font-size: 16px;
    font-weight: 400;
    color: ${colors.grey_300};
    margin-bottom: 10px;
  `,
  lockIcon: css`
    color: ${colors.grey_300};
    margin-right: 8px;
    font-size: 14px;
  `,
  status: css`
    margin-bottom: 8px;
    display: flex;
    text-transform: uppercase;
    font-weight: 600;
  `,
};

type Props = {
  note: MedicalNote,
  onUpdateNoteTitle: Function,
  onUpdateNoteDate: Function,
  onUpdateNote: Function,
};

const EditNote = (props: I18nProps<Props>) => {
  const editorRef = useRef(null);
  const isActive = !props.note.expired;

  return (
    <section css={styles.editNote}>
      <div css={styles.row}>
        <InputText
          label={props.t('Title')}
          kitmanDesignSystem
          value={props.note.title}
          onValidation={(input) => props.onUpdateNoteTitle(input.value)}
        />

        <div data-testid="Note|Tag">
          {props.note.organisation_annotation_type.type !==
            'OrganisationAnnotationTypes::Modification' && (
            <span css={styles.status}>
              <TextTag content={props.note.organisation_annotation_type.name} />
            </span>
          )}
          {props.note.organisation_annotation_type.type ===
            'OrganisationAnnotationTypes::Modification' &&
            isActive && (
              <span css={styles.status}>
                <TextTag
                  content={props.t('Active')}
                  backgroundColor={colors.blue_300}
                  textColor={colors.white}
                />
              </span>
            )}
        </div>
      </div>
      <div css={styles.row}>
        <DatePicker
          label={props.t('Date of note')}
          name="medicalNoteDate"
          onDateChange={(noteDate) => {
            props.onUpdateNoteDate(noteDate);
          }}
          value={props.note.annotation_date}
          disableFutureDates
          kitmanDesignSystem
        />
      </div>
      <div css={styles.row}>
        <RichTextEditor
          label={props.t('S.O.A.P notes')}
          onChange={(note) => {
            props.onUpdateNote(note);
          }}
          value={props.note.content}
          forwardedRef={editorRef}
          kitmanDesignSystem
        />
      </div>
    </section>
  );
};

export const EditNoteTranslated: ComponentType<Props> =
  withNamespaces()(EditNote);
export default EditNote;
