// @flow
import type { Node } from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import $ from 'jquery';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import _isArray from 'lodash/isArray';
import _uniqueId from 'lodash/uniqueId';
import { Link } from '@kitman/components';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';

export type TooltipItem = {
  description: Node,
  href?: string,
  isExternalLink?: boolean,
  icon?: string,
  isHighlighted?: boolean,
  isSelected?: boolean,
  isDisabled?: boolean,
  isDestructive?: boolean,
  onClick?: Function,
  subMenuItems?: Array<TooltipItem>,
  subMenuAlignment?: 'left' | 'right',
};

type TooltipItemWithKey = $Shape<TooltipItemWithKey>;

type Props = {
  offset?: Array<number>,
  placement?: string,
  onVisibleChange: Function,
  tooltipTriggerElement: Node,
  customClassnames?: Array<string>,
  menuItems: Array<TooltipItem>,
  externalItem?: Node,
  isScrollable?: boolean,
  externalItemOrder?: number | string,
  closeOnResize?: boolean,
  disabled?: ?boolean,
  kitmanDesignSystem?: boolean,
  appendToParent?: boolean,
  zIndex?: number,
};

const TooltipMenu = (props: Props) => {
  const [tooltipInstance, setTooltipInstance] = useState(null);
  const [position, setPosition] = useState({ right: 0, left: 0 });
  const defaultOffset = props.kitmanDesignSystem ? [0, 4] : [0, 0];
  const listRef = useRef(null);
  const { windowWidth, windowHeight } = useWindowSize();

  useEffect(() => {
    if (props.closeOnResize && tooltipInstance) {
      tooltipInstance.hide();
    }
  }, [windowWidth, windowHeight]);

  // auto-assigns keys to each of the menu items
  const menuItems: Array<TooltipItemWithKey> = useMemo(() => {
    function assignIds(
      itemsToAssign: ?Array<TooltipItem>
    ): Array<TooltipItemWithKey> | null {
      if (!_isArray(itemsToAssign) || !itemsToAssign) {
        return null;
      }

      return itemsToAssign.map((item) => ({
        ...item,
        subMenuItems: item.subMenuItems ? assignIds(item.subMenuItems) : null,
        key: _uniqueId('submenuItem'),
      }));
    }

    return props.menuItems.map((item) => ({
      ...item,
      key: _uniqueId('menuItem'),
      subMenuItems: assignIds(item.subMenuItems),
    }));
  }, [props.menuItems]);

  const getClassnames = () =>
    // $FlowFixMe classNames accepts array parameters
    classNames('tooltipMenu', props.customClassnames, {
      'tooltipMenu--kitmanDesignSystem': props.kitmanDesignSystem,
      'tooltipMenu--scrollable': props.isScrollable === true,
    });

  const addHoverEffectToArrow = (index: number | string) => {
    let toggledItemIndex = null;
    const placement = props.placement;
    const allItemsLength = props.externalItem
      ? menuItems.length + 1
      : menuItems.length;

    // need to check orientation of tooltip and check which item should trigger the class change
    switch (placement) {
      case 'bottom-end':
      case 'bottom-start':
      case 'bottom':
        // arrow is above the first item
        toggledItemIndex = 0;
        break;
      case 'top-end':
      case 'top-start':
      case 'top':
      case 'right-end':
        // arrow is below the last item
        toggledItemIndex = allItemsLength - 1;
        break;
      default:
        // right or left
        // arrow is beside the first item
        toggledItemIndex = 0;
        break;
    }

    if (index === toggledItemIndex && props.externalItemOrder !== 0) {
      $('.tippy-arrow').toggleClass('tippy-arrow--active');
    }
  };

  const hasSelectedSubItems = (item: TooltipItem) => {
    return (
      item.subMenuItems?.length &&
      item.subMenuItems.some(
        (subItem) => subItem.isSelected || hasSelectedSubItems(subItem)
      )
    );
  };

  const shouldBeHighlighted = (item: TooltipItem) => {
    if (item.isHighlighted !== undefined) {
      return item.isHighlighted;
    }

    return hasSelectedSubItems(item);
  };

  const getItemClassnames = (item: TooltipItem) =>
    classNames('tooltipMenu__item', {
      'tooltipMenu__item--active': item.isSelected === true,
      'tooltipMenu__item--icon': item.icon,
      'tooltipMenu__item--disabled': item.isDisabled,
      'tooltipMenu__item--destructive': item.isDestructive,
      'tooltipMenu__item--hasSubMenu': item.subMenuItems?.length,
      'tooltipMenu__item--highlighted': shouldBeHighlighted(item),
    });

  const renderExternalItem = () => {
    const itemIndex = props.externalItemOrder || menuItems.length;
    const isLastItem =
      props.externalItemOrder === 'undefined' ||
      (props.externalItemOrder === menuItems.length - 1 &&
        props.externalItemOrder !== 0);
    return props.externalItem ? (
      <span
        className={`tooltipMenu__extraItem ${
          isLastItem ? 'tooltipMenu__extraItem--last' : ''
        }`}
        key={itemIndex}
        onMouseEnter={() => addHoverEffectToArrow(itemIndex)}
        onMouseLeave={() => addHoverEffectToArrow(itemIndex)}
      >
        {props.externalItem}
      </span>
    ) : null;
  };

  const renderItem = (item) => {
    const itemContent = (
      <>
        {item.icon ? (
          <span className={`tooltipMenu__icon ${item.icon}`} />
        ) : null}
        <span className="tooltipMenu__text">{item.description}</span>

        {props.kitmanDesignSystem && item.isSelected && (
          <span className="tooltipMenu__iconSelected icon-check" />
        )}
      </>
    );

    if (item.href) {
      return (
        <Link
          className={getItemClassnames(item)}
          href={item.href}
          onMouseEnter={() => addHoverEffectToArrow(menuItems.indexOf(item))}
          onMouseLeave={() => addHoverEffectToArrow(menuItems.indexOf(item))}
          isExternalLink={item.isExternalLink}
          openInNewTab={item.isExternalLink}
        >
          {itemContent}
        </Link>
      );
    }

    return (
      <button
        id="TooltipMenu|ListItemButton"
        data-testid="TooltipMenu|ListItemButton"
        type="button"
        className={getItemClassnames(item)}
        onMouseEnter={() => addHoverEffectToArrow(menuItems.indexOf(item))}
        onMouseLeave={() => addHoverEffectToArrow(menuItems.indexOf(item))}
        onBlur={(event) => {
          /* closes tooltip menu when user tabs off the menu */
          if (
            event?.relatedTarget?.getAttribute('id') !==
              'TooltipMenu|ListItemButton' &&
            tooltipInstance
          ) {
            tooltipInstance.hide();
          }
        }}
      >
        {itemContent}
      </button>
    );
  };

  const getSubmenuClassNames = (item) => {
    const baseClass = props.kitmanDesignSystem
      ? 'tooltipMenu__listItemSubMenuDesignSystem'
      : 'tooltipMenu__listItemSubMenu';
    let alignment = item.subMenuAlignment || 'right';
    const EDGE_PADDING = 300;

    // This is a crude way of making sure that the submenu does not
    // go outside the bounds of the page. We check if its within
    // 300px of the edge depending on alignment, and change the direction
    // if its too close. Should handle most use cases but can be revisited
    if (listRef.current !== null) {
      const fromRight = windowWidth - position.right;

      if (alignment === 'right' && fromRight < EDGE_PADDING) {
        alignment = 'left';
      } else if (alignment === 'left' && position.left < EDGE_PADDING) {
        alignment = 'right';
      }
    }

    return classNames(baseClass, {
      [`${baseClass}--leftAlign`]: alignment === 'left',
      [`${baseClass}--rightAlign`]: alignment !== 'left',
    });
  };

  const getSubItemClassnames = (item: TooltipItem) =>
    classNames('tooltipMenu__listItemSubMenuItem', {
      'tooltipMenu__listItemSubMenuItem--active': item.isSelected === true,
      'tooltipMenu__listItemSubMenuItem--icon': item.icon,
      'tooltipMenu__listItemSubMenuItem--disabled': item.isDisabled,
      'tooltipMenu__listItemSubMenuItem--destructive': item.isDestructive,
      'tooltipMenu__listItemSubMenuItem--hasSubMenu': item.subMenuItems?.length,
      'tooltipMenu__listItemSubMenuItem--highlighted':
        shouldBeHighlighted(item),
    });

  const renderSubMenuItems = (item) => {
    if (!_isArray(item.subMenuItems)) {
      return null;
    }

    // $FlowFixMe
    const items = item.subMenuItems.map((subMenuItem) => (
      <li
        data-testid="TooltipMenu|SubmenuListItem"
        className={getSubItemClassnames(subMenuItem)}
        key={subMenuItem.key}
        onClick={
          !subMenuItem.isDisabled && subMenuItem.onClick
            ? subMenuItem.onClick
            : () => {}
        }
      >
        {subMenuItem.icon ? (
          <span className={`tooltipMenu__icon ${subMenuItem.icon}`} />
        ) : null}
        <span className="tooltipMenu__text">{subMenuItem.description}</span>

        {props.kitmanDesignSystem && subMenuItem.isSelected && (
          <span className="tooltipMenu__iconSelected icon-check" />
        )}

        {/* Only supporting more than 2 levels for design system implementations */}
        {props.kitmanDesignSystem && renderSubMenuItems(subMenuItem)}
      </li>
    ));

    return (
      <ul
        data-testid="TooltipMenu|SubmenuList"
        className={getSubmenuClassNames(item)}
      >
        {items}
      </ul>
    );
  };

  const renderListItems = () => {
    const items = menuItems.map((item) => (
      <li
        className="tooltipMenu__listItem"
        data-testid="TooltipMenu|PrimaryListItem"
        key={item.key}
        onClick={!item.isDisabled && item.onClick ? item.onClick : () => {}}
      >
        {renderItem(item)}

        {renderSubMenuItems(item)}
      </li>
    ));

    if (props.externalItem) {
      const externalItem = renderExternalItem();
      if (props.externalItemOrder === 0 || props.externalItemOrder) {
        // $FlowFixMe: externalItemOrder is always a number in this case
        items.splice(props.externalItemOrder, 0, externalItem);
      } else {
        items.push(externalItem);
      }
    }

    return items;
  };

  return (
    <Tippy
      content={
        <div ref={listRef} className={getClassnames()}>
          <ul
            className="tooltipMenu__menuList"
            onClick={() => {
              if (tooltipInstance) {
                tooltipInstance.hide();
              }
            }}
          >
            {renderListItems()}
          </ul>
        </div>
      }
      trigger={props.disabled ? 'manual' : 'click'}
      placement={props.placement}
      interactive
      onCreate={setTooltipInstance}
      onHide={() => props.onVisibleChange(false)}
      onShow={() => {
        // Updating the position of the list in a timeout
        // so Tippy has a chance to render the dropdown before
        // we get the bouningClientRect
        setTimeout(() => {
          if (listRef.current !== null) {
            const bounds = listRef.current.getBoundingClientRect();

            setPosition({ left: bounds.left, right: bounds.right });
          }
        }, 0);

        props.onVisibleChange(true);
      }}
      offset={props.offset || defaultOffset}
      appendTo={props.appendToParent ? 'parent' : document.body}
      theme={
        props.kitmanDesignSystem
          ? 'neutral-tooltip--kitmanDesignSystem'
          : 'blue-border-tooltip'
      }
      zIndex={props?.zIndex}
    >
      {props.tooltipTriggerElement}
    </Tippy>
  );
};

TooltipMenu.defaultProps = {
  placement: 'right-start',
  onVisibleChange: () => {},
  customClassnames: [],
};

export default TooltipMenu;
