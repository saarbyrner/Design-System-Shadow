import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { SEND_TO_KEY } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import {
  DATA_KEY,
  STATUS_KEY,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  mockSquadAthletes,
  mockState,
  mockUploadedFiles,
  mockFiles,
  mockCountryCodeGB,
  mockPhoneNumberGB,
  mockFaxNumber,
  mockContact,
} from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as mockOutboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import {
  mapSquadAthleteToOptions,
  mapFilesToOptions,
  validateField,
  validateSendDrawerData,
  validateContactDrawerData,
  getValidationStatus,
  getBase64Size,
  getContactDisplayText,
  getContactText,
  renderTextContent,
  renderContact,
  getStatusColor,
  renderStatus,
  renderAttachedTo,
  clearAnyExistingElectronicFileToast,
  generateRouteUrl,
  getAthleteName,
  getRowActions,
  getHasEndpointLoaded,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';
import {
  emptyValueText,
  TOAST_KEY,
  ACTION_KEY,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

describe('utils', () => {
  describe('mapSquadAthleteToOptions', () => {
    it('should map athletes to options correctly', () => {
      const options = mapSquadAthleteToOptions(mockSquadAthletes);
      expect(options).toEqual([
        { group: 'International Squad', id: 40211, label: 'Tomas Albornoz' },
        { group: 'International Squad', id: 108269, label: 'Mohamed Ali 2' },
        { group: 'Academy Squad', id: 40211, label: 'Tomas Albornoz' },
        { group: 'Academy Squad', id: 1242, label: 'Johnny Appleseed' },
      ]);
    });
  });

  describe('mapIssuesFilesToOptions', () => {
    it('should map issues files to options correctly', () => {
      const options = mapFilesToOptions(mockFiles.entity_attachments);
      expect(options).toEqual(
        mockFiles.entity_attachments.map((entityAttachment) => ({
          id: entityAttachment.attachment.id,
          label: entityAttachment.attachment.name,
          file: entityAttachment.attachment,
        }))
      );
    });
  });

  describe('validateField', () => {
    it('validates correctly with empty first name', () => {
      const errors = validateField(DATA_KEY.firstName, '');
      expect(errors).toEqual({ firstName: ['First name is required'] });
    });
    it('validates correctly with populated first name', () => {
      const errors = validateField(DATA_KEY.firstName, 'John Doe');
      expect(errors).toEqual({ firstName: [] });
    });
  });

  describe('getValidationStatus', () => {
    it('returns correctly with errors', () => {
      const errors = validateSendDrawerData({
        data: mockState.sendDrawerSlice.data,
        filesToUpload: [],
      });
      const validationStatus = getValidationStatus(errors);
      expect(validationStatus).toEqual(false);
    });
    it('returns correctly with no errors', () => {
      const validationStatus = getValidationStatus({ firstName: [] });
      expect(validationStatus).toEqual(true);
    });
  });

  describe('validateSendDrawerData', () => {
    it('validates correctly with empty files', () => {
      const errors = validateSendDrawerData({
        data: mockState.sendDrawerSlice.data,
        filesToUpload: [],
      });
      expect(errors).toEqual({
        savedContact: ['Contact is required'],
        message: ['Message is required'],
        files: ['At least one file is required'],
      });
    });

    it('validates correctly when files are populated', () => {
      const errors = validateSendDrawerData({
        data: mockState.sendDrawerSlice.data,
        filesToUpload: mockUploadedFiles,
      });
      expect(errors).toEqual({
        savedContact: ['Contact is required'],
        message: ['Message is required'],
        files: [],
      });
    });

    it('validates correctly with new contact with incorrect fax number', () => {
      const errors = validateSendDrawerData({
        data: {
          ...mockState.sendDrawerSlice.data,
          sendTo: SEND_TO_KEY.newContact,
          newContact: {
            number: '01234 567 891',
            name: null,
            address: null,
          },
        },
        filesToUpload: mockUploadedFiles,
      });
      expect(errors).toEqual({
        faxNumber: ['Fax number is required'],
        firstName: ['First name is required'],
        lastName: ['Last name is required'],
        companyName: ['Company name is required'],
        message: ['Message is required'],
        files: [],
      });
    });

    it('validates correctly with new contact with correct fax number', () => {
      const errors = validateSendDrawerData({
        data: {
          ...mockState.sendDrawerSlice.data,
          sendTo: SEND_TO_KEY.newContact,
          newContact: {
            fax_number: mockCountryCodeGB
              .split(' ')[3]
              .concat(mockPhoneNumberGB),
            first_name: null,
            last_name: null,
            company_name: null,
          },
        },
        filesToUpload: mockUploadedFiles,
      });
      expect(errors).toEqual({
        faxNumber: [],
        firstName: ['First name is required'],
        lastName: ['Last name is required'],
        companyName: ['Company name is required'],
        message: ['Message is required'],
        files: [],
      });
    });
  });

  describe('validateContactDrawerData', () => {
    it('validates correctly with contact with incorrect fax number', () => {
      const errors = validateContactDrawerData({
        data: {
          ...mockState.contactDrawerSlice.data,
          contact: {
            number: '01234 567 891',
            first_name: null,
            last_name: null,
            company_name: null,
          },
        },
        filesToUpload: mockUploadedFiles,
      });
      expect(errors).toEqual({
        faxNumber: ['Fax number is required'],
        firstName: ['First name is required'],
        lastName: ['Last name is required'],
        companyName: ['Company name is required'],
      });
    });

    it('validates correctly with contact with correct fax number', () => {
      const errors = validateContactDrawerData({
        data: {
          ...mockState.contactDrawerSlice.data,
          contact: {
            fax_number: mockCountryCodeGB
              .split(' ')[3]
              .concat(mockPhoneNumberGB),
            first_name: null,
            last_name: null,
            company_name: null,
          },
        },
      });
      expect(errors).toEqual({
        faxNumber: [],
        firstName: ['First name is required'],
        lastName: ['Last name is required'],
        companyName: ['Company name is required'],
      });
    });
  });

  describe('getBase64Size', () => {
    it('calculates correct size', async () => {
      const fileSize = await getBase64Size(mockUploadedFiles[0].file);
      expect(fileSize).toEqual(8);
    });
  });

  describe('getContactDisplayText', () => {
    it('returns correct data', () => {
      const data = {
        firstName: 'Jane',
        lastName: 'Doe',
        companyName: 'Kitman',
        faxNumber: mockFaxNumber.number,
      };
      const contactDisplayText = getContactDisplayText(data);
      expect(contactDisplayText).toEqual(
        `${data.firstName} ${data.lastName} - ${data.companyName} (${data.faxNumber})`
      );
    });
  });

  describe('getContactText', () => {
    it('returns correct data when inbox and received_from is a contact', () => {
      const data = {
        selectedMenuItem: MENU_ITEM.inbox,
        electronicFile: mockInboundData.data,
      };
      const receivedFrom = data.electronicFile.received_from;
      const contactText = getContactText(data);
      expect(contactText).toEqual(
        getContactDisplayText({
          firstName: receivedFrom.first_name,
          lastName: receivedFrom.last_name,
          companyName: receivedFrom.company_name,
          faxNumber: receivedFrom.fax_number.number,
        })
      );
    });

    it('returns correct data when inbox and received_from is null', () => {
      const data = {
        selectedMenuItem: MENU_ITEM.inbox,
        electronicFile: { ...mockInboundData.data, received_from: null },
      };
      const originatingFaxNumber =
        data.electronicFile.originating_fax_number.number;
      const contactText = getContactText(data);
      expect(contactText).toEqual(originatingFaxNumber);
    });

    it('returns correct data when inbox and received_from is null and originating_fax_number is null', () => {
      const data = {
        selectedMenuItem: MENU_ITEM.inbox,
        electronicFile: {
          ...mockInboundData.data,
          received_from: null,
          originating_fax_number: null,
        },
      };
      const contactText = getContactText(data);
      expect(contactText).toEqual(emptyValueText);
    });

    it('returns correct data when sent and sent_to is array of contacts', () => {
      const data = {
        selectedMenuItem: MENU_ITEM.sent,
        electronicFile: mockOutboundData.data,
      };
      const sentTo = data.electronicFile.sent_to[0];
      const contactText = getContactText(data);
      expect(contactText).toEqual(
        `${sentTo.first_name} ${sentTo.last_name} - ${sentTo.company_name} (${sentTo.fax_number.number})`
      );
    });

    it('returns correct data when sent and sent_to is an empty array', () => {
      const data = {
        selectedMenuItem: MENU_ITEM.sent,
        electronicFile: { ...mockOutboundData.data, sent_to: [] },
      };
      const contactText = getContactText(data);
      expect(contactText).toEqual(emptyValueText);
    });
  });
});

describe('renderTextContent', () => {
  const defaultParams = {
    content: 'test',
    fontWeight: 400,
  };
  const defaultProps = {
    children: 'test',
    component: 'div',
    sx: { fontWeight: 400, overflow: '', textOverflow: '', whiteSpace: '' },
    variant: 'body2',
  };
  it('returns correct component', () => {
    const textComponent = renderTextContent(defaultParams);
    expect(textComponent.props).toEqual(defaultProps);
  });

  it('returns correct component when content is null', () => {
    const textComponent = renderTextContent({ content: null });
    expect(textComponent.props).toEqual({
      ...defaultProps,
      children: '-',
    });
  });

  it('returns correct component when wrapText = true', () => {
    const textComponent = renderTextContent({
      ...defaultParams,
      wrapText: true,
    });
    expect(textComponent.props.sx).toEqual({
      ...defaultProps.sx,
      whiteSpace: 'pre-wrap',
    });
  });

  it('returns correct component when clipText = true', () => {
    const textComponent = renderTextContent({
      ...defaultParams,
      clipText: true,
    });
    expect(textComponent.props.sx).toEqual({
      ...defaultProps.sx,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });
});

describe('renderContact', () => {
  it('returns correct component', () => {
    const contactComponent = renderContact({ contact: mockContact });
    expect(contactComponent.props.children).toHaveLength(2);
  });

  it('returns correct component when clipText = true', () => {
    const contactComponent = renderContact({
      contact: mockContact,
      clipText: true,
    });
    contactComponent.props.children.forEach((child) => {
      expect(child.props.sx).toEqual({
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      });
    });
  });
});

describe('getStatusColor', () => {
  it('returns correct status color', () => {
    const statusColor = getStatusColor(STATUS_KEY.sending);
    expect(statusColor).toEqual('warning');
  });
});

describe('renderStatus', () => {
  it('returns correct component', () => {
    const statusComponent = renderStatus(STATUS_KEY.sending);
    expect(statusComponent.props).toEqual({
      label: 'Sending',
      color: 'warning',
      size: 'small',
    });
  });
});

describe('renderAttachedTo', () => {
  it('returns correct component', () => {
    const attachedToComponent = renderAttachedTo(
      mockInboundData.data?.efax_allocations,
      jest.fn()
    );
    expect(attachedToComponent.props.label).toEqual('2 players');
    expect(attachedToComponent.props.clickable).toEqual(true);
  });

  it('returns correct player count with duplicate athlete_id', () => {
    const attachedToComponent = renderAttachedTo([
      mockInboundData.data?.efax_allocations[0],
      {
        ...mockInboundData.data?.efax_allocations[1],
        athlete_id: 1,
      },
    ]);
    expect(attachedToComponent.props.label).toEqual('1 player');
  });
});

describe('clearAnyExistingElectronicFileToast', () => {
  it('calls dispatch correctly', () => {
    const mockDispatch = jest.fn();
    clearAnyExistingElectronicFileToast(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(16);

    Object.keys(TOAST_KEY).forEach((key, index) => {
      expect(mockDispatch).toHaveBeenNthCalledWith(index + 1, {
        payload: key,
        type: 'toasts/remove',
      });
    });
  });
});

describe('generateRouteUrl', () => {
  it('returns correct url when only selectedMenuItem is passed', () => {
    const url = generateRouteUrl({
      selectedMenuItem: MENU_ITEM.inbox,
    });
    expect(url).toEqual(`/efile/${MENU_ITEM.inbox}`);
  });

  it('returns correct url when selectedMenuItem and id is passed', () => {
    const id = 123;
    const url = generateRouteUrl({
      selectedMenuItem: MENU_ITEM.inbox,
      id,
    });
    expect(url).toEqual(`/efile/${MENU_ITEM.inbox}/${id}`);
  });

  it('returns empty string url when selectedMenuItem is not passed', () => {
    const id = 123;
    const url = generateRouteUrl({
      id,
    });
    expect(url).toEqual('');
  });
});

describe('getAthleteName', () => {
  it('returns correct content', () => {
    const content = getAthleteName(
      mockInboundData.data?.efax_allocations[0].athlete
    );
    expect(content).toEqual(
      `${mockInboundData.data?.efax_allocations[0].athlete.firstname} ${mockInboundData.data?.efax_allocations[0].athlete.lastname}`
    );
  });
});

describe('getRowActions', () => {
  it('onToggleViewed/onToggleArchived', () => {
    let rowActions = getRowActions({
      row: mockInboundData.data,
      selectedMenuItem: MENU_ITEM.inbox,
    });

    rowActions = rowActions.filter((rowAction) => !rowAction.hidden);

    expect(rowActions).toHaveLength(2);

    const toggleViewed = rowActions[0];
    const toggleArchived = rowActions[1];

    expect(toggleViewed.id).toEqual(ACTION_KEY.TOGGLE_VIEWED);
    expect(toggleViewed.label).toEqual('Mark as read');
    expect(toggleViewed.icon).toEqual(
      KITMAN_ICON_NAMES.MarkEmailUnreadOutlined
    );

    expect(toggleArchived.id).toEqual(ACTION_KEY.TOGGLE_ARCHIVED);
    expect(toggleArchived.label).toEqual('Archive');
    expect(toggleArchived.icon).toEqual(KITMAN_ICON_NAMES.ArchiveOutlined);
  });

  it('onUpdateContact/onToggleContactsArchived', () => {
    let rowActions = getRowActions({
      row: mockContact,
      selectedMenuItem: MENU_ITEM.contacts,
    });

    rowActions = rowActions.filter((rowAction) => !rowAction.hidden);

    expect(rowActions).toHaveLength(2);

    const updateContact = rowActions[0];
    const toggleContactsArchived = rowActions[1];

    expect(updateContact.id).toEqual(ACTION_KEY.UPDATE_CONTACT);
    expect(updateContact.label).toEqual('Edit');
    expect(updateContact.icon).toEqual(KITMAN_ICON_NAMES.EditOutlined);

    expect(toggleContactsArchived.id).toEqual(
      ACTION_KEY.TOGGLE_CONTACTS_ARCHIVED
    );
    expect(toggleContactsArchived.label).toEqual('Archive');
    expect(toggleContactsArchived.icon).toEqual(
      KITMAN_ICON_NAMES.ArchiveOutlined
    );
  });
});

describe('getHasEndpointLoaded', () => {
  it('returns the correct value when status = fulfilled', () => {
    const hasEndpointLoaded = getHasEndpointLoaded(
      mockState.electronicFilesApi.queries
    );

    expect(hasEndpointLoaded).toEqual({
      searchContactList: true,
      searchInboundElectronicFileList: true,
      searchOutboundElectronicFileList: true,
    });
  });

  it('returns the correct value when status = pending', () => {
    const hasEndpointLoaded = getHasEndpointLoaded({
      ...mockState.electronicFilesApi.queries,
      searchInboundElectronicFileList: {
        ...mockState.electronicFilesApi.queries.searchInboundElectronicFileList,
        status: 'pending',
      },
      searchOutboundElectronicFileList: {
        ...mockState.electronicFilesApi.queries
          .searchOutboundElectronicFileList,
        status: 'pending',
      },
      searchContactList: {
        ...mockState.electronicFilesApi.queries.searchContactList,
        status: 'pending',
      },
    });

    expect(hasEndpointLoaded).toEqual({
      searchContactList: false,
      searchInboundElectronicFileList: false,
      searchOutboundElectronicFileList: false,
    });
  });
});
