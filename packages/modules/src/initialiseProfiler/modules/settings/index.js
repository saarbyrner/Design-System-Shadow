import organisationSettings from './organisation_settings';
import athleteSettings from './athlete_settings';
import staffSettings from './staff_settings';
import fixtureSettings from './fixture_settings';

export default () => {
  organisationSettings();
  athleteSettings();
  staffSettings();
  fixtureSettings();
};
