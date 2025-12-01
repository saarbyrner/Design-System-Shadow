// @flow
/* eslint "jsx-a11y/anchor-has-content": 0 */
type Props = {
  image: string,
  url: string,
  alt: string,
};

const AthleteAvatar = (props: Props) => (
  <a
    href={props.url}
    style={{
      backgroundImage: `url(${props.image})`,
      backgroundSize: 'contain',
    }}
    className="athleteAvatar"
    alt={props.alt}
  />
);

export default AthleteAvatar;
