import getDeleteImportData from '../deleteImport/getDeleteImportData';

describe('getDeleteImportData', () => {
  it('matches the snapshot', () => {
    expect(getDeleteImportData('pending')).toMatchSnapshot();
  });
});
