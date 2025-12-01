// @flow
import classNames from 'classnames';

type Props = {
  highlighted?: boolean,
  imageUrl: string,
  name: string,
};

const AthleteAvatar = (props: Props) => {
  return (
    <div
      className={classNames('assessmentsAthleteAvatar', {
        'assessmentsAthleteAvatar--highlighted': props.highlighted,
      })}
    >
      <img src={props.imageUrl} alt={props.name} />
      <p>{props.name}</p>
    </div>
  );
};

export default AthleteAvatar;
