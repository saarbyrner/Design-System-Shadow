// @flow
import { initialState as mockSidebarState } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { initialState as mockSendDrawerState } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { initialState as contactDrawerState } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactDrawerSlice';
import { initialState as mockGridState } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import { initialState as mockContactsGridState } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';
import { initialState as mockDialogState } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/dialogSlice';
import { initialState as mockSplitSetupSlice } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import { initialState as mockDetailsGridSlice } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';

export const mockFaxNumber = {
  country_code: '1',
  country: 'US',
  number: '(866) 422-6438',
  number_international: '+1 866-422-6438',
  number_international_e164: '+18664226438',
  type: 'toll_free',
};

export const mockContact = {
  id: 1,
  first_name: 'Jane',
  last_name: 'Doe',
  company_name: 'Kitman',
  fax_number: mockFaxNumber,
  favorite: false,
  archived: false,
  archived_at: null,
  archived_by: null,
};

export const mockSquadAthletes = {
  squads: [
    {
      id: 8,
      name: 'International Squad',
      owner_id: 6,
      owner_name: 'Kitman Rugby Club',
      created_at: '2013-10-17T15:10:14Z',
      updated_at: null,
      athletes: [
        {
          id: 40211,
          fullname: 'Tomas Albornoz',
        },
        {
          id: 108269,
          fullname: 'Mohamed Ali 2',
        },
      ],
    },
    {
      id: 73,
      name: 'Academy Squad',
      owner_id: 6,
      owner_name: 'Kitman Rugby Club',
      created_at: '2015-09-07T12:29:54Z',
      updated_at: '2015-09-07T12:29:54Z',
      athletes: [
        {
          id: 40211,
          fullname: 'Tomas Albornoz',
        },
        {
          id: 1242,
          fullname: 'Johnny Appleseed',
        },
      ],
    },
  ],
};

export const mockDocumentFileTypes = [
  {
    value: 'image',
    label: 'Images',
  },
  {
    value: 'pdf',
    label: 'PDFs',
  },
  {
    value: 'document',
    label: 'Documents',
  },
  {
    value: 'audio',
    label: 'Audio',
  },
  {
    value: 'video',
    label: 'Videos',
  },
  {
    value: 'spreadsheet',
    label: 'Spreadsheets',
  },
  {
    value: 'presentation',
    label: 'Presentations',
  },
  {
    value: 'zip',
    label: 'Zip files',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export const mockDocumentCategories = [
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
  { id: 3, name: 'Category 3' },
];

const mockFileUrl = 'https://test.com/liverpool.jpg';

export const mockAttachment = {
  id: 325505,
  url: mockFileUrl,
  filename: 'liverpool.jpg',
  filetype: 'image/jpeg',
  filesize: 34711,
  audio_file: false,
  confirmed: true,
  presigned_post: null,
  download_url: mockFileUrl,
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
};

export const mockFiles = {
  entity_attachments: [
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
      attachment: mockAttachment,
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
      attachment: mockAttachment,
    },
  ],
  meta: {
    pagination: {
      next_token: 'sometoken',
    },
  },
};

export const mockUploadedFiles = [
  {
    id: 'abc123',
    file: new File(['foobar'], 'foobar.pdf', {
      type: 'application/pdf',
    }),
  },
  {
    id: 'def456',
    file: new File(['foo'], 'foo.png', {
      type: 'image/png',
    }),
  },
  {
    id: 'ghi789',
    file: new File(['bar'], 'bar.jpg', {
      type: 'image/jpg',
    }),
  },
];

export const mockAttachedFiles = [
  {
    id: 1,
    name: 'File1.pdf',
    filesize: 10,
    filetype: 'application/pdf',
    url: 'http://test.com/File1.pdf',
  },
  {
    id: 2,
    name: 'File2.png',
    filesize: 5,
    filetype: 'image/png',
    url: 'http://test.com/File2.png',
  },
  {
    id: 3,
    name: 'File3.jpg',
    filesize: 20,
    filetype: 'image/jpg',
    url: 'http://test.com/Fil3.jpg',
  },
];

export const mockPhoneNumberUS = '12155876065';
export const mockPhoneNumberGB = '1234567891';

export const mockCountryCodeUS = 'United States (US) +1';
export const mockCountryCodeGB = 'United Kingdom (GB) +44';

export const mockState = {
  sidebarSlice: mockSidebarState,
  sendDrawerSlice: mockSendDrawerState,
  contactDrawerSlice: contactDrawerState,
  gridSlice: mockGridState,
  contactsGridSlice: mockContactsGridState,
  dialogSlice: mockDialogState,
  splitSetupSlice: mockSplitSetupSlice,
  detailsGridSlice: mockDetailsGridSlice,
  electronicFilesApi: {
    queries: {
      searchInboundElectronicFileList: {
        endpointName: 'searchInboundElectronicFileList',
        status: 'fulfilled',
      },
      searchOutboundElectronicFileList: {
        endpointName: 'searchOutboundElectronicFileList',
        status: 'fulfilled',
      },
      searchContactList: {
        endpointName: 'searchContactList',
        status: 'fulfilled',
      },
    },
  },
};

export const mockDateRangeValue = '03/04/2024 – 03/07/2024';

export const mockSearchValue = 'dummy search';

export const mockSelectOptions = [
  { label: 'Option 1', id: 'Option1' },
  { label: 'Option 2', id: 'Option2' },
];

export const mockSelectValue = mockSelectOptions[1].label;

export const mockAllocations = [
  {
    id: 17,
    file_name: 'test',
    athlete_id: 1,
    range: '1-5',
    document_date: '2024-06-16T23:00:00Z',
    medical_attachment_category_ids: [1],
    athlete: {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
    },
  },
  {
    id: 17,
    file_name: 'test',
    athlete_id: 2,
    range: '6-10',
    document_date: '2024-06-24T23:00:00Z',
    medical_attachment_category_ids: [2],
    athlete: {
      id: 2,
      firstname: 'Joe',
      lastname: 'Bloggs',
    },
  },
];
