// @flow
import { useEffect, useState, useRef } from 'react';
import GenericIframe from '@kitman/components/src/GenericIframe';
import type { RequestStatus } from '@kitman/common/src/types/index';
import visuallyHideIntercom from '@kitman/common/src/utils/visuallyHideIntercom';
import { AppStatus } from '@kitman/components';
import { EditEventPanelTranslated as EventSidePanel } from '@kitman/modules/src/PlanningEventSidePanel';
import { getEventConditions } from '@kitman/services';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import getTSOUrl from '@kitman/services/src/services/getTSOUrl';

type Props = {
  title: string,
  src: string,
  canCreateEvent?: boolean,
};

const TSOApp = (props: Props) => {
  const [isIframeReady, setIsIframeReady] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [tsoUrlRequestStatus, setTSOUrlRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [hasFailedToLoad, setHasFailedToLoad] = useState<boolean>(false);
  const [eventConditionsData, setEventConditionsData] =
    useState<EventConditions | null>(null);
  const [isEventSidePanelOpen, setIsEventSidePanelOpen] =
    useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string>(props.src);
  const [tsoUrl, setTSOUrl] = useState<?string>(null);

  const timerRef = useRef(null);

  const { organisation, organisationRequestStatus } = useOrganisation();

  const urlParams = useLocationSearch();
  const eventIdParam = urlParams?.get('eventId');

  const listenForTSOStatus = (event) => {
    if (event.data?.type === 'symbiosis-page-ready') {
      setIsIframeReady(true);
    }

    if (event.data?.type === 'symbiosis-side-panel-opened') {
      visuallyHideIntercom(true);
    }

    if (event.data?.type === 'symbiosis-side-panel-closed') {
      visuallyHideIntercom(false);
    }

    if (event.data?.type === 'symbiosis-create-event') {
      setIsEventSidePanelOpen(true);
    }
  };

  useEffect(() => {
    setIframeSrc(props.src);
    setIsIframeReady(false);
  }, [props.src]);

  useEffect(() => {
    if (organisation.tso_application) {
      getTSOUrl(`${organisation.tso_application?.base_web_url}${iframeSrc}`)
        .then((response) => {
          // Below logic is used in redirect from tso event in tooltip triggered
          // in @kitman/modules/src/CalendarPage/src/components/EventTooltip
          setTSOUrl(
            eventIdParam
              ? `${response.url}&EventID=${eventIdParam}`
              : response.url
          );
          setTSOUrlRequestStatus('SUCCESS');
        })
        .catch(() => setTSOUrlRequestStatus('FAILURE'));
    }
  }, [organisation, iframeSrc]);

  useEffect(() => {
    if (window.featureFlags['tso-event-management'] && eventIdParam) {
      setIframeSrc(`/Sections/Events/EventDashboard.aspx`);
    }

    getEventConditions()
      .then((eventConditionsResponse) => {
        setRequestStatus('SUCCESS');
        setEventConditionsData(eventConditionsResponse);
      })
      .catch(() => setRequestStatus('FAILURE'));

    window.addEventListener('message', listenForTSOStatus);

    // Show error if not loaded within 60 seconds
    timerRef.current = setTimeout(() => {
      setHasFailedToLoad(true);
    }, 60000);

    return () => {
      window.removeEventListener('message', listenForTSOStatus);
      visuallyHideIntercom(false);
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isIframeReady) {
      clearTimeout(timerRef.current);
    }
  }, [isIframeReady, timerRef]);

  const renderCreateEventSidePanel = () => (
    <EventSidePanel
      isOpen={isEventSidePanelOpen}
      panelType="SLIDING"
      panelMode="CREATE"
      createNewEventType="game_event"
      eventConditions={eventConditionsData}
      onClose={() => setIsEventSidePanelOpen(false)}
      isAttachmentsDisabled
    />
  );

  return (
    <>
      {requestStatus !== 'SUCCESS' ||
      organisationRequestStatus !== 'SUCCESS' ||
      tsoUrlRequestStatus !== 'SUCCESS' ? (
        <AppStatus
          status={
            requestStatus === 'PENDING' ||
            organisationRequestStatus === 'PENDING' ||
            tsoUrlRequestStatus === 'PENDING'
              ? 'loading'
              : 'error'
          }
          message={
            (requestStatus === 'PENDING' ||
              organisationRequestStatus === 'PENDING' ||
              tsoUrlRequestStatus === 'PENDING') &&
            'Loading...'
          } // if failure, use default error message
        />
      ) : (
        <>
          {props.canCreateEvent && renderCreateEventSidePanel()}
          <GenericIframe
            title={props.title}
            src={tsoUrl || props.src}
            hasErrored={requestStatus === 'FAILURE' || hasFailedToLoad}
            isLoading={!isIframeReady || requestStatus === 'PENDING'}
          />
        </>
      )}
    </>
  );
};

export default TSOApp;
