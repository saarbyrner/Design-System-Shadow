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
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';

import { searchCoding, getInjuryOnset } from '@kitman/services';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../AddIssueSidePanelStyle';
import useIssueFields from '../../../../../../shared/hooks/useIssueFields';
import { getCodingFieldOption } from '../../../../../../shared/utils';

import type {
  IssueType,
  ExaminationDateProps,
  SupplementalPathologyProps,
  ICDCodeProps,
  OnsetProps,
  BamicProps,
} from './types';
import styles from './styles';

type Props = {
  examinationDateProps: ExaminationDateProps,
  icdCodeProps: ICDCodeProps,
  supplementalPathologyProps: SupplementalPathologyProps,
  onsetProps: OnsetProps,
  bamicProps: BamicProps,
  invalidFields: Array<string>,
  issueType: IssueType,
  issueIsARecurrence: boolean,
  isBamic: boolean,
  athleteId?: number | string,
};

const ICD = (props: I18nProps<Props>) => {
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

  const [onsets, setOnsets] = useState([]);

  useEffect(() => {
    getInjuryOnset().then((onsetData) => {
      setOnsets(onsetData);
    });
  }, [props.issueType]);

  const isInjury = props.issueType === 'injury';

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

  const renderICDCodeSelect = () => {
    return (
      <div css={style.pathologySelect}>
        <AsyncSelect
          label={getFieldLabel('primary_pathology_id')}
          value={getCodingFieldOption(props.icdCodeProps.selectedCoding)}
          placeholder={props.t('Search body part, body area, injury type...')}
          onChange={(coding) =>
            props.icdCodeProps.onSelectCoding({
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
          isDisabled={props.icdCodeProps.isPathologyFieldDisabled}
          invalid={props.invalidFields.includes('primary_pathology_id')}
          appendToBody
        />
      </div>
    );
  };

  const renderICDCodeDetails = () => {
    const details = [
      {
        label: props.t('Body area'),
        value: props.icdCodeProps.selectedCoding.icd_10_cm?.body_area,
        for: 'body',
      },
      {
        label: props.t('Side'),
        value: props.icdCodeProps.selectedCoding.icd_10_cm?.side,
      },
      {
        label: props.t('Code'),
        value: props.icdCodeProps.selectedCoding.icd_10_cm?.code,
      },
    ];

    return (
      <>
        {details.map((detail) => {
          return (
            detail.value && (
              <div css={style.flexCell}>
                <label css={styles.textLabel}>{detail.label}</label>
                <span css={styles.textValue}>{detail.value}</span>
              </div>
            )
          );
        })}
      </>
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
            : props.icdCodeProps.isPathologyFieldDisabled
        }
      />
    </div>
  );

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
        {isFieldVisible('primary_pathology_id') && renderICDCodeSelect()}
        {window.featureFlags['custom-pathologies'] &&
          !showSupplementalPathologyField &&
          renderSupplementalPathologyfield()}
      </div>
      {Object.keys(props.icdCodeProps.selectedCoding).length > 0 && (
        <div css={[style.flexRow]}>{renderICDCodeDetails()}</div>
      )}

      {showSupplementalPathologyField && (
        <div css={[style.flexRow]}>{renderSupplementalPathologyInput()}</div>
      )}

      <div css={[style.flexRow]}>{renderOnsetSelection()}</div>

      {/* TODO: Confirm an ICD coding system organisation can have BAMIC (British) fields */}
      {props.isBamic && <div css={[style.flexRow]}>{renderBamicFields()}</div>}
    </div>
  );
};

export const ICDTranslated: ComponentType<Props> = withNamespaces()(ICD);
export default ICD;
