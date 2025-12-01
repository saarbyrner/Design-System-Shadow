// @flow
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import _findIndex from 'lodash/findIndex';

import { Select } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import { getCodingSystemFilterOptions } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import { RehabExercisesFilterTranslated as RehabExercisesFilter } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters/RehabExercisesFilter';
import {
  Activity,
  BooleanFilter,
  Competition,
  ContactTypes,
  Grades,
  IllnessBodyArea,
  IllnessClassification,
  IllnessOnset,
  InjuryBodyArea,
  InjuryClassification,
  InjuryOnset,
  PositionWhenInjured,
  SessionTypes,
  Sides,
  SidesV2,
} from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters/FilterDefinitions';
import {
  IllnessCode,
  IllnessPathology,
  InjuryCode,
  InjuryPathology,
} from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/MedicalModule/Filters/AsyncFilters';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  TableWidgetSourceSubtypes,
  TableElementFilters,
  TableWidgetDataSource,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { isV2MultiCodingSystem } from '@kitman/modules/src/Medical/shared/utils';

import { MatchDayFilterTranslated as MatchDayFilter } from '../../../../TableWidget/components/PanelFilters/components/MatchDayFilter';

const styles = {
  marginTop: '10px',
  '.kitmanReactSelect': {
    display: 'flex',
    justifyContent: 'flex-end',
    '&__control': {
      minWidth: '180px',
      display: 'inline-flex',
    },
    '&__placeholder': {
      top: 0,
      transform: 'translate(0)',
      position: 'inherit',
      fontWeight: 'normal',
    },
  },
};

type Props = {
  selectedType: TableWidgetDataSource,
  subtypes: TableWidgetSourceSubtypes,
  filterSubTypes: TableElementFilters,
  onChangeSubType: (subtypeKey: string, value: Array<number>) => void,
  onChangeFilterSubType: (subtypeKey: string, value: Array<number>) => void,
  direction: 'column' | 'row',
  hideTitle?: boolean,
};

type SubtypeKey = $Keys<TableWidgetSourceSubtypes>;
type FiltersList = Array<SubtypeKey>;

const nonArrayFilters: FiltersList = ['recurrence', 'time_loss', 'maintenance'];

const getInitialFilterValues = (subtypes): FiltersList => {
  return Object.entries(subtypes).reduce((acc, curr) => {
    const [key, value] = curr;

    if (Array.isArray(value) && value.length) {
      // $FlowIgnore flow throws a weird error here about the key not being the right type
      return [...acc, key];
    }

    if (
      nonArrayFilters.includes(key) &&
      value != null &&
      !Array.isArray(value)
    ) {
      // $FlowIgnore array includes ensures type
      return [...acc, key];
    }

    return [...acc];
  }, []);
};

function Filters(props: I18nProps<Props>) {
  const [selectedSubtypes, setSelectedSubtypes] = useState<
    Array<$Keys<TableWidgetSourceSubtypes>>
  >(getInitialFilterValues({ ...props.subtypes, ...props.filterSubTypes }));

  const { organisation } = useOrganisation();

  const isMultiCodingEnabled = window.getFlag(
    'multi-coding-pipeline-table-widget'
  );

  const coding = isMultiCodingEnabled
    ? organisation.coding_system_key
    : codingSystemKeys.OSICS_10;

  const prefix = isMultiCodingEnabled ? '' : `${coding}_`;
  const codingSystemFilterOptions = getCodingSystemFilterOptions(coding);

  const options = useMemo(() => {
    const optionsMap = {
      MedicalInjury: [
        {
          label: props.t('Injury Details'),
          options: [
            ...codingSystemFilterOptions,
            { label: props.t('Side'), value: 'side_ids' },
            { label: props.t('Onset '), value: 'onset_ids' },
            { label: props.t('Grade'), value: 'bamic_grades' },
            { label: props.t('Recurrence'), value: 'recurrence' },
          ],
        },
        {
          label: props.t('Injury Event Details'),
          options: [
            { label: props.t('Session type'), value: 'activity_group_ids' },
            { label: props.t('Activity'), value: 'activity_ids' },
            {
              label: props.t('Position when injured'),
              value: 'position_when_injured_ids',
            },
            { label: props.t('Contact type'), value: 'contact_types' },
            { label: props.t('Competition'), value: 'competition_ids' },
            { label: props.t('Time Loss'), value: 'time_loss' },
          ],
        },
      ],
      MedicalIllness: [
        {
          label: props.t('Illness Details'),
          options: [
            ...codingSystemFilterOptions,
            { label: props.t('Side'), value: 'side_ids' },
            { label: props.t('Onset '), value: 'onset_ids' },
            { label: props.t('Time Loss'), value: 'time_loss' },
          ],
        },
      ],
      RehabSessionExercise: [
        {
          label: props.t('Exercise Details'),
          options: [
            {
              label: props.t('Exercises'),
              value: 'exercise_ids',
            },
            {
              label: props.t('Body area'),
              value: `${prefix}body_area_ids`,
            },
            {
              label: props.t('Maintenance'),
              value: 'maintenance',
            },
          ],
        },
      ],
    };

    if (window.getFlag('rep-match-day-filter')) {
      const matchDayFilter = {
        label: props.t('Game Day +/-'),
        value: 'match_days',
      };
      optionsMap.MedicalInjury[1].options.push(matchDayFilter);
      optionsMap.MedicalIllness[0].options.push(matchDayFilter);
    }

    if (Object.keys(optionsMap).includes(props.selectedType)) {
      // $FlowIgnore[prop-missing]
      return optionsMap[props.selectedType].map(({ label, options: opts }) => {
        return {
          label,
          options: opts.filter(
            ({ value }) => !selectedSubtypes.includes(value)
          ),
        };
      });
    }

    return [];
  }, [props.selectedType, selectedSubtypes]);
  const fullOptions = useMemo(() => {
    const isGrouped = _findIndex(options, (option) => !!option?.options) > -1;
    const opts = isGrouped
      ? options.flatMap((optionsGroup) => optionsGroup?.options || optionsGroup)
      : options;

    return opts;
  }, [options]);
  const previousTypeRef = useRef(props.selectedType);

  useEffect(() => {
    if (props.selectedType !== previousTypeRef.current) {
      previousTypeRef.current = props.selectedType;

      setSelectedSubtypes([]);
    }
  }, [props.selectedType]);

  const isSelected = useCallback(
    (key: SubtypeKey, keyToCheck: string, type?: TableWidgetDataSource) => {
      if (typeof type !== 'undefined') {
        return key === keyToCheck && props.selectedType === type;
      }

      return key === keyToCheck;
    },
    [props.selectedType]
  );
  const addFilter = (key: SubtypeKey) => {
    const newFilters = [...selectedSubtypes];
    newFilters.push(key);
    setSelectedSubtypes(newFilters);
  };
  const removeFilter = (key: string) => {
    const newFilters = [...selectedSubtypes];
    newFilters.splice(selectedSubtypes.indexOf(key), 1);
    setSelectedSubtypes(newFilters);
  };

  return (
    <>
      {!props.hideTitle && selectedSubtypes.length > 0 && <Panel.Divider />}
      {!props.hideTitle && selectedSubtypes.length > 0 && (
        <Panel.SectionTitle>{props.t('Filters')}</Panel.SectionTitle>
      )}
      {selectedSubtypes.map((key) => {
        if (isSelected(key, 'activity_group_ids', 'MedicalInjury')) {
          const subtype = 'activity_group_ids';
          return (
            <SessionTypes
              key="MedicalFilters|SessionTypes"
              data-testid="MedicalFilters|SessionTypes"
              label={props.t('Session Type')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'activity_ids', 'MedicalInjury')) {
          const subtype = 'activity_ids';
          return (
            <Activity
              key="MedicalFilters|Activity"
              data-testid="MedicalFilters|Activity"
              label={props.t('Activity')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}pathology_ids`, 'MedicalIllness')) {
          const subtype = `${prefix}pathology_ids`;
          return (
            <IllnessPathology
              key="MedicalFilters|IllnessPathology"
              data-testid="MedicalFilters|IllnessPathology"
              label={props.t('Pathology')}
              placeholder={props.t(
                'Search body part, body area, injury type...'
              )}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              queryArgs={[coding]}
              value={props.subtypes[subtype]}
              coding={coding}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}pathology_ids`, 'MedicalInjury')) {
          const subtype = `${prefix}pathology_ids`;
          return (
            <InjuryPathology
              key="MedicalFilters|InjuryPathology"
              data-testid="MedicalFilters|InjuryPathology"
              label={props.t('Pathology')}
              placeholder={props.t(
                'Search body part, body area, injury type...'
              )}
              value={props.subtypes[subtype]}
              queryArgs={[coding]}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              coding={coding}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}classification_ids`, 'MedicalIllness')) {
          const subtype = `${prefix}classification_ids`;
          return (
            <IllnessClassification
              key="MedicalFilters|IllnessClassification"
              data-testid="MedicalFilters|IllnessClassification"
              queryArgs={[coding]}
              label={props.t('Classification')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}classification_ids`, 'MedicalInjury')) {
          const subtype = `${prefix}classification_ids`;
          return (
            <InjuryClassification
              key="MedicalFilters|InjuryClassification"
              data-testid="MedicalFilters|InjuryClassification"
              queryArgs={[coding]}
              label={props.t('Classification')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}body_area_ids`, 'MedicalIllness')) {
          const subtype = `${prefix}body_area_ids`;
          return (
            <IllnessBodyArea
              key="MedicalFilters|IllnessBodyArea"
              data-testid="MedicalFilters|IllnessBodyArea"
              queryArgs={[coding]}
              label={props.t('Body Area')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}body_area_ids`, 'MedicalInjury')) {
          const subtype = `${prefix}body_area_ids`;
          return (
            <InjuryBodyArea
              key="MedicalFilters|InjuryBodyArea"
              data-testid="MedicalFilters|InjuryBodyArea"
              queryArgs={[coding]}
              label={props.t('Body Area')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}body_area_ids`, 'RehabSessionExercise')) {
          const subtype = `${prefix}body_area_ids`;
          return (
            <InjuryBodyArea
              key="MedicalFilters|InjuryBodyArea"
              data-testid="MedicalFilters|ExerciseBodyArea"
              queryArgs={[coding]}
              label={props.t('Body Area')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}code_ids`, 'MedicalIllness')) {
          const subtype = `${prefix}code_ids`;
          return (
            <IllnessCode
              key="MedicalFilters|IllnessCode"
              data-testid="MedicalFilters|IllnessCode"
              label={props.t('Code')}
              coding={coding}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, `${prefix}code_ids`, 'MedicalInjury')) {
          const subtype = `${prefix}code_ids`;
          return (
            <InjuryCode
              key="MedicalFilters|InjuryCode"
              data-testid="MedicalFilters|InjuryCode"
              label={props.t('Code')}
              coding={coding}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'side_ids')) {
          const subtype = 'side_ids';
          const SideComponent = isV2MultiCodingSystem(coding) ? SidesV2 : Sides;
          return (
            <SideComponent
              key="MedicalFilters|Sides"
              data-testid="MedicalFilters|Sides"
              label={props.t('Side')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'bamic_grades', 'MedicalInjury')) {
          const subtype = 'bamic_grades';
          return (
            <Grades
              key="MedicalFilters|Grades"
              data-testid="MedicalFilters|Grades"
              label={props.t('Grade')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'onset_ids', 'MedicalIllness')) {
          const subtype = 'onset_ids';
          return (
            <IllnessOnset
              key="MedicalFilters|IllnessOnset"
              data-testid="MedicalFilters|IllnessOnset"
              label={props.t('Onset')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'onset_ids', 'MedicalInjury')) {
          const subtype = 'onset_ids';
          return (
            <InjuryOnset
              key="MedicalFilters|InjuryOnset"
              data-testid="MedicalFilters|InjuryOnset"
              label={props.t('Onset')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'recurrence', 'MedicalInjury')) {
          const subtype = 'recurrence';
          return (
            <BooleanFilter
              key="MedicalFilters|Recurrence"
              data-testid="MedicalFilters|Recurrence"
              label={props.t('Recurrence')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              options={[
                { label: props.t('New Injury'), value: false },
                { label: props.t('Recurrence'), value: true },
              ]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'position_when_injured_ids', 'MedicalInjury')) {
          const subtype = 'position_when_injured_ids';
          return (
            <PositionWhenInjured
              key="MedicalFilters|PositionWhenInjured"
              data-testid="MedicalFilters|PositionWhenInjured"
              label={props.t('Position when injured')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'contact_types', 'MedicalInjury')) {
          const subtype = 'contact_types';
          return (
            <ContactTypes
              key="MedicalFilters|ContactType"
              data-testid="MedicalFilters|ContactType"
              label={props.t('Contact type')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes.contact_types}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'competition_ids', 'MedicalInjury')) {
          const subtype = 'competition_ids';
          return (
            <Competition
              key="MedicalFilters|Competition"
              data-testid="MedicalFilters|Competition"
              label={props.t('Competition')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'time_loss')) {
          const subtype = 'time_loss';
          return (
            <BooleanFilter
              key="MedicalFilters|TimeLoss"
              data-testid="MedicalFilters|TimeLoss"
              label={props.t('Time Loss')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              options={[
                { label: props.t('Time-loss'), value: true },
                { label: props.t('Non time-loss'), value: false },
              ]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'exercise_ids', 'RehabSessionExercise')) {
          const subtype = 'exercise_ids';
          return (
            <RehabExercisesFilter
              key="RehabFilters|Exercises"
              organisationId={organisation.id}
              onChange={(newValue: Array<number>) =>
                props.onChangeSubType(subtype, newValue)
              }
              value={props.subtypes[subtype] || []}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'maintenance', 'RehabSessionExercise')) {
          const subtype = 'maintenance';
          return (
            <BooleanFilter
              key="RehabFilters|Maintenance"
              label={props.t('Maintenance')}
              onChange={(newValue) => props.onChangeSubType(subtype, newValue)}
              value={props.subtypes[subtype]}
              options={[
                { label: props.t('Maintenance'), value: true },
                { label: props.t('Rehabs and Maintenance'), value: false },
              ]}
              onClickRemove={() => {
                props.onChangeSubType(subtype, []);
                removeFilter(subtype);
              }}
            />
          );
        }

        if (isSelected(key, 'match_days')) {
          const subtype = 'match_days';
          return (
            window.getFlag('rep-match-day-filter') && (
              <MatchDayFilter
                key="MedicalFilters|MatchDayFilter"
                data-testid="MatchDayFilters"
                selectedMatchDays={props.filterSubTypes[subtype] ?? []}
                onSelectMatchDays={(newValue) =>
                  props.onChangeFilterSubType(subtype, newValue)
                }
                includeIconConfig={{
                  iconName: 'icon-close',
                  onClick: () => {
                    props.onChangeFilterSubType(subtype, []);
                    removeFilter(subtype);
                  },
                }}
              />
            )
          );
        }

        return null;
      })}

      {fullOptions.length > 0 && (
        <Panel.Field styles={styles}>
          <Select
            key="MedicalFilters|ApplyFiltersSelect"
            data-testid="MedicalFilters|ApplyFiltersSelect"
            options={options}
            onChange={addFilter}
            value={null}
            placeholder={props.t('Add filter')}
            menuPosition="fixed"
            appendToBody
          />
        </Panel.Field>
      )}
    </>
  );
}

export const FiltersTranslated = withNamespaces()(Filters);
export default Filters;
