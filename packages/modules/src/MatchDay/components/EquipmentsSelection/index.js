// @flow
import { useMemo, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import EquipmentCard from '@kitman/modules/src/MatchDay/components/EquipmentCard';
import { useSelector, useDispatch } from 'react-redux';
import { getEventSelector } from '@kitman/modules/src/MatchDay/shared/selectors';
import { transformKitMatrices } from '@kitman/modules/src/KitMatrix/shared/utils';
import {
  useGetRefereesKitMatricesQuery,
  useGetPlayersKitMatricesQuery,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getKitsByRole,
  getTranslations,
} from '@kitman/modules/src/MatchDay/shared/utils';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import assignKitMatrix from '@kitman/services/src/services/kitMatrix/assignKitMatrix/assignKitMatrix';
import { playerKindEnumLike } from '@kitman/modules/src/MatchDay/shared/constants';
import type {
  Kit,
  GameKitMatrixEquipment,
  EquipmentName,
  PlayerType,
} from '@kitman/modules/src/KitMatrix/shared/types';
import { useGetGameKitMatricesQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/gameKitMatricesApi';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import type { GameKitMatrix } from '@kitman/services/src/services/kitMatrix/getGameKitMatrices';
import {
  playerTypesEnumLike,
  equipmentsEnumLike,
} from '@kitman/modules/src/KitMatrix/shared/constants';
import compact from 'lodash/compact';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

type Props = {};

const getSelectFromResult = () => (result) => {
  if (!result?.data?.kit_matrices?.length) return result;
  return {
    ...result,
    data: {
      ...result.data,
      kit_matrices: transformKitMatrices(result.data.kit_matrices),
    },
  };
};

// NOTE: extract function in utils
const getSingleEquipmentFromGameKitMatrix = (
  equipments: Array<GameKitMatrixEquipment>,
  name: EquipmentName
) => {
  const equipment = equipments.filter((item) => item.kind === name)[0];

  return {
    colorId: equipment?.kit_matrix_color_id,
    colorName: equipment?.kit_matrix_color.name,
    image: {
      url: equipment?.attachment.url,
      name: equipment?.attachment.filename,
      type: equipment?.attachment.filetype,
    },
  };
};

// NOTE: extract function in utils
const transformGameKitMatrix = ({
  playerType,
  gameKitMatrix,
}: {
  playerType: PlayerType,
  gameKitMatrix: ?GameKitMatrix,
}): Kit | null => {
  if (!gameKitMatrix) return null;

  const items = gameKitMatrix.kit_matrix.kit_matrix_items;

  const jersey = getSingleEquipmentFromGameKitMatrix(
    items,
    equipmentsEnumLike.jersey
  );
  const shorts = getSingleEquipmentFromGameKitMatrix(
    items,
    equipmentsEnumLike.shorts
  );
  const socks = getSingleEquipmentFromGameKitMatrix(
    items,
    equipmentsEnumLike.socks
  );

  return {
    type: playerType,
    organisation: gameKitMatrix.kit_matrix.organisation,
    name: gameKitMatrix.kit_matrix.name,
    color: gameKitMatrix.kit_matrix.primary_color,
    jersey,
    shorts,
    socks,
    id: gameKitMatrix.kit_matrix_id,
    games_count: 0,
    division: gameKitMatrix.kit_matrix.division,
    status: '',
  };
};

const EquipmentsSelection = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const event = useSelector(getEventSelector);
  const { isLeague, organisationId } = useLeagueOperations();
  const { permissions } = usePermissions();

  const [selectedKits, setSelectedKits] = useState<{ [key: string]: ?Kit }>({
    [playerKindEnumLike.HomePlayer]: null,
    [playerKindEnumLike.HomeGoalkeeper]: null,
    [playerKindEnumLike.Referee]: null,
    [playerKindEnumLike.AwayPlayer]: null,
    [playerKindEnumLike.AwayGoalkeeper]: null,
  });
  const textEnum = getTranslations(t);

  const refereeKits = useGetRefereesKitMatricesQuery(
    {
      kinds: [playerTypesEnumLike.referee],
    },
    {
      skip: !event,
      selectFromResult: getSelectFromResult(),
    }
  );

  const playerKits = useGetPlayersKitMatricesQuery(
    {
      organisation_ids: [
        event?.squad?.owner_id,
        event?.opponent_squad?.owner_id,
      ],
      // division_ids: [], // NOTE: we should filter by divisions also the API doesn't return the division ids in the event object
    },
    {
      skip: !event,
      selectFromResult: getSelectFromResult(),
    }
  );

  const allKits = useMemo(() => {
    return compact(
      [refereeKits?.data?.kit_matrices, playerKits?.data?.kit_matrices].flat()
    );
  }, [refereeKits?.data?.kit_matrices, playerKits?.data?.kit_matrices]);

  const getGameKitMatrices = useGetGameKitMatricesQuery(
    { eventId: event?.id },
    { skip: !event?.id }
  );

  useEffect(() => {
    if (getGameKitMatrices.data) {
      setSelectedKits({
        [playerKindEnumLike.HomePlayer]: transformGameKitMatrix({
          playerType: playerTypesEnumLike.player,
          gameKitMatrix: getGameKitMatrices.data.find(
            (item) => item.kind === playerKindEnumLike.HomePlayer
          ),
        }),
        [playerKindEnumLike.HomeGoalkeeper]: transformGameKitMatrix({
          playerType: playerTypesEnumLike.goalkeeper,
          gameKitMatrix: getGameKitMatrices.data.find(
            (item) => item.kind === playerKindEnumLike.HomeGoalkeeper
          ),
        }),
        [playerKindEnumLike.Referee]: transformGameKitMatrix({
          playerType: playerTypesEnumLike.referee,
          gameKitMatrix: getGameKitMatrices.data.find(
            (item) => item.kind === playerKindEnumLike.Referee
          ),
        }),
        [playerKindEnumLike.AwayPlayer]: transformGameKitMatrix({
          playerType: playerTypesEnumLike.player,
          gameKitMatrix: getGameKitMatrices.data.find(
            (item) => item.kind === playerKindEnumLike.AwayPlayer
          ),
        }),
        [playerKindEnumLike.AwayGoalkeeper]: transformGameKitMatrix({
          playerType: playerTypesEnumLike.goalkeeper,
          gameKitMatrix: getGameKitMatrices.data.find(
            (item) => item.kind === playerKindEnumLike.AwayGoalkeeper
          ),
        }),
      });
    }
  }, [getGameKitMatrices.data]);

  const kitsByRole = useMemo(() => {
    if (!allKits) return null;

    return getKitsByRole({
      event,
      kits: allKits,
    });
  }, [event, allKits]);

  const getOnAssignKit = (kind: string) => async (kitId: number) => {
    try {
      await assignKitMatrix(event.id, {
        kind,
        kit_matrix_id: kitId,
      });

      getGameKitMatrices.refetch();

      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: textEnum.assignKitSuccess,
        })
      );
    } catch {
      dispatch(
        add({
          status: toastStatusEnumLike.Error,
          title: textEnum.assignKitError,
        })
      );
    }
  };

  if (!event) {
    return null;
  }

  const canManageGameInformation =
    permissions?.leagueGame.manageGameInformation;

  const opponent = event.opponent_squad || event.opponent_team;
  const isHome = event.venue_type.name === 'Home';
  const homeTeam = isHome ? event.squad : opponent;
  const awayTeam = !isHome ? event.squad : opponent;
  const isHomeKitEditable =
    canManageGameInformation &&
    (isLeague || homeTeam.owner_id === organisationId);

  const isAwayKitEditable =
    canManageGameInformation &&
    (isLeague ||
      (awayTeam?.owner_id === organisationId &&
        selectedKits[playerKindEnumLike.HomePlayer] &&
        selectedKits[playerKindEnumLike.HomeGoalkeeper]));

  return (
    <>
      <EquipmentCard
        icon={homeTeam.logo_full_path}
        teamName={homeTeam.owner_name}
        playerType={playerTypesEnumLike.player}
        equipments={!kitsByRole ? [] : kitsByRole.home.player}
        selectedEquipment={selectedKits[playerKindEnumLike.HomePlayer]}
        onSave={getOnAssignKit(playerKindEnumLike.HomePlayer)}
        isEditable={isHomeKitEditable}
      />
      <EquipmentCard
        icon={homeTeam.logo_full_path}
        teamName={homeTeam.owner_name}
        playerType={playerTypesEnumLike.goalkeeper}
        equipments={!kitsByRole ? [] : kitsByRole.home.goalkeeper}
        selectedEquipment={
          selectedKits[playerKindEnumLike.HomeGoalkeeper] ?? null
        }
        onSave={getOnAssignKit(playerKindEnumLike.HomeGoalkeeper)}
        isEditable={isHomeKitEditable}
      />
      <EquipmentCard
        icon="/img/match-day/professional-referee-org-logo.svg"
        teamName="Officials"
        playerType={playerTypesEnumLike.referee}
        equipments={!kitsByRole ? [] : kitsByRole.referee}
        selectedEquipment={selectedKits[playerKindEnumLike.Referee] ?? null}
        onSave={getOnAssignKit(playerKindEnumLike.Referee)}
        isEditable={canManageGameInformation && isLeague}
      />
      <EquipmentCard
        icon={awayTeam?.logo_full_path}
        teamName={awayTeam?.owner_name}
        playerType={playerTypesEnumLike.player}
        equipments={!kitsByRole ? [] : kitsByRole.away.player}
        selectedEquipment={selectedKits[playerKindEnumLike.AwayPlayer] ?? null}
        onSave={getOnAssignKit(playerKindEnumLike.AwayPlayer)}
        isEditable={isAwayKitEditable}
      />
      <EquipmentCard
        icon={awayTeam?.logo_full_path}
        teamName={awayTeam?.owner_name}
        playerType={playerTypesEnumLike.goalkeeper}
        equipments={!kitsByRole ? [] : kitsByRole.away.goalkeeper}
        selectedEquipment={
          selectedKits[playerKindEnumLike.AwayGoalkeeper] ?? null
        }
        onSave={getOnAssignKit(playerKindEnumLike.AwayGoalkeeper)}
        isEditable={isAwayKitEditable}
      />
    </>
  );
};

export default withNamespaces()(EquipmentsSelection);
