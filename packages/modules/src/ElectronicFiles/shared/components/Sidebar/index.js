// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useDispatch, useSelector } from 'react-redux';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import {
  MENU_ITEM,
  selectExpanded,
  selectSelectedMenuItem,
  updateExpanded,
  updateSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  Badge,
  Paper,
  Box,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
} from '@kitman/playbook/components';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetUnreadCountQuery } from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { generateRouteUrl } from '@kitman/modules/src/ElectronicFiles/shared/utils';

type Props = {};

const Sidebar = ({ t }: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();
  const dispatch = useDispatch();
  const expanded = useSelector(selectExpanded);
  const selectedMenuItem = useSelector(selectSelectedMenuItem);

  const {
    data: permissions = {},
    isSuccess: hasPermissionsDataLoaded = false,
  }: { data: PermissionsType, isSuccess: boolean } = useGetPermissionsQuery();

  const { data: unreadCount = { unread: 0 } } = useGetUnreadCountQuery();

  const renderChip = (count: number) => {
    return <Chip label={count} color="primary" size="small" />;
  };

  const handleClick = (menuItem) => {
    dispatch(updateSelectedMenuItem(menuItem));
    locationAssign(generateRouteUrl({ selectedMenuItem: menuItem }));
  };

  const getMenuItems = () => {
    return [
      {
        id: MENU_ITEM.inbox,
        icon: (
          <ListItemIcon>
            {expanded || !unreadCount.unread ? (
              <KitmanIcon name={KITMAN_ICON_NAMES.InboxOutlined} />
            ) : (
              <Badge badgeContent={unreadCount.unread} color="primary">
                <KitmanIcon name={KITMAN_ICON_NAMES.InboxOutlined} />
              </Badge>
            )}
          </ListItemIcon>
        ),
        content: (
          <>
            <ListItemText primary={t('Inbox')} />
            {unreadCount.unread ? renderChip(unreadCount.unread) : null}
          </>
        ),
        onClick: handleClick,
        hidden: false,
      },
      {
        id: MENU_ITEM.sent,
        icon: (
          <ListItemIcon>
            <KitmanIcon name={KITMAN_ICON_NAMES.SendOutlined} />
          </ListItemIcon>
        ),
        content: <ListItemText primary={t('Sent')} />,
        onClick: handleClick,
        hidden: false,
      },
      {
        id: MENU_ITEM.contacts,
        icon: (
          <ListItemIcon>
            <KitmanIcon name={KITMAN_ICON_NAMES.GroupsOutlined} />
          </ListItemIcon>
        ),
        content: <ListItemText primary={t('Contacts')} />,
        onClick: handleClick,
        hidden:
          hasPermissionsDataLoaded && !permissions.efile.canManageContacts,
      },
    ];
  };

  return (
    <Paper variant="outlined" square>
      <Box
        sx={{
          pt: 1,
          width: expanded ? 200 : 65,
          transition: 'width 0.2s ease-in-out',
        }}
      >
        <Box
          sx={{
            textAlign: expanded ? 'right' : 'center',
            pr: expanded ? 1 : 0,
          }}
        >
          <IconButton
            size="small"
            onClick={() => dispatch(updateExpanded(!expanded))}
          >
            {expanded ? (
              <KitmanIcon name={KITMAN_ICON_NAMES.KeyboardDoubleArrowLeft} />
            ) : (
              <KitmanIcon name={KITMAN_ICON_NAMES.KeyboardDoubleArrowRight} />
            )}
          </IconButton>
        </Box>
        <MenuList dense={expanded} sx={{ pt: !expanded ? 2 : null }}>
          {getMenuItems()
            .filter((menuItem) => !menuItem.hidden)
            .map((menuItem) => (
              <MenuItem
                key={menuItem.id}
                onClick={() => menuItem.onClick(menuItem.id)}
                selected={menuItem.id === selectedMenuItem}
                sx={{
                  minHeight: '34px',
                  py: '5px',
                }}
              >
                {menuItem.icon}
                {expanded && menuItem.content}
              </MenuItem>
            ))}
        </MenuList>
      </Box>
    </Paper>
  );
};

export const SidebarTranslated: ComponentType<Props> =
  withNamespaces()(Sidebar);
export default Sidebar;
