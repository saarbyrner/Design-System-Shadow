// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { DatePicker } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import { exportCombinedAnkleSupport } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isSettingsOpen: boolean,
  closeSettings: Function,
  onDownloadCSVSuccess?: Function,
  reportTitle: string,
  formKey: 'nba-ankle-at-2334-v1' | 'nba-ankle-em-2324-v2',
  reportSettingsKey:
    | 'prophylactic_ankle_support_at'
    | 'prophylactic_ankle_support_em',
};

const defaultColumns = ['fullname'];
function ProphylacticAnkleSupportReport(props: I18nProps<Props>) {
  return (
    <>
      <ExportSettings
        title={props.reportTitle}
        isOpen={props.isSettingsOpen}
        onSave={(state, updateStatus) => {
          props.closeSettings();
          updateStatus(
            'LOADING',
            props.t('Loading'),
            `${props.reportTitle} ${props.t('data')}`
          );
          const startDate = state.startDate
            ? moment(state.startDate)
                .startOf('day')
                .format(DateFormatter.dateTransferFormat)
            : null;
          const endDate = state.endDate
            ? moment(state.endDate)
                .endOf('day')
                .format(DateFormatter.dateTransferFormat)
            : null;

          exportCombinedAnkleSupport({
            key: props.formKey,
            startDate,
            endDate,
          }).then(
            (response) => {
              const hiddenElement = document.createElement('a');
              hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
                response.csvData
              )}`;
              hiddenElement.target = '_blank';
              hiddenElement.download = `${props.reportTitle}.csv`;
              hiddenElement.click();
              hiddenElement.remove();

              updateStatus(
                'SUCCESS',
                props.t('Success'),
                props.t('Report loaded successfully')
              );

              props.onDownloadCSVSuccess?.();
            },
            () => {
              updateStatus(
                'ERROR',
                props.t('Error'),
                props.t('Report failed to load')
              );
            }
          );
        }}
        onCancel={props.closeSettings}
        settingsKey={props.reportSettingsKey}
      >
        <ExportSettings.Field
          fieldKey="startDate"
          defaultValue={null}
          shouldResetValueOnClose
        >
          {({ value, onChange }) => (
            <DatePicker
              label={props.t('Start Date')}
              value={value}
              onDateChange={onChange}
              disableFutureDates
              kitmanDesignSystem
            />
          )}
        </ExportSettings.Field>
        <ExportSettings.Field
          fieldKey="endDate"
          defaultValue={null}
          shouldResetValueOnClose
        >
          {({ value, onChange }) => (
            <DatePicker
              label={props.t('End Date')}
              value={value}
              onDateChange={onChange}
              disableFutureDates
              kitmanDesignSystem
            />
          )}
        </ExportSettings.Field>
        <ExportSettings.CommonFields.CheckboxList
          fieldKey="activeColumns"
          label={props.t('Columns')}
          defaultValue={defaultColumns}
          items={[
            {
              value: 'fullname',
              label: props.t('Player Name'),
              isDisabled: true,
            },
          ]}
          isCached
        />
      </ExportSettings>
    </>
  );
}

export const ProphylacticAnkleSupportReportTranslated: ComponentType<Props> =
  withNamespaces()(ProphylacticAnkleSupportReport);
export default ProphylacticAnkleSupportReport;
