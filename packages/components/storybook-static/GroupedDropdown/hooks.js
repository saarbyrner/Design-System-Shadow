// @flow

import { useReducer, useMemo } from 'react';
import _findIndex from 'lodash/findIndex';
import _isNull from 'lodash/isNull';
import classNames from 'classnames';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import type { Translation } from '@kitman/common/src/types/i18n';

import type { GroupedDropdownItem } from './index';

type GroupDropDownItemsArray = Array<GroupedDropdownItem>;

type Action = {
  type: 'add' | 'remove',
  payload: GroupedDropdownItem,
};

const FavouriteIcon = ({ id, isSelected, onClick }) => (
  <a className="groupedDropdown__favouriteIcon" onClick={onClick}>
    <i
      id={id}
      className={classNames('icon', {
        'icon-star-filled': isSelected,
        'icon-star': !isSelected,
      })}
    />
  </a>
);

const writeToLocalStorage = (key, data) => {
  if (!getIsLocalStorageAvailable()) return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Catching errors so it catches any errors in sentry
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

const readFromLocalStorage = (key) => {
  let data = [];

  if (getIsLocalStorageAvailable()) {
    try {
      data = localStorage.getItem(key);

      if (_isNull(data)) {
        data = [];
      } else {
        // $FlowFixMe
        data = JSON.parse(data);
      }
    } catch (e) {
      data = [];
      // Catching errors so it catches any errors in sentry
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return data;
};

const getReducer =
  (key) => (state: GroupDropDownItemsArray, action: Action) => {
    let updatedState = [...state];

    switch (action.type) {
      case 'add':
        updatedState = [...state, action.payload];
        break;
      case 'remove':
        updatedState.splice(_findIndex(state, action.payload), 1);
        break;
      default:
        break;
    }

    writeToLocalStorage(key, updatedState);

    return updatedState;
  };

const useFavouritesGroup = (
  key: string,
  options: GroupDropDownItemsArray,
  t: Translation
) => {
  const [favourites, dispatch]: [GroupDropDownItemsArray, Function] =
    useReducer(getReducer(key), readFromLocalStorage(key));

  const add = (item: GroupedDropdownItem) => {
    dispatch({
      type: 'add',
      payload: item,
    });
  };

  const remove = (item: GroupedDropdownItem) => {
    dispatch({
      type: 'remove',
      payload: item,
    });
  };

  const isItemSelected = (item: GroupedDropdownItem) => {
    const index = _findIndex(favourites, item);

    return index > -1;
  };

  const toggleFavourite = (item: GroupedDropdownItem) => {
    if (!isItemSelected(item)) {
      add(item);
    } else {
      remove(item);
    }
  };

  return useMemo(() => {
    const opts: GroupDropDownItemsArray = [];

    favourites.forEach((favourite, index) => {
      if (index === 0) {
        opts.push({ isGroupOption: true, name: t('Favourites') });
      }

      opts.push({
        ...favourite,
        aside: (
          <FavouriteIcon
            id={favourite.key_name}
            isSelected={isItemSelected(favourite)}
            onClick={() => toggleFavourite(favourite)}
          />
        ),
      });
    });

    options.forEach((option) => {
      if (option.isGroupOption) {
        opts.push(option);
      }

      opts.push({
        ...option,
        aside: (
          <FavouriteIcon
            id={option.key_name}
            isSelected={isItemSelected(option)}
            onClick={() => toggleFavourite(option)}
          />
        ),
      });
    });

    return opts;
  }, [options, favourites]);
};

export default useFavouritesGroup;
