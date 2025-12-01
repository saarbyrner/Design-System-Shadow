// @flow
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import i18n from '@kitman/common/src/utils/i18n';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMemo } from 'react';
import type { Group } from '../types';
import { collectAthleteIds } from '../utils';

type Props = {
  group: Group,
  selectedIds: Set<number>,
  setSelectedIds: (updater: (prev: Set<number>) => Set<number>) => void,
  setPath: (updater: (prev: Group[]) => Group[]) => void,
};

const FlatGroupComponent = ({
  group,
  setPath,
  selectedIds,
  setSelectedIds,
}: Props) => {
  const allAthleteIds = useMemo(() => {
    return collectAthleteIds(group);
  }, [group]);

  const isAllSelected =
    allAthleteIds.length > 0 &&
    allAthleteIds.every((id) => selectedIds.has(id));

  const handleSelectToggle = (e: SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      allAthleteIds.forEach((id) => {
        if (isAllSelected) updated.delete(id);
        else updated.add(id);
      });
      return updated;
    });
  };

  const handleGroupClick = () => setPath((prev) => [...prev, group]);

  return (
    <Box
      key={group.key}
      onClick={handleGroupClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        borderRadius: 1,
        px: 2,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2">{group.title}</Typography>
          {group.subtitle && (
            <Typography variant="body2" sx={{ fontSize: '12px' }}>
              {group.subtitle}
            </Typography>
          )}
        </Box>
        <Button
          size="medium"
          variant="text"
          onClick={handleSelectToggle}
          sx={{ fontWeight: 'semibold' }}
        >
          {isAllSelected ? i18n.t('Clear all') : i18n.t('Select all')}
        </Button>
      </Box>
      <ChevronRightIcon fontSize="small" />
    </Box>
  );
};

export default FlatGroupComponent;
