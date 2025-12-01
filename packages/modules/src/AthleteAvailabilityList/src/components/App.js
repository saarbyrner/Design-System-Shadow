// @flow
import moment from 'moment';
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import {
  AthleteFilters,
  IconButton,
  PageHeader,
  PrintHeader,
} from '@kitman/components';
import type {
  AthleteFilterOptions,
  AvailabilityFilterOptions,
} from '@kitman/common/src/types/__common';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { GroupBy } from '@kitman/common/src/types/index';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import Toast from '../containers/Toast';
import AvailabilityTable from '../containers/AvailabilityTable';
import AddAbsenceModal from '../containers/AddAbsenceModal';
import AddNoteModal from '../containers/AddNoteModal';
import ModInfoModal from '../containers/ModInfoModal';
import RPTModal from '../containers/RPTModal';
import TreatmentSessionModal from '../containers/TreatmentSessionModal';
import AddDiagnosticInterventionModal from '../containers/AddDiagnosticInterventionModal';
import InjuryUploadModal from '../containers/InjuryUploadModal';
import AppStatus from '../containers/AppStatus';

import type { Athlete } from '../../types';

type Props = {
  isLoading: boolean,
  canManageIssues: boolean,
  loadAthletes: Function,
  athletes: {
    all: Array<Athlete>,
    grouped: {
      position: { [string]: Array<Athlete> },
      positionGroup: { [string]: Array<Athlete> },
      availability: { [string]: Array<Athlete> },
      last_screening: { [string]: Array<Athlete> },
      name: { [string]: Array<Athlete> },
    },
    currentlyVisible: { [string]: Array<Athlete> },
    groupBy: GroupBy,
    groupOrderingByType: { [GroupBy]: Array<string> },
    isFilterShown: boolean,
    athleteFilters: Array<?AthleteFilterOptions>,
    availabilityFilters: Array<AvailabilityFilterOptions>,
    groupingLabels: { string: string },
    availabilityByPositionGroup: { [string]: number },
    availabilityByPosition: { [string]: number },
    orgLogoPath: string,
    totalAvailableAthletes: string,
    totalAthleteCount: string,
    squadAvailabilityPercentage: string,
    currentOrgName: string,
    currentSquadName: string,
    currentUserName: string,
  },
  toggleAthleteFilters: Function,
  updateFilterOptions: Function,
  openInjuryUploadModal: Function,
};

const App = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    props.loadAthletes();
  }, []);

  const renderAvailabilityTable = () => {
    return props.athletes.all.length > 0 ? (
      <AvailabilityTable />
    ) : (
      <div className="availabilityList__emptyList">
        {!props.isLoading && (
          <>
            <p>
              {props.t(
                '#sport_specific__There_are_no_athletes_within_this_squad'
              )}
            </p>
            <a
              className="btn km-btn km-btn-primary km-btn-small"
              href="/settings/athletes"
            >
              {props.t('#sport_specific__Add_Your_First_Athlete')}
            </a>
          </>
        )}
      </div>
    );
  };

  const classes = classNames('availabilityList__header', {
    'availabilityList__header--expanded': props.athletes.isFilterShown === true,
  });

  const formatDateWithTime = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
        showTime: true,
      });
    }

    return date.format('D MMM YYYY HH:mm a');
  };

  return (
    <div className="availabilityList">
      <div>
        <PageHeader>
          <div className={classes}>
            <div className="availabilityList__titleContainer">
              <h3>
                <span>{props.t('Current availability:')}</span>
                {props.t(
                  '{{totalAvailableAthletes}}/{{totalAthleteCount}} ({{squadAvailabilityPercentage}}%) of the squad',
                  {
                    totalAvailableAthletes:
                      props.athletes.totalAvailableAthletes,
                    totalAthleteCount: props.athletes.totalAthleteCount,
                    squadAvailabilityPercentage:
                      props.athletes.squadAvailabilityPercentage,
                  }
                )}
              </h3>
              <div className="availabilityList__headerBtnContainer">
                <IconButton
                  onClick={() =>
                    props.toggleAthleteFilters(props.athletes.isFilterShown)
                  }
                  isActive={props.athletes.athleteFilters.length > 0}
                  icon="icon-filter"
                />
                <IconButton
                  onClick={() => {
                    props.openInjuryUploadModal();
                    trackEvent('Click Import Injuries icon');
                  }}
                  icon="icon-upload"
                />
                <IconButton
                  onClick={() => {
                    window.print();
                  }}
                  icon="icon-print"
                />
              </div>
            </div>
            <AthleteFilters
              athletes={props.athletes.all}
              isExpanded={props.athletes.isFilterShown}
              selectedGroupBy={props.athletes.groupBy}
              selectedAthleteFilters={props.athletes.athleteFilters}
              selectedAvailabilityFilters={props.athletes.availabilityFilters}
              updateFilterOptions={props.updateFilterOptions}
              showAlarmFilter={false}
              showAvailabilityFilter
            />
          </div>
        </PageHeader>

        <PrintHeader
          logoPath={props.athletes.orgLogoPath}
          titleContent={
            <div>
              <strong className="availabilityListPrint__headerItemTitle">
                {props.t('#sport_specific__Squad_Availability')}
              </strong>
              <div className="availabilityListPrint__headerItemText">
                {props.t(
                  'Current availability: {{totalAvailableAthletes}}/{{totalAthleteCount}} ({{squadAvailabilityPercentage}}%) of the squad',
                  {
                    totalAvailableAthletes:
                      props.athletes.totalAvailableAthletes,
                    totalAthleteCount: props.athletes.totalAthleteCount,
                    squadAvailabilityPercentage:
                      props.athletes.squadAvailabilityPercentage,
                  }
                )}
              </div>
            </div>
          }
          items={[
            {
              title: props.t('Organisation'),
              value: props.athletes.currentOrgName,
            },
            {
              title: props.t('#sport_specific__Squad'),
              value: props.athletes.currentSquadName,
            },
            {
              title: props.t('Report by'),
              value: props.athletes.currentUserName,
            },
            {
              title: props.t('Report date'),
              value: formatDateWithTime(moment()),
            },
          ]}
        />

        {renderAvailabilityTable()}
        <AddAbsenceModal />
        <AddNoteModal />
        <InjuryUploadModal />
        <ModInfoModal />
        <RPTModal />
        <AddDiagnosticInterventionModal />
        <TreatmentSessionModal />
        <AppStatus />
        <Toast />
      </div>

      {/*
       * This is duplicated from Rails views. Those are used to mount medical modals and show the data loader.
       * We should revisit the way that we render those modals and move them to the React component
       * once they are no longer rendered in the Rails view.
       */}
      <div
        className="appStatus appStatus--saving isActive js-athleteIssueEditLoader js-athleteIssueDetailsLoader"
        style={{ display: 'none' }}
      >
        <div className="appStatus-bg" />
        <div className="appStatus-cont">{props.t('Loading ...')}</div>
      </div>
      <div id="athleteIssueEditorContainer" />
      <div
        id="athleteIssueDetailsContainer"
        data-issue-admin-permission={props.canManageIssues}
      />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
