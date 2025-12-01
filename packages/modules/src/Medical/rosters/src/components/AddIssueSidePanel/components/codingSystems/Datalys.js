// @flow
import { useState, useEffect } from 'react';
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
  SegmentedControl,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';

import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

import {
  searchCoding,
  getDatalysBodyAreas,
  getDatalysClassifications,
  getInjuryOnset,
} from '@kitman/services';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../AddIssueSidePanelStyle';
import useIssueFields from '../../../../../../shared/hooks/useIssueFields';
import { getCodingFieldOption } from '../../../../../../shared/utils';

import PathologyItem from './components/PathologyItem';

import type {
  IssueType,
  ExaminationDateProps,
  DatalysCodeProps,
  SupplementalPathologyProps,
  CodingSystemProps,
  OnsetProps,
  SideProps,
  BamicProps,
} from './types';

type Props = {
  examinationDateProps: ExaminationDateProps,
  datalysCodeProps: DatalysCodeProps,
  supplementalPathologyProps: SupplementalPathologyProps,
  codingSystemProps: CodingSystemProps,
  onsetProps: OnsetProps,
  sideProps: SideProps,
  bamicProps: BamicProps,
  invalidFields: Array<string>,
  issueType: IssueType,
  athleteId?: number | string,
  issueIsARecurrence: boolean,
  isBamic: boolean,
};

const Datalys = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();

  const { getFieldLabel, isFieldVisible } = useIssueFields({
    issueType: props.issueType,
    skip: false,
  });

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const [showSupplementalPathologyField, setShowSupplementalPathologyField] =
    useState(false);

  const [showEditClassificationSelect, setShowEditClassificationSelect] =
    useState(false);

  const [bodyAreas, setBodyAreas] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [showEditBodyAreaSelect, setShowEditBodyAreaSelect] = useState(false);
  const [onsets, setOnsets] = useState([]);

  useEffect(() => {
    Promise.all([
      getDatalysBodyAreas(),
      getDatalysClassifications(),
      getInjuryOnset(),
    ]).then(([bodyAreaData, classificationData, onsetData]) => {
      setBodyAreas(bodyAreaData);
      setClassifications(classificationData);
      setOnsets(onsetData);
    });
  }, [props.issueType]);

  const isInjury = props.issueType === 'injury';

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
          maxDate={props.examinationDateProps.maxPermittedExaminationDate}
          value={props.examinationDateProps.selectedExaminationDate}
          disableFutureDates
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderDatalysCodeSelect = () => {
    return (
      <div css={style.pathologySelect}>
        <AsyncSelect
          label={getFieldLabel('primary_pathology_id')}
          value={getCodingFieldOption(props.datalysCodeProps.selectedCoding)}
          placeholder={props.t('Search body part, body area, injury type...')}
          onChange={(coding) =>
            props.datalysCodeProps.onSelectCoding({
              [(organisation.coding_system_key: string)]: coding.value,
            })
          }
          loadOptions={(value, callback) =>
            searchCoding({
              filter: value,
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
          isDisabled={props.datalysCodeProps.isPathologyFieldDisabled}
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

  const renderClassificationItem = () => {
    return (
      <div css={style.codingItem}>
        {!showEditClassificationSelect && (
          <PathologyItem
            label={props.t('Classification: ')}
            value={
              classifications.find(
                (classification) =>
                  classification.id ===
                  props.codingSystemProps.selectedCoding[
                    codingSystemKeys.DATALYS
                  ]?.datalys_classification_id
              )?.name
            }
            withEdit={
              !props.issueIsARecurrence &&
              !!props.codingSystemProps.selectedCoding[codingSystemKeys.DATALYS]
                ?.datalys_body_area_id
            }
            onEdit={() => setShowEditClassificationSelect(true)}
          />
        )}
        {showEditClassificationSelect && (
          <>
            <Select
              appendToBody
              value={
                props.codingSystemProps.selectedCoding[codingSystemKeys.DATALYS]
                  ?.datalys_classification_id
              }
              invalid={props.invalidFields.includes('classification_selector')}
              label={props.t('Classification: ')}
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
            {!props.issueIsARecurrence && (
              <IconButton
                icon="icon-edit"
                isTransparent
                onClick={() => setShowEditBodyAreaSelect(true)}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const renderBodyAreaItem = () => {
    return (
      <div css={style.codingItem}>
        {!showEditBodyAreaSelect && (
          <>
            <PathologyItem
              label={props.t('Body area: ')}
              value={
                bodyAreas.find(
                  (bodyArea) =>
                    bodyArea.id ===
                    props.codingSystemProps.selectedCoding[
                      codingSystemKeys.DATALYS
                    ]?.datalys_body_area_id
                )?.name
              }
              withEdit={
                !props.issueIsARecurrence &&
                !!props.codingSystemProps.selectedCoding[
                  codingSystemKeys.DATALYS
                ]?.datalys_body_area_id
              }
              onEdit={() => setShowEditBodyAreaSelect(true)}
            />
          </>
        )}
        {showEditBodyAreaSelect && (
          <Select
            appendToBody
            value={
              props.codingSystemProps.selectedCoding[codingSystemKeys.DATALYS]
                ?.datalys_body_area_id
            }
            invalid={props.invalidFields.includes('body_area_selector')}
            label={props.t('Body area: ')}
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
    );
  };

  const renderTissueTypeItem = () => {
    return (
      <div css={style.codingItem}>
        <PathologyItem
          label={props.t('Tissue type: ')}
          value={
            props.codingSystemProps.selectedCoding[codingSystemKeys.DATALYS]
              ?.datalys_tissue_type
          }
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
        {renderClassificationItem()}
        {renderBodyAreaItem()}
        {renderTissueTypeItem()}
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
            : props.datalysCodeProps.isPathologyFieldDisabled
        }
      />
    </div>
  );

  const renderSideControl = () => {
    return (
      <div css={[style.sideSegmentedControl]}>
        <SegmentedControl
          buttons={props.sideProps.sides.map((side) => {
            return { name: side.name, value: side.id };
          })}
          invalid={props.invalidFields.includes('side_id')}
          isDisabled={props.datalysCodeProps.isPathologyFieldDisabled}
          label={getFieldLabel('side_id')}
          maxWidth={400}
          onClickButton={(buttonId) =>
            props.sideProps.onSelectSide(
              organisation.coding_system_key,
              buttonId
            )
          }
          selectedButton={props.sideProps.selectedSide}
        />
      </div>
    );
  };

  const renderBamicFields = () => {
    return (
      <div css={style.bamic}>
        <Select
          appendToBody
          optional
          label={props.t('Grade')}
          value={props.bamicProps.selectedBamicGrade}
          options={props.bamicProps.grades.map((grade) => ({
            value: grade.id,
            label: grade.name,
          }))}
          onChange={(value) => props.bamicProps.onSelectBamicGrade(value)}
        />
        <Select
          appendToBody
          optional
          label={props.t('Site')}
          value={props.bamicProps.selectedBamicSite}
          isDisabled={
            !props.bamicProps.selectedBamicGrade ||
            !props.bamicProps.bamicSiteOptions?.length
          }
          options={props.bamicProps.bamicSiteOptions?.sort(
            (a, b) => a.value - b.value
          )}
          onChange={(value) => props.bamicProps.onSelectBamicSite(value)}
        />
      </div>
    );
  };

  return (
    <div css={style.flexCol}>
      {window.featureFlags['examination-date'] &&
        !window.featureFlags['pm-editing-examination-and-date-of-injury'] && (
          <div css={[style.flexRow, style.borderBottom]}>
            {showPlayerMovementDatePicker() ? (
              <div css={style.datepickerWrapper}>{renderDatePickerNew()}</div>
            ) : (
              renderExaminationDateField()
            )}
          </div>
        )}

      <div css={[style.flexRow]}>
        {isFieldVisible('primary_pathology_id') && renderDatalysCodeSelect()}
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
          !!props.codingSystemProps.selectedCoding[codingSystemKeys.DATALYS]
            ?.id) &&
          isFieldVisible('side_id') &&
          renderSideControl()}
      </div>

      {/* TODO: Confirm a DATALYS coding system organisation can have BAMIC (British) fields */}
      {props.isBamic && <div css={[style.flexRow]}>{renderBamicFields()}</div>}
    </div>
  );
};

export const DatalysTranslated: ComponentType<Props> =
  withNamespaces()(Datalys);
export default Datalys;
