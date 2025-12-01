// @flow
import { useMemo } from 'react';
import type { Team } from '@kitman/common/src/types/PitchView';

const usePlayersByGroups = (team: Team) => {
  const playersByGroups = useMemo(() => {
    const groups = {};
    const allPlayers = [];

    team.players.forEach((player) => {
      const group = player?.position?.position_group?.name;
      if (group) {
        groups[group] = groups[group] || [];
        groups[group].push(player);
      }
      if (player && !allPlayers.includes(player)) allPlayers.push(player);
    });

    return { groups, allPlayers };
  }, [team.players]);

  return playersByGroups;
};

export default usePlayersByGroups;
