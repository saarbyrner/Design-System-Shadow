// @flow
import { useState, useEffect, useRef } from 'react';
import { PopupBox, AppStatus } from '@kitman/components';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import type { Node } from 'react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { withNamespaces } from 'react-i18next';
import type { RequestStatus } from '@kitman/common/src/types/index';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import getTSOUrl from '@kitman/services/src/services/getTSOUrl';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Uploads, CustomMessageEvent } from './types';
import ProgressContainer from './ProgressContainer';

const VideoUploadProgress = ({ t }: I18nProps<{}>) => {
  const [uploads, setUploads] = useState<Uploads>([]);
  const [showUploadProgress, setShowUploadProgress] = useState<boolean>(
    window.sessionStorage.getItem('showTSOVideoUploadProgress') === 'true' // using session storage as value needs to be persisted between refresh
  );
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [tsoUrl, setTSOUrl] = useState<?string>(null);

  const locationAssign = useLocationAssign();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timerRef = useRef(null);

  const { organisation, organisationRequestStatus } = useOrganisation();

  const videosUploading = uploads.filter((upload) => upload.percentage < 100);
  const videosUploaded = uploads.filter((upload) => upload.percentage === 100);

  const listenForUploadStatus = (event: CustomMessageEvent) => {
    const result = event.data.message?.payload?.result;
    const trackingId = event.data.message?.payload?.tracking_id;

    // Hide/show upload progress logic
    if (event.data?.type === 'symbiosis-side-panel-closed') {
      setShowUploadProgress(true);
      window.sessionStorage.setItem('showTSOVideoUploadProgress', true);
    }

    if (event.data?.type === 'symbiosis-side-panel-opened') {
      setShowUploadProgress(false);
      window.sessionStorage.setItem('showTSOVideoUploadProgress', false);
    }

    // File upload progress logic
    if (
      event.data.type === 'message-relay' &&
      event.data.message?.type === 'file_update' &&
      result?.uploadedFileSize
    ) {
      const updatedPercentage = Math.round(
        (result.uploadedFileSize / result.fileSize) * 100
      );
      setUploads((previousUploads) => {
        const previousUpload = previousUploads.find(
          (upload) => upload.id === trackingId
        );

        return [
          ...previousUploads.filter((upload) => upload.id !== trackingId),
          {
            id: trackingId,
            percentage:
              !!previousUpload && previousUpload.percentage > updatedPercentage
                ? previousUpload.percentage
                : updatedPercentage,
            fileName: result.fileName,
          },
        ];
      });
    }
  };

  useEffect(() => {
    // Needed to trigger rendering in the use case that the user navigates to a different page
    // while the side panel is still open (we don't get a post message in this case)
    if (window.location.pathname !== '/media/videos' && !showUploadProgress) {
      setShowUploadProgress(true);
      window.sessionStorage.setItem('showTSOVideoUploadProgress', true);
    }
  });

  useEffect(() => {
    window.addEventListener('message', listenForUploadStatus);

    // Show error if not loaded within 5 seconds
    timerRef.current = setTimeout(() => {
      setRequestStatus('FAILURE');
    }, 5000);

    return () => {
      window.removeEventListener('message', listenForUploadStatus);
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Need to use this generic selector to get around flow error as getElementById returns HTMLElement
    // instead of HTMLIFrameElement
    if (document.querySelector('iframe')) {
      iframeRef.current = document.querySelector('iframe');
    }
  }, [requestStatus, organisationRequestStatus]);

  useEffect(() => {
    if (
      organisationRequestStatus === 'SUCCESS' &&
      organisation.tso_application
    ) {
      getTSOUrl(
        // $FlowIgnore tso_application will be populated at this point
        `${organisation.tso_application?.base_web_url}/Sections/Symbiosis/Relay.html`
      )
        .then((response) => {
          setTSOUrl(response.url);
          setRequestStatus('SUCCESS');
          clearTimeout(timerRef.current);
        })
        .catch(() => setRequestStatus('FAILURE'));
    }
  }, [organisation, organisationRequestStatus]);

  const handleClick = (messageType: string, id?: string) => {
    iframeRef?.current?.contentWindow.postMessage(
      { type: messageType, ...(id && { tracking_id: id }) },
      '*'
    );
  };

  const handleToastClose = (id) => {
    // Remove upload from array after toast shown
    setUploads((previousUploads) =>
      previousUploads.filter((upload) => upload.id !== id)
    );
  };

  const renderToast = (): Node => (
    <ToastDialog
      toasts={videosUploaded.map((upload) => {
        return {
          title: t('{{fileName}} Uploaded Successfully', {
            fileName: upload.fileName,
          }),
          status: 'SUCCESS',
          id: upload.id,
        };
      })}
      onCloseToast={handleToastClose}
    />
  );

  const handleLocationAssign = (queryParam: string) => {
    locationAssign(`/media/videos?state=${queryParam}`);
  };

  const renderAppStatus = (): Node | null => {
    // Feature should be non blocking, as it's app wide - returning null if error
    if (
      requestStatus === 'FAILURE' ||
      organisationRequestStatus === 'FAILURE'
    ) {
      return null;
    }
    if (
      requestStatus === 'PENDING' ||
      organisationRequestStatus === 'PENDING'
    ) {
      return <AppStatus message={t('Loading...')} status="loading" />;
    }
    return null;
  };

  return (
    <div data-testid="TSOVideoUploadProgress">
      {renderAppStatus()}
      <iframe
        title={t('TSO Service worker relay')}
        src={tsoUrl && tsoUrl}
        id="RelayIframe"
        style={{ display: 'none' }}
      />

      {showUploadProgress && (
        <>
          {videosUploading.length > 0 && (
            <PopupBox
              title={`Uploading ${videosUploading.length} ${
                videosUploading.length > 1 ? 'videos' : 'video'
              }...`}
              onExpand={() => handleLocationAssign('open-side-panel')}
            >
              {videosUploading
                .sort((a, b) => a.fileName.localeCompare(b.fileName))
                .map((upload) => (
                  <ProgressContainer
                    title={upload.fileName}
                    onTitleClick={() => handleLocationAssign('open-side-panel')}
                    onDelete={() => handleClick('delete-video', upload.id)}
                    progress={
                      videosUploading.find((item) => item.id === upload.id)
                        ?.percentage || 0
                    }
                    key={upload.id}
                  />
                ))}
            </PopupBox>
          )}
          {videosUploaded.length > 0 && renderToast()}
        </>
      )}
    </div>
  );
};

export const VideoUploadProgressTranslated =
  withNamespaces()(VideoUploadProgress);
export default VideoUploadProgress;
