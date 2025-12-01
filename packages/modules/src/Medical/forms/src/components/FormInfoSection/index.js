// @flow
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';
import type { FormInfo } from '../../../../shared/types/medical/QuestionTypes';

type Props = {
  formInfo: FormInfo,
};

const FormInfoSection = (props: I18nProps<Props>) => {
  return (
    <div css={style.section} data-testid="FormInfo|FormInfoSection">
      <h2 className="kitmanHeading--L2">{props.t('Form details')}</h2>
      <ul css={style.infoList}>
        {props.formInfo.date && (
          <li key="date">
            <span css={style.detailLabel}>{props.t('Form completed')}: </span>
            {DateFormatter.formatStandard({
              date: moment(props.formInfo.date),
              showTime: true,
              displayLongDate: true,
            })}
          </li>
        )}

        {/*
        // Updated date should be hidden for now until we have editing
        props.formInfo.updated_at && (
          <li key="updated_at">
            <span css={style.detailLabel}>{props.t('Form updated')}: </span>
            {DateFormatter.formatStandard({
              date: moment(props.formInfo.updated_at),
              showTime: true,
              displayLongDate: true,
            })}
          </li>
        )
        */}
        {props.formInfo.editor.fullname && (
          <li key="fullname">
            <span css={style.detailLabel}>{props.t('Completed by')}: </span>
            {props.formInfo.editor.fullname}
          </li>
        )}
      </ul>
    </div>
  );
};

export const FormInfoSectionTranslated: ComponentType<Props> =
  withNamespaces()(FormInfoSection);

export default FormInfoSection;
