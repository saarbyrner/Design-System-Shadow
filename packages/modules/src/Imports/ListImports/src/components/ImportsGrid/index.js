// @flow
import { Fragment, useState } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  Select,
  AppStatus,
  TextButton,
  SlidingPanelResponsive,
} from '@kitman/components';
import TabLayout from '@kitman/components/src/TabLayout';
// object-styles-always ESLint rule is run in the pipeline.
import { css } from '@emotion/react';
/* eslint-enable */

import { breakPoints } from '@kitman/common/src/variables';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import RegistrationGrid from '@kitman/modules/src/LeagueOperations/technicalDebt/components/RegistrationGrid';
import useImportsListGrid from '../../hooks/useImportsListGrid';

type Props = {};

const filtersStyle = {
  // object-styles-always ESLint rule is run in the pipeline.
  filters: css`
    gap: 5px;
    gap: 5px;
    display: flex;
    align-items: center;
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 220px;

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
  filtersPanel: css`
    padding-top: 25px;
    padding-right: 25px;
    padding-left: 25px;
  `,
  'filters--desktop': css`
    padding: 10px 0px;

    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    padding: 10px 0;

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
  /* eslint-enable */
};

const fixedMenuWidth = {
  menu: (base) => {
    return { ...base, ...{ minWidth: '100%' } };
  },
};

const ImportsGrid = (props: I18nProps<Props>) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    isFetching,
    isLoading,
    isError,
    grid,
    onHandleFilteredSearch,
    filteredSearchParams,
    onUpdateFilter,
    meta,
    filterConfig,
  } = useImportsListGrid();

  const renderContent = () => {
    if (isError) return <AppStatus status="error" />;
    if (isLoading && meta.current_page === 1) return <TabLayout.Loading />;
    return (
      <RegistrationGrid
        onFetchData={() =>
          onHandleFilteredSearch({
            ...filteredSearchParams,
            page: meta.next_page,
          })
        }
        grid={{
          columns: grid.columns,
          rows: grid.rows,
        }}
        gridId={grid.id}
        emptyTableText={grid.emptyTableText}
        rowActions={null}
        isLoading={isFetching && meta.current_page === 1}
        meta={meta}
      />
    );
  };

  const renderImportTypeFilter = () => {
    return (
      <div css={filtersStyle.filter}>
        <Select
          appendToBody
          data-testid="Filters|ImportTypeSelect"
          options={filterConfig.importTypeOptions}
          onChange={(selectedItems) =>
            onUpdateFilter({
              import_types: [...selectedItems],
              page: 0,
            })
          }
          isMulti
          value={filteredSearchParams?.import_types}
          placeholder={props.t('Import Type')}
          isDisabled={isLoading || isError}
          showAutoWidthDropdown
          inlineShownSelection
          customSelectStyles={fixedMenuWidth}
        />
      </div>
    );
  };

  const renderStatusFilter = () => {
    return (
      <div css={filtersStyle.filter}>
        <Select
          appendToBody
          data-testid="Filters|StatusSelect"
          options={filterConfig.statusOptions}
          onChange={(selectedItems) =>
            onUpdateFilter({
              statuses: [...selectedItems],
              page: 0,
            })
          }
          isMulti
          value={filteredSearchParams?.statuses}
          placeholder={props.t('Status')}
          isDisabled={isLoading || isError}
          showAutoWidthDropdown
          inlineShownSelection
          customSelectStyles={fixedMenuWidth}
        />
      </div>
    );
  };

  const renderCreatorFilter = () => {
    return (
      <div css={filtersStyle.filter}>
        <Select
          appendToBody
          data-testid="Filters|CreatorSelect"
          options={filterConfig.creatorOptions}
          onChange={(selectedItems) =>
            onUpdateFilter({
              creator_ids: [...selectedItems],
              page: 0,
            })
          }
          isMulti
          value={filteredSearchParams?.creator_ids}
          placeholder={props.t('Creator')}
          isDisabled={isLoading || isError}
          showAutoWidthDropdown
          inlineShownSelection
          customSelectStyles={fixedMenuWidth}
        />
      </div>
    );
  };

  const renderClearFilterButton = () => {
    return (
      <TextButton
        text={props.t('Clear filters')}
        type="secondary"
        kitmanDesignSystem
        onClick={() => {
          onUpdateFilter({
            ...filteredSearchParams,
            statuses: [],
            import_types: [],
            creator_ids: [],
          });
        }}
      />
    );
  };

  const renderFilters = () => {
    return (
      <Fragment>
        <div
          css={[filtersStyle.filters, filtersStyle['filters--mobile']]}
          data-testid="Filters|MobileFilters"
        >
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
            <div css={filtersStyle.filtersPanel}>
              {renderImportTypeFilter()}
              {renderStatusFilter()}
              {renderCreatorFilter()}
              {renderClearFilterButton()}
            </div>
          </SlidingPanelResponsive>
        </div>
        <div
          css={[filtersStyle.filters, filtersStyle['filters--desktop']]}
          data-testid="Filters|DesktopFilters"
        >
          {renderImportTypeFilter()}
          {renderStatusFilter()}
          {renderCreatorFilter()}
          {renderClearFilterButton()}
        </div>
      </Fragment>
    );
  };

  return (
    <TabLayout>
      <TabLayout.Body>
        <TabLayout.Header>
          <TabLayout.Title>{props.t('Your Imports')}</TabLayout.Title>
        </TabLayout.Header>
        <TabLayout.Filters>{renderFilters()}</TabLayout.Filters>
        <TabLayout.Content>{renderContent()}</TabLayout.Content>
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ImportsGridTranslated = withNamespaces()(ImportsGrid);
export default ImportsGrid;
