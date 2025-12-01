// @flow
import type { Node } from 'react';
import { Component } from 'react';
import * as Sentry from '@sentry/browser';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

type Props = {
  children: Node,
  kitmanDesignSystem?: boolean,
};

class ErrorBoundary extends Component<
  I18nProps<Props>,
  {
    error: ?Error,
    errorInfo: ?{ componentStack: string },
  }
> {
  styles: Object;

  constructor(props: I18nProps<Props>) {
    super(props);
    this.state = {
      error: null, // eslint-disable-line react/no-unused-state
      errorInfo: null,
    };

    this.intercomContact = this.intercomContact.bind(this);
  }

  /* eslint-disable no-undef */
  intercomContact = () => {
    // $FlowFixMe
    if (typeof Intercom !== 'undefined') {
      Intercom('showNewMessage');
    } else {
      window.location.href = 'mailto:support@kitmanlabs.com';
    }
  };

  componentDidCatch(error: ?Error, errorInfo: ?{ componentStack: string }) {
    this.setState({
      error, // eslint-disable-line react/no-unused-state
      errorInfo,
    });

    Sentry.withScope((scope) => {
      if (errorInfo) {
        Object.keys(errorInfo).forEach((key) => {
          // $FlowFixMe
          scope.setExtra(key, errorInfo[key]);
        });
      }
      Sentry.captureException(error);
    });
  }

  /* eslint-enable no-undef, new-cap */

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="errorBoundary">
          <h4>
            {this.props.t(
              'An error occurred while loading. Please try again or contact support.'
            )}
          </h4>
          <TextButton
            text={this.props.t('Contact Support')}
            type="primary"
            onClick={this.intercomContact}
            kitmanDesignSystem={this.props.kitmanDesignSystem}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
export const ErrorBoundaryTranslated = withNamespaces()(ErrorBoundary);
