// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { breakPoints } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import { Select, TextButton, SlidingPanelResponsive } from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { ImportFilters } from '@kitman/services/src/services/imports/importMassAthletes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getImportTypeList, getStatusList } from './utils/workload';

const style = {
  filters: css`
    display: flex;
    padding: 10px 25px;
    align-items: center;
    z-index: 4;
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
  filtersPanel: css`
    padding: 25px;
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
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
};

type Props = {
  filters: ImportFilters,
  onUpdateFilters: Function,
  isDisabled: boolean,
};

const Filters = (props: I18nProps<Props>) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const renderImportTypeFilter = () => {
    const importTypeOptions = defaultMapToOptions(getImportTypeList());

    return (
      <div css={style.filter}>
        <Select
          appendToBody
          data-testid="Filters|ImportTypeSelect"
          options={importTypeOptions}
          onChange={(selectedItems) =>
            props.onUpdateFilters({
              ...props.filters,
              import_type: selectedItems,
            })
          }
          value={props.filters?.import_type}
          placeholder={props.t('Import Type')}
          isDisabled={props.isDisabled}
          showAutoWidthDropdown
          inlineShownSelection
        />
      </div>
    );
  };

  const renderStatusFilter = () => {
    const statusOptions = defaultMapToOptions(getStatusList());

    return (
      <div css={style.filter}>
        <Select
          appendToBody
          data-testid="Filters|StatusSelect"
          options={statusOptions}
          onChange={(selectedItems) =>
            props.onUpdateFilters({
              ...props.filters,
              status: selectedItems,
            })
          }
          value={props.filters?.status}
          placeholder={props.t('Status')}
          isDisabled={props.isDisabled}
          showAutoWidthDropdown
          inlineShownSelection
        />
      </div>
    );
  };

  return (
    <>
      <div
        css={[style.filters, style['filters--mobile']]}
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
          <div css={style.filtersPanel}>
            {renderImportTypeFilter()}
            {renderStatusFilter()}
          </div>
        </SlidingPanelResponsive>
      </div>
      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="Filters|DesktopFilters"
      >
        {renderImportTypeFilter()}
        {renderStatusFilter()}
        <TextButton
          text={props.t('Clear filters')}
          type="secondary"
          kitmanDesignSystem
          onClick={() => {
            props.onUpdateFilters({
              ...props.filters,
              status: null,
              import_type: null,
            });
          }}
        />
      </div>
    </>
  );
};

export const FiltersTranslated = withNamespaces()(Filters);
export default Filters;
