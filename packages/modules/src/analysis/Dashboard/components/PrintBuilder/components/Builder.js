// @flow
import { type ComponentType, useMemo, useState, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid2 as Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type {
  WidgetData,
  User,
} from '@kitman/modules/src/analysis/Dashboard/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { PDFRenderTranslated as PDFRender } from './PDFRender';
import { SettingsFormTranslated as SettingsForm } from './SettingsForm';
import { PageLayoutBuilderTranslated as PageLayoutBuilder } from './PageLayoutBuilder';
import { useSettings } from './SettingsContext';
import { getPages } from '../utils';
import { MM_TO_PX, PAGE_DIMENSIONS_MM } from '../constants';
import type { PrintLayout } from '../types';
import useLayoutStateManager from '../hooks/useLayoutStateManager';

const styles = {
  flexGrow: css`
    flex-grow: 1;
  `,
  formControl: css`
    max-width: 300px;
  `,
};

export type Props = {
  dashboardName: string,
  close: Function,
  widgets: Array<WidgetData>,
  dashboardPrintLayout: PrintLayout,
  onUpdateDashboardPrintLayout: Function,
  squadAthletes: SquadAthletes,
  squads: Array<Squad>,
  annotationTypes: Array<Object>,
  appliedSquadAthletes?: SquadAthletesSelection,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  currentUser: User,
};

function Builder(props: I18nProps<Props>) {
  const {
    settings: { orientation, size },
  } = useSettings();
  const { pageWidthMm, pageHeightMm } = useMemo(() => {
    const width = orientation === 'portrait' ? 'short' : 'long';
    const height = orientation === 'portrait' ? 'long' : 'short';

    return {
      pageWidthMm: PAGE_DIMENSIONS_MM[size][width],
      pageHeightMm: PAGE_DIMENSIONS_MM[size][height],
    };
  }, [orientation, size]);
  const pageHeightPx = pageHeightMm * MM_TO_PX;
  const pageWidthPx = pageWidthMm * MM_TO_PX;
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const hasClickedBackButton = useRef(false);

  const {
    localPrintLayouts,
    localPrintLayoutIndex,
    saveChanges,
    undoChanges,
    redoChanges,
    updatePreview,
    resetLayout,
    hasChanges,
    hasUndoChanges,
    hasRedoChanges,
  } = useLayoutStateManager({
    dashboardPrintLayout: props.dashboardPrintLayout,
    onUpdateLayout: props.onUpdateDashboardPrintLayout,
  });

  const localPages = useMemo(
    () =>
      getPages({
        pageWidthPx,
        pageHeightPx,
        dashboardWidgets: props.widgets,
        printLayout: localPrintLayouts[localPrintLayoutIndex],
      }),
    [
      pageWidthPx,
      pageHeightPx,
      props.widgets,
      localPrintLayouts,
      localPrintLayoutIndex,
    ]
  );
  const persistedPages = useMemo(
    () =>
      getPages({
        pageWidthPx,
        pageHeightPx,
        dashboardWidgets: props.widgets,
        printLayout: props.dashboardPrintLayout,
      }),
    [pageWidthPx, pageHeightPx, props.widgets, props.dashboardPrintLayout]
  );

  return (
    <>
      <Box css={styles.flexGrow}>
        <Button
          css={css`
            margin-left: 24px;
          `}
          startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />}
          variant="text"
          onClick={() => {
            if (hasChanges) {
              hasClickedBackButton.current = true;
              setIsCancelModalOpen(true);
            } else {
              props.close();
            }
          }}
        >
          {props.t('Back')}
        </Button>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Box css={styles.flexGrow}>
              <Typography variant="h4" component="div">
                {props.dashboardName}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid xs={5}>
            <Card>
              <Typography variant="h6" padding={2}>
                {props.t('Settings')}
              </Typography>
              <SettingsForm />

              <Typography
                variant="h6"
                padding={2}
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                {props.t('Layout')}
                <Stack direction="row" gap={1}>
                  <Button
                    onClick={undoChanges}
                    variant="text"
                    disabled={!hasUndoChanges}
                  >
                    {props.t('Undo')}
                  </Button>

                  <Button
                    onClick={redoChanges}
                    variant="text"
                    disabled={!hasRedoChanges}
                  >
                    {props.t('Redo')}
                  </Button>

                  <Button
                    onClick={() => setIsResetModalOpen(true)}
                    disabled={!hasChanges}
                  >
                    {props.t('Reset')}
                  </Button>

                  <Button onClick={saveChanges} disabled={!hasChanges}>
                    {props.t('Save')}
                  </Button>
                </Stack>
              </Typography>
              <PageLayoutBuilder
                pageWidth={pageWidthMm}
                pageHeight={pageHeightMm}
                pageHeightPx={pageHeightPx}
                pageWidthPx={pageWidthPx}
                pages={localPages}
                onUpdateLayout={updatePreview}
              />
            </Card>
          </Grid>
          <Grid xs={7}>
            <PDFRender
              hasChanges={hasChanges}
              pages={persistedPages}
              pageWidth={pageWidthPx}
              pageHeight={pageHeightPx}
              squads={props.squads}
              annotationTypes={props.annotationTypes}
              appliedSquadAthletes={props.appliedSquadAthletes}
              pivotedDateRange={props.pivotedDateRange}
              pivotedTimePeriod={props.pivotedTimePeriod}
              pivotedTimePeriodLength={props.pivotedTimePeriodLength}
              currentUser={props.currentUser}
              squadAthletes={props.squadAthletes}
              dashboardPrintLayout={props.dashboardPrintLayout}
              dashboardTitle={props.dashboardName}
            />
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.t('Unsaved Changes')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.t(
              'You have unsaved changes. Are you sure you want to discard changes? Unsaved changes will be lost'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsCancelModalOpen(false);
              hasClickedBackButton.current = false;
            }}
            variant="text"
          >
            {props.t('Cancel')}
          </Button>

          <Button
            onClick={() => {
              resetLayout();
              setIsCancelModalOpen(false);
              if (hasClickedBackButton.current) {
                props.close();
              }
            }}
            autofocus
          >
            {props.t('Discard changes')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.t('Reset layout')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.t(
              'Are you sure you want to discard changes? All changes will be lost'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsResetModalOpen(false);
              hasClickedBackButton.current = false;
            }}
            variant="text"
          >
            {props.t('Cancel')}
          </Button>

          <Button
            onClick={() => {
              resetLayout();
              setIsResetModalOpen(false);
              if (hasClickedBackButton.current) {
                props.close();
              }
            }}
            autoFocus
          >
            {props.t('Discard changes')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const BuilderTranslated: ComponentType<Props> =
  withNamespaces()(Builder);
export default Builder;
