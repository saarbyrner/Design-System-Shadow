// @flow

import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import i18n from '@kitman/common/src/utils/i18n';
import AthleteSelectorTrigger from '../AthleteSelectorTrigger';
import type { AthleteSelectorRootProps } from '../shared/types';
import AthleteSelectorDropdown from '../AthleteSelectorDropdown';

export default function AthleteSelectorRoot({
  useData,
  variant,
  onDone,
  Trigger,
  initialIds,
}: AthleteSelectorRootProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set(initialIds));

  const anchorRef = useRef(null);

  const { isLoading, groups, athletes, grouping } = useData();

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleDone = () => {
    if (typeof onDone === 'function') {
      const result = Array.from(selectedIds).map(Number);
      onDone(result);
    }
    onClose();
  };

  const renderTrigger = () => {
    if (Trigger) {
      return (
        <Trigger
          isOpen={open}
          isLoading={isLoading}
          athletes={athletes}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onOpen={onOpen}
          onClose={onClose}
        />
      );
    }

    return (
      <AthleteSelectorTrigger
        label={i18n.t('Select Athlete')}
        onOpen={onOpen}
        open={open}
      />
    );
  };

  return (
    <Box>
      <Box ref={anchorRef}>{renderTrigger()}</Box>

      {variant === 'dropdown' && (
        <AthleteSelectorDropdown
          anchorEl={anchorRef.current}
          open={open}
          grouping={grouping}
          isLoading={isLoading}
          onClose={onClose}
          onDone={handleDone}
          groups={groups}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
    </Box>
  );
}
