import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import {
  getMassUploadImportType,
  getMassUploadParseCSVData,
} from '../getSharedEventData';

describe('getSharedEventData', () => {
  it('should return correct data for getMassUploadImportType', () => {
    expect(getMassUploadImportType(IMPORT_TYPES.EventData)).toMatchSnapshot();
  });

  it('should return correct data for getMassUploadParseCSVData', () => {
    expect(
      getMassUploadParseCSVData({
        importType: IMPORT_TYPES.EventData,
        columnCount: 5,
        rowCount: 100,
        vendor: 'Statsports',
      })
    ).toMatchSnapshot();
  });
});
