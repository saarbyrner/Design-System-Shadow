// @flow
import { withNamespaces } from 'react-i18next';

import { EventAttachmentCategoriesTranslated as EventAttachmentCategories } from './EventAttachmentCategories';
import { EventTypesTranslated as EventTypes } from './EventTypes';
import styles from './utils/styles';

const CalendarSettings = () => {
  return (
    <div css={styles.pageWrapper}>
      <EventTypes />
      {!window.featureFlags['hide-attachement-categories-settings-ip'] && (
        <div css={styles.pageContainer}>
          <EventAttachmentCategories />
        </div>
      )}
    </div>
  );
};

export const CalendarSettingsTranslated = withNamespaces()(CalendarSettings);

export default CalendarSettings;
