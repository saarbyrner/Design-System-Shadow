import { renderHook, act } from '@testing-library/react-hooks';
import { ExportProvider, ExportData, useExport } from '../index';

const MOCK_DATA = [{ Header: 'Value' }, { Header: 'Value' }];

describe('TableWidget Export component', () => {
  it('renders and stores data to export', () => {
    const wrapper = ({ children }) => (
      <ExportProvider initialData={MOCK_DATA}>{children}</ExportProvider>
    );

    const { result } = renderHook(() => useExport(), { wrapper });

    expect(result.current.data).toStrictEqual(MOCK_DATA);
  });

  it('can set data with setData call in hook', () => {
    const wrapper = ({ children }) => (
      <ExportProvider>{children}</ExportProvider>
    );

    const { result } = renderHook(() => useExport(), { wrapper });

    act(() => {
      result.current.setData(MOCK_DATA);
    });

    expect(result.current.data).toStrictEqual(MOCK_DATA);
  });

  it('can set data with child ExportData component', () => {
    const wrapper = ({ children }) => (
      <ExportProvider>
        <ExportData data={MOCK_DATA} />
        {children}
      </ExportProvider>
    );

    const { result } = renderHook(() => useExport(), { wrapper });

    expect(result.current.data).toStrictEqual(MOCK_DATA);
  });
});
