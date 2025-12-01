// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import { TextTag } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteMedicalAlertDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/styles';

type Props = {
  medicalAlert: AthleteMedicalAlertDataResponse,
};

const MedicalAlertInfo = (props: I18nProps<Props>) => {
  const { medicalAlert } = props;

  const visibilityRestricted = () => {
    switch (medicalAlert) {
      case medicalAlert.restricted_to_doc:
        return 'Doctors';
      case medicalAlert.restricted_to_psych:
        return 'Psych team';
      default:
        return 'Default';
    }
  };

  return (
    <>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>{props.t('Medical condition: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{name}}', {
              name: medicalAlert?.medical_alert?.name || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
        <li>
          <span css={style.detailLabel}>{props.t('Alert title: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{title}}', {
              title: medicalAlert?.alert_title || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
        <li>
          <span css={style.detailLabel}>{props.t('Severity: ')}</span>
          <span css={style.severity}>
            <TextTag
              content={medicalAlert?.severity || '--'}
              backgroundColor={severityLabelColour(medicalAlert?.severity)}
              textColor={
                medicalAlert?.severity === 'severe'
                  ? colors.white
                  : colors.grey_400
              }
            />
          </span>
        </li>
      </ul>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>{props.t('Visibility: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{visibility}}', {
              visibility: visibilityRestricted(),
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
        <li>
          <span css={style.detailLabel}>{props.t('Diagnosed on: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{date}}', {
              date: DateFormatter.formatStandard({
                date: moment(medicalAlert?.diagnosed_on) || '--',
              }),
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
    </>
  );
};

export const MedicalAlertInfoTranslated: ComponentType<Props> =
  withNamespaces()(MedicalAlertInfo);
export default MedicalAlertInfo;
