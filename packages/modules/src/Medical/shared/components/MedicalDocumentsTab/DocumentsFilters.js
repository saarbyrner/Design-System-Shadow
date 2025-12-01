// @flow
import { withNamespaces } from 'react-i18next';
import {
  DateRangePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { DateRange } from '@kitman/common/src/types';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useState } from 'react';
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import type {
  DocumentsFilters as DocumentsFiltersType,
  RequestStatus,
} from '../../types';
import { ADD_DOCUMENT_BUTTON } from '../../constants/elementTags';

export const style = {
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
    margin-bottom: 16px;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  filters: css`
    display: flex;
    flex-wrap: wrap;
  `,
  'filters--desktop': css`
    gap: 5px;

    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    gap: 5px;

    button {
      margin-bottom: 8px;
    }

    @media (min-width: ${breakPoints.desktop}) {
      display: none;
    }
    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 200px;

      .inputText {
        width: 300px;
      }
    }
    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
  'filter--daterange': css`
    @media (max-width: ${breakPoints.tablet}) {
      margin-bottom: 5px;
    }
    @media (max-width: ${breakPoints.desktop}) {
      margin-top: 0;
      width: 235px;
    }
  `,
  filtersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
    margin: 8px 0 0 0;
  `,
  documentButtons: css`
    display: flex;
    gap: 5px;
  `,
};

type Props = {
  setIsPanelOpen: Function,
  playerOptions: Array<Option>,
  categoryOptions: Array<Option>,
  initialDataRequestStatus: RequestStatus,
  selectedPlayer: number | null,
  setSelectedPlayer: Function,
  selectedDateRange: DateRange,
  setSelectedDateRange: Function,
  searchContent: string,
  setSearchContent: Function,
  selectedCategories: number,
  setSelectedCategories: Function,
  showPlayerFilter: boolean,
  filters: DocumentsFiltersType,
  setFilters: Function,
  hiddenFilters: Array<string>,
};

const DocumentsFilters = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const [showMobileFilterPanel, setShowMobileFilterPanel] =
    useState<boolean>(false);

  const renderSearchBar = (
    <div css={style.filter}>
      <InputTextField
        data-testid="DocumentsFilters|SearchBar"
        kitmanDesignSystem
        onChange={(e) => {
          props.setSearchContent(e.target.value);
          props.setFilters({
            ...props.filters,
            content: e.target.value,
          });
        }}
        placeholder={props.t('Search Notes')}
        searchIcon
        value={props.searchContent}
      />
    </div>
  );

  const renderDateFilter = (
    <div css={[style.filter, style['filter--daterange']]}>
      {!window.getFlag('pm-date-range-picker-custom') && (
        <DateRangePicker
          data-testid="DocumentsFilters|DateRange"
          value={props.selectedDateRange}
          placeholder={props.t('Date range')}
          onChange={(value) => {
            props.setSelectedDateRange(value);
            props.setFilters({
              ...props.filters,
              date_range: value,
            });
          }}
          turnaroundList={[]}
          position="right"
          isClearable
          onClear={() => {
            props.setSelectedDateRange(null);
            props.setFilters({
              ...props.filters,
              date_range: null,
            });
          }}
          kitmanDesignSystem
        />
      )}

      {window.getFlag('pm-date-range-picker-custom') && (
        <CustomDateRangePicker
          variant="menuFilters"
          onChange={(daterange) => {
            if (props.setFilters) {
              props.setFilters({
                ...props.filters,
                date_range: daterange,
              });
            }
          }}
        />
      )}
    </div>
  );

  const renderPlayerFilter = (
    <div css={style.filter}>
      <Select
        data-testid="DocumentsFilters|PlayerSelect"
        placeholder={props.t('Player')}
        value={props.selectedPlayer}
        options={props.playerOptions}
        onChange={(id) => {
          props.setSelectedPlayer(id);
          props.setFilters({
            ...props.filters,
            athlete_id: id,
          });
        }}
        isClearable
        onClear={() => {
          props.setSelectedPlayer(null);
          props.setFilters({
            ...props.filters,
            athlete_id: null,
          });
        }}
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
      />
    </div>
  );

  const renderCategoryFilter = (
    <div css={style.filter}>
      <Select
        data-testid="DocumentsFilters|CategorySelect"
        placeholder={props.t('Categories')}
        value={props.selectedCategories}
        options={props.categoryOptions}
        onChange={(id) => {
          props.setSelectedCategories(id);
          props.setFilters({
            ...props.filters,
            document_note_category_ids: id,
          });
        }}
        isClearable
        onClear={() => {
          props.setSelectedCategories([]);
          props.setFilters({
            ...props.filters,
            document_note_category_ids: [],
          });
        }}
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
      />
    </div>
  );

  const renderAddDocumentButton = () => {
    if (props.hiddenFilters?.includes(ADD_DOCUMENT_BUTTON)) return null;
    return (
      <TextButton
        text={props.t('Add document')}
        type="primary"
        kitmanDesignSystem
        onClick={() => props.setIsPanelOpen(true)}
        isDisabled={!permissions.medical.documents.canCreate}
        data-testid="DocumentsFilters|AddDocument"
      />
    );
  };

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title} data-testid="DocumentsFilters|Title">
          {props.t('Documents')}
        </h3>
        <div css={style.documentButtons}>{renderAddDocumentButton()}</div>
      </div>

      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="DocumentsFilters|DesktopFilters"
      >
        {renderSearchBar}
        {renderDateFilter}
        {props.showPlayerFilter && renderPlayerFilter}
        {renderCategoryFilter}
      </div>

      <div
        css={[style.filters, style['filters--mobile']]}
        data-testid="DocumentsFilters|MobileFilters"
      >
        {renderDateFilter}

        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowMobileFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanelResponsive
          isOpen={showMobileFilterPanel}
          title={props.t('Filters')}
          onClose={() => setShowMobileFilterPanel(false)}
        >
          <div css={style.filtersPanel}>
            {renderSearchBar}
            {props.showPlayerFilter && renderPlayerFilter}
            {renderCategoryFilter}
          </div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const DocumentsFiltersTranslated = withNamespaces()(DocumentsFilters);
export default DocumentsFilters;
