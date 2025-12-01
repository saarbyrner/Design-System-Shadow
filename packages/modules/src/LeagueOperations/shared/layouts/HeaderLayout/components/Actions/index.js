// @flow

import { useMemo } from 'react';
import { Box, Button, IconButton } from '@kitman/playbook/components';
import Dropdown from '@kitman/modules/src/LeagueOperations/shared/components/Dropdown';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { styles } from './styles';

type Action = {
  id: string,
  label: string,
  onClick: () => void,
  isCollapsible: boolean,
  isDisabled?: boolean,
  button?: {
    variant?: 'text' | 'outlined' | 'contained',
    color?:
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'info'
      | 'warning',
  },
};

type Props = {
  actions: Action[],
};

const MAX_BUTTONS_IN_ROW = 2;

const Actions = ({ actions }: Props) => {
  const [collapsibleItems, nonCollapsibleItems] = useMemo(
    () =>
      actions.reduce(
        (items, item) => {
          if (item.isCollapsible) {
            items[0].push(item);
          } else {
            items[1].push(item);
          }
          return items;
        },
        [[], []]
      ),
    [actions]
  );

  const renderActions = (items: Array<Action>) => {
    return items.map(({ id, isDisabled, onClick, label, button }) => {
      const { variant = 'contained', color = 'primary' } = button ?? {};

      return (
        <Button
          id={id}
          key={id}
          variant={variant}
          color={color}
          disableElevation
          disabled={isDisabled}
          onClick={onClick}
        >
          {label}
        </Button>
      );
    });
  };

  const renderMobileActions = () => {
    const shouldNotWrap = actions.length <= MAX_BUTTONS_IN_ROW;

    if (shouldNotWrap) {
      return renderActions(actions);
    }

    return (
      <>
        {renderActions(nonCollapsibleItems)}
        <Dropdown
          id="reg-req-header-actions"
          items={collapsibleItems}
          Control={(props) => (
            <IconButton {...props} data-testid="header-mobile-actions">
              <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
            </IconButton>
          )}
        />
      </>
    );
  };

  return (
    <Box sx={styles.container}>
      <Box
        data-testid="reg-req-header-mobile-actions"
        sx={styles.mobileActions}
      >
        {renderMobileActions()}
      </Box>
      <Box
        data-testid="reg-req-header-desktop-actions"
        sx={styles.desktopActions}
      >
        {renderActions(actions)}
      </Box>
    </Box>
  );
};

export type { Action };
export { Actions };
