// @flow
import { withNamespaces } from 'react-i18next';

import {
  AthleteSelector,
  Dropdown,
  GroupedDropdown,
  LastXPeriodOffset,
} from '@kitman/components';

import {
  getMedicalCategories,
  getMedicalCategoryName,
  getCategoryDivisionOptions,
} from '@kitman/modules/src/analysis/shared/utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import TimePeriod from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/TimePeriod';
import { FilterSectionTranslated as FilterSection } from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/FilterSection';

// Types
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DateRange } from '@kitman/common/src/types';
import type { Metric } from '@kitman/common/src/types/Metric';
import type { Squad } from '@kitman/common/src/types/Squad';
import type {
  GroupedDropdownItem,
  MultiSelectDropdownItems,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { GraphGroup } from '@kitman/modules/src/analysis/shared/types';

type Props = {
  metric: Metric,
  index: number,
  graphGroup: GraphGroup,
  turnaroundList: Array<Turnaround>,
  updateTimePeriod: Function,
  updateDateRange: Function,
  timePeriod: string,
  dateRange: DateRange,
  disableTimePeriod: boolean,
  updateTimePeriodLength: Function,
  updateLastXTimePeriod: Function,
  updateTimePeriodLengthOffset: Function,
  updateLastXTimePeriodOffset: Function,
  squadAthletes: SquadAthletes,
  permittedSquads: Array<Squad>,
  categorySelections: Array<GroupedDropdownItem>,
  updateSquadSelection: Function,
  updateCategory: Function,
  updateCategorySelection: Function,
  updateCategoryDivision: Function,
  updateMeasurementType: Function,
  updateTimeLossFilters: Function,
  updateSessionTypeFilters: Function,
  updateCompetitionFilters: Function,
  loadPathologyOptions: Function,
  addFilter: Function,
  removeFilter: Function,
  sessionsTypes: MultiSelectDropdownItems,
  timeLossTypes: MultiSelectDropdownItems,
  competitions: MultiSelectDropdownItems,
};

const MedicalSection = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();
  const isClinicalImpressions =
    organisation.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS;
  const isOSICS = organisation.coding_system_key === codingSystemKeys.OSICS_10;
  const excludeClassifications =
    organisation.coding_system_key === codingSystemKeys.ICD &&
    window.getFlag('multi-coding-pipepline-graph');

  const medicalCategories = getMedicalCategories({
    excludeGlobalCategories: props.graphGroup === 'summary_stack_bar',
    onlyGlobalCategories: props.graphGroup === 'longitudinal',
    excludeGeneralMedical:
      !window.getFlag('graphing-diagnostics-interventions') ||
      props.graphGroup !== 'value_visualisation',
    excludeIllnesses: isClinicalImpressions,
    excludeClassifications,
  });

  const isCategoryPathology = props.metric.category === 'pathology';
  const minimumLettersForSearch = 3;
  const onPathologySearch = useDebouncedCallback((value: string) => {
    if (value.length >= minimumLettersForSearch) {
      props.loadPathologyOptions(value, organisation.coding_system_key);
    }
  }, 400);

  return (
    <div data-testid="MedicalSection">
      <div className="row statusForm__row">
        <TimePeriod
          metricIndex={props.index}
          turnaroundList={props.turnaroundList}
          updateTimePeriod={props.updateTimePeriod}
          updateDateRange={props.updateDateRange}
          timePeriod={props.timePeriod}
          timePeriodLength={props.metric.time_period_length || null}
          onUpdateTimePeriodLength={props.updateTimePeriodLength}
          lastXTimePeriod={props.metric.last_x_time_period || 'days'}
          onUpdateLastXTimePeriod={props.updateLastXTimePeriod}
          dateRange={props.dateRange}
          disableTimePeriod={props.disableTimePeriod}
          t={props.t}
        />
      </div>
      {window.getFlag('graphing-offset-calc') &&
        props.timePeriod === TIME_PERIODS.lastXDays && (
          <div className="row statusForm__row">
            <LastXPeriodOffset
              disabled={props.graphGroup !== 'summary' && props.index > 0}
              metricIndex={props.index}
              timePeriodLengthOffset={props.metric.time_period_length_offset}
              onUpdateTimePeriodLengthOffset={
                props.updateTimePeriodLengthOffset
              }
              lastXTimePeriodOffset={
                props.metric.last_x_time_period_offset || 'days'
              }
              onUpdateLastXTimePeriodOffset={props.updateLastXTimePeriodOffset}
              radioName={`rollingDateOffsetRadios__${props.index}`}
            />
          </div>
        )}
      <div className="row statusForm__row">
        <div className="col-xl-6">
          <AthleteSelector
            label={props.t('#sport_specific__Athletes')}
            squadAthletes={props.squadAthletes}
            squads={props.permittedSquads}
            selectedSquadAthletes={props.metric.squad_selection}
            onSelectSquadAthletes={(squadAthletesSelection) => {
              props.updateSquadSelection(props.index, squadAthletesSelection);
            }}
            singleSelection={
              props.graphGroup === 'summary_donut' ||
              props.graphGroup === 'value_visualisation'
            }
          />
        </div>
      </div>
      <div className="row statusForm__row">
        <div className="col-xl-4">
          <GroupedDropdown
            label={props.t('Category')}
            options={medicalCategories}
            onChange={(option) => {
              let category;
              let mainCategory;
              if (option.key_name.includes('injury_group__')) {
                category = option.key_name.replace('injury_group__', '');
                mainCategory = 'injury';
              } else if (option.key_name.includes('illness_group__')) {
                category = option.key_name.replace('illness_group__', '');
                mainCategory = 'illness';
              } else if (option.key_name.includes('general_medical_group__')) {
                category = option.key_name.replace(
                  'general_medical_group__',
                  ''
                );
                mainCategory = 'general_medical';
              }

              props.updateCategory(props.index, category, mainCategory);
            }}
            value={
              props.metric.main_category && props.metric.category
                ? `${props.metric.main_category}_group__${props.metric.category}`
                : null
            }
          />
        </div>
        {props.graphGroup === 'summary_stack_bar' && (
          <div className="col-xl-4">
            <Dropdown
              label={props.t('Category Division')}
              items={getCategoryDivisionOptions({
                mainCategory: props.metric.main_category,
                subCategory: props.metric.category,
                excludeClassifications,
              })}
              onChange={(categoryDivision) =>
                props.updateCategoryDivision(props.index, categoryDivision)
              }
              value={props.metric.category_division}
              disabled={!props.metric.main_category}
              ignoreValidation
              optional
            />
          </div>
        )}

        {props.graphGroup === 'value_visualisation' &&
          props.metric.category &&
          props.metric.category !== 'all_injuries' &&
          props.metric.category !== 'all_illnesses' && (
            <div
              className="col-xl-6"
              data-testid="MedicalCategory|GroupedDropdown"
            >
              <GroupedDropdown
                options={props.categorySelections}
                label={getMedicalCategoryName(props.metric.category)}
                value={props.metric.category_selection}
                onChange={(option) =>
                  props.updateCategorySelection(props.index, option.id)
                }
                onSearch={
                  isCategoryPathology && !isOSICS ? onPathologySearch : null
                }
                minimumLettersForSearch={
                  isCategoryPathology ? minimumLettersForSearch : 0
                }
                searchable
              />
            </div>
          )}
      </div>
      {props.graphGroup === 'summary_donut' && (
        <div className="row statusForm__row">
          <div className="col-xl-4">
            <Dropdown
              label={props.t('Measurement Value')}
              items={[
                {
                  id: 'percentage',
                  title: props.t('Percentage'),
                },
                {
                  id: 'raw',
                  title: props.t('Raw'),
                },
              ]}
              onChange={(measurementType) =>
                props.updateMeasurementType(props.index, measurementType)
              }
              value={props.metric.measurement_type}
            />
          </div>
        </div>
      )}

      {props.graphGroup === 'value_visualisation' && (
        <div className="row statusForm__row">
          <div className="col-xl-6">
            <Dropdown
              items={[
                {
                  id: 'count',
                  title: props.t('Count'),
                },
              ]}
              onChange={() => {}}
              value={props.metric.calculation}
              label={props.t('Calculation')}
              disabled
            />
          </div>
        </div>
      )}

      {window.getFlag('graphing-diagnostics-interventions') &&
      props.metric.main_category === 'general_medical' ? null : (
        <FilterSection
          metricType={props.metric.type}
          filters={props.metric.filters}
          addFilter={() => props.addFilter(props.index)}
          removeFilter={() => props.removeFilter(props.index)}
          updateTimeLossFilters={(timeLossFilters) => {
            props.updateTimeLossFilters(props.index, timeLossFilters);
          }}
          updateSessionTypeFilters={(sessionTypeFilters) => {
            props.updateSessionTypeFilters(props.index, sessionTypeFilters);
          }}
          updateCompetitionFilters={(competitionFilters) => {
            props.updateCompetitionFilters(props.index, competitionFilters);
          }}
          sessionsTypes={props.sessionsTypes}
          timeLossTypes={props.timeLossTypes}
          competitions={props.competitions}
          medicalCategory={props.metric.main_category}
        />
      )}
    </div>
  );
};

export const MedicalSectionTranslated = withNamespaces()(MedicalSection);
export default MedicalSection;
