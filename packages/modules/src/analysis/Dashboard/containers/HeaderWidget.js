// @flow
import type { DateRange } from '@kitman/common/src/types';
import HeaderWidgetComponent from '../components/HeaderWidget';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/dashboard';

type Props = {
  backgroundColor: string,
  canManageDashboard: boolean,
  userName: string,
  isPreview?: boolean,
  name?: string,
  onDelete: Function,
  onDuplicate: Function,
  onEdit: Function,
  orgLogo?: string,
  orgName: string,
  selectedDateRange?: DateRange,
  selectedPopulation: Object,
  selectedTimePeriod?: string,
  showOrgLogo: boolean,
  showOrgName: boolean,
  hideOrgDetails: boolean,
  squadName: string,
  widgetId?: number,
};

function HeaderWidget(props: Props) {
  const { data: squadAthletes = { position_groups: [] } } =
    useGetSquadAthletesQuery();
  const { data: squads = [] } = useGetPermittedSquadsQuery();

  return (
    <HeaderWidgetComponent
      squadAthletes={squadAthletes}
      squads={squads}
      backgroundColor={props.backgroundColor}
      canManageDashboard={props.canManageDashboard}
      userName={props.userName}
      isPreview={props.isPreview}
      name={props.name}
      onDelete={props.onDelete}
      onDuplicate={props.onDuplicate}
      onEdit={props.onEdit}
      orgLogo={props.orgLogo}
      orgName={props.orgName}
      selectedDateRange={props.selectedDateRange}
      selectedPopulation={props.selectedPopulation}
      selectedTimePeriod={props.selectedTimePeriod}
      showOrgLogo={props.showOrgLogo}
      showOrgName={props.showOrgName}
      hideOrgDetails={props.hideOrgDetails}
      squadName={props.squadName}
      widgetId={props.widgetId}
    />
  );
}

export default HeaderWidget;
