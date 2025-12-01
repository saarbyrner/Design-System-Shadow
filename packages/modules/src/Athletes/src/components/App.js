// @flow

import {useState} from 'react';
import {withNamespaces} from 'react-i18next';
import {TextButton} from '@kitman/components';
import type {AthleteSelectorPositionGroup} from '@kitman/components/src/types';
import type {I18nProps} from '@kitman/common/src/types/i18n';

import {AthletesListNewTranslated} from "@kitman/playbook/components/AthletesList";
import {AthletesFiltersTranslated as AthletesFilters} from './AthletesFilters';
import type {Athlete} from '../types';
import AthletesList from './AthletesList';

type Props = {
  athletes: Array<Athlete>,
  positionGroups: Array<AthleteSelectorPositionGroup>,
};

const App = (props: I18nProps<Props>) => {
  const [athletes, setAthletes] = useState(props.athletes);
  const [searchChars, setSearchChars] = useState('');

  const handleSearch = (chars: string) => {
    const loweredChars = chars.toLowerCase();

    setSearchChars(loweredChars);
    setAthletes(
        props.athletes.filter((athlete) =>
            athlete.fullname.toLowerCase().includes(loweredChars)
        )
    );
  };

  return (
      <>
        {!window.getFlag('show-new-athletes-list') && (
            <div className="athletes">
              {props.athletes.length > 0 ? (
                  <>
                    <AthletesFilters
                        areSideFiltersShowed={false}
                        positionGroups={props.positionGroups}
                        onSearch={handleSearch}
                        searchChars={searchChars}
                    />
                    <AthletesList athletes={athletes}/>
                  </>
              ) : (
                  <div className="athletes__noAthletes">
                    <h4>{props.t('There are no athletes within this squad')}</h4>
                    <TextButton
                        onClick={() => {
                          window.location.href = '/settings/athletes/new';
                        }}
                        text={props.t('Add Athletes')}
                        type="primary"
                        kitmanDesignSystem
                    />
                  </div>
              )}
            </div>
        )}

        {window.getFlag('show-new-athletes-list') && (
            <AthletesListNewTranslated athletes={props.athletes}/>
        )}
      </>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
