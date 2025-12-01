// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { DateRange } from '@kitman/common/src/types';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  DateRangePicker,
  InputText,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import type { AthleteIssueStatuses } from '@kitman/modules/src/Medical/rosters/src/services/getAthleteIssueStatuses';

import { getAthleteIssueStatusesAsSelectOptions } from '../../utils';
import type { AthleteIssueTypes } from '../../types';

type Props = {
  athleteIssueTypes: AthleteIssueTypes,
  athleteIssueStatuses: AthleteIssueStatuses,
  dateRange: ?DateRange,
  onFilterBySearch: (searchQuery: string) => void,
  onFilterByType: (type: ?string) => void,
  onFilterByStatus: (statusIds: Array<number>) => void,
  onFilterByDateRange: (dateRange: ?DateRange) => void,
  showArchivedIssues: boolean,
};

const styles = {
  filters: css`
    display: flex;
    @media only screen and (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  mobileFilters: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      &:first-of-type {
        max-width: 235px;
      }
    }

    @media only screen and (min-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  mobileFiltersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
    margin: 8px 0 0 0;
  `,
  filter: css`
    @media only screen and (max-width: ${breakPoints.desktop}) {
      margin: 8px 0 0 0;
      width: 100%;
      &:first-of-type {
        margin: 0 5px 0 0;
      }
    }
    @media only screen and (min-width: ${breakPoints.desktop}) {
      margin: 0 5px 0 0;
      min-width: 100px;
      position: relative;
      &:first-of-type {
        width: 240px;
      }
    }
  `,
};

const IssuesFilters = (props: I18nProps<Props>) => {
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Array<number>>([]);
  const { organisation } = useOrganisation();

  const debounceFilter = useDebouncedCallback(
    <T: Function>(filter: T, param) => filter(param),
    400
  );

  const searchFilter = (
    <div css={styles.filter}>
      <InputText
        placeholder={props.t('Search')}
        onValidation={({ value = '' }) => {
          if (value === searchQuery) {
            return;
          }
          setSearchQuery(value);
          debounceFilter(props.onFilterBySearch, value);
        }}
        value={searchQuery}
        kitmanDesignSystem
        searchIcon
      />
    </div>
  );
  const typeFilter = organisation.coding_system_key !==
    codingSystemKeys.CLINICAL_IMPRESSIONS && (
    <div css={styles.filter}>
      <Select
        placeholder={props.t('Type')}
        options={props.athleteIssueTypes}
        onChange={(type) => {
          setSelectedType(type);
          debounceFilter(props.onFilterByType, type);
        }}
        value={selectedType}
        isClearable
        onClear={() => {
          setSelectedType(null);
          debounceFilter(props.onFilterByType, null);
        }}
        showAutoWidthDropdown
      />
    </div>
  );
  const statusFilter = !props.showArchivedIssues && (
    <div css={styles.filter}>
      <Select
        placeholder={props.t('Status')}
        options={getAthleteIssueStatusesAsSelectOptions(
          props.athleteIssueStatuses
        )}
        onChange={(statusIds) => {
          setSelectedStatus(statusIds);
          debounceFilter(props.onFilterByStatus, statusIds);
        }}
        value={selectedStatus}
        isMulti
        inlineShownSelection
        showAutoWidthDropdown
      />
    </div>
  );
  const dateFilter = (
    <div css={styles.filter}>
      {!window.getFlag('pm-date-range-picker-custom') && (
        <DateRangePicker
          position="right"
          onChange={(dateRange) => {
            debounceFilter(props.onFilterByDateRange, dateRange);
          }}
          value={props.dateRange || null}
          turnaroundList={[]}
          placeholder={props.t('Date Range')}
          isClearable
          allowFutureDate
          kitmanDesignSystem
        />
      )}

      {window.getFlag('pm-date-range-picker-custom') && (
        <CustomDateRangePicker
          variant="menuFilters"
          // NOTE: there seems to be no caching of the date range
          onChange={(daterange) => {
            debounceFilter(props.onFilterByDateRange, daterange);
          }}
        />
      )}
    </div>
  );

  return (
    <>
      <div css={styles.filters}>
        {searchFilter}
        {dateFilter}
        {typeFilter}
        {statusFilter}
      </div>
      <div css={styles.mobileFilters}>
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
          <div css={styles.mobileFiltersPanel}>
            {searchFilter}
            {typeFilter}
            {statusFilter}
          </div>
        </SlidingPanelResponsive>
      </div>
    </>
  );
};

export const IssuesFiltersTranslated = withNamespaces()(IssuesFilters);
export default IssuesFilters;
