// @flow
import { useSelector, useDispatch } from 'react-redux';
import type {
  AthletesSelectorSquadData,
  AthletesAndStaffSelectorStaffMemberData,
} from '@kitman/components/src/types';
import { ChannelMembersSidePanelTranslated as ChannelMembersSidePanel } from '../components/ChannelMembersSidePanel';
import { closeChannelMembersSidePanel } from '../components/ChannelMembersSidePanel/actions';
import { addOrRemoveChannelMembers } from '../actions';

export type Props = {
  staff: Array<AthletesAndStaffSelectorStaffMemberData>,
  squads: Array<AthletesSelectorSquadData>,
};

export default (props: Props) => {
  const dispatch = useDispatch();
  const activeSidePanel = useSelector(
    (state) => state.messagingSidePanel.activeSidePanel
  );
  const isOpen = activeSidePanel === 'ChannelMembers';
  const updateRequestStatus = useSelector(
    (state) => state.channelMembersSidePanel.updateRequestStatus
  );
  const members = useSelector(
    (state) => state.athleteChat.currentChannelExtraData.members
  );
  const userRole = useSelector((state) => state.athleteChat.userRole);
  const athletes = useSelector(
    (state) => state.athleteChat.searchableItemGroups.athletes
  );

  return (
    isOpen && (
      <ChannelMembersSidePanel
        userRole={userRole}
        channelMembers={members || []}
        staff={props.staff}
        athletes={athletes}
        squads={props.squads}
        updateRequestStatus={updateRequestStatus}
        onClose={() => {
          dispatch(closeChannelMembersSidePanel());
        }}
        onAddOrRemoveChannelMembers={(
          membersToRemove,
          membersToAdd,
          staffCanSend,
          athletesCanSend
        ) => {
          dispatch(
            addOrRemoveChannelMembers(
              membersToRemove,
              membersToAdd,
              staffCanSend,
              athletesCanSend
            )
          )
            .then(() => {
              dispatch(closeChannelMembersSidePanel());
            })
            .catch(() => {
              // TODO: Show Error AppStatus in sidebar
            });
        }}
      />
    )
  );
};
