// @flow
import { useMemo } from 'react';
import classNames from 'classnames';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import ReactSelect from 'react-select';
import _isEqual from 'lodash/isEqual';
import { withNamespaces } from 'react-i18next';

import useFavorites from '@kitman/common/src/hooks/useFavorites';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import zIndices from '@kitman/common/src/variables/zIndices';
import { useSelectContext } from './hooks';
import SelectComponents from './Components';
import ReactSelectOverrides from './ReactSelectOverrides';

export type Option = {
  label: string,
  value?: any,
  type?: ?string,
  requiresText?: boolean,
  options?: Array<{
    label: string,
    value: any,
    isDisabled?: boolean,
    requiresText?: boolean,
  }>,
  isDisabled?: boolean,
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

type FavoriteOption = {
  isFavorite: boolean,
  id: number,
  value: number,
  name: string,
  label: string,
};

type Props = {
  value: any,
  label?: string,
  isMulti?: boolean,
  isClearable?: boolean,
  isLoading?: boolean,
  invalid?: boolean,
  placeholder?: string,
  onChange: Function,
  onClear: Function,
  onBlur?: Function,
  isDisabled?: boolean,
  appendToBody?: boolean,
  allowSelectAll?: boolean,
  allowClearAll?: boolean,
  showAutoWidthDropdown?: boolean,
  minMenuHeight?: number,
  menuPlacement?: 'auto' | 'bottom' | 'top',
  menuPosition?: 'fixed' | 'absolute',
  optional?: boolean,
  closeMenuOnScroll?: boolean,
  filterOption?: FilterOption,
  returnObject?: boolean,
  useFavorites?: {
    favoriteGroup?:
      | 'rehab_exercises'
      | 'diagnostic_types'
      | 'procedure_types'
      | 'fdb_dispensable_drugs'
      | 'session_types',
    args: Object,
    withArgs: boolean,
    labelForOptions: string,
    optionalGroupPayload?: {
      groupTitle: string,
      groupPayload: Array<Option>,
    },
  },
  arrayOfFavoriteOptions?: Array<FavoriteOption>,
  arrayOfRemainderOptions?: Array<FavoriteOption>,
  arrayOfCategorisedRemainderOptions?: Array<{
    options: Array<FavoriteOption>,
  }>,
  fullSelectOptions?: Array<FavoriteOption>,
  customHandleToggle?: Function,
};

const FavoriteSelectComponent = (props: I18nProps<Props>) => {
  const { favorites, remainders, toggleFavorite } = useFavorites(
    props.useFavorites?.favoriteGroup ? props.useFavorites.favoriteGroup : null,
    false,
    props.useFavorites?.args,
    props.useFavorites?.withArgs
  );

  const { searchValue, setSearchValue } = useSelectContext();

  const arrayOfFavorites = favorites
    .get(
      props.useFavorites?.favoriteGroup
        ? props.useFavorites.favoriteGroup
        : null
    )
    ?.map((favorite) =>
      // $FlowFixMe
      ({
        isFavorite: true,
        label: favorite.select_name || favorite.name,
        value: favorite.id,
        ...favorite,
      })
    );

  const arrayOfRemainders = remainders
    .get(
      props.useFavorites?.favoriteGroup
        ? props.useFavorites.favoriteGroup
        : null
    )
    ?.map((remainder) =>
      // $FlowFixMe
      ({
        label: remainder.select_name || remainder.name,
        value: remainder.id,
        ...remainder,
      })
    );

  const fullOptions = useMemo(() => {
    const options = [];

    if (arrayOfFavorites && arrayOfFavorites?.length > 0) {
      options?.push(...arrayOfFavorites);
    }
    if (arrayOfRemainders && arrayOfRemainders?.length > 0) {
      options?.push(...arrayOfRemainders);
    }

    if (
      props.useFavorites?.optionalGroupPayload &&
      props.useFavorites.optionalGroupPayload?.groupPayload &&
      props.useFavorites.optionalGroupPayload.groupPayload.length > 0
    ) {
      options?.push(...props.useFavorites.optionalGroupPayload.groupPayload);
    }

    return props.useFavorites && !options ? [] : options;
  }, [arrayOfFavorites, arrayOfRemainders]);

  const allowSearch = props.fullSelectOptions
    ? props.fullSelectOptions.length > 10
    : fullOptions.length > 10;

  const selectedOption = useMemo(() => {
    if (
      Array.isArray(props.arrayOfCategorisedRemainderOptions) &&
      props.arrayOfCategorisedRemainderOptions?.length > 0
    ) {
      return props.arrayOfCategorisedRemainderOptions
        .flatMap(({ options }) => options)
        .find((option) => option.value === props.value);
    }
    if (props.isMulti) {
      return fullOptions.filter((option) =>
        props.value?.includes(option?.value)
      );
    }
    return props.fullSelectOptions
      ? props.fullSelectOptions.find((option) =>
          _isEqual(option?.value, props.value)
        ) || null
      : fullOptions.find((option) => _isEqual(option?.value, props.value)) ||
          null;
  }, [props.value, fullOptions, props.isMulti]);

  const customStyles = {
    option: (styles, { data }) => {
      const dataStyles = data.styles || {};

      return {
        ...styles,
        ...dataStyles,
      };
    },
  };

  const getPlaceholder = () => {
    if (!props.placeholder) {
      return null;
    }

    if (props.isMulti && props.value && props.value.length > 0) {
      return null;
    }
    return props.placeholder;
  };
  const checkIsFavourite = (id: number) => {
    const groupFavourites = favorites.get(
      props.useFavorites?.favoriteGroup
        ? props.useFavorites.favoriteGroup
        : null
    );

    if (groupFavourites) {
      return groupFavourites.find((element) => element.id === id);
    }

    if (arrayOfFavorites && arrayOfFavorites?.length > 0) {
      return arrayOfFavorites.find((element) => element.value === id);
    }
    return false;
  };
  const handleToggle = (id) => {
    const isFavourite = checkIsFavourite(id);

    toggleFavorite(
      !!isFavourite,
      id,
      props.useFavorites?.favoriteGroup
        ? props.useFavorites.favoriteGroup
        : null,
      props.useFavorites?.args
    );
  };
  return (
    <>
      <SelectComponents.Label
        label={props.label}
        isDisabled={props.isDisabled}
      />
      <ReactSelect
        value={selectedOption}
        options={
          [
            {
              label: props.t('Favorites '),
              options: props.arrayOfFavoriteOptions
                ? props.arrayOfFavoriteOptions || []
                : arrayOfFavorites || [],
              type: 'favorites',
            },
            {
              label: props.t('{{labelForOptionalGroupPayload}}', {
                labelForOptionalGroupPayload:
                  props.useFavorites?.optionalGroupPayload?.groupTitle ||
                  'Optional group',
              }),
              options:
                props.useFavorites?.optionalGroupPayload?.groupPayload || [],
              type: 'extra',
            },
            {
              label: props.t('{{labelForOptions}}', {
                labelForOptions:
                  props.useFavorites?.labelForOptions || 'Options',
              }),
              options: props.arrayOfRemainderOptions
                ? props.arrayOfRemainderOptions || []
                : arrayOfRemainders || [],
              type: 'remainders',
            },
            ...(props.arrayOfCategorisedRemainderOptions || []),
          ] || []
        }
        checkIsFavourite={checkIsFavourite}
        handleToggle={
          props.customHandleToggle ? props.customHandleToggle : handleToggle
        }
        useFavorites={
          props.useFavorites ? props.useFavorites.favoriteGroup : null
        }
        inputValue={searchValue}
        captureMenuScroll={false}
        onChange={(selection) => {
          if (props.isMulti) {
            props.onChange(selection.map(({ value }) => value));
          } else {
            if (!selection) {
              props.onClear();
              return;
            }
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
        className={classNames('kitmanReactSelect', {
          'kitmanReactSelect--invalid': props.invalid,
        })}
        onMenuClose={() => setSearchValue('')}
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
          MenuList: ReactSelectOverrides.MenuList,
          ValueContainer: ReactSelectOverrides.ValueContainer,
          Group: ReactSelectOverrides.Group,
          GroupHeading: ReactSelectOverrides.GroupHeading,
        }}
        noOptionsMessage={() => props.t('No options')}
        errorLoadingMessage={() => props.t('Error loading options')}
        loadingMessage={() => props.t('Loading...')}
        isMulti={props.isMulti}
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
        allowSelectAll={props.allowSelectAll}
        selectAllTxt={props.t('Select All')}
        allowClearAll={props.allowClearAll}
        clearAllTxt={props.t('Clear')}
        searchText={props.t('Search')}
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
            typeof e.target?.dataset?.virtuosoScroller === 'undefined'
          );
        }}
        minMenuHeight={props.minMenuHeight}
        filterOption={allowSearch ? props.filterOption : null}
      />
      <SelectComponents.OptionalFlag
        optional={props.optional}
        optionalText={props.t('Optional')}
      />
    </>
  );
};

const FavoriteSelect = (props: I18nProps<Props>) => (
  <SelectComponents.Root>
    <FavoriteSelectComponent {...props} />
  </SelectComponents.Root>
);

FavoriteSelectComponent.defaultProps = {
  menuPlacement: 'auto',
  isClearable: false,
  returnObject: false,
  useFavorites: null,
};

export const FavoriteSelectTranslated = withNamespaces()(FavoriteSelect);
export default FavoriteSelect;
