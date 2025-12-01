// @flow
import i18n from '@kitman/common/src/utils/i18n';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

export const UploadFirstNameHeader = {
  id: 'FirstName',
  row_key: 'FirstName',
  content: <DefaultHeaderCell title={i18n.t('FirstName')} />,
};

export const UploadLastNameHeader = {
  id: 'LastName',
  row_key: 'LastName',
  content: <DefaultHeaderCell title={i18n.t('LastName')} />,
};

export const UploadEmailHeader = {
  id: 'Email',
  row_key: 'Email',
  content: <DefaultHeaderCell title={i18n.t('Email')} />,
};
export const UploadDOBHeader = {
  id: 'DOB',
  row_key: 'DOB',
  content: <DefaultHeaderCell title={i18n.t('DOB')} />,
};

export const UploadSquadNameHeader = {
  id: 'SquadName',
  row_key: 'SquadName',
  content: <DefaultHeaderCell title={i18n.t('SquadName')} />,
};

export const UploadLanguageHeader = {
  id: 'Language',
  row_key: 'Language',
  content: <DefaultHeaderCell title={i18n.t('Language')} />,
};

export const AthleteIdHeader = {
  id: 'athlete_id',
  row_key: 'athlete_id',
  content: <DefaultHeaderCell title={i18n.t('Athlete Id')} />,
};

export const AthleteFirstnameHeader = {
  id: 'athlete_first_name',
  row_key: 'athlete_first_name',
  content: <DefaultHeaderCell title={i18n.t('Athlete FirstName')} />,
};

export const AthleteLastnameHeader = {
  id: 'athlete_last_name',
  row_key: 'athlete_last_name',
  content: <DefaultHeaderCell title={i18n.t('Athlete LastName')} />,
};

export const AthleteSquadHeader = {
  id: 'squad',
  row_key: 'squad',
  content: <DefaultHeaderCell title={i18n.t('Squad')} />,
};
