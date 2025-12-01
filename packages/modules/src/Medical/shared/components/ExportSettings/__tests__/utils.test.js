import { getCachedField, setCachedField } from '../utils';

describe('ExportSettings | cache utils', () => {
  it('can write/read string values to/from the cache', () => {
    setCachedField('ExportSettings', 'testKey', 'myValue');

    expect(getCachedField('ExportSettings', 'testKey')).toBe('myValue');
  });

  it('can write/read object values to/from the cache', () => {
    setCachedField('ExportSettings', 'testKey', { foo: 'Bar' });

    expect(getCachedField('ExportSettings', 'testKey')).toEqual({ foo: 'Bar' });
  });

  it('can write/read array values to/from the cache', () => {
    setCachedField('ExportSettings', 'testKey', [
      { foo: 'Bar' },
      { foo: 'Baz' },
    ]);

    expect(getCachedField('ExportSettings', 'testKey')).toEqual([
      { foo: 'Bar' },
      { foo: 'Baz' },
    ]);
  });

  it('can write/read items with different fieldKeys to/from the cache', () => {
    setCachedField('ExportSettings', 'testKey', [
      { foo: 'Bar' },
      { foo: 'Baz' },
    ]);
    setCachedField('ExportSettings', 'testKey1', { foo: 'Bar' });
    setCachedField('ExportSettings', 'testKey2', 'myValue');

    expect(getCachedField('ExportSettings', 'testKey')).toEqual([
      { foo: 'Bar' },
      { foo: 'Baz' },
    ]);
    expect(getCachedField('ExportSettings', 'testKey1')).toEqual({
      foo: 'Bar',
    });
    expect(getCachedField('ExportSettings', 'testKey2')).toBe('myValue');
  });

  it('can write/read items with different settingsKeys and fieldKeys to/from the cache', () => {
    setCachedField('ExportSettings', 'testKey', [
      { foo: 'Bar' },
      { foo: 'Baz' },
    ]);
    setCachedField('ExportSettings1', 'testKey1', { foo: 'Bar' });
    setCachedField('ExportSettings', 'testKey2', 'myValue');

    expect(getCachedField('ExportSettings', 'testKey')).toEqual([
      { foo: 'Bar' },
      { foo: 'Baz' },
    ]);
    expect(getCachedField('ExportSettings1', 'testKey1')).toEqual({
      foo: 'Bar',
    });
    expect(getCachedField('ExportSettings', 'testKey2')).toBe('myValue');
  });
});
