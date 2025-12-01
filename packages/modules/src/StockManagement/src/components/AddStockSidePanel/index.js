// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import {
  AppStatus,
  AsyncSelect,
  InputNumeric,
  DatePicker,
  InputTextField,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import { getDrugStocks, saveDrugStock } from '@kitman/services';
import { searchDrugs } from '@kitman/services/src/services/medical';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { MedicationSourceListName } from '@kitman/modules/src/Medical/shared/types/medical';
import { useStockList } from '../../contexts/StockListContextProvider';
import useStockManagementForm from '../../hooks/useStockManagementForm';
import style from './styles';
import InputError from '../../../../Medical/shared/components/AddMedicationSidePanel/components/InputError/index';
import { isNumberInvalid } from '../../../../Medical/shared/components/AddMedicationSidePanel/components/InputError/utils';

type Props = {
  medicationSourceListName?: MedicationSourceListName,
  onSaveStock: Function,
};

const AddStockSidePanel = (props: I18nProps<Props>) => {
  const { toggleAddStockSidePanel, stockListState } = useStockList();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const { formState, dispatch } = useStockManagementForm();

  const [validationRequired, setValidationRequired] = useState(false);

  const {
    addStockSidePanel: { isOpen },
  } = stockListState;

  const isGeneralAvailabilityOn =
    window.featureFlags['medications-general-availability'];

  const onSave = () => {
    // Perform validation, exit early if invalid
    setValidationRequired(true);

    const requiredFields = [
      formState.drug,
      formState.lotNumber,
      formState.expirationDate,
    ];

    const isQuantityValid = !isNumberInvalid(formState.quantity, true);

    const allFieldsAreValid = requiredFields.every((item) => item);

    if (!allFieldsAreValid || !isQuantityValid) return;

    setValidationRequired(false);

    /**
     * Send off saveDrugStock() request with details
     * Possibly introduce toasts in future
     *  */
    saveDrugStock(formState, formState.drug.drug_type || 'FdbDispensableDrug')
      .then(() => {
        dispatch({ type: 'CLEAR_FORM' });
        toggleAddStockSidePanel();
        props?.onSaveStock();
      })
      .catch(() => setRequestStatus('FAILURE'));
  };

  return (
    <SlidingPanelResponsive
      isOpen={isOpen}
      kitmanDesignSystem
      title={props.t('Add Stock')}
      width={659}
      onClose={() => {
        toggleAddStockSidePanel();
        dispatch({ type: 'CLEAR_FORM' });
      }}
    >
      <div css={style.content}>
        <div data-testid="StockManagement|Parent">
          <div data-testid="StockManagement|Medicine" css={style.gridRow1}>
            <AsyncSelect
              label={props.t('Brand name / drug')}
              value={formState.drug}
              placeholder="Search by brand name or dosage.."
              onChange={(drug) => {
                dispatch({ type: 'SET_DRUG', drug });
              }}
              loadOptions={(searchValue, callback) => {
                if (isGeneralAvailabilityOn && props.medicationSourceListName) {
                  searchDrugs(props.medicationSourceListName, searchValue).then(
                    (drugData) => {
                      // eslint-disable-next-line default-case
                      switch (drugData.drug_type) {
                        case 'Emr::Private::Models::FdbDispensableDrug':
                        case 'Emr::Private::Models::NhsDmdDrug': {
                          callback(
                            drugData.drugs.map((drug) => ({
                              id: drug.id,
                              label: drug.name,
                              value: drug.id,
                              drug_type: drugData.drug_type,
                            }))
                          );
                          break;
                        }
                      }
                    }
                  );
                } else {
                  getDrugStocks(searchValue).then((stock) => {
                    callback(
                      stock?.options?.map((drug) => ({
                        value: drug.id,
                        label: drug.name,
                        id: drug.id,
                        drug_type: 'FdbDispensableDrug',
                      }))
                    );
                  });
                }
              }}
              minimumLetters={5}
              appendToBody
              invalid={validationRequired && !formState.drug?.value}
            />
          </div>

          <hr css={style.gridRow2} />

          <div css={[style.gridRow3, style.stockDetails]}>
            <div data-testid="StockManagement|LotNumber">
              <InputTextField
                label={props.t('Lot number')}
                value={formState.lotNumber}
                onChange={(lot) =>
                  dispatch({
                    type: 'SET_LOT_NUMBER',
                    lotNumber: lot.target.value,
                  })
                }
                inputType="text"
                disabled={!formState.drug}
                invalid={validationRequired && !formState.lotNumber}
                kitmanDesignSystem
              />
            </div>

            <div data-testid="StockManagement|ExpirationDate">
              <DatePicker
                label={props.t('Exp. date')}
                name="expiration-date"
                onDateChange={(expDate) =>
                  dispatch({
                    type: 'SET_EXPIRATION_DATE',
                    expirationDate: expDate,
                  })
                }
                value={formState.expirationDate}
                disabled={!formState.drug}
                invalid={validationRequired && !formState.expirationDate}
                kitmanDesignSystem
              />
            </div>

            <div data-testid="StockManagement|Quantity">
              <InputNumeric
                label={props.t('Quantity')}
                name="quantity"
                onChange={(qt) =>
                  dispatch({
                    type: 'SET_QUANTITY',
                    quantity: qt,
                  })
                }
                value={formState.quantity || ''}
                disabled={!formState.drug}
                isInvalid={
                  isNumberInvalid(formState.quantity, validationRequired) ||
                  (validationRequired && formState.quantity === null)
                }
                kitmanDesignSystem
                onWheel={(e) => {
                  // Prevent the input value change
                  e.currentTarget.blur();

                  // Prevent the page/container scrolling
                  e.stopPropagation();
                }}
              />
              <InputError
                {...props}
                formItem={formState.quantity}
                isValidationCheckAllowed={validationRequired}
              />
            </div>
          </div>
        </div>
      </div>
      <div css={style.actions} data-testid="StockManagement|Actions">
        <TextButton
          text={props.t('Save')}
          onClick={onSave}
          type="primary"
          kitmanDesignSystem
        />
      </div>
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </SlidingPanelResponsive>
  );
};

export const AddStockSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddStockSidePanel);
export default AddStockSidePanel;
