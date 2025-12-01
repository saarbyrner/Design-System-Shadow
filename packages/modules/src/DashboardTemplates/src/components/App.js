// @flow
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import Header from '../containers/Header';
import TemplateList from '../containers/TemplateList';
import AddTemplateModal from '../containers/AddTemplateModal';
import DuplicateTemplateModal from '../containers/DuplicateTemplateModal';
import RenameTemplateModal from '../containers/RenameTemplateModal';
import AppStatus from '../containers/AppStatus';
import DeleteTemplateModal from '../containers/DeleteTemplateModal';

const App = () => (
  <div
    css={css`
      background: ${colors.white};
    `}
  >
    <Header />
    <div className="dashboardTemplates__templateListContainer">
      <TemplateList />
    </div>
    <AddTemplateModal />
    <DuplicateTemplateModal />
    <RenameTemplateModal />
    <AppStatus />
    <DeleteTemplateModal />
  </div>
);

export default App;
