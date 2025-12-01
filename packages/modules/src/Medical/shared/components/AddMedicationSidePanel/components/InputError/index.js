// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './styles';
import type { Lot, FetchedLot } from '../../hooks/useMedicationForm';
import {
  isNumberLessThanZero,
  isNumberNotAnInteger,
  lotDispensedExceedsLotQuantity,
} from './utils';

type Props = {
  formItem: ?number | string,
  isValidationCheckAllowed: boolean,
  lots?: Array<FetchedLot>,
  lot?: Lot,
  isEditing?: boolean,
};

const InputError = (props: I18nProps<Props>) => {
  const { isValidationCheckAllowed, formItem, lot, lots, isEditing } = props;

  if (!isValidationCheckAllowed || formItem === '') {
    return null;
  }

  return (
    <>
      {lots &&
      lot &&
      lotDispensedExceedsLotQuantity(lot, lots, isValidationCheckAllowed) &&
      !isEditing ? (
        <div
          css={style.errorMessage}
          data-testid="InputError|ExceededQuantityError"
        >
          {props.t('Exceeded quantity of lot')}
        </div>
      ) : null}
      {isNumberLessThanZero(formItem, isValidationCheckAllowed) ? (
        <div css={style.errorMessage} data-testid="InputError|ZeroError">
          {props.t('Value must be greater than 0')}
        </div>
      ) : null}
      {isNumberNotAnInteger(formItem, isValidationCheckAllowed) ? (
        <div css={style.errorMessage} data-testid="InputError|IntegerError">
          {props.t('Value must be an integer')}
        </div>
      ) : null}
    </>
  );
};

export default InputError;
