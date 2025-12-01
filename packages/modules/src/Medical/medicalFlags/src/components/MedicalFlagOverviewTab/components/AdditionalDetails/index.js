// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useMedicalFlag } from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/AdditionalDetails/styles';

type Props = {};

const AdditionalDetails = (props: I18nProps<Props>) => {
  const { medicalFlag } = useMedicalFlag();

  return (
    <section
      css={[style.additionalDetailsSection, style.section]}
      data-testid="MedicalFlag|AdditionalDetails"
    >
      <header css={style.header}>
        <h2>{props.t('Additional details')}</h2>
      </header>
      <ul css={style.additionalDetails}>
        <li>
          <span css={style.detailLabel}>{props.t('Added on: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{date}}', {
              date: DateFormatter.formatStandard({
                date: moment(medicalFlag?.created_at) || '--',
              }),
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
        <li>
          <span css={style.detailLabel}>{props.t('Added by: ')}</span>
          <span css={style.detailValue}>
            {props.t('{{author}}', {
              author: medicalFlag?.created_by?.fullname || '--',
              interpolation: { escapeValue: false },
            })}
          </span>
        </li>
      </ul>
    </section>
  );
};

export const AdditionalDetailsTranslated: ComponentType<Props> =
  withNamespaces()(AdditionalDetails);
export default AdditionalDetails;
