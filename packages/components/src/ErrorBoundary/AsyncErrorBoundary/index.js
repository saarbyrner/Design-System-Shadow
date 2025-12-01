/* eslint-disable no-alert */
// @flow
import type { Node } from 'react';
import { Component } from 'react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import type { ErrorDetailType } from '@kitman/modules/src/Medical/shared/hooks/handleError';
import showToast from '@kitman/modules/src/vanillaToasts/toast';
import { KitmanIcon } from '@kitman/playbook/icons';
import { Typography, Box, Button } from '@kitman/playbook/components';
import { BASE_URL } from '@kitman/modules/src/Medical/shared/utils';

setI18n(i18n);

type Props = { children: Node };
type State = {
  errorList: Array<ErrorDetailType>,
  hasError: boolean,
  requestId: ?string,
  rawResponse: string,
  errorCode: number,
};

const styles = {
  heading: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontZize: '48px',
    lineHeight: '150%',
    letterSpacing: '0.15px',
    textAlign: 'center',
  },
  subHeading: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontZize: '16px',
    lineHeight: '117%',
    letterSpacing: '0px',
    textAlign: 'center',
    mt: 3,
  },
  error: {
    fontFamily: 'Open Sans',
    fontWeight: 700,
    fontZize: '16px',
    lineHeight: '150%',
    letterSpacing: '0.15px',
    textAlign: 'center',
    mt: 2,
  },
  suggestion: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontZize: '16px',
    lineHeight: '150%',
    letterSpacing: '0.15px',
    textAlign: 'center',
    mt: 2,
  },
  suggestion2: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  buttonText: {
    fontWeight: 'bold',
    padding: 0,
    minWidth: 'auto',
    textTransform: 'none',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  errorScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
  },
  errorContainer: {
    div: { display: 'flex' },
  },
};

const handleCopyToClipboard = (text) => {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Request ID copied to clipboard');
      })
      .catch(() => {
        alert('Failed to copy Request ID');
      });
  } else {
    // Fallback method using a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    document.body?.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      alert('Request ID copied to clipboard');
    } catch (err) {
      alert('Failed to copy Request ID');
    } finally {
      document.body?.removeChild(textarea);
    }
  }
};
const handleReload = () => {
  window.location.reload();
};
const handleHomepage = () => {
  window.location.replace(BASE_URL);
};

const ErrorScreen = ({
  requestId,
  errorCode,
}: {
  requestId: string,
  errorCode: number,
}) => {
  if (errorCode === 500) {
    return (
      <Box
        id="errorScreen500"
        data-testid="errorScreen500"
        sx={styles.errorScreen}
      >
        <Box style={{ marginBottom: '20px' }}>
          <Box id="errorIcon">
            <Box sx={{ color: 'error.main' }}>
              <KitmanIcon name="ErrorOutline" />
            </Box>
          </Box>
        </Box>
        <Typography sx={styles.heading} variant="h3">
          {i18n.t('Something went wrong')}
        </Typography>
        <Typography sx={styles.subHeading} variant="body1">
          {i18n.t('Were sorry, but an unexpected error occurred.')}
        </Typography>
        <Typography sx={styles.suggestion2} variant="body1">
          {i18n.t('If this issue persists,')}
          <Button sx={styles.buttonText} onClick={() => {}}>
            {i18n.t('copy request ID')}
          </Button>
          {i18n.t('and contact support.')}
        </Typography>
        <Box sx={styles.buttonContainer}>
          <Button
            variant="outlined"
            onClick={() => handleCopyToClipboard(requestId)}
          >
            {i18n.t('Copy request ID')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleReload}>
            {i18n.t('Reload')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleHomepage}>
            {i18n.t('Return to homepage')}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box id="errorScreen" sx={styles.errorScreen}>
      <Box style={{ marginBottom: '20px' }}>
        <Box id="errorIcon">
          <Box sx={{ color: 'error.main' }}>
            <KitmanIcon name="ErrorOutline" />
          </Box>
        </Box>
      </Box>
      <Typography sx={styles.heading} variant="h3">
        {i18n.t('Not Found')}
      </Typography>
      <Box sx={styles.buttonContainer}>
        <Button variant="contained" color="primary" onClick={handleHomepage}>
          {i18n.t('Return to homepage')}
        </Button>
      </Box>
    </Box>
  );
};
class AsyncErrorBoundary extends Component<Props, State> {
  state = {
    errorList: [],
    hasError: false,
    requestId: null,
    rawResponse: '',
    errorCode: 0,
  };

  componentDidMount() {
    window.addEventListener('globalError', this.handleGlobalError);
  }

  componentWillUnmount() {
    window.removeEventListener('globalError', this.handleGlobalError);
  }

  handleGlobalError = (event: CustomEvent) => {
    const { detail = {} } = event;
    const {
      errorList = [],
      requestId = i18n.t('No request id available'),
      errorType,
      genericMessage,
      rawResponse,
      errorCode,
    } = detail;

    // Ensure there are errors (Standardised Errors)
    // or a generic message (to show toast without having standard error response)
    if (errorList.length || errorCode) {
      if (errorType === 'toastErrorUi') {
        errorList.map((err) => {
          return showToast(err.message || genericMessage);
        });
      } else {
        // Set state to trigger AsyncErrorBoundary and pass data
        this.setState({
          errorList,
          hasError: true,
          requestId,
          rawResponse,
          errorCode,
        });
      }
    }
  };

  renderFullScreenGlobalError() {
    return (
      <ErrorScreen
        requestId={this.state.requestId || 'no request id'}
        errorList={this.state.errorList}
        rawResponse={this.state.rawResponse}
        errorCode={this.state.errorCode}
      />
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFullScreenGlobalError();
    }
    return this.props.children;
  }
}

export default AsyncErrorBoundary;
