// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  DateRangePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { convertDateRangeToTuple } from '@kitman/playbook/components/wrappers/CustomDateRangePicker/utils';
import type { MedicationFilter } from '../../../../types';
import style from './styles';
import MedicationsReportManager from '../MedicationsReportManager/MedicationsReportManager';
import { useGetMedicationProvidersQuery } from '../../../../redux/services/medical';
import {
  ADD_MEDICATION_BUTTON,
  STOCK_MANAGEMENT_BUTTON,
} from '../../../../constants/elementTags';

type Props = {
  athleteId?: ?number,
  filters: MedicationFilter,
  onChangeFilter: (filter: MedicationFilter) => void,
  onOpenDispenseMedicationsSidePanel: Function,
  hiddenFilters: Array<string>,
};

const MedicationFilters = (props: I18nProps<Props>) => {
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);
  const { permissions } = usePermissions();

  const {
    data: medicationProviders = [],
    isLoading: areMedicationProvidersLoading,
  } = useGetMedicationProvidersQuery();

  const getProviders = () => {
    // the BE returns label and value but still expects label so setting both to label
    return (
      medicationProviders?.map((item) => ({
        value: item.label,
        label: item.label,
      })) || []
    );
  };

  const renderSearchFilter = () => (
    <div css={style.filter}>
      <InputTextField
        data-testid="MedicationFilters|Search"
        placeholder={props.t('Search')}
        value={props.filters.search_expression}
        onChange={({ target: { value } }) =>
          props.onChangeFilter({
            ...props.filters,
            search_expression: value,
          })
        }
        searchIcon
        kitmanDesignSystem
      />
    </div>
  );

  const renderDateFilter = () => {
    return (
      <div css={style.filter}>
        {!window.getFlag('pm-date-range-picker-custom') && (
          <DateRangePicker
            data-testid="MedicationFilters|DateRange"
            value={props.filters.date_range}
            placeholder={props.t('Date range')}
            onChange={(daterange) =>
              props.onChangeFilter({
                ...props.filters,
                date_range: daterange,
              })
            }
            isClearable
            turnaroundList={[]}
            allowFutureDate
            position="center"
            kitmanDesignSystem
          />
        )}

        {window.getFlag('pm-date-range-picker-custom') && (
          <CustomDateRangePicker
            variant="menuFilters"
            value={
              props.filters.date_range
                ? convertDateRangeToTuple(props.filters.date_range)
                : undefined
            }
            onChange={(daterange) => {
              if (props.onChangeFilter) {
                props.onChangeFilter({
                  ...props.filters,
                  date_range: daterange,
                });
              }
            }}
          />
        )}
      </div>
    );
  };

  const renderProviderFilter = () => (
    <div
      css={[style.filter, style.providerFilter]}
      data-testid="MedicationFilters|ProviderFilter"
    >
      <Select
        css={[style.providerFilter]}
        placeholder={props.t('Provider')}
        value={props.filters.provider}
        options={getProviders()}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            provider: id,
          })
        }
        width={400}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
        isDisabled={areMedicationProvidersLoading}
      />
    </div>
  );

  const renderStatusFilter = () => (
    <div css={style.filter} data-testid="MedicationFilters|StatusFilter">
      <Select
        placeholder={props.t('Status')}
        value={props.filters.status}
        options={[
          { value: 'active', label: props.t('Active') },
          { value: 'paused', label: props.t('Paused') },
          { value: 'inactive', label: props.t('Inactive') },
        ]}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            status: id,
          })
        }
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const renderStockManagementButton = () => {
    if (
      !window.featureFlags['stock-management'] ||
      props.hiddenFilters?.includes(STOCK_MANAGEMENT_BUTTON)
    ) {
      return null;
    }
    return (
      permissions.medical?.stockManagement.canView && (
        <div data-testid="MedicationFilters|StockManagementButton">
          <TextButton
            text={props.t('Stock Management')}
            type="secondary"
            onClick={() => {
              window.location.href = '/stock_management';
            }}
            kitmanDesignSystem
          />
        </div>
      )
    );
  };

  const renderAddMedicationButton = () => {
    if (props.hiddenFilters?.includes(ADD_MEDICATION_BUTTON)) {
      return null;
    }
    return (
      ((window.featureFlags['stock-management'] &&
        permissions.medical?.stockManagement.canDispense) ||
        permissions.medical?.medications.canLog) && (
        <div data-testid="MedicationFilters|AddMedicationButton">
          <TextButton
            text={props.t('Add medication')}
            type="primary"
            onClick={() => {
              props.onOpenDispenseMedicationsSidePanel();
            }}
            kitmanDesignSystem
          />
        </div>
      )
    );
  };

  const renderReportButton = () => <MedicationsReportManager {...props} />;

  return (
    <header css={style.header} data-testid="MedicationFilters">
      <div css={style.titleContainer}>
        <div css={style.titleContainer}>
          <h3 css={style.title}>{props.t('Medication')}</h3>
        </div>
        <div css={style.actions}>
          <>
            {renderStockManagementButton()}
            {renderAddMedicationButton()}
            {permissions.medical?.medications.canView && renderReportButton()}
          </>
        </div>
      </div>

      <div css={style.filters}>
        {renderSearchFilter()}
        {renderDateFilter()}
        {renderStatusFilter()}
        {renderProviderFilter()}
      </div>
      <div css={style.tabletFilters}>
        {renderDateFilter()}
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setIsFilterPanelShown(true)}
          kitmanDesignSystem
        />
        <SlidingPanelResponsive
          isOpen={isFilterPanelShown}
          title={props.t('Filters')}
          onClose={() => setIsFilterPanelShown(false)}
        >
          <div css={style.tabletFiltersPanel}>
            {renderSearchFilter()}
            {renderDateFilter()}
            {renderStatusFilter()}
            {renderProviderFilter()}
          </div>
        </SlidingPanelResponsive>
      </div>
      <div css={style.mobileFilters}>
        <div>{renderDateFilter()}</div>
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setIsFilterPanelShown(true)}
          kitmanDesignSystem
        />
        <SlidingPanelResponsive
          isOpen={isFilterPanelShown}
          title={props.t('Filters')}
          onClose={() => setIsFilterPanelShown(false)}
        >
          <div css={style.mobileFiltersPanel}>
            {renderSearchFilter()}
            {renderDateFilter()}
            {renderStatusFilter()}
            {renderProviderFilter()}
          </div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const MedicationFiltersTranslated: ComponentType<Props> =
  withNamespaces()(MedicationFilters);
export default MedicationFilters;
