// @flow
import { withNamespaces } from 'react-i18next';
import type { SelectOption as Option } from '@kitman/components/src/types';
import EditUserProfile from '../containers/EditUserProfile';
import Toasts from '../containers/Toasts';
import ImageUploadModal from '../containers/ImageUploadModal';
import AppStatus from '../containers/AppStatus';

type Props = {
  languages: Array<Option>,
};

const App = (props: Props) => {
  return (
    <div className="manageUsersContainer">
      <div className="manageUsers">
        <EditUserProfile languages={props.languages} />
      </div>
      <ImageUploadModal />
      <Toasts />
      <AppStatus />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
