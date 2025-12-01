import { storeMock } from '@kitman/components/src/Calendar/__tests__/consts';
import { reducerKey } from '../../consts';
import { getSettingsFactory, getSettings } from '../settings';

const store = storeMock.getState();

describe('Settings - selectors', () => {
  it('should return the settings', () => {
    expect(getSettings(store)).toEqual(store[reducerKey]);
  });

  it.each(Object.keys(store[reducerKey]))(
    'should return the settings for %p',
    (settingsKey) => {
      const selector = getSettingsFactory(settingsKey);

      expect(selector(store)).toEqual(store[reducerKey][settingsKey]);
    }
  );
});
