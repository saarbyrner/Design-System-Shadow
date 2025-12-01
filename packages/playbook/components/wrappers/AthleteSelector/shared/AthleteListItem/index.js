// @flow
import {
  ListItem,
  Checkbox,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
} from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import { chipColorFor, getInitial } from '../utils';
import type { Athlete } from '../types';

type Size = 'sm' | 'md';

type Props = {
  athlete: Athlete,
  selectedIds: Set<number>,
  handleToggleAthlete: (id: number) => void,
  size?: Size,
};

const styles = {
  sm: {
    minHeight: 36,
    primaryFont: '0.925rem',
    secondaryFont: '0.7rem',
    checkboxSize: 'small',
    avatarMinWidth: 32,
    avatarSize: 26,
    avatarFont: '0.7rem',
    chipFont: '0.65rem',
    chipHeight: 20,
    chipSize: 'small',
  },
  md: {
    minHeight: 64,
    primaryFont: '1rem',
    secondaryFont: '0.875rem',
    checkboxSize: 'medium',
    avatarMinWidth: 56,
    avatarSize: 40,
    avatarFont: '1rem',
    chipFont: '0.875rem',
    chipHeight: 32,
    chipSize: 'medium',
  },
};

const AthleteListItem = ({
  athlete,
  selectedIds,
  handleToggleAthlete,
  size = 'md',
}: Props) => {
  const style = styles[size];

  return (
    <ListItem
      key={athlete.key}
      onClick={() => handleToggleAthlete(athlete.id)}
      sx={{
        py: 1,
        px: 2,
        minHeight: style.minHeight,
        '& .MuiListItemText-primary': {
          fontSize: style.primaryFont,
        },
        '& .MuiListItemText-secondary': {
          fontSize: style.secondaryFont,
        },
      }}
    >
      <Checkbox
        edge="start"
        checked={selectedIds.has(athlete.id)}
        size={style.checkboxSize}
      />

      <ListItemAvatar sx={{ minWidth: style.avatarMinWidth }}>
        <Avatar
          src={athlete.avatarUrl}
          sx={{
            width: style.avatarSize,
            height: style.avatarSize,
            fontSize: style.avatarFont,
          }}
        >
          {!athlete.avatarUrl && getInitial(athlete.name)}
        </Avatar>
      </ListItemAvatar>

      <ListItemText primary={athlete.name} secondary={athlete.position || ''} />

      {athlete.status && (
        <Chip
          label={i18n.t(athlete.status || 'Unknown')}
          color={chipColorFor(athlete.status)}
          size={style.chipSize}
          sx={{
            fontSize: style.chipFont,
            height: style.chipHeight,
          }}
        />
      )}
    </ListItem>
  );
};

export default AthleteListItem;
