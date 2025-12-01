// @flow
import type { ExportableElements } from '@kitman/services/src/services/exports/generic/redux/services/types';

export const data: ExportableElements = [
  {
    type: 'menu_group',
    key: 'documentation',
    label: 'Documentation',
    children: [
      {
        type: 'menu_item',
        key: 'passport',
        label: 'Passport',
        children: [
          {
            type: 'item',
            label: 'Passport number',
            object: 'athlete_profile_variable',
            field: 'passport_number',
          },
          {
            type: 'item',
            label: 'Passport name',
            object: 'athlete_profile_variable',
            field: 'passport_name',
          },
        ],
      },
      {
        type: 'menu_item',
        key: 'ehic',
        label: 'EHIC',
        children: [
          {
            type: 'item',
            label: 'Has European Health Insurance (EHIC) card?',
            object: 'athlete_profile_variable',
            field: 'has_ehic',
          },
          {
            type: 'group',
            key: 'ehic_group',
            label: 'Ehic group',
            children: [
              {
                type: 'item',
                label: 'EHIC personal identification number',
                object: 'athlete_profile_variable',
                field: 'ehic_personal_id_number',
              },
              {
                type: 'item',
                label: 'EHIC expiry date',
                object: 'athlete_profile_variable',
                field: 'ehic_expiry_date',
              },
            ],
          },
        ],
      },
    ],
  },
];

export default data;
