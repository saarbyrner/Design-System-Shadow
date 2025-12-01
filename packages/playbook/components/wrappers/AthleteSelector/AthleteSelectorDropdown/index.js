// @flow
import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ClickAwayListener } from '@mui/base';
import i18n from '@kitman/common/src/utils/i18n';
import Popper from '@mui/material/Popper';
import { ChevronLeft } from '@mui/icons-material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import {
  SearchBar,
  AthleteListItem,
  BodySkeleton,
  FlatGroupComponent,
} from '../shared';
import type { Athlete, Group, DataGrouping } from '../shared/types';
import {
  filterGroup,
  matchesSearch,
  Z_INDEX_ABOVE_DRAWER,
} from '../shared/utils';

type AthleteSelectorDropdownProps = {|
  open: boolean,
  onClose: () => void,
  onDone: () => void,
  groups: Group[],
  selectedIds: Set<number>,
  setSelectedIds: (updater: (prev: Set<number>) => Set<number>) => void,
  isLoading?: boolean,
  grouping?: DataGrouping,
  anchorEl: any,
|};

const AthleteSelectorDropdown = ({
  open,
  onDone,
  groups,
  selectedIds,
  setSelectedIds,
  isLoading = false,
  grouping,
  anchorEl,
}: AthleteSelectorDropdownProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [path, setPath] = useState<Group[]>([]);

  const handleClose = () => {
    onDone();
  };

  useEffect(() => {
    if (!open) {
      setSearchInput('');
      setPath([]);
    }

    return () => {
      setSearchInput('');
      setPath([]);
    };
  }, [open, groups]);

  const currentGroup = useMemo<Group>(() => {
    if (!path.length) {
      return { key: 'root', title: 'All', children: groups, athletes: [] };
    }

    return path[path.length - 1];
  }, [path, groups]);

  const filteredGroups = useMemo(() => {
    if (!searchInput) {
      return currentGroup?.children ?? [];
    }

    return (currentGroup?.children ?? [])
      .map((group) =>
        filterGroup({
          group,
          search: searchInput,
        })
      )
      .filter(Boolean);
  }, [currentGroup, searchInput]);

  const handleToggleAthlete = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBack = () => setPath((prev) => prev.slice(0, -1));

  const renderGroup = (group: Group) => {
    return (
      <FlatGroupComponent
        group={group}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setPath={setPath}
      />
    );
  };

  const renderAthlete = (athlete: Athlete) => {
    if (!matchesSearch(athlete, searchInput)) {
      return null;
    }

    return (
      <AthleteListItem
        size="sm"
        key={athlete.key}
        athlete={athlete}
        selectedIds={selectedIds}
        handleToggleAthlete={handleToggleAthlete}
      />
    );
  };

  const renderListHeader = () => {
    if (!path.length) {
      return null;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          py: 1,
          px: 2,
        }}
      >
        <Button
          onClick={handleBack}
          startIcon={<ChevronLeft fontSize="small" />}
          variant="ghost"
          size="small"
          sx={{
            justifyContent: 'start',
            marginLeft: '-0.5rem',
            px: '0.5rem',
          }}
        >
          {i18n.t('Back')}
        </Button>

        <Box>
          <Typography variant="body2" color="text.primary">
            {currentGroup.title}
          </Typography>
          {currentGroup.subtitle && (
            <Typography
              variant="body2"
              sx={{ fontSize: '12px' }}
              color="text.primary"
            >
              {currentGroup.subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderLevel = () => {
    if (isLoading) {
      return <BodySkeleton />;
    }

    const athletes = currentGroup?.athletes ?? [];
    const isEmpty = !filteredGroups.length && !athletes.length;

    return (
      <Stack spacing={0.5} sx={{ height: 300, overflowY: 'auto' }}>
        {renderListHeader()}
        {filteredGroups.map(renderGroup)}
        {athletes.map(renderAthlete)}

        {isEmpty && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={2}
          >
            {i18n.t('No results')}
          </Typography>
        )}
      </Stack>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Popper
      id="athlete-selector-dropdown"
      open={open}
      anchorEl={anchorEl}
      transition
      sx={{ zIndex: Z_INDEX_ABOVE_DRAWER }}
      disablePortal
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={200}>
          <Paper sx={{ width: 400 }}>
            <ClickAwayListener onClickAway={handleClose}>
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  px={2}
                  pt={2}
                >
                  <Typography variant="h6">
                    {i18n.t('Select Athletes')}
                  </Typography>
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  px={2}
                  py={1}
                >
                  <SearchBar
                    onSearchChange={setSearchInput}
                    grouping={grouping}
                    isLoading={isLoading}
                  />
                </Stack>

                <Box px={2} pb={1}>
                  <Chip
                    size="small"
                    variant="filled"
                    disabled={selectedIds.size === 0}
                    color="primary"
                    label={`${i18n.t('Selected')} (${selectedIds.size})`}
                    onDelete={
                      selectedIds.size
                        ? () => setSelectedIds(() => new Set())
                        : null
                    }
                    deleteIcon={<CloseIcon fontSize="small" />}
                  />
                </Box>

                <Divider />

                <Box flex={1}>{renderLevel()}</Box>

                <Divider />

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={1}
                  p={2}
                >
                  <Button
                    variant="contained"
                    onClick={onDone}
                    disabled={selectedIds.size === 0}
                  >
                    {i18n.t('Done')}
                  </Button>
                </Stack>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default AthleteSelectorDropdown;
