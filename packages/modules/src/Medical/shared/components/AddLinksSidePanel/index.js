// @flow

import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SlidingPanelResponsive,
  TextButton,
  ManageLinksInformation,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../AddDiagnosticLinkSidePanel/styles';
import type { IssueLink } from '../../../rosters/src/redux/types/actions';

type Props = {
  isOpen: boolean,
  onClose: () => void,
  panelTitle: string,
  addLink: (IssueLink[]) => void,
  removeLink: (IssueLink) => void,
  currentLinks: IssueLink[],
  resetLinks: () => void,
  onSave: () => void,
};

const AddLinksSidePanel = (props: I18nProps<Props>) => {
  const {
    t: translate,
    isOpen,
    onClose,
    panelTitle,
    addLink,
    removeLink,
    currentLinks,
    resetLinks,
    onSave,
  } = props;

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={isOpen}
        title={translate(panelTitle)}
        onClose={() => {
          resetLinks();
          onClose();
        }}
        width={659}
      >
        <div css={style.content}>
          <ManageLinksInformation
            visibleHeader={false}
            currentLinks={currentLinks}
            onAddLink={addLink}
            onRemoveLink={removeLink}
          />
        </div>
        <div css={style.actions}>
          <TextButton
            isDisabled={currentLinks.length === 0}
            onClick={onSave}
            testId="links-save-button"
            text={translate('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddLinksSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddLinksSidePanel);
export default AddLinksSidePanel;
