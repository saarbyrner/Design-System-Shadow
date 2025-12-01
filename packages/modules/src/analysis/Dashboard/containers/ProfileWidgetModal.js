import { useSelector, useDispatch } from 'react-redux';
import _flattenDeep from 'lodash/flattenDeep';
import { ProfileWidgetModalTranslated as ProfileWidgetModal } from '../components/ProfileWidgetModal';
import {
  closeProfileWidgetModal,
  editProfileWidget,
  saveProfileWidget,
  selectAthlete,
  selectWidgetInfoItem,
  setAvatarAvailability,
  setAvatarSquadNumber,
  setProfileBackgroundColour,
  updatePreview,
} from '../redux/actions/profileWidgetModal';
import { useGetSquadAthletesQuery } from '../redux/services/dashboard';

export default (props) => {
  const dispatch = useDispatch();
  const {
    widgetId,
    preview,
    backgroundColour,
    avatar_squad_number: showSquadNumber,
    fields: selectedInfoFields,
    open,
    athlete_id: athleteId,
    avatar_availability: showAvailabilityIndicator,
  } = useSelector((state) => state.profileWidgetModal);
  const {
    data: squadAthletes = {
      position_groups: [],
    },
  } = useGetSquadAthletesQuery();
  const athletes = squadAthletes.position_groups.reduce(
    (allAthletes, positionGroup) => [
      ...allAthletes,
      ..._flattenDeep(
        positionGroup.positions.map((position) =>
          position.athletes.map((athlete) => ({
            position: position.name,
            positionGroupId: positionGroup.id,
            positionId: position.id,
            ...athlete,
          }))
        )
      ),
    ],
    []
  );

  return (
    <ProfileWidgetModal
      athleteId={athleteId}
      selectedInfoFields={selectedInfoFields}
      showAvailabilityIndicator={showAvailabilityIndicator}
      showSquadNumber={showSquadNumber}
      open={open}
      previewData={preview}
      widgetId={widgetId}
      onClickCloseModal={() => {
        dispatch(closeProfileWidgetModal());
      }}
      onClickSaveProfileWidget={(profileWidgetId) => {
        if (profileWidgetId !== null) {
          dispatch(editProfileWidget(profileWidgetId));
        } else {
          dispatch(saveProfileWidget());
        }
      }}
      onSelectAthlete={(id) => {
        dispatch(selectAthlete(id));
        dispatch(updatePreview());
      }}
      onSelectWidgetInfoItem={(index, itemId) => {
        dispatch(selectWidgetInfoItem(index, itemId));
        dispatch(updatePreview());
      }}
      onSetAvatarAvailability={(showIndicator) => {
        dispatch(setAvatarAvailability(showIndicator));
        dispatch(updatePreview());
      }}
      onSetAvatarSquadNumber={(showNumber) => {
        dispatch(setAvatarSquadNumber(showNumber));
        dispatch(updatePreview());
      }}
      onSetBackgroundColour={(colour) => {
        dispatch(setProfileBackgroundColour(colour));
      }}
      backgroundColour={backgroundColour}
      athletes={athletes}
      {...props}
    />
  );
};
