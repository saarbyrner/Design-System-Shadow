/* eslint-disable react/no-array-index-key */
// @flow
import {
  Dropdown,
  FormValidator,
  IconButton,
  RadioList,
  TextButton,
} from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type {
  DropdownItem,
  GroupedDropdownItem,
  GroupItems,
  MultiSelectDropdownItems,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { Metric } from '@kitman/common/src/types/Metric';
import type {
  DateRange,
  QuestionnaireVariable,
} from '@kitman/common/src/types';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { GraphGroup } from '@kitman/modules/src/analysis/shared/types';
import FormSection from '../FormSection';
import { MetricSectionTranslated as MetricSection } from '../MetricSection';
import { OverlaySectionTranslated as OverlaySection } from '../OverlaySection';
import { MedicalSectionTranslated as MedicalSection } from '../MedicalSection';

type Props = {
  graphGroup: GraphGroup,
  graphType: string,
  squadAthletes: SquadAthletes,
  permittedSquads: Array<Squad>,
  turnaroundList: Array<Turnaround>,
  deleteMetric: Function,
  updateStatus: Function,
  updateSquadSelection: Function,
  updateTimePeriod: Function,
  updateDateRange: Function,
  populateDrills: Function,
  updateEventBreakdown: Function,
  updateSelectedGames: Function,
  updateSelectedTrainingSessions: Function,
  addMetric: Function,
  addOverlay: Function,
  deleteOverlay: Function,
  addFilter: Function,
  removeFilter: Function,
  updateTimeLossFilters: Function,
  updateSessionTypeFilters: Function,
  updateCompetitionFilters: Function,
  loadPathologyOptions: Function,
  updateMetricStyle: Function,
  updateOverlaySummary: Function,
  updateOverlayPopulation: Function,
  updateOverlayTimePeriod: Function,
  updateOverlayDateRange: Function,
  populateDrillsForm: Function,
  populateTrainingSessions: Function,
  populateGames: Function,
  updateMeasurementType: Function,
  createGraph: Function,
  metrics: Array<Metric>,
  timePeriod: string,
  updateTimePeriodLength: Function,
  updateLastXTimePeriod: Function,
  updateTimePeriodLengthOffset: Function,
  updateLastXTimePeriodOffset: Function,
  dateRange: DateRange,
  availableVariables: Array<QuestionnaireVariable>,
  categorySelections: Array<GroupedDropdownItem>,
  athleteGroupsDropdown: Array<DropdownItem>,
  canAccessMedicalGraph: boolean,
  updateCategory: Function,
  updateCategoryDivision: Function,
  updateCategorySelection: Function,
  updateDataType: Function,
  sessionsTypes: MultiSelectDropdownItems,
  eventTypes: GroupItems,
  trainingSessionTypes: GroupItems,
  updateEventTypeFilters: Function,
  updateTrainingSessionTypeFilters: Function,
  timeLossTypes: MultiSelectDropdownItems,
  competitions: MultiSelectDropdownItems,
};

const CommonGraphForm = (props: I18nProps<Props>) => {
  const dataTypeLimit =
    props.graphGroup === 'longitudinal' || props.graphGroup === 'summary_bar'
      ? 16
      : 1;

  const acceptMultipleDataTypes =
    props.graphGroup === 'longitudinal' ||
    props.graphGroup === 'summary_bar' ||
    props.graphGroup === 'value_visualisation';

  const renderOverlaySection = (metric, index) => {
    if (
      props.graphGroup === 'value_visualisation' ||
      metric.type === 'medical'
    ) {
      return null;
    }

    const overlaySection = (
      <OverlaySection
        metricIndex={index}
        athleteGroupsDropdown={props.athleteGroupsDropdown}
        turnaroundList={props.turnaroundList}
        overlays={metric.overlays}
        addOverlay={() => props.addOverlay(index)}
        deleteOverlay={(overlayIndex) =>
          props.deleteOverlay(index, overlayIndex)
        }
        updateOverlaySummary={(overlayIndex, summary) =>
          props.updateOverlaySummary(index, overlayIndex, summary)
        }
        updateOverlayPopulation={(overlayIndex, population) =>
          props.updateOverlayPopulation(index, overlayIndex, population)
        }
        updateOverlayTimePeriod={(overlayIndex, timePeriod) =>
          props.updateOverlayTimePeriod(index, overlayIndex, timePeriod)
        }
        updateOverlayDateRange={(overlayIndex, dateRange) =>
          props.updateOverlayDateRange(index, overlayIndex, dateRange)
        }
        t={props.t}
      />
    );

    return metric.status.event_type_time_period !== 'training_session' &&
      metric.status.event_type_time_period !== 'game'
      ? overlaySection
      : null;
  };

  const metricSections = props.metrics.map((metric, index) => (
    <FormSection
      key={index}
      sectionNumber={
        dataTypeLimit > 1 && props.graphType !== 'combination'
          ? index + 1
          : null
      }
      sectionStyle={
        props.graphType === 'combination' ? metric.metric_style : null
      }
      border={dataTypeLimit > 1 ? 'bottom' : undefined}
    >
      {dataTypeLimit > 1 && (
        <div className="graphComposerFormSection__deleteMetricBtn">
          <IconButton
            icon="icon-close"
            onClick={() => {
              TrackEvent('Graph Builder', 'Click', 'Remove Icon');
              props.deleteMetric(index);
            }}
            isDisabled={props.metrics.length < 2}
            isSmall
            isTransparent
          />
        </div>
      )}

      {props.graphType === 'combination' && (
        <div className="row statusForm__row">
          <div className="col-xl-12">
            <RadioList
              radioName={`metric_style_${index}`}
              label={props.t('Type')}
              options={[
                {
                  name: props.t('Column'),
                  value: 'column',
                },
                {
                  name: props.t('Line'),
                  value: 'line',
                },
              ]}
              change={(metricStyle) =>
                props.updateMetricStyle(index, metricStyle)
              }
              value={metric.metric_style}
            />
          </div>
        </div>
      )}
      <div className="row statusForm__row">
        <div className="col-xl-3">
          {acceptMultipleDataTypes && props.canAccessMedicalGraph ? (
            <Dropdown
              items={[
                { id: 'metric', title: props.t('Metric Data') },
                { id: 'medical', title: props.t('Medical Data') },
              ]}
              onChange={(dataType) => props.updateDataType(dataType, index)}
              value={metric.type}
              label={props.t('Data type')}
            />
          ) : (
            <div className="graphComposerDropdownPlaceholder">
              <div className="graphComposerDropdownPlaceholder__label">
                {props.t('Data type')}
              </div>
              <div className="graphComposerDropdownPlaceholder__fakeDropdown">
                {metric.type === 'metric'
                  ? props.t('Metric Data')
                  : props.t('Medical Data')}
              </div>
            </div>
          )}
        </div>
      </div>

      {metric.type === 'medical' ? (
        <MedicalSection
          graphGroup={props.graphGroup}
          squadAthletes={props.squadAthletes}
          permittedSquads={props.permittedSquads}
          metric={metric}
          index={index}
          timePeriod={props.timePeriod}
          dateRange={props.dateRange}
          disableTimePeriod={index > 0}
          updateTimePeriod={props.updateTimePeriod}
          updateTimePeriodLength={props.updateTimePeriodLength}
          updateLastXTimePeriod={props.updateLastXTimePeriod}
          updateTimePeriodLengthOffset={props.updateTimePeriodLengthOffset}
          updateLastXTimePeriodOffset={props.updateLastXTimePeriodOffset}
          updateDateRange={props.updateDateRange}
          updateCategory={props.updateCategory}
          updateCategoryDivision={props.updateCategoryDivision}
          updateCategorySelection={props.updateCategorySelection}
          updateSquadSelection={props.updateSquadSelection}
          updateMeasurementType={props.updateMeasurementType}
          addFilter={props.addFilter}
          removeFilter={props.removeFilter}
          updateTimeLossFilters={props.updateTimeLossFilters}
          updateSessionTypeFilters={props.updateSessionTypeFilters}
          updateCompetitionFilters={props.updateCompetitionFilters}
          loadPathologyOptions={props.loadPathologyOptions}
          turnaroundList={props.turnaroundList}
          sessionsTypes={props.sessionsTypes}
          timeLossTypes={props.timeLossTypes}
          competitions={props.competitions}
          categorySelections={props.categorySelections}
          key={index}
        />
      ) : (
        <MetricSection
          graphGroup={props.graphGroup}
          squadAthletes={props.squadAthletes}
          metric={metric}
          dateRange={props.dateRange}
          index={index}
          disableTimePeriod={index > 0}
          updateStatus={props.updateStatus}
          updateSquadSelection={props.updateSquadSelection}
          updateTimePeriodLength={props.updateTimePeriodLength}
          updateLastXTimePeriod={props.updateLastXTimePeriod}
          updateTimePeriodLengthOffset={props.updateTimePeriodLengthOffset}
          updateLastXTimePeriodOffset={props.updateLastXTimePeriodOffset}
          updateDateRange={props.updateDateRange}
          populateDrills={props.populateDrills}
          updateSelectedGames={props.updateSelectedGames}
          updateSelectedTrainingSessions={props.updateSelectedTrainingSessions}
          updateEventBreakdown={props.updateEventBreakdown}
          populateDrillsForm={props.populateDrillsForm}
          populateTrainingSessions={props.populateTrainingSessions}
          populateGames={props.populateGames}
          turnaroundList={props.turnaroundList}
          availableVariables={props.availableVariables}
          addFilter={props.addFilter}
          removeFilter={props.removeFilter}
          eventTypes={props.eventTypes}
          trainingSessionTypes={props.trainingSessionTypes}
          updateEventTypeFilters={props.updateEventTypeFilters}
          updateTrainingSessionTypeFilters={
            props.updateTrainingSessionTypeFilters
          }
          key={index}
        />
      )}

      {renderOverlaySection(metric, index)}
    </FormSection>
  ));

  return (
    <FormValidator successAction={props.createGraph}>
      {metricSections}

      {dataTypeLimit > 1 && (
        <div className="graphComposer__addMetricBtn">
          <IconButton
            text={props.t('Data Type')}
            icon="icon-add"
            onClick={() => {
              TrackEvent('Graph Builder', 'Click', 'Add Metric');
              props.addMetric();
            }}
            isDisabled={props.metrics.length >= dataTypeLimit}
            isSmall
          />
        </div>
      )}

      <div className="graphComposer__formFooter">
        <TextButton
          text={props.t('Build Graph')}
          type="primary"
          onClick={() => TrackEvent('Graph Builder', 'Click', 'Build Graph')}
          isSubmit
        />
      </div>
    </FormValidator>
  );
};

export const CommonGraphFormTranslated = withNamespaces()(CommonGraphForm);
export default CommonGraphForm;
