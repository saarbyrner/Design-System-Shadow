// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';

import { InputTextField, Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import { useGetAvailabilityTypeOptionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import type { TableWidgetAvailabilityStatus } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { getAvailabilityCalculationOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';

type Props = {
  hideColumnTitle: boolean,
  calculation: string,
  title?: string,
  selectedAvailabilityStatus: TableWidgetAvailabilityStatus,
  onSetAvailabilitySource: (
    status: TableWidgetAvailabilityStatus,
    name?: string
  ) => void,
  onSetCalculation: (calculation: string) => void,
  onSetTitle?: (title: string) => void,
  panelType?: 'row' | 'column',
  isPanelOpen: boolean,
  hideProportionOption?: boolean,
  hidePercentageOption?: boolean,
};

function AvailabilityModule(props: I18nProps<Props>) {
  const { data: availabilityTypeOptions, isFetching } =
    useGetAvailabilityTypeOptionsQuery(undefined, { skip: !props.isPanelOpen });
  const availabilityOptions = useMemo(() => {
    const options = availabilityTypeOptions || [];
    const mapValues = (opts: Array<Object>) =>
      opts.reduce((acc, curr) => {
        let childValues = [];

        if (curr.children) {
          childValues = mapValues(curr.children);
        }

        return [
          ...acc,
          { label: curr.label, value: curr.status },
          ...childValues,
        ];
      }, []);

    return [
      {
        label: props.t('Status Label'),
        value: 'label',
      },
      ...options.map(({ label, status, children }) => ({
        label,
        options: [
          {
            label,
            value: status,
          },
          ...mapValues(children),
        ],
      })),
    ];
  }, [availabilityTypeOptions]);

  return (
    <>
      <Panel.Field>
        <Select
          label={props.t('Availability Source')}
          data-testid="AvailabilityModule|AvailabilitySource"
          options={availabilityOptions}
          onChange={(value) => {
            const options = availabilityOptions.flatMap(
              (opts) => opts?.options || opts
            );
            const selected = _find(options, {
              value,
            }) || { label: '' };

            props.onSetAvailabilitySource(value, selected.label);

            if (!props.hideColumnTitle && props.onSetTitle)
              props.onSetTitle(selected.label);
          }}
          value={
            _isEmpty(props.selectedAvailabilityStatus)
              ? ''
              : props.selectedAvailabilityStatus
          }
          isDisabled={isFetching}
          isLoading={isFetching}
          searchable
        />
      </Panel.Field>
      {!props.hideColumnTitle && (
        <Panel.Field>
          <InputTextField
            data-testid="AvailabilityModule|ColumnTitle"
            label={
              props.panelType === 'row'
                ? props.t('Row Title')
                : props.t('Column Title')
            }
            inputType="text"
            value={props.title || ''}
            onChange={(e) =>
              props.onSetTitle ? props.onSetTitle(e.currentTarget.value) : null
            }
            kitmanDesignSystem
          />
        </Panel.Field>
      )}
      <Panel.Field>
        <Select
          data-testid="AvailabilityModule|Calculation"
          label={props.t('Calculation')}
          value={props.calculation}
          options={getAvailabilityCalculationOptions({
            hideProportion: props.hideProportionOption,
            hidePercentage: props.hidePercentageOption,
          })}
          onChange={(calc) => props.onSetCalculation(calc)}
          appendToBody
        />
      </Panel.Field>
    </>
  );
}

export const AvailabilityModuleTranslated =
  withNamespaces()(AvailabilityModule);
export default AvailabilityModule;
