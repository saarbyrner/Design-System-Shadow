// @flow

import moment from 'moment-timezone';
import { useGetCompetitionsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useEffect, useState } from 'react';
import type { TvChannel } from '@kitman/services/src/services/planning/tvChannels/getTvChannels';
import getTvChannels from '@kitman/services/src/services/planning/tvChannels/getTvChannels';

type DirectlyFetchedData = {
  tvChannels: TvChannel[],
};

export const useFixturesUploadColumnValues = (): {
  competitions: Array<string>,
  clubs: Array<string>,
  timezones: Array<string>,
  tvChannels: Array<string>,
} => {
  const [fetchedData, setFetchedData] = useState<DirectlyFetchedData>({
    tvChannels: [],
  });

  useEffect(() => {
    const fetchValues = async () => {
      const channels = await getTvChannels();

      setFetchedData({
        tvChannels: channels,
      });
    };

    fetchValues();
  }, []);

  const { data: competitions } = useGetCompetitionsQuery();
  const { data: clubs } = useGetClubsQuery();

  return {
    timezones: moment.tz.names(),
    competitions: competitions?.map((item) => item.name) ?? [],
    clubs: clubs?.map((club) => club.name) ?? [],
    tvChannels: fetchedData.tvChannels.map((tvChannel) => tvChannel.name),
  };
};
