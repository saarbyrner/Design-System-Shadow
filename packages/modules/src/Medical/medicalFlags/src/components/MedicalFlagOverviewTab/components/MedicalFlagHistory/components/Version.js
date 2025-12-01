// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab/components/MedicalFlagHistory/styles';

type MedicalFlagVersionHistory = {
  changeset: {
    diagnosed_on?: Array<string>,
    ever_been_hospitalised?: Array<boolean>,
    require_epinephrine?: Array<boolean>,
    severity?: Array<string>,
    symptoms?: Array<string>,
    title?: Array<string>,
    visibility?: Array<string>,
  },
  updated_at: string,
  updated_by?: {
    firstname: string,
    fullname: string,
    id: number,
    lastname: string,
  },
};
type Props = {
  version: MedicalFlagVersionHistory,
  versionNumber: number,
};

const Version = (props: I18nProps<Props>) => {
  const renderChangeset = () => {
    const createChangeElement = (key, labelKey) => {
      const changeValue = props.version.changeset?.[key];
      if (!changeValue) return '--';

      const initialValue =
        key === 'diagnosed_on'
          ? DateFormatter.formatStandard({
              date: moment(changeValue[0]),
            })
          : changeValue[0];

      const updatedValue =
        key === 'diagnosed_on'
          ? DateFormatter.formatStandard({
              date: moment(changeValue[1]),
            })
          : changeValue[1];

      return (
        <div
          css={style.changes}
          data-testid={`Version|${key}`}
          key={`${key}_${props.versionNumber}`}
        >
          {labelKey} {props.t('updated from')} <strong>{initialValue}</strong>{' '}
          {props.t('to')} <strong>{updatedValue}</strong>
        </div>
      );
    };

    const changedKeys = Object.keys(props.version.changeset);
    return changedKeys.map((key) => {
      switch (key) {
        case 'title':
          return createChangeElement(key, props.t('Title'));
        case 'severity':
          return createChangeElement(key, props.t('Severity'));
        case 'visibility':
          return createChangeElement(key, props.t('Visibility'));
        case 'symptoms':
          return createChangeElement(key, props.t('Symptoms'));
        case 'ever_been_hospitalised':
          return createChangeElement(key, props.t('Ever been hospitalised'));
        case 'require_epinephrine':
          return createChangeElement(key, props.t('Requires epinephrine'));
        case 'diagnosed_on':
          return createChangeElement(key, props.t('Date'));
        default:
          return '';
      }
    });
  };

  return (
    <div css={style.version}>
      <div css={style.title} data-testid="Version|author">
        {props.t('Edit {{version}}:', { version: props.versionNumber })}{' '}
        {props.t('{{date}} by {{author}}', {
          date: DateFormatter.formatStandard({
            date: moment(props.version.updated_at),
          }),
          author: props.version.updated_by?.fullname || '',
          interpolation: { escapeValue: false },
        })}
      </div>
      <div css={style.changeset} data-testid="Version|changeset">
        {renderChangeset()}
      </div>
    </div>
  );
};

export const VersionTranslated: ComponentType<Props> =
  withNamespaces()(Version);
export default Version;
