// @flow
import type { Node } from 'react';
import { useState, useRef, useLayoutEffect, createContext } from 'react';
import { css } from '@emotion/react';
import { IconButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import classNames from 'classnames';

export const SelectContext: Object = createContext({
  id: '',
  searchValue: '',
  setSearchValue: () => {},
});

function Root(props: { children: Node }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchInputProps, setSearchInputProps] = useState({});

  return (
    <SelectContext.Provider
      value={{
        searchValue,
        setSearchValue,
        searchInputProps,
        setSearchInputProps,
      }}
    >
      <div className="kitmanReactSelect">{props.children}</div>
    </SelectContext.Provider>
  );
}

function Label(props: { label: ?string, isDisabled?: ?boolean }) {
  return (
    <div className="kitmanReactSelect__labelContainer">
      {props.label && (
        <span
          className={classNames('kitmanReactSelect__label', {
            'kitmanReactSelect__label--disabled': props.isDisabled,
          })}
        >
          {props.label}
        </span>
      )}
    </div>
  );
}

const OptionalFlag = (props: { optional?: boolean, optionalText: string }) => {
  return props.optional ? (
    <div className="kitmanReactSelect__optionalFieldText">
      {props.optionalText}
    </div>
  ) : null;
};

const SearchInput = (props: Object) => {
  const inputRef = useRef(null);
  // Auto focusing to the input when it is mounted
  useLayoutEffect(() => {
    setTimeout(() => {
      if (inputRef.current !== null) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  return (
    <div className="kitmanReactSelect__searchContainer">
      <input
        ref={inputRef}
        value={props.value}
        onChange={props.onChange}
        className="kitmanReactSelect__searchInput"
        data-testid="selectSearchInput"
        placeholder={props.placeholder}
        onBlur={props.onBlur}
      />
      <i className="kitmanReactSelect__searchInputIcon icon-search" />
    </div>
  );
};

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
      &:hover {
        cursor: pointer;
      }
    `,
    favouriteIcon: css`
      visibility: ${props.extra ? 'hidden' : 'visible'};
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
    <div
      key={JSON.stringify(props.data.id)}
      css={style.favoriteTemplate}
      data-testid="Favorite|FavoriteTemplate"
    >
      <div
        css={style.favoriteTitle}
        onClick={() => {
          return props.onChange({
            value: props.data?.id,
            label:
              props.data?.select_name || props.data?.name || props.data?.label,
            ...props.data,
          });
        }}
      >
        {props.data?.select_name || props.data?.name}
      </div>

      <div css={style.favouriteIcon}>
        <IconButton
          icon={props.data.isFavorite ? 'icon-star-filled' : 'icon-star'}
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
  Root,
  Label,
  OptionalFlag,
  SearchInput,
  FavoriteTemplate,
};
