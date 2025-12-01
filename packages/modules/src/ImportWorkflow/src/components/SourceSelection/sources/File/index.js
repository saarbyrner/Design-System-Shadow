// @flow
import type { Node } from 'react';
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import $ from 'jquery';
import Papa from 'papaparse';

import { AppStatus, Dropdown, InputFile, TextButton } from '@kitman/components';
import { transformEventDataResponse } from '@kitman/modules/src/ImportWorkflow/src/utils';
import type {
  SourceFormData,
  FileData,
  SourceData,
} from '@kitman/modules/src/ImportWorkflow/src/types';
import type { DropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import pacEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceAndCoaching';
import { getMassUploadParseCSVData } from '@kitman/common/src/utils/TrackingData/src/data/shared/getSharedEventData';

type Props = {
  sourceData: SourceData,
  sourceFormData: SourceFormData,
  onFileDataChange: Function,
  onEventDataChange: Function,
  onFail: Function,
  onForward: Function,
  trackEvent: (eventName: string, metaData: ?{}) => void,
};

type State = {
  loading: boolean,
  errorMessages: Array<string>,
};

class File extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      loading: false,
      errorMessages: [],
    };

    this.handleFileSourceChange = this.handleFileSourceChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleForwardClick = this.handleForwardClick.bind(this);
  }

  handleFileSourceChange = (source: string) => {
    this.handleFileDataChange({ source });
  };

  handleFileChange = (file: Object) => {
    this.handleFileDataChange({ file });
  };

  handleFileDataChange = (change: Object) => {
    const newFileData = Object.assign({}, this.fileData(), change);
    this.props.onFileDataChange(newFileData);
    this.setState({ errorMessages: [] });
  };

  handleForwardClick = () => {
    if (this.props.sourceData.eventData) {
      this.props.onForward();
    } else {
      this.parseFile();
    }
  };

  appStatus() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <AppStatus
        status="loading"
        message={this.props.t('Loading and processing data')}
      />
    );
  }

  sourceOptions(): Array<DropdownItem> {
    const fileSources = this.props.sourceFormData.fileSources;
    const options = Object.keys(fileSources).map((key) => ({
      id: key,
      title: fileSources[key],
    }));
    return options.sort((a, b) => {
      if (a.title === b.title) {
        return 0;
      }
      return a.title > b.title ? 1 : -1;
    });
  }

  fileData() {
    return ((this.props.sourceData.fileData: any): FileData);
  }

  parseFile() {
    const formData = new FormData();

    formData.append('file', this.fileData().file || '');
    formData.append('source', this.fileData().source);

    this.setState({ errorMessages: [], loading: true });

    try {
      Papa.parse(this.fileData().file, {
        header: true,
        complete: (result) => {
          this.props.trackEvent(
            pacEventNames.massUploadCSVParsed,
            getMassUploadParseCSVData({
              importType: 'event_data',
              columnCount: result?.meta?.fields?.length || 0,
              rowCount: result?.data?.length || 0,
              vendor: this.fileData().source,
            })
          );
        },
      });
      // eslint-disable-next-line no-empty
    } catch {}

    $.ajax({
      method: 'POST',
      url: '/workloads/import_workflow/parse_file',
      processData: false,
      contentType: false,
      data: formData,
      success: (data) => this.parseFileSuccess(data),
      error: this.props.onFail,
    });
  }

  parseFileSuccess(data: any) {
    if (data.success) {
      this.setState({ loading: false });
      const eventData = transformEventDataResponse(data.events[0]);
      this.props.onEventDataChange(eventData);
      this.props.onForward();
    } else {
      this.setState({ errorMessages: data.errors, loading: false });
    }
  }

  errorMessagesContent(): Node {
    return this.state.errorMessages.map((errorMessage) => (
      <li key={errorMessage}>{errorMessage}</li>
    ));
  }

  errorContent() {
    if (!this.state.errorMessages.length) return null;

    return (
      <div className="km-form-error">
        <div>{`${this.props.t('Could not upload data')}:`}</div>

        <ul className="">{this.errorMessagesContent()}</ul>

        <div>
          {this.props.t(
            'Please correct these errors or contact Kitman Labs for support'
          )}
        </div>
      </div>
    );
  }

  canForward() {
    return this.fileData().file && this.fileData().source;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-5 importWorkflowFile__formGroup importWorkflowFile__fileSourceWrapper">
            <label className="km-form-label" htmlFor="file_source">
              {this.props.t('Select a data file type')}
            </label>
            <Dropdown
              items={this.sourceOptions()}
              value={this.fileData().source}
              name="fileSource"
              onChange={this.handleFileSourceChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 importWorkflowFile__formGroup">
            <label className="km-form-label" htmlFor="file">
              {this.props.t('Select the file')}
            </label>
            <InputFile
              value={this.fileData().file}
              onChange={this.handleFileChange}
              name="file"
            />
          </div>
          <div className="col-md-12">{this.errorContent()}</div>
        </div>

        <hr className="importWorkflow__hr--full" />

        <div className="row">
          <div className="offset-md-6 col-md-6 text-right">
            <TextButton
              id="next-step"
              type="primary"
              text={this.props.t('Next')}
              onClick={this.handleForwardClick}
              iconAfter="icon-next-right"
              isDisabled={!this.canForward()}
            />
          </div>
        </div>

        {this.appStatus()}
      </div>
    );
  }
}

const FileWithHooks = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  return <File {...props} trackEvent={trackEvent} />;
};

export const FileTranslated = withNamespaces()(FileWithHooks);
export default FileWithHooks;
