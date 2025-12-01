// @flow
import type { HumanInputFormAnswer } from '@kitman/modules/src/HumanInput/types/forms';

export const nonRepeatableAttachmentFormAnswerSets: Array<HumanInputFormAnswer> =
  [
    {
      id: 6839034,
      form_element: {
        id: 39062,
        element_type: 'Forms::Elements::Inputs::Attachment',
        config: {
          data_point: false,
          element_id: 'df391be4-1a98-46c7-84c3-8d2d19ed5466',
          custom_params: {
            type: 'signature',
          },
          optional: true,
        },
        visible: true,
        order: 1,
        form_elements: [],
      },
      value: 1476962,
      created_at: '2025-02-14T14:29:12Z',
      updated_at: '2025-02-14T14:29:12Z',
      attachment: {
        id: 1476962,
        url: 'https://s3:9000/injpro-staging',
        filename: 'Diamond_Cluster_1476962.jpeg',
        filetype: 'image/jpeg',
        filesize: 137177,
        created: '2025-02-14T14:29:11Z',
        created_by: {
          id: 155134,
          firstname: 'Cathal',
          lastname: 'Diver',
          fullname: 'Cathal Diver',
        },
        attachment_date: '2025-02-14T14:29:11Z',
      },
    },
    {
      id: 6839035,
      form_element: {
        id: 39063,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              label: 'Yes',
              value: 'yes',
            },
            {
              label: 'No',
              value: 'no',
            },
            {
              label: 'Kind of',
              value: 'kind_of',
            },
          ],
          text: 'Is it raining today?',
          data_point: false,
          element_id: '71d144e6-4c7b-4d96-9619-c9e70c29caa7',
          custom_params: {},
          optional: true,
        },
        visible: true,
        order: 1,
        form_elements: [],
      },
      value: 'yes',
      created_at: '2025-02-14T14:29:12Z',
      updated_at: '2025-02-14T14:29:12Z',
      attachment: null,
    },
  ];
