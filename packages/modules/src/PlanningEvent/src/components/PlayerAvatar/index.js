// @flow
import { useDraggable } from '@dnd-kit/core';
import { css } from '@emotion/react';
import type { Athlete } from '@kitman/common/src/types/Event';
import type { PlayerWithPosition } from '@kitman/common/src/types/PitchView';
import styles from './styles';
import { getPlayerNumber } from '../../helpers/utils';

type PlayerAvatarProps = {
  player: Athlete | Object,
  style?: any,
  isDisabled?: boolean,
  onPlayerClick?: Function,
  selectedPitchPlayer?: ?PlayerWithPosition,
  playerName: string,
  staffRole?: ?string,
  isStaff?: boolean,
};

const PlayerAvatar = ({
  player,
  style = {},
  isDisabled,
  onPlayerClick,
  selectedPitchPlayer,
  playerName = '',
  staffRole = '',
  isStaff,
}: PlayerAvatarProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: player.id,
      data: player,
      disabled: !!selectedPitchPlayer,
    });

  const wrapperStyle = transform
    ? css`
        transform: translate3d(${transform.x}px, ${transform.y}px, 0);
      `
    : undefined;

  const renderUserInfo = () => {
    return (
      <p css={styles.playerPosition}>
        {isStaff ? (
          staffRole
        ) : (
          <>
            {player?.position?.abbreviation ||
              player?.position?.name
                .split(' ')
                .map((word) => word?.[0] || '')
                .join('')}{' '}
            | {getPlayerNumber(player?.squad_number)}
          </>
        )}
      </p>
    );
  };

  return (
    <div
      className="player-avatar-wrapper"
      data-testid="PlayerAvatar"
      ref={setNodeRef}
      css={
        isDisabled
          ? [
              styles.wrapper,
              css`
                opacity: 60%;
                cursor: not-allowed;
                &:hover {
                  background-color: inherit;
                }
              `,
            ]
          : [wrapperStyle, styles.wrapper, isDragging && styles.dragging]
      }
      {...attributes}
      onMouseDown={isDisabled ? undefined : onPlayerClick}
    >
      <div
        {...listeners}
        className="player-avatar-info"
        css={[
          css`
            border-radius: 20px;
            display: flex;
            flex-direction: row;
            padding: 20px 8px;
          `,
        ]}
      >
        <img
          alt="Player Avatar"
          src={player?.avatar_url || '/img/avatar.jpg'}
          css={[styles.avatar, style]}
        />
        <div css={styles.playerInfo}>
          <p css={styles.playerName}>{playerName}</p>
          {renderUserInfo()}
        </div>
      </div>
    </div>
  );
};

export default PlayerAvatar;
