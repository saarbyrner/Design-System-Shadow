// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { SelectOption as Option } from '@kitman/components/src/types';

export const handleNoteVisibilityAllowList = (
  note: MedicalNote,
  currentUser: ?CurrentUserData
): Array<Option> => {
  // If note is restricted to just the creator
  if (
    currentUser &&
    note.allow_list?.length === 1 &&
    note.allow_list.find((allowedUser) => allowedUser.id === currentUser?.id)
  ) {
    return [
      {
        value: currentUser.id,
        label: i18n.t('Only me'),
      },
    ];
  }

  // If note is restricted to both creator, and select users
  if (note.allow_list && note.allow_list?.length > 1) {
    return note?.allow_list
      ?.filter((item) => item.id !== currentUser?.id)
      .map((item) => {
        return {
          value: item.id,
          label: item.fullname,
        };
      });
  }

  // No restriction on note
  return [
    {
      value: null,
      label: i18n.t('All'),
    },
  ];
};

export const handleNoteVisibilityChange = (
  value: Array<Option>,
  currentUser: ?CurrentUserData
): Array<Option> => {
  if (
    value.length > 1 &&
    value.find((item) => item.value === currentUser?.id || item.value === null)
  ) {
    return value.filter(
      (item) => item.value !== currentUser?.id && item.value !== null
    );
  }

  return value;
};

/**
 * Three levels of Note visibility by userId
 * 1: Visible to all (default) [null] reqd by backend for specific handling
 * 2: Restricted to just the user creating the Note
 * 3: Visible to specific users (and creator by default); [] of user ids (note_visibility_ids) passed to allow_list in service
 */
export const transformNoteVisibilityOptions = (
  currentUser: ?CurrentUserData,
  staffList: Array<Option>
): Array<mixed> => {
  return [
    {
      value: null,
      label: i18n.t('All'),
    },
    {
      value: currentUser?.id,
      label: i18n.t('Only me'),
    },
    {
      label: i18n.t('Me and specific users'),
      options: staffList || [],
    },
  ];
};

export const isPermittedUserOwner = (
  permittedUserId: number,
  noteCreatedByUserId: number
): boolean => {
  return permittedUserId === noteCreatedByUserId;
};

export const isPermittedUserCurrentUser = (
  permittedUserId: number,
  currentUserId: ?number
): boolean => {
  return permittedUserId === currentUserId;
};

export default {
  handleNoteVisibilityAllowList,
  handleNoteVisibilityChange,
  transformNoteVisibilityOptions,
};
