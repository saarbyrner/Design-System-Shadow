// @flow
import type { FormStructure } from '@kitman/modules/src/Scouts/shared/types/form';
import { data } from '../mocks/data/mock_form_structure';

// This is mocked for now:
// 1: we dont have a BE service availabel yet
// 2: We dont have the required form id available anywhere yet
// To get around this, for the 23/24 MLS next season, I created a hardcoded map
// to map the userType (staff | athlete) to a form id (61 | 62), based on local DB values, but could be anything in the future

const fetchFormStructure = async (id: number): Promise<FormStructure> => {
  return data[id];
};

export default fetchFormStructure;
