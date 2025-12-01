// @flow
import type { ComponentType } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { safeNumberString } from '@kitman/common/src/utils/safeNumberString';
import {
  DatePicker,
  InputTextField,
  TextButton,
  ToggleSwitch,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { saveMedicationEndDate } from '@kitman/services';
import { updateDiagnostic as updateDiagnosticService } from '@kitman/services/src/services/medical';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import {
  useDymoCheckService,
  useDymoFetchPrinters,
} from '@kitman/common/src/hooks';
import { printLabel } from '@kitman/common/src/utils/DymoLabelPrinting/dymoPrinterUtils';
import { openAddDiagnosticSidePanel } from '@kitman/modules/src/Medical/shared/redux/actions';
import useDiagnosticForm from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { ADD_DIAGNOSTIC_BUTTON } from '@kitman/modules/src/Medical/shared/constants/elementTags';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import printDiagnosticLabel from './utils/PrintDiagnosticLabel';
import style from './styles';

type Props = { hiddenFilters?: ?Array<string> };

const Header = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const { diagnostic, updateDiagnostic } = useDiagnostic();
  const { formState, dispatch: formDispatch } = useDiagnosticForm();
  const statusDymoService = useDymoCheckService({
    skip:
      !diagnostic.redox_order?.label_printing ||
      !diagnostic.redox_order?.external_identifier ||
      !diagnostic.redox_order?.client_id ||
      !diagnostic.redox_order?.truncated_name,
  });
  const { statusFetchPrinters, printers } =
    useDymoFetchPrinters(statusDymoService);

  // Specific to orders from Quest & DYMO label printers
  const shouldRenderLabelPrinter =
    statusDymoService === 'success' &&
    statusFetchPrinters === 'success' &&
    printers.length > 0 &&
    diagnostic.redox_order?.external_identifier &&
    diagnostic.redox_order?.label_printing;

  const isRedoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];

  // initialise formState on edit
  useEffect(() => {
    formDispatch({
      type: 'SET_ATHLETE_ID',
      athleteId: diagnostic.athlete.id || null,
    });
    formDispatch({
      type: 'SET_CPT_CODE',
      cptCode: diagnostic.cpt_code || '',
    });
    formDispatch({
      type: 'SET_IS_BILLABLE',
      isBillable: diagnostic.is_billable,
    });
    formDispatch({
      type: 'SET_AMOUNT_CHARGED',
      amountCharged: diagnostic.amount_charged || '',
    });
    formDispatch({
      type: 'SET_DISCOUNT_OR_REDUCTION',
      discountOrReduction: diagnostic.discount || '',
    });
    formDispatch({
      type: 'SET_AMOUNT_PAID_INSURANCE',
      amountPaidInsurance: diagnostic.amount_paid_insurance || '',
    });
    formDispatch({
      type: 'SET_AMOUNT_DUE',
      amountDue: diagnostic.amount_due || '',
    });
    formDispatch({
      type: 'SET_AMOUNT_PAID_ATHLETE',
      amountPaidAthlete: diagnostic.amount_paid_athlete || '',
    });
    formDispatch({
      type: 'SET_DATE_PAID_DATE',
      datePaidDate: diagnostic.date_paid || '',
    });
    formDispatch({
      type: 'SET_REFERRING_PHYSICIAN',
      referringPhysician: diagnostic.referring_physician || '',
    });
    formDispatch({
      type: 'SET_MULTI_BILLABLE_ITEMS',
      queuedBillableItems:
        formState?.queuedBillableItems?.length > 0
          ? formState?.queuedBillableItems?.map((billableItem, index) => ({
              id: billableItem.id,
              key: index,
              isDeleted: false,
              cptCode: billableItem.cptCode,
              isBillable: billableItem.isBillable,
              amountCharged: safeNumberString(billableItem.amountCharged),
              discountOrReduction: safeNumberString(
                billableItem.discountOrReduction
              ),
              amountPaidInsurance: safeNumberString(
                billableItem.amountPaidInsurance
              ),
              amountDue: safeNumberString(billableItem.amountDue),
              amountPaidAthlete: safeNumberString(
                billableItem.amountPaidAthlete
              ),
              datePaidDate: billableItem.datePaidDate,
            }))
          : diagnostic?.billable_items?.map((billableItem) => ({
              key: billableItem.id,
              id: billableItem.id,
              isDeleted: false,
              cptCode: billableItem.cpt_code,
              isBillable: billableItem.is_billable,
              amountCharged: safeNumberString(billableItem.amount_charged),
              discountOrReduction: safeNumberString(billableItem.discount),
              amountPaidInsurance: safeNumberString(
                billableItem.amount_paid_insurance
              ),
              amountDue: safeNumberString(billableItem.amount_due),
              amountPaidAthlete: safeNumberString(
                billableItem.amount_paid_athlete
              ),
              datePaidDate: billableItem.date_paid,
            })),
    });
  }, [isEditing]);

  const isStatusEditable =
    diagnostic.status?.text === 'Complete' ||
    diagnostic.status?.text === 'Incomplete' ||
    diagnostic.status?.text === 'Logged' ||
    diagnostic.status?.text === 'Abnormal' ||
    diagnostic.status?.text === 'No Reason' ||
    diagnostic.status?.text === 'Corrected' ||
    diagnostic.status?.text === 'Final' ||
    diagnostic.status?.text === 'Canceled';

  const isCovidType = !!(
    diagnostic?.medical_meta?.covid_antibody_result ||
    diagnostic?.medical_meta?.covid_test_date
  );
  const isMedicationType = !!diagnostic?.medical_meta?.start_date;
  const medicationCompleted = diagnostic?.medical_meta?.is_completed;

  const onSave = async (diagnosticFormState) => {
    setIsValidationCheckAllowed(true);
    const requiredFields = [
      window.featureFlags['diagnostics-multiple-cpt']
        ? formState.queuedBillableItems.every((billableItem) =>
            billableItem.cptCode.length > 0
              ? billableItem.cptCode.length === 5
              : true
          )
        : true,
    ];
    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    // If the validation fails, abort
    if (!allRequiredFieldsAreValid) {
      return;
    }
    const canSaveMedication =
      isMedicationType &&
      diagnostic?.medical_meta?.start_date &&
      formState.medicationCourseCompleted &&
      formState.medicationCourseCompletedAt &&
      !medicationCompleted;

    Promise.all([
      canSaveMedication &&
        saveMedicationEndDate(
          diagnostic.athlete.id,
          diagnostic.id,
          // $FlowFixMe start_date has to exist as it it checked in canSaveMedication
          diagnostic.medical_meta.start_date,
          diagnostic.diagnostic_date,
          diagnosticFormState
        ),

      window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] &&
        updateDiagnosticService(
          diagnostic.id,
          // $FlowFixMe will swap this out once a typesafe way is found to update redox and non-redox flows
          {
            athleteId: diagnosticFormState.athleteId,
            cptCode:
              diagnosticFormState.cptCode.length > 0
                ? diagnosticFormState.cptCode
                : // $FlowFixMe BE should accept null if missing
                  null,
            isBillable: diagnosticFormState.isBillable,
            amountCharged: diagnosticFormState.amountPaidInsurance,
            discountOrReduction: diagnosticFormState.discountOrReduction,
            amountPaidInsurance: diagnosticFormState.amountPaidInsurance,
            amountDue: diagnosticFormState.amountDue,
            amountPaidAthlete: diagnosticFormState.amountPaidAthlete,
            datePaidDate: diagnosticFormState.datePaidDate,
            queuedBillableItems: diagnosticFormState.queuedBillableItems,
            referringPhysician: diagnosticFormState.referringPhysician,
          }
        ),
    ])
      .then(([updatedMedicationDiagnostic, updateBillingDiagnostic]) => {
        formDispatch({ type: 'CLEAR_FORM' });
        const enrichedUpdatedDiagnostic = {
          ...diagnostic,
          medical_meta: updatedMedicationDiagnostic
            ? {
                ...updatedMedicationDiagnostic.diagnostic.medical_meta,
              }
            : diagnostic.medical_meta,
          cpt_code: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.cpt_code
            : diagnostic.cpt_code,
          is_billable: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.is_billable
            : diagnostic.is_billable,
          amount_charged: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.amount_charged
            : diagnostic.amount_charged,
          discount: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.discount
            : diagnostic.discount,
          amount_paid_insurance: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.amount_paid_insurance
            : diagnostic.amount_paid_insurance,
          amount_due: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.amount_due
            : diagnostic.amount_due,
          amount_paid_athlete: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.amount_paid_athlete
            : diagnostic.amount_paid_athlete,
          date_paid: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.date_paid
            : diagnostic.date_paid,
          billable_items: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.billable_items
            : diagnostic.billable_items,
          referring_physician: updateBillingDiagnostic
            ? updateBillingDiagnostic.diagnostic.referring_physician
            : diagnostic.referring_physician,
        };
        updateDiagnostic(enrichedUpdatedDiagnostic);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error({ err });
      });
  };

  const renderEditButton = () => {
    if (props.hiddenFilters?.includes(ADD_DIAGNOSTIC_BUTTON)) {
      return null;
    }
    if (!isEditing && permissions.medical.diagnostics.canCreate) {
      // Medication diagnostics can be edited while in progress
      if (
        isMedicationType &&
        !diagnostic.medical_meta.is_completed &&
        !medicationCompleted
      ) {
        return true;
      }
      // If multi-billing workflow is enabled, allow editing
      if (window.featureFlags['medical-diagnostics-iteration-3-billing-cpt']) {
        return true;
      }
      // Redox flow requires explicit flag and an editable status
      if (
        window.featureFlags['edit-diagnostic-redox'] &&
        isRedoxOrg &&
        isStatusEditable
      ) {
        return true;
      }
      // GA non-redox flow: only allow when status is editable (regardless of GA enhancement flag)
      if (!isRedoxOrg) {
        return isStatusEditable;
      }
    }
    return false;
  };

  const renderDiscardSaveButtons = () => {
    if (isEditing) {
      if (isMedicationType && !medicationCompleted) {
        return true;
      }

      if (window.featureFlags['medical-diagnostics-iteration-3-billing-cpt']) {
        return true;
      }
    }
    return false;
  };

  const clearMultiCPT = (originalDiagnostic) => {
    formDispatch({
      type: 'SET_REFERRING_PHYSICIAN',
      referringPhysician: '',
    });
    formDispatch({
      type: 'SET_MULTI_BILLABLE_ITEMS',
      queuedBillableItems: originalDiagnostic.billable_items?.map(
        (billableItem) => ({
          id: billableItem.id,
          key: (billableItem.id / originalDiagnostic.billable_items.length) * 4,
          isDeleted: false,
          cptCode: billableItem.cpt_code,
          isBillable: billableItem.is_billable,
          amountCharged: safeNumberString(billableItem.amount_charged),
          discountOrReduction: safeNumberString(billableItem.discount),
          amountPaidInsurance: safeNumberString(
            billableItem.amount_paid_insurance
          ),
          amountDue: safeNumberString(billableItem.amount_due),
          amountPaidAthlete: safeNumberString(billableItem.amount_paid_athlete),
          datePaidDate: billableItem.date_paid,
        })
      ),
    });
  };

  // Send job to first printer found in printers[], as per request from Product
  const runLabelPrintJob = async () => {
    if (
      diagnostic.redox_order?.client_id &&
      diagnostic.redox_order?.external_identifier &&
      diagnostic.redox_order?.truncated_name
    ) {
      try {
        const diagnosticToPrint = printDiagnosticLabel({
          clientNumber: diagnostic.redox_order.client_id,
          orderNumber: diagnostic.redox_order.external_identifier,
          athleteName: diagnostic.redox_order.truncated_name,
        });
        await printLabel(printers[0]?.name, diagnosticToPrint);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderLabelPrinter = () => {
    return (
      <TextButton
        text={props.t('Print Label')}
        type="primary"
        kitmanDesignSystem
        onClick={() => runLabelPrintJob()}
      />
    );
  };

  const renderActions = () => {
    return (
      <div data-testid="Diagnostic|Actions" css={style.actions}>
        {shouldRenderLabelPrinter && renderLabelPrinter()}

        {window.featureFlags['print-diagnostics'] && (
          <div data-testid="DiagnosticActions|PrintDiagnostic">
            <TextButton
              text={props.t('Print')}
              type="primary"
              kitmanDesignSystem
              onClick={() => {
                window.print();
              }}
            />
          </div>
        )}

        {renderEditButton() && (
          <TextButton
            data-testid="DiagnosticActions|Edit"
            text="Edit"
            type="secondary"
            onClick={() => {
              setIsValidationCheckAllowed(false);
              if (isRedoxOrg) {
                dispatch(
                  openAddDiagnosticSidePanel({
                    isAthleteSelectable: false,
                  })
                );
              }
              if (!isRedoxOrg) {
                if (!window.getFlag('pm-diagnostic-ga-enhancement')) {
                  setIsEditing(true);
                  return;
                }
                dispatch(
                  openAddDiagnosticSidePanel({
                    isAthleteSelectable: false,
                    diagnosticId: diagnostic.id,
                  })
                );
              }
            }}
            kitmanDesignSystem
          />
        )}
        {renderDiscardSaveButtons() && (
          <>
            <TextButton
              data-testid="DiagnosticActions|Discard"
              text={props.t('Discard changes')}
              type="subtle"
              onClick={() => {
                setIsValidationCheckAllowed(false);
                setIsEditing(false);
                clearMultiCPT(diagnostic);
              }}
              kitmanDesignSystem
            />
            <TextButton
              data-testid="DiagnosticActions|Save"
              text={props.t('Save')}
              type="primary"
              onClick={() => {
                onSave(formState);
              }}
              kitmanDesignSystem
            />
          </>
        )}
      </div>
    );
  };

  const renderMedicationEndDate = () => {
    if (!isEditing) {
      return true;
    }
    if (isEditing && medicationCompleted) {
      return true;
    }
    return false;
  };

  return (
    <header css={style.header}>
      <div css={style.main}>
        <h2 className="kitmanHeading--L2">{props.t('Diagnostic details')}</h2>
        {renderActions()}
      </div>
      {!isRedoxOrg && !window.featureFlags['diagnostics-multiple-cpt'] && (
        <ul css={style.detailsWithReferringPhysician}>
          <li>
            <span css={style.detailLabel}>{props.t('Diagnostic type: ')}</span>
            <span css={style.detailValue}>
              {props.t('{{diagnosticType}}', {
                diagnosticType: diagnostic?.type || '--',
                interpolation: { escapeValue: false },
              })}
            </span>
          </li>
          <li>
            <span css={style.detailLabel}>{props.t('Reason: ')}</span>
            <span css={style.detailValue}>
              {props.t('{{reason}}', {
                reason: diagnostic?.diagnostic_reason?.name || '--',
                interpolation: { escapeValue: false },
              })}{' '}
            </span>
          </li>
          {window.featureFlags['referring-physician-treatments-diagnostics'] &&
            !isEditing && (
              <li>
                <span css={style.detailLabel}>
                  {props.t('Referring Physician: ')}
                </span>
                <span css={style.detailValue}>
                  {props.t('{{referringPhysician}}', {
                    referringPhysician: diagnostic?.referring_physician || '--',
                    interpolation: { escapeValue: false },
                  })}{' '}
                </span>
              </li>
            )}
          {window.featureFlags['referring-physician-treatments-diagnostics'] &&
            isEditing && (
              <li>
                <span css={style.detailLabel}>
                  {props.t('Referring Physician: ')}
                </span>
                <div css={style.referringPhysicianInputField}>
                  <InputTextField
                    value={formState.referringPhysician}
                    onChange={(e) => {
                      formDispatch({
                        type: 'SET_REFERRING_PHYSICIAN',
                        referringPhysician: e.target.value,
                      });
                    }}
                    inputType="text"
                    optional
                    kitmanDesignSystem
                  />
                </div>
              </li>
            )}
        </ul>
      )}

      {window.featureFlags['diagnostics-multiple-cpt'] && (
        <div>
          <ul css={style.detailsAdditionalInfoMultiCPT}>
            <li>
              <span css={style.detailLabel}>
                {props.t('Diagnostic type: ')}
              </span>
              <span css={style.detailValue}>
                {props.t('{{diagnosticType}}', {
                  diagnosticType: diagnostic?.type || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Reason: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{reason}}', {
                  reason: diagnostic?.diagnostic_reason?.name || '--',
                  interpolation: { escapeValue: false },
                })}{' '}
              </span>
            </li>
            {window.featureFlags[
              'referring-physician-treatments-diagnostics'
            ] &&
              !isEditing && (
                <li>
                  <span css={style.detailLabel}>
                    {props.t('Referring Physician: ')}
                  </span>
                  <span css={style.detailValue}>
                    {props.t('{{referringPhysician}}', {
                      referringPhysician:
                        diagnostic?.referring_physician || '--',
                      interpolation: { escapeValue: false },
                    })}{' '}
                  </span>
                </li>
              )}
            {window.featureFlags[
              'referring-physician-treatments-diagnostics'
            ] &&
              isEditing && (
                <li>
                  <span css={style.detailLabel}>
                    {props.t('Referring Physician: ')}
                  </span>
                  <div css={style.referringPhysicianInputField}>
                    <InputTextField
                      value={formState.referringPhysician}
                      onChange={(e) => {
                        formDispatch({
                          type: 'SET_REFERRING_PHYSICIAN',
                          referringPhysician: e.target.value,
                        });
                      }}
                      inputType="text"
                      optional
                      kitmanDesignSystem
                    />
                  </div>
                </li>
              )}
          </ul>
          <ul css={style.detailsAdditionalInfoMultiCPT}>
            <li>
              <span css={style.detailLabel}>{props.t('Practitioner: ')}</span>
              {props.t('{{prescriber}}', {
                prescriber: diagnostic?.prescriber?.fullname || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Location: ')}</span>
              {props.t('{{location}}', {
                location: diagnostic?.location?.name || '--',
                interpolation: { escapeValue: false },
              })}
            </li>
            <li>
              <span css={style.detailLabel}>
                {props.t('Date of diagnostic: ')}
              </span>
              <span>
                {props.t('{{date}}', {
                  date: DateFormatter.formatStandard({
                    date: moment(diagnostic?.diagnostic_date) || '--',
                  }),
                })}{' '}
              </span>
            </li>
          </ul>
        </div>
      )}
      {isCovidType && (
        <div>
          <ul css={style.details}>
            <li>
              <span css={style.detailLabel}>{props.t('Test result: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{covidResult}}', {
                  covidResult:
                    diagnostic?.medical_meta?.covid_antibody_result ||
                    diagnostic?.medical_meta?.covid_test_result ||
                    '--',

                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>
                {props.t('Covid test date: ')}
              </span>
              <span css={style.detailValue}>
                {props.t('{{date}}', {
                  date: DateFormatter.formatStandard({
                    // eslint-disable-next-line no-nested-ternary
                    date: diagnostic?.medical_meta?.covid_antibody_test_date
                      ? moment(
                          diagnostic?.medical_meta?.covid_antibody_test_date
                        )
                      : diagnostic?.medical_meta?.covid_test_date
                      ? moment(diagnostic?.medical_meta?.covid_test_date)
                      : '--',
                  }),
                })}{' '}
              </span>
            </li>
          </ul>
          <ul css={style.details}>
            <li>
              <span css={style.detailLabel}>{props.t('Test type: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{covidTestType}}', {
                  covidTestType:
                    diagnostic?.medical_meta?.covid_antibody_test_type ||
                    diagnostic?.medical_meta?.covid_test_type ||
                    '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Reference: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{covidReference}}', {
                  covidReference:
                    diagnostic?.medical_meta?.covid_antibody_reference ||
                    diagnostic?.medical_meta?.covid_reference ||
                    '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
        </div>
      )}
      {isMedicationType && (
        <div>
          <ul css={style.details}>
            <li>
              <span css={style.detailLabel}>{props.t('Frequency: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{frequency}}', {
                  frequency: diagnostic?.medical_meta?.frequency || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Dosage: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{dosage}}', {
                  dosage: diagnostic?.medical_meta?.dosage || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
          <ul css={style.details}>
            <li>
              <span css={style.detailLabel}>{props.t('Type: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{medicationType}}', {
                  medicationType: diagnostic?.medical_meta?.type || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
            <li>
              <span css={style.detailLabel}>{props.t('Completed: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{isCompleted}}', {
                  isCompleted: diagnostic?.medical_meta?.is_completed,
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
          <ul css={style.details}>
            <li>
              <span css={style.detailLabel}>
                {props.t('Medication start date: ')}
              </span>
              <span css={style.detailValue}>
                {props.t('{{startDate}}', {
                  startDate: DateFormatter.formatStandard({
                    date: moment(diagnostic?.medical_meta?.start_date) || '--',
                  }),
                })}{' '}
              </span>
            </li>
            {renderMedicationEndDate() && (
              <li>
                <span css={style.detailLabel}>
                  {props.t('Medication end date: ')}
                </span>
                <span css={style.detailValue}>
                  {props.t('{{endDate}}', {
                    endDate: DateFormatter.formatStandard({
                      date: moment(diagnostic?.medical_meta?.end_date) || '--',
                    }),
                  })}{' '}
                </span>
              </li>
            )}
            {isEditing && !medicationCompleted && (
              <li css={style.editEndDate}>
                <span css={style.detailLabel}>
                  {props.t('Medication end date: ')}
                </span>
                <div css={style.detailValue}>
                  <DatePicker
                    onDateChange={(date) => {
                      formDispatch({
                        type: 'SET_MEDICATION_END_DATE',
                        medicationCourseCompletedAt: moment(date)
                          .endOf('day')
                          .format(dateTransferFormat),
                      });
                      formDispatch({
                        type: 'SET_MEDICATION_COURSE_COMPLETED',
                        medicationCourseCompleted: true,
                      });
                    }}
                    value={
                      formState.medicationCourseCompletedAt
                        ? moment(formState.medicationCourseCompletedAt)
                        : null
                    }
                    minDate={
                      diagnostic.medical_meta.start_date
                        ? moment(diagnostic.medical_meta.start_date)
                        : null
                    }
                    maxDate={moment()}
                    kitmanDesignSystem
                  />
                </div>
              </li>
            )}
          </ul>
          <ul css={[style.details, style.annotation]}>
            <li>
              <span css={style.detailLabel}>{props.t('Note: ')}</span>
              <span css={style.detailValue}>
                {props.t('{{medicationNote}}', {
                  medicationNote: diagnostic?.medical_meta?.notes || '--',
                  interpolation: { escapeValue: false },
                })}
              </span>
            </li>
          </ul>
        </div>
      )}
      {window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] &&
        !window.featureFlags['diagnostics-multiple-cpt'] &&
        !isRedoxOrg && (
          <div css={style.billingInfoContainer}>
            <h2 className="kitmanHeading--L3">{props.t('Billing info')}</h2>
            {!isEditing && (
              <>
                <ul css={[style.details, style.billing]}>
                  <li>
                    <span css={style.detailLabel}>{props.t('CPT code: ')}</span>
                    <span css={style.detailValue}>
                      {props.t('{{cptCode}}', {
                        cptCode: diagnostic?.cpt_code || '--',
                        interpolation: { escapeValue: false },
                      })}
                    </span>
                  </li>
                  <li>
                    <span css={style.detailLabel}>{props.t('Billable: ')}</span>
                    <span css={style.detailValue}>
                      {props.t('{{isBillable}}', {
                        isBillable: diagnostic?.is_billable ? 'Yes' : 'No',
                        interpolation: { escapeValue: false },
                      })}
                    </span>
                  </li>
                </ul>
                {diagnostic.is_billable &&
                  !window.featureFlags['diagnostics-billing-extra-fields'] && (
                    <>
                      <ul css={[style.details, style.billing]}>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount paid by insurance: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{amountPaidInsurance}}', {
                              amountPaidInsurance:
                                diagnostic?.amount_paid_insurance || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount paid by athlete: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{amountPaidAthlete}}', {
                              amountPaidAthlete:
                                diagnostic?.amount_paid_athlete || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                      </ul>
                    </>
                  )}
                {diagnostic.is_billable &&
                  window.featureFlags['diagnostics-billing-extra-fields'] && (
                    <>
                      <ul css={[style.details, style.billing]}>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount charged: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{amountCharged}}', {
                              amountCharged: diagnostic?.amount_charged || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Discount/ reduction: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{discountOrReduction}}', {
                              discountOrReduction: diagnostic?.discount || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount insurance paid: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{amountPaidInsurance}}', {
                              amountPaidInsurance:
                                diagnostic?.amount_paid_insurance || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                      </ul>
                      <ul css={[style.details, style.billing]}>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount due: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{amountDue}}', {
                              amountDue: diagnostic?.amount_due || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount athlete paid: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{amountPaidAthlete}}', {
                              amountPaidAthlete:
                                diagnostic?.amount_paid_athlete || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Date paid: ')}
                          </span>
                          <span css={style.detailValue}>
                            {props.t('{{datePaidDate}}', {
                              datePaidDate: diagnostic?.date_paid || '--',
                              interpolation: { escapeValue: false },
                            })}
                          </span>
                        </li>
                      </ul>
                    </>
                  )}
              </>
            )}
            {isEditing && (
              <>
                <ul css={[style.details, style.billing]}>
                  <li>
                    <span css={style.detailLabel}>{props.t('CPT code: ')}</span>
                    <div css={style.billingInputField}>
                      <InputTextField
                        value={formState.cptCode}
                        onChange={(e) => {
                          formDispatch({
                            type: 'SET_CPT_CODE',
                            cptCode: e.target.value,
                          });
                        }}
                        inputType="text"
                        invalid={
                          formState.cptCode.length > 0 &&
                          formState.cptCode.length !== 5
                        }
                        kitmanDesignSystem
                      />
                    </div>
                  </li>
                  <li>
                    <span css={style.detailLabel}>{props.t('Billable: ')}</span>
                    <div css={style.billableToggle}>
                      <ToggleSwitch
                        isSwitchedOn={formState.isBillable}
                        toggle={() => {
                          formDispatch({
                            type: 'SET_IS_BILLABLE',
                            isBillable: !formState.isBillable,
                          });
                        }}
                        kitmanDesignSystem
                      />
                    </div>
                  </li>
                </ul>
                {formState.isBillable &&
                  !window.featureFlags['diagnostics-billing-extra-fields'] && (
                    <>
                      <ul css={[style.details, style.billing]}>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount paid by insurance: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.amountPaidInsurance}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_AMOUNT_PAID_INSURANCE',
                                  amountPaidInsurance: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount paid by athlete: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.amountPaidAthlete}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_AMOUNT_PAID_ATHLETE',
                                  amountPaidAthlete: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                      </ul>
                    </>
                  )}
                {formState.isBillable &&
                  window.featureFlags['diagnostics-billing-extra-fields'] && (
                    <>
                      <ul css={[style.details, style.billing]}>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount charged: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.amountCharged}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_AMOUNT_CHARGED',
                                  amountCharged: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Discount/ reduction: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.discountOrReduction}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_DISCOUNT_OR_REDUCTION',
                                  discountOrReduction: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount insurance paid: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.amountPaidInsurance}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_AMOUNT_PAID_INSURANCE',
                                  amountPaidInsurance: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                      </ul>
                      <ul css={[style.details, style.billing]}>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount due: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.amountDue}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_AMOUNT_DUE',
                                  amountDue: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Amount athlete paid: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <InputTextField
                              value={formState.amountPaidAthlete}
                              onChange={(e) =>
                                formDispatch({
                                  type: 'SET_AMOUNT_PAID_ATHLETE',
                                  amountPaidAthlete: e.target.value,
                                })
                              }
                              inputType="number"
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                        <li>
                          <span css={style.detailLabel}>
                            {props.t('Date paid: ')}
                          </span>
                          <div css={style.billingInputField}>
                            <DatePicker
                              onDateChange={(date) => {
                                formDispatch({
                                  type: 'SET_DATE_PAID_DATE',
                                  datePaidDate: moment(date).format(
                                    DateFormatter.dateTransferFormat
                                  ),
                                });
                              }}
                              value={
                                formState.datePaidDate
                                  ? moment(formState.datePaidDate)
                                  : null
                              }
                              optional
                              kitmanDesignSystem
                            />
                          </div>
                        </li>
                      </ul>
                    </>
                  )}
              </>
            )}
          </div>
        )}
      {window.featureFlags['medical-diagnostics-iteration-3-billing-cpt'] &&
        window.featureFlags['diagnostics-multiple-cpt'] && (
          <div css={style.billingInfo}>
            <h2 className="kitmanHeading--L3">{props.t('Billing info')}</h2>
            {(isEditing
              ? formState.queuedBillableItems
              : (diagnostic?.billable_items || []).map((bi) => ({
                  // map API shape to form/view shape for non-editing
                  key: bi.id,
                  id: bi.id,
                  // BE usually filters deleted items; default to not deleted in view mapping
                  isDeleted: false,
                  cptCode: bi.cpt_code,
                  isBillable: bi.is_billable,
                  amountCharged: bi.amount_charged,
                  discountOrReduction: bi.discount,
                  amountPaidInsurance: bi.amount_paid_insurance,
                  amountDue: bi.amount_due,
                  amountPaidAthlete: bi.amount_paid_athlete,
                  datePaidDate: bi.date_paid,
                }))
            ).map((billableItem, index) => (
              <div key={billableItem.key}>
                {(isEditing
                  ? formState.queuedBillableItems[index]?.isDeleted === false
                  : billableItem.isDeleted === false) && (
                  <div css={style.billingInfoContainer}>
                    {!isEditing && (
                      <>
                        <ul css={[style.details, style.billing]}>
                          <li>
                            <span css={style.detailLabel}>
                              {props.t('CPT code: ')}
                            </span>
                            <span css={style.detailValue}>
                              {props.t('{{cptCode}}', {
                                cptCode: billableItem.cptCode || '--',
                                interpolation: { escapeValue: false },
                              })}
                            </span>
                          </li>
                          <li>
                            <span css={style.detailLabel}>
                              {props.t('Billable: ')}
                            </span>
                            <span css={style.detailValue}>
                              {props.t('{{isBillable}}', {
                                isBillable: billableItem.isBillable
                                  ? 'Yes'
                                  : 'No',
                                interpolation: { escapeValue: false },
                              })}
                            </span>
                          </li>
                        </ul>
                        {billableItem.isBillable &&
                          !window.featureFlags[
                            'diagnostics-billing-extra-fields'
                          ] && (
                            <>
                              <ul css={[style.details, style.billing]}>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount paid by insurance: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{amountPaidInsurance}}', {
                                      amountPaidInsurance:
                                        billableItem.amountPaidInsurance ||
                                        '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount paid by athlete: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{amountPaidAthlete}}', {
                                      amountPaidAthlete:
                                        billableItem.amountPaidAthlete || '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                              </ul>
                            </>
                          )}
                        {billableItem.isBillable &&
                          window.featureFlags[
                            'diagnostics-billing-extra-fields'
                          ] && (
                            <>
                              <ul css={[style.details, style.billing]}>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount charged: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{amountCharged}}', {
                                      amountCharged:
                                        `$${billableItem.amountCharged}` ||
                                        '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Discount/ reduction: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{discountOrReduction}}', {
                                      discountOrReduction:
                                        `$${billableItem.discountOrReduction}` ||
                                        '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount insurance paid: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{amountPaidInsurance}}', {
                                      amountPaidInsurance:
                                        `$${billableItem.amountPaidInsurance}` ||
                                        '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                              </ul>
                              <ul css={[style.details, style.billing]}>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount due: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{amountDue}}', {
                                      amountDue:
                                        `$${billableItem.amountDue}` || '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount athlete paid: ')}
                                  </span>
                                  <span css={style.detailValue}>
                                    {props.t('{{amountPaidAthlete}}', {
                                      amountPaidAthlete:
                                        `$${billableItem.amountPaidAthlete}` ||
                                        '--',
                                      interpolation: { escapeValue: false },
                                    })}
                                  </span>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Date paid: ')}
                                  </span>

                                  <span css={style.detailValue}>
                                    {props.t('{{datePaidDate}}', {
                                      datePaidDate:
                                        DateFormatter.formatStandard({
                                          date:
                                            moment(billableItem.datePaidDate) ||
                                            '--',
                                        }),
                                    })}
                                  </span>
                                </li>
                              </ul>
                            </>
                          )}
                      </>
                    )}
                    {isEditing && (
                      <>
                        <ul css={[style.details, style.billing]}>
                          <li>
                            <span css={style.detailLabel}>
                              {props.t('CPT code: ')}
                            </span>
                            <div css={style.billingInputField}>
                              <InputTextField
                                value={
                                  formState?.queuedBillableItems[index]
                                    ?.cptCode || ''
                                }
                                onChange={(e) => {
                                  formDispatch({
                                    type: 'SET_MULTI_CPT_CODE',
                                    cptCode: e.target.value,
                                    index,
                                  });
                                }}
                                inputType="text"
                                invalid={
                                  isValidationCheckAllowed &&
                                  formState.queuedBillableItems[index]?.cptCode
                                    .length > 0 &&
                                  formState.queuedBillableItems[index].cptCode
                                    .length !== 5
                                }
                                kitmanDesignSystem
                              />
                            </div>
                          </li>
                          <li>
                            <span css={style.detailLabel}>
                              {props.t('Billable: ')}
                            </span>
                            <div css={style.billableToggle}>
                              <ToggleSwitch
                                isSwitchedOn={
                                  formState.queuedBillableItems[index]
                                    ?.isBillable || false
                                }
                                toggle={() => {
                                  formDispatch({
                                    type: 'SET_MULTI_IS_BILLABLE',
                                    isBillable:
                                      !formState.queuedBillableItems[index]
                                        .isBillable,
                                    index,
                                  });
                                }}
                                kitmanDesignSystem
                              />
                            </div>
                          </li>

                          <div css={style.removeMultiCPT}>
                            <TextButton
                              data-testid="DiagnosticActions|RemoveCPT"
                              onClick={() =>
                                formDispatch({
                                  type: 'REMOVE_MULTI_CPT_ON_OVERVIEW',
                                  index,
                                })
                              }
                              iconBefore="icon-bin"
                              type="subtle"
                              kitmanDesignSystem
                            />
                          </div>
                        </ul>
                        {formState.queuedBillableItems[index]?.isBillable &&
                          !window.featureFlags[
                            'diagnostics-billing-extra-fields'
                          ] && (
                            <>
                              <ul css={[style.details, style.billing]}>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount paid by insurance: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .amountPaidInsurance
                                      }
                                      onChange={(e) =>
                                        formDispatch({
                                          type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
                                          amountPaidInsurance: e.target.value,
                                          index,
                                        })
                                      }
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount paid by athlete: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .amountPaidAthlete
                                      }
                                      onChange={(e) =>
                                        formDispatch({
                                          type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
                                          amountPaidAthlete: e.target.value,
                                          index,
                                        })
                                      }
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                              </ul>
                            </>
                          )}
                        {formState.queuedBillableItems[index]?.isBillable &&
                          window.featureFlags[
                            'diagnostics-billing-extra-fields'
                          ] && (
                            <>
                              <ul css={[style.details, style.billing]}>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount charged: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .amountCharged
                                      }
                                      onChange={(e) =>
                                        formDispatch({
                                          type: 'SET_MULTI_AMOUNT_CHARGED',
                                          amountCharged: e.target.value,
                                          index,
                                        })
                                      }
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Discount/ reduction: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .discountOrReduction
                                      }
                                      onChange={(e) =>
                                        formDispatch({
                                          type: 'SET_MULTI_DISCOUNT_OR_REDUCTION',
                                          discountOrReduction: e.target.value,
                                          index,
                                        })
                                      }
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount insurance paid: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .amountPaidInsurance
                                      }
                                      onChange={(e) =>
                                        formDispatch({
                                          type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
                                          amountPaidInsurance: e.target.value,
                                          index,
                                        })
                                      }
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                              </ul>
                              <ul css={[style.details, style.billing]}>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount due: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .amountDue
                                      }
                                      onChange={(e) =>
                                        formDispatch({
                                          type: 'SET_MULTI_AMOUNT_DUE',
                                          amountDue: e.target.value,
                                          index,
                                        })
                                      }
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Amount athlete paid: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <InputTextField
                                      value={
                                        formState.queuedBillableItems[index]
                                          .amountPaidAthlete
                                      }
                                      onChange={(e) => {
                                        formDispatch({
                                          type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
                                          amountPaidAthlete: e.target.value,
                                          index,
                                        });
                                      }}
                                      inputType="number"
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                                <li>
                                  <span css={style.detailLabel}>
                                    {props.t('Date paid: ')}
                                  </span>
                                  <div css={style.billingInputField}>
                                    <DatePicker
                                      onDateChange={(date) => {
                                        formDispatch({
                                          type: 'SET_MULTI_DATE_PAID_DATE',
                                          datePaidDate: moment(date).format(
                                            DateFormatter.dateTransferFormat
                                          ),
                                          index,
                                        });
                                      }}
                                      value={
                                        formState.queuedBillableItems[index]
                                          .datePaidDate
                                          ? moment(
                                              formState.queuedBillableItems[
                                                index
                                              ].datePaidDate
                                            )
                                          : null
                                      }
                                      optional
                                      kitmanDesignSystem
                                    />
                                  </div>
                                </li>
                              </ul>
                            </>
                          )}
                      </>
                    )}
                    <hr />
                  </div>
                )}
              </div>
            ))}
            {!isRedoxOrg &&
              !window.getFlag('pm-diagnostic-ga-enhancement') &&
              (isEditing || formState.queuedBillableItems.length <= 0) && (
                <div css={style.addAnother}>
                  <TextButton
                    data-testid="DiagnosticActions|AddAnother"
                    text={props.t('Add another')}
                    type="subtle"
                    onClick={() => {
                      setIsEditing(true);
                      formDispatch({
                        type: 'ADD_ANOTHER_BILLABLE_ITEM',
                      });
                    }}
                    kitmanDesignSystem
                  />
                </div>
              )}
          </div>
        )}
      {!isEditing && window.featureFlags['diagnostics-multiple-cpt'] && (
        <div
          css={[style.metadataSection, style.authorDetails]}
          data-testid="AdditionalInfo|AuthorDetails"
        >
          {props.t('Created {{date}} by {{author}}', {
            date: DateFormatter.formatStandard({
              date: moment(diagnostic?.created_date) || '--',
            }),
            author: diagnostic?.created_by?.fullname || '--',
            interpolation: { escapeValue: false },
          })}
        </div>
      )}
    </header>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
