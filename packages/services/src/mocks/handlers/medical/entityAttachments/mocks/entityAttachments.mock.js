// @flow
import type { EntityAttachmentSearchResponse } from '@kitman/services/src/services/medical/searchMedicalEntityAttachments';
import type { EntityAttachment } from '@kitman/modules/src/Medical/shared/types/medical';

export const entityAttachments: Array<EntityAttachment> = [
  {
    entity: {
      id: 7,
      entity_type: 'document_v2',
      entity_date: '2023-08-13T23:00:00Z',
      entity_title: null,
      athlete: {
        id: 15642,
        fullname: 'hugo beuzeboc',
        position: 'Loose-head Prop',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1RJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2\u0026markalign=left%2Cbottom\u0026markfit=max\u0026markpad=0\u0026w=100',
      },
      organisation_id: 6,
      injury_occurrences: [],
      illness_occurrences: [
        {
          id: 100,
          issue_type: 'Illness',
          occurrence_date: '6 Oct 2022',
          full_pathology: 'Abcess Ankle (excl. Joint) [Left]',
          issue_occurrence_title: '',
        },
      ],
      chronic_issues: [],
    },
    attachment: {
      id: 325506,
      url: 'http://s3:9000/injpro-staging/kitman/37587f062d78603afe1018c909fd5254.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20230814%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20230814T084316Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=ab9806346ad7775c095ec4effc525aae92e7420bb248c4fa0559f73dba0f1fd8',
      filename: 'batDuck.jpg',
      filetype: 'image/jpeg',
      filesize: 35920,
      audio_file: false,
      confirmed: true,
      presigned_post: null,
      download_url:
        'http://s3:9000/injpro-staging/kitman/37587f062d78603afe1018c909fd5254.jpg?response-content-disposition=attachment\u0026X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20230814%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20230814T084316Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=6c30eed4749ad039dbb55416e4643fc4b633af76cbc3d2ee053efdb1544536cd',
      created_by: {
        id: 97443,
        firstname: 'David',
        lastname: 'Kelly',
        fullname: 'David Kelly',
      },
      created: '2023-08-14T08:28:30Z',
      attachment_date: '2023-08-14T08:28:30Z',
      name: 'batDuck.jpg',
      archived_at: null,
      archive_reason: null,
      medical_attachment_categories: [
        {
          id: 4,
          name: 'Physical Exams',
        },
      ],
    },
  },
  {
    entity: {
      id: 6,
      entity_type: 'document_v2',
      entity_date: '2023-08-13T23:00:00Z',
      entity_title: null,
      athlete: {
        id: 15642,
        fullname: 'hugo beuzeboc',
        position: 'Loose-head Prop',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1RJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2\u0026markalign=left%2Cbottom\u0026markfit=max\u0026markpad=0\u0026w=100',
      },
      organisation_id: 6,
      injury_occurrences: [
        {
          id: 200,
          issue_type: 'Injury',
          occurrence_date: '6 Oct 2022',
          full_pathology: 'Abcess Ankle (excl. Joint) [Left]',
          issue_occurrence_title: '',
        },
      ],
      illness_occurrences: [],
      chronic_issues: [],
    },
    attachment: {
      id: 325505,
      url: 'http://s3:9000/injpro-staging/kitman/0d2a0c22926ec4ddb9e6930e8e2630d0.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20230814%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20230814T084316Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=9add62f2d8610063488c0d26bfa079d46929cf0c376977232848d64f4b0d4d5b',
      filename: 'liverpool.jpg',
      filetype: 'image/jpeg',
      filesize: 34711,
      audio_file: false,
      confirmed: true,
      presigned_post: null,
      download_url:
        'http://s3:9000/injpro-staging/kitman/0d2a0c22926ec4ddb9e6930e8e2630d0.jpg?response-content-disposition=attachment\u0026X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20230814%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20230814T084316Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=ac2d69ad9e922e9cfcba79d3d1b0a53b7f1738c2a75906b2e4e7472c7786c6af',
      created_by: {
        id: 97443,
        firstname: 'David',
        lastname: 'Kelly',
        fullname: 'David Kelly',
      },
      created: '2023-08-14T08:28:29Z',
      attachment_date: '2023-08-14T08:28:29Z',
      name: 'liverpool.jpg',
      archived_at: null,
      archive_reason: null,
      medical_attachment_categories: [
        {
          id: 4,
          name: 'Physical Exams',
        },
      ],
    },
  },
  {
    entity: {
      id: 5,
      entity_type: 'form_answers_set',
      entity_date: '2023-08-12T23:00:00Z',
      entity_title: null,
      athlete: {
        id: 15642,
        fullname: 'hugo beuzeboc',
        position: 'Loose-head Prop',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1RJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2\u0026markalign=left%2Cbottom\u0026markfit=max\u0026markpad=0\u0026w=100',
      },
      organisation_id: 6,
      injury_occurrences: [],
      illness_occurrences: [],
      chronic_issues: [],
    },
    attachment: {
      id: 325504,
      url: 'http://s3:9000/injpro-staging/kitman/b8ecc64d20a142b5d11c7eeb441b9c66.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20230814%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20230814T084316Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=5df22f892d2091ad9ea535451ca4cac72f197a9fa7e7c091d1f66965686cf918',
      filename: 'solidDuck.jpg',
      filetype: 'image/jpeg',
      filesize: 154799,
      audio_file: false,
      confirmed: true,
      presigned_post: null,
      download_url:
        'http://s3:9000/injpro-staging/kitman/b8ecc64d20a142b5d11c7eeb441b9c66.jpg?response-content-disposition=attachment\u0026X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20230814%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20230814T084316Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=ac7bc570770c841be954278e5e64d23f2d77f7b95a7b2f90271a932159b2ffeb',
      created_by: {
        id: 97443,
        firstname: 'David',
        lastname: 'Kelly',
        fullname: 'David Kelly',
      },
      created: '2023-08-13T21:42:41Z',
      attachment_date: '2023-08-13T21:42:41Z',
      name: 'solidDuck.jpg',
      archived_at: null,
      archive_reason: null,
      medical_attachment_categories: [
        {
          id: 2,
          name: 'Lab Docs',
        },
      ],
    },
  },
];

export const entityAttachmentSearchResponse: EntityAttachmentSearchResponse = {
  entity_attachments: entityAttachments,
  meta: {
    pagination: {
      next_token: 'sometoken',
    },
  },
};
