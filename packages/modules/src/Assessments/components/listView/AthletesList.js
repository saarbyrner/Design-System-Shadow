// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { IconButton } from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import type { Athlete } from '../../types';

type Props = {
  athletes: Array<Athlete>,
  onSelectAthleteId: (selectAthleteId: number) => void,
};

const AthletesList = (props: I18nProps<Props>) => {
  const { athletes, onSelectAthleteId, t } = props;
  const [showMobileAthleteSelection, setShowMobileAthleteSelection] =
    useState(false);
  const pathname = useLocationPathname();
  const [selectedAthlete, setSelectedAthlete] = useState<?Athlete>();
  const locationSearch = useLocationSearch();

  useEffect(() => {
    if (!athletes || athletes.length === 0) {
      setSelectedAthlete(undefined);
      return;
    }

    const queryParamAthleteId = locationSearch.get('athleteId');
    let athleteToSelect = null;

    if (queryParamAthleteId) {
      athleteToSelect = athletes.find(
        (athlete) => athlete.id === +queryParamAthleteId
      );
    }

    // Fallback to the first athlete if no query param or if athlete from query param is not in the list
    if (!athleteToSelect) {
      athleteToSelect = athletes[0];
    }

    onSelectAthleteId(athleteToSelect.id);
    setSelectedAthlete(athleteToSelect);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="assessmentsAthleteList">
      {selectedAthlete && (
        <div
          className="assessmentsMobileSelectedAthlete"
          onClick={() => setShowMobileAthleteSelection(true)}
        >
          <img
            src={selectedAthlete.avatar_url}
            alt="Athlete avatar"
            className="assessmentsMobileSelectedAthlete__picture"
          />
          <div className="mr-auto">
            <div className="assessmentsMobileSelectedAthlete__name">
              {selectedAthlete.firstname} {selectedAthlete.lastname}
            </div>
            <div className="assessmentsMobileSelectedAthlete__position">
              {selectedAthlete.position_group}
            </div>
          </div>
          <div className="assessmentsMobileSelectedAthlete__athletesButton">
            {t('#sport_specific__Athletes')}
          </div>
        </div>
      )}

      <div
        className={classNames('assessmentsAthletes', {
          'assessmentsAthletes--visibleOnMobile': showMobileAthleteSelection,
        })}
      >
        <h2 className="assessmentsAthletes__title">
          {t('#sport_specific__Athletes')}

          <div className="assessmentsAthletes__mobileCloseBtn">
            <IconButton
              icon="icon-close"
              onClick={() => {
                setShowMobileAthleteSelection(false);
              }}
              isSmall
              isTransparent
            />
          </div>
        </h2>
        <ul className="assessmentsAthletes__list">
          {athletes.map((athlete) => (
            <li
              key={athlete.id}
              className={classNames('assessmentsAthletes__athlete', {
                'assessmentsAthletes__athlete--selected':
                  athlete.id === selectedAthlete?.id,
              })}
              onClick={() => {
                if (athlete.id !== selectedAthlete?.id) {
                  onSelectAthleteId(athlete.id);
                  setSelectedAthlete(athlete);
                }
                setShowMobileAthleteSelection(false);
              }}
            >
              <img
                src={athlete.avatar_url}
                alt="Athlete avatar"
                className="assessmentsAthletes__picture"
              />
              <div>
                <div className="assessmentsAthletes__name">
                  {athlete.fullname}
                </div>
                <div className="assessmentsAthletes__position">
                  {athlete.position_group}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const AthletesListTranslated = withNamespaces()(AthletesList);
export default AthletesList;
