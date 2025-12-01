// @flow
import { Link } from '@kitman/components';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

const NoAthletes = (props: I18nProps<{}>) => (
  <div className="noAthletes col-lg-12 text-center">
    <h4>
      {props.t('#sport_specific__There_are_no_athletes_within_this_squad')}
    </h4>
    <p>
      {props.t('#sport_specific__Do_you_want_to_add_an_Athlete_to_this_squad?')}
    </p>
    <div className="col-lg-12 text-center">
      <Link
        className="btn km-btn-primary noAthletes__button"
        href="/settings/athletes/new"
      >
        {props.t('#sport_specific__Add_Athlete')}
      </Link>
    </div>
  </div>
);

export default NoAthletes;
export const NoAthletesTranslated = withNamespaces()(NoAthletes);
