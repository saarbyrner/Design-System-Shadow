// @flow
import i18n from 'i18next';
import AlertBanner from '../AlertBanner/AlertBanner';
import styles from '../../styles';

type PHIAndPIIAlertBannerProps = {
  isPHI: boolean,
  isPII: boolean,
};

const PHIAndPIIAlertBanner = ({ isPHI, isPII }: PHIAndPIIAlertBannerProps) => {
  const phiText = i18n.t(
    'Authorized Access Only: This page contains Protected Health Information (PHI). Use of this system is monitored. Unauthorized access or disclosure of PHI is prohibited and subject to legal action.'
  );
  const piiText = i18n.t(
    'Authorized Access Only: This page contains Personally Identifiable Information (PII). Use of this system is monitored. Unauthorized access or misuse of PII is prohibited and subject to legal action.'
  );
  const defaultText = i18n.t(
    'Authorized Access Only: This page may contain Protected Health Information (PHI) and/or Personally Identifiable Information (PII). Use of this system is monitored. Unauthorized access or disclosure is prohibited and subject to legal action.'
  );
  const getIcon = 'icon-warning-active';

  if (isPHI || isPII) {
    const bannerColor = isPHI ? styles.phiBannerColor : styles.piiBannerColor;
    const iconColor = isPHI ? styles.phiIconColor : styles.iconColor;
    const content = isPHI ? phiText : piiText;

    return (
      <AlertBanner
        bannerColor={bannerColor}
        iconClassName={getIcon}
        iconColor={iconColor}
        bannerMessage={content}
      />
    );
  }

  return (
    <AlertBanner
      bannerColor={styles.defaultBannerColor}
      iconClassName={getIcon}
      iconColor={styles.iconColor}
      bannerMessage={defaultText}
    />
  );
};

export default PHIAndPIIAlertBanner;
