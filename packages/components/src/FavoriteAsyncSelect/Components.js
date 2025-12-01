// @flow
import { css } from '@emotion/react';
import { IconButton, Checkbox } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

const FavoriteTemplate = (props: Object) => {
  const style = {
    favoriteTemplate: css`
      background-color: ${colors.white};
      min-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 16px;
    `,

    favoriteTitle: css`
      color: ${colors.grey_300};
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      flex: 1;
      padding: 4px 0;
      &:hover {
        cursor: pointer;
      }
    `,
    favouriteIcon: css`
      visibility: ${props.extra ? 'hidden' : 'visible'};
      .iconButton {
        &::before {
          font-size: 16px;
        }
      }
      .iconButton--transparent {
        color: ${colors.grey_100};
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
    <div
      key={props.data.id}
      css={style.favoriteTemplate}
      data-testid="Favorite|FavoriteTemplate"
    >
      {props.isMulti && !props.extra && (
        <div>
          <Checkbox
            id=""
            toggle={() => {
              return props.onChange({
                ...props.data,
                value: props.data?.id,
                label: props.data?.label,
              });
            }}
            isChecked={
              !!props?.selectPropsValue?.find(({ id }) => id === props.data.id)
            }
            kitmanDesignSystem
          />
        </div>
      )}
      <div
        css={style.favoriteTitle}
        onClick={() => {
          if (!props.isMulti) {
            props.onBlur();
          }
          return props.onChange({
            ...props.data,
            value: props.data?.id,
            label: props.data?.label,
          });
        }}
      >
        {props.data?.label}
      </div>
      <div css={style.favouriteIcon}>
        <IconButton
          icon={
            props.arrayOfFavorites.find(({ id }) => id === props.data.id)
              ? 'icon-star-filled'
              : 'icon-star'
          }
          isSmall
          isBorderless
          isTransparent
          onClick={() => {
            props.handleToggle(props.data.id);
          }}
          data-testid="FavouriteButton"
        />
      </div>
    </div>
  );
};

export default {
  FavoriteTemplate,
};
