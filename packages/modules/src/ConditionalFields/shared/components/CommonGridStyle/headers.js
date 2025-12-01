// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { DefaultHeaderCell, CheckboxHeaderCell } from '../Cells';
import { ROW_KEY } from '../../types';

export const NameHeader = {
  id: ROW_KEY.name,
  row_key: ROW_KEY.name,
  content: <DefaultHeaderCell title={i18n.t('Name')} />,
};

export const PublishedAtHeader = {
  id: ROW_KEY.published_at,
  row_key: ROW_KEY.published_at,
  content: <DefaultHeaderCell title={i18n.t('Published on')} />,
};

export const VersionHeader = {
  id: ROW_KEY.version,
  row_key: ROW_KEY.version,
  content: <DefaultHeaderCell title={i18n.t('Version')} />,
};

export const StatusHeader = {
  id: ROW_KEY.status,
  row_key: ROW_KEY.status,
  content: <DefaultHeaderCell title={i18n.t('Status')} />,
};

export const SquadsHeader = {
  id: ROW_KEY.squads,
  row_key: ROW_KEY.squads,
  content: <DefaultHeaderCell title={i18n.t('Squads')} />,
};

export const SquadHeader = {
  id: ROW_KEY.squad,
  row_key: ROW_KEY.squad,
  content: <DefaultHeaderCell title={i18n.t('Squad')} />,
};

export const ActivePlayersHeader = {
  id: ROW_KEY.active_players,
  row_key: ROW_KEY.active_players,
  content: <DefaultHeaderCell title={i18n.t('Active players')} />,
};

export const AssignedHeader = (
  editMode: boolean,
  checked: boolean,
  indeterminate: boolean,
  onChange: Function
) => {
  return {
    id: ROW_KEY.assigned,
    row_key: ROW_KEY.assigned,
    content: (
      <CheckboxHeaderCell
        title={i18n.t('Assigned')}
        editMode={editMode}
        checked={checked}
        indeterminate={indeterminate}
        onChange={onChange}
      />
    ),
  };
};

export const AssignedDateHeader = {
  id: ROW_KEY.assigned_date,
  row_key: ROW_KEY.assigned_date,
  content: <DefaultHeaderCell title={i18n.t('Assigned date')} />,
};
