import { FormsTabTranslated as FormsTab } from '../components/FormsTab';
import { FormsTabUpdatedTranslated as FormsTabUpdated } from '../components/FormsTab/FormsTabUpdated';

const FormsTabContainer = (props) => {
  if (window.featureFlags['medical-forms-new-endpoints']) {
    return <FormsTabUpdated {...props} />;
  }
  return <FormsTab {...props} />;
};

export default FormsTabContainer;
