// @flow
import type { Node } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import parsePhoneNumber from 'libphonenumber-js';
import { compact, capitalize } from 'lodash';
import type { Option } from '@kitman/playbook/types';
import {
  DATA_KEY,
  STATUS_KEY,
  type Errors,
  type SquadAthletes,
  type ElectronicFile,
  type ExistingContact,
  type NewContact,
  type FaxNumber,
  type StatusKey,
  type AllocationAttribute,
  type AllocationAthlete,
  type ContactFormData,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { type ToastDispatch } from '@kitman/components/src/Toast/types';
import { type ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { EntityAttachment } from '@kitman/modules/src/Medical/shared/types/medical';
import {
  SEND_TO_KEY,
  SEND_DRAWER_DATA_KEY,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import {
  MENU_ITEM,
  type MenuItemKey,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import type { DrawerData } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import {
  TOAST_KEY,
  ACTION_KEY,
  emptyValueText,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { TOAST_KEY as DOCUMENT_SPLITTER_TOAST_KEY } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { Box, Typography, Chip } from '@kitman/playbook/components';
import { remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

export const mapSquadAthleteToOptions = (
  squadAthletes: SquadAthletes
): Array<Option> => {
  return squadAthletes.squads
    .map((squad) =>
      squad.athletes.map((athlete) => ({
        id: athlete.id,
        label: athlete.fullname,
        group: squad.name,
      }))
    )
    .flat();
};

export const mapFilesToOptions = (
  entityAttachments: Array<EntityAttachment>
): Array<Option> => {
  return entityAttachments.map((entityAttachment) => ({
    id: entityAttachment.attachment.id,
    label: entityAttachment.attachment.name,
    file: entityAttachment.attachment,
  }));
};

export const validateField = (
  field: string,
  value: ?string | ?FaxNumber | ?ExistingContact | ?NewContact
) => {
  const errors = {};
  switch (field) {
    case SEND_DRAWER_DATA_KEY.savedContact:
      // $FlowIgnore[missing-annot]
      errors[field] = compact([!value && i18n.t('Contact is required')]);
      break;
    case DATA_KEY.countryCode:
      // $FlowIgnore[missing-annot]
      errors.countryCode = compact([
        !value && [i18n.t('Country code is required')],
      ]);
      break;
    case DATA_KEY.faxNumber:
      // $FlowIgnore[missing-annot]
      errors[field] = compact([
        !value && i18n.t('Fax number is required'),
        value &&
          !parsePhoneNumber(value)?.isValid() &&
          i18n.t('The fax number entered is invalid'),
      ]);
      break;
    case DATA_KEY.firstName:
      // $FlowIgnore[missing-annot]
      errors[field] = compact([!value && i18n.t('First name is required')]);
      break;
    case DATA_KEY.lastName:
      // $FlowIgnore[missing-annot]
      errors[field] = compact([!value && i18n.t('Last name is required')]);
      break;
    case DATA_KEY.companyName:
      // $FlowIgnore[missing-annot]
      errors[field] = compact([!value && i18n.t('Company name is required')]);
      break;
    case SEND_DRAWER_DATA_KEY.message:
      // $FlowIgnore[missing-annot]
      errors[field] = compact([!value && i18n.t('Message is required')]);
      break;
    default:
      errors[field] = [];
      break;
  }

  return errors;
};

export const validateSendDrawerData = ({
  data,
  filesToUpload = null,
}: {
  data: DrawerData,
  filesToUpload?: Array<AttachedFile>,
}) => {
  let errors = {};

  if (data.sendTo === SEND_TO_KEY.savedContact) {
    errors = {
      ...errors,
      ...validateField(SEND_DRAWER_DATA_KEY.savedContact, data.savedContact),
    };
  }

  if (data.sendTo === SEND_TO_KEY.newContact) {
    errors = {
      ...errors,
      ...validateField(DATA_KEY.faxNumber, data.newContact?.fax_number),
      ...validateField(DATA_KEY.firstName, data.newContact?.first_name),
      ...validateField(DATA_KEY.lastName, data.newContact?.last_name),
      ...validateField(DATA_KEY.companyName, data.newContact?.company_name),
    };
  }

  errors = {
    ...errors,
    ...validateField(SEND_DRAWER_DATA_KEY.message, data.message),
    files: [
      ...(filesToUpload && !filesToUpload.length && !data.attachedFiles.length
        ? [i18n.t('At least one file is required')]
        : []),
    ],
  };

  return errors;
};

export const validateContactDrawerData = ({
  data,
}: {
  data: ContactFormData,
}) => {
  const errors = {
    ...validateField(DATA_KEY.faxNumber, data.contact?.fax_number),
    ...validateField(DATA_KEY.firstName, data.contact?.first_name),
    ...validateField(DATA_KEY.lastName, data.contact?.last_name),
    ...validateField(DATA_KEY.companyName, data.contact?.company_name),
  };

  return errors;
};

export const getValidationStatus = (errors: Errors) => {
  const errorKeys = Object.keys(errors);
  if (errorKeys.length) {
    const errorCounts = errorKeys.map(
      (errorKey: string) => errors[errorKey].length
    );
    return errorCounts.reduce((partialSum, a) => partialSum + a, 0) === 0;
  }

  return true;
};

export const getBase64Size = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64WithPrefix = reader.result ? reader.result?.toString() : '';
      const base64 = base64WithPrefix.substring(
        base64WithPrefix.indexOf(',') + 1
      );
      resolve(new File([base64], 'base64').size);
    };
    reader.onerror = reject;
  });
};

export const getAthleteName = (athlete: AllocationAthlete) => {
  return `${athlete.firstname} ${athlete.lastname}`;
};

export const getContactDisplayText = ({
  firstName,
  lastName,
  companyName,
  faxNumber,
}: {
  firstName: string,
  lastName: string,
  companyName: string,
  faxNumber: string,
}) => {
  return `${firstName} ${lastName} - ${companyName} (${faxNumber})`;
};

export const getContactText = ({
  selectedMenuItem,
  electronicFile,
}: {
  selectedMenuItem: MenuItemKey,
  electronicFile: ElectronicFile,
}) => {
  if (selectedMenuItem === MENU_ITEM.inbox) {
    if (electronicFile.received_from) {
      return getContactDisplayText({
        firstName: electronicFile.received_from.first_name,
        lastName: electronicFile.received_from.last_name,
        companyName: electronicFile.received_from.company_name,
        faxNumber: electronicFile.received_from.fax_number.number,
      });
    }

    return electronicFile.originating_fax_number?.number || emptyValueText;
  }

  return electronicFile.sent_to.length !== 0
    ? getContactDisplayText({
        firstName: electronicFile.sent_to[0].first_name,
        lastName: electronicFile.sent_to[0].last_name,
        companyName: electronicFile.sent_to[0].company_name,
        faxNumber: electronicFile.sent_to[0].fax_number.number,
      })
    : emptyValueText;
};

export const renderTextContent = ({
  content = emptyValueText,
  fontWeight = 400,
  wrapText = false,
  clipText = false,
}: {
  content?: ?(string | Node),
  fontWeight?: number,
  wrapText?: boolean,
  clipText?: boolean,
}) => {
  return (
    <Typography
      sx={{
        fontWeight,
        whiteSpace: wrapText ? 'pre-wrap' : '',
        overflow: clipText ? 'hidden' : '',
        textOverflow: clipText ? 'ellipsis' : '',
      }}
      variant="body2"
      component="div"
    >
      {content || emptyValueText}
    </Typography>
  );
};

export const renderContact = ({
  contact,
  clipText = false,
}: {
  contact: ExistingContact,
  clipText: boolean,
}) => {
  return (
    <Box>
      <Box
        sx={{
          ...(clipText && { textOverflow: 'ellipsis', overflow: 'hidden' }),
        }}
      >{`${contact.first_name} ${contact.last_name} - ${contact.company_name}`}</Box>
      <Box
        sx={{
          ...(clipText && { textOverflow: 'ellipsis', overflow: 'hidden' }),
        }}
      >{`${contact.fax_number.number}`}</Box>
    </Box>
  );
};

export const getStatusColor = (status: string | StatusKey) => {
  switch (status) {
    case STATUS_KEY.sending:
      return 'warning';
    case STATUS_KEY.sent:
      return 'success';
    case STATUS_KEY.error:
      return 'error';
    default:
      return null;
  }
};

export const renderStatus = (status: string | StatusKey) => {
  return (
    <Chip
      label={capitalize(status)}
      color={getStatusColor(status)}
      size="small"
    />
  );
};

export const renderAttachedTo = (
  allocations: Array<AllocationAttribute>,
  onClick?: (allocations: Array<AllocationAttribute>) => void
) => {
  const athleteIds = [
    ...new Set(allocations.map((allocation) => allocation.athlete_id)),
  ];
  return (
    <Chip
      label={
        athleteIds.length === 1
          ? i18n.t('1 player')
          : i18n.t('{{count}} players', {
              count: athleteIds.length,
            })
      }
      clickable={!!onClick}
      onClick={(e) => {
        // https://github.com/mui/mui-x/issues/891#issuecomment-863580714
        e.stopPropagation();
        onClick?.(allocations);
      }}
    />
  );
};

export const clearAnyExistingElectronicFileToast = (
  dispatch: ToastDispatch<ToastAction>
) => {
  dispatch(remove(TOAST_KEY.SEND_EFILE_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.SEND_EFILE_ERROR_TOAST));
  dispatch(remove(TOAST_KEY.ARCHIVE_EFILE_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.UNARCHIVE_EFILE_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.BULK_ARCHIVE_EFILE_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.BULK_UNARCHIVE_EFILE_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.CREATE_CONTACT_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.CREATE_CONTACT_ERROR_TOAST));
  dispatch(remove(TOAST_KEY.UPDATE_CONTACT_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.UPDATE_CONTACT_ERROR_TOAST));
  dispatch(remove(TOAST_KEY.ARCHIVE_CONTACT_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.UNARCHIVE_CONTACT_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.BULK_ARCHIVE_CONTACT_SUCCESS_TOAST));
  dispatch(remove(TOAST_KEY.BULK_UNARCHIVE_CONTACT_SUCCESS_TOAST));
  dispatch(remove(DOCUMENT_SPLITTER_TOAST_KEY.SPLIT_DOCUMENT_SUCCESS_TOAST));
  dispatch(remove(DOCUMENT_SPLITTER_TOAST_KEY.SPLIT_DOCUMENT_ERROR_TOAST));
};

export const generateRouteUrl = ({
  selectedMenuItem,
  id = '',
}: {
  selectedMenuItem: MenuItemKey,
  id?: number,
}) => {
  if (!selectedMenuItem) {
    return '';
  }
  if (id) {
    return `/efile/${selectedMenuItem}/${id}`;
  }
  return `/efile/${selectedMenuItem}`;
};

export const getRowActions = ({
  row,
  selectedMenuItem,
  onToggleViewed,
  onToggleArchived,
  onUpdateContact,
  onToggleContactsArchived,
}: {
  row: ElectronicFile & ExistingContact,
  selectedMenuItem: MenuItemKey,
  onToggleViewed: () => void,
  onToggleArchived: () => void,
  onUpdateContact: (contact: ExistingContact) => void,
  onToggleContactsArchived: () => void,
}) => {
  const rowActions = [
    {
      id: ACTION_KEY.TOGGLE_VIEWED,
      label: row.viewed ? i18n.t('Mark as unread') : i18n.t('Mark as read'),
      icon: row.viewed
        ? KITMAN_ICON_NAMES.DraftsOutlined
        : KITMAN_ICON_NAMES.MarkEmailUnreadOutlined,
      onClick: onToggleViewed,
      hidden:
        row.archived ||
        ![MENU_ITEM.inbox, MENU_ITEM.sent].includes(selectedMenuItem),
    },
    {
      id: ACTION_KEY.TOGGLE_ARCHIVED,
      label: row.archived ? i18n.t('Unarchive') : i18n.t('Archive'),
      icon: row.archived
        ? KITMAN_ICON_NAMES.UnarchiveOutlined
        : KITMAN_ICON_NAMES.ArchiveOutlined,
      onClick: onToggleArchived,
      hidden: ![MENU_ITEM.inbox, MENU_ITEM.sent].includes(selectedMenuItem),
    },
    {
      id: ACTION_KEY.UPDATE_CONTACT,
      label: i18n.t('Edit'),
      icon: KITMAN_ICON_NAMES.EditOutlined,
      onClick: () => onUpdateContact(row),
      hidden: selectedMenuItem !== MENU_ITEM.contacts || row.archived,
    },
    {
      id: ACTION_KEY.TOGGLE_CONTACTS_ARCHIVED,
      label: row.archived ? i18n.t('Unarchive') : i18n.t('Archive'),
      icon: row.archived
        ? KITMAN_ICON_NAMES.UnarchiveOutlined
        : KITMAN_ICON_NAMES.ArchiveOutlined,
      onClick: onToggleContactsArchived,
      hidden: selectedMenuItem !== MENU_ITEM.contacts,
    },
  ];

  return rowActions;
};

export const getHasEndpointLoaded = (queries: Object) => {
  const endpoints = [
    'searchInboundElectronicFileList',
    'searchOutboundElectronicFileList',
    'searchContactList',
  ];

  return endpoints.reduce(
    (accumulator, endpointName) => {
      const hasEndpointLoaded = Object.values(queries).some((query) => {
        if (!query || !query.endpointName || !query.status) {
          return false;
        }
        return (
          query.endpointName === endpointName && query.status === 'fulfilled'
        );
      });
      return { ...accumulator, [`${endpointName}`]: hasEndpointLoaded };
    },
    {
      searchInboundElectronicFileList: false,
      searchOutboundElectronicFileList: false,
      searchContactList: false,
    }
  );
};
