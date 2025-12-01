// @flow
import { useRef, useEffect } from 'react';

import { TextLink } from '@kitman/components';
import { Box, Slide, Alert, AlertTitle } from '@kitman/playbook/components';
import type {
  Toast as ToastType,
  ToastId,
  ToastLink,
} from '@kitman/components/src/types';
import { toastRemovalDelayEnumLike } from '@kitman/components/src/Toast/enum-likes';
import type { ToastRemovalDelayEnumLikeKeys } from '@kitman/components/src/Toast/types';

type Props = {
  toast: ToastType,
  onClose: (id: ToastId) => void,
  onLinkClick?: (link: ToastLink) => void,
  toastRemovalDelay?: ToastRemovalDelayEnumLikeKeys,
};

const Toast = ({ toast, onClose, onLinkClick, toastRemovalDelay }: Props) => {
  const toastTimer = useRef<TimeoutID | null>(null);

  const { id, status, title, description, links } = toast;
  // Allows toastRemovalDelay to be configured when rendering Toast, or
  // via redux dispatch
  const removalDelay = toastRemovalDelay ?? toast.removalDelay;

  useEffect(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    if (status !== 'LOADING') {
      toastTimer.current = setTimeout(
        () => {
          onClose(id);
        },
        removalDelay
          ? toastRemovalDelayEnumLike[removalDelay]
          : toastRemovalDelayEnumLike.DefaultRemovalDelay
      );
    }

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, [id, onClose, status]);

  return (
    <Slide in direction="left" mountOnEnter unmountOnExit>
      <Alert
        onClose={() => onClose(id)}
        severity={status === 'LOADING' ? 'info' : status.toLowerCase()}
        sx={{ maxWidth: '350px' }}
        elevation={3}
      >
        <AlertTitle sx={{ mb: description ? 0.7 : 0 }}>{title}</AlertTitle>
        {description}

        {links && links.length > 0 && (
          <Box
            mt={description ? 2 : 1}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              'div:not(:last-child)': {
                marginRight: '6px',
              },
            }}
          >
            {links.map((link) => (
              <Box key={link.id}>
                <TextLink
                  text={link.text}
                  href={link.link}
                  withHashParam={link.withHashParam}
                  onClick={(event) => {
                    if (
                      typeof onLinkClick === 'function' &&
                      link.metadata?.action
                    ) {
                      onLinkClick(link);
                      event.preventDefault();
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Alert>
    </Slide>
  );
};

export default Toast;
