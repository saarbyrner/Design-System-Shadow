// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Select } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import getStyles from './styles';

type Props = {
  isEditing: boolean,
  billable: boolean,
  isDisabled: boolean,
  onUpdateBillable: Function,
};

const Billable = (props: I18nProps<Props>) => {
  const [isBillable, setIsBillable] = useState(props.billable);
  const style = getStyles();

  if (props.isEditing) {
    return (
      <div css={style.isBillableSelect}>
        <Select
          appendToBody
          isDisabled={props.isDisabled}
          options={[
            { label: props.t('Yes'), value: true },
            { label: props.t('No'), value: false },
          ]}
          onChange={(value) => {
            setIsBillable(value);
            props.onUpdateBillable(value);
          }}
          value={isBillable}
        />
      </div>
    );
  }

  return isBillable ? props.t('Yes') : props.t('No');
};

export const BillableTranslated: ComponentType<Props> =
  withNamespaces()(Billable);
export default Billable;
