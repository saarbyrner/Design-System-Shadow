// @flow
import type { Node } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List } from '@kitman/playbook/components';

import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import {
  getMenuFactory,
  getActiveMenuState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';

import { getShowMenuIconsFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

import { onSetActiveMenu } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';

import type { FormMenuItem } from '@kitman/modules/src/HumanInput/types/forms';

import MenuGroup from '../MenuGroup';
import MenuItem from '../MenuItem';

const Menu = (): Node => {
  const menu = useSelector(getMenuFactory());
  const dispatch = useDispatch();
  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);
  const showMenuIcons: boolean = useSelector(getShowMenuIconsFactory());

  const onHandleSetActiveForm = ({
    newMenuItemIndex,
    newMenuGroupIndex,
  }: {
    newMenuItemIndex: number,
    newMenuGroupIndex: number,
  }) => {
    dispatch(
      onSetActiveMenu({
        menuItemIndex: newMenuItemIndex,
        menuGroupIndex: newMenuGroupIndex,
      })
    );
  };

  const getMenuComponent = ({
    formMenuItem,
    newMenuGroupIndex = 0,
    newMenuItemIndex = 0,
  }: {
    formMenuItem: FormMenuItem,
    newMenuGroupIndex: number,
    newMenuItemIndex?: number,
  }): Node => {
    switch (formMenuItem.element_type) {
      case LAYOUT_ELEMENTS.MenuGroup:
        return (
          <MenuGroup
            formMenuItem={formMenuItem}
            key={formMenuItem.key}
            isActive={newMenuGroupIndex === menuGroupIndex}
            onClick={() =>
              onHandleSetActiveForm({ newMenuGroupIndex, newMenuItemIndex: 0 })
            }
            showMenuIcons={showMenuIcons}
          >
            <List key={formMenuItem.key} dense sx={{ py: 0 }}>
              {formMenuItem?.items?.map((nestedMenuItem, nestedIndex) =>
                getMenuComponent({
                  formMenuItem: nestedMenuItem,
                  newMenuGroupIndex,
                  newMenuItemIndex: nestedIndex,
                })
              )}
            </List>
          </MenuGroup>
        );
      case LAYOUT_ELEMENTS.MenuItem:
        return (
          <MenuItem
            formMenuItem={formMenuItem}
            key={formMenuItem.key}
            onClick={() =>
              onHandleSetActiveForm({ newMenuGroupIndex, newMenuItemIndex })
            }
            isActive={newMenuItemIndex === menuItemIndex}
            showMenuIcons={showMenuIcons}
          />
        );
      default:
        return <div />;
    }
  };

  const buildFormMenu = (): Node => {
    return (
      menu.map((formMenuItem, formIndex) => {
        return getMenuComponent({ formMenuItem, newMenuGroupIndex: formIndex });
      }) || []
    );
  };

  return <List sx={{ pt: 0 }}>{buildFormMenu()}</List>;
};

export default Menu;
