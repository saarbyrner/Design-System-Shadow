// @flow
import { useState, useEffect, Fragment } from 'react';
import _get from 'lodash/get';
import _clone from 'lodash/clone';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  AsyncSelect,
  Select,
  SelectAndFreetext,
  InputText,
  IconButton,
  Textarea,
  TextButton,
  SegmentedControl,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import type { SelectOption } from '@kitman/components/src/AsyncSelect';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { SecondaryPathology } from '@kitman/common/src/types/Coding';

import {
  searchCoding,
  getClinicalImpressionsBodyAreas,
  getClinicalImpressionsClassifications,
  getInjuryOnset,
} from '@kitman/services';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../AddIssueSidePanelStyle';
import useIssueFields from '../../../../../../shared/hooks/useIssueFields';
import { getCodingFieldOption } from '../../../../../../shared/utils';

import PathologyItem from './components/PathologyItem';

import type {
  IssueType,
  ExaminationDateProps,
  CiCodeProps,
  SupplementalPathologyProps,
  CodingSystemProps,
  OnsetProps,
  OnsetDescriptionProps,
  SideProps,
  SecondaryPathologyProps,
} from './types';

type Props = {
  examinationDateProps: ExaminationDateProps,
  ciCodeProps: CiCodeProps,
  supplementalPathologyProps: SupplementalPathologyProps,
  codingSystemProps: CodingSystemProps,
  onsetProps: OnsetProps,
  onsetDescriptionProps: OnsetDescriptionProps,
  sideProps: SideProps,
  invalidFields: Array<string>,
  issueType: IssueType,
  issueIsARecurrence: boolean,
  isChronicIssue: boolean,
  athleteId?: number | string,
  secondaryPathologyProps: SecondaryPathologyProps,
};

const ClinicalImpressions = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();

  const [showSupplementalPathologyField, setShowSupplementalPathologyField] =
    useState(false);

  const [showSupplementalRecurrenceField, setShowSupplementalRecurrenceField] =
    useState(false);

  const [showEditClassificationSelect, setShowEditClassificationSelect] =
    useState(false);

  const [bodyAreas, setBodyAreas] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [showEditBodyAreaSelect, setShowEditBodyAreaSelect] = useState(false);
  const [onsets, setOnsets] = useState([]);

  const { getFieldLabel, isFieldVisible } = useIssueFields({
    issueType: props.issueType,
    skip: false,
  });

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  useEffect(() => {
    Promise.all([
      getClinicalImpressionsBodyAreas(),
      getClinicalImpressionsClassifications(),
      getInjuryOnset(),
    ]).then(([bodyAreaData, classificationData, onsetData]) => {
      setBodyAreas(bodyAreaData);
      setClassifications(classificationData);
      setOnsets(onsetData);
    });
  }, [props.issueType]);

  const isInjury = props.issueType === 'injury';

  const readSupplementalPathologyValue = (
    index: ?number,
    field: $Keys<SecondaryPathology>
  ) => {
    if (typeof index === 'undefined' || index === null) return null;

    return _get(
      props.secondaryPathologyProps.secondaryPathologies,
      `[${index}].${field}`,
      null
    );
  };

  const onChangeSupplementalPathologyValue = (
    index: number,
    field: $Keys<SecondaryPathology>,
    newValue: $Values<SecondaryPathology>
  ) => {
    const originalValue = _clone(
      props.secondaryPathologyProps.secondaryPathologies[index]
    );

    originalValue[field] = newValue;

    props.secondaryPathologyProps.onEditSecondaryPathology(
      { ...originalValue },
      index
    );
  };

  const renderDatePickerNew = () => {
    const selectedDate = props.examinationDateProps.selectedExaminationDate
      ? moment(props.examinationDateProps.selectedExaminationDate, 'YYYY-MM-DD')
      : null;
    const minDate = props.examinationDateProps.selectedDiagnosisDate;
    const maxDate = props.examinationDateProps.maxPermittedExaminationDate;

    return (
      <MovementAwareDatePicker
        athleteId={props.athleteId}
        value={selectedDate}
        onChange={(date) => {
          props.examinationDateProps.onSelectExaminationDate(
            moment(date).format('YYYY-MM-DD')
          );
        }}
        name="examinationDate"
        inputLabel={props.t('Date of examination')}
        minDate={minDate && moment(minDate)}
        maxDate={maxDate && moment(maxDate)}
        disableFuture
        kitmanDesignSystem
      />
    );
  };

  const renderExaminationDateField = () => {
    return (
      <div css={style.examinationDate}>
        <DatePicker
          label={props.t('Date of examination')}
          minDate={props.examinationDateProps.selectedDiagnosisDate}
          name="examinationDate"
          onDateChange={(date) => {
            props.examinationDateProps.onSelectExaminationDate(
              moment(date).format('YYYY-MM-DD')
            );
          }}
          value={props.examinationDateProps.selectedExaminationDate}
          maxDate={props.examinationDateProps.maxPermittedExaminationDate}
          disableFutureDates
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderCICodeSelect = ({
    value,
    onChange,
    label,
    disabled,
  }: {
    value: ?SelectOption,
    onChange: Function,
    label: string,
    disabled: boolean,
  }) => {
    return (
      <div css={style.pathologySelect}>
        <AsyncSelect
          label={label}
          value={value}
          placeholder={props.t('Search body part, body area, injury type...')}
          onChange={onChange}
          loadOptions={(searchValue, callback) =>
            searchCoding({
              filter: searchValue,
              codingSystem: organisation.coding_system_key,
            })
              .then((res) => {
                callback(
                  res.results.map((coding) =>
                    getCodingFieldOption({
                      [(organisation.coding_system_key: string)]: coding,
                    })
                  )
                );
              })
              .catch(() => {})
          }
          minimumLetters={3}
          isDisabled={disabled}
          invalid={props.invalidFields.includes('primary_pathology_id')}
          appendToBody
        />
      </div>
    );
  };

  const renderSupplementalPathologyfield = () => {
    return (
      <span
        className="addIssueSidePanel__supplementalPathologyLink"
        css={[
          style.supplementalPathologyLink,
          props.issueIsARecurrence
            ? style.supplementalPathologyLinkDisabled
            : null,
        ]}
        onClick={() => {
          if (props.issueIsARecurrence) {
            return;
          }
          setShowSupplementalPathologyField(true);
        }}
      >
        {props.t('Add supplemental pathology')}
      </span>
    );
  };

  const renderSupplementalPathologyInput = () => {
    return (
      <div
        className="addIssueSidePanel__supplementalPathologyRow"
        css={[style.supplementalPathologyRow]}
      >
        <InputText
          label={props.t('Supplemental pathology')}
          kitmanDesignSystem
          value={props.supplementalPathologyProps.enteredSupplementalPathology}
          onValidation={(input) =>
            props.supplementalPathologyProps.onEnterSupplementalPathology(
              input.value
            )
          }
        />
        <IconButton
          icon="icon-bin"
          isTransparent
          onClick={() => {
            props.supplementalPathologyProps.onRemoveSupplementalPathology();
            setShowSupplementalPathologyField(false);
          }}
        />
      </div>
    );
  };

  const renderCodingSystemDetails = () => {
    return (
      <div
        className="addIssueSidePanel__pathologyDescriptionItem"
        css={[
          style.codingSystemItems,
          props.issueIsARecurrence
            ? style.pathologyDescriptionRowDisabled
            : null,
        ]}
      >
        <div css={style.codingItem}>
          {!showEditClassificationSelect && (
            <PathologyItem
              label={props.t('Injury type: ')}
              value={
                classifications.find(
                  (classification) =>
                    classification.id ===
                    props.codingSystemProps.selectedCoding[
                      codingSystemKeys.CLINICAL_IMPRESSIONS
                    ]?.clinical_impression_classification_id
                )?.name
              }
            />
          )}
          {showEditClassificationSelect && (
            <Select
              appendToBody
              value={
                props.codingSystemProps.selectedCoding[
                  codingSystemKeys.CLINICAL_IMPRESSIONS
                ]?.clinical_impression_classification_id
              }
              invalid={props.invalidFields.includes('classification_selector')}
              label={props.t('Injury type: ')}
              options={classifications.map(({ id, name }) => {
                return { label: name, value: id };
              })}
              onChange={(value) => {
                props.codingSystemProps.onSelectClassification(
                  organisation.coding_system_key,
                  value
                );
                setShowEditClassificationSelect(false);
              }}
            />
          )}
        </div>
        <div css={style.codingItem}>
          {!showEditBodyAreaSelect && (
            <PathologyItem
              label={props.t('Body part: ')}
              value={
                bodyAreas.find(
                  (bodyArea) =>
                    bodyArea.id ===
                    props.codingSystemProps.selectedCoding[
                      codingSystemKeys.CLINICAL_IMPRESSIONS
                    ]?.clinical_impression_body_area_id
                )?.name
              }
            />
          )}
          {showEditBodyAreaSelect && (
            <Select
              appendToBody
              value={
                props.codingSystemProps.selectedCoding[
                  codingSystemKeys.CLINICAL_IMPRESSIONS
                ]?.clinical_impression_body_area_id
              }
              invalid={props.invalidFields.includes('body_area_selector')}
              label={props.t('Body part: ')}
              options={bodyAreas.map(({ id, name }) => {
                return { label: name, value: id };
              })}
              onChange={(value) => {
                props.codingSystemProps.onSelectBodyArea(
                  organisation.coding_system_key,
                  value
                );
                setShowEditBodyAreaSelect(false);
              }}
            />
          )}
        </div>
        <div css={style.codingItem}>
          <PathologyItem
            label={props.t('Code: ')}
            value={
              props.codingSystemProps.selectedCoding[
                codingSystemKeys.CLINICAL_IMPRESSIONS
              ]?.code
            }
          />
        </div>
      </div>
    );
  };

  const renderOnsetDescription = () => {
    return (
      <div css={style.flexCell}>
        <Textarea
          label={props.t('Description of Onset')}
          value={props.onsetDescriptionProps.selectedOnsetDescription}
          onChange={props.onsetDescriptionProps.onSelectOnsetDescription}
          optionalText={props.t('Optional')}
          disabled={
            window.featureFlags['pm-injury-edit-mode-of-onset'] &&
            props.issueType === 'injury'
              ? false
              : props.ciCodeProps.isPathologyFieldDisabled
          }
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderOnsetSelection = () => (
    <div css={[style.flexCol, style.emrInjuryType]}>
      <SelectAndFreetext
        selectLabel={getFieldLabel('issue_occurrence_onset_id')}
        selectedField={props.onsetProps.selectedOnset}
        onSelectedField={props.onsetProps.onSelectOnset}
        currentFreeText={props.onsetProps.onsetFreeText}
        onUpdateFreeText={props.onsetProps.onUpdateOnsetFreeText}
        invalidFields={
          isInjury
            ? props.invalidFields.includes('issue_occurrence_onset_id')
            : props.invalidFields.includes('illness_onset_id')
        }
        options={getSelectOptions(onsets)}
        featureFlag={window.featureFlags['nfl-injury-flow-fields']}
        disabled={
          window.featureFlags['pm-injury-edit-mode-of-onset'] &&
          props.issueType === 'injury'
            ? false
            : props.ciCodeProps.isPathologyFieldDisabled
        }
      />
    </div>
  );

  const renderSideControl = ({
    value,
    onChange,
  }: {
    value: ?string,
    onChange: Function,
  }) => {
    return (
      <div css={[style.sideSegmentedControl]}>
        <SegmentedControl
          buttons={props.sideProps.sides.map((side) => {
            return { name: side.name, value: side.id };
          })}
          invalid={props.invalidFields.includes('side_id')}
          isDisabled={props.ciCodeProps.isPathologyFieldDisabled}
          label={getFieldLabel('side_id')}
          maxWidth={400}
          selectedButton={value}
          onClickButton={onChange}
        />
      </div>
    );
  };

  const createSecondaryPathologyRecord = () => {
    const newSecondaryPathology = {
      id: null,
      record: null,
      side: null,
    };

    props.secondaryPathologyProps.onAddSecondaryPathology(
      newSecondaryPathology
    );
  };

  const removeSecondaryPathology = (index) => {
    props.secondaryPathologyProps.onRemoveSecondaryPathology(index);
  };

  const renderSupplementalRecurrence = () => {
    return (
      <>
        <div
          css={[
            style.flexRow,
            style.pathologyForm,
            showSupplementalRecurrenceField ? style.hiddenLink : null,
          ]}
        >
          <span
            className="addIssueSidePanel__supplementalPathologyLink"
            css={[style.supplementalPathologyLink]}
            onClick={() => setShowSupplementalRecurrenceField(true)}
          >
            {props.t('Add supplemental recurrence')}
          </span>
        </div>

        {showSupplementalRecurrenceField && (
          <div css={[style.flexRow]}>
            {isFieldVisible('primary_pathology_id') &&
              renderCICodeSelect({
                disabled: false,
                value: getCodingFieldOption(
                  props.ciCodeProps.selectedSupplementalCoding
                ),
                onChange: (coding) =>
                  props.ciCodeProps.onSelectSupplementalCoding({
                    [(organisation.coding_system_key: string)]: coding.value,
                  }),
                label: `${props.t('Supplemental CI Code')}`,
              })}
          </div>
        )}
      </>
    );
  };

  const renderPathologyForm = () => {
    return (
      <>
        <div css={[style.flexRow, style.pathologyForm]}>
          {isFieldVisible('primary_pathology_id') &&
            renderCICodeSelect({
              disabled: props.ciCodeProps.isPathologyFieldDisabled,
              value: getCodingFieldOption(props.ciCodeProps.selectedCoding),
              onChange: (coding) =>
                props.ciCodeProps.onSelectCoding({
                  [(organisation.coding_system_key: string)]: coding.value,
                }),
              label: `${props.t('Primary')} ${getFieldLabel(
                'primary_pathology_id'
              )}`,
            })}
          {window.featureFlags['custom-pathologies'] &&
            !showSupplementalPathologyField &&
            renderSupplementalPathologyfield()}
        </div>

        {showSupplementalPathologyField && (
          <div css={[style.flexRow]}>{renderSupplementalPathologyInput()}</div>
        )}
        <div css={[style.flexRow]}>{renderCodingSystemDetails()}</div>

        <div css={[style.flexRow]}>
          {renderOnsetSelection()}
          {(window.featureFlags['preliminary-injury-illness'] ||
            !!props.codingSystemProps.selectedCoding[
              codingSystemKeys.CLINICAL_IMPRESSIONS
            ]?.id) &&
            isFieldVisible('side_id') &&
            renderSideControl({
              value: props.sideProps.selectedSide,
              onChange: (buttonId) =>
                props.sideProps.onSelectSide(
                  organisation.coding_system_key,
                  buttonId
                ),
            })}
        </div>
        {window.featureFlags['supplemental-recurrence-code'] &&
          props.issueIsARecurrence && (
            <div css={[style.flexRow]}>{renderSupplementalRecurrence()}</div>
          )}
        {window.featureFlags['nfl-injury-flow-fields'] && (
          <div css={[style.flexRow]}>{renderOnsetDescription()}</div>
        )}
      </>
    );
  };

  const renderSecondaryPathologyForm = (index) => {
    const codingRecord: SelectOption = readSupplementalPathologyValue(
      index,
      'record'
    );

    return (
      <Fragment key={index}>
        <div css={[style.flexRow, style.borderTop, style.pathologyForm]}>
          {renderCICodeSelect({
            disabled: false,
            value: codingRecord,
            onChange: (coding) =>
              onChangeSupplementalPathologyValue(index, 'record', coding),
            label: `${props.t('Secondary')} ${getFieldLabel(
              'primary_pathology_id'
            )}`,
          })}
          <IconButton
            icon="icon-bin"
            isTransparent
            onClick={() => removeSecondaryPathology(index)}
          />
        </div>

        <div css={[style.flexRow]}>
          <div
            className="addIssueSidePanel__pathologyDescriptionItem"
            css={[style.codingSystemItems]}
          >
            <div css={style.codingItem}>
              <PathologyItem
                label={props.t('Classification: ')}
                value={
                  classifications.find(
                    (classification) =>
                      classification.id ===
                      codingRecord?.value?.clinical_impression_classification_id
                  )?.name
                }
              />
            </div>
            <div css={style.codingItem}>
              <PathologyItem
                label={props.t('Body area: ')}
                value={
                  bodyAreas.find(
                    (bodyArea) =>
                      bodyArea.id ===
                      codingRecord?.value?.clinical_impression_body_area_id
                  )?.name
                }
              />
            </div>
            <div css={style.codingItem}>
              <PathologyItem
                label={props.t('Code: ')}
                value={codingRecord?.value?.code}
              />
            </div>
          </div>
        </div>

        <div css={[style.flexRow]}>
          {isFieldVisible('side_id') && (
            <div css={[style.sideSegmentedControl]}>
              <SegmentedControl
                buttons={props.sideProps.sides.map((side) => {
                  return { name: side.name, value: side.id };
                })}
                invalid={props.invalidFields.includes('side_id')}
                isDisabled
                label={getFieldLabel('side_id')}
                maxWidth={400}
                selectedButton={props.sideProps.selectedSide}
                onClickButton={() => {}}
              />
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  const renderAddDiagnosticButton = () => {
    return (
      <TextButton
        isDisabled={false}
        text={props.t('Add diagnosis')}
        type="secondary"
        onClick={createSecondaryPathologyRecord}
        kitmanDesignSystem
      />
    );
  };

  return (
    <div css={style.flexCol}>
      {window.featureFlags['examination-date'] && (
        <div css={[style.flexRow, style.borderBottom]}>
          {showPlayerMovementDatePicker() ? (
            <div css={style.datepickerWrapper}>{renderDatePickerNew()}</div>
          ) : (
            renderExaminationDateField()
          )}
        </div>
      )}

      {renderPathologyForm()}

      {window.featureFlags['multi-part-injury-ci-code'] &&
        !props.isChronicIssue &&
        props.secondaryPathologyProps.secondaryPathologies &&
        props.secondaryPathologyProps.secondaryPathologies?.length > 0 &&
        props.secondaryPathologyProps.secondaryPathologies.map(
          (item, index) => {
            return renderSecondaryPathologyForm(index);
          }
        )}
      {window.featureFlags['multi-part-injury-ci-code'] &&
        !props.isChronicIssue && (
          <div css={[style.flexRow, style.borderTop]}>
            {renderAddDiagnosticButton()}
          </div>
        )}
    </div>
  );
};

export const ClinicalImpressionsTranslated: ComponentType<Props> =
  withNamespaces()(ClinicalImpressions);
export default ClinicalImpressions;
