// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import uuid from 'uuid';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './styles';

type Props = {
  patientNotes: Object,
};

const PatientNotes = (props: I18nProps<Props>) => {
  const { t, patientNotes } = props;

  return (
    <section
      css={style.patientNotes}
      data-testid="DiagnosticOverviewTab|PatientNotes"
    >
      <div css={style.patientNotesHeader}>
        <h2>{t('Patient Comments')}</h2>
      </div>

      {patientNotes?.map((note) => (
        <p key={uuid()}>{note.body}</p>
      ))}
    </section>
  );
};

export const PatientNotesTranslated: ComponentType<Props> =
  withNamespaces()(PatientNotes);
export default PatientNotes;
