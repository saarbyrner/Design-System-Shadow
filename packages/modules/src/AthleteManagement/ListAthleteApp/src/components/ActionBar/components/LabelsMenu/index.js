// @flow

import { withNamespaces } from 'react-i18next';
import {
  Box,
  Menu,
  Button,
  Divider,
  MenuItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Chip,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  anchorEl: Object,
  areLabelsDataFetching: boolean,
  isBulkUpdateAthleteLabelsLoading: boolean,
  labelsOptions: Array<{ value: number, label: string, color: string }>,
  selectedLabelIds: Array<number>,
  onSaveClick: () => Promise<void>,
  onCloseMenu: () => void,
  handleLabelChange: (event: Object, newLabelIds: Array<number>) => void,
};

const LabelsMenu = ({
  anchorEl,
  areLabelsDataFetching,
  isBulkUpdateAthleteLabelsLoading,
  labelsOptions,
  selectedLabelIds,
  onSaveClick,
  handleLabelChange,
  onCloseMenu,
  t,
}: I18nProps<Props>) => {
  const onCancel = (event): void => {
    onCloseMenu();
    handleLabelChange(event, []);
  };

  const onSave = async (event): Promise<void> => {
    await onSaveClick();
    onCancel(event);
  };

  return (
    <Menu
      id="basic-menu-labels"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onCloseMenu}
      slotProps={{ paper: { sx: { minWidth: '16.25rem' } } }}
      MenuListProps={{
        'aria-labelledby': 'assign-labels-button',
      }}
    >
      {areLabelsDataFetching ? (
        <Box justifyContent="center" display="flex" p={1}>
          <CircularProgress size="2rem" />
        </Box>
      ) : (
        labelsOptions.map(({ value, label, color }) => {
          const isSelected = selectedLabelIds.includes(value);
          return (
            <MenuItem
              onClick={(event) =>
                handleLabelChange(
                  event,
                  isSelected
                    ? selectedLabelIds.filter((id) => id !== value)
                    : [...selectedLabelIds, value]
                )
              }
              key={label}
            >
              <Checkbox checked={isSelected} />
              <ListItemText>
                <Chip
                  key={value}
                  label={label}
                  sx={{ backgroundColor: color, color: colors.white }}
                />
              </ListItemText>
            </MenuItem>
          );
        })
      )}
      <Divider sx={{ margin: 0 }} />
      <Box
        display="flex"
        p="0.25rem 1rem"
        justifyContent="space-between"
        width="100%"
      >
        <Button
          disabled={isBulkUpdateAthleteLabelsLoading}
          sx={{ mt: 2 }}
          onClick={onCancel}
          variant="secondary"
        >
          {t('Cancel')}
        </Button>
        <Button
          disabled={isBulkUpdateAthleteLabelsLoading}
          sx={{ mt: 2 }}
          onClick={onSave}
        >
          {t('Save')}
        </Button>
      </Box>
    </Menu>
  );
};

export const LabelsMenuTranslated = withNamespaces()(LabelsMenu);
export default LabelsMenu;
