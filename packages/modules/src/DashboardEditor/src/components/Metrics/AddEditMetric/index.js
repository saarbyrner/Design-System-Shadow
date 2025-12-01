// @flow
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import $ from 'jquery';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  FormValidator,
  IconButton,
  InputText,
  TextButton,
} from '@kitman/components';
import StatusForm from '@kitman/modules/src/StatusForm';
import type { Status } from '@kitman/common/src/types/Status';
import { containsAnEmoji } from '@kitman/common/src/utils';

import type {
  QuestionnaireVariable,
  Validation,
} from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  availableVariables: Array<QuestionnaireVariable>,
  status: Status,
  isAddingNewStatus: boolean,
  dashboardIsEmpty: boolean,
  saveStatus: () => void,
  statusChanged: boolean,
  updateStatus: (Status) => void,
  deleteStatus: () => void,
  cancelBtnClick: () => void,
  hasAlarms: boolean,
};

// set the i18n instance
setI18n(i18n);

class AddEditMetric extends Component<
  I18nProps<Props>,
  {
    isValid: boolean,
  }
> {
  saveStatus: () => void;

  deleteStatus: () => void;

  editorForm: ?Object;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.editorForm = null;

    this.removeFieldErrors = this.removeFieldErrors.bind(this);
    this.onStatusNameValidation = this.onStatusNameValidation.bind(this);
    this.onStatusFormChanged = this.onStatusFormChanged.bind(this);

    this.state = {
      isValid: true,
    };
  }

  onStatusNameValidation = (nameValidationResponse: Validation) => {
    const newStatus = this.updateStatusName(nameValidationResponse.value);
    this.props.updateStatus(newStatus);

    this.setState({
      isValid: nameValidationResponse.isValid,
    });
  };

  updateStatusName = (value: *) => {
    // if the status name is custom and the input is cleared, then clear the name
    let changes = {};
    if (value === '') {
      if (this.props.status.is_custom_name) {
        changes = { name: '', is_custom_name: false };
      }
      // Otherwise, input has a value, set it and turn on the is_custom flag
    } else {
      changes = { name: value, is_custom_name: true };
    }

    return Object.assign({}, this.props.status, changes);
  };

  onStatusFormChanged = (newStatus: Status) => {
    this.props.updateStatus(newStatus);
  };

  getStatusNameInput() {
    return (
      <div className="dashboardEditor__nameContainer">
        <div className="dashboardEditor__nameContainerInner">
          <InputText
            value={
              this.props.status.is_custom_name ? this.props.status.name : ''
            }
            label={this.props.t('Display Name')}
            maxLength={100}
            customValidations={[(value) => containsAnEmoji(value)]}
            onValidation={this.onStatusNameValidation}
            onFocusTracking={this.onFocusTracking}
            required={false}
            // hide errors if the status is custom and the input is not empty
            revealError={
              this.props.status.is_custom_name && this.props.status.name !== ''
            }
          />
        </div>
      </div>
    );
  }

  saveButtonDisabled() {
    return !(this.props.statusChanged && this.state.isValid);
  }

  cancelButtonDisabled() {
    if (this.props.isAddingNewStatus) {
      return this.props.dashboardIsEmpty;
    }

    return !this.props.statusChanged;
  }

  getCancelBtn() {
    return (
      <TextButton
        text={this.props.t('Cancel')}
        type="secondary"
        isDisabled={this.cancelButtonDisabled()}
        onClick={() => this.props.cancelBtnClick()}
      />
    );
  }

  getAlarmWarning() {
    return this.props.hasAlarms ? (
      <p className="dashboardEditor__alarmWarning">
        <i className="icon-warning dashboardEditor__alarmWarningIcon" />
        {this.props.t(
          'The associated alarms may be affected by any changes you make'
        )}
      </p>
    ) : null;
  }

  onFocusTracking() {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      // eslint-disable-next-line no-undef
      ga(
        'send',
        'event',
        'Dashboard Editor',
        'click_in_status_rename',
        'Rename Input click'
      );
    }
  }

  removeFieldErrors = () => {
    // Wee need to remove error classes because form validator is currently
    // doesn't use the isValid state.
    if (this.editorForm) {
      const fields = this.editorForm.getElementsByTagName('input');
      for (let index = 0; index < fields.length; index++) {
        const field = $(fields[index]);
        field.parent('._customDropdown').removeClass('hasError');
        field.removeClass('hasError');
      }
    }
  };

  render() {
    if (!this.props.statusChanged) {
      this.removeFieldErrors();
    }

    return (
      <div
        className="dashboardEditor__formContainer"
        ref={(el) => {
          this.editorForm = el;
        }}
      >
        <FormValidator
          successAction={() => {
            this.props.saveStatus();
          }}
          inputNamesToIgnore={['display_name']}
        >
          <div className="dashboardEditor__formHeader">
            <h6 className="mt-2">{this.props.t('Metric')}</h6>
            <IconButton
              icon="icon-bin"
              onClick={() => this.props.deleteStatus()}
              isDisabled={this.props.isAddingNewStatus}
            />
          </div>
          <div className="dashboardEditor__form">
            {this.getStatusNameInput()}
            <StatusForm
              updatedStatus={this.props.status}
              availableVariables={this.props.availableVariables}
              onChange={(value) => this.onStatusFormChanged(value)}
              lockStatusMetric={!this.props.isAddingNewStatus}
              t={this.props.t}
            />
            {this.getAlarmWarning()}
          </div>
          <div className="dashboardEditor__formFooter">
            <div>{this.getCancelBtn()}</div>
            <div className="dashboardEditor__buttonContainer">
              <TextButton
                text={this.props.t('Save')}
                type="primary"
                onClick={() => {}}
                isDisabled={this.saveButtonDisabled()}
              />
            </div>
          </div>
        </FormValidator>
      </div>
    );
  }
}

export const AddEditMetricTranslated = withNamespaces()(AddEditMetric);
export default AddEditMetric;
