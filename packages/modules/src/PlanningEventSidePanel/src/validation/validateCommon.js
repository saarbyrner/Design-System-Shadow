// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { validateURL, containsWhitespace } from '@kitman/common/src/utils';
import { isPositiveIntNumber } from '@kitman/common/src/utils/inputValidation';

// Types
import type {
  EventFormCommonAttributes,
  CommonAttributesValidityExact,
} from '../types';

const validateCommon = (
  formData: EventFormCommonAttributes,
  isInSeasonEvent: boolean = true
): CommonAttributesValidityExact => {
  return {
    duration: {
      isInvalid:
        formData.duration == null
          ? false
          : !isPositiveIntNumber(formData.duration, true),
    },
    local_timezone: {
      isInvalid: formData.local_timezone == null,
    },
    start_time: {
      isInvalid: formData.start_time == null || !isInSeasonEvent,

      messages: !isInSeasonEvent
        ? [
            i18n.t(
              'This Game is outside your current squad Season Markers. Please contact the admin team to re-configure your season markers.'
            ),
          ]
        : [],
    },
    ...(window.featureFlags['event-attachments'] && {
      // check if a list of unUploaded files exists, that there are no empty string titles
      // and the categories are not empty
      unUploadedFiles: {
        isInvalid:
          !!formData.unUploadedFiles &&
          formData.unUploadedFiles.filter(
            (unUploadedFile) =>
              unUploadedFile.fileTitle === '' ||
              !unUploadedFile.event_attachment_category_ids?.length
          ).length > 0,
      },
      // check if a list of unUploaded links exists, that there are no empty string titles
      // all valid uri's, and the categories are not empty
      unUploadedLinks: {
        isInvalid:
          !!formData.unUploadedLinks &&
          formData.unUploadedLinks.filter(
            (unUploadedLink) =>
              unUploadedLink.title === '' ||
              ((!validateURL(unUploadedLink.uri) ||
                containsWhitespace(unUploadedLink.uri)) &&
                unUploadedLink.uri.length >= 0) ||
              !unUploadedLink.event_attachment_category_ids?.length
          ).length > 0,
      },
      ...(window.featureFlags['event-locations'] && {
        event_location: { isInvalid: false },
      }),
    }),

    // Optional fields that don't require validation:
    // id, title
  };
};

export default validateCommon;
