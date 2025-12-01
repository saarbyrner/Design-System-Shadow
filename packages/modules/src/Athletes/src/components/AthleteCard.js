// @flow
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import { Link, TextLink } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteAvailability } from '../types';

type Props = {
  id: number,
  availability: AthleteAvailability,
  avatarUrl: string,
  title: string,
};

const AthleteCard = (props: I18nProps<Props>) => {
  const link = `/athletes/${props.id}`;

  const getLabel = () => {
    switch (props.availability) {
      case 'available':
        return props.t('Available');
      case 'returning':
        return props.t('Available (Returning from injury/illness)');
      case 'injured':
        return props.t('Available (Injured/Ill)');
      default:
        return props.t('Unavailable');
    }
  };

  return (
    <div className="athleteCard" data-testid="AthleteCard">
      <Link href={link} className="athleteCard__avatar">
        {props.availability !== 'available' && (
          <span
            className={classnames('athleteCard__corner', {
              'athleteCard__corner--returning':
                props.availability === 'returning',
              'athleteCard__corner--injured': props.availability === 'injured',
              'athleteCard__corner--unavailable':
                props.availability === 'unavailable',
            })}
          />
        )}
        <img src={props.avatarUrl} alt={props.title} />
      </Link>
      <div className="athleteCard__details">
        <div className="athleteCard__title">
          <TextLink text={props.title} href={link} />
        </div>
        <p className="athleteCard__label">{getLabel()}</p>
      </div>
    </div>
  );
};

export const AthleteCardTranslated = withNamespaces()(AthleteCard);
export default AthleteCard;
