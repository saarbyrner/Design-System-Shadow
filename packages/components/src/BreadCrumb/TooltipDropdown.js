// @flow
import { TooltipMenu } from '@kitman/components';
import classNames from 'classnames';

import type { MenuItem } from '@kitman/common/src/types';

type TooltipDropdownProps = {
  dropdownItems: Array<MenuItem>,
  selectedMenuItemName: string,
  isDisabled: boolean,
};

const TooltipDropdown = (props: TooltipDropdownProps) => {
  const className = classNames('breadCrumb__currentItem', {
    'breadCrumb__currentItem--disabled': props.isDisabled,
  });

  const getMenuItems = () =>
    props.dropdownItems.map((menuItem) => ({
      href: menuItem.url,
      description: menuItem.label,
    }));

  return (
    <TooltipMenu
      key={props.selectedMenuItemName}
      placement="bottom-end"
      disabled={props.isDisabled}
      offset={[0, 5]}
      menuItems={getMenuItems()}
      tooltipTriggerElement={
        <p className={className}>
          {props.selectedMenuItemName}
          <span className="breadCrumb__downArrow">&#9660;</span>
        </p>
      }
    />
  );
};

export default TooltipDropdown;
