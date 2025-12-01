// @flow
import { TooltipMenu, Select } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import { localeSortByField } from '@kitman/common/src/utils/localeSort';
import type { Dashboard } from '@kitman/modules/src/analysis/shared/types';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { colors } from '@kitman/common/src/variables';

type Props = {
  locale: string,
  dashboardList: Array<Dashboard>,
  selectedDashboard: Dashboard,
};

const DashboardSelector = (props: Props) => {
  const allowAnalyticalDashboardSearchBar =
    window.getFlag('rep-analytical-dashboard-search-bar');

  const locationAssign = useLocationAssign();

  const getMenuItems = () =>
    localeSortByField(
      props.dashboardList.map((dashboard) => ({
        description: dashboard.name,
        href: `/analysis/dashboard/${dashboard.id}`,
        isSelected: dashboard.id === props.selectedDashboard.id,
      })),
      'description',
      props.locale
    );

  const getDashboardSelectOptions = () =>
    localeSortByField(
      props.dashboardList.map((dashboard) => ({
        label: dashboard.name,
        value: { name: dashboard.name, id: dashboard.id },
      })),
      'label',
      props.locale
    );

  const handleDashboardSelectOnChange = (selectedDashboard) => {
    locationAssign(`/analysis/dashboard/${selectedDashboard.id}`);
  };

  return allowAnalyticalDashboardSearchBar ? (
    <Select
      options={getDashboardSelectOptions()}
      onChange={handleDashboardSelectOnChange}
      placeholder="Select"
      customSelectStyles={{
        menu: (base) => ({ ...base, minWidth: '290px' }),
        control: (base) => ({
          ...base,
          backgroundColor: `${colors.white} !important`,
          borderColor: `${colors.white} !important`,
          boxShadow: 'none !important',
        }),
      }}
      renderControl={() => {
        return (
          <h3
            className="analyticalDashboard__title"
            onClick={() =>
              TrackEvent(
                'Graph Dashboard',
                'Click',
                'Open Dashboard List Dropdown'
              )
            }
          >
            {props.selectedDashboard.name}
            <i className="icon-chevron-down" />
          </h3>
        );
      }}
    />
  ) : (
    <TooltipMenu
      placement="bottom-start"
      isScrollable
      offset={[0, 15]}
      menuItems={getMenuItems()}
      tooltipTriggerElement={
        <h3
          className="analyticalDashboard__title"
          onClick={() =>
            TrackEvent(
              'Graph Dashboard',
              'Click',
              'Open Dashboard List Dropdown'
            )
          }
        >
          {props.selectedDashboard.name}
          <i className="icon-chevron-down" />
        </h3>
      }
      kitmanDesignSystem
    />
  );
};

export default DashboardSelector;
