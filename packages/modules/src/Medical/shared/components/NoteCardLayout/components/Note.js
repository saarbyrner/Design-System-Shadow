// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';

import { TextTag, RichTextDisplay } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const styles = {
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
  date: css`
    font-size: 16px;
    font-weight: 400;
    color: ${colors.grey_300};
    margin-bottom: 10px;
  `,
  type: css`
    margin-right: 13px;
    text-transform: uppercase;
  `,
  lockIcon: css`
    color: ${colors.grey_300};
    margin-right: 8px;
    font-size: 14px;
  `,
  status: css`
    text-transform: uppercase;
  `,
};

type Props = {
  note: MedicalNote,
};

const Note = (props: I18nProps<Props>) => {
  const isActive = !props.note.expired;
  const isConfidentialNote =
    props.note?.allow_list &&
    props.note?.allow_list.length > 0 &&
    props.note?.annotationable_type !== 'Diagnostic';

  return (
    <section>
      <h3 css={styles.title} data-testid="Note|Title">
        <div>
          {(props.note.restricted_to_doc ||
            props.note.restricted_to_psych ||
            isConfidentialNote) && (
            <i css={styles.lockIcon} className="icon-lock" />
          )}
          {props.note.title}
        </div>
        <div data-testid="Note|Tag">
          {props.note.organisation_annotation_type.type !==
            'OrganisationAnnotationTypes::Modification' && (
            <span css={styles.type}>
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
      </h3>
      <div css={styles.date} data-testid="Note|Date">
        {DateFormatter.formatStandard({
          date: moment(props.note.annotation_date),
        })}

        {props.note.expiration_date &&
          ` - ${DateFormatter.formatStandard({
            date: moment(props.note.expiration_date),
          })}`}
      </div>

      <RichTextDisplay value={props.note.content} isAbbreviated={false} />
    </section>
  );
};

export const NoteTranslated: ComponentType<Props> = withNamespaces()(Note);
export default Note;
