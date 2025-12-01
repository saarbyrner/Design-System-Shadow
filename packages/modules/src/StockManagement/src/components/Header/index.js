// @flow
import { TextButton } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useStockList } from '../../contexts/StockListContextProvider';

const styles = {
  titleContainer: css`
    align-items: baseline;
    display: flex;
    justify-content: space-between;

    h1 {
      color: ${colors.grey_300};
      font-size: 24px;
    }
  `,
  actionButtons: css`
    display: flex;
    gap: 8px;
  `,
};

type Props = {};

function Header(props: I18nProps<Props>) {
  const { data: permissions } = useGetPermissionsQuery();
  const { toggleAddStockSidePanel } = useStockList();

  return (
    <div css={styles.titleContainer}>
      <div>
        <h1>{props.t('Stock Management')}</h1>
      </div>

      <div css={styles.actionButtons}>
        {permissions.medical.stockManagement.canAdd &&
          window.featureFlags['stock-management'] && (
            <TextButton
              type="primary"
              text={props.t('Add Stock')}
              onClick={() => toggleAddStockSidePanel()}
              kitmanDesignSystem
            />
          )}
        <TextButton
          type="secondary"
          text={props.t('Print')}
          onClick={() => window.print()}
          kitmanDesignSystem
        />
      </div>
    </div>
  );
}

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
