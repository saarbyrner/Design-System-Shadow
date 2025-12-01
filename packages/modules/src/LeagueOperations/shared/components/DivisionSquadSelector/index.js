// @flow
import { useState, useMemo, useEffect } from 'react';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import type { Squad } from '@kitman/common/src/types/__common';
import { type InitialData } from '@kitman/services/src/services/getInitialData';
import { localeSortByField } from '@kitman/common/src/utils/localeSort';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';
import { setLastKnownSquad } from '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn';
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { getFlatHierarchy } from './utils';
import styles from './style';

type Props = {
  locale: string,
  availableSquads: Array<Squad>,
  currentUser: $PropertyType<InitialData, 'current_user'>,
  currentSquad: Squad,
};

const PADDING_LEFT = 16;

const DivisionSquadSelector = (props: Props) => {
  const { isLeague } = useLeagueOperations();
  const { availableSquads, currentUser, currentSquad, locale } = props;
  const [open, setOpen] = useState(false);
  // check if the current user is an athlete
  const canChangeSquad = props.currentUser.athlete;

  useEffect(() => {
    const handleResize = () => setOpen(false);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const flatSquads = useMemo(() => {
    const squads = localeSortByField(availableSquads, 'name', locale);

    return isLeague
      ? getFlatHierarchy(squads, locale, 'divisionsAndConferences')
      : getFlatHierarchy(squads, locale, 'divisionsAndSquads');
  }, [availableSquads, isLeague, locale]);

  const handleChange = (event) => {
    const newValue = event.target.value;

    if (newValue) {
      setLastKnownSquad(newValue, `${currentUser.id}`);
    }
  };

  const renderDropdownIcon = () => {
    return (
      <Box
        sx={{
          ...styles.dropdownIconSx,
          // don't display chevron if user is not allowed to change squad
          display: !canChangeSquad ? 'block' : 'none',
        }}
      >
        <KitmanIcon
          name={
            open
              ? KITMAN_ICON_NAMES.KeyboardArrowUpIcon
              : KITMAN_ICON_NAMES.KeyboardArrowDownIcon
          }
          sx={{
            paddingBottom: '3px',
          }}
          fontSize="medium"
          onClick={() => setOpen(!open)}
        />
      </Box>
    );
  };

  const renderMenuItems = () => {
    return flatSquads.map((squad, index) => {
      const paddingLeft = !isLeague
        ? PADDING_LEFT
        : PADDING_LEFT + squad.indentLevel * PADDING_LEFT;
      const borderTop =
        !isLeague && index > 0 && squad.indentLevel === 0
          ? `1px solid #${colors.grey_700}`
          : undefined;
      const selected = currentSquad?.id === squad.id;
      const disabled = !isLeague && squad.disabled;

      return (
        <MenuItem
          selected={selected}
          component="a"
          href={isConnectedToStaging ? null : `/settings/set_squad/${squad.id}`}
          key={squad.id}
          value={squad.id}
          sx={{
            ...styles.menuItemSx,
            borderTop,
            paddingLeft: `${paddingLeft}px`,
          }}
          disabled={disabled}
          disableRipple
        >
          <Box>{squad.name}</Box>
          {selected && (
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Check}
              fontSize="medium"
              sx={styles.checkIconSx}
            />
          )}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl sx={styles.formControlSx} data-testid="divisionSquadSelector">
      <Select
        open={open}
        value={props.currentSquad?.id}
        renderValue={() => <Box>{props.currentSquad?.name}</Box>}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleChange}
        input={<OutlinedInput />}
        displayEmpty
        MenuProps={{
          sx: styles.menuPropsSx,
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom',
          },
          transformOrigin: {
            horizontal: 'right',
            vertical: 'top',
          },
        }}
        IconComponent={renderDropdownIcon}
        sx={styles.selectSx}
      >
        {renderMenuItems()}
      </Select>
    </FormControl>
  );
};

export default DivisionSquadSelector;
