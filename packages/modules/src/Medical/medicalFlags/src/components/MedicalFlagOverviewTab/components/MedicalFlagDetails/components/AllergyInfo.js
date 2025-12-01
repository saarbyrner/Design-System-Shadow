// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import { TextTag } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AllergyDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagDetails/styles';

type Props = {
  allergyInfo: AllergyDataResponse,
};

const AllergyInfo = (props: I18nProps<Props>) => {
  const { allergyInfo } = props;

  return (
    <>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>{props.t('Type: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{type}}', {
              type: allergyInfo?.allergen?.allergen_type || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
        <li>
          <span css={style.detailLabel}>{props.t('Allergens: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{name}}', {
              name: allergyInfo?.name || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>
            {props.t(
              'Has the athlete ever been hospitalised for this allergy? : '
            )}
          </span>
          <span css={style.detailValue}>
            {props.t('{{hospitalized}}', {
              hospitalized: allergyInfo?.ever_been_hospitalised ? 'Yes' : 'No',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>
            {props.t('Does the athlete require an EpiPen for the allergy? : ')}
          </span>
          <span css={style.detailValue}>
            {props.t('{{epinephrine}}', {
              epinephrine: allergyInfo?.require_epinephrine ? 'Yes' : 'No',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>{props.t('Symptoms: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{symptoms}}', {
              symptoms: allergyInfo?.symptoms || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>{props.t('Severity: ')}</span>
          <span css={style.severity}>
            <TextTag
              content={allergyInfo?.severity || '--'}
              backgroundColor={severityLabelColour(allergyInfo?.severity)}
              textColor={
                allergyInfo?.severity === 'severe'
                  ? colors.white
                  : colors.grey_400
              }
            />
          </span>
        </li>
      </ul>
      <ul css={style.medicalFlagAdditionalInfo}>
        <li>
          <span css={style.detailLabel}>{props.t('Allergy title: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{name}}', {
              name: allergyInfo?.display_name || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
        <li>
          <span css={style.detailLabel}>{props.t('Diagnosed on: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{date}}', {
              date: DateFormatter.formatStandard({
                date: moment(allergyInfo?.diagnosed_on) || '--',
              }),
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
    </>
  );
};

export const AllergyInfoTranslated: ComponentType<Props> =
  withNamespaces()(AllergyInfo);
export default AllergyInfo;
