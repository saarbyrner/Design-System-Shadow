// @flow
import type { Squad } from '@kitman/common/src/types/__common';
import type { Permissions } from '@kitman/common/src/types/Permissions';
import type { Modules } from '@kitman/common/src/types/Modules';
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetDashboardGroupsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { DesktopMenuTranslated as DesktopMenu } from '../../../DesktopMenu';
import { MobileMenuTranslated as MobileMenu } from '../../../MobileMenu';

type Props = {
  locale: string,
  helpPath: string,
  permissions: Permissions,
  modules: Modules,
  logoPath: string,
  logoPathRetina: string,
  currentUser: Object,
  currentSquad: ?Squad,
  availableSquads: Array<Squad>,
  orgNickname: string,
  powerBiReports: Array<{ id: number, name: string }>,
};

const App = (props: Props) => {
  const { isLoading: isUserLoading, isError: isUserError } =
    useGetCurrentUserQuery();
  const { isLoading: isOrganisationLoading, isError: isOrganisationError } =
    useGetOrganisationQuery();
  const { data: dashboardGroups } = useGetDashboardGroupsQuery();

  if (isUserLoading || isOrganisationLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (isUserError || isOrganisationError) {
    return <AppStatus status="error" isEmbed />;
  }

  return (
    <>
      <div
        className={
          window.featureFlags['ip-login-branding']
            ? 'ip-mainNavBar'
            : 'mainNavBar'
        }
      >
        <DesktopMenu
          logoPath={props.logoPath}
          logoPathRetina={props.logoPathRetina}
          orgNickname={props.orgNickname}
          helpPath={props.helpPath}
          permissions={props.permissions}
          modules={props.modules}
          currentUser={props.currentUser}
          powerBiReports={props.powerBiReports}
          dashboardGroups={dashboardGroups}
        />
        <MobileMenu
          orgNickname={props.orgNickname}
          locale={props.locale}
          helpPath={props.helpPath}
          permissions={props.permissions}
          modules={props.modules}
          logoPath={props.logoPath}
          logoPathRetina={props.logoPathRetina}
          currentUser={props.currentUser}
          currentSquad={props.currentSquad}
          availableSquads={props.availableSquads}
          powerBiReports={props.powerBiReports}
          dashboardGroups={dashboardGroups}
        />
      </div>
    </>
  );
};

export default App;
