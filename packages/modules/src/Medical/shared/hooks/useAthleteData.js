// @flow
import { useState } from 'react';
import getAthleteData from '@kitman/services/src/services/getAthleteData';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';

type UseAthleteDataReturnValue = {
  athleteData: AthleteData,
  fetchAthleteData: Function,
  isPastAthlete: boolean,
};

const useAthleteData = (): UseAthleteDataReturnValue => {
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [isPastAthlete, setIsPastAthlete] = useState(false);

  const fetchAthleteData = (id: number): Promise<any> => {
    return new Promise((resolve, reject) =>
      getAthleteData(id).then(
        (data) => {
          setAthleteData(data);
          setIsPastAthlete(!!data?.org_last_transfer_record?.left_at);
        },
        () => reject()
      )
    );
  };

  return {
    athleteData,
    fetchAthleteData,
    isPastAthlete,
  };
};

export default useAthleteData;
