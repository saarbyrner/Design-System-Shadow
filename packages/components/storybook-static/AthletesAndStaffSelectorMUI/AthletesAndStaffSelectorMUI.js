// @flow
/* eslint-disable max-nested-callbacks */
import { forwardRef, useEffect, useState, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';

import { type I18nProps } from '@kitman/common/src/types/i18n';
import { type SquadData } from '@kitman/components/src/AthleteAndStaffSelector/types';
import { AppStatus } from '@kitman/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import {
  CircularProgress,
  ButtonGroup,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  InputAdornment,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
  Box,
  ClickAwayListener,
} from '@kitman/playbook/components';
import { KitmanIcon } from '@kitman/playbook/icons';

import styles from './styles';

const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

type Props = I18nProps<{
  isLoading?: boolean,
  isError?: boolean,
  isOpen: boolean,
  title?: string,
  cancelLabel?: string,
  onCancel: () => void,
  isEmptySelectionAllowed?: boolean,
  confirmLabel?: string,
  onConfirm: (Array<number>) => void,
  squads: Array<SquadData>,
  initialSelection?: Array<number>,
}>;

export const AthletesAndStaffSelectorMUI = ({
  isLoading,
  isError,
  isOpen,
  title,
  cancelLabel,
  onCancel,
  isEmptySelectionAllowed,
  confirmLabel,
  onConfirm,
  // $FlowIgnore[incompatible-use] the type is correct.
  squads,
  initialSelection,
  t,
}: Props) => {
  const [selectedAthletes, setSelectedAthletes] = useState<Array<number>>([]);
  useEffect(() => {
    setSelectedAthletes(initialSelection ?? []);
  }, [initialSelection]);
  const getSelectedAthletesData = () =>
    squads
      .flatMap(({ position_groups: groups, name: squad }) =>
        groups
          .flatMap(({ positions }) => positions)
          .flatMap(({ athletes }) => athletes)
          .map((athlete) => ({ ...athlete, squad }))
      )
      .filter(
        ({ id }, i, athletes) =>
          selectedAthletes.includes(Number.parseInt(String(id), 10)) &&
          // Remove duplicates.
          athletes.findIndex(({ id: currentId }) => id === currentId) === i
      );

  const [filteredSquads, setFilteredSquads] = useState<Array<SquadData>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  useEffect(() => {
    setFilteredSquads(
      squads
        .map((squad) => ({
          ...squad,
          position_groups: squad.position_groups
            .map((group) => ({
              ...group,
              positions: group.positions
                .map((position) => ({
                  ...position,
                  athletes: position.athletes.filter((athlete) =>
                    athlete.fullname
                      .toLocaleLowerCase()
                      .includes(searchQuery.toLocaleLowerCase())
                  ),
                }))
                .filter(({ athletes }) => athletes.length > 0),
            }))
            .filter(({ positions }) => positions.length > 0),
        }))
        .filter(({ position_groups: groups }) => groups.length > 0)
    );
  }, [searchQuery, squads]);
  const filterAthletes = useDebouncedCallback(setSearchQuery, 200);

  const renderPositions = (positions: Array<any>) =>
    positions.flatMap(({ athletes }) =>
      athletes.map(({ id: athleteId, fullname }) => {
        const idToToggle = Number.parseInt(String(athleteId), 10);

        const onToggle = (e) => {
          // e.target.checked needs to be captured in this closure, otherwise target may be null.
          const checked = e.target.checked;

          setSelectedAthletes((prev) =>
            checked
              ? [...new Set([...prev, idToToggle])]
              : prev.filter((id) => id !== idToToggle)
          );
        };

        return (
          <FormGroup key={athleteId}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedAthletes.includes(idToToggle)}
                  onChange={onToggle}
                  sx={styles.checkbox}
                />
              }
              label={fullname}
              sx={styles.athleteCheckboxLabel}
            />
          </FormGroup>
        );
      })
    );

  const getAthletesInGroup = (
    squadId: number,
    groupId: number
  ): Array<number> =>
    squads
      .filter(({ id }) => id === squadId)
      .flatMap(({ position_groups: groups }) => groups)
      .filter(({ id }) => id === groupId)
      .flatMap(({ positions }) => positions)
      .flatMap(({ athletes }) => athletes)
      .map(({ id }) => Number.parseInt(String(id), 10));
  const renderGroups = (squadId: number, groups: Array<any>) =>
    groups.map(({ id: groupId, name: groupName, positions }, groupIndex) => {
      const group = getAthletesInGroup(squadId, groupId);

      if (!group.length) return null;

      const onSelectGroup = () =>
        setSelectedAthletes((prev) => [
          ...new Set([...prev, ...getAthletesInGroup(squadId, groupId)]),
        ]);

      const onClear = () =>
        setSelectedAthletes((prev) =>
          prev.filter(
            (id) => !getAthletesInGroup(squadId, groupId).includes(id)
          )
        );

      return (
        <Stack key={groupId}>
          <Box>
            <Stack
              direction="row"
              sx={
                typeof styles.getGroupHeader === 'function' &&
                styles.getGroupHeader(groupIndex)
              }
            >
              <DialogContentText sx={styles.groupName}>
                {groupName}
              </DialogContentText>

              <ButtonGroup
                disableElevation
                variant="text"
                sx={styles.groupControls}
              >
                <Button onClick={onSelectGroup} sx={styles.selectGroup}>
                  {t('Select all')}
                </Button>

                <Button onClick={onClear}>{t('Clear')}</Button>
              </ButtonGroup>
            </Stack>

            <Divider sx={styles.groupHeaderDivider} />
          </Box>

          {renderPositions(positions)}
        </Stack>
      );
    });

  const [expandedSquads, setExpandedSquads] = useState<Array<number>>([]);
  const getAthletesInSquad = (squadId: number): Array<number> =>
    squads
      .filter(({ id }) => id === squadId)
      .flatMap(({ position_groups: groups }) => groups)
      .flatMap(({ positions }) => positions)
      .flatMap(({ athletes }) => athletes)
      .map(({ id }) => Number.parseInt(String(id), 10));
  const renderSquads = () =>
    filteredSquads.map(
      ({ id: squadId, name: squadName, position_groups: groups }) => {
        const squad = getAthletesInSquad(squadId);

        if (!squad.length) return null;

        const isSelected =
          squad.length && squad.every((id) => selectedAthletes.includes(id));

        const onToggleAccordion = (_: any, expanded: boolean): void =>
          setExpandedSquads((prev) =>
            expanded ? [...prev, squadId] : prev.filter((n) => n !== squadId)
          );

        const onToggleSquad = ({
          target,
        }: {
          target: {
            checked: boolean,
          },
        }): void => {
          // target.checked needs to be captured in this closure, otherwise target may be null.
          const checked = target.checked;

          setSelectedAthletes((prev) =>
            checked
              ? [...new Set([...prev, ...getAthletesInSquad(squadId)])]
              : prev.filter((id) => !getAthletesInSquad(squadId).includes(id))
          );
        };

        return (
          <Fragment key={squadId}>
            <Divider sx={styles.divider} />
            <Accordion
              expanded={!!searchQuery || expandedSquads.includes(squadId)}
              sx={styles.squad}
              onChange={onToggleAccordion}
            >
              <AccordionSummary
                expandIcon={<KitmanIcon name="ExpandMore" />}
                sx={styles.squadName}
              >
                <DialogContentText>{squadName}</DialogContentText>
              </AccordionSummary>

              <AccordionDetails sx={styles.squadDetails}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={onToggleSquad}
                        sx={styles.checkbox}
                      />
                    }
                    label={`${squadName} (${t('Group')})`}
                    sx={styles.squadCheckboxLabel}
                  />
                </FormGroup>

                {renderGroups(squadId, groups)}
              </AccordionDetails>
            </Accordion>
          </Fragment>
        );
      }
    );

  return (
    <Dialog
      fullScreen
      open={isOpen}
      TransitionComponent={Transition}
      sx={styles.sidePanel}
    >
      <ClickAwayListener onClickAway={onCancel}>
        {/* `Stack` is used instead of `Fragment` because `ClickAwayListener` */}
        {/* attaches to the first (and only) child. */}
        <Stack sx={styles.clickAwayContainer}>
          {(isLoading || isError) && (
            <Stack
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '100rem',
              }}
            >
              {isLoading && !isError && <CircularProgress size={50} />}
              {isError && <AppStatus status="error" isEmbed />}
            </Stack>
          )}
          {!(isLoading || isError) && (
            <>
              <DialogTitle sx={styles.sidePanelTitle}>
                <Stack direction="row" sx={styles.close}>
                  <Box>{title ?? t('Select athletes')}</Box>

                  <IconButton onClick={onCancel}>
                    <KitmanIcon name="Close" />
                  </IconButton>
                </Stack>
              </DialogTitle>

              <DialogContent>
                <TextField
                  fullWidth
                  label={t('Search')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <KitmanIcon name="Search" />
                      </InputAdornment>
                    ),
                  }}
                  sx={styles.search}
                  onChange={({ target }) => filterAthletes(target.value)}
                />

                <DialogContentText variant="body1" sx={styles.squadsTitle}>
                  {t('Squads')}
                </DialogContentText>

                {renderSquads()}
              </DialogContent>

              <DialogActions sx={styles.sidePanelActions}>
                <Button
                  color="secondary"
                  onClick={onCancel}
                  sx={styles.sidePanelCancelButton}
                >
                  {cancelLabel ?? t('Cancel')}
                </Button>

                <Button
                  disabled={
                    !(isEmptySelectionAllowed || selectedAthletes.length)
                  }
                  onClick={() => onConfirm(getSelectedAthletesData())}
                  sx={styles.sidePanelConfirmButton}
                >
                  {confirmLabel ?? t('Confirm')}
                </Button>
              </DialogActions>
            </>
          )}
        </Stack>
      </ClickAwayListener>
    </Dialog>
  );
};

export const AthletesAndStaffSelectorMUITranslated = withNamespaces()(
  AthletesAndStaffSelectorMUI
);
