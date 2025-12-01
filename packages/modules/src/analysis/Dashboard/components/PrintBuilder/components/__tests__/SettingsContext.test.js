import { renderHook, act } from '@testing-library/react-hooks';
import { useSettings, SettingsContextProvider } from '../SettingsContext';

const renderHookWithContext = () =>
  renderHook(() => useSettings(), {
    wrapper: ({ children }) => (
      <SettingsContextProvider>{children}</SettingsContextProvider>
    ),
  });

describe('PrintBuilder|SettingsContext', () => {
  it('has the settings with default values', () => {
    const { result } = renderHookWithContext();

    expect(result.current.settings).toEqual({
      orientation: 'portrait',
      size: 'a4',
    });
  });

  it('returns a function that gets the latest value of a field', () => {
    const { result } = renderHookWithContext();

    expect(result.current.fieldValue('orientation')).toEqual('portrait');
    expect(result.current.fieldValue('size')).toEqual('a4');
  });

  it('returns a function that sets the latest value of a field', () => {
    const { result } = renderHookWithContext();

    expect(result.current.fieldValue('orientation')).toEqual('portrait');

    act(() => {
      result.current.onFieldValueChange('orientation', 'landscape');
      result.current.onFieldValueChange('size', 'a5');
    });

    expect(result.current.fieldValue('orientation')).toEqual('landscape');
    expect(result.current.fieldValue('size')).toEqual('a5');
  });
});
