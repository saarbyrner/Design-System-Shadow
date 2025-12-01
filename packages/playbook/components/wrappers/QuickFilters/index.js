// @flow

import { Box, Chip } from '@mui/material';
import { getChipStyles, getQuickFiltersBoxStyles } from './styles';
import type { QuickFiltersProps } from './types';

function QuickFilters({
  selectedFilter,
  onQuickSelect,
  filters,
}: QuickFiltersProps) {
  // Combine filters properly

  return (
    <Box display="flex" flexWrap="wrap" gap={1} sx={getQuickFiltersBoxStyles()}>
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          onClick={() => onQuickSelect(filter.key)}
          variant="filled"
          clickable
          sx={getChipStyles(selectedFilter === filter.key)}
        />
      ))}
    </Box>
  );
}

export default QuickFilters;
