// @flow
import {
  Drawer,
  Stack,
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  TextField,
  Button,
  FormControl,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import colors from '@kitman/common/src/variables/colors';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getPanel } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import { useTheme } from '@kitman/playbook/hooks';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import useChangeStatusPanel from './hooks/useChangeStatusPanel';
import { HistoryItemTranslated as HistoryItem } from '../RegistrationHistoryPanel/components/HistoryItem';

const PanelContent = ({ t }: I18nProps<{}>) => {
  const {
    handleOnClose,
    isUnapprovingUser,
    panelState,
    isPanelStateValid,
    onSave,
    username,
    reasons,
    registrationHistory,
    handleTracking,
    handleStatusChange,
  } = useChangeStatusPanel();

  const renderHeader = () => (
    <Stack
      sx={{ py: 1, pl: 3, pr: 2 }}
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: 20,
          fontWeight: 600,
          colors: colors.grey_300,
          width: '90%',
          whiteSpace: 'normal',
        }}
      >
        {`${t('Change Status for')} ${username}`}
      </Typography>
      <IconButton aria-label="close-details-panel" onClick={handleOnClose}>
        <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
      </IconButton>
    </Stack>
  );

  const renderApprovalStatusToggle = () => (
    <Stack mb={2}>
      <Box component="p" sx={{ fontSize: 16 }}>
        {t('Status of the user')}
      </Box>
      <ToggleButtonGroup
        value={
          isUnapprovingUser
            ? RegistrationStatusEnum.UNAPPROVED
            : RegistrationStatusEnum.APPROVED
        }
        exclusive
        onChange={(e, newValue) => {
          handleStatusChange({
            key: 'status',
            value: newValue,
            shouldTrack: true,
          });
        }}
      >
        <ToggleButton
          sx={{
            color: colors.grey_200,
            '&.Mui-selected': {
              backgroundColor: colors.grey_200,
              color: 'white',
              '&:hover': {
                backgroundColor: colors.grey_200,
              },
            },
          }}
          value={RegistrationStatusEnum.APPROVED}
        >
          {t('Approved')}
        </ToggleButton>
        <ToggleButton
          sx={{
            color: colors.grey_200,
            '&.Mui-selected': {
              backgroundColor: colors.grey_200,
              color: 'white',
              '&:hover': {
                backgroundColor: colors.grey_200,
              },
            },
          }}
          value={RegistrationStatusEnum.UNAPPROVED}
        >
          {t('Unapproved')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderReasonNote = () => {
    const selectedReason =
      reasons.find((option) => option.id === panelState.reasonId) ?? null;
    return (
      <Stack direction="row" gap={2}>
        <Divider orientation="vertical" />
        <Stack
          direction="column"
          gap={2}
          py={1}
          sx={{
            flexGrow: 1,
          }}
        >
          <FormControl>
            <Autocomplete
              value={selectedReason}
              onChange={(_, newValue) => {
                handleStatusChange({
                  key: 'reasonId',
                  value: newValue?.id,
                  shouldTrack: true,
                });
              }}
              options={reasons}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label={t('Reason')} />
              )}
            />
          </FormControl>

          <TextField
            id="note"
            label={t('Notes')}
            onChange={(e) =>
              handleStatusChange({
                key: 'annotation',
                value: e.target.value,
                shouldTrack: false,
              })
            }
            multiline
            maxRows={5}
            value={panelState.annotation}
            InputLabelProps={{ shrink: Boolean(panelState.annotation) }}
            onFocus={() => {
              handleTracking('annotation');
            }}
          />
        </Stack>
      </Stack>
    );
  };

  const renderRegistrationHistory = () => {
    if (
      !registrationHistory ||
      registrationHistory?.status_history.length === 0
    ) {
      return null;
    }
    return (
      <Stack mt={1} spacing={2}>
        <Accordion
          onChange={(_, expanded) => {
            if (expanded) {
              handleTracking('history');
            }
          }}
        >
          <AccordionSummary
            sx={{
              p: 0,
            }}
            expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ArrowDropDown} />}
          >
            <Typography component="span">{t('Show status history')}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {registrationHistory?.status_history?.map((history) => (
              <Box key={history.id} sx={{ mb: 1 }}>
                <HistoryItem entry={history} />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Stack>
    );
  };

  const renderContent = () => (
    <Stack height="100%" direction="column" justifyContent="space-between">
      <Stack direction="column">
        {renderHeader()}
        <Divider />
        <Stack sx={{ px: 3, pb: 1, pt: 2 }}>
          {renderApprovalStatusToggle()}
          {isUnapprovingUser && renderReasonNote()}
          <Divider sx={{ margin: '10px 0' }} />
          {renderRegistrationHistory()}
        </Stack>
      </Stack>
      <Stack
        px={3}
        py={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button variant="secondary" onClick={handleOnClose}>
          {t('Cancel')}
        </Button>
        <Button disabled={!isPanelStateValid} onClick={onSave}>
          {t('Save')}
        </Button>
      </Stack>
    </Stack>
  );

  return <>{renderContent()}</>;
};

const ChangeStatusPanel = ({ t }: I18nProps<{}>) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isOpen = useSelector(getPanel).isOpen;
  const handleOnClose = () => {
    dispatch(onTogglePanel({ isOpen: false }));
  };

  return (
    <div>
      <Drawer
        open={isOpen}
        anchor="right"
        onClose={handleOnClose}
        sx={drawerMixin({ theme, isOpen })}
      >
        {isOpen && <PanelContent t={t} />}
      </Drawer>
    </div>
  );
};

export default ChangeStatusPanel;
export const ChangeStatusPanelTranslated = withNamespaces()(ChangeStatusPanel);
