// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { Link } from '@kitman/components';
import { getNotificationsIFrame } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import style from '@kitman/modules/src/Medical/notifications/src/components/styles';

type Props = {
  athleteId: string,
  hash: 'message' | 'report',
  urlPath: string,
  injuryIllnessId: string,
};

const App = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [errorMessage, setErrorMessage] = useState('');
  const [iFrameUrl, setIFrameUrl] = useState('');

  const getPreviousUrl = () => {
    let url = `/medical/athletes/${props.athleteId}`;

    if (props.urlPath.includes('illnesses')) {
      url = url.concat(`/illnesses/${props.injuryIllnessId}`);
    }
    if (props.urlPath.includes('injuries')) {
      url = url.concat(`/injuries/${props.injuryIllnessId}`);
    }
    if (props.urlPath.includes('chronic_issues')) {
      url = url.concat(`/chronic_issues/${props.injuryIllnessId}`);
    }
    return url.concat('#medications');
  };

  const getIFrame = () => {
    getNotificationsIFrame(props.hash)
      .then((data) => {
        setIFrameUrl(data.url);
        setRequestStatus('SUCCESS');
      })
      .catch((error) => {
        setErrorMessage(
          error.responseJSON?.message ||
            props.t('Something went wrong, contact support')
        );
        setRequestStatus('FAILURE');
      });
  };

  useEffect(() => {
    getIFrame();
  }, []);

  return (
    <>
      <div css={style.container}>
        <Link css={style.rosterLink} href={getPreviousUrl()}>
          <i className="icon-next-left" />
          {props.t('Back')}
        </Link>
        <div css={style.title}>{props.t('DrFirst Notifications')}</div>
      </div>
      {!iFrameUrl || requestStatus === 'FAILURE' ? (
        <div css={style.medicationsContainer} data-testid="Medications|Iframe">
          <h3>{errorMessage}</h3>
        </div>
      ) : (
        <div css={style.medicationsContainer} data-testid="Medications|Iframe">
          <iframe
            css={style.iframe}
            src={iFrameUrl}
            title="Kitman Labs Dr. First Integration"
            scrolling="auto"
            frameBorder="0"
          />
        </div>
      )}
    </>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
