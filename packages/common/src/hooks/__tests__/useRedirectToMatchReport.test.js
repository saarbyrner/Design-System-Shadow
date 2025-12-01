import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useRedirectToMatchReport from '../useRedirectToMatchReport';
import useLeagueOperations from '../useLeagueOperations';
import useLocationAssign from '../useLocationAssign';
import { usePreferences } from '../../contexts/PreferenceContext/preferenceContext';

jest.mock('../useLeagueOperations');
jest.mock('../useLocationAssign');
jest.mock('../../contexts/PreferenceContext/preferenceContext');

describe('useRedirectToMatchReport', () => {
  const redirect = jest.fn();

  beforeEach(() => {
    useLocationAssign.mockReturnValue(redirect);

    usePreferences.mockReturnValue({
      preferences: {
        match_monitor: false,
      },
    });
  });

  it('redirects the match report for a scout', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isOfficial: false,
      isOrgSupervised: false,
      isScout: true,
    });

    const { result } = renderHook(() => useRedirectToMatchReport());

    act(() => {
      result.current('123');
    });

    expect(redirect).toHaveBeenCalledWith('/scout-schedule/reports/123');
  });
  it('redirects the match report for an org supervised', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isOfficial: false,
      isOrgSupervised: true,
      isScout: false,
    });

    const { result } = renderHook(() => useRedirectToMatchReport());

    act(() => {
      result.current('123');
    });

    expect(redirect).toHaveBeenCalledWith(
      '/planning_hub/league-schedule/reports/123'
    );
  });
  it('redirects the match report for a league', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: true,
      isOfficial: false,
      isOrgSupervised: false,
      isScout: false,
    });

    const { result } = renderHook(() => useRedirectToMatchReport());

    act(() => {
      result.current('123');
    });

    expect(redirect).toHaveBeenCalledWith('/league-fixtures/reports/123');
  });
  it('redirects the match report for an official', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isOfficial: true,
      isOrgSupervised: false,
      isScout: false,
    });

    const { result } = renderHook(() => useRedirectToMatchReport());

    act(() => {
      result.current('123');
    });

    expect(redirect).toHaveBeenCalledWith('/league-fixtures/reports/123');
  });

  it('redirects the match monitor report for a league user', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: true,
      isOfficial: false,
      isOrgSupervised: false,
      isScout: false,
    });

    usePreferences.mockReturnValue({
      preferences: {
        match_monitor: true,
      },
    });
    const { result } = renderHook(() => useRedirectToMatchReport());

    act(() => {
      result.current('123');
    });

    expect(redirect).toHaveBeenCalledWith('/match_monitor/report/123');
  });
});
