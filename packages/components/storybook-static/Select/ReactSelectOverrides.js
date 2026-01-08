// @flow
import { Tooltip } from '@kitman/playbook/components';
import { useState, useEffect, useMemo, useRef } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { components } from 'react-select';
import { GroupedVirtuoso, Virtuoso } from 'react-virtuoso';
import {
  TextButton,
  EllipsisTooltipText,
  Checkbox,
  IconButton,
} from '@kitman/components';
import { zIndices } from '@kitman/common/src/variables';
import calculateLongestLabel from '@kitman/common/src/utils/calculateLongestLabel';
import List from '@kitman/components/src/Athletes/components/List';
import SelectComponents from './Components';
import { useSelectContext } from './hooks';
import { searchList, searchLabel } from './utils';
import type { Option, Options, Props as SelectProps } from './index';

/**
 * Our custom Input component to replace react-selects implementation
 * https://react-select.com/props#replacing-components
 *
 *
 * react-select is built heavily around the Input. There is a few bits
 * of key functionality required so removing it entirely is very messy
 */
const Input = (props: Object) => {
  const { setSearchInputProps } = useSelectContext();

  /**
   * We need a way to share the props between this Input
   * and the search input that we've created. Mainly so
   * our input has access to the onBlur that react-select
   * has created as that handles the case when the browser
   * no longer focus' on the dropdown. But we might need
   * more down the future
   */
  useEffect(() => {
    setSearchInputProps(props);
  }, []);

  return (
    <>
      {/**
       * The react-select input's onBlur event handles the dropdown
       * as mentioned above, so we'll overite it here and use it in our
       * own search input.
       *
       * This component gets rendered into the dropdown, but the actual
       * input gets set to `width: 0` so its not rendered
       */}
      <components.Input
        {...props}
        onBlur={null}
        css={
          !props.selectProps.useReactSelectInput &&
          props.selectProps.isSearchable
            ? css`
                // Hiding the default search input without loosing bound events
                width: 0;
                height: 0;
                overflow: hidden;
              `
            : null
        }
        data-testid="selectInput"
      />
      {/**
       * Mimicing the value renderer here so the input doesn't go blank
       * when a user is searching
       */}
      {props.selectProps.inputValue.length > 0 &&
        !props.isMulti &&
        !props.selectProps.multiSelectSubMenu && (
          <components.SingleValue
            {...props}
            data={props.selectProps.value}
            isHidden
          >
            {props.selectProps.value && props.selectProps.value.label}
          </components.SingleValue>
        )}
    </>
  );
};

/**
 * Our own Custom Search input
 */
const CustomSearchInput = (props) => {
  const { searchValue, setSearchValue, searchInputProps } = useSelectContext();

  return (
    <SelectComponents.SearchInput
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder={props.selectProps.searchText}
      onBlur={searchInputProps.onBlur}
    />
  );
};

const PaginatedMenuList = ({
  selectProps,
}: {
  selectProps: SelectProps & {
    backText: string,
    searchText: string,
    onMenuClose: Function,
  },
}) => {
  const [selectedParentOption, setSelectedParentOption] =
    useState<Option | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<
    Array<Option> | Array<Options> | null
  >(selectProps.options);
  const { searchValue } = useSelectContext();

  useEffect(() => {
    if (selectProps.isSearchable) {
      if (selectedParentOption) {
        setFilteredOptions(
          searchList(selectedParentOption.options, searchValue)
        );
      } else {
        setFilteredOptions(
          selectProps.options.filter((item) => {
            return (
              searchLabel(item.label, searchValue) ||
              // if the search value is found in the child options, keep this parent option visible
              searchList(item.options, searchValue)?.length > 0
            );
          })
        );
      }
    } else if (selectedParentOption && selectedParentOption.options) {
      setFilteredOptions(selectedParentOption.options);
    } else {
      setFilteredOptions(selectProps.options);
    }
  }, [searchValue, selectedParentOption]);

  return (
    <>
      <List className="kitmanReactSelect__list">
        {selectProps.isSearchable && (
          <CustomSearchInput selectProps={selectProps} />
        )}

        <div className="kitmanReactSelect__backButtonContainer">
          {selectedParentOption && (
            <SelectComponents.BackButton
              setSelectedParentOption={setSelectedParentOption}
              label={selectProps.backText}
            />
          )}
        </div>

        <div className="kitmanReactSelect__listContainer">
          <div className="kitmanReactSelect__listInner">
            <SelectComponents.PaginatedList
              selectProps={selectProps}
              setSelectedParentOption={setSelectedParentOption}
              filteredOptions={filteredOptions}
            />
          </div>
        </div>
      </List>
    </>
  );
};

const ITEM_HEIGHT = 36;
const INPUT_HEIGHT = 42;
const MenuList = (props: Object) => {
  const withActions =
    props.selectProps.allowSelectAll || props.selectProps.allowClearAll;

  const isGrouped = props.selectProps.isGrouped;
  const longestLabel = useMemo(() => {
    let longestLabelValue = '';

    props.selectProps.options.forEach((opt) => {
      longestLabelValue = calculateLongestLabel(longestLabelValue, opt.label);
      if (isGrouped && Array.isArray(opt.options)) {
        opt.options.forEach(({ label }) => {
          longestLabelValue = calculateLongestLabel(longestLabelValue, label);
        });
      }
    });
    return longestLabelValue;
  }, [props.selectProps.options, isGrouped]);

  const [openSubmenu, setOpenSubmenu] = useState(-1);

  const allChildren = props.children.length
    ? props.children.flatMap((child, index) => {
        const children =
          child.props.children && props.selectProps.groupBy !== 'submenu'
            ? child.props.children
            : [];

        if (
          child.props.children?.length &&
          (child.props.data.options || child.props.data.loadAsyncOptions) &&
          props.selectProps.groupBy === 'submenu'
        ) {
          return (
            <SelectComponents.Submenu
              data={child.props.data}
              index={index}
              onChange={props.selectProps.onChange}
              onOpen={() => {
                if (openSubmenu === index) {
                  setOpenSubmenu(-1);
                } else {
                  setOpenSubmenu(index);
                }
              }}
              currentValue={props.selectProps.value}
              onHover={() => setOpenSubmenu(index)}
              onHoverExit={() => setOpenSubmenu(-1)}
              isOpen={openSubmenu === index}
              setAsyncSubmenuOptions={props.selectProps.setAsyncSubmenuOptions}
              asyncSubmenuOptions={props.selectProps.asyncSubmenuOptions}
              asyncSubmenu={props.selectProps.asyncSubmenu}
              noOptionsMessage={props.selectProps.noOptionsMessage}
              isMulti={props.selectProps.isMulti}
              multiSelectSubMenu={props.selectProps.multiSelectSubMenu}
              showSubmenuActions={props.selectProps.showSubmenuActions}
              selectAllTxt={props.selectProps.selectAllTxt}
              clearAllTxt={props.selectProps.clearAllTxt}
              errorLoadingMessage={props.selectProps.errorLoadingMessage}
              loadingMessage={props.selectProps.loadingMessage}
            />
          );
        }
        return Array.isArray(children) ? [child, ...children] : [child];
      })
    : [];

  const windowHeight = props.selectProps.maxMenuHeight - INPUT_HEIGHT;
  const isScrollable = allChildren.length * ITEM_HEIGHT > windowHeight;
  const virtuosoRef = useRef(null);
  const { searchValue } = useSelectContext();
  const [focusIndex, setFocusIndex] = useState(
    allChildren.findIndex((child) => child.props.isFocused === true)
  );

  const keyDownCallback = (e: KeyboardEvent) => {
    if (['Up', 'ArrowUp'].includes(e.code)) {
      setFocusIndex((prevState) => {
        if (prevState < 0 || prevState === 0) {
          return allChildren.length - 1;
        }
        return prevState - 1;
      });
    }

    if (['Down', 'ArrowDown'].includes(e.code)) {
      setFocusIndex((prevState) => {
        if (focusIndex === allChildren.length - 1) {
          return 0;
        }
        return prevState + 1;
      });
    }
  };

  // update the focus index based off searched results
  useEffect(() => {
    const searchFocusIndex = allChildren.findIndex(
      (child) => child.props.isFocused === true
    );
    setFocusIndex(searchFocusIndex);
  }, [searchValue]);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current?.scrollIntoView({
        index: focusIndex,
        behavior: 'auto',
      });
    }

    document.addEventListener('keydown', keyDownCallback, false);

    return function cleanup() {
      document.removeEventListener('keydown', keyDownCallback, false);
    };
  }, [focusIndex]);

  const renderVirtualList = () => {
    const commonProps = {
      style: {
        height: props.selectProps.maxMenuHeight - INPUT_HEIGHT,
        width: '100%',
      },
      overscan: {
        main: 12,
        reverse: 12,
      },
    };

    if (isGrouped) {
      const groups = props.children;
      const groupCounts = props.children.map((child) =>
        Array.isArray(child.props.children) ? child.props.children.length : 0
      );
      const options = props.children.flatMap((child) => {
        return Array.isArray(child.props.children)
          ? [...child.props.children]
          : [];
      });
      return (
        <GroupedVirtuoso
          {...commonProps}
          groupCounts={groupCounts}
          groupContent={(index) => groups[index]}
          itemContent={(index) => options[index]}
        />
      );
    }

    const itemContent = (index, child) => {
      if (
        props.selectProps.groupBy === 'submenu' &&
        (child.props.data.options || child.props.data.loadAsyncOptions)
      ) {
        return (
          <SelectComponents.Submenu
            data={child.props.data}
            onChange={props.selectProps.onChange}
            index={index}
            onOpen={() => {
              if (openSubmenu === index) {
                setOpenSubmenu(-1);
              } else {
                setOpenSubmenu(index);
              }
            }}
            onHover={() => setOpenSubmenu(index)}
            onHoverExit={() => setOpenSubmenu(-1)}
            isOpen={openSubmenu === index}
            currentValue={props.selectProps.value}
            setAsyncSubmenuOptions={props.selectProps.setAsyncSubmenuOptions}
            asyncSubmenuOptions={props.selectProps.asyncSubmenuOptions}
            asyncSubmenu={props.selectProps.asyncSubmenu}
            noOptionsMessage={props.selectProps.noOptionsMessage}
            isMulti={props.selectProps.isMulti}
            multiSelectSubMenu={props.selectProps.multiSelectSubMenu}
            errorLoadingMessage={props.selectProps.errorLoadingMessage}
            loadingMessage={props.selectProps.loadingMessage}
          />
        );
      }

      return child;
    };
    return (
      <Virtuoso
        ref={virtuosoRef}
        data={allChildren}
        itemContent={itemContent}
        {...commonProps}
        totalCount={allChildren.length}
      />
    );
  };

  return (
    <>
      {!props.selectProps.useReactSelectInput &&
        props.selectProps.isSearchable && <CustomSearchInput {...props} />}
      <components.MenuList
        {...props}
        className={classNames({
          'kitmanReactSelect__menu-list--with-search':
            !props.selectProps.useReactSelectInput &&
            props.selectProps.isSearchable,
        })}
      >
        {props.isMulti && withActions && (
          <div className="kitmanReactSelect__menuListActions">
            {props.selectProps.actionsLabel && (
              <span className="kitmanReactSelect__menuListActionsLabel">
                {props.selectProps.actionsLabel}
              </span>
            )}
            {props.selectProps.allowSelectAll && (
              <TextButton
                text={props.selectProps.selectAllTxt}
                onClick={() => {
                  props.selectProps.onChange(props.selectProps.options);
                  props.selectProps.onMenuClose();
                }}
                type="subtle"
                size="small"
                kitmanDesignSystem
              />
            )}
            {props.selectProps.allowClearAll && (
              <TextButton
                text={props.selectProps.clearAllTxt}
                onClick={() => {
                  props.selectProps.onChange([]);
                  props.selectProps.onMenuClose();
                }}
                type="subtle"
                size="small"
                kitmanDesignSystem
              />
            )}
          </div>
        )}

        {/* Rendering the default children if there are no options */}
        {allChildren.length === 0 && props.children}
        {/* scroll while focus */}
        {isScrollable ? (
          <>
            {renderVirtualList()}
            {/*
              Virtuoso works by absolutely positioning each item in a relative
              container. Meaning the width of each item will not make the select
              menu width wider. This div is to ensure the width of the list is always
              wide enough to render the longest label, maintaining the existing behaviour.
               - height is 0 so it is not visible
               - padding is set to 16 to match the existing menu items
               - overflow: auto so that the browser will take the width of the scrollbar
                 into account. It will not render a scrollbar because the height is 0
            */}
            <div
              style={{
                height: 0,
                overflow: 'auto',
                padding: '0 16px',
                whiteSpace: 'nowrap',
              }}
            >
              {longestLabel}
            </div>
          </>
        ) : (
          allChildren
        )}
      </components.MenuList>
    </>
  );
};

const Menu = (props: Object) => {
  /**
   * Replicating the react-select onMouseDown function.
   * This mouseDown function is the exact same as react selects
   * except we do not call the inputRef.focus(), as the input is
   * replaced in our implementation
   */
  const onMouseDown = (e) => {
    if (e.button !== 0) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <components.Menu
      {...props}
      className={classNames({
        'kitmanReactSelect__menu--autoWidthDropdown':
          props.selectProps.showAutoWidthDropdown,
      })}
      innerProps={{ ...props.innerProps, onMouseDown }}
    />
  );
};

const SingleValue = (props: Object) => {
  const isSubmenuOption = props.selectProps.groupBy === 'submenu';
  let parentChildSubmenuLabel;

  // displaying value is handled in Value Container for multiSelectSubMenus
  if (props.selectProps.multiSelectSubMenu) {
    return null;
  }

  if (isSubmenuOption) {
    const foundParentOption = props.selectProps.options.find((option) => {
      if (option === props.selectProps.value) return option;
      return option.options?.find(
        (subOption) => props.selectProps.value === subOption
      );
    });
    if (foundParentOption?.options)
      parentChildSubmenuLabel = foundParentOption.label;
  }
  return parentChildSubmenuLabel ? (
    <components.SingleValue {...props}>
      {parentChildSubmenuLabel} : {props.children}
    </components.SingleValue>
  ) : (
    <components.SingleValue {...props} />
  );
};

const Control = (props: Object) => {
  const searchContext = useSelectContext();
  const controlProps = {
    ...props,
    innerProps: {
      onBlur: !props.menuIsOpen ? searchContext.searchInputProps.onBlur : null,
      ...props.innerProps,
    },
  };
  // display the passed in element instead of traditional react select
  return props.selectProps.renderControl ? (
    <components.Control {...controlProps}>
      {props.selectProps.renderControl()}
      {/* Display the traditional select box hidden in order the keep the functionality */}
      <div
        css={css`
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
        `}
      >
        {props.children}
      </div>
    </components.Control>
  ) : (
    <components.Control {...controlProps} />
  );
};

const ValueContainer = (props: Object) => {
  const [isCounterShown, setIsCounterShown] = useState(false);
  const innerProps = {
    ...props.innerProps,
  };
  const displaySelectedValue = () => {
    if (
      props.selectProps.valueContainerContent &&
      props.selectProps.value?.length > 0
    ) {
      return props.selectProps.valueContainerContent;
    }
    if (!props.selectProps.value?.length || !props.selectProps.value[0]) {
      return '';
    }
    const labelContent = props.selectProps.value
      ?.map((value) => value.label)
      .join(', ');
    const parentId = props.selectProps.value[0]?.parentId;

    if (props.selectProps.returnParentInValueFromSubMenu && parentId) {
      const parentValue = props.selectProps.options.find(
        (option) => option.id === parentId
      )?.label;

      return labelContent ? `${parentValue} - ${labelContent}` : parentValue;
    }

    return labelContent;
  };

  return props.selectProps.multiSelectSubMenu || props.isMulti ? (
    <components.ValueContainer
      {...props}
      className="kitmanReactSelect__value-container"
      innerProps={innerProps}
    >
      {props.children}
      <div
        css={css`
          width: calc(100% - 4px);
          display: flex;
        `}
      >
        {props.selectProps.value?.length > 1 &&
          isCounterShown &&
          !props.selectProps.hideCounter && (
            <span
              css={css`
                margin-right: 4px;
              `}
            >{`${props.selectProps.value?.length} - `}</span>
          )}
        <EllipsisTooltipText
          data-testid="Select|MultiLabel"
          content={displaySelectedValue()}
          onEllipsisChange={(isEllipsisDisplayed: boolean) =>
            setIsCounterShown(isEllipsisDisplayed)
          }
          displayEllipsisWidth={100}
          displayEllipsisWidthUnit="%"
          styles={{
            wrapper: css`
              display: initial;
              flex: 1;
              min-width: 0;
              overflow: hidden;
            `,
            content: css`
              display: block;
            `,
          }}
        />
      </div>
    </components.ValueContainer>
  ) : (
    <components.ValueContainer {...props} innerProps={innerProps} />
  );
};

const DropdownIndicator = (props: Object) => {
  return (
    <components.DropdownIndicator {...props}>
      <i className="icon-chevron-down" />
    </components.DropdownIndicator>
  );
};

const DropdownOption = (props: Object) => {
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = {
    ...props,
    innerProps: rest,
  };

  const renderOption = ({ option, tooltip, showTooltip = false }) => {
    if (showTooltip) {
      return (
        <Tooltip
          title={tooltip}
          placement="left"
          slotProps={{ popper: { sx: { zIndex: zIndices.tooltip } } }}
        >
          <div>{option}</div>
        </Tooltip>
      );
    }
    return option;
  };

  if (props.selectProps.includeIconConfig) {
    const option = (
      <components.Option {...newProps}>
        <div className="kitmanReactSelect__optionWithIcon">
          <div title={newProps.label} data-testid="IconConfigLabel">
            {newProps.label}
          </div>
          <div title={newProps.description} data-testid="Description">
            {newProps.description}
          </div>
          <div
            className="kitmanReactSelect__iconOption"
            data-testid="IconConfigButton"
          >
            <IconButton
              icon={props.selectProps.includeIconConfig.iconName}
              isSmall
              isBorderless
              isTransparent
              onClick={(event) => {
                event.stopPropagation();
                props.selectProps.includeIconConfig.onClick(newProps.value);
              }}
            />
          </div>
        </div>
      </components.Option>
    );
    return renderOption({
      option,
      tooltip: newProps.data.description,
      showTooltip: newProps.selectProps.showOptionTooltip,
    });
  }

  const option = props.isMulti ? (
    <components.Option {...newProps}>
      <Checkbox
        id=""
        toggle={() => {}}
        isChecked={newProps.isSelected}
        kitmanDesignSystem
      />
      <div className="kitmanReactSelect__optionLabel" title={newProps.label}>
        {newProps.label}
      </div>
    </components.Option>
  ) : (
    <components.Option {...newProps} />
  );

  return renderOption({
    option,
    tooltip: newProps.data.description,
    showTooltip: newProps.selectProps.showOptionTooltip,
  });
};

const Group = (props: Object) => {
  const { cx, getStyles, Heading, headingProps, label, theme, selectProps } =
    props;

  return (
    <Heading
      {...headingProps}
      selectProps={selectProps}
      theme={theme}
      getStyles={getStyles}
      cx={cx}
    >
      {label}
    </Heading>
  );
};

const GroupHeading = (props: Object) => {
  return (
    <components.GroupHeading {...props}>
      <div className="kitmanReactSelect__groupHeading">
        <div className="kitmanReactSelect__groupHeadingLabel">
          {props.data.label}
        </div>
        {[
          props.isMulti,
          window.getFlag(
            'pac-sessions-athlete-selection-position-group-in-filter'
          ) && props.selectProps.isMulti,
          props.selectProps.multiSelectSubMenu,
        ].some(Boolean) && (
          <div className="kitmanReactSelect__groupHeadingOptions">
            <div
              className="kitmanReactSelect__groupHeadingSelectAll"
              onClick={() => {
                // first remove items from options group from selected items so they don't get duplicated...
                const selectedItems = props.selectProps.value.filter((el) => {
                  return !props.data.options.includes(el);
                });
                // .. and then re-add them
                Array.prototype.push.apply(selectedItems, props.data.options);
                props.selectProps.onChange(
                  selectedItems.map((opt) => {
                    return opt;
                  })
                );
              }}
            >
              {props.selectProps.selectAllTxt}
            </div>
            <div
              className="kitmanReactSelect__groupHeadingClear"
              onClick={() => {
                // remove items from options group from selected items
                const selectedItems = props.selectProps.value.filter((el) => {
                  return !props.data.options.includes(el);
                });
                props.selectProps.onChange(selectedItems);
              }}
            >
              {props.selectProps.clearAllTxt}
            </div>
          </div>
        )}
      </div>
    </components.GroupHeading>
  );
};

export default {
  Input,
  Menu,
  MenuList,
  PaginatedMenuList,
  SingleValue,
  ValueContainer,
  Control,
  DropdownIndicator,
  DropdownOption,
  Group,
  GroupHeading,
};
