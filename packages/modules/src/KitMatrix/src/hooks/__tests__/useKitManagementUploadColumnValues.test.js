import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import {
  useGetClubsQuery,
  useGetAssociationsOrgsQuery,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useGetKitMatrixColorsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { useGetLeagueSeasonsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import mockLeagueSeasons from '@kitman/services/src/services/kitMatrix/getLeagueSeasons/mock';
import { useKitManagementUploadColumnValues } from '../useKitManagementUploadColumnValues';

jest.mock(
  '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi',
  () => ({
    useGetLeagueSeasonsQuery: jest.fn(),
  })
);

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  getActiveSquad: jest.fn(),
}));

jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi', () => ({
  useGetClubsQuery: jest.fn(),
  useGetAssociationsOrgsQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi',
  () => ({
    useGetKitMatrixColorsQuery: jest.fn(),
  })
);

describe('useKitManagementUploadColumnValues', () => {
  const mockCurrentSquad = {
    id: 8,
    name: 'International Squad',
    owner_id: 6,
    division: [
      {
        id: 1,
        name: 'KLS',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getActiveSquad.mockReturnValue(() => mockCurrentSquad);
    useSelector.mockImplementation((selector) => selector());
  });

  it('should return correct values when all data is present', () => {
    const mockColors = [
      { id: 1, name: 'Red' },
      { id: 2, name: 'Blue' },
      { id: 3, name: 'Green' },
    ];

    const mockClubs = [
      { id: 1, name: 'Club A' },
      { id: 2, name: 'Club B' },
    ];

    const mockAssociations = [
      { id: 1, name: 'Association A' },
      { id: 2, name: 'Association B' },
    ];

    useGetKitMatrixColorsQuery.mockReturnValue({
      data: mockColors,
    });

    useGetClubsQuery.mockReturnValue({
      data: mockClubs,
    });

    useGetAssociationsOrgsQuery.mockReturnValue({
      data: mockAssociations,
    });

    useGetLeagueSeasonsQuery.mockReturnValue({
      data: mockLeagueSeasons,
    });

    const { result } = renderHook(() => useKitManagementUploadColumnValues());

    expect(result.current.colors).toEqual(['Red', 'Blue', 'Green']);
    expect(result.current.clubs).toEqual(['Club A', 'Club B']);
    expect(result.current.seasons).toEqual(['24/25 Season', '25/26 Season']);
    expect(result.current.associations).toEqual([
      'Association A',
      'Association B',
    ]);
  });

  it('should return empty arrays when data is undefined', () => {
    useGetKitMatrixColorsQuery.mockReturnValue({
      data: undefined,
    });

    useGetClubsQuery.mockReturnValue({
      data: undefined,
    });

    useGetAssociationsOrgsQuery.mockReturnValue({
      data: undefined,
    });

    const { result } = renderHook(() => useKitManagementUploadColumnValues());

    expect(result.current.colors).toEqual([]);
    expect(result.current.clubs).toEqual([]);
    expect(result.current.seasons).toEqual(['24/25 Season', '25/26 Season']);
    expect(result.current.associations).toEqual([]);
  });

  it('should return empty arrays when data is null', () => {
    useGetKitMatrixColorsQuery.mockReturnValue({
      data: null,
    });

    useGetClubsQuery.mockReturnValue({
      data: null,
    });

    useGetAssociationsOrgsQuery.mockReturnValue({
      data: null,
    });

    const { result } = renderHook(() => useKitManagementUploadColumnValues());

    expect(result.current.colors).toEqual([]);
    expect(result.current.clubs).toEqual([]);
    expect(result.current.seasons).toEqual(['24/25 Season', '25/26 Season']);
    expect(result.current.associations).toEqual([]);
  });

  it('should return empty arrays when data is empty', () => {
    useGetKitMatrixColorsQuery.mockReturnValue({
      data: [],
    });

    useGetClubsQuery.mockReturnValue({
      data: [],
    });

    useGetAssociationsOrgsQuery.mockReturnValue({
      data: [],
    });

    const { result } = renderHook(() => useKitManagementUploadColumnValues());

    expect(result.current.colors).toEqual([]);
    expect(result.current.clubs).toEqual([]);
    expect(result.current.seasons).toEqual(['24/25 Season', '25/26 Season']);
    expect(result.current.associations).toEqual([]);
  });
});
