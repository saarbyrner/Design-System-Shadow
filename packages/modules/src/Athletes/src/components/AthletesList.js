// @flow
import { AthleteCardTranslated as AthleteCard } from './AthleteCard';
import type { Athlete } from '../types';

type Props = {
  athletes: Array<Athlete>,
};

const AthletesList = (props: Props) => {
  return (
    <div className="athletesList" data-testid="AthletesList">
      {props.athletes.map((athlete: Athlete) => (
        <AthleteCard
          key={athlete.id}
          id={athlete.id}
          availability={athlete.availability}
          avatarUrl={athlete.avatar_url || ''}
          title={athlete.fullname}
        />
      ))}
    </div>
  );
};

export default AthletesList;
