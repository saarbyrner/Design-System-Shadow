// @flow
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@kitman/common/src/utils/services';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import getCookie from '@kitman/common/src/utils/getCookie';
import type { PayloadAction } from '@reduxjs/toolkit';
import i18n from '@kitman/common/src/utils/i18n';
import type {
  EmergencyContactsState,
  EditEmergencyContactPayload,
  SetEmergencyContactsPayload,
  EmergencyContactState,
} from '../../types';
import {
  hideAppStatus,
  loadingEmergencyContacts,
  savingEmergencyContact,
  deletingEmergencyContact,
} from '../../actions';
import { convertServerErrorsToValidation } from '../../EmergencyContactValidationHelper';

export const REDUCER_KEY: string = 'emergencyContactsSlice';
const toastIds = {
  fetchError: 'ATHLETE_PROFILE_GET_CONTACTS_ERROR_TOAST',
  savedSuccess: 'ATHLETE_PROFILE_SAVED_CONTACT_TOAST',
  savedError: 'ATHLETE_PROFILE_SAVED_CONTACT_ERROR_TOAST',
  updateSuccess: 'ATHLETE_PROFILE_UPDATED_CONTACT_TOAST',
  updateError: 'ATHLETE_PROFILE_UPDATED_CONTACT_ERROR_TOAST',
  deletedSuccess: 'ATHLETE_PROFILE_DELETED_CONTACT_TOAST',
  deletedError: 'ATHLETE_PROFILE_DELETE_CONTACT_ERROR_TOAST',
};

export const initialState: EmergencyContactsState = {
  emergencyContacts: [],
  mode: 'VIEW',
  contactIdEditing: null,
};
const unprocessableEntity = 422;

export const getEmergencyContacts = createAsyncThunk(
  'emergencyContacts/getAthleteEmergencyContacts',
  async (athleteId: number, { rejectWithValue, dispatch }) => {
    try {
      dispatch(loadingEmergencyContacts());
      /**
       * TODO: We will be making this API url here dynamic - HI-702
       */
      const response = await axios.get(
        `/settings/athletes/${athleteId}/emergency_contacts/`,
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'X-KITMAN-CSRF-TOKEN': getCookie('KITMAN-CSRF-TOKEN'),
          },
        }
      );
      dispatch(hideAppStatus());
      return response.data;
    } catch (err) {
      dispatch(hideAppStatus());
      dispatch(
        add({
          id: toastIds.fetchError,
          status: 'ERROR',
          title: i18n.t('Failed to get contacts'),
        })
      );
      return rejectWithValue(err.response.data);
    }
  }
);

export const saveEmergencyContact = createAsyncThunk(
  'emergencyContacts/saveAthleteEmergencyContact',
  async (
    data: { athleteId: number, contact: EmergencyContactState },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(savingEmergencyContact());
      /**
       * TODO: We will be making this API url here dynamic - HI-702
       */
      const response = await axios.post(
        `/settings/athletes/${data.athleteId}/emergency_contacts/`,
        data.contact,
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'X-KITMAN-CSRF-TOKEN': getCookie('KITMAN-CSRF-TOKEN'),
          },
        }
      );
      dispatch(hideAppStatus());
      dispatch(
        add({
          id: toastIds.savedSuccess,
          status: 'SUCCESS',
          title: i18n.t('Contact added'),
        })
      );
      return response.data;
    } catch (err) {
      dispatch(hideAppStatus());
      dispatch(
        add({
          id: toastIds.savedError,
          status: 'ERROR',
          title: i18n.t('Error saving contact'),
        })
      );
      if (
        err.response?.status === unprocessableEntity &&
        err.response.data?.errors
      ) {
        return rejectWithValue(
          convertServerErrorsToValidation(err.response.data.errors)
        );
      }
      throw err;
    }
  }
);

export const updateEmergencyContact = createAsyncThunk(
  'emergencyContacts/updateAthleteEmergencyContact',
  async (
    data: { athleteId: number, contact: EmergencyContactState },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(savingEmergencyContact());
      /**
       * TODO: We will be making this API url here dynamic - HI-702
       */
      const response = await axios.patch(
        `/settings/athletes/${data.athleteId}/emergency_contacts/${
          data.contact.id || ''
        }`,
        data.contact,
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'X-KITMAN-CSRF-TOKEN': getCookie('KITMAN-CSRF-TOKEN'),
          },
        }
      );
      dispatch(hideAppStatus());
      dispatch(
        add({
          id: toastIds.updateSuccess,
          status: 'SUCCESS',
          title: i18n.t('Contact updated'),
        })
      );
      return response.data;
    } catch (err) {
      dispatch(hideAppStatus());
      dispatch(
        add({
          id: toastIds.updateError,
          status: 'ERROR',
          title: i18n.t('Contact failed to update'),
        })
      );
      if (
        err.response?.status === unprocessableEntity &&
        err.response.data?.errors
      ) {
        return rejectWithValue(
          convertServerErrorsToValidation(err.response.data.errors)
        );
      }
      throw err;
    }
  }
);

export const deleteEmergencyContact = createAsyncThunk(
  'emergencyContacts/deleteAthleteEmergencyContact',
  async (
    data: { athleteId: number, contactId: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(deletingEmergencyContact());
      /**
       * TODO: We will be making this API url here dynamic - HI-702
       */
      const response = await axios.delete(
        `/settings/athletes/${data.athleteId}/emergency_contacts/${data.contactId}`,
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            'X-KITMAN-CSRF-TOKEN': getCookie('KITMAN-CSRF-TOKEN'),
          },
        }
      );
      dispatch(
        add({
          id: toastIds.deletedSuccess,
          status: 'SUCCESS',
          title: i18n.t('Contact deleted'),
        })
      );
      dispatch(hideAppStatus());
      return response.data;
    } catch (err) {
      dispatch(hideAppStatus());
      dispatch(
        add({
          id: toastIds.deletedError,
          status: 'ERROR',
          title: i18n.t('Failed to delete emergency contact'),
        })
      );
      return rejectWithValue(err.response.data);
    }
  }
);

const emergencyContactsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    editEmergencyContact: (
      state: EmergencyContactsState,
      action: PayloadAction<EditEmergencyContactPayload>
    ) => {
      state.contactIdEditing = action.payload.id;
      state.mode = 'EDIT';
    },
    viewEmergencyContacts: (state: EmergencyContactsState) => {
      state.mode = 'VIEW';
      state.contactIdEditing = null;
    },
    setEmergencyContacts: (
      state: EmergencyContactsState,
      action: PayloadAction<SetEmergencyContactsPayload>
    ) => {
      state.emergencyContacts = action.payload.contacts ?? [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEmergencyContacts.fulfilled, (state, action) => {
      state.emergencyContacts = action.payload ?? [];
    });
    builder.addCase(saveEmergencyContact.fulfilled, (state, action) => {
      state.emergencyContacts = [...state.emergencyContacts, action.payload];
      state.mode = 'VIEW';
    });
    builder.addCase(updateEmergencyContact.fulfilled, (state, action) => {
      const contactId = action.payload.id;
      const index = state.emergencyContacts.findIndex(
        (contact) => contact.id === contactId
      );
      if (index !== -1) {
        state.emergencyContacts[index] = action.payload;
      }
      state.mode = 'VIEW';
    });
    builder.addCase(deleteEmergencyContact.fulfilled, (state, action) => {
      state.emergencyContacts = state.emergencyContacts.filter(
        (contact) => contact.id !== action.payload.id
      );
    });
  },
});

export const {
  editEmergencyContact,
  viewEmergencyContacts,
  setEmergencyContacts,
} = emergencyContactsSlice.actions;

export default emergencyContactsSlice;
