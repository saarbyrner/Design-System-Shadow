// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import {
  InputText,
  Select,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type {
  PrincipleCategories,
  PrincipleTypes,
  PrinciplePhases,
  PrinciplesView,
  PrincipleFilterItem,
} from '@kitman/common/src/types/Principles';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getPrincipleSelectItems } from '../utils';
import styles from '../styles/filters';

type Props = {
  view: PrinciplesView,
  categories: PrincipleCategories,
  types: PrincipleTypes,
  phases: PrinciplePhases,
  squads: Squads,
  shouldFiltersEmptied: boolean,
  searchFilterChars: string,
  onFilterByItem: (
    filterItem: PrincipleFilterItem,
    filterItemIds: Array<number>
  ) => void,
  onFilterBySearch: (chars: string) => void,
};

const PrinciplesFilters = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const selectableCategories = getPrincipleSelectItems(props.categories);
  const selectableTypes = getPrincipleSelectItems(props.types);
  const selectablePhases = getPrincipleSelectItems(props.phases);
  const selectableSquads = getPrincipleSelectItems(props.squads);

  const [selectedCategories, setSelectedCategories] = useState<Array<number>>(
    []
  );
  const [selectedTypes, setSelectedTypes] = useState<Array<number>>([]);
  const [selectedPhases, setSelectedPhases] = useState<Array<number>>([]);
  const [selectedSquads, setSelectedSquads] = useState<Array<number>>([]);

  useEffect(() => {
    if (props.shouldFiltersEmptied) {
      setSelectedCategories([]);
      setSelectedTypes([]);
      setSelectedPhases([]);
      setSelectedSquads([]);
    }
  }, [props.shouldFiltersEmptied]);

  const filterBySearch = useDebouncedCallback((value: string) => {
    props.onFilterBySearch(value);
  }, 200);

  const searchFilter = (
    <div css={styles.filter} className="principlesFilters__filter">
      <InputText
        placeholder={props.t('Search principles')}
        onValidation={({ value }) => filterBySearch(value)}
        value={props.searchFilterChars || ''}
        disabled={!isPresentationView}
        kitmanDesignSystem
        searchIcon
      />
    </div>
  );
  const categoryFilter = (
    <div css={styles.filter} className="principlesFilters__filter">
      <Select
        placeholder={props.t('Category')}
        options={selectableCategories}
        onChange={(categoryIds) => {
          setSelectedCategories(categoryIds);
          props.onFilterByItem('category', categoryIds);
        }}
        value={selectedCategories}
        isDisabled={!isPresentationView}
        isMulti
        inlineShownSelection
      />
    </div>
  );
  const phaseOfPlayFilter = (
    <div css={styles.filter} className="principlesFilters__filter">
      <Select
        placeholder={props.t('Phases of play')}
        options={selectablePhases}
        onChange={(phaseIds) => {
          setSelectedPhases(phaseIds);
          props.onFilterByItem('phase', phaseIds);
        }}
        value={selectedPhases}
        isDisabled={!isPresentationView}
        isMulti
        inlineShownSelection
      />
    </div>
  );
  const typeFilter = (
    <div css={styles.filter} className="principlesFilters__filter">
      <Select
        placeholder={props.t('Type')}
        options={selectableTypes}
        onChange={(typeIds) => {
          setSelectedTypes(typeIds);
          props.onFilterByItem('type', typeIds);
        }}
        value={selectedTypes}
        isDisabled={!isPresentationView}
        isMulti
        inlineShownSelection
      />
    </div>
  );
  const squadFilter = (
    <div css={styles.filter} className="principlesFilters__filter">
      <Select
        placeholder={props.t('Squad')}
        options={selectableSquads}
        onChange={(squadIds) => {
          setSelectedSquads(squadIds);
          props.onFilterByItem('squad', squadIds);
        }}
        value={selectedSquads}
        isDisabled={!isPresentationView}
        isMulti
        inlineShownSelection
      />
    </div>
  );

  return (
    <>
      <div css={styles.filters} className="principlesFilters--desktop">
        {searchFilter}
        {categoryFilter}
        {phaseOfPlayFilter}
        {typeFilter}
        {squadFilter}
      </div>
      <div css={styles.mobileFilters} className="principlesFilters--mobile">
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanel
          isOpen={showFilterPanel}
          title={props.t('Filters')}
          togglePanel={() => setShowFilterPanel(false)}
        >
          <div
            css={styles.mobileFiltersPanel}
            className="principlesFilters__filtersPanel"
          >
            {searchFilter}
            {categoryFilter}
            {phaseOfPlayFilter}
            {typeFilter}
            {squadFilter}
          </div>
        </SlidingPanel>
      </div>
    </>
  );
};

export const PrinciplesFiltersTranslated: ComponentType<Props> =
  withNamespaces()(PrinciplesFilters);
export default PrinciplesFilters;
