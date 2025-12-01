import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import { data as categoriesData } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';
import {
  getGenericDocumentsState,
  getGenericDocumentsFactory,
  getGenericDocumentsCategoriesFactory,
  getGenericDocumentFactory,
} from '../genericDocumentsSelectors';

const documentsData = data.documents;
const documentsMap = {
  1: documentsData[0],
  2: documentsData[1],
  3: documentsData[2],
  4: documentsData[3],
  5: documentsData[4],
  6: documentsData[5],
  7: documentsData[6],
  8: documentsData[7],
  9: documentsData[8],
  10: documentsData[9],
};

const MOCK_STATE = {
  genericDocumentsSlice: {
    genericDocuments: documentsMap,
    genericDocumentsCategories: categoriesData,
  },
};

describe('[genericDocumentsSelectors] - selectors', () => {
  test('getGenericDocumentsState()', () => {
    expect(getGenericDocumentsState(MOCK_STATE)).toBe(
      MOCK_STATE.genericDocumentsSlice
    );
  });

  test('getGenericDocumentsFactory()', () => {
    const selector = getGenericDocumentsFactory();
    expect(selector(MOCK_STATE)).toStrictEqual(documentsData);
  });

  test('getGenericDocumentsCategoriesFactory()', () => {
    const selector = getGenericDocumentsCategoriesFactory();
    expect(selector(MOCK_STATE)).toStrictEqual(categoriesData);
  });

  test('getGenericDocumentFactory()', () => {
    const id = 4;
    const selector = getGenericDocumentFactory(id);

    expect(selector(MOCK_STATE)).toStrictEqual(documentsMap[id]);
  });
});
