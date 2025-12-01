// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

export const roleOptions = [
  {
    value: 'official',
    label: i18n.t('Official'),
  },
  {
    value: 'scout',
    label: i18n.t('Scout'),
  },
  {
    value: 'match_director',
    label: i18n.t('Match director'),
  },
  {
    value: 'match_monitor',
    label: i18n.t('Match monitor'),
  },
];

export const statusOptions = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' },
];

const AdditionalUserNameHeader = {
  id: 'fullname',
  row_key: 'fullname',
  content: <DefaultHeaderCell title={i18n.t('Name')} />,
};

const AdditionalUserUsernameHeader = {
  id: 'username',
  row_key: 'username',
  content: <DefaultHeaderCell title={i18n.t('Username')} />,
};

const AdditionalUserEmailHeader = {
  id: 'email',
  row_key: 'email',
  content: <DefaultHeaderCell title={i18n.t('Email')} />,
};

const AdditionalUserRoleHeader = {
  id: 'type',
  row_key: 'type',
  content: <DefaultHeaderCell title={i18n.t('Role')} />,
};

const AdditionalUserCreationDateHeader = {
  id: 'created_at',
  row_key: 'created_at',
  content: <DefaultHeaderCell title={i18n.t('Creation Date')} />,
};

export const FormTitle = {
  NEW: {
    official: i18n.t('Create official'),
    scout: i18n.t('Create scout'),
    match_director: i18n.t('Create match director'),
    match_monitor: i18n.t('Create match monitor'),
  },
  EDIT: {
    official: i18n.t('Edit official'),
    scout: i18n.t('Edit scout'),
    match_director: i18n.t('Edit match director'),
    match_monitor: i18n.t('Edit match monitor'),
  },
};

export const RoleOptions = [
  { label: i18n.t('Scout'), value: 'scout' },
  { label: i18n.t('Official'), value: 'official' },
  { label: i18n.t('Match director'), value: 'match_director' },
  { label: i18n.t('Match monitor'), value: 'match_monitor' },
];

const EditHeader = {
  id: 'edit',
  row_key: 'edit',
  content: <DefaultHeaderCell title={null} />,
};

export const AdditionalUserManagementHeaders = [
  AdditionalUserNameHeader,
  AdditionalUserUsernameHeader,
  AdditionalUserRoleHeader,
  AdditionalUserEmailHeader,
  AdditionalUserCreationDateHeader,
  EditHeader,
];
