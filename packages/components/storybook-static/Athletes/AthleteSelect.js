// @flow
import { withNamespaces } from 'react-i18next';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import ReactSelect from 'react-select';
import _uniqBy from 'lodash/uniqBy';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqueId from 'lodash/uniqueId';

import { colors } from '@kitman/common/src/variables';
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import zIndices from '@kitman/common/src/variables/zIndices';
import SelectComponents from '../Select/Components';
import ReactSelectOverrides from '../Select/ReactSelectOverrides';
import { useSelectContext } from '../Select/hooks';
import { AthleteProvider } from './components/AthleteContext';
import { AthletesBySquadSelector } from './components';
import type {
  ID,
  ItemLeftRenderer,
  SquadAthletes,
  SquadAthletesSelection,
  IsSelectedCallback,
  OnOptionClickCallback,
  OnSelectAllClickCallback,
  OnClearAllClickCallback,
  OptionType,
  ReactSelectProps,
} from './types';
import { useAthleteContext, useOptions } from './hooks';
import { getLabelOptions, getSegmentOptions, getSquadOptions } from './utils';

type AthleteSelectProps = {
  value: Array<SquadAthletesSelection>,
  isMulti?: boolean,
  squadAthletes: SquadAthletes,
  onChange: (selection: SquadAthletesSelection[]) => void,
  includeContextSquad?: boolean,
  defaultSelectedSquadId?: ?ID,
  isDisabled?: boolean,
  isLoading?: boolean,
  label?: string,
  placeholder?: string,
  customPlaceholderRenderer?: () => boolean,
  menuPosition?: 'fixed' | 'absolute',
  hiddenTypes?: Array<OptionType>,
  renderItemLeft?: ItemLeftRenderer,
  isSelected?: IsSelectedCallback,
  onOptionClick?: OnOptionClickCallback,
  onSelectAllClick?: OnSelectAllClickCallback,
  onClearAllClick?: OnClearAllClickCallback,
  isClearable?: boolean,
  enableAllGroupSelection?: boolean,
  searchAllLevels?: boolean,
  labels?: Array<LabelPopulation>,
  segments?: Array<GroupPopulation>,
  components?: Object,
  appendToBody?: boolean,
  closeMenuOnScroll?: boolean,
  clearSearchValueOnUnmount?: boolean,
  subtitle?: string,
  reactSelectProps?: ReactSelectProps,
};

type AthleteMenuListProps = {
  selectProps: {
    defaultSelectedSquadId: number,
    searchText: string,
    isLoading: boolean,
    renderItemLeft: boolean,
    hiddenTypes: Array<string>,
    enableAllGroupSelection: boolean,
    searchAllLevels: boolean,
    clearSearchValueOnUnmount?: boolean,
    subtitle?: string,
    reactSelectProps?: ReactSelectProps,
  },
};

const MIN_MENU_HEIGHT = 300;

const LoadingBlock = () => (
  <div
    css={{
      backgroundColor: colors.neutral_200,
      height: '24px',
      margin: '8px 16px',
      borderRadius: '4px',
    }}
  />
);

function AthleteMenuList(props: I18nProps<AthleteMenuListProps>) {
  const { searchValue, setSearchValue, searchInputProps } = useSelectContext();
  const { value, isMulti } = useAthleteContext();
  const valueRef = useRef(value);
  const [selectedSquadId, setSelectedSquadId] = useState(
    props.selectProps.defaultSelectedSquadId || null
  );

  useEffect(() => {
    // Closing the select dropdown if the value has changed,
    // This will need to be bypassed for multi select
    if (!_isEqual(value, valueRef.current) && !isMulti) {
      valueRef.current = _cloneDeep(value);
      searchInputProps.onBlur();
      setSelectedSquadId(props.selectProps.defaultSelectedSquadId || null);
      setSearchValue('');
    }
  }, [value]);

  // Clearing search value on unmount of component
  useEffect(() => {
    return () => {
      if (props.selectProps.clearSearchValueOnUnmount) {
        setSearchValue('');
      }
    };
  }, []);

  return (
    <>
      <SelectComponents.SearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={props.selectProps.searchText}
        onBlur={searchInputProps.onBlur}
      />
      <div
        css={{
          marginTop: '48px',
        }}
      >
        <div
          css={{
            height: MIN_MENU_HEIGHT,
            minWidth: '300px',
            overflow: 'hidden',
          }}
        >
          {!props.selectProps.isLoading && (
            <AthletesBySquadSelector
              searchValue={searchValue}
              selectedSquadId={selectedSquadId}
              onSquadClick={setSelectedSquadId}
              renderItemLeft={props.selectProps.renderItemLeft}
              hiddenTypes={props.selectProps.hiddenTypes}
              enableAllGroupSelection={
                props.selectProps?.enableAllGroupSelection
              }
              searchAllLevels={props.selectProps?.searchAllLevels}
              subtitle={props.selectProps.subtitle}
            />
          )}
          {props.selectProps.isLoading && (
            <>
              <LoadingBlock />
              <LoadingBlock />
              <LoadingBlock />
            </>
          )}
        </div>
      </div>
    </>
  );
}

function AthleteSelectComponent(props: I18nProps<AthleteSelectProps>) {
  const { data: optionsBySquad } = useOptions({
    groupBy: 'squad',
  });

  const value = useMemo(() => {
    if (props.value.length === 0) return props.isMulti ? [] : null;

    const selectedOptions = [
      'position_groups',
      'positions',
      'athletes',
      'squads',
      'labels',
      'segments',
    ].reduce((acc, valueKey) => {
      const opts = props.value.flatMap((val) => {
        if (!val[valueKey]?.length) {
          return acc;
        }

        // find the selected squads
        const filteredOptions = getSquadOptions(optionsBySquad, val, valueKey);

        // find selected label
        const labelOptions = getLabelOptions(props.labels, val, valueKey);

        // find selected segment
        const segmentOptions = getSegmentOptions(props.segments, val, valueKey);

        return [...filteredOptions, ...labelOptions, ...segmentOptions];
      });

      return [...acc, ...opts];
    }, []);

    return _uniqBy(selectedOptions, 'label');
  }, [optionsBySquad, props.value, props.isMulti]);

  const getPlaceholder = () => {
    if (!props.placeholder) {
      return null;
    }

    if (props.customPlaceholderRenderer?.()) {
      return props.placeholder;
    }

    if (props.isMulti && props.value && props.value.length > 0) {
      return null;
    }

    return props.placeholder;
  };

  const labelId = useMemo(() => _uniqueId('athlete_select_label_'), []);

  return (
    <SelectComponents.Root>
      <SelectComponents.Label
        labelId={labelId}
        label={props.label || props.t('Athletes')}
        dataAttribute="athletes_select_label"
        isDisabled={props.isDisabled}
      />
      <ReactSelect
        aria-labelledby={labelId}
        value={value}
        options={[]}
        onKeyDown={() => {}}
        captureMenuScroll={false}
        classNamePrefix="kitmanReactSelect"
        theme={(theme) => {
          return {
            ...theme,
            borderRadius: 3,
            spacing: { ...theme.spacing, controlHeight: 32 },
          };
        }}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: zIndices.selectMenu,
            width: '100%',
          }),
        }}
        components={{
          Input: ReactSelectOverrides.Input,
          DropdownIndicator: ReactSelectOverrides.DropdownIndicator,
          Menu: ReactSelectOverrides.Menu,
          ValueContainer: ReactSelectOverrides.ValueContainer,
          MenuList: AthleteMenuList,
          ...props.components,
        }}
        placeholder={getPlaceholder()}
        isDisabled={props.isDisabled}
        isLoading={props.isLoading}
        backspaceRemovesValue={false}
        minMenuHeight={MIN_MENU_HEIGHT}
        controlShouldRenderValue={!props.isMulti}
        isClearable={props.isClearable}
        onChange={(_, { action }) => {
          if (action === 'clear') {
            props.onChange([]);
          }
        }}
        menuPortalTarget={props.appendToBody ? document.body : null}
        menuPlacement="auto"
        menuPosition={props.menuPosition ?? 'fixed'}
        /*
         * react-select has a bug where the dropdown remains fixed in place
         * and doesn't scroll with the parent container when appended to the body.
         * This happens only when the dropdown is in a fixed element as a modal or a side panel.
         * https://github.com/JedWatson/react-select/issues/4088
         *
         * As a workaround, we can close the dropdown when the user scrolls with closeMenuOnScroll.
         */
        closeMenuOnScroll={(e) =>
          props.closeMenuOnScroll &&
          !e.target?.className?.includes('kitmanReactSelect')
        }
        // onClear
        isMulti={props.isMulti}
        // Props to pass to the AthleteBySquadSelector
        defaultSelectedSquadId={props.defaultSelectedSquadId}
        renderItemLeft={props.renderItemLeft}
        hiddenTypes={props.hiddenTypes}
        enableAllGroupSelection={props.enableAllGroupSelection}
        searchAllLevels={props.searchAllLevels}
        clearSearchValueOnUnmount={props.clearSearchValueOnUnmount}
        subtitle={props.subtitle}
        {...props.reactSelectProps}
      />
    </SelectComponents.Root>
  );
}

function AthleteSelect(props: I18nProps<AthleteSelectProps>) {
  return (
    <AthleteProvider
      squadAthletes={props.squadAthletes}
      value={props.value}
      onChange={props.onChange}
      includeContextSquad={props.includeContextSquad}
      isMulti={props.isMulti}
      isSelected={props.isSelected}
      onOptionClick={props.onOptionClick}
      onSelectAllClick={props.onSelectAllClick}
      onClearAllClick={props.onClearAllClick}
      menuPosition={props.menuPosition ?? 'fixed'}
    >
      <AthleteSelectComponent {...props} />
    </AthleteProvider>
  );
}

export const AthleteSelectTranslated: ComponentType<AthleteSelectProps> =
  withNamespaces()(AthleteSelect);
export default AthleteSelect;
