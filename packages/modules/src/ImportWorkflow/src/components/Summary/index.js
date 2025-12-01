// @flow
import type { Node } from 'react';

import { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import { TextButton } from '@kitman/components';
import { EventDateTranslated as EventDate } from '@kitman/modules/src/ImportWorkflow/src/components/EventDate';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Warning from '../shared/Warning';

import type {
  Event,
  SourceData,
  EventData,
  ThirdPartyEvent,
  SourceFormData,
} from '../../types';

type Props = {
  event: Event,
  sourceData: SourceData,
  sourceFormData: SourceFormData,
  onForward: Function,
  onBackward: Function,
  orgTimezone: string,
};

class Summary extends Component<I18nProps<Props>> {
  eventData(): EventData {
    // This is because the limitation of flow that does not recognize that
    // eventData can't be null at this point and keep complaning about it
    return ((this.props.sourceData.eventData: any): EventData);
  }

  eventDataEvent(): ThirdPartyEvent {
    return ((this.eventData().event: any): ThirdPartyEvent);
  }

  athletesCountContent() {
    return `${this.eventData().athletes.length} / ${
      this.eventData().nonSetupAthletesIdentifiers.length +
      this.eventData().athletes.length
    }`;
  }

  integrationInformation() {
    if (!this.props.sourceData.integrationData) return null;

    return (
      <div className="row importWorkflowSummary__panel">
        <div className="col-md-12">
          <div className="importWorkflowSummary__panelTitle">
            {this.props.t('Summary')}
          </div>
        </div>

        <div className="col-md-4">
          <h6 className="importWorkflowSummary__panelInfoLabel">
            {this.props.t('Name')}
          </h6>
          <div className="importWorkflowSummary__panelInfoValue">
            {this.eventDataEvent().type}
          </div>
        </div>

        <div className="col-md-4">
          <h6 className="importWorkflowSummary__panelInfoLabel">
            {this.props.t('Time')}
          </h6>
          <div className="importWorkflowSummary__panelInfoValue">
            <EventDate
              date={this.props.event.date}
              localTimezone={this.props.event.localTimezone}
              orgTimezone={this.props.orgTimezone}
              format="TIME"
            />
          </div>
        </div>

        <div className="col-md-4">
          <h6 className="importWorkflowSummary__panelInfoLabel">
            {this.props.t('Included participants')}
          </h6>
          <div className="importWorkflowSummary__panelInfoValue">
            {this.athletesCountContent()}
          </div>
        </div>
      </div>
    );
  }

  fileInformation() {
    const fileData = this.props.sourceData.fileData;
    if (!fileData) return null;

    const file = fileData.file;
    if (!file) return null;

    const fileSource = this.props.sourceFormData.fileSources[fileData.source];

    return (
      <div className="row importWorkflowSummary__panel">
        <div className="col-md-12">
          <div className="importWorkflowSummary__panelTitle">
            {this.props.t('Summary')}
          </div>
        </div>

        <div className="col-md-3">
          <h6 className="importWorkflowSummary__panelInfoLabel">
            {this.props.t('Included participants')}
          </h6>
          <div className="importWorkflowSummary__panelInfoValue">
            {this.athletesCountContent()}
          </div>
        </div>

        <div className="col-md-3">
          <h6 className="importWorkflowSummary__panelInfoLabel">
            {this.props.t('File type')}
          </h6>
          <div className="importWorkflowSummary__panelInfoValue">
            {fileSource}
          </div>
        </div>

        <div className="col-md-6">
          <h6 className="importWorkflowSummary__panelInfoLabel">
            {this.props.t('File name')}
          </h6>
          <div className="importWorkflowSummary__panelInfoValue">
            {file.name}
          </div>
        </div>
      </div>
    );
  }

  athletesContent() {
    if (!this.eventData().athletes.length) {
      return null;
    }

    return (
      <div className="importWorkflowSummary__inlcudedParticipants">
        <div className="importWorkflowSummary__inlcudedParticipantsTitle">
          <span className="icon-tick importWorkflowSummary__inlcudedParticipantsIcon" />
          {this.props.t('Included participants:')}{' '}
          {this.eventData().athletes.length}
        </div>

        {this.athleteNamesContent()}
      </div>
    );
  }

  athleteNamesContent() {
    const athleteNames = this.eventData()
      .athletes.map((athlete) => athlete.fullname)
      .sort();

    const athleteNamesItemContent = athleteNames.map((athleteName) => (
      <div key={athleteName}>
        <div className="importWorkflowSummary__athletesName">{athleteName}</div>
      </div>
    ));

    return (
      <div className="importWorkflowSummary__athletesContent">
        {athleteNamesItemContent}
      </div>
    );
  }

  sourceInformation() {
    switch (this.props.sourceData.type) {
      case 'FILE':
        return this.fileInformation();
      case 'INTEGRATION':
        return this.integrationInformation();
      default:
        return null;
    }
  }

  nonSetupAthletesContent(): Node {
    return this.eventData()
      .nonSetupAthletesIdentifiers.concat()
      .sort()
      .map((athleteIdentifier) => (
        <div key={athleteIdentifier}>{athleteIdentifier}</div>
      ));
  }

  missingAthletesContent() {
    if (!this.eventData().nonSetupAthletesIdentifiers.length) return null;

    return (
      <Warning
        title={`${this.props.t('Not found:')} ${
          this.eventData().nonSetupAthletesIdentifiers.length
        }`}
        description={this.props.t(
          '#sport_specific__Please_check_that_these_athlete_identifiers_are_correct_within_the_manage_athlete_area'
        )}
      >
        <div className="importWorkflowSummary__missingAthleteIdentifiers">
          {this.nonSetupAthletesContent()}
        </div>
      </Warning>
    );
  }

  render() {
    return (
      <div>
        <div className="importWorkflow__contentWrapper">
          {this.sourceInformation()}

          {this.missingAthletesContent()}

          {this.athletesContent()}
        </div>

        <hr className="importWorkflow__hr--full" />

        <div className="row">
          <div className="col-md-6">
            <TextButton
              type="secondary"
              text={this.props.t('Previous')}
              onClick={this.props.onBackward}
              iconBefore="icon-next-left"
            />
          </div>

          <div className="col-md-6 text-right">
            <TextButton
              type="primary"
              text={this.props.t('Start Import')}
              onClick={this.props.onForward}
            />
          </div>
        </div>
      </div>
    );
  }
}

export const SummaryTranslated = withNamespaces()(Summary);
export default Summary;
