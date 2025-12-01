// @flow
import { withNamespaces } from 'react-i18next';

import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Dropdown, MultiSelectDropdown } from '@kitman/components';
import AthleteSelector from '../../../../containers/AthleteSelector';

type Props = {
  filteredPopulation: SquadAthletesSelection,
  filteredCompletion: 'completed' | 'uncompleted',
  filteredAnnotationTypes: Array<number>,
  annotationTypes: Array<Object>,
  onFilteredPopulationChange: Function,
  onFilteredCompletionChange: Function,
  onFilteredAnnotationTypesChange: Function,
};

const ActionsFilter = (props: I18nProps<Props>) => {
  return (
    <div className="row actionsWidget__filters">
      <div className="col-md-3 actionsWidget__filtersDropdown">
        <Dropdown
          label={props.t('Action status')}
          value={props.filteredCompletion}
          items={[
            {
              id: 'completed',
              title: props.t('Complete'),
            },
            {
              id: 'uncompleted',
              title: props.t('Not complete'),
            },
          ]}
          onChange={(completion) =>
            props.onFilteredCompletionChange(completion)
          }
        />
      </div>

      <div className="col-md-3 actionsWidget__filtersDropdown">
        <AthleteSelector
          data-testid="ActionsFilter|AthleteSelector"
          label={props.t('#sport_specific__Athletes')}
          showDropdownButton
          selectedSquadAthletes={props.filteredPopulation}
          onSelectSquadAthletes={(squadAthletesSelection) =>
            props.onFilteredPopulationChange(squadAthletesSelection)
          }
        />
      </div>

      <div className="col-md-3 actionsWidget__filtersDropdown">
        <MultiSelectDropdown
          label={props.t('Note type')}
          listItems={props.annotationTypes.filter(
            (annotationType) =>
              annotationType.type === 'OrganisationAnnotationTypes::Evaluation'
          )}
          onItemSelect={(item) => {
            const newAnnotationFilter = item.checked
              ? [...props.filteredAnnotationTypes, parseInt(item.id, 10)]
              : props.filteredAnnotationTypes.filter(
                  (annotationTypeId) =>
                    annotationTypeId !== parseInt(item.id, 10)
                );
            props.onFilteredAnnotationTypesChange(newAnnotationFilter);
          }}
          selectedItems={props.filteredAnnotationTypes.map((selectedItem) => {
            return selectedItem.toString();
          })}
        />
      </div>
    </div>
  );
};

export const ActionsFilterTranslated = withNamespaces()(ActionsFilter);
export default ActionsFilter;
