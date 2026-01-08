// @flow
import { memo, useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { components } from 'react-select';
import { GroupedVirtuoso } from 'react-virtuoso';
import { TextButton, EllipsisTooltipText, Checkbox } from '@kitman/components';
import calculateLongestLabel from '@kitman/common/src/utils/calculateLongestLabel';
// import useFavourites from '@kitman/modules/src/Medical/shared/hooks/useFavourites';
import SelectComponents from './Components';
import { useSelectContext } from './hooks';

// TODO: remove all unnecessary overrides and import from normal select

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
      {props.selectProps.inputValue.length > 0 && !props.isMulti && (
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

const ITEM_HEIGHT = 36;
const INPUT_HEIGHT = 42;

const MenuList = (props: Object) => {
  const withActions =
    props.selectProps.allowSelectAll || props.selectProps.allowClearAll;

  const longestLabel = useMemo(() => {
    let longestLabelValue = '';

    props.selectProps.options.forEach((opt) => {
      longestLabelValue = calculateLongestLabel(longestLabelValue, opt.label);
      if (Array.isArray(opt.options)) {
        opt.options.forEach(({ label }) => {
          longestLabelValue = calculateLongestLabel(longestLabelValue, label);
        });
      }
    });
    return longestLabelValue;
  }, [props.selectProps.options]);

  const allChildren = props.children.length
    ? props.children.flatMap((child) => {
        return Array.isArray(child?.props?.children)
          ? [
              child,
              ...child?.props?.children?.map((faveChild) => {
                return (
                  <SelectComponents.FavoriteTemplate
                    key={faveChild.props.data.id}
                    handleToggle={props.selectProps.handleToggle}
                    isFavorite={props.selectProps.checkIsFavourite(
                      faveChild.props.data.id
                    )}
                    extra={child.props.data.type === 'extra'}
                    onChange={props.selectProps.onChange}
                    data={faveChild.props.data}
                    favoriteGroup={props.selectProps?.useFavorites}
                  />
                );
              }),
            ]
          : [];
      })
    : [];

  const windowHeight = props.selectProps.maxMenuHeight - INPUT_HEIGHT;
  const isScrollable = allChildren.length * ITEM_HEIGHT > windowHeight;

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

    const groups = props.children;
    const groupCounts = props.children.map((child) =>
      Array.isArray(child.props.children) ? child.props.children.length : 0
    );

    /**
     *
     * For performance gains we are implementing memo logic
     * as per Virtuoso Docs for "complex itemContent components"
     * https://virtuoso.dev/#performance
     *
     */
    const options = props.children.flatMap((child) => [
      ...child.props.children.map((faveChild) => {
        return (
          <SelectComponents.FavoriteTemplate
            handleToggle={props.selectProps.handleToggle}
            isFavorite={props.selectProps.checkIsFavourite(
              faveChild.props.data.id
            )}
            onChange={props.selectProps.onChange}
            data={faveChild.props.data}
            extra={child.props.data.type === 'extra'}
            favoriteGroup={props.selectProps?.useFavorites}
          />
        );
      }),
    ]);

    // Item contents are cached properly with React.memo
    const InnerItem = memo(({ index }) => {
      return options[index];
    });

    // The callback is executed often - don't inline complex components in here.
    const itemContent = (index) => {
      return <InnerItem index={index} />;
    };

    return (
      <GroupedVirtuoso
        {...commonProps}
        groupCounts={groupCounts}
        groupContent={(index) => groups[index]}
        itemContent={(index) => itemContent(index)}
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

const ValueContainer = (props: Object) => {
  const [isCounterShown, setIsCounterShown] = useState(false);
  const innerProps = {
    ...props.innerProps,
  };

  return props.isMulti ? (
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
        {props.selectProps.value?.length > 1 && isCounterShown && (
          <span
            css={css`
              margin-right: 4px;
            `}
          >{`${props.selectProps.value?.length} - `}</span>
        )}
        <EllipsisTooltipText
          data-testid="Select|MultiLabel"
          content={props.selectProps.value
            ?.map((value) => value.label)
            .join(', ')}
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

  return props.isMulti ? (
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
        {props.selectProps.isMulti && (
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
  ValueContainer,
  DropdownIndicator,
  DropdownOption,
  Group,
  GroupHeading,
};
