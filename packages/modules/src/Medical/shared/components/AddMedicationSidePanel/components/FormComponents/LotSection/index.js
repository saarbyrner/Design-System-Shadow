// @flow
import { useState, useEffect, Fragment } from 'react';
import { InputTextField, Select, TextButton } from '@kitman/components';
import classNames from 'classnames';
import { getDrugLots } from '@kitman/services';
import moment from 'moment';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './styles';
import {
  lotDispensedExceedsLotQuantity,
  isNumberInvalid,
} from '../../InputError/utils';
import InputError from '../../InputError/index';
import type { FetchedLot, FormState } from '../../../hooks/useMedicationForm';

type Props = {
  actionType: 'Dispense' | 'Log',
  isValidationCheckAllowed: boolean,
  formState: FormState,
  dispatch: Function,
  setRequestStatus: Function,
  isEditing: boolean,
  lots: Array<FetchedLot>,
  setLots: Function,
};

const LotSection = (props: I18nProps<Props>) => {
  const [multipleLots, setMultipleLots] = useState<boolean>(false);
  const {
    formState,
    dispatch,
    lots,
    actionType,
    isEditing,
    isValidationCheckAllowed,
    setRequestStatus,
    setLots,
  } = props;

  useEffect(() => {
    if (formState.stock_lots.length > 1) {
      setMultipleLots(true);
    } else {
      setMultipleLots(false);
    }
  }, [formState.stock_lots]);

  useEffect(() => {
    // get lots when medication changes
    getDrugLots({
      stock_drug_id: formState.medication?.stockId,
      available_only: true,
    })
      .then((lotsResponse) => {
        const reformattedLotsResponse = lotsResponse.stock_lots?.map(
          (value) => ({
            ...value,
            value: value.id,
            // formatting lot to look like this: 234224 (exp. Nov 25, 2025) - Qty. 500
            label: `${value.lot_number} (exp. ${moment(
              value.expiration_date
            ).format('MMM DD, YYYY')}) - Qty. ${value.quantity}`,
          })
        );
        if (reformattedLotsResponse) {
          setLots(reformattedLotsResponse);
          // if there's only one lot, autopopulate the field
          if (!props.isEditing) {
            if (reformattedLotsResponse?.length === 1) {
              dispatch({
                type: 'SET_STOCK_LOTS',
                stock_lots: [
                  {
                    id: reformattedLotsResponse[0].id,
                    dispensed_quantity: null,
                  },
                ],
              });
            } else {
              dispatch({
                type: 'SET_STOCK_LOTS',
                stock_lots: [
                  {
                    id: null,
                    dispensed_quantity: null,
                  },
                ],
              });
            }
          }
        }
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  }, [formState.medication]);

  const getOptions = (currentRowIdSelection) => {
    const allSelectedOptions = formState.stock_lots;

    const selectedOptionsFromOtherRows = allSelectedOptions
      .map((option) => option.id)
      .filter((id) => id !== currentRowIdSelection);

    const newOptions = lots.filter((originalLot) => {
      return !selectedOptionsFromOtherRows.includes(originalLot.id);
    });

    return newOptions;
  };

  const findLotById = (id) => lots?.find((lot) => lot.id === id);

  if (actionType === 'Log') {
    return (
      <>
        <div css={style.lot} data-testid="AddMedicationSidePanel|OptionalLot">
          <InputTextField
            value={formState.optional_lot_number || ''}
            onChange={(e) => {
              dispatch({
                type: 'SET_OPTIONAL_LOT_NUMBER',
                optional_lot_number: e.target.value,
              });
            }}
            label={props.t('Lot')}
            kitmanDesignSystem
            optional
          />
        </div>
        <div
          css={style.optionalQuantity}
          data-testid="AddMedicationSidePanel|OptionalLotQuantity"
        >
          <InputTextField
            value={formState.quantity || ''}
            onChange={(e) => {
              dispatch({
                type: 'SET_QUANTITY',
                quantity: e.target.value,
              });
            }}
            label={props.t('Amount dispensed')}
            type="number"
            kitmanDesignSystem
            optional
            invalid={
              formState.quantity !== null &&
              formState.quantity !== '' &&
              isNumberInvalid(formState.quantity, isValidationCheckAllowed)
            }
          />
          <InputError
            {...props}
            formItem={formState.quantity || ''}
            isValidationCheckAllowed={isValidationCheckAllowed}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {formState.stock_lots?.map((lot, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={`lot_${index}`}>
            <div css={style.lot} data-testid="AddMedicationSidePanel|Lot">
              <Select
                label={props.t('Lot')}
                onChange={(lotId) => {
                  const selectedLot = findLotById(lotId);
                  if (selectedLot) {
                    dispatch({
                      type: 'SET_STOCK_LOTS',
                      stock_lots: formState.stock_lots.map((lotItem, i) =>
                        index === i
                          ? {
                              id: selectedLot.id,
                              dispensed_quantity: null,
                            }
                          : lotItem
                      ),
                    });
                  }
                }}
                value={lot.id}
                options={getOptions(lot.id)}
                invalid={
                  isValidationCheckAllowed && !formState.stock_lots[index].id
                }
                isDisabled={!formState.medication.value || isEditing}
              />
            </div>
            <div
              css={style.lotQuantity}
              data-testid="AddMedicationSidePanel|LotQuantity"
            >
              <span
                className={classNames('kitmanReactSelect__label', {
                  'kitmanReactSelect__label--disabled':
                    !formState.medication.value || isEditing,
                })}
              >
                {props.t('Amount dispensed')}
              </span>
              <InputTextField
                value={
                  (formState.stock_lots[index].dispensed_quantity &&
                    formState.stock_lots[
                      index
                    ].dispensed_quantity.toString()) ||
                  ''
                }
                onChange={(e) => {
                  dispatch({
                    type: 'SET_STOCK_LOTS_AND_QUANTITY',
                    stock_lots: formState.stock_lots.map((formstateLot, i) =>
                      index === i
                        ? {
                            id: formstateLot.id,
                            dispensed_quantity: e.target.value,
                          }
                        : formstateLot
                    ),
                  });
                }}
                inputType="number"
                kitmanDesignSystem
                disabled={!formState.medication.value || isEditing}
                invalid={
                  isValidationCheckAllowed &&
                  !isEditing &&
                  (lotDispensedExceedsLotQuantity(
                    lot,
                    lots,
                    isValidationCheckAllowed
                  ) ||
                    isNumberInvalid(
                      formState.stock_lots[index].dispensed_quantity,
                      isValidationCheckAllowed
                    ))
                }
              />
              <InputError
                {...props}
                formItem={formState.stock_lots[index].dispensed_quantity || ''}
                isValidationCheckAllowed={isValidationCheckAllowed}
                lots={lots}
                lot={lot}
              />
            </div>
            {multipleLots ? (
              <div
                css={style.removeLotButton}
                data-testid="AddMedicationSidePanel|RemoveLotButton"
              >
                <TextButton
                  onClick={() => {
                    const allLots = formState.stock_lots;
                    allLots.splice(index, 1);
                    dispatch({
                      type: 'SET_STOCK_LOTS_AND_QUANTITY',
                      stock_lots: [...allLots],
                    });
                  }}
                  iconBefore="icon-bin"
                  type="subtle"
                  kitmanDesignSystem
                  isDisabled={isEditing}
                />
              </div>
            ) : null}
          </Fragment>
        );
      })}
      {lots.length !== formState.stock_lots.length ? (
        <div
          css={style.addLotButton}
          data-testid="AddMedicationSidePanel|AddLotButton"
        >
          <TextButton
            onClick={() => {
              dispatch({
                type: 'SET_STOCK_LOTS',
                stock_lots: [
                  ...formState.stock_lots,
                  { id: null, dispensed_quantity: null },
                ],
              });
            }}
            text={props.t('Add Lot')}
            type="secondary"
            kitmanDesignSystem
            isDisabled={!formState.medication?.value || isEditing}
          />
        </div>
      ) : null}
    </>
  );
};

export default LotSection;
