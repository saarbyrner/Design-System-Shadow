// @flow
import { useState, useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import _cloneDeep from 'lodash/cloneDeep';
import { useSelector } from 'react-redux';

import { AthleteSelector, SlidingPanel, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import SquadAthletesContext from '../../contexts/SquadAthletesContext';

type Props = {
  selectedAthleteIds: Array<string>,
  onSave: Function,
  onClose: Function,
};

const emptySquadAthletes: SquadAthletesSelection = {
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
};

const AddAthletesSidePanel = (props: I18nProps<Props>) => {
  const athletes = useSelector((state) => state.athletes);
  const squadAthletes = useContext(SquadAthletesContext);

  const [selectedSquadAthletes, setSelectedSquadAthletes] = useState(
    _cloneDeep({ ...emptySquadAthletes, athletes: props.selectedAthleteIds })
  );

  const onClickSave = () => {
    const selectedAthletes = athletes.filter((athlete) => {
      // $FlowFixMe athlete.id exists
      return selectedSquadAthletes.athletes.includes(athlete.id) && athlete;
    });

    props.onSave(selectedAthletes);
    props.onClose();
  };

  return (
    <div className="assessmentsAthleteSidePanel">
      <SlidingPanel
        isOpen
        title={props.t('Add Athletes')}
        togglePanel={() => props.onClose()}
      >
        <AthleteSelector
          squadAthletes={squadAthletes}
          showDropdownButton={false}
          selectedSquadAthletes={selectedSquadAthletes}
          onSelectSquadAthletes={(
            currentSelectedSquadAthletes: SquadAthletesSelection
          ) => setSelectedSquadAthletes(currentSelectedSquadAthletes)}
          onlyAthletes
        />
        <div className="slidingPanelActions">
          <div className="slidingPanelActions__apply">
            <TextButton
              onClick={onClickSave}
              type="primary"
              text={props.t('Save')}
              kitmanDesignSystem
            />
          </div>
        </div>
      </SlidingPanel>
    </div>
  );
};

export default AddAthletesSidePanel;
export const AddAthletesSidePanelTranslated =
  withNamespaces()(AddAthletesSidePanel);
