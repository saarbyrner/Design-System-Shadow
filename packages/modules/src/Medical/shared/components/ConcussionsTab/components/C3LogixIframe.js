// @flow
import type { ComponentType } from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import handleError from '@kitman/modules/src/Medical/shared/hooks/handleError';
import { colors } from '@kitman/common/src/variables';

import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@kitman/playbook/components';
import {
  getC3LogixSingleSignOn,
  getC3LogixAthleteSingleSignOn,
} from '@kitman/services/src/services/medical';

type Props = {
  athleteId: ?number,
};

const C3LogixIframe = ({ athleteId, t }: I18nProps<Props>) => {
  const [iFrameError, setIFrameError] = useState(false);
  const [c3LogixUrl, setC3LogixUrl] = useState(null);
  const [c3LogixToken, setC3LogixToken] = useState(null);
  const [isLoadingC3Logix, setIsLoadingC3Logix] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showManualSubmitButton, setShowManualSubmitButton] = useState(false);
  const submitTimeoutRef = useRef(null);
  const formElementRef = useRef<HTMLFormElement | null>(null); // Explicitly type the ref

  const allowedHostName = 'portal.c3logix.com';
  const waitTimeBeforeManualButtonAllowed = 7000; // 7 seconds

  const getSingleSignOn = () => {
    return athleteId
      ? getC3LogixAthleteSingleSignOn(athleteId)
      : getC3LogixSingleSignOn();
  };

  const formRef = useCallback(
    (node: ?HTMLFormElement) => {
      if (node === undefined) {
        formElementRef.current = null;
      } else {
        formElementRef.current = node;
      }
      if (
        node &&
        c3LogixToken &&
        c3LogixUrl &&
        !isFormSubmitted &&
        !showManualSubmitButton
      ) {
        // Clear any existing timeout before a new submission attempt
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
        }
        setShowManualSubmitButton(false); // Hide button on new submission attempt

        // Start a timeout to show the manual submit button if the iframe doesn't load
        submitTimeoutRef.current = setTimeout(() => {
          setShowManualSubmitButton(true);
        }, waitTimeBeforeManualButtonAllowed); // 7 seconds

        setIsFormSubmitted(true);

        node.submit();
      }
    },
    [c3LogixToken, c3LogixUrl, isFormSubmitted, showManualSubmitButton]
  );

  const handleIframeLoad = useCallback(() => {
    // Only clear timeout if a form submission has been attempted and the iframe loads
    if (isFormSubmitted && submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
      setShowManualSubmitButton(false);
    }
  }, [isFormSubmitted]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault(); // Prevent default form submission

      try {
        setIsLoadingC3Logix(true);
        setShowManualSubmitButton(false);
        setIsFormSubmitted(false);
        setIFrameError(false);
        setC3LogixUrl(null);
        setC3LogixToken(null);

        const ssoResponse = await getSingleSignOn();
        if (ssoResponse?.url && ssoResponse?.token) {
          const url = new URL(ssoResponse.url);
          if (url.protocol === 'https:' && url.hostname === allowedHostName) {
            setC3LogixUrl(ssoResponse.url);
          }
          setC3LogixToken(ssoResponse.token);
          // Now that token and URL are updated, submit the form programmatically
          if (formElementRef.current) {
            (formElementRef.current: HTMLFormElement).submit(); // Explicit cast
            setIsFormSubmitted(true); // Mark as submitted before programmatic submit
          }
        }
      } catch (err) {
        handleError(err, () => false);
        setIFrameError(true);
      } finally {
        setIsLoadingC3Logix(false);
      }
    },
    [allowedHostName]
  );

  useEffect(() => {
    const fetchC3LogixUrl = async () => {
      try {
        // Reset states
        setIsLoadingC3Logix(true);
        setC3LogixToken(null);
        setIFrameError(false);
        setIsFormSubmitted(false);
        setC3LogixUrl(null);
        setShowManualSubmitButton(false); // Ensure button is hidden on initial fetch

        const ssoResponse = await getSingleSignOn();
        if (ssoResponse?.url && ssoResponse?.token) {
          const url = new URL(ssoResponse.url);
          if (url.protocol === 'https:' && url.hostname === allowedHostName) {
            setC3LogixUrl(ssoResponse.url);
          }
          setC3LogixToken(ssoResponse.token);
          setIsLoadingC3Logix(false);
        }
      } catch (err) {
        handleError(err, () => false);
        setIFrameError(true);
      } finally {
        setIsLoadingC3Logix(false);
      }
    };

    fetchC3LogixUrl();

    // Cleanup timeout on component unmount
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, [allowedHostName]);

  if (isLoadingC3Logix) {
    return (
      <>
        <Typography variant="h6" padding={2}>
          {t('Loading C3Logix')}
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (iFrameError || !c3LogixUrl) {
    return (
      <Typography variant="h6" padding={2}>
        {t('C3Logix failed to login')}
      </Typography>
    );
  }

  return (
    <Box
      css={{
        width: '100%',
        height: '900px',
        border: `1px solid ${colors.neutral_300}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showManualSubmitButton && (
        <Box marginBottom={2}>
          <Typography variant="body1" color="error" textAlign="center">
            {t(
              'C3Logix may have been blocked by your browser. Please try again.'
            )}
          </Typography>
        </Box>
      )}
      <form
        ref={formRef}
        id="ssoForm"
        title="ssoForm"
        aria-label="ssoForm"
        action={c3LogixUrl}
        method="POST"
        target="ssoIframe"
        onSubmit={showManualSubmitButton ? handleFormSubmit : undefined}
        style={{ visibility: showManualSubmitButton ? 'visible' : 'hidden' }}
      >
        <input type="hidden" name="token" value={c3LogixToken} />
        {showManualSubmitButton && (
          <Button type="submit" variant="contained" color="primary">
            {t('C3Logix login')}
          </Button>
        )}
      </form>
      <iframe
        title={athleteId ? 'C3Logix Athlete Iframe' : 'C3Logix Roster Iframe'}
        width="100%"
        height="900"
        frameBorder="0"
        name="ssoIframe"
        loading="lazy"
        sandbox="allow-scripts allow-forms allow-popups allow-downloads"
        referrerPolicy="no-referrer"
        allowFullScreen
        onError={(e) => {
          console.log(e);
          setIFrameError(true);
        }}
        onLoad={handleIframeLoad}
        style={{ visibility: isFormSubmitted ? 'visible' : 'hidden' }}
      />
    </Box>
  );
};

export const C3LogixIframeTranslated: ComponentType<Props> =
  withNamespaces()(C3LogixIframe);
export default C3LogixIframe;
