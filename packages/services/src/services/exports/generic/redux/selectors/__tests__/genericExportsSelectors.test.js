import { data } from '@kitman/services/src/services/exports/generic/redux/services/mocks/data/fetchExportableElements';
import {
  getExportableFieldsState,
  getExportableFieldsFactory,
} from '../genericExportsSelectors';

const MOCK_STATE = {
  genericExportsSlice: {
    exportableFields: data,
  },
};

describe('[genericExportsSelectors] - selectors', () => {
  test('getExportableFieldsState()', () => {
    expect(getExportableFieldsState(MOCK_STATE)).toBe(
      MOCK_STATE.genericExportsSlice.exportableFields
    );
  });

  test('getExportableFieldsFactory()', () => {
    const selector = getExportableFieldsFactory();
    expect(selector(MOCK_STATE)).toStrictEqual(data);
  });
});
