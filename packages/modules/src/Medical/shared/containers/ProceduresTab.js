import AmaConfirmationModal from '@kitman/modules/src/Medical/shared/components/AmaConfirmationModal';
import { ProceduresTabTranslated as ProceduresTab } from '../components/ProceduresTab';

const ProceduresTabContainer = (props) => {
  return (
    <>
      <ProceduresTab {...props} />
      <AmaConfirmationModal />
    </>
  );
};

export default ProceduresTabContainer;
