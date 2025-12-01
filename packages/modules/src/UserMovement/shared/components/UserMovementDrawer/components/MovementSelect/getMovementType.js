// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  TRADE,
  MULTI_ASSIGN,
  RELEASE,
  MEDICAL_TRIAL,
  MEDICAL_TRIAL_V2,
  LOAN,
} from '@kitman/modules/src/UserMovement/shared/constants/index';

type Props = {
  isAssociationAdmin: boolean,
  userMovementPermissions: { [key: string]: any },
  isPastPlayer: ?boolean,
};

const getMovementType = (props: Props) => {
  const release = {
    value: RELEASE,
    label: i18n.t('Release'),
    isVisible:
      window.featureFlags['league-ops-player-movement-release'] &&
      props.userMovementPermissions.player.release,
  };

  const associationTypeOptions: any = [
    {
      value: TRADE,
      label: i18n.t('Move Player'),
      isVisible:
        window.featureFlags['league-ops-player-movement-trade'] &&
        props.userMovementPermissions.player.trade,
    },
    release,
  ]
    .filter((i) => i.isVisible)
    .map(({ isVisible, ...attrs }) => attrs);

  const organisationTypeOptions: any = [
    {
      value: MEDICAL_TRIAL,
      label: i18n.t('Medical Trial'),
      isVisible:
        !props.isPastPlayer &&
        window.featureFlags['league-ops-player-movement-medical-trial'] &&
        props.userMovementPermissions.player.medicalTrial,
    },
    {
      value: MEDICAL_TRIAL_V2,
      label: i18n.t('Medical Trial'),
      isVisible:
        props.isPastPlayer &&
        window.getFlag('past-athletes-medical-trial') &&
        props.userMovementPermissions.player.medicalTrial,
    },
    {
      value: MULTI_ASSIGN,
      label: i18n.t('Move Player'),
      isVisible:
        window.featureFlags['league-ops-player-movement-trade'] &&
        props.userMovementPermissions.player.trade,
    },
    release,
    { value: LOAN, label: i18n.t('Loan'), isVisible: false },
  ]
    .filter((i) => i && i?.isVisible)
    .map(({ isVisible, ...attrs }) => attrs);

  return props.isAssociationAdmin
    ? associationTypeOptions
    : organisationTypeOptions;
};

export default getMovementType;
