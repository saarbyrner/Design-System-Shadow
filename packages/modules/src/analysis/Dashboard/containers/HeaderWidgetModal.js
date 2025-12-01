import { useSelector, useDispatch } from 'react-redux';
import { HeaderWidgetModalTranslated as HeaderWidgetModal } from '../components/HeaderWidgetModal';
import {
  closeHeaderWidgetModal,
  editHeaderWidget,
  saveHeaderWidget,
  setHeaderWidgetName,
  setHeaderWidgetPopulation,
  setHeaderWidgetBackgroundColor,
  setShowOrganisationLogo,
  setShowOrganisationName,
  setHideOrganisationDetails,
} from '../redux/actions/headerWidgetModal';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();
  const {
    name,
    color,
    open,
    population,
    showOrgLogo,
    showOrgName,
    hideOrgDetails,
    widgetId,
  } = useSelector((state) => state.headerWidgetModal);
  const { data: squadAthletes } = useGetSquadAthletesQuery();
  const { data: squads } = useGetPermittedSquadsQuery();

  return (
    <HeaderWidgetModal
      name={name}
      backgroundColor={color}
      open={open}
      selectedPopulation={population}
      showOrgLogo={showOrgLogo}
      showOrgName={showOrgName}
      hideOrgDetails={hideOrgDetails}
      widgetId={widgetId}
      onClickCloseModal={() => {
        dispatch(closeHeaderWidgetModal());
      }}
      onClickSaveHeaderWidget={(headerWidgetId) => {
        if (headerWidgetId !== null) {
          dispatch(editHeaderWidget(headerWidgetId));
        } else {
          dispatch(saveHeaderWidget());
        }
      }}
      onSetHeaderWidgetName={(headerName) => {
        dispatch(setHeaderWidgetName(headerName));
      }}
      onSetHeaderWidgetPopulation={(pop) => {
        dispatch(setHeaderWidgetPopulation(pop));
      }}
      onSetHeaderWidgetBackgroundColor={(colour) => {
        dispatch(setHeaderWidgetBackgroundColor(colour));
      }}
      onSetShowOrganisationLogo={(showOrganisationLogo) => {
        dispatch(setShowOrganisationLogo(showOrganisationLogo));
      }}
      onSetShowOrganisationName={(showOrganisationName) => {
        dispatch(setShowOrganisationName(showOrganisationName));
      }}
      onSetHideOrganisationDetails={(hideOrganisationDetails) => {
        dispatch(setHideOrganisationDetails(hideOrganisationDetails));
      }}
      {...props}
      squadAthletes={squadAthletes || { position_groups: [] }}
      squads={squads || []}
    />
  );
};
