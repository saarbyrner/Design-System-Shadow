// @flow
import { withNamespaces } from 'react-i18next';
import { EmergencyContactsTranslated as EmergencyContacts } from './EmergencyContacts';
import type { EmergencyContactState } from '../types';

type Props = {
  emergencyContacts: Array<EmergencyContactState>,
  onRemoveEmergencyContact: Function,
  onGetEmergencyContacts: Function,
  onEditEmergencyContact: Function,
};

const App = (props: Props) => {
  return (
    <EmergencyContacts
      contacts={props.emergencyContacts}
      onRemoveEmergencyContact={props.onRemoveEmergencyContact}
      onGetEmergencyContacts={props.onGetEmergencyContacts}
      onEditEmergencyContact={props.onEditEmergencyContact}
    />
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
