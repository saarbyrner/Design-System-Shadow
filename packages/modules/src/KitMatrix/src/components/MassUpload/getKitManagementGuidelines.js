// @flow

import i18n from '@kitman/common/src/utils/i18n';
import type { DataTypeGuidelines } from '@kitman/modules/src/shared/MassUpload/New/types';

export const getKitManagementGuidelines = (): DataTypeGuidelines => [
  {
    label: 'Type',
    isRequired: true,
    acceptedValues: [i18n.t('Player'), i18n.t('Goalkeeper'), i18n.t('Referee')],
  },
  {
    label: 'Club',
    isRequired: true,
    acceptedValues: [
      i18n.t(
        'Format must be Full club name for Player or Goalkeeper. For the Referee, use the association name.'
      ),
    ],
  },
  {
    label: 'Season',
    isRequired: true,
    acceptedValues: [i18n.t(`Format must be year (ie - 2025)`)],
  },
  {
    label: 'Kit name',
    isRequired: true,
    acceptedValues: [
      i18n.t(
        `Format should follow the naming conventions of the organisation.`
      ),
    ],
  },
  {
    label: 'Kit Color',
    isRequired: true,
    acceptedValues: [i18n.t(`Format must be a Hex color (ie - ${'#'}123456)`)],
  },
  {
    label: 'Jersey Color',
    isRequired: true,
    acceptedValues: [
      i18n.t('Format must be a valid color within the add kit side panel.'),
    ],
  },
  {
    label: 'Jersey URL',
    isRequired: true,
    acceptedValues: [i18n.t('Format must be URL')],
  },
  {
    label: 'Shorts Color',
    isRequired: true,
    acceptedValues: [
      i18n.t('Format must be a valid color within the add kit side panel.'),
    ],
  },
  {
    label: 'Shorts URL',
    isRequired: true,
    acceptedValues: [i18n.t('Format must be URL')],
  },
  {
    label: 'Socks Color',
    isRequired: true,
    acceptedValues: [
      i18n.t('Format must be a valid color within the add kit side panel.'),
    ],
  },
  {
    label: 'Socks URL',
    isRequired: true,
    acceptedValues: [i18n.t('Format must be URL')],
  },
];
