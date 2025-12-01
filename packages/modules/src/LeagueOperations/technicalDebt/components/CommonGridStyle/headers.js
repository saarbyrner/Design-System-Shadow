// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

// TODO: Move all headers to packages/modules/src/shared/MassUpload/utils/massUploadHeaders
export const PlayerNameHeader = {
  id: 'full_name',
  row_key: 'full_name',
  content: <DefaultHeaderCell title={i18n.t('Player')} />,
};

export const CoachNameHeader = {
  id: 'full_name',
  row_key: 'full_name',
  content: <DefaultHeaderCell title={i18n.t('Coach')} />,
};

export const ClubHeader = {
  id: 'club',
  row_key: 'club',
  content: <DefaultHeaderCell title={i18n.t('Club')} />,
};

export const TeamHeader = {
  id: 'squad',
  row_key: 'squad',
  content: <DefaultHeaderCell title={i18n.t('Team')} />,
};

export const LocationHeader = {
  id: 'location',
  row_key: 'location',
  content: <DefaultHeaderCell title={i18n.t('State / Province')} />,
};

export const DOBHeader = {
  id: 'dob',
  row_key: 'dob',
  content: <DefaultHeaderCell title={i18n.t('DOB')} />,
};

export const StatusHeader = {
  id: 'status',
  row_key: 'status',
  content: <DefaultHeaderCell title={i18n.t('Status')} />,
};

export const IdNumberHeader = {
  id: 'id_number',
  row_key: 'id_number',
  content: <DefaultHeaderCell title={i18n.t('ID Number')} />,
};

export const CoachCountHeader = {
  id: 'coaches',
  row_key: 'coaches',
  content: <DefaultHeaderCell title={i18n.t('Coaches')} />,
};

export const PlayerCountHeader = {
  id: 'players',
  row_key: 'players',
  content: <DefaultHeaderCell title={i18n.t('Players')} />,
};

export const OrganisationNameHeader = {
  id: 'organisation_name',
  row_key: 'organisation_name',
  content: <DefaultHeaderCell title={i18n.t('Club')} />,
};

export const TotalTeamsHeader = {
  id: 'total_teams',
  row_key: 'total_teams',
  content: <DefaultHeaderCell title={i18n.t('Total Teams')} />,
};

export const TotalStaffHeader = {
  id: 'total_staff',
  row_key: 'total_staff',
  content: <DefaultHeaderCell title={i18n.t('Total Staff')} />,
};

export const TotalPlayersHeader = {
  id: 'total_players',
  row_key: 'total_players',
  content: <DefaultHeaderCell title={i18n.t('Total Players')} />,
};

export const UnpaidBalanceHeader = {
  id: 'unpaid_balance',
  row_key: 'unpaid_balance',
  content: <DefaultHeaderCell title={i18n.t('Unpaid Balance')} />,
};

export const RequirementHeader = {
  id: 'requirement',
  row_key: 'requirement',
  content: <DefaultHeaderCell title={i18n.t('Requirement')} />,
};

export const AttachmentHeader = {
  id: 'attachment_header',
  row_key: 'attachment_header',
  content: <DefaultHeaderCell title={i18n.t('Attachment')} centered />,
};

export const AdminStaffNoteHeader = {
  id: 'admin_staff_note',
  row_key: 'admin_staff_note',
  content: <DefaultHeaderCell title={i18n.t('Note')} centered />,
};

export const RequirementsGridHeaders = [
  RequirementHeader,
  AdminStaffNoteHeader,
  StatusHeader,
];

export const OrganisationGridHeaders = [
  OrganisationNameHeader,
  TotalTeamsHeader,
  TotalStaffHeader,
  TotalPlayersHeader,
  LocationHeader,
  UnpaidBalanceHeader,
];

export const OfficialNameHeader = {
  id: 'fullname',
  row_key: 'fullname',
  content: <DefaultHeaderCell title={i18n.t('Name')} />,
};

export const OfficialUsernameHeader = {
  id: 'username',
  row_key: 'username',
  content: <DefaultHeaderCell title={i18n.t('Username')} />,
};

export const OfficialEmailHeader = {
  id: 'email',
  row_key: 'email',
  content: <DefaultHeaderCell title={i18n.t('Email')} />,
};

export const OfficialCreationDateHeader = {
  id: 'created_at',
  row_key: 'created_at',
  content: <DefaultHeaderCell title={i18n.t('Creation Date')} />,
};

export const OfficialActiveHeader = {
  id: 'is_active',
  row_key: 'is_active',
  content: <DefaultHeaderCell title={i18n.t('Status')} />,
};

export const EditHeader = {
  id: 'edit',
  row_key: 'edit',
  content: <DefaultHeaderCell title={null} />,
};

export const OfficialManagementHeaders = [
  OfficialNameHeader,
  OfficialUsernameHeader,
  OfficialEmailHeader,
  OfficialCreationDateHeader,
  EditHeader,
];

export const ScoutNameHeader = {
  id: 'fullname',
  row_key: 'fullname',
  content: <DefaultHeaderCell title={i18n.t('Name')} />,
};

export const ScoutUsernameHeader = {
  id: 'username',
  row_key: 'username',
  content: <DefaultHeaderCell title={i18n.t('Username')} />,
};

export const ScoutEmailHeader = {
  id: 'email',
  row_key: 'email',
  content: <DefaultHeaderCell title={i18n.t('Email')} />,
};

export const ScoutCreationDateHeader = {
  id: 'created_at',
  row_key: 'created_at',
  content: <DefaultHeaderCell title={i18n.t('Creation Date')} />,
};

export const ScoutActiveHeader = {
  id: 'is_active',
  row_key: 'is_active',
  content: <DefaultHeaderCell title={i18n.t('Status')} />,
};

export const ScoutManagementHeaders = [
  ScoutNameHeader,
  ScoutUsernameHeader,
  ScoutEmailHeader,
  ScoutCreationDateHeader,
  EditHeader,
];
