// @flow
import { useRef, useEffect, useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  Box,
  Slide,
  Paper,
  IconButton,
  Typography,
} from '@kitman/playbook/components';
import {
  type Toast as ToastType,
  type ToastId,
} from '@kitman/components/src/types';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { toastRemovalDelayEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { reset } from '@kitman/modules/src/Toasts/toastsSlice';
import { useTwilioClient } from '@kitman/common/src/contexts/TwilioClientContext';
import { updateNotificationLevel } from '@kitman/modules/src/Messaging/src/utils';
import { NOTIFICATION_LEVEL } from '@kitman/modules/src/Messaging/src/types';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import corePlatformEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/corePlatform';

import styles from './style';

type Props = {
  toast: ToastType,
  onClose: (id: ToastId) => void,
};
const MessageToast = ({ toast, onClose, t }: I18nProps<Props>) => {
  const [muted, setMuted] = useState(false);
  const timnerRef = useRef<TimeoutID | null>(null);
  const { id, title, description, metadata } = toast;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trackEvent } = useEventTracking();

  const { twilioClient } = useTwilioClient();

  useEffect(() => {
    if (timnerRef.current) {
      clearTimeout(timnerRef.current);
    }

    timnerRef.current = setTimeout(() => {
      onClose(id);
    }, toastRemovalDelayEnumLike.DefaultRemovalDelay);

    return () => {
      if (timnerRef.current) {
        clearTimeout(timnerRef.current);
      }
    };
  }, [id, onClose]);

  const handleRedirect = () => {
    if (getIsLocalStorageAvailable()) {
      window.localStorage.setItem(
        'lastUsedMessagingChannelSid',
        metadata?.channelSid
      );
    }

    trackEvent(corePlatformEventNames.clickToastMessage);
    dispatch(reset());
    navigate('/messaging');
  };

  const onSuccess = () => {
    setMuted(true);
    onClose(id);
  };

  const handleMute = (e) => {
    e.stopPropagation();
    trackEvent(corePlatformEventNames.clickToastMessageMute);

    const { channelSid } = metadata || {};

    if (twilioClient && channelSid) {
      updateNotificationLevel({
        client: twilioClient,
        sid: channelSid,
        level: NOTIFICATION_LEVEL.MUTED,
        onSuccess,
      });
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose(id);
  };

  return (
    <Slide in direction="left" mountOnEnter unmountOnExit>
      <Paper elevation={24} sx={styles.paper} onClick={handleRedirect}>
        <Box sx={styles.topContainer}>
          <KitmanIcon
            name={KITMAN_ICON_NAMES.CommentOutlined}
            sx={{ fontSize: '22px' }}
          />
          <Typography variant="subtitle1" sx={styles.message}>
            {t('1 new message')}
          </Typography>
          <IconButton
            sx={styles.closeIcon}
            onClick={handleClose}
            aria-label="Close"
          >
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Close}
              sx={{ fontSize: '22px' }}
            />
          </IconButton>
        </Box>

        <Box sx={styles.bottomContainer}>
          <div>
            <Typography variant="subtitle2" sx={styles.title}>
              {title}
            </Typography>
            <Typography variant="body2" sx={styles.description}>
              {description}
            </Typography>
          </div>

          <div css={styles.innerContainer}>
            <IconButton
              size="small"
              onClick={handleMute}
              css={styles.bellIcon}
              aria-label="Mute"
              disabled={muted}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.NotificationsOffOutlined} />
            </IconButton>
            <span css={styles.time}>{metadata?.time}</span>
            <KitmanIcon
              name={KITMAN_ICON_NAMES.ChevronRight}
              fontSize="small"
            />
          </div>
        </Box>
      </Paper>
    </Slide>
  );
};

export const MessageToastTranslated: ComponentType<Props> =
  withNamespaces()(MessageToast);
export default MessageToast;
