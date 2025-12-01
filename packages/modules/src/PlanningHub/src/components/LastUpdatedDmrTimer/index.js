// @flow

import { Typography } from '@kitman/playbook/components';
import { useEffect, useState } from 'react';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import type { I18nProps, Translation } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';

type Props = {
  lastUpdatedAt: number | null,
};

const getTimeAgoText = (diffInSeconds: number, t: Translation): string => {
  if (diffInSeconds > 60) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const unit = diffInMinutes === 1 ? t('minute') : t('minutes');
    return t('{{diff}} {{unit}} ago', { diff: diffInMinutes, unit });
  }

  const unit = diffInSeconds === 1 ? t('second') : t('seconds');
  return t('{{diff}} {{unit}} ago', { diff: diffInSeconds, unit });
};

const LastUpdatedDmrTimer = ({ lastUpdatedAt, t }: I18nProps<Props>) => {
  const { preferences } = usePreferences();
  const { isLeagueStaffUser } = useLeagueOperations();

  const [diffSeconds, setDiffSeconds] = useState<number>(0);

  const intervalSeconds =
    preferences?.schedule_page_refresh_interval_seconds ?? 0;
  const isAutoRefreshEnabled = isLeagueStaffUser && intervalSeconds;

  useEffect(() => {
    let intervalId: ?IntervalID;

    if (intervalId) {
      clearInterval(intervalId);
    }

    if (lastUpdatedAt && isAutoRefreshEnabled) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - lastUpdatedAt) / 1000);
        setDiffSeconds(diff);
      }, 1000);
    } else {
      setDiffSeconds(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [lastUpdatedAt, isAutoRefreshEnabled]);

  if (!isAutoRefreshEnabled) {
    return null;
  }

  return (
    <Typography
      variant="body2"
      color="text.primary"
      sx={{ marginTop: 1, marginBottom: 2 }}
    >
      {t('Last refresh')}: {getTimeAgoText(diffSeconds, t)}
    </Typography>
  );
};

export const LastUpdatedDmrTimerTranslated =
  withNamespaces()(LastUpdatedDmrTimer);
export default LastUpdatedDmrTimer;
