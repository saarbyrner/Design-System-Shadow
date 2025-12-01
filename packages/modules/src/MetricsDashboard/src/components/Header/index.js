// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import { GroupedDropdown, IconButton, PageHeader } from '@kitman/components';
import type { Template as DashboardTemplate } from '@kitman/modules/src/DashboardTemplates/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import DashboardControls from '../DashboardControls';
import DashboardFilters from '../../containers/DashboardFilters';

type Props = {
  athleteFilters: string,
  alarmFilters: string,
  groupBy: string,
  dashboards: DashboardTemplate[],
  currentDashboardId: number,
  showAddNewStatusModal: () => void,
  switchDashboard: (dashboardId: string) => void,
  canManageDashboard: boolean,
  addedStatusCount: number,
  isFilterShown: boolean,
  toggleDashboardFilters: (boolean) => void,
  isFilteringOn: boolean,
};

const getDashboardOptions = (props) => {
  const dashboardOptions = [];

  const organisations = props.dashboards.map((option) => option.organisation);
  const dashboardOrganizations = Array.from(
    organisations.reduce((m, t) => m.set(t.id, t), new Map()).values()
  );

  let currentGroupName = dashboardOrganizations[0].name;
  const sortedOrganisations = [currentGroupName];
  const unsortedDashboards = {};
  unsortedDashboards[currentGroupName] = [];

  props.dashboards.forEach((dashboard) => {
    if (currentGroupName !== dashboard.organisation.name) {
      currentGroupName = dashboard.organisation.name;
      sortedOrganisations[sortedOrganisations.length] = currentGroupName;
      unsortedDashboards[currentGroupName] = [];
    }

    unsortedDashboards[currentGroupName].push({
      name: dashboard.name,
      key_name: dashboard.id.toString(),
      isGroupOption: false,
    });
  });

  sortedOrganisations.forEach((organisation, index) => {
    if (sortedOrganisations.length > 1) {
      dashboardOptions.push({
        name: organisation,
        key_name: `group${index}`,
        isGroupOption: true,
      });
    }
    unsortedDashboards[organisation].sort((dashboard1, dashboard2) =>
      dashboard1.name.localeCompare(dashboard2.name)
    );
    unsortedDashboards[organisation].forEach((sortedDashboard) => {
      dashboardOptions.push(sortedDashboard);
    });
  });

  return dashboardOptions;
};

const Header = (props: I18nProps<Props>) => {
  const dashboardOptions = getDashboardOptions(props) || [];

  const getSettingsBtn = () =>
    props.canManageDashboard ? (
      <a href="/dashboards/templates">
        <IconButton icon="icon-settings" />
      </a>
    ) : null;

  const classes = classNames('dashboardHeader', {
    'dashboardHeader--expanded': props.isFilterShown === true,
  });

  let printHref = `?print=true&groupBy=${props.groupBy}`;

  if (props.alarmFilters.length) {
    printHref += `&alarmFilters=${props.alarmFilters}`;
  }

  if (props.athleteFilters.length) {
    printHref += `&athleteFilters=${props.athleteFilters}`;
  }

  return (
    <PageHeader>
      <div className={classes}>
        <div className="row dashboardHeader__inner">
          <div className="dashboardHeader__dashboardSelectContainer">
            <GroupedDropdown
              options={dashboardOptions}
              // eslint-disable-next-line camelcase
              onChange={({ key_name }) => props.switchDashboard(key_name)}
              value={props.currentDashboardId.toString()}
            />
          </div>
          <div className="dashboardHeader__searchContainer">
            <div className="dashboardHeader__searchContainerInner">
              <DashboardControls />
            </div>
          </div>

          <div className="dashboardHeader__secondaryActionsBtn">
            {getSettingsBtn()}
            <a href={printHref} target="_blank" rel="noopener noreferrer">
              <IconButton icon="icon-print" />
            </a>
            <IconButton
              icon="icon-filter"
              isActive={props.isFilteringOn}
              onClick={() => props.toggleDashboardFilters(props.isFilterShown)}
            />
          </div>
        </div>
        <DashboardFilters />
      </div>
    </PageHeader>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
