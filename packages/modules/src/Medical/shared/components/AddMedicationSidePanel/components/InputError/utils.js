// @flow
import type { Lot, FetchedLot } from '../../hooks/useMedicationForm';

export const isNumberLessThanZero = (
  formItem: ?number | string | Lot,
  isValidationCheckAllowed: boolean
) =>
  isValidationCheckAllowed &&
  formItem !== '' &&
  formItem !== null &&
  Number(formItem) < 1;

export const isNumberNotAnInteger = (
  formItem: ?number | string,
  isValidationCheckAllowed: boolean
) => isValidationCheckAllowed && !Number.isInteger(Number(formItem));

export const lotDispensedExceedsLotQuantity = (
  lotRow: Lot,
  lots: Array<FetchedLot>,
  isValidationCheckAllowed: boolean
) => {
  const fetchedLot = lots?.find(
    (fetchedLotData) => fetchedLotData.id === lotRow?.id
  );
  return (
    isValidationCheckAllowed &&
    Number(lotRow?.dispensed_quantity) > Number(fetchedLot?.quantity)
  );
};

export const isNumberInvalid = (
  formItem: ?number | string,
  isValidationCheckAllowed: boolean
) => {
  return (
    isNumberLessThanZero(formItem, isValidationCheckAllowed) ||
    isNumberNotAnInteger(formItem, isValidationCheckAllowed) ||
    (isValidationCheckAllowed && (formItem === '' || formItem === null))
  );
};
