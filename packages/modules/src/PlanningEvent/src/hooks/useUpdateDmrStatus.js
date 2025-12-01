// @flow
import { useDispatch } from 'react-redux';
import fetchGameComplianceInfo from '@kitman/modules/src/LeagueOperations/shared/services/fetchGameComplianceInfo';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import i18n from '@kitman/common/src/utils/i18n';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

export const DmrStatuses = {
  players: 'players',
  captain: 'captain',
  lineup: 'lineup',
  subs: 'subs',
  staff: 'staff',
  physician: 'physician',
};

export const dmrEventStatusProgress = {
  partial: 'PARTIAL',
  complete: 'COMPLETE',
};

export const ClubPhysicianDMRRequiredRole = 'Club Physician (M) (vetted)';

const useUpdateDmrStatus = () => {
  const dispatch = useDispatch();

  const getUpdatedDmrStatusInfo = async ({
    eventId,
    currentStatuses,
  }: {
    eventId: number,
    currentStatuses: Array<$Values<typeof DmrStatuses>>,
  }): Promise<Array<$Values<typeof DmrStatuses>>> => {
    try {
      const fetchedComplianceInfo = await fetchGameComplianceInfo(eventId);

      // Iterates through the fetched compliance info retrieving the compliant rules
      const fetchedStatuses = fetchedComplianceInfo.map((complianceInfo) => {
        const statusKey = Object.keys(complianceInfo)[0];
        return complianceInfo[statusKey].compliant ? statusKey : '';
      });
      const filteredFetchedStatuses = fetchedStatuses.filter(
        (status) => status
      );

      // Compares the local current game compliance rules with the saved ones on the backend
      // If any differences updates the local rules with the updated statuses
      if (
        !(
          filteredFetchedStatuses.length === currentStatuses?.length &&
          filteredFetchedStatuses.every((val) => currentStatuses?.includes(val))
        )
      ) {
        return filteredFetchedStatuses;
      }
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: i18n.t(`Game compliance rules fetch failed.`),
        })
      );
      throw Error();
    }

    return currentStatuses;
  };

  return { getUpdatedDmrStatusInfo };
};

export default useUpdateDmrStatus;
