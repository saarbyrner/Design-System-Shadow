/** @typedef {import('../../types').WeekStartDay} WeekStartDay */
/** @typedef {import('../../types').SettingsKey} WeekStartDay */
import settingsReducer, { setSettings } from '../settings';
import { initialSettings } from '../../../utils/consts';

describe('Settings - slices', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = { ...initialSettings };

    expect(settingsReducer(initialSettings, action)).toEqual(expectedState);
  });

  it('should update state properly', () => {
    /** @type {WeekStartDay} */
    const chosenStartingDay = 'Friday';
    /** @type {SettingsKey} */
    const startingDayKey = 'weekStartDayw';
    const action = setSettings({
      key: startingDayKey,
      value: chosenStartingDay,
    });

    const expectedState = {
      ...initialSettings,
      [startingDayKey]: chosenStartingDay,
    };

    expect(settingsReducer(initialSettings, action)).toEqual(expectedState);
  });
});
