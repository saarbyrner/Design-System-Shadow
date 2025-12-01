// @flow
import { useDispatch, useSelector } from 'react-redux';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { DisciplinaryIssueModalTranslated as DisciplinaryIssueModal } from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplinaryIssueModal';
import { DisciplinaryIssuePanelTranslated as DisciplinaryIssuePanel } from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplinaryIssuePanel';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import {
  onSetDisciplineProfile,
  onSetDisciplinaryIssueDetails,
  onSetUserToBeDisciplined,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { ProfileHeaderTranslated as ProfileHeader } from '@kitman/modules/src/LeagueOperations/DisciplineProfileApp/src/components/ProfileHeader';
import DisciplineProfileTabs from './components/DisciplineProfileTabs';

type Props = {
  isLoading: boolean,
};

const DisciplineProfileApp = (props: Props) => {
  const profile = useSelector(getProfile);
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );
  const dispatch = useDispatch();

  // TODO: this is re-used functionality, the dispatches will be consolidated later.
  const setDisciplinaryIssueData = () => {
    dispatch(
      onSetDisciplineProfile({
        profile: {
          name: `${profile.firstname} ${profile.lastname}`,
          user_id: profile.id,
          squads: profile.squads,
        },
      })
    );
    // Set the user to be disciplined, required for the panel
    // to display the correct user information
    dispatch(
      onSetUserToBeDisciplined({
        userToBeDisciplined: {
          name: `${profile.firstname} ${profile.lastname}`,
          user_id: profile.id,
          squads: profile.squads,
        },
      })
    );

    // set user_id in the disciplinary issue details, required for all cases. For
    // example, when creating a new issue, editing and on row click
    dispatch(
      onSetDisciplinaryIssueDetails({
        user_id: profile.id,
      })
    );
  };

  if (props.isLoading || !profile) {
    return (
      <PageLayout>
        <PageLayout.Content>
          <HeaderLayout.Loading withTabs withAvatar />
        </PageLayout.Content>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {profile && (
        <ProfileHeader
          isLoading={props.isLoading}
          user={profile}
          suspendAction={setDisciplinaryIssueData}
        />
      )}
      <DisciplineProfileTabs currentUserType={currentUserType} />
      <DisciplinaryIssueModal />
      <DisciplinaryIssuePanel userType={currentUserType} />
    </PageLayout>
  );
};

export default DisciplineProfileApp;
