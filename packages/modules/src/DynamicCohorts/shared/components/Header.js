// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import style from '../styles';

type Props = {
  pageTitle: string,
  buttonTitle: string,
  canCreate: boolean,
  onClickCreate: () => void,
};
const Header = ({
  pageTitle,
  buttonTitle,
  canCreate,
  onClickCreate,
}: I18nProps<Props>) => {
  return (
    <div css={style.header} data-testid="Header">
      <h3 className="kitmanHeading--L2">{pageTitle}</h3>
      {canCreate && (
        <TextButton
          text={buttonTitle}
          type="primary"
          onClick={onClickCreate}
          kitmanDesignSystem
        />
      )}
    </div>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
