// @flow
import { useCallback, useMemo, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import debounce from 'lodash/debounce';

import { breakPoints } from '@kitman/common/src/variables';
import {
  InputText,
  TextButton,
  SlidingPanelResponsive,
  DateRangePicker,
  Checkbox,
} from '@kitman/components';
import type { DrugLotFilters } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const style = {
  filters: {
    display: 'flex',
  },
  'filters--desktop': {
    gap: '5px',
    alignItems: 'center',

    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
  },
  'filters--mobile': {
    gap: '5px',

    button: {
      marginBottom: '8px',
    },

    [`@media (min-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },

    [`@media (max-width: ${breakPoints.tablet})`]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  filter: {
    [`@media (min-width: ${breakPoints.desktop})`]: {
      minWidth: '180px',

      '.inputText': {
        width: '240px',
      },
    },

    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'block',
      marginBottom: '10px',
      width: '100%',
    },
  },
  'filter--daterange': {
    [`@media (max-width: ${breakPoints.tablet})`]: {
      marginBottom: '5px',
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      marginTop: 0,
      width: '235px',
    },
  },
  'filter--checkbox': {
    marginLeft: '0px',

    [`@media (min-width: ${breakPoints.desktop})`]: {
      marginLeft: '10px',
    },
  },
  filtersPanel: {
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: '8px 0 0 0',
  },
};

type Props = {
  filters: DrugLotFilters,
  onUpdateFilters: Function,
  isDisabled: boolean,
};

const StockManagementFilters = (props: I18nProps<Props>) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = useCallback(
    (value) => {
      props.onUpdateFilters({
        ...props.filters,
        search_expression: value,
      });
    },
    [props]
  );

  const debounceHandleSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  useEffect(() => {
    return () => {
      debounceHandleSearch?.cancel?.();
    };
  }, []);

  const renderSearchFilter = () => {
    return (
      <div css={style.filter}>
        <InputText
          data-testid="StockManagementFilters|Search"
          kitmanDesignSystem
          onValidation={({ value }) => {
            setSearchValue(value);
            debounceHandleSearch(value);
          }}
          placeholder={props.t('Search')}
          searchIcon
          value={searchValue}
          disabled={props.isDisabled}
        />
      </div>
    );
  };

  const renderDateFilter = () => {
    return (
      <div css={[style.filter, style['filter--daterange']]}>
        <DateRangePicker
          data-testid="StockManagementFilters|ExpirationDate"
          value={
            (props.filters.expiration_date && {
              start_date: props.filters.expiration_date.start,
              end_date: props.filters.expiration_date.end,
            }) ||
            null
          }
          placeholder={props.t('Expiration Date')}
          onChange={(dateRange) =>
            props.onUpdateFilters({
              ...props.filters,
              expiration_date:
                (dateRange && {
                  start: dateRange.start_date,
                  end: dateRange.end_date,
                }) ||
                null,
            })
          }
          isClearable
          turnaroundList={[]}
          allowFutureDate
          position="center"
          disabled={props.isDisabled}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const onClick = () => {
    props.onUpdateFilters({
      ...props.filters,
      available_only: !props.filters.available_only,
    });
  };

  const renderCheckboxFilter = () => {
    return (
      <div css={[style.filter, style['filter--checkbox']]}>
        <Checkbox
          data-testid="StockManagementFilters|AvailableOnly"
          id="available-only"
          name="available-only"
          label={props.t('In stock only')}
          isChecked={props.filters.available_only || false}
          toggle={() => onClick()}
          isDisabled={props.isDisabled}
          kitmanDesignSystem
        />
      </div>
    );
  };

  return (
    <>
      <div
        css={[style.filters, style['filters--mobile']]}
        data-testid="StockManagementFilters|MobileFilters"
      >
        {renderDateFilter()}
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanelResponsive
          isOpen={showFilterPanel}
          title={props.t('Filters')}
          onClose={() => setShowFilterPanel(false)}
        >
          <div css={style.filtersPanel}>
            {renderSearchFilter()}
            {renderCheckboxFilter()}
          </div>
        </SlidingPanelResponsive>
      </div>
      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="StockManagementFilters|DesktopFilters"
      >
        {renderSearchFilter()}
        {renderDateFilter()}
        {renderCheckboxFilter()}
      </div>
    </>
  );
};

export const StockManagementFiltersTranslated = withNamespaces()(
  StockManagementFilters
);
export default StockManagementFilters;
