// @flow

import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';

import { AppStatus, OptionChooser, TextButton } from '@kitman/components';

import { transformSourceFormDataIntegrationsResponse } from '@kitman/modules/src/ImportWorkflow/src/utils';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { FileTranslated as File } from './sources/File';
import { DateBasedIntegrationTranslated as DateBasedIntegration } from './sources/DateBasedIntegration';

import type {
  Event,
  EventList,
  SourceFormData,
  SourceData,
  IntegrationData,
  FileData,
} from '../../types';

type Props = {
  event: Event,
  events: EventList,
  onEventsLoad: Function,
  onFail: Function,
  sourceFormData: SourceFormData,
  onSourceFormDataLoad: Function,
  sourceData: SourceData,
  onSourceDataChange: Function,
  onEventDataChange: Function,
  onForward: Function,
  onBackward: Function,
  orgTimezone: string,
};

type State = {
  loading: boolean,
};

const sourceImageMapping = {
  catapult: '/img/sources/catapult.png',
  firstbeat: '/img/sources/firstbeat.png',
  forcedecks: '/img/sources/forcedecks.png',
  gymaware: '/img/sources/gymaware.png',
  omegawave: '/img/sources/omegawave.svg',
  statsports: '/img/sources/statsports.png',
  vald: '/img/sources/vald.png',
  kinexon: '/img/sources/kinexon.png',
  kangatech: '/img/sources/kangatech.png',
  push: '/img/sources/push.png',
  champion: '/img/sources/champion.png',
  oura: '/img/sources/oura.png',
  playmaker: '/img/sources/playermaker.png',
  statsbomb: '/img/sources/statsbomb.png',
  wimu: '/img/sources/wimu.png',
  vald_dynamo: '/img/sources/dynamo.png',
  vald_smartspeed: '/img/sources/smartspeed.png',
  hawkin_dynamics: '/img/sources/hawkin.png',
};

class SourceSelection extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      loading: false,
    };

    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleFileDataChange = this.handleFileDataChange.bind(this);
  }

  componentDidMount() {
    this.loadFormData();
  }

  handleFileDataChange = (fileData: FileData) => {
    const newSourceData = Object.assign({}, this.props.sourceData, {
      fileData,
    });
    this.props.onSourceDataChange(newSourceData);
  };

  handleBackwardClick = () => {
    this.props.onBackward();
  };

  handleSourceChange = (value: string) => {
    const splitedValue = value.split('|');
    const type = splitedValue[0];
    const thirdPartySourceId = type === 'INTEGRATION' ? splitedValue[1] : '';
    const sourceData = Object.assign(
      {},
      this.props.sourceData,
      this.sourceDataAttributes(type, thirdPartySourceId)
    );
    this.props.onSourceDataChange(sourceData);
  };

  sourceContent() {
    switch (this.props.sourceData.type) {
      case 'FILE':
        return this.fileContent();
      case 'INTEGRATION':
        return this.dateBasedIntegrationContent();
      default:
        return this.defaultFooter();
    }
  }

  dateBasedIntegrationContent() {
    return (
      <DateBasedIntegration
        event={this.props.event}
        events={this.props.events}
        onEventsLoad={this.props.onEventsLoad}
        integrationData={this.props.sourceData.integrationData}
        onFail={this.props.onFail}
        onForward={this.props.onForward}
        onBackward={this.handleBackwardClick}
        orgTimezone={this.props.orgTimezone}
      />
    );
  }

  fileContent() {
    return (
      <File
        sourceData={this.props.sourceData}
        onFileDataChange={this.handleFileDataChange}
        sourceFormData={this.props.sourceFormData}
        onEventDataChange={this.props.onEventDataChange}
        onForward={this.props.onForward}
        onFail={this.props.onFail}
      />
    );
  }

  defaultFooter() {
    return (
      <div className="sourceSelection__footerWrapper">
        <hr className="importWorkflow__hr--full" />

        <div className="row">
          <div className="offset-md-6 col-md-6 text-right">
            <TextButton
              type="primary"
              text={this.props.t('Next')}
              onClick={this.props.onForward}
              iconAfter="icon-next-right"
              isDisabled
            />
          </div>
        </div>
      </div>
    );
  }

  loadFormData() {
    if (this.props.sourceFormData.loaded) return;
    this.setState({ loading: true });
    $.get(
      '/workloads/import_workflow/source_form_data',
      (data) => this.loadFormDataSuccess(data),
      'json'
    );
  }

  loadFormDataSuccess(data: Object) {
    this.props.onSourceFormDataLoad(this.buildSourceFormData(data));
    this.setState({ loading: false });
  }

  buildSourceFormData(data: Object): SourceFormData {
    return {
      loaded: true,
      integrations: transformSourceFormDataIntegrationsResponse(
        data.integrations
      ),
      fileSources: data.file_sources,
    };
  }

  sourceOptions(): Array<Object> {
    let options = this.fileSourceOptions();
    options = options.concat(this.integrationOptions());
    return options;
  }

  fileSourceOptions() {
    return [
      { value: 'FILE', icon: 'icon-document', text: this.props.t('CSV File') },
    ];
  }

  integrationOptions(): Array<Object> {
    return this.props.sourceFormData.integrations.map((integration) => {
      const option = {
        value: `INTEGRATION|${integration.thirdPartySourceId}`,
        image: '',
        text: '',
      };

      const image = sourceImageMapping[integration.sourceIdentifier];
      if (image) {
        option.image = image;
      } else {
        const hawkinDynamicsPattern = /hawkin_dynamic|hawkins_dynamic/;
        if (hawkinDynamicsPattern.test(integration.sourceIdentifier)) {
          option.image = sourceImageMapping.hawkin_dynamics;
        } else {
          option.text = integration.name;
        }
      }

      return option;
    });
  }

  appStatus() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <AppStatus status="loading" message={`${this.props.t('Loading')}...`} />
    );
  }

  sourceDataAttributes(type: string, thirdPartySourceId: string) {
    switch (type) {
      case 'FILE':
        return {
          type: 'FILE',
          fileData: { source: '', file: null },
          isEventSelectionNeeded: false,
        };
      case 'INTEGRATION':
        return {
          type: 'INTEGRATION',
          integrationData: this.buildIntegrationData(thirdPartySourceId),
          isEventSelectionNeeded: true,
        };
      default:
        return {};
    }
  }

  // this will change once we have more integrations
  buildIntegrationData(thirdPartySourceId: string): ?IntegrationData {
    const selectedIntegration = this.props.sourceFormData.integrations.find(
      (integration) =>
        integration.thirdPartySourceId.toString() === thirdPartySourceId
    );

    if (!selectedIntegration) {
      return null;
    }

    return {
      id: selectedIntegration.id,
      name: selectedIntegration.name,
      thirdPartySourceId: selectedIntegration.thirdPartySourceId,
    };
  }

  optionValue() {
    if (this.props.sourceData.type === 'INTEGRATION') {
      if (!this.props.sourceData.integrationData) return '';
      return `${this.props.sourceData.type}|${this.props.sourceData.integrationData.thirdPartySourceId}`;
    }

    return this.props.sourceData.type;
  }

  optionsChooserContent() {
    if (this.sourceOptions().length > 0) {
      return (
        <div className="sourceSelection__options">
          <OptionChooser
            options={this.sourceOptions()}
            value={this.optionValue()}
            onChange={this.handleSourceChange}
          />
        </div>
      );
    }

    return <p>{this.props.t('No integration found')}</p>;
  }

  render() {
    return (
      <div>
        <label
          className="km-form-label sourceSelection__sourceLabel"
          htmlFor="source"
        >
          {this.props.t('Import data from')}
        </label>
        {this.optionsChooserContent()}

        {this.sourceContent()}
        {this.appStatus()}
      </div>
    );
  }
}

export const SourceSelectionTranslated = withNamespaces()(SourceSelection);
export default SourceSelection;
