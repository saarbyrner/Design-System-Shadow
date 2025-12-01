// @flow
import { useState, useEffect } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import Tippy from '@tippyjs/react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { Select, TextButton, TooltipMenu } from '@kitman/components';
import SummaryBarGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraph';
import type {
  MultiSelectDropdownItem,
  SelectOption,
} from '@kitman/components/src/types';
import SummaryBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarDefaultSortConfig';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { buildSummaryData } from '../../../RiskAdvisor/src/utils';
import { severityOptions } from '../../../RiskAdvisor/resources/filterOptions';
import {
  multiSelectExposureOptions,
  multiSelectMechanismOptions,
} from '../../resources/filterOptions';

type Props = {
  graphData: Object,
  fetchGraphData: Function,
  positionGroupsById: { string: string },
  bodyAreasById: { string: string },
  orgLogoPath: string,
  currentOrgName: string,
};

const App = (props: I18nProps<Props>) => {
  const [decoratedGraphData, setDecoratedGraphData] = useState(props.graphData);
  const [athleteId, setAthleteId] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  const [injuryRiskVariableUuid, setInjuryRiskVariableUuid] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const athleteIdParam = urlParams.get('athlete_id');
    const timeStampParam = urlParams.get('prediction_timestamp');
    const injuryRiskVariableUuidParam = urlParams.get(
      'injury_risk_variable_uuid'
    );
    const predictionTimeStamp = urlParams.get('prediction_timestamp');
    props.fetchGraphData(
      athleteIdParam,
      injuryRiskVariableUuidParam,
      predictionTimeStamp
    );
    if (athleteIdParam) {
      setAthleteId(athleteIdParam);
    }
    if (injuryRiskVariableUuidParam) {
      setInjuryRiskVariableUuid(injuryRiskVariableUuidParam);
    }
    if (timeStampParam) {
      const formattedTime = window.featureFlags['standard-date-formatting']
        ? DateFormatter.formatStandard({
            date: moment(parseInt(timeStampParam, 10) * 1000),
          })
        : moment(parseInt(timeStampParam, 10) * 1000).format('DD MMM YYYY');
      setTimeStamp(formattedTime);
    }
  }, []);

  useEffect(() => {
    if (props.graphData.metrics && props.graphData.metrics[0]) {
      setDecoratedGraphData(buildSummaryData(props.graphData));
    }
  }, [props.graphData]);

  const baseUrl = window.featureFlags['side-nav-update']
    ? '/analytics/injury_risk_contributing_factors'
    : '/settings/injury_risk_contributing_factors';

  const switchDates = (direction: 'NEXT' | 'PREV') => {
    const nextDate = props.graphData.next_day_timestamp || '';
    const prevDate = props.graphData.previous_day_timestamp || '';
    const targetUrl = `${baseUrl}?athlete_id=${athleteId}&injury_risk_variable_uuid=${injuryRiskVariableUuid}&prediction_timestamp=${
      direction === 'NEXT' ? nextDate : prevDate
    }`;
    window.location.assign(targetUrl);
  };

  const goToToday = () => {
    const today = moment().valueOf() / 1000;
    const targetUrl = `${baseUrl}?athlete_id=${athleteId}&injury_risk_variable_uuid=${injuryRiskVariableUuid}&prediction_timestamp=${today}`;
    window.location.assign(targetUrl);
  };

  const switchAthlete = (newAthleteId: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const timeStampParam = urlParams.get('prediction_timestamp') || '';
    const targetUrl = `${baseUrl}?athlete_id=${newAthleteId}&injury_risk_variable_uuid=${injuryRiskVariableUuid}&prediction_timestamp=${timeStampParam}`;
    window.location.assign(targetUrl);
  };

  const optionsById = (options: MultiSelectDropdownItem[] | SelectOption[]) => {
    return options.reduce((map, option) => {
      if (option.id) {
        return Object.assign(map, {
          [String(option.id)]: option.name || '',
        });
      }

      if (option.value) {
        return Object.assign(map, {
          [String(option.value)]: option.label || '',
        });
      }

      return map;
    }, {});
  };

  const exposuresById = optionsById(multiSelectExposureOptions());
  const mechanismsById = optionsById(multiSelectMechanismOptions());
  const severityById = optionsById(severityOptions());

  const getOptionDisplayText = (
    selection: ?Array<string>,
    source: Array<MultiSelectDropdownItem | SelectOption | string>,
    map: { string: string }
  ) => {
    // when all options are selected in filtering it's the equivalent of none is selected
    return selection &&
      selection?.length > 0 &&
      source.length !== selection.length &&
      map
      ? selection.map((id) => <span key={map[id]}>{map[id]}</span>)
      : null;
  };

  const formatRange = (startDate: moment, endDate: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatRange(startDate, endDate);
    }

    return `${startDate.format('D MMM YYYY')} - ${endDate.format(
      'D MMM YYYY'
    )}`;
  };

  return (
    <div className="contributingFactors">
      <div className="contributingFactors__printHeader">
        <div className="contributingFactors__printHeaderMain">
          <div className="contributingFactors__printHeaderAthlete">
            <span className="contributingFactors__printHeaderAthleteName">
              {props.graphData.dashboard_header.athlete_name}
            </span>
            <span className="contributingFactors__printHeadeOrgName">
              {props.currentOrgName}
            </span>
          </div>
          <div className="contributingFactors__printHeaderLogo">
            <img src={props.orgLogoPath} alt={props.currentOrgName} />
          </div>
        </div>
        <div className="contributingFactors__printHeaderDetails">
          <div className="contributingFactors__printHeaderDetailSection">
            <span className="contributingFactors__printHeaderDetailSectionTitle">
              {props.t('Title')}
            </span>
            <span>
              {props.graphData.dashboard_header.injury_risk_variable_name}
            </span>
          </div>
          <div className="contributingFactors__printHeaderDetailSection">
            <span className="contributingFactors__printHeaderDetailSectionTitle">
              {props.t('Risk Level')}
            </span>
            <span>{`${
              props.graphData.dashboard_header.injury_risk
                ? props.graphData.dashboard_header.injury_risk.toFixed(2)
                : 0
            }%`}</span>
          </div>
          <div className="contributingFactors__printHeaderDetailSection">
            <span className="contributingFactors__printHeaderDetailSectionTitle">
              {props.t('Date')}
            </span>
            <span>{timeStamp}</span>
          </div>
        </div>
      </div>

      <div className="contributingFactors__backBtn">
        <button type="button" onClick={() => window.history.back()}>
          <i className="icon-arrow-left" />
          {props.t('Back')}
        </button>
      </div>
      <div className="contributingFactors__header">
        <div className="contributingFactors__headerLeft">
          <h3>{props.graphData.dashboard_header.injury_risk_variable_name}</h3>
        </div>
        <div className="contributingFactors__headerRight">
          <TooltipMenu
            placement="bottom-start"
            offset={[10, 14]}
            tooltipTriggerElement={
              <TextButton
                text={props.t('Actions')}
                onClick={() => {}}
                iconAfter="icon-chevron-down"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
            menuItems={[
              {
                description: props.t('View Athlete'),
                href: `/athletes/${athleteId}/`,
              },
            ]}
          />
          {/* These features are temporarily hidden */}
          {/* <IconButton onClick={() => {}} icon="icon-settings" /> */}
          <TextButton
            text={props.t('Print')}
            onClick={() => {
              window.print();
            }}
            kitmanDesignSystem
          />
        </div>
      </div>
      <div className="contributingFactors__graphControls">
        <div className="contributingFactors__dateSwitcher">
          <TextButton
            onClick={() => switchDates('PREV')}
            iconAfter="icon-next-left"
            type="subtle"
            kitmanDesignSystem
            isDisabled={!props.graphData.previous_day_timestamp}
            testId="prev-day-btn"
          />
          <div className="contributingFactors__dateSwitcherDate">
            {timeStamp}
          </div>
          <TextButton
            onClick={() => switchDates('NEXT')}
            iconAfter="icon-next-right"
            type="subtle"
            kitmanDesignSystem
            isDisabled={!props.graphData.next_day_timestamp}
            testId="next-day-btn"
          />
        </div>
        <TextButton
          onClick={() => goToToday()}
          text={props.t('Today')}
          type="secondary"
          kitmanDesignSystem
        />
        <div className="contributingFactors__athleteChooser">
          <Select
            onChange={(id) => switchAthlete(id)}
            options={props.graphData.available_athletes || []}
            value={athleteId}
            label={props.t('Athlete')}
          />
        </div>
      </div>
      <div className="contributingFactors__graphContainer">
        <div className="contributingFactors__graphContainerHeader">
          <div className="contributingFactors__graphTitle">
            <span className="contributingFactors__riskRateTag">
              {`${props.graphData.dashboard_header.injury_risk?.toFixed(
                2
              )}% Injury Risk`}
            </span>
            <h4>{props.t('Contributing Factors')}</h4>
          </div>
          <div className="contributingFactors__analytics">
            <Tippy
              content={
                <div className="contributingFactors__analyticsTooltipContent">
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Date range')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {formatRange(
                        moment(
                          props.graphData.analytics_metadata.date_range
                            .start_date,
                          DateFormatter.dateTransferFormat
                        ),
                        moment(
                          props.graphData.analytics_metadata.date_range
                            .end_date,
                          DateFormatter.dateTransferFormat
                        )
                      )}
                    </div>
                  </div>
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Position Group')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {getOptionDisplayText(
                        props.graphData.analytics_metadata.position_group_ids,
                        Object.keys(props.positionGroupsById),
                        props.positionGroupsById
                      ) || props.t('All Position Groups')}
                    </div>
                  </div>
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Exposures')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {getOptionDisplayText(
                        props.graphData.analytics_metadata.exposures,
                        multiSelectExposureOptions(),
                        exposuresById
                      ) || props.t('All exposures')}
                    </div>
                  </div>
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Mechanism')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {getOptionDisplayText(
                        props.graphData.analytics_metadata.mechanisms,
                        multiSelectMechanismOptions(),
                        mechanismsById
                      ) || props.t('All mechanisms')}
                    </div>
                  </div>
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Body Area')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {getOptionDisplayText(
                        props.graphData.analytics_metadata.body_area_ids,
                        Object.keys(props.bodyAreasById),
                        props.bodyAreasById
                      ) || props.t('All body areas')}
                    </div>
                  </div>
                  {window.getFlag(
                    'risk-advisor-metric-creation-filter-on-injuries-causing-unavailability'
                  ) && (
                    <div className="contributingFactors__analyticsRow">
                      <div className="contributingFactors__analyticsKey">
                        {props.t('Severity')}
                      </div>
                      <div className="contributingFactors__analyticsValue">
                        {getOptionDisplayText(
                          props.graphData.analytics_metadata.severity,
                          severityOptions(),
                          severityById
                        ) || props.t('All severities')}
                      </div>
                    </div>
                  )}
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Injuries')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {props.graphData.analytics_metadata.injuries ||
                        props.t('All injuries')}
                    </div>
                  </div>
                  <div className="contributingFactors__analyticsRow">
                    <div className="contributingFactors__analyticsKey">
                      {props.t('Athlete')}
                    </div>
                    <div className="contributingFactors__analyticsValue">
                      {props.graphData.analytics_metadata.athletes ||
                        props.t('All Athletes')}
                    </div>
                  </div>
                </div>
              }
              placement="bottom"
              theme="blue-border-tooltip"
              maxWidth={380}
            >
              <span data-testid="analytics-tooltip-trigger">
                {props.t('Analytics')}
                <i className="icon-info" />
              </span>
            </Tippy>
          </div>
        </div>

        {props.graphData.error !== null ? (
          <div className="contributingFactors__noData">
            <p>{props.graphData.error}</p>
          </div>
        ) : (
          <div className="contributingFactors__graph">
            {decoratedGraphData.metrics && decoratedGraphData.metrics[0] && (
              <SummaryBarGraph
                graphSubType="INJURY_RISK_CONTRIBUTING_FACTORS"
                graphData={props.graphData}
                openRenameGraphModal={() => {}}
                graphType="column"
                canSaveGraph={false}
                showTitle={false}
                graphStyle={{}}
                sorting={SummaryBarDefaultSortConfig}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
