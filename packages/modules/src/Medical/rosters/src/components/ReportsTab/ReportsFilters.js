// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  DateRangePicker,
  Select,
  SlidingPanelResponsive,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  RequestStatus,
  ReportsFilter as ReportsFilterType,
} from '../../../../shared/types';
import style from '../../../../shared/components/styles/filters';

type Props = {
  filter: ReportsFilterType,
  onChangeFilter: (filter: ReportsFilterType) => void,
  squads: Array<Option>,
  onClickQualityReports: () => void,
  onClickDiagnosticsRecords: () => void,
  onClickMedicationRecords: () => void,
  onClickNullDataReport: () => void,
  onClickHapAuthStatus: () => void,
  onClickParticipantExposure: () => void,
  onClickConcussionBaselineAudit: () => void,
  onClickHapCovidBranch: () => void,
  initialDataRequestStatus: RequestStatus,
  isExporting: boolean,
};

const ReportsFilters = (props: I18nProps<Props>) => {
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);

  const menuItems: Array<TooltipItem> = [
    {
      description: props.t('Exposure Quality Check'),
      onClick: props.onClickQualityReports,
    },
    {
      description: props.t('Diagnostic Records'),
      onClick: props.onClickDiagnosticsRecords,
    },
    {
      description: props.t('Medication Records'),
      onClick: props.onClickMedicationRecords,
    },
    {
      description: props.t('Null Data & Logic Check Report'),
      onClick: props.onClickNullDataReport,
    },
    {
      description: props.t('HAP Authorization Status'),
      onClick: props.onClickHapAuthStatus,
    },
    {
      description: props.t('Concussion Baseline Audit'),
      onClick: props.onClickConcussionBaselineAudit,
    },
    {
      description: props.t('HAP Participant Exposure'),
      onClick: props.onClickParticipantExposure,
    },
    {
      description: props.t('HAP Covid Branch'),
      onClick: props.onClickHapCovidBranch,
    },
  ];

  const squadFilter = (
    <div css={style.filter}>
      <Select
        placeholder={props.t('Roster')}
        value={props.filter.squads}
        options={props.squads}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filter,
            squads: id,
          })
        }
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );
  const dateFilter = (
    <div css={[style.filter, style['filter--daterange']]}>
      <DateRangePicker
        value={props.filter.date_range}
        placeholder={props.t('Date range')}
        position="right"
        onChange={(daterange) =>
          props.onChangeFilter({
            ...props.filter,
            date_range: daterange,
          })
        }
        turnaroundList={[]}
        isClearable
        kitmanDesignSystem
      />
    </div>
  );

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title}>{props.t('Reports')}</h3>
        {menuItems.length > 0 && (
          <TooltipMenu
            appendToParent
            placement="bottom-end"
            offset={[0, 5]}
            menuItems={menuItems}
            tooltipTriggerElement={
              <TextButton
                text={props.t('Quality Reports')}
                iconAfter="icon-chevron-down"
                type="primary"
                kitmanDesignSystem
                isDisabled={props.isExporting}
              />
            }
            kitmanDesignSystem
          />
        )}
      </div>
      <div css={style.filters}>
        {squadFilter}
        {dateFilter}
      </div>
      <div css={style.mobileFilters}>
        {dateFilter}
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
          <div css={style.mobileFiltersPanel}>{squadFilter}</div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const ReportsFiltersTranslated: ComponentType<Props> =
  withNamespaces()(ReportsFilters);
export default ReportsFilters;
