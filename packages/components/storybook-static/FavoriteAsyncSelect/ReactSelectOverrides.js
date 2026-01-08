// @flow
import { memo, useMemo } from 'react';
import classNames from 'classnames';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { components } from 'react-select';
import { GroupedVirtuoso } from 'react-virtuoso';
import calculateLongestLabel from '@kitman/common/src/utils/calculateLongestLabel';
import FavoriteSelectComponents from './Components';
import { indicatorSeparatorStyle } from './styles';

const ITEM_HEIGHT = 36;
const INPUT_HEIGHT = 42;

const MenuList = (props: Object) => {
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

  // this will return an empty array (NOT the loaded options)
  // then Array.isArray is called on the wrong type of object
  const allChildren = props.children.length
    ? props.children.flatMap((child) => {
        return Array.isArray(child?.props?.children)
          ? [
              child,
              ...child?.props?.children?.map((faveChild) => {
                return (
                  <FavoriteSelectComponents.FavoriteTemplate
                    isMulti={props.selectProps.isMulti}
                    selectPropsValue={props.selectProps.value}
                    key={faveChild.props.data.id}
                    handleToggle={(val) => props.selectProps.handleToggle(val)}
                    id={faveChild.props.data.id}
                    arrayOfFavorites={props.selectProps.arrayOfFavorites}
                    isFavorite={
                      !!props.selectProps.arrayOfFavorites.find(
                        ({ id }) => id === faveChild.props.data.id
                      )
                    }
                    extra={child.props.data.type === 'extra'}
                    onChange={(val) => props.selectProps.onChange(val)}
                    data={faveChild.props.data}
                    onBlur={() => {
                      props.selectProps.onBlur();
                    }}
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
          <FavoriteSelectComponents.FavoriteTemplate
            key={faveChild.props.data.id}
            selectPropsValue={props.selectProps.value}
            isMulti={props.selectProps.isMulti}
            handleToggle={(val) => props.selectProps.handleToggle(val)}
            id={faveChild.props.data.id}
            arrayOfFavorites={props.selectProps.arrayOfFavorites}
            isFavorite={
              !!props.selectProps.arrayOfFavorites.find(
                ({ id }) => id === faveChild.props.data.id
              )
            }
            onChange={(val) => props.selectProps.onChange(val)}
            data={faveChild.props.data}
            extra={child.props.data.type === 'extra'}
            onBlur={() => {
              props.selectProps.onBlur();
            }}
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
      <components.MenuList
        {...props}
        className={classNames({
          'kitmanReactSelect__menu-list--with-search':
            !props.selectProps.useReactSelectInput &&
            props.selectProps.isSearchable,
        })}
      >
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

const IndicatorSeparator = ({ innerProps }: { innerProps: Object }) => {
  return <span style={indicatorSeparatorStyle} {...innerProps} />;
};
export default {
  MenuList,
  IndicatorSeparator,
};
