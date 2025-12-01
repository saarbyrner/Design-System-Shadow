// @flow
import { useState, useEffect, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  Typography,
  Stack,
  CircularProgress,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isAutosaving?: boolean,
  lastSaved?: ?string,
  autosaveError?: ?string,
};

const AutosaveStatus = ({
  isAutosaving,
  lastSaved,
  autosaveError,
  t,
}: I18nProps<Props>) => {
  const [timeAgoText, setTimeAgoText] = useState('');

  const formatTimeAgo = useCallback(
    (isoString: ?string): string => {
      if (!isoString) return '';

      const now = new Date();
      const savedDate = new Date(isoString);
      const seconds = Math.floor((now.getTime() - savedDate.getTime()) / 1000);

      if (seconds < 10) {
        return t('just now');
      }

      const minutes = Math.floor(seconds / 60);
      if (minutes < 1) {
        return t('less than a minute ago');
      }
      if (minutes === 1) {
        return t('1 minute ago');
      }
      if (minutes < 60) {
        return t('{{minutes}} minutes ago', { minutes });
      }

      const hours = Math.floor(minutes / 60);
      if (hours === 1) {
        return t('1 hour ago');
      }
      if (hours < 24) {
        return t('{{hours}} hours ago', { hours });
      }

      return t('at {{time}}', {
        time: savedDate.toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    },
    [t]
  );

  useEffect(() => {
    if (lastSaved) {
      setTimeAgoText(formatTimeAgo(lastSaved));
    }

    const intervalId = setInterval(() => {
      if (lastSaved) {
        setTimeAgoText(formatTimeAgo(lastSaved));
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [lastSaved, formatTimeAgo]);

  if (isAutosaving) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <CircularProgress size={12} color="inherit" />
        <Typography variant="caption" color="text.secondary">
          {t('Saving...')}
        </Typography>
      </Stack>
    );
  }

  if (autosaveError) {
    return (
      <Typography variant="caption" color="error" sx={{ alignSelf: 'center' }}>
        {autosaveError}
      </Typography>
    );
  }

  if (lastSaved && timeAgoText) {
    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ alignSelf: 'center' }}
      >
        {t('Last saved {{timeAgo}}', { timeAgo: timeAgoText })}
      </Typography>
    );
  }

  return null;
};

export const AutosaveStatusTranslated = withNamespaces()(AutosaveStatus);
export default AutosaveStatus;
