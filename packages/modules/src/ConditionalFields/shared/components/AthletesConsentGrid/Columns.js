// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { ROW_KEY } from '@kitman/modules/src/ConditionalFields/shared/types';
import buildCellContent from '@kitman/modules/src/ConditionalFields/shared/components/AthletesConsentGrid/Cells';

const renderCell = (params: GridRenderCellParams<any>) =>
  buildCellContent({ rowKey: params.field, athlete: params.row });

export const AthleteColumn = {
  field: ROW_KEY.athlete,
  headerName: i18n.t('Athlete'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell,
};

export const SquadsColumn = {
  field: ROW_KEY.squads,
  headerName: i18n.t('Squads'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell,
};

export const ConsentColumn = {
  field: ROW_KEY.consent,
  headerName: i18n.t('Consent'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell,
};

export const ConsentDateColumn = {
  field: ROW_KEY.consent_date,
  headerName: i18n.t('Consent date'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell,
};

export const ConsentActionsColumn = {
  field: ROW_KEY.consent_actions,
  headerName: '',
  visible: true,
  sortable: false,
  renderCell,
};
