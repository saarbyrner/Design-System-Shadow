// @flow
import { useState, useMemo, useEffect } from 'react';
import _isEqual from 'lodash/isEqual';
import { getFavorites, makeFavorite, deleteFavorite } from '@kitman/services';
import type { FavoriteGroup } from '@kitman/services/src/services/favoriting';
import type { RequestStatus } from '@kitman/common/src/types';

export type FavoriteItem =
  | Object
  | {
      id: string | number,
      name: string,
      variations_default: any,
      variations_type?: string,
      select_name?: string,
      isChecked?: boolean,
    };
export type FavoritesByGroup = Map<FavoriteGroup, Array<FavoriteItem>>;
const useFavorites = (
  group: FavoriteGroup,
  excludeRemainder: boolean = true,
  args?: Object,
  withArgs?: boolean
) => {
  const [initialRequestStatus, setInitialRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [toggleFavoriteRequestStatus, setToggleFavoriteRequestStatus] =
    useState<RequestStatus>(null);
  const [favorites, setFavorites] = useState<FavoritesByGroup>(new Map());
  const [remainders, setRemainders] = useState<FavoritesByGroup>(new Map());
  const [currArgs, setCurrArgs] = useState<Object>({});

  useEffect(() => {
    if (
      !_isEqual(currArgs, args) &&
      withArgs &&
      args &&
      Object.values(args).every((item) => item)
    ) {
      setCurrArgs(() => args);
    }
  }, [withArgs, args, currArgs]);

  useMemo(() => {
    if (
      (withArgs &&
        currArgs &&
        Object.values(currArgs).length > 0 &&
        Object.values(currArgs).every((item) => item) &&
        group) ||
      (!withArgs && group)
    )
      getFavorites(group, excludeRemainder, currArgs).then(
        (data) => {
          setFavorites((favs) => new Map(favs.set(group, data.favorites)));
          if (data.remainder) {
            setRemainders(
              (remains) => new Map(remains.set(group, data.remainder))
            );
          }
          setInitialRequestStatus('SUCCESS');
        },
        () => setInitialRequestStatus('FAILURE')
      );
  }, [group, excludeRemainder, currArgs, withArgs]);

  const toggleFavorite = (
    currentlyFavorite: boolean,
    id: number | string,
    favoriteGroup: FavoriteGroup,
    toggleArgs: Object
  ) => {
    setInitialRequestStatus('PENDING');
    if (currentlyFavorite) {
      deleteFavorite(id, favoriteGroup, excludeRemainder, toggleArgs).then(
        (data) => {
          setFavorites(new Map(favorites.set(favoriteGroup, data.favorites)));
          if (data.remainder) {
            setRemainders(
              (remains) => new Map(remains.set(group, data.remainder))
            );
          }
          setToggleFavoriteRequestStatus('SUCCESS');
        },
        () => setToggleFavoriteRequestStatus('FAILURE')
      );
    } else {
      makeFavorite(id, favoriteGroup, excludeRemainder, toggleArgs).then(
        (data) => {
          setFavorites(new Map(favorites.set(favoriteGroup, data.favorites)));
          if (data.remainder) {
            setRemainders(
              (remains) => new Map(remains.set(group, data.remainder))
            );
          }
          setToggleFavoriteRequestStatus('SUCCESS');
        },
        () => setToggleFavoriteRequestStatus('FAILURE')
      );
    }
  };
  return {
    favorites,
    remainders,
    initialRequestStatus,
    toggleFavorite,
    toggleFavoriteRequestStatus,
  };
};
export default useFavorites;
