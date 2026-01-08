/**
 * * @typedef {import("../../redux/types").SettingsKey} SettingsKey
 */
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';

import { useSettings } from '../hooks';
import { initialSettings } from '../consts';
import { setupStore } from '../../redux/store';

const settingsKeys = Object.keys(initialSettings);

describe('hooks', () => {
  describe('useSettings', () => {
    const AppReduxWrapper = ({ children }) => {
      return (
        <Provider
          store={setupStore({
            preloadedStore: { calendarSettings: initialSettings },
          })}
        >
          {children}
        </Provider>
      );
    };

    /**
     *
     * @param {SettingsKey} settingsKey
     */
    const getSetSettingsValue = (settingsKey) => {
      switch (settingsKey) {
        case 'weekStartDay':
          return 'Thursday';
        case 'defaultEventDurationMins':
          return 45;
        default:
          return '12:45';
      }
    };

    it.each(settingsKeys)(
      'should return the initial state after the first render for %p',
      (settingsKey) => {
        const { result } = renderHook(() => useSettings(settingsKey), {
          wrapper: AppReduxWrapper,
        });

        expect(result.current.settings).toStrictEqual(
          initialSettings[settingsKey]
        );
      }
    );

    it.each(settingsKeys)(
      'should return the updated settings for %p',
      (settingsKey) => {
        const { result } = renderHook(() => useSettings(settingsKey), {
          wrapper: AppReduxWrapper,
        });

        expect(result.current.settings).toStrictEqual(
          initialSettings[settingsKey]
        );

        const value = getSetSettingsValue(settingsKey);

        act(() => {
          result.current.setSettings(value);
        });
        expect(result.current.settings).toStrictEqual(value);
      }
    );
  });
});
