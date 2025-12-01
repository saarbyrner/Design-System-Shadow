// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MedicationSourceListName } from '@kitman/modules/src/Medical/shared/types/medical';

export type FavoriteGroup =
  | 'rehab_exercises'
  | 'diagnostic_types'
  | 'procedure_types'
  | 'session_types'
  | 'event_activity_drill_libraries'
  | 'org_efax_contacts'
  | MedicationSourceListName
  | null;

// Args Object for any args the BE needs to narrow favorites
// ex: diagnostic_types favorites are scoped by location_id

export const getFavorites = async (
  group: FavoriteGroup,
  excludeRemainder: boolean,
  args: Object
): Promise<any> => {
  const { data } = await axios.get('/user_favorites', {
    params: {
      favorite_type: group,
      exclude_remainder: excludeRemainder,
      ...args,
    },
  });

  return data;
};

export const makeFavorite = async (
  itemId: number | string,
  group: FavoriteGroup,
  excludeRemainder: boolean,
  args: Object
): Promise<any> => {
  const { data } = await axios.post('/user_favorites', {
    id: itemId,
    favorite_type: group,
    exclude_remainder: excludeRemainder,
    ...args,
  });

  return data;
};

export const deleteFavorite = async (
  itemId: number | string,
  group: FavoriteGroup,
  excludeRemainder: boolean,
  args: Object
): Promise<any> => {
  const { data } = await axios.delete('/user_favorites', {
    data: {
      id: itemId,
      favorite_type: group,
      exclude_remainder: excludeRemainder,
      ...args,
    },
  });

  return data;
};
