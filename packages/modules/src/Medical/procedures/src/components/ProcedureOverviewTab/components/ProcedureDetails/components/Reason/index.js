// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useProcedure } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';
import style from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/styles';

type Props = {};

const Reason = (props: I18nProps<Props>) => {
  const { procedure } = useProcedure();

  return (
    <div data-testid="ProcedureOverviewTab|Reason">
      <h2 css={style.sectionHeading}>{props.t('Reason')}</h2>
      {procedure?.procedure_reason?.name || procedure?.other_reason}
    </div>
  );
};

export const ReasonTranslated: ComponentType<Props> = withNamespaces()(Reason);
export default Reason;
