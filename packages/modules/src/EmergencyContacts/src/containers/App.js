// @flow
import { useSelector, useDispatch } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import {
  REDUCER_KEY,
  editEmergencyContact,
  viewEmergencyContacts,
  getEmergencyContacts,
  saveEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '@kitman/modules/src/EmergencyContacts/src/redux/reducers/emergencyContactsSlice';
import { AppTranslated as AppComponent } from '../components/App';
import { EmergencyContactSidePanelTranslated as EmergencyContactSidePanel } from '../components/EmergencyContactSidePanel';
import AppStatus from './AppStatus';
// NOTE: The Database may have imported data with more than 2 phone numbers. And the display and edit UI supports that.
// But when creating or editing a contact that only has 1 phone number, display entry fields for 2 as we think that is enough.
const MIN_EDITABLE_PHONE_NUMBERS = 2;

export default () => {
  const locationPathname = useLocationPathname();

  /**
   * TODO: Adjust logic here to correctly get the user id or athlete id from url. - HI-702
   */

  const athleteId = parseInt(locationPathname.split('/')[2], 10);

  const emergencyContacts = useSelector(
    (state) => state[REDUCER_KEY].emergencyContacts
  );
  const mode = useSelector((state) => state[REDUCER_KEY].mode);

  const contactIdEditing = useSelector(
    (state) => state[REDUCER_KEY].contactIdEditing
  );

  const emptyPhoneNumber = {
    country: '',
    number: '',
  };

  const emptyContact = {
    phone_numbers: Array.from({ length: MIN_EDITABLE_PHONE_NUMBERS }, () => ({
      ...emptyPhoneNumber,
    })),
  };

  let contactBeingEdited = emptyContact;
  if (contactIdEditing != null) {
    const foundContact = emergencyContacts.find(
      (contact) => contact.id === contactIdEditing
    );
    if (foundContact) {
      contactBeingEdited = _cloneDeep(foundContact);
      if (
        mode === 'EDIT' &&
        contactBeingEdited.phone_numbers.length < MIN_EDITABLE_PHONE_NUMBERS
      ) {
        contactBeingEdited.phone_numbers.push(
          ...Array.from(
            {
              length:
                MIN_EDITABLE_PHONE_NUMBERS -
                contactBeingEdited.phone_numbers.length,
            },
            () => ({
              ...emptyPhoneNumber,
            })
          )
        );
      }
    }
  }

  const dispatch = useDispatch();

  return (
    <>
      <AppComponent
        emergencyContacts={emergencyContacts}
        onGetEmergencyContacts={() => {
          return dispatch(getEmergencyContacts(athleteId));
        }}
        onEditEmergencyContact={(id: ?number) => {
          dispatch(editEmergencyContact({ id }));
        }}
        onRemoveEmergencyContact={(contactId: number) => {
          dispatch(deleteEmergencyContact({ athleteId, contactId }));
        }}
      />

      <EmergencyContactSidePanel
        isOpen={mode === 'EDIT'}
        contact={contactBeingEdited}
        onClose={() => {
          dispatch(viewEmergencyContacts());
        }}
        onSave={(contact) => {
          if (contact.id != null) {
            return dispatch(updateEmergencyContact({ athleteId, contact }));
          }
          return dispatch(saveEmergencyContact({ athleteId, contact }));
        }}
      />
      <AppStatus />
    </>
  );
};
