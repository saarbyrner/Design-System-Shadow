// @flow

import { useRef, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import {
  AppStatus,
  InputNumeric,
  RichTextEditor,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import moment from 'moment';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { removeDrugStock } from '@kitman/services';
import {
  emptyHTMLeditorContent,
  getEditorStateFromValue,
} from '@kitman/modules/src/Medical/shared/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useStockList } from '../../contexts/StockListContextProvider';
import useStockManagementForm from '../../hooks/useStockManagementForm';
import style from './styles';
import InputError from '../../../../Medical/shared/components/AddMedicationSidePanel/components/InputError/index';
import { isNumberInvalid } from '../../../../Medical/shared/components/AddMedicationSidePanel/components/InputError/utils';

type Props = {
  onRemoveStock: Function,
};

const RemoveStockSidePanel = (props: I18nProps<Props>) => {
  const { toggleRemoveStockSidePanel, stockListState } = useStockList();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const { formState, dispatch } = useStockManagementForm();
  const editorRef = useRef(null);
  const [validationRequired, setValidationRequired] = useState(false);

  const {
    removeStockSidePanel: { isOpen },
    stockToRemove,
  } = stockListState;

  const stockQuantityExceeded = +stockToRemove?.quantity < +formState.quantity;
  const stockQuantityValid =
    !stockQuantityExceeded && !(+formState.quantity < 0);

  // Form columns outside of render
  const renderDetailsColumns = () => {
    return (
      <>
        <div>
          <span css={style.label}>{props.t('Item name / strength')}</span>
          <div css={style.detail}>{stockToRemove?.drug?.name}</div>
        </div>

        <div>
          <span css={style.label}>{props.t('Type')}</span>
          <div css={style.detail}>
            {stockToRemove?.drug?.dose_form_desc ||
              stockToRemove?.drug?.dose_form}
          </div>
        </div>

        <div>
          <span css={style.label}>{props.t('Exp. date')}</span>
          <div css={style.detail}>
            {moment(stockToRemove?.expiration_date).format('MMM D, YYYY')}
          </div>
        </div>

        <div>
          <span css={style.label}>{props.t('Lot no.')}</span>
          <div css={style.detail}>{stockToRemove?.lot_number}</div>
        </div>

        <div>
          <span css={style.label}>{props.t('On hand')}</span>
          <div css={style.detail}>{stockToRemove?.quantity}</div>
        </div>
      </>
    );
  };

  const onRemove = () => {
    // Perform validation, exit early if invalid
    setValidationRequired(true);

    const requiredFields = [formState.removalReason, stockQuantityValid];

    // Require note content if reason is marked as 'Other'
    if (formState.removalReason === 'other') {
      requiredFields.push(formState.noteContent);
    }

    const allFieldsAreValid = requiredFields.every((item) => item);

    if (!allFieldsAreValid || !stockToRemove) return;

    setValidationRequired(false);

    removeDrugStock(stockToRemove.id, formState)
      .then(() => {
        setRequestStatus('PENDING');
        editorRef.current?.update(getEditorStateFromValue(''));
        dispatch({ type: 'CLEAR_FORM' });
        toggleRemoveStockSidePanel(null);
        props?.onRemoveStock();
      })
      .catch(() => setRequestStatus('FAILURE'));
  };

  return (
    <SlidingPanelResponsive
      isOpen={isOpen}
      kitmanDesignSystem
      title={props.t('Remove Stock')}
      width={659}
      onClose={() => {
        toggleRemoveStockSidePanel(null);
        dispatch({ type: 'CLEAR_FORM' });
      }}
    >
      <div css={style.content}>
        <div data-testid="StockManagement|Parent">
          <div
            data-testid="StockManagement|Medicine"
            css={(style.gridRow1, style.stockDetails)}
          >
            {renderDetailsColumns()}
          </div>

          <hr css={style.gridRow2} />

          <div css={[style.gridRow3]}>
            <div data-testid="StockManagement|Reason" css={style.reason}>
              <Select
                label={props.t('Reason')}
                onChange={(reason) =>
                  dispatch({
                    type: 'SET_STOCK_REMOVAL_REASON',
                    removalReason: reason,
                  })
                }
                value={formState.removalReason}
                // These really need to be replaced with DB driven reasons when EP exists
                options={[
                  { label: props.t('Expired'), value: 'expired' },
                  { label: props.t('Misplaced'), value: 'misplaced' },
                  { label: props.t('Contaminated'), value: 'contaminated' },
                  { label: props.t('Other'), value: 'other' },
                ]}
                isDisabled={!stockToRemove}
                invalid={validationRequired && !formState.removalReason}
              />
            </div>

            <div data-testid="StockManagement|Quantity" css={style.quantity}>
              <InputNumeric
                label={props.t('Quantity')}
                name="quantity"
                onChange={(qt) =>
                  dispatch({
                    type: 'SET_QUANTITY',
                    quantity: +qt,
                  })
                }
                value={formState.quantity || ''}
                disabled={!stockToRemove}
                isInvalid={
                  isNumberInvalid(formState.quantity, validationRequired) ||
                  stockQuantityExceeded ||
                  !stockQuantityValid
                }
                kitmanDesignSystem
              />
              <InputError
                {...props}
                formItem={formState.quantity}
                isValidationCheckAllowed={validationRequired}
              />
              {stockQuantityExceeded && (
                <span css={style.errorMessage}>
                  {props.t('Exceeded quantity of lot')}
                </span>
              )}
            </div>

            <div
              data-testid="StockManagement|NoteContent"
              css={style.noteContent}
            >
              <RichTextEditor
                label={props.t('Note')}
                value={formState.noteContent}
                forwardedRef={editorRef}
                onChange={(noteContent) =>
                  dispatch({
                    type: 'SET_NOTE_CONTENT',
                    noteContent,
                  })
                }
                disabled={requestStatus === 'PENDING'}
                isInvalid={
                  validationRequired &&
                  formState.removalReason === 'other' &&
                  (!formState.noteContent ||
                    formState.noteContent === emptyHTMLeditorContent)
                }
                optionalText={
                  formState.removalReason !== 'other' ? 'Optional' : ''
                }
                kitmanDesignSystem
                t={props.t}
              />
            </div>
          </div>
        </div>
      </div>
      <div css={style.actions} data-testid="StockManagement|Actions">
        <TextButton
          text="Remove"
          onClick={onRemove}
          type="primary"
          kitmanDesignSystem
          isDisabled={!formState.removalReason || !formState.quantity}
        />
      </div>
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </SlidingPanelResponsive>
  );
};

export const RemoveStockSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(RemoveStockSidePanel);
export default RemoveStockSidePanel;
