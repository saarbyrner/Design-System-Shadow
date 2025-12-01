// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';
import { InputText, Select } from '@kitman/components';
import type {
  PrincipleCategories,
  PrincipleTypes,
  PrinciplePhases,
  PrincipleItems,
} from '@kitman/common/src/types/Principles';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type FilterItem = 'category' | 'phase' | 'type';
type FilterOptions = Array<{
  value: number | string,
  label: string,
}>;

type Props = {
  categories: PrincipleCategories,
  types: PrincipleTypes,
  phases: PrinciplePhases,
  hasPrincipleWithCategory: boolean,
  hasPrincipleWithPhase: boolean,
  onFilterByItem: (
    filterItem: FilterItem,
    filterItemIds: Array<number>
  ) => void,
  onFilterBySearch: (chars: string) => void,
  searchFilterChars: string,
};

const getFilterOptions = (principleItems: PrincipleItems): FilterOptions =>
  principleItems.map((item) => ({
    value: item.id,
    label: item.name,
  }));

const ActivityPrinciplesFilters = (props: I18nProps<Props>) => {
  const [selectedCategories, setSelectedCategories] = useState<Array<number>>(
    []
  );
  const [selectedTypes, setSelectedTypes] = useState<Array<number>>([]);
  const [selectedPhases, setSelectedPhases] = useState<Array<number>>([]);

  const style = {
    filters: css`
      display: flex;
      margin-top: 6px;
      gap: 6px;
      @media only screen and (max-width: ${breakPoints.tablet}) {
        flex-direction: column;
      }
    `,
    filter: css`
      flex: 1;
    `,
  };

  return (
    <>
      <InputText
        placeholder={props.t('Search principles')}
        onValidation={({ value }) => props.onFilterBySearch(value)}
        value={props.searchFilterChars || ''}
        kitmanDesignSystem
        searchIcon
      />
      <div css={style.filters}>
        {props.categories.length > 0 && props.hasPrincipleWithCategory && (
          <div
            className="activityPrinciplesPanel__filter--category"
            css={style.filter}
          >
            <Select
              placeholder={props.t('Category')}
              options={getFilterOptions(props.categories)}
              onChange={(categoryIds) => {
                setSelectedCategories(categoryIds);
                props.onFilterByItem('category', categoryIds);
              }}
              value={selectedCategories}
              inlineShownSelection
              inlineShownSelectionMaxWidth={70}
              isMulti
              showAutoWidthDropdown
            />
          </div>
        )}
        {props.phases.length > 0 && props.hasPrincipleWithPhase && (
          <div
            className="activityPrinciplesPanel__filter--phase"
            css={style.filter}
          >
            <Select
              placeholder={props.t('Phases')}
              options={getFilterOptions(props.phases)}
              onChange={(phaseIds) => {
                setSelectedPhases(phaseIds);
                props.onFilterByItem('phase', phaseIds);
              }}
              value={selectedPhases}
              inlineShownSelection
              inlineShownSelectionMaxWidth={70}
              isMulti
              showAutoWidthDropdown
            />
          </div>
        )}
        {props.types.length > 0 && (
          <div
            className="activityPrinciplesPanel__filter--type"
            css={style.filter}
          >
            <Select
              placeholder={props.t('Types')}
              options={getFilterOptions(props.types)}
              onChange={(typeIds) => {
                setSelectedTypes(typeIds);
                props.onFilterByItem('type', typeIds);
              }}
              value={selectedTypes}
              inlineShownSelection
              inlineShownSelectionMaxWidth={70}
              isMulti
              showAutoWidthDropdown
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ActivityPrinciplesFilters;
export const ActivityPrinciplesFiltersTranslated = withNamespaces()(
  ActivityPrinciplesFilters
);
