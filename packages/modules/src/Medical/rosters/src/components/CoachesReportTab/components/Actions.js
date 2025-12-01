// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import {
  Button,
  CircularProgress,
  Typography,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { rootTheme } from '@kitman/playbook/themes';
import { getMultipleCoachesNotes } from '@kitman/services/src/services/medical';
import { ReportManagerTranslated as ReportManager } from './ReportManager';
import type { CoachesFilters } from '../index';

const style = {
  actionButtons: css`
    margin: 0;
    display: flex;
    gap: 4px;
  `,
};

type Props = {
  canExport: boolean,
  filters: CoachesFilters,
  dataGridCurrentDate: string,
  coachesReportV2Enabled?: boolean,
  rehydrateGrid: () => void,
  canCreateNotes?: boolean,
};

const Actions = (props: I18nProps<Props>) => {
  const [copyLastReportIsGenerating, setCopyLastReportIsGenerating] =
    useState<boolean>(false);
  const {
    coachesReportV2Enabled = false,
    canExport,
    dataGridCurrentDate,
    filters,
    rehydrateGrid,
    canCreateNotes,
    t,
  } = props;

  const handleCopyLastReport = () => {
    setCopyLastReportIsGenerating(true);
    getMultipleCoachesNotes(
      [],
      ['OrganisationAnnotationTypes::DailyStatusNote'],
      dataGridCurrentDate
    ).then(() => {
      setCopyLastReportIsGenerating(false);
      rehydrateGrid();
    });
  };

  return (
    <div css={style.actionButtons}>
      {canExport && <ReportManager squads={filters.squads} />}
      {coachesReportV2Enabled && canCreateNotes && (
        <Button
          disabled={copyLastReportIsGenerating}
          sx={{ height: '2.8rem' }}
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleCopyLastReport}
        >
          <Typography
            fontWeight={500}
            sx={{
              color: rootTheme.palette.text.secondary,
              padding: '0',
              whiteSpace: 'nowrap',
            }}
          >
            {t('Copy last report')}
          </Typography>

          {copyLastReportIsGenerating && (
            <CircularProgress
              color="inherit"
              size={18}
              sx={{ marginLeft: '0.5rem' }}
            />
          )}
        </Button>
      )}
    </div>
  );
};

export const ActionsTranslated = withNamespaces()(Actions);
export default Actions;
