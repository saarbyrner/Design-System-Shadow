// @flow
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import Header from '../containers/Header';
import TemplateList, { FormList } from '../containers/TemplateList';
import AddTemplateModal from '../containers/AddTemplateModal';
import RenameTemplateModal from '../containers/RenameTemplateModal';
import DuplicateTemplateModal from '../containers/DuplicateTemplateModal';
import AppStatus from '../containers/AppStatus';
import ReminderSidePanel from '../containers/ReminderSidePanel';
import ActivateDialogue from '../containers/ActivateDialogue';
import DeleteDialogue from '../containers/DeleteDialogue';
import Filter from '../containers/FilterContainer';

type Props = {
  templates: Object,
};

const App = (props: Props) => {
  return (
    <>
      <div
        className={classnames('questionnaireTemplates', {
          'questionnaireTemplates--kitmanDesignSystem':
            window.featureFlags['update-manage-forms'],
        })}
      >
        <Header />
        <div className="questionnaireTemplates__templateListContainer row">
          <div
            className={classnames({
              'col-lg-12': !window.featureFlags['update-manage-forms'],
              'w-100': window.featureFlags['update-manage-forms'],
            })}
          >
            {window.featureFlags['update-manage-forms'] ? (
              <>
                <Filter />
                <FormList templates={props.templates} />
              </>
            ) : (
              <TemplateList templates={props.templates} />
            )}
          </div>
        </div>
        <AddTemplateModal />
        <RenameTemplateModal />
        <DuplicateTemplateModal />
        <ReminderSidePanel />
        <ActivateDialogue />
        <DeleteDialogue />
        <AppStatus />
      </div>
    </>
  );
};

export default App;
export const AppTranslated = withNamespaces()(App);
