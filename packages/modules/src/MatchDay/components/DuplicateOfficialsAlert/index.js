// @flow
import { withNamespaces } from 'react-i18next';
import { Alert } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getHasDuplicateOfficials } from '@kitman/modules/src/MatchDay/shared/utils';

type Props = {
  officialsIds: Array<number>,
};

const DuplicateOfficialsAlert = ({ t, officialsIds }: I18nProps<Props>) => {
  const hasDuplicateOfficials = getHasDuplicateOfficials(officialsIds);
  if (!hasDuplicateOfficials) return null;

  return (
    <Alert severity="warning" sx={{ marginBottom: '24px' }}>
      {t("Officials can't be assigned to multiple roles")}
    </Alert>
  );
};

export default withNamespaces()(DuplicateOfficialsAlert);
