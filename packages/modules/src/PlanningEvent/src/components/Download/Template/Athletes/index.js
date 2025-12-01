// @flow
import type { DownloadTemplateAthlete } from '@kitman/common/src/types/Event';

type Props = {
  athletes: Array<DownloadTemplateAthlete>,
};

const Athletes = (props: Props) => {
  const renderIcon = (participationlevel: string) => {
    switch (participationlevel) {
      case 'partial':
        return <div className="athletesTemplate__iconArrowUp" />;
      case 'modified':
        return <div className="athletesTemplate__iconCircle" />;
      default:
        return '';
    }
  };

  const positionAcronym = (position: string) => {
    const matches = position.match(/\b(\w)/g);
    const acronym = matches != null ? matches.join('') : '';
    return acronym;
  };

  const renderAthlete = (athlete: DownloadTemplateAthlete) => {
    return (
      <div className="athletesTemplate__athlete" key={athlete.id}>
        <div>
          {athlete.firstname.charAt(0)}. {athlete.lastname} -{' '}
          {positionAcronym(athlete.position)}
        </div>
        <div>{renderIcon(athlete.participation_level)}</div>
      </div>
    );
  };

  return (
    <div className="athletesTemplate">
      {props.athletes.map((athlete) => {
        return renderAthlete(athlete);
      })}
    </div>
  );
};

export default Athletes;
