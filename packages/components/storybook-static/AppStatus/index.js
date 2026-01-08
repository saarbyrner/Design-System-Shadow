// @flow
import { Component } from 'react';
import { setI18n, withNamespaces } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton } from '@kitman/components';
import {
  clearSavedRequestId,
  getSavedRequestId,
} from '@kitman/common/src/utils/services';
import type { ModalStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box } from '@kitman/playbook/components';
import { requestIdErrorMessage } from './consts';

// set the i18n instance
setI18n(i18n);

type Props = {
  status: ?ModalStatus,
  header?: ?string,
  title?: ?string,
  message?: ?string,
  secondaryMessage?: ?string,
  confirmButtonText?: ?string,
  deleteAllButtonText?: ?string,
  hideButtonText?: ?string,
  isEmbed?: boolean,
  close?: () => void,
  hideConfirmation?: () => void,
  confirmAction?: () => void,
};

class AppStatus extends Component<I18nProps<Props>> {
  constructor(props: I18nProps<Props>) {
    super(props);
    this.getConfirmButtonText = this.getConfirmButtonText.bind(this);
    this.getDeleteAllButtonText = this.getDeleteAllButtonText.bind(this);
    this.getHideButtonText = this.getHideButtonText.bind(this);
    this.escClose = this.escClose.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escClose, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escClose, false);
    clearSavedRequestId();
  }

  getConfirmButtonText = () => {
    return this.props.confirmButtonText
      ? this.props.confirmButtonText
      : this.props.t("Yes I'm sure");
  };

  getDeleteAllButtonText = () => {
    return this.props.deleteAllButtonText
      ? this.props.deleteAllButtonText
      : this.props.t('Delete All');
  };

  getHideButtonText = () => {
    return this.props.hideButtonText
      ? this.props.hideButtonText
      : this.props.t('Cancel');
  };

  escClose = (event: any) => {
    if (
      event.code === 'Escape' &&
      (this.props.status === 'confirm' || this.props.status === 'warning') &&
      this.props.hideConfirmation
    ) {
      this.props.hideConfirmation();
    }
  };

  reloadPage() {
    window.location.reload();
  }

  render() {
    let modalClass;
    let modalHTML;
    let requestId;

    // determine which status to show
    switch (this.props.status) {
      case 'success':
        modalClass = 'appStatus appStatus--success isActive';
        modalHTML = <p className="appStatus__title">{this.props.message}</p>;
        break;

      case 'error': {
        if (window.getFlag('turn-off-updated-error-screen')) {
          return null;
        }
        modalClass = 'appStatus appStatus--error isActive';
        const isUpdatedErrorScreenFFOn =
          window.featureFlags && window.featureFlags['updated-error-screen'];
        if (isUpdatedErrorScreenFFOn) requestId = getSavedRequestId();
        modalHTML = (
          <div>
            <p className="appStatus__title">
              {this.props.message || this.props.t('Something went wrong!')}
            </p>
            {isUpdatedErrorScreenFFOn && requestId && (
              <p>
                {`${requestIdErrorMessage}:`} <strong>{requestId}</strong>
              </p>
            )}

            <TextButton
              type="primary"
              size="small"
              onClick={this.props.close || this.reloadPage}
              text={
                this.props.hideButtonText ||
                this.props.t('Go back and try again')
              }
              kitmanDesignSystem
            />
          </div>
        );
        break;
      }

      case 'validationError':
        modalClass = 'appStatus appStatus--validationError isActive';
        modalHTML = (
          <div>
            <p className="appStatus__title">
              {this.props.message ||
                this.props.t(
                  'At least one variable must be selected for each athlete'
                )}
            </p>
            <TextButton
              type="primary"
              onClick={this.props.close}
              text={this.props.hideButtonText || this.props.t('Got it')}
            />
          </div>
        );
        break;

      case 'loading':
        modalClass = 'appStatus appStatus--saving isActive';
        modalHTML = (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <p data-testid="AppStatus|loading" className="appStatus__title">
                {this.props.message ?? `${this.props.t('Saving')}...`}
              </p>
            </Box>
            {this.props.secondaryMessage && (
              <p>{this.props.secondaryMessage}</p>
            )}
          </>
        );
        break;

      case 'confirm': {
        const message = this.props.message ? (
          <p className="appStatus__title">{this.props.message}</p>
        ) : (
          <p
            className="appStatus__title"
            style={{ width: 436, margin: '0 auto 10px' }}
          >
            {this.props.t('Are you sure you want to exit before saving?')}
          </p>
        );
        modalClass = 'appStatus appStatus--confirm isActive';
        modalHTML = (
          <div>
            {message}
            <div className="appStatus-btncont">
              <TextButton
                type="secondary"
                onClick={this.props.hideConfirmation}
                text={this.getHideButtonText()}
              />
              <TextButton
                type="primary"
                onClick={this.props.confirmAction}
                text={this.getConfirmButtonText()}
              />
            </div>
          </div>
        );
        break;
      }

      case 'confirmWithTitle': {
        modalClass = 'appStatus appStatus--confirmWithTitle isActive';
        modalHTML = (
          <div>
            {this.props.title && (
              <h5 className="appStatus__title appStatus__title--confirmWithTitle">
                {this.props.title}
              </h5>
            )}
            {this.props.message && (
              <p className="appStatus__message appStatus__message--confirmWithTitle">
                {this.props.message}
              </p>
            )}
            <div className="appStatus-btncont">
              <TextButton
                type="secondary"
                onClick={this.props.hideConfirmation}
                text={this.getHideButtonText()}
              />
              <TextButton
                type="primary"
                onClick={this.props.confirmAction}
                text={this.getConfirmButtonText()}
              />
            </div>
          </div>
        );
        break;
      }

      case 'warning': {
        modalClass = 'appStatus appStatus--warning isActive';
        modalHTML = (
          <div>
            <p className="appStatus__title appStatus__title--warning">
              {this.props.message || this.props.t('Delete all?')}
            </p>
            {this.props.secondaryMessage && (
              <p>{this.props.secondaryMessage}</p>
            )}
            <div className="appStatus-btncont">
              <TextButton
                onClick={this.props.hideConfirmation}
                text={this.getHideButtonText()}
              />
              <TextButton
                type="danger"
                onClick={this.props.confirmAction}
                text={this.getDeleteAllButtonText()}
              />
            </div>
          </div>
        );
        break;
      }

      case 'message': {
        modalClass = 'appStatus appStatus--message isActive';
        modalHTML = (
          <div>
            <h2 className="appStatus__header">{this.props.header}</h2>
            <p className="appStatus__title">{this.props.message}</p>
            <div className="appStatus-btncont">
              <TextButton
                type="primary"
                onClick={this.props.confirmAction}
                text={this.props.confirmButtonText || this.props.t('Continue')}
              />
            </div>
          </div>
        );
        break;
      }

      default:
        modalClass = 'appStatus';
        modalHTML = '';
        break;
    }

    // AppStatus is designed to be fill the window.
    // This modifier will make it fill its parent instead.
    modalClass = this.props.isEmbed
      ? `${modalClass} appStatus--embed`
      : modalClass;

    return (
      <div
        data-testid={
          this.props.status ? `AppStatus-${this.props.status}` : 'AppStatus'
        }
        className={`d-print-none ${modalClass}`}
      >
        <div className="appStatus-bg" />
        <div className="appStatus-cont">{modalHTML}</div>
      </div>
    );
  }
}

export default AppStatus;
export const AppStatusTranslated = withNamespaces()(AppStatus);
