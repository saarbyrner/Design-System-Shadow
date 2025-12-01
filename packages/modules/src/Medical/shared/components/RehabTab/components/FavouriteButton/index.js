// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { IconButton } from '@kitman/components';

export type Props = {
  itemId: string | number,
  isFavourite: boolean,
  onToggle: Function,
};

const FavouriteButton = (props: Props) => {
  const style = {
    favouriteIcon: css`
      padding: 0 8px;
      color: ${props.isFavourite ? colors.yellow_100 : colors.grey_100};

      .iconButton {
        &::before {
          font-size: 16px;
        }
      }

      .iconButton--transparent {
        color: ${props.isFavourite ? colors.yellow_100 : colors.grey_100};

        &:hover {
          color: ${colors.yellow_100};
        }

        &:disabled {
          color: ${colors.grey_300_50};

          &:hover {
            color: ${colors.grey_300_50};
          }
        }
      }
    `,
  };

  return (
    <div css={style.favouriteIcon} data-testid="Rehab|FavouriteButton">
      <IconButton
        icon={props.isFavourite ? 'icon-star-filled' : 'icon-star'}
        isSmall
        isBorderless
        isTransparent
        onClick={() => props.onToggle(props.isFavourite, props.itemId)}
      />
    </div>
  );
};

export default FavouriteButton;
