// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { InputTextField } from '@kitman/components';

type Props = {
  isDisabled: boolean,
  isEditing: boolean,
  initialAmount: string,
  onUpdateAmount: Function,
};

const AmountPaid = (props: Props) => {
  const [amount, setAmount] = useState(props.initialAmount || '');
  const [isInvalid, setIsInvalid] = useState(false);

  const isAmountValid = (amountToValidate) => {
    if (
      amountToValidate !== '' &&
      parseFloat(amountToValidate) !== 0 &&
      !Number(amountToValidate)
    ) {
      return false;
    }
    return true;
  };

  if (props.isEditing) {
    return (
      <InputTextField
        disabled={props.isDisabled}
        value={amount}
        onBlur={(e) => {
          if (isInvalid) {
            return;
          }
          if (e.target.value === '') {
            props.onUpdateAmount('0.0');
          } else {
            props.onUpdateAmount(e.target.value);
          }
        }}
        onChange={(e) => {
          const newAmount = e.target.value;
          setAmount(newAmount);

          if (!isAmountValid(amount)) {
            setIsInvalid(true);
          } else {
            setIsInvalid(false);
          }
        }}
        inputType="number"
        invalid={!isAmountValid(amount)}
        kitmanDesignSystem
      />
    );
  }

  return props.initialAmount;
};

export const AmountPaidTranslated: ComponentType<Props> =
  withNamespaces()(AmountPaid);
export default AmountPaid;
