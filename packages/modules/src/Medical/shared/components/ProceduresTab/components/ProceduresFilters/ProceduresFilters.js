// @flow
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import {
  DateRangePicker,
  InputTextField,
  Select,
  TextButton,
} from '@kitman/components';
import type { ProceduresFormDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import { breakPoints, colors } from '@kitman/common/src/variables';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { convertDateRangeToTuple } from '@kitman/playbook/components/wrappers/CustomDateRangePicker/utils';
import type { ProceduresFilter } from '../../../../types';
import { ADD_PROCEDURE_BUTTON } from '../../../../constants/elementTags';

const style = {
  header: css`
    align-items: flex-start;
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin-bottom: 8px;
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  filters: css`
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    z-index: 4;
  `,
  'filters--desktop': css`
    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    @media (min-width: ${breakPoints.desktop}) {
      display: none;
    }
    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
    @media (max-width: ${breakPoints.desktop}) {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      margin-right: 8px;
      min-width: 180px;

      .inputText {
        width: 240px;
      }
    }
    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
  'filter--daterange': css`
    position: relative;

    @media (max-width: ${breakPoints.tablet}) {
      margin-top: 8px;
    }
    @media (max-width: ${breakPoints.desktop}) {
      position: relative;
      width: 235px;
    }
  `,
  filtersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
  `,
  ProceduresButtons: css`
    display: flex;
    gap: 5px;
  `,
};

type Props = {
  proceduresFilterData: ProceduresFormDataResponse,
  squads: Array<Option>,
  filters: ProceduresFilter,
  hiddenFilters?: Array<string>,
  openAddProcedureSidePanel: Function,
  onChangeFilter: (filter: ProceduresFilter) => void,
};

const ProceduresFilters = (props: I18nProps<Props>) => {
  const renderSearchFilter = (
    <div css={style.filter}>
      <InputTextField
        data-testid="ProceduresFilters|Search"
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
        disabled={false}
      />
    </div>
  );
  const renderDateFilter = () => {
    return (
      <div css={[style.filter, style['filter--daterange']]}>
        {!window.getFlag('pm-date-range-picker-custom') && (
          <DateRangePicker
            data-testid="ProceduresFilters|DateRange"
            value={props.filters.date_range}
            placeholder={props.t('Date Range')}
            onChange={(dateRange) =>
              props.onChangeFilter({
                ...props.filters,
                date_range: dateRange,
              })
            }
            isClearable
            turnaroundList={[]}
            allowFutureDate
            position="center"
            kitmanDesignSystem
            disabled={false}
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
  const renderReasonFilter = (
    <div css={style.filter} data-testid="ProceduresFilters|ReasonFilter">
      <Select
        placeholder={props.t('Reason')}
        value={props.filters.procedure_reason_ids}
        options={
          props?.proceduresFilterData?.procedure_reasons?.map(
            ({ id, name }) => ({
              label: name,
              value: id,
            })
          ) || []
        }
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            procedure_reason_ids: id,
          })
        }
        isDisabled={false}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );
  const renderRosterFilter = (
    <div css={style.filter} data-testid="ProceduresFilters|RosterFilter">
      <Select
        placeholder={props.t('Roster')}
        value={props.filters.squads}
        options={props.squads || []}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            squads: id,
          })
        }
        isDisabled={false}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const renderCompanyFilter = (
    <div css={style.filter} data-testid="ProceduresFilters|CompanyFilter">
      <Select
        placeholder={props.t('Company')}
        value={props.filters.procedure_location_ids}
        options={
          props?.proceduresFilterData?.locations?.map(({ id, name }) => ({
            label: name,
            value: id,
          })) || []
        }
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filters,
            procedure_location_ids: id,
          })
        }
        isDisabled={false}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const renderAddProcedureButton = () => {
    if (props.hiddenFilters?.includes(ADD_PROCEDURE_BUTTON)) return null;
    return (
      <TextButton
        text={props.t('Add procedure')}
        type="primary"
        kitmanDesignSystem
        onClick={() => props.openAddProcedureSidePanel()}
      />
    );
  };

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title} data-testid="ProceduresFilters|Title">
          {props.t('Procedures')}
        </h3>
        <div css={style.ProceduresButtons}>{renderAddProcedureButton()}</div>
      </div>
      <div css={style.filters}>
        {renderSearchFilter}
        {renderDateFilter()}
        {renderReasonFilter}
        {renderCompanyFilter}
        {!props.hiddenFilters?.includes('squads') && renderRosterFilter}
      </div>
    </header>
  );
};

export const ProceduresFiltersTranslated = withNamespaces()(ProceduresFilters);
export default ProceduresFilters;
