// @flow
import i18n from '@kitman/common/src/utils/i18n';

export const getAssignSquadModalTranslations = () => ({
  title: i18n.t('Assign Squad'),
  content: {
    initialText: i18n.t(
      'Assigning one or more players to one or more squads will:'
    ),
    bulletPoints: [
      i18n.t(
        'Add the selected player(s) to the selected squad(s) effective immediately.'
      ),
      i18n.t(
        'Remove the selected player(s) from their current and primary squad(s) effective immediately.'
      ),
    ],
  },
  actions: {
    ctaButton: i18n.t('Assign'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getPrimarySquadConfirmationModalTranslations = () => ({
  assigning: {
    title: i18n.t('Assign primary squad'),
    content: {
      initialText: i18n.t('Assigning primary squad will:'),
      bulletPoints: [
        i18n.t(
          'Assign this squad as the primary squad for all selected player(s).'
        ),
        i18n.t('Remove any current primary squad assignments.'),
      ],
    },
    actions: {
      ctaButton: i18n.t('Assign'),
      cancelButton: i18n.t('Cancel'),
    },
  },
  removing: {
    title: i18n.t('Remove primary squad'),
    content: i18n.t(
      'Removing primary squad will remove this squad as the primary squad for all selected players.'
    ),
    actions: {
      ctaButton: i18n.t('Remove'),
      cancelButton: i18n.t('Cancel'),
    },
  },
});

export const getChangeActiveStatusModalTranslations = (
  isActivating: boolean
) => {
  const inactivating = {
    title: i18n.t('Deactivating Players'),
    content: {
      initialText: i18n.t('Deactivating players will:'),
      bulletPoints: [
        i18n.t('Remove the player(s) from their current roster(s)'),
        i18n.t('Add the player(s) to the inactive tab'),
      ],
    },
    actions: {
      ctaButton: i18n.t('Confirm'),
      cancelButton: i18n.t('Cancel'),
    },
  };
  const activating = {
    title: i18n.t('Activating Players'),
    content: {
      initialText: i18n.t('Activating players will:'),
      bulletPoints: [
        i18n.t('Add the player(s) to the active tab'),
        i18n.t('Assign the player(s) to their squad(s)'),
      ],
    },
    actions: {
      ctaButton: i18n.t('Confirm'),
      cancelButton: i18n.t('Cancel'),
    },
  };
  return isActivating ? activating : inactivating;
};

export const getChangeActiveStatusToastTranslations = (
  isActivating: boolean,
  numberOfAthletes: number
) => ({
  success: {
    title: i18n.t('{{numberOfAthletes}} {{action}}', {
      numberOfAthletes,
      action: isActivating ? i18n.t('activated') : i18n.t('deactivated'),
    }),
  },
  error: {
    title: i18n.t('Failed to {{action}} players. Please try again ', {
      action: isActivating ? i18n.t('activate') : i18n.t('deactivate'),
    }),
  },
});
