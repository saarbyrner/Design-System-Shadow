/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Alert } from '@kitman/playbook/components';
import { DelayedLoadingFeedback } from '@kitman/components';
import type { UserData } from '@kitman/services/src/services/fetchUserData';
import { getUserProfile } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import { getFormState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';

import { getOrganisation } from '@kitman/common/src/redux/global/selectors';

import { MovementFromSelectTranslated as MovementFromSelect } from '../MovementFromSelect';

const CreateReleaseMovement = (props: I18nProps<{}>): Node => {
  const { user_id } = useSelector(getFormState);

  const currentOrganisation = useSelector(getOrganisation());

  const profile: UserData = useSelector(
    getUserProfile({
      userId: user_id,
      include_athlete: true,
    })
  );

  const isAssociationAthlete =
    (profile?.athlete?.organisations?.length || 0) < 2 &&
    profile?.athlete?.organisations?.some(
      (org) => org.id === currentOrganisation.id
    );

  const renderIsAssociationAthleteMessage = () => {
    return (
      <Alert severity="info">
        {props.t('This athlete has no club to be released from.')}
      </Alert>
    );
  };

  const renderContent = () => {
    if (isAssociationAthlete === undefined) {
      return <DelayedLoadingFeedback />;
    }
    if (isAssociationAthlete) {
      return renderIsAssociationAthleteMessage();
    }
    return <MovementFromSelect />;
  };

  return renderContent();
};

export default CreateReleaseMovement;
export const CreateReleaseMovementTranslated = withNamespaces()(
  CreateReleaseMovement
);
