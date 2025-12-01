import { render, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useAppHeaderHeight from '../useAppHeaderHeight';

describe('useAppHeaderHeight', () => {
  const mockAppHeader = <div className="appHeader" />;
  const mockAppHeaderDisplayNone = (
    <div className="appHeader" css={{ display: 'none' }} />
  );
  const mockMobileNavBar = <div className="ip-mainNavBarMobile__wrapper" />;

  it('should return the correct height when app header is present', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 60,
    });

    render(
      <>
        {mockAppHeader}
        {mockMobileNavBar}
      </>
    );

    const { result } = renderHook(() => useAppHeaderHeight());

    fireEvent(window, new Event('resize'));

    expect(result.current).toEqual(60);
  });

  it('should return the correct height when mobile nav bar is present', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 80,
    });

    render(
      <>
        {mockAppHeaderDisplayNone}
        {mockMobileNavBar}
      </>
    );

    const { result } = renderHook(() => useAppHeaderHeight());

    fireEvent(window, new Event('resize'));

    expect(result.current).toEqual(80);
  });
});
