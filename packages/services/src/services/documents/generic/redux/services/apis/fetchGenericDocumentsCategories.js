// @flow
import { axios } from '@kitman/common/src/utils/services';
import {
  type OrganisationGenericDocumentCategory,
  type ProductArea,
} from '@kitman/services/src/services/documents/generic/redux/services/types';

export const GENERIC_CATEGORIES_SEARCH_ENDPOINT =
  '/ui/organisation_generic_document_categories';

export const requestHeader = {
  'content-type': 'application/json',
  Accept: 'application/json',
};

const fetchGenericDocumentsCategories = async (
  productArea: ProductArea
): Promise<Array<OrganisationGenericDocumentCategory>> => {
  try {
    const { data } = await axios.get(GENERIC_CATEGORIES_SEARCH_ENDPOINT, {
      headers: requestHeader,
      params: {
        product_area: productArea,
      },
    });

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchGenericDocumentsCategories;
