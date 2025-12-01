// @flow
import i18n from '@kitman/common/src/utils/i18n';

type GetResetPasswordModalTranslations = {
  athleteName: string,
  athleteUsername: string,
};

export const getResetPasswordModalTranslations = ({
  athleteName,
  athleteUsername,
}: GetResetPasswordModalTranslations) => ({
  title: i18n.t('Reset Password for {{athleteName}} ({{athleteUsername}})', {
    athleteName,
    athleteUsername,
  }),
  content: {
    text: i18n.t(
      'Are you sure you want to reset the password for this athlete? The reset instructions will be sent to the email address below.'
    ),
    inputLabel: i18n.t('Email'),
  },
  actions: {
    ctaButton: i18n.t('Reset Password'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getResetPasswordToastTranslations = () => ({
  success: i18n.t('Successfully reset password'),
  error: i18n.t('Encountered an error while trying to reset password'),
});
