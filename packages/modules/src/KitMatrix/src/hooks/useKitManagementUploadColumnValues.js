// @flow
import {
  useGetClubsQuery,
  useGetAssociationsOrgsQuery,
} from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useGetKitMatrixColorsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/kitMatrixColorsApi';
import { useGetLeagueSeasonsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/searchKitMatricesApi';
import { useSelector } from 'react-redux';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';

export const useKitManagementUploadColumnValues = () => {
  const currentSquad = useSelector(getActiveSquad());
  const getLeagueSeasonsQuery = useGetLeagueSeasonsQuery();
  const { data: kitMatrixColors } = useGetKitMatrixColorsQuery();
  // this returns the orgs that are associated with the division id
  const getClubsQuery = useGetClubsQuery(
    {
      divisionIds: currentSquad?.division[0]?.id,
    },
    {
      skip: !currentSquad?.division[0]?.id,
    }
  );

  // this returns orgs and the associations that are associated with the division id
  const getAssociationsOrgsQuery = useGetAssociationsOrgsQuery(
    {
      divisionIds: currentSquad?.division[0]?.id,
    },
    {
      skip: !currentSquad?.division[0]?.id,
    }
  );

  return {
    colors: kitMatrixColors?.map((color) => color.name) ?? [],
    clubs: getClubsQuery.data?.map((club) => club.name) ?? [],
    seasons: getLeagueSeasonsQuery.data?.map((season) => season.name) ?? [],
    associations:
      getAssociationsOrgsQuery.data?.map((association) => association.name) ??
      [],
  };
};
