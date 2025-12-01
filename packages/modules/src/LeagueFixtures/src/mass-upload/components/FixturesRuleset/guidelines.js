// @flow

import i18n from '@kitman/common/src/utils/i18n';
import type { DataTypeGuidelines } from '@kitman/modules/src/shared/MassUpload/New/types';

export const getGuidelines = ({
  acceptedDateFormats,
}: {
  acceptedDateFormats: Array<{
    format: string,
    example: string,
  }>,
}): DataTypeGuidelines => [
  {
    label: 'Match ID',
    isRequired: true,
    acceptedValues: [i18n.t('Unit: numeric')],
  },
  {
    label: 'Competition',
    isRequired: true,
    acceptedValues: [],
  },
  {
    label: 'Match Day',
    isRequired: false,
    acceptedValues: [i18n.t('Unit: numeric')],
  },
  {
    label: 'Date Time',
    isRequired: true,
    acceptedValues: [
      i18n.t(`Format must be {{formats}}`, {
        formats: acceptedDateFormats
          .map((entry) => `${entry.format} (ie - ${entry.example})`)
          .join(', '),
      }),
    ],
  },
  {
    label: 'Kick Time',
    isRequired: true,
    acceptedValues: [
      i18n.t(`Format must be {{formats}}`, {
        formats: acceptedDateFormats
          .map((entry) => `${entry.format} (ie - ${entry.example})`)
          .join(', '),
      }),
    ],
  },
  {
    label: 'Timezone',
    isRequired: true,
    acceptedValues: [],
  },
  {
    label: 'Duration',
    isRequired: true,
    acceptedValues: [i18n.t('Unit: numeric')],
  },
  {
    label: 'Home Team',
    isRequired: true,
    acceptedValues: [i18n.t('Format must be Full club name')],
  },
  {
    label: 'Home Squad',
    isRequired: true,
    acceptedValues: [],
  },
  {
    label: 'Away Team',
    isRequired: true,
    acceptedValues: [i18n.t('Format must be Full club name')],
  },
  {
    label: 'Away Squad',
    isRequired: true,
    acceptedValues: [],
  },
  {
    label: 'Venue',
    isRequired: false,
    acceptedValues: [i18n.t('Name of game venue')],
  },
  {
    label: 'TV',
    isRequired: false,
    acceptedValues: [i18n.t('Example: Apple TV')],
  },
  {
    label: 'Match Director',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'Referee',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'AR1',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'AR2',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: '4th Official',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'VAR',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'AVAR',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'Notification Recipient',
    isRequired: false,
    acceptedValues: [i18n.t('Format must be email address')],
  },
  {
    label: 'Hide from club',
    isRequired: false,
    acceptedValues: [
      `Yes ${i18n.t('or')} No`,
      `True ${i18n.t('or')} False`,
      `Y ${i18n.t('or')} N`,
      i18n.t('0 or 1'),
    ],
  },
];
