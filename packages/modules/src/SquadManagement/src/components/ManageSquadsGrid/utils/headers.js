// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

export const NameHeader = {
  id: 'squad',
  row_key: 'squad',
  content: <DefaultHeaderCell title={i18n.t('Name')} />,
};

export const StartSeasonMarkerDate = {
  id: 'start_marker',
  row_key: 'start_marker',
  content: <DefaultHeaderCell title={i18n.t('Start date')} />,
};

export const EndSeasonMarkerDate = {
  id: 'end_marker',
  row_key: 'end_marker',
  content: <DefaultHeaderCell title={i18n.t('End date')} />,
};

export const StateHeader = {
  id: 'state_address',
  row_key: 'state_address',
  content: <DefaultHeaderCell title={i18n.t('State / Province')} />,
};

export const CoachesHeader = {
  id: 'total_coaches',
  row_key: 'total_coaches',
  content: <DefaultHeaderCell title={i18n.t('Coaches')} />,
};

export const PlayersHeader = {
  id: 'total_players',
  row_key: 'total_players',
  content: <DefaultHeaderCell title={i18n.t('Players')} />,
};
