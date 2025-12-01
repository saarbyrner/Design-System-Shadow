// @flow
/* eslint-disable react/jsx-no-target-blank */
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type {
  Attachment,
  MedicationData,
} from '@kitman/common/src/types/Issues';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  diagnostic: {
    id: number,
    type: string,
    diagnostic_date: string,
    attachments: Array<Attachment>,
    is_medication: boolean,
    medical_meta: MedicationData,
  },
  emptyMessage: string,
};

const AthleteMedications = (props: I18nProps<Props>) => {
  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const renderEndDate = () =>
    props.diagnostic.medical_meta && props.diagnostic.medical_meta.end_date
      ? formatDate(
          moment(
            props.diagnostic.medical_meta.end_date,
            DateFormatter.dateTransferFormat
          )
        )
      : '-';

  const renderAttachments = () =>
    props.diagnostic.attachments.length !== 0 ? (
      <div className="athleteMedications__row">
        {props.diagnostic.attachments.map((attachment) => (
          <div className="athleteMedications__attachment" key={attachment.id}>
            <i className="icon-attachment" />
            <a target="_blank" href={attachment.url}>
              {attachment.filename}
            </a>
            {attachment.audio_file ? (
              <audio // eslint-disable-line jsx-a11y/media-has-caption
                controls
                src={attachment.url}
              >
                {props.t('Your browser does not support embedded audio files.')}
              </audio>
            ) : null}
          </div>
        ))}
      </div>
    ) : null;

  const renderNotes = () =>
    props.diagnostic.medical_meta.notes &&
    props.diagnostic.medical_meta.notes !== '' ? (
      <span>{props.diagnostic.medical_meta.notes}</span>
    ) : (
      <span className="athleteMedications__emptyMessage athleteMedications__emptyMessage--left">
        {props.t('No note added.')}
      </span>
    );

  const renderCreationDateText = () => {
    const diagnosticDate = formatDate(
      moment(props.diagnostic.diagnostic_date, DateFormatter.dateTransferFormat)
    );
    return (
      <p className="athleteMedications__creationDate">
        {props.t('Medication added on {{diagnosticDate}}', { diagnosticDate })}
      </p>
    );
  };

  return props.diagnostic.medical_meta ? (
    <div className="athleteMedications">
      <div className="athleteMedications__row">
        <div className="athleteMedications__cell athleteMedications__type">
          <span className="athleteMedications__label">{props.t('Type')}</span>
          <span>{props.diagnostic.medical_meta.type}</span>
        </div>
        <div className="athleteMedications__cell">
          <span className="athleteMedications__label">{props.t('Dosage')}</span>
          <span>{props.diagnostic.medical_meta.dosage}</span>
        </div>
        <div className="athleteMedications__cell">
          <span className="athleteMedications__label">
            {props.t('Frequency')}
          </span>
          <span>{props.diagnostic.medical_meta.frequency}</span>
        </div>
        <div className="athleteMedications__cell">
          <span className="athleteMedications__label">
            {props.t('Prescription Start')}
          </span>
          <span>
            {formatDate(
              moment(
                props.diagnostic.medical_meta.start_date,
                DateFormatter.dateTransferFormat
              )
            )}
          </span>
        </div>
        <div className="athleteMedications__cell">
          <span className="athleteMedications__label">
            {props.t('Prescription End')}
          </span>
          <span>{renderEndDate()}</span>
        </div>
      </div>
      <div className="athleteMedications__row">
        <span className="athleteMedications__label">{props.t('Note')}</span>
        {renderNotes()}
      </div>
      {renderAttachments()}
      {renderCreationDateText()}
    </div>
  ) : (
    <span className="athleteMedications__emptyMessage">
      {props.emptyMessage}
    </span>
  );
};

export const AthleteMedicationsTranslated =
  withNamespaces()(AthleteMedications);
export default AthleteMedications;
