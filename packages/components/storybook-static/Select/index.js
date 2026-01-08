// @flow
import { useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import ReactSelect from 'react-select';
import _findIndex from 'lodash/findIndex';
import _isEqual from 'lodash/isEqual';
import _uniqueId from 'lodash/uniqueId';
import { withNamespaces } from 'react-i18next';
import { ValidationText } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import zIndices from '@kitman/common/src/variables/zIndices';
import { useSelectContext } from './hooks';
import SelectComponents from './Components';
import ReactSelectOverrides from './ReactSelectOverrides';

export const fullWidthMenuCustomStyles = {
  menu: (base: { [key: string]: string }) => {
    return { ...base, minWidth: '100%' };
  },
};

export const fitContentMenuCustomStyles = {
  menu: (base: { [key: string]: string }) => {
    return { ...base, minWidth: 'fit-content' };
  },
};

export type Options = {
  label: string,
  value: any,
  isDisabled?: boolean,
  requiresText?: boolean,
};

export type Option = {
  label: string,
  value?: any,
  type?: ?string,
  id?: string | number,
  requiresText?: boolean,
  options?: Array<Options>,
  isDisabled?: boolean,
  loadAsyncOptions?: {
    // callback to fetch submenu data
    fetchOptions: Promise<Option | Object>,
    // args to pass into the fetch
    // must match what callback is expecting
    fetchOptionsArgs?: Object,
    mapping?: {
      // callback to map Promise response to Select Options data-type
      callback?: Function,
    },
  },
};
type FilterOptionOption = {
  label: string,
  value: string,
  data: Option,
};

export type FilterOption = (
  option: FilterOptionOption,
  inputValue: string
) => boolean;

type IconConfig = {
  iconName?: string,
  onClick?: Function,
};

export type Props = {
  value: any,
  label?: string,
  options: Array<Option>,
  groupBy?: 'nested' | 'submenu' | 'paginated',
  isMulti?: boolean,
  includeIconConfig?: IconConfig,
  isClearable?: boolean,
  isSearchable?: boolean,
  className?: string,
  isLoading?: boolean,
  invalid?: boolean,
  placeholder?: string,
  customPlaceholderRenderer?: () => string,
  labelIcon?: string,
  // A string which will be displayed in the select element when `isMutli`
  // prop is passed and at least one element is selected, e.g.
  // `${selected.length} selected`.
  valueContainerContent?: string,
  onChange: (any) => void,
  onClear: () => void,
  onMenuOpen?: () => void,
  onMenuClose?: () => void,
  onBlur?: (any) => void,
  onClickIcon?: () => void,
  isDisabled?: boolean,
  appendToBody?: boolean,
  allowSelectAll?: boolean,
  allowClearAll?: boolean,
  actionsLabel?: string,
  selectAllGroups?: boolean,
  showSubmenuActions?: boolean,
  /*
   * multiSelectSubMenu is overpowered by isMulti making every item selectable.
   * When multiSelectSubMenu is used on its own only submenu items inside the same submenu are multi-selectable
   */
  multiSelectSubMenu?: boolean,
  showAutoWidthDropdown?: boolean,
  minMenuHeight?: number,
  menuPlacement?: 'auto' | 'bottom' | 'top',
  menuPosition?: 'fixed' | 'absolute',
  openMenuOnEnterKey?: boolean,
  optional?: boolean,
  required?: boolean,
  closeMenuOnScroll?: boolean,
  asyncSubmenu?: boolean,
  returnParentInValueFromSubMenu?: boolean,
  hideCounter?: boolean,
  tabIndex?: string,
  customSelectStyles: string,
  filterOption?: FilterOption,
  returnObject?: boolean,
  renderControl: () => {},
  displayValidationText?: boolean,
  customValidationText?: string,
  labeledby?: string,
  hideOnSearch?: Boolean,
  dataAttribute?: string,
  showOptionTooltip?: boolean,
};

const SelectComponent = (props: I18nProps<Props>) => {
  const [asyncSubmenuOptions, setAsyncSubmenuOptions] = useState<
    Array<Array<Option>>
  >([]);

  const reactSelect = useRef(null);
  const { searchValue, setSearchValue } = useSelectContext();
  const isGrouped =
    props.groupBy !== 'submenu' &&
    _findIndex(props.options, (option) => !!option?.options) > -1;

  const fullOptions = useMemo(() => {
    const options =
      isGrouped || props.groupBy === 'submenu'
        ? props.options.flatMap(
            (optionsGroup) => optionsGroup?.options || optionsGroup
          )
        : props.options;
    const arrayOfSubmenuStates = asyncSubmenuOptions.flat();
    if (asyncSubmenuOptions.length > 0) {
      options.push(...arrayOfSubmenuStates);
    }
    return options;
  }, [props.options, isGrouped, asyncSubmenuOptions]);

  // if the select field isGrouped ensure all options between groups are checked
  const allowSearch = useMemo(() => {
    if (props.isSearchable) {
      return true;
    }

    if (isGrouped) {
      return fullOptions.length > 10;
    }

    return props.options.length > 10;
  }, [props.isSearchable, isGrouped, props.options, fullOptions]);

  const selectedOption = useMemo(() => {
    if (props.isMulti) {
      return fullOptions.filter((option) =>
        props.value?.includes(option?.value)
      );
    }
    if (props.multiSelectSubMenu) {
      const arrayOfJustValues = props.value?.map((i) => i.value);
      const checkIfValueIsLoaded = fullOptions.filter((option) =>
        arrayOfJustValues?.includes(option?.value)
      );

      // if the select is async the selected value may not be loaded in the select yet
      return checkIfValueIsLoaded.length > 0
        ? props.value
        : [props.value[0]].filter(Boolean);
    }

    return (
      fullOptions.find((option) => _isEqual(option?.value, props.value)) || null
    );
  }, [props.value, fullOptions]);

  /* If select all is clicked it sends back all of the group arrays,
     since we already have fullOptions, well use that to select all, since we still need
     single select and deselect well also have the same single value update that we have in the onChange. */
  const handleMultiGroupSelect = (selection) => {
    if (selection.some((group) => group.options)) {
      props.onChange(fullOptions.map(({ value }) => value));
    } else {
      props.onChange(selection.map(({ value }) => value));
    }
  };

  const customStyles = {
    option: (styles, { data }) => {
      const dataStyles = data.styles || {};

      return {
        ...styles,
        ...dataStyles,
      };
    },
    ...props.customSelectStyles,
  };

  const getPlaceholder = () => {
    if (!props.placeholder) {
      return null;
    }

    if (props.customPlaceholderRenderer?.()) {
      return props.placeholder;
    }

    if (
      (props.isMulti || props.multiSelectSubMenu) &&
      props.value?.length > 0
    ) {
      return null;
    }
    return props.placeholder;
  };

  // Generating a unique label id to pass through to select component
  const labelId = useMemo(() => _uniqueId('select_label_'), []);
  //  Hide all selectors during a search operation.
  //  "Select All" and "Clear" actions will apply to all options, not just search results.
  const hideOnSearch = props.hideOnSearch && searchValue;

  return (
    <>
      <SelectComponents.Label
        labelId={labelId}
        label={props.label}
        dataAttribute={props.dataAttribute}
        isDisabled={props.isDisabled}
        icon={props.labelIcon}
        onClickIcon={props.onClickIcon}
      />
      <ReactSelect
        aria-labelledby={props.labeledby || labelId}
        ref={reactSelect}
        value={selectedOption}
        valueContainerContent={props.valueContainerContent}
        options={props.options}
        groupBy={props.groupBy}
        asyncSubmenu={props.asyncSubmenu}
        setAsyncSubmenuOptions={setAsyncSubmenuOptions}
        asyncSubmenuOptions={asyncSubmenuOptions}
        inputValue={searchValue}
        captureMenuScroll={false}
        onKeyDown={(e) => {
          if (
            props.openMenuOnEnterKey &&
            e.key === 'Enter' &&
            reactSelect.current
          ) {
            reactSelect.current.onMenuOpen();
          }
        }}
        onChange={(selection) => {
          if (!selection) {
            props.onClear();
          } else if (props.isMulti) {
            if (props.selectAllGroups) {
              handleMultiGroupSelect(selection);
            } else {
              props.onChange(selection.map(({ value }) => value));
            }
          } else if (props.multiSelectSubMenu) {
            props.onChange(Array.isArray(selection) ? selection : [selection]);
          } else {
            // blur on click else
            if ('activeElement' in document && document.activeElement) {
              document.activeElement.blur();
            }

            if (props.returnObject) {
              props.onChange(selection);
            } else {
              props.onChange(selection.value);
            }
          }
        }}
        onBlur={() => props.onBlur && props.onBlur(selectedOption)}
        placeholder={getPlaceholder()}
        className={classNames(
          'kitmanReactSelect',
          {
            'kitmanReactSelect--invalid': props.invalid,
          },
          props.className ? props.className : ''
        )}
        actionsLabel={props.actionsLabel}
        onMenuClose={() => {
          props.onMenuClose?.();
          setSearchValue('');
        }}
        onMenuOpen={() => {
          props.onMenuOpen?.();
        }}
        classNamePrefix="kitmanReactSelect"
        menuPlacement={props.menuPlacement}
        menuPosition={props.menuPosition}
        theme={(theme) => {
          return {
            ...theme,
            borderRadius: 3,
            spacing: { ...theme.spacing, controlHeight: 32 },
          };
        }}
        components={{
          Input: ReactSelectOverrides.Input,
          DropdownIndicator: ReactSelectOverrides.DropdownIndicator,
          Option: ReactSelectOverrides.DropdownOption,
          Menu: ReactSelectOverrides.Menu,
          MenuList:
            props.groupBy === 'paginated'
              ? ReactSelectOverrides.PaginatedMenuList
              : ReactSelectOverrides.MenuList,
          SingleValue: ReactSelectOverrides.SingleValue,
          ValueContainer: ReactSelectOverrides.ValueContainer,
          Control: ReactSelectOverrides.Control,
          Group: ReactSelectOverrides.Group,
          GroupHeading: ReactSelectOverrides.GroupHeading,
        }}
        noOptionsMessage={() => props.t('No options')}
        errorLoadingMessage={() => props.t('Error loading options')}
        loadingMessage={() => props.t('Loading...')}
        isMulti={props.isMulti}
        includeIconConfig={props.includeIconConfig}
        multiSelectSubMenu={props.multiSelectSubMenu}
        closeMenuOnSelect={!props.isMulti}
        controlShouldRenderValue={!props.isMulti}
        hideSelectedOptions={false}
        isClearable={!props.isMulti && props.isClearable}
        backspaceRemovesValue={false}
        isDisabled={props.isDisabled}
        menuPortalTarget={props.appendToBody ? document.body : null}
        styles={
          props.appendToBody
            ? {
                menuPortal: (base) => ({
                  ...base,
                  zIndex: zIndices.selectMenu,
                }),
                ...customStyles,
              }
            : { ...customStyles }
        }
        isLoading={props.isLoading}
        showAutoWidthDropdown={props.showAutoWidthDropdown}
        allowSelectAll={props.allowSelectAll && !hideOnSearch}
        selectAllTxt={props.t('Select All')}
        allowClearAll={props.allowClearAll && !hideOnSearch}
        clearAllTxt={props.t('Clear')}
        searchText={props.t('Search')}
        backText={props.t('Back')}
        showSubmenuActions={props.showSubmenuActions}
        isSearchable={allowSearch}
        /*
         * react-select has a bug where the dropdown remains fixed in place
         * and doesn't scroll with the parent container when appended to the body.
         * This happens only when the dropdown is in a fixed element as a modal or a side panel.
         * https://github.com/JedWatson/react-select/issues/4088
         *
         * As a workaround, we can close the dropdown when the user scrolls with closeMenuOnScroll.
         */
        closeMenuOnScroll={(e) => {
          return (
            props.closeMenuOnScroll &&
            !e.target?.className?.includes('kitmanReactSelect') &&
            !e.target?.className?.includes('dropdownSubmenu') &&
            typeof e.target?.dataset?.virtuosoScroller === 'undefined'
          );
        }}
        minMenuHeight={props.minMenuHeight}
        isGrouped={isGrouped}
        filterOption={allowSearch ? props.filterOption : null}
        renderControl={props.renderControl}
        returnParentInValueFromSubMenu={props.returnParentInValueFromSubMenu}
        hideCounter={props.hideCounter}
        tabIndex={props.tabIndex}
        showOptionTooltip={props.showOptionTooltip}
      />
      <SelectComponents.OptionalOrRequiredFlag
        optional={props.optional}
        required={props.required}
      />
      {props.displayValidationText && props.invalid && (
        <ValidationText customValidationText={props.customValidationText} />
      )}
    </>
  );
};

const Select = (props: I18nProps<Props>) => (
  <SelectComponents.Root>
    <SelectComponent {...props} />
  </SelectComponents.Root>
);

SelectComponent.defaultProps = {
  menuPlacement: 'auto',
  isClearable: false,
  groupBy: 'nested',
  asyncSubmenu: false,
  returnObject: false,
};

export const SelectTranslated = withNamespaces()(Select);
export default Select;
