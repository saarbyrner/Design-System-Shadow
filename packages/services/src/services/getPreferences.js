// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  PreferenceKey,
  PreferenceType,
} from '@kitman/common/src/contexts/PreferenceContext/types';

const getPreferences = async (
  keys: Array<PreferenceKey>
): Promise<PreferenceType> => {
  const { data } = await axios.post('/organisation_preferences/fetch', {
    keys,
  });
  return data;
};

export default getPreferences;
