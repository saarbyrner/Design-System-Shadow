// @flow
import { withNamespaces, setI18n } from 'react-i18next';
import { BreadCrumb, PageHeader } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';

import type { Dashboard } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  dashboards: Array<Dashboard>,
  currentDashboard: Dashboard,
};

// set the i18n instance
setI18n(i18n);

const Header = (props: I18nProps<Props>) => {
  const dropdownItems = props.dashboards
    .sort((dashboard1, dashboard2) =>
      dashboard1.name.localeCompare(dashboard2.name)
    )
    .map((dashboard) => ({
      label: dashboard.name,
      url: `/dashboards/${dashboard.id}/edit`,
    }));

  return (
    <PageHeader>
      <div className="row">
        <BreadCrumb>
          <BreadCrumb.MenuLink
            label={
              window.featureFlags['side-nav-update']
                ? props.t('Athlete Metrics')
                : props.t('Dashboard')
            }
            url={`/dashboards/${props.currentDashboard.id}`}
          />
          <BreadCrumb.MenuLink
            label={
              window.featureFlags['side-nav-update']
                ? props.t('Settings')
                : props.t('Dashboard Manager')
            }
            url="/dashboards/templates"
          />
          <BreadCrumb.TooltipDropdown
            dropdownItems={dropdownItems}
            selectedMenuItemName={props.currentDashboard.name}
            isDisabled={false}
          />
        </BreadCrumb>
      </div>
    </PageHeader>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
