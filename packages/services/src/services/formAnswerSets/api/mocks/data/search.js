// @flow

import type {
  FetchMultipleFormAnswersSetsResponse,
  AnswersSet,
} from '@kitman/services/src/services/formAnswerSets/api/types';
import type { MetaCamelCase } from '@kitman/services/src/services/formTemplates/api/types';
import { initialMeta } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSets';

export const data: FetchMultipleFormAnswersSetsResponse = {
  data: [
    {
      id: 1,
      organisationId: 1,
      form: {
        id: 1,
        category: 'medical',
        group: 'motm_awards',
        key: 'motm',
        name: 'Man of the Match Winners',
        fullname: 'Players who have won man of the match for ireland',
        formType: 'motm_form',
        config: null,
        enabled: true,
        createdAt: '2022-09-21T18:23:20Z',
        updatedAt: '2022-09-21T18:23:20Z',
        formCategory: {
          id: 1,
          name: 'Other',
          productArea: 'medical',
          productAreaId: 1,
        },
      },
      date: '2024-07-02T14:56:51Z',
      editor: {
        id: 1,
        firstname: 'Cathal',
        lastname: 'Diver',
        fullname: 'Cathal Diver',
      },
      athlete: {
        id: 1,
        firstname: 'Robbie',
        lastname: 'Brady',
        fullname: 'Robbie Brady',
        position: {
          id: 1,
          name: 'Left Back',
          order: 1,
        },
        availability: 'unavailable',
        avatarUrl:
          'https://s3:9000/injpro-staging-public/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20241015%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241015T140807Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=2ad7faa20b8cfe65f9e4b1b642c35158e26c53a4d76b5933b1bbe729557bce95',
      },
      extra: null,
      status: 'complete',
    },
    {
      id: 2,
      organisationId: 1,
      form: {
        id: 1,
        category: 'medical',
        group: 'motm_awards',
        key: 'motm',
        name: 'Man of the Match Winners',
        fullname: 'Players who have won man of the match for ireland',
        formType: 'motm_form',
        config: null,
        enabled: true,
        createdAt: '2022-09-21T18:23:20Z',
        updatedAt: '2022-09-21T18:23:20Z',
        formCategory: {
          id: 2,
          name: 'Other',
          productArea: 'General',
          productAreaId: 2,
        },
      },
      date: '2024-07-03T14:56:51Z',
      editor: {
        id: 2,
        firstname: 'Juan',
        lastname: 'Gumy',
        fullname: 'Juan Gumy',
      },
      athlete: {
        id: 2,
        firstname: 'Caoimhin',
        lastname: 'Kelleher',
        fullname: 'Caoimhin Kelleher',
        position: {
          id: 1,
          name: 'Goalkeeper',
          order: 1,
        },
        availability: 'unavailable',
        avatarUrl:
          'https://s3:9000/injpro-staging-public/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20241015%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241015T140807Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=2ad7faa20b8cfe65f9e4b1b642c35158e26c53a4d76b5933b1bbe729557bce95',
      },
      extra: null,
      status: 'draft',
    },
  ],
  meta: initialMeta,
};

export const completedFormsMock: Array<AnswersSet> = [
  {
    id: 356485,
    organisationId: 6,
    form: {
      id: 342,
      category: 'medical',
      group: 'default_group',
      key: 'default_key',
      name: 'Test template',
      fullname: 'Test template',
      formType: 'survey',
      config: null,
      enabled: true,
      createdAt: '2025-02-07T13:30:02Z',
      updatedAt: '2025-02-07T13:32:55Z',
      formCategory: {
        id: 3,
        name: 'Other',
        productArea: 'medical',
        productAreaId: 1,
      },
    },
    date: '2025-02-07T13:48:32Z',
    editor: {
      id: 359780,
      firstname: 'Diarmuid',
      lastname: 'Forms',
      fullname: 'Diarmuid Forms',
    },
    athlete: {
      id: 2942,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
      availability: 'unavailable',
      avatarUrl:
        'https://s3:9000/injpro-staging-public/kitman-stock-assets/test.no_filetype_set?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20250226%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250226T175826Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=e0752275a0c7cf2fdcd41e9f6eb0a012d277616e7c5e419a3259ec2fdea25825',
    },
    extra: null,
    status: 'complete',
  },
  {
    id: 356419,
    organisationId: 6,
    form: {
      id: 337,
      category: 'medical',
      group: 'default_group',
      key: 'default_key',
      name: 'Org Branding test',
      fullname: 'Org Branding test',
      formType: 'survey',
      config: {
        generally_available: false,
      },
      enabled: true,
      createdAt: '2025-02-07T08:49:01Z',
      updatedAt: '2025-02-07T09:23:30Z',
      formCategory: {
        id: 4,
        name: 'Other',
        productArea: 'General',
        productAreaId: 1,
      },
    },
    date: '2025-02-07T11:14:59Z',
    editor: {
      id: 359780,
      firstname: 'Diarmuid',
      lastname: 'Forms',
      fullname: 'Diarmuid Forms',
    },
    athlete: {
      id: 92153,
      firstname: 'Willian',
      lastname: 'Gama',
      fullname: 'Willian Gama',
      position: {
        id: 73,
        name: 'Second Row',
        order: 4,
      },
      availability: 'available',
      avatarUrl:
        'https://s3:9000/injpro-staging-public/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20250226%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250226T175826Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=92bfc4e602ad96b6b8060251e701e07e8e6331515a1037d272b2c43f8eca3ca5',
    },
    extra: null,
    status: 'complete',
  },
  {
    id: 356414,
    organisationId: 6,
    form: {
      id: 341,
      category: 'medical',
      group: 'default_group',
      key: 'default_key',
      name: 'Form Branding',
      fullname: 'Form Branding',
      formType: 'survey',
      config: null,
      enabled: true,
      createdAt: '2025-02-07T11:01:01Z',
      updatedAt: '2025-02-07T11:03:25Z',
      formCategory: {
        id: 5,
        name: 'Other',
        productArea: 'General',
        productAreaId: 1,
      },
    },
    date: '2025-02-07T11:02:44Z',
    editor: {
      id: 127197,
      firstname: 'Bhuvan',
      lastname: 'Bhatt',
      fullname: 'Bhuvan Bhatt',
    },
    athlete: {
      id: 2942,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: {
        id: 77,
        name: 'Scrum Half',
        order: 8,
      },
      availability: 'unavailable',
      avatarUrl:
        'https://s3:9000/injpro-staging-public/kitman-stock-assets/test.no_filetype_set?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20250226%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250226T175826Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=e0752275a0c7cf2fdcd41e9f6eb0a012d277616e7c5e419a3259ec2fdea25825',
    },
    extra: null,
    status: 'complete',
  },
];

export const mockMeta: MetaCamelCase = {
  currentPage: 1,
  nextPage: 2,
  prevPage: null,
  totalPages: 17,
  totalCount: 423,
};

export const freeAgentWithPDFData = {
  data: [
    {
      id: 907639,
      organisationId: 6,
      form: {
        id: 120,
        category: 'medical',
        group: 'pl',
        key: 'pl-general-medical-v0.3',
        name: 'General Medical',
        fullname: 'General Medical',
        formType: 'medical',
        config: null,
        enabled: true,
        createdAt: '2023-08-10T11:25:22Z',
        updatedAt: '2025-07-08T16:57:32Z',
        formCategory: {
          id: 11,
          name: 'Other',
          productArea: 'Medical',
          productAreaId: 1,
        },
      },
      date: '2025-10-01T13:34:58Z',
      editor: {
        id: 153179,
        firstname: 'Willian',
        lastname: 'Gama',
        fullname: 'Willian Gama',
      },
      athlete: {
        id: 2942,
        firstname: 'TEST',
        lastname: 'Conway',
        fullname: 'TEST Conway',
        position: {
          id: 77,
          name: 'Scrum Half',
          order: 8,
        },
        availability: 'unavailable',
        avatarUrl:
          'https://kitman.imgix.net/kitman/f12434e31727ccf1315a37de6ab1e242.JPG?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
      },
      extra: null,
      status: 'complete',
      latestCompletedPdfExport: {
        id: 1778169,
        filetype: 'application/pdf',
        filesize: 3526994,
        filename: 'Records.pdf',
        downloadUrl:
          'http://s3:9000/injpro-staging/kitman/e992c003eb0488cc2e24b88b78350bb3.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20251003%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20251003T114723Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=a912f068a4b29875094f437f24af02fde6a83f711a6a9a9c2f964179c48c8aba',
      },
    },
  ],
  meta: {
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    totalPages: 1,
    totalCount: 1,
  },
};

export default data;
