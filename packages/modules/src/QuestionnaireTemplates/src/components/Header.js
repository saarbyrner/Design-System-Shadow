// @flow
import { withNamespaces } from 'react-i18next';
import { IconButton, PageHeader, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  addTemplate: () => void,
};

const Header = (props: I18nProps<Props>) => (
  <div className="questionnaireTemplates__header">
    {window.featureFlags['update-manage-forms'] ? (
      <>
        <h3 className="kitmanHeading--L1">{props.t('Manage Form')}</h3>
        <div className="questionnaireTemplates__headerBtn">
          <TextButton
            onClick={props.addTemplate}
            text={props.t('Add Form')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
      </>
    ) : (
      <PageHeader>
        <h3>{props.t('Manage Form')}</h3>
        <div className="questionnaireTemplates__headerBtn">
          <IconButton onClick={props.addTemplate} icon="icon-add" isSmall />
        </div>
      </PageHeader>
    )}
  </div>
);

export default Header;
export const HeaderTranslated = withNamespaces()(Header);
