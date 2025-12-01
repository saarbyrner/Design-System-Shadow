// @flow
import { useState, useMemo, Fragment } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  AsyncSelect,
  DatePicker,
  IconButton,
  InputTextField,
  SegmentedControl,
  Select,
  SelectAndFreetext,
  TextButton,
  Textarea,
} from '@kitman/components';
import { Box } from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import IssueExaminationDatePicker from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/codingSystems/components/IssueExaminationDatePicker';
import { OSIICS15Translated as OSIICS15 } from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/components/codingSystems/OSIICS15';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { IssueStatusTypes } from '@kitman/modules/src/Medical/shared/types';
import { searchCoding } from '@kitman/services';
import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type { Sides } from '@kitman/services/src/services/medical/getSides';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import _uniqueId from 'lodash/uniqueId';
import _cloneDeep from 'lodash/cloneDeep';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ConcussionAssessmentSectionTranslated as ConcussionAssessmentSection } from '@kitman/modules/src/Medical/rosters/src/components/AddIssueSidePanel/ConcussionAssessmentSection';
import {
  getCodingFieldOption,
  isV2MultiCodingSystem,
} from '@kitman/modules/src/Medical/shared/utils';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { OnsetOptions } from '@kitman/modules/src/Medical/issues/src/types';
import style from './styles/editView';
import type { Details } from '.';

type Props = {
  athleteId: number,
  occurrenceType: IssueStatusTypes,
  athleteData: AthleteData,
  pathologies: Pathologies,
  classifications: Classifications,
  bodyAreas: BodyAreas,
  sides: Sides,
  onsetOptions: OnsetOptions,
  occurrenceDate: string,
  details: Details,
  onSelectOsicsPathology: (pathologyId: number) => void,
  onSelectDetail: (
    detailType: string,
    detailValue: string | number | Object
  ) => void,
  showAssessmentReportSelector: boolean,
  onChangeShowAssessmentReportSelector: (show: boolean) => void,
  hasRecurrence: boolean,
  isValidationCheckAllowed: boolean,
  isRequestPending: boolean,
  bamicGrades: Array<Grade>,
  isContinuationIssue: boolean,
  isChronicIssue: boolean,
  issueType: string,
};

const getEditSelectOptions = (options) =>
  options.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

const EditView = (props: I18nProps<Props>) => {
  const { organisation } = useOrganisation();
  const hasDetailsCodingSystem = Object.keys(props.details.coding).length;
  const isV2CodingSystem = isV2MultiCodingSystem(
    organisation.coding_system_key
  );
  const isPathologyFieldDisabled =
    props.hasRecurrence || props.isRequestPending || props.isContinuationIssue;
  const shouldRenderCodingSystemDetails =
    hasDetailsCodingSystem && !isV2CodingSystem;

  const [isEditClassificationSelectShown, setIsEditClassificationSelectShown] =
    useState(false);
  const [isEditBodyAreaSelectShown, setIsEditBodyAreaSelectShown] =
    useState(false);
  const [isSupplementalPathologyShown, setIsSupplementalPathologyShown] =
    useState(false);
  const [newSecondaryPathologyFieldIds, setNewSecondaryPathologyFieldIds] =
    useState([]);

  // $FlowIgnore Return value will be a CodingSystemKey
  const issueCodingSystem: CodingSystemKey = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const codingKey of Object.values(codingSystemKeys)) {
      if (typeof codingKey === 'string' && props.details.coding[codingKey]) {
        return codingKey;
      }
    }

    return codingSystemKeys.OSICS_10;
  }, [props.details.coding]);

  const bamicSiteOptions = props.details?.bamic_grade_id
    ? props.bamicGrades
        .find((grade) => grade.id === props.details?.bamic_grade_id)
        ?.sites.map((site) => ({
          value: site.id,
          label: site.name,
        }))
    : [];

  const getSelectedSide = () => {
    if (!window.featureFlags['emr-multiple-coding-systems']) {
      return props.details.side;
    }

    if (props.details.coding[codingSystemKeys.OSICS_10]) {
      return props.details.coding[codingSystemKeys.OSICS_10].side_id;
    }

    if (props.details.coding[codingSystemKeys.DATALYS]) {
      return props.details.coding[codingSystemKeys.DATALYS].side_id;
    }

    if (props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
      return props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
        .side_id;
    }

    return null;
  };

  const isSideFieldInvalid = () => {
    if (
      !props.isValidationCheckAllowed ||
      props.details.coding[codingSystemKeys.DATALYS]
    ) {
      return false;
    }

    return window.featureFlags['emr-multiple-coding-systems']
      ? !props.details.coding[codingSystemKeys.OSICS_10]?.side_id &&
          !props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.side_id
      : !props.details.side;
  };

  const isClassificationFieldInvalid =
    props.isValidationCheckAllowed &&
    !props.details.coding[codingSystemKeys.OSICS_10]?.osics_classification_id &&
    !props.details.coding[codingSystemKeys.DATALYS]
      ?.datalys_classification_id &&
    !props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
      ?.clinical_impression_classification_id;

  const isBodyAreaFieldInvalid =
    props.isValidationCheckAllowed &&
    !props.details.coding[codingSystemKeys.OSICS_10]?.osics_body_area_id &&
    !props.details.coding[codingSystemKeys.DATALYS]?.datalys_body_area_id &&
    !props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
      ?.clinical_impression_body_area_id;

  const isPastAthlete = !!props.athleteData?.org_last_transfer_record?.left_at;
  const codingSystemIsCI =
    organisation?.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS;
  const codingSystemIsOSIICS15 =
    organisation?.coding_system_key === codingSystemKeys.OSIICS_15;

  const secondaryPathologies = props.details.secondaryPathologies;
  const isSecondaryPathologyFieldInvalid = (value, id) => {
    return (
      props.isValidationCheckAllowed &&
      !value &&
      !newSecondaryPathologyFieldIds.includes(id)
    );
  };
  const addSecondaryPathology = () => {
    const secondaryPathologyId = _uniqueId();
    props.onSelectDetail('secondaryPathologies', [
      ...secondaryPathologies,
      {
        id: secondaryPathologyId,
        record: null,
        side: null,
      },
    ]);
    // Used to skip validation for newly added secondary pathology
    setNewSecondaryPathologyFieldIds((prev) => [...prev, secondaryPathologyId]);
  };
  const removeSecondaryPathology = (id) => {
    props.onSelectDetail('secondaryPathologies', [
      ...secondaryPathologies.filter(
        (secondaryPathology) => id !== secondaryPathology.id
      ),
    ]);
    // Used to skip validation for newly added secondary pathology
    if (newSecondaryPathologyFieldIds.includes(id)) {
      setNewSecondaryPathologyFieldIds([
        newSecondaryPathologyFieldIds.filter(
          (newSecondaryPathologyId) => newSecondaryPathologyId !== id
        ),
      ]);
    }
  };
  const editSecondaryPathologyItem = (id, field, newValue) => {
    props.onSelectDetail('secondaryPathologies', [
      ...secondaryPathologies.map((secondaryPathology) => {
        if (id === secondaryPathology.id) {
          return {
            ...secondaryPathology,
            [`${field}`]: _cloneDeep(newValue),
          };
        }
        return secondaryPathology;
      }),
    ]);
  };

  const renderSupplementalRecurrenceCoding = () => {
    const isInvalid =
      props.isValidationCheckAllowed && !props.details.supplementaryCoding;

    return (
      <div css={style.supplementaryCoding}>
        <AsyncSelect
          data-testid="SupplementaryCoding|Input"
          label={props.t('Supplemental recurrence')}
          value={{
            label: props.details.supplementaryCoding
              ? `${props.details.supplementaryCoding}`
              : '',
            value: null,
          }}
          placeholder=""
          onChange={(coding) =>
            props.onSelectDetail('supplementaryCoding', coding.value.pathology)
          }
          loadOptions={(value, callback) =>
            searchCoding({ filter: value, codingSystem: issueCodingSystem })
              .then((res) => {
                callback(
                  res.results.map((coding) =>
                    getCodingFieldOption({
                      [`${issueCodingSystem}`]: coding,
                    })
                  )
                );
              })
              .catch(() => {})
          }
          minimumLetters={3}
          invalid={isInvalid}
          displayValidationText
        />
      </div>
    );
  };

  const renderOnsetSelection = () => (
    <SelectAndFreetext
      selectLabel={props.t('Onset type')}
      selectedField={props.details.onset ? props.details.onset : ''}
      onSelectedField={(onsetId) => props.onSelectDetail('onset', onsetId)}
      currentFreeText={
        props.details.onsetFreeText ? props.details.onsetFreeText : ''
      }
      onUpdateFreeText={(onsetFreeText) =>
        props.onSelectDetail('onsetFreeText', onsetFreeText)
      }
      invalidFields={
        props.isValidationCheckAllowed &&
        !props.hasRecurrence &&
        !props.details.onset
      }
      options={getSelectOptions(props.onsetOptions)}
      featureFlag={window.featureFlags['nfl-injury-flow-fields']}
      disabled={
        window.featureFlags['pm-injury-edit-mode-of-onset']
          ? props.isRequestPending
          : isPathologyFieldDisabled
      }
      selectContainerStyle={style.onset}
      textAreaContainerStyle={style.onsetFreeText}
      displayValidationText
    />
  );

  const maxPermittedExaminationDate = () => {
    if (isPastAthlete) {
      return props.athleteData?.org_last_transfer_record?.left_at
        ? moment(
            props.athleteData.org_last_transfer_record.left_at
          ).toISOString()
        : props.details.examinationDate;
    }
    return props.details.examinationDate;
  };

  const earliestPermittedExaminationDate = () => {
    if (props.athleteData?.org_last_transfer_record?.joined_at) {
      return moment(props.athleteData.org_last_transfer_record?.joined_at)
        .add(1, 'days')
        .toISOString();
    }
    return props.occurrenceDate;
  };

  const renderDateOfExaminationDatePicker = () => {
    return (
      <Box sx={{ width: '12rem' }}>
        <Box css={style.examinationDate}>
          <DatePicker
            label={props.t('Date of examination')}
            name="examinationDate"
            onDateChange={(date) =>
              props.onSelectDetail('examinationDate', date)
            }
            value={props.details.examinationDate}
            minDate={earliestPermittedExaminationDate()}
            maxDate={maxPermittedExaminationDate()}
            disableFutureDates
            invalid={
              props.isValidationCheckAllowed && !props.details.examinationDate
            }
            disabled={props.isRequestPending}
            kitmanDesignSystem
            displayValidationText
          />
        </Box>
      </Box>
    );
  };

  const renderCodingSystemDetails = () => {
    const bodyArea = props.details.coding.icd_10_cm?.osics_body_area;
    const side = props.details.coding.icd_10_cm?.side;
    const code = props.details.coding.icd_10_cm?.code;

    return (
      <Box sx={{ display: 'contents' }}>
        <div css={style.ciCodeBodyArea}>
          <label css={style.textLabel}>{props.t('Body area')}</label>
          <span css={style.textValue}>{bodyArea}</span>
        </div>
        <div css={style.ciCodeSide}>
          <label css={style.textLabel}>{props.t('Side')}</label>
          <span css={style.textValue}>{side}</span>
        </div>
        <div css={style.ciCode}>
          <label css={style.textLabel}>{props.t('Code')}</label>
          <span css={style.textValue}>{code}</span>
        </div>
      </Box>
    );
  };

  const renderDateOfExaminationDatePickerNew = () => {
    const minDate = props.occurrenceDate;
    const maxDate = props.details.examinationDate;

    return (
      <MovementAwareDatePicker
        athleteId={props.athleteId}
        value={
          props.details.examinationDate
            ? moment(props.details.examinationDate)
            : null
        }
        onChange={(date) => props.onSelectDetail('examinationDate', date)}
        name="examinationDate"
        inputLabel={props.t('Date of examination')}
        disabled={props.isRequestPending}
        isInvalid={
          props.isValidationCheckAllowed && !props.details.examinationDate
        }
        minDate={minDate && moment(minDate)}
        maxDate={maxDate && moment(maxDate)}
        kitmanDesignSystem
      />
    );
  };

  const renderPathologyType = () => (
    <div css={style.pathologyType}>
      <Select
        appendToBody
        value={1}
        label={props.t('Pathology type')}
        options={[
          {
            value: 1,
            label: props.t('Primary'),
          },
        ]}
        isDisabled
      />
    </div>
  );

  const getCodingSystem = () => {
    let codingSystem = codingSystemKeys.ICD; // Default
    if (props.details.coding[codingSystemKeys.DATALYS]) {
      codingSystem = codingSystemKeys.DATALYS;
    }
    if (props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
      codingSystem = codingSystemKeys.CLINICAL_IMPRESSIONS;
    }
    return codingSystem;
  };

  const renderLegacyPathologyField = () => (
    <div css={style.pathology}>
      {(props.details.coding[codingSystemKeys.ICD] ||
        props.details.coding[codingSystemKeys.DATALYS] ||
        props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) && (
        <AsyncSelect
          label={props.t('Pathology')}
          value={getCodingFieldOption(props.details.coding)}
          placeholder=""
          onChange={(coding) => {
            const codingSystem = getCodingSystem();
            props.onSelectDetail('coding', {
              // $FlowFixMe key is always present and is set to ICD by default
              [codingSystem]: {
                ...props.details.coding[codingSystem],
                ...coding.value,
              },
            });
          }}
          loadOptions={(value, callback) =>
            searchCoding({
              filter: value,
              codingSystem: issueCodingSystem,
            })
              .then((res) => {
                callback(
                  res.results.map((coding) =>
                    getCodingFieldOption({
                      [`${issueCodingSystem}`]: coding,
                    })
                  )
                );
              })
              .catch(() => {})
          }
          minimumLetters={3}
          isDisabled={props.hasRecurrence}
          invalid={
            props.isValidationCheckAllowed &&
            !getCodingFieldOption(props.details.coding)?.label
          }
          displayValidationText
        />
      )}
      {props.details.coding[codingSystemKeys.OSICS_10] && (
        <Select
          appendToBody
          value={
            props.details.coding[codingSystemKeys.OSICS_10].osics_pathology_id
          }
          label={props.t('Pathology')}
          options={getEditSelectOptions(props.pathologies)}
          onChange={(pathologyId) => props.onSelectOsicsPathology(pathologyId)}
          invalid={
            props.isValidationCheckAllowed &&
            !props.details.coding[codingSystemKeys.OSICS_10]?.osics_pathology_id
          }
          isDisabled={props.hasRecurrence || props.isRequestPending}
          displayValidationText
        />
      )}
    </div>
  );

  const renderPathologyFields = () => {
    const issueType = props?.issueType?.toLowerCase().includes('injury')
      ? 'injury'
      : 'illness';
    const selectedPathology =
      Array.isArray(props.details.coding?.pathologies) &&
      props.details.coding.pathologies.length
        ? {
            ...props.details.coding.pathologies[0],
            label: props.details.coding.pathologies[0].pathology,
          }
        : null;

    const selectedSide =
      props.details.coding.pathologies && props.details?.coding?.pathologies[0]
        ? props.details.coding.pathologies[0].coding_system_side_id
        : 0;

    return (
      <OSIICS15
        onSelectDetail={props.onSelectDetail}
        details={props.details}
        athleteId={props.athleteId}
        athleteData={props.athleteData}
        codingSystemProps={{
          onSelectCodingSystemPathology: (pathology) => {
            props.onSelectDetail('coding', {
              pathologies: pathology ? [pathology] : [], // NOTE: coding_system_side_id gets cleared by design, user must reselect
            });
          },
          selectedCodingSystemPathology: selectedPathology || null,
        }}
        isEditMode
        isChronicCondition={props.isChronicIssue}
        issueType={issueType}
        invalidFields={['']}
        selectedAthlete={props.athleteId}
        sideProps={{
          selectedSide,
          onSelectSide: (sideId) => {
            if (selectedPathology) {
              props.onSelectDetail('coding', {
                pathologies: [
                  { ...selectedPathology, coding_system_side_id: sideId },
                ],
              });
            } else {
              /* eslint-disable no-console */
              console.warn(
                'Attempted to select side, but props.details.coding.pathologies[0] is undefined.'
              ); // Will be replaced by toast
            }
          },
        }}
        examinationDateProps={{
          selectedExaminationDate: props.details?.examinationDate || '',
          selectedDiagnosisDate: props.occurrenceDate || '',
          maxPermittedExaminationDate: maxPermittedExaminationDate() || '',
          onSelectExaminationDate: props.onSelectDetail,
        }}
        onsetProps={{
          // $FlowIgnore - the type is correct
          selectedOnset: props.details.onset ? props.details.onset : '',
          onSelectOnset: (onsetId) => props.onSelectDetail('onset', onsetId),
          onUpdateOnsetFreeText: () => {},
          onsetFreeText: '',
        }}
      />
    );
  };

  const renderCorrectDatePicker = () => {
    if (
      (!window.featureFlags['pm-editing-examination-and-date-of-injury'] ||
        codingSystemIsCI) &&
      !codingSystemIsOSIICS15
    ) {
      if (window.featureFlags['player-movement-aware-datepicker']) {
        return renderDateOfExaminationDatePickerNew();
      }
      return renderDateOfExaminationDatePicker();
    }
    // Used by v1 coding systems - v2 CS has the IssueExaminationDatePicker within its component
    if (
      !codingSystemIsCI &&
      window.featureFlags['pm-editing-examination-and-date-of-injury'] &&
      !codingSystemIsOSIICS15
    ) {
      return (
        <IssueExaminationDatePicker
          athleteId={props.athleteId}
          athleteData={props.athleteData}
          details={props.details}
          examinationDateProps={{
            selectedExaminationDate: props.details?.examinationDate || '',
          }}
          isEditMode
          maxPermittedExaminationDate={maxPermittedExaminationDate() || ''}
          onChangeExaminationDate={(date) =>
            props.onSelectDetail('examinationDate', date)
          }
          onChangeOccurrenceDate={(date) =>
            props.onSelectDetail('occurrenceDate', date)
          }
        />
      );
    }
    return null;
  };

  return (
    <Box sx={!isV2CodingSystem ? style.viewWrapper : {}}>
      {renderCorrectDatePicker()}
      {!isV2CodingSystem && renderPathologyType()}
      {isV2CodingSystem
        ? renderPathologyFields()
        : renderLegacyPathologyField()}
      {!isV2CodingSystem &&
        window.featureFlags['custom-pathologies'] &&
        (isSupplementalPathologyShown || props.details.supplementalPathology ? (
          <Box sx={style.supplementalPathology}>
            <InputTextField
              label={props.t('Supplemental pathology')}
              value={props.details.supplementalPathology || ''}
              onChange={(e) =>
                props.onSelectDetail('supplementalPathology', e.target.value)
              }
              disabled={props.isRequestPending}
              kitmanDesignSystem
            />
            <IconButton
              icon="icon-bin"
              isDisabled={props.isRequestPending}
              isTransparent
              onClick={() => {
                props.onSelectDetail('supplementalPathology', '');
                setIsSupplementalPathologyShown(false);
              }}
            />
          </Box>
        ) : (
          <Box sx={style.addPathology}>
            <TextButton
              text={props.t('Add supplemental pathology')}
              type="subtle"
              onClick={() => setIsSupplementalPathologyShown(true)}
              isDisabled={props.hasRecurrence || props.isRequestPending}
              kitmanDesignSystem
            />
          </Box>
        ))}
      {shouldRenderCodingSystemDetails && renderCodingSystemDetails()}
      {window.featureFlags['supplemental-recurrence-code'] &&
        props.occurrenceType === 'recurrence' &&
        renderSupplementalRecurrenceCoding()}
      {(props.details.coding[codingSystemKeys.OSICS_10] ||
        props.details.coding[codingSystemKeys.DATALYS] ||
        props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) && (
        <>
          <div css={style.classification}>
            {isEditClassificationSelectShown ? (
              <Select
                appendToBody
                value={
                  props.details.coding[codingSystemKeys.OSICS_10]
                    ?.osics_classification_id ||
                  props.details.coding[codingSystemKeys.DATALYS]
                    ?.datalys_classification_id ||
                  props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                    ?.clinical_impression_classification_id
                }
                label={props.t('Classification')}
                options={getEditSelectOptions(props.classifications)}
                onChange={(classificationId) => {
                  if (props.details.coding[codingSystemKeys.OSICS_10]) {
                    props.onSelectDetail('coding', {
                      [codingSystemKeys.OSICS_10]: {
                        ...props.details.coding[codingSystemKeys.OSICS_10],
                        osics_classification_id: classificationId,
                      },
                    });
                  }
                  if (props.details.coding[codingSystemKeys.DATALYS]) {
                    props.onSelectDetail('coding', {
                      [codingSystemKeys.DATALYS]: {
                        ...props.details.coding[codingSystemKeys.DATALYS],
                        datalys_classification_id: classificationId,
                      },
                    });
                  }
                  if (
                    props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                  ) {
                    props.onSelectDetail('coding', {
                      [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
                        ...props.details.coding[
                          codingSystemKeys.CLINICAL_IMPRESSIONS
                        ],
                        clinical_impression_classification_id: classificationId,
                      },
                    });
                  }
                }}
                invalid={isClassificationFieldInvalid}
                isDisabled={props.hasRecurrence || props.isRequestPending}
                displayValidationText
              />
            ) : (
              <div css={style.description}>
                <span css={style.descriptionLabel}>
                  {props.t('Classification:')}
                </span>
                <span css={style.descriptionValue}>
                  {
                    props.classifications.find(
                      (classification) =>
                        classification.id ===
                          props.details.coding[codingSystemKeys.OSICS_10]
                            ?.osics_classification_id ||
                        classification.id ===
                          props.details.coding[codingSystemKeys.DATALYS]
                            ?.datalys_classification_id ||
                        classification.id ===
                          props.details.coding[
                            codingSystemKeys.CLINICAL_IMPRESSIONS
                          ]?.clinical_impression_classification_id
                    )?.name
                  }
                </span>
                {!props.hasRecurrence &&
                  !props.details.coding[
                    codingSystemKeys.CLINICAL_IMPRESSIONS
                  ] && (
                    <IconButton
                      icon="icon-edit"
                      isTransparent
                      onClick={() => setIsEditClassificationSelectShown(true)}
                      isDisabled={props.isRequestPending}
                    />
                  )}
              </div>
            )}
          </div>
          <div css={style.bodyArea}>
            {isEditBodyAreaSelectShown ? (
              <Select
                appendToBody
                value={
                  props.details.coding[codingSystemKeys.OSICS_10]
                    ?.osics_body_area_id ||
                  props.details.coding[codingSystemKeys.DATALYS]
                    ?.datalys_body_area_id ||
                  props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                    ?.clinical_impression_body_area_id
                }
                label={props.t('Body area')}
                options={getEditSelectOptions(props.bodyAreas)}
                onChange={(bodyAreaId) => {
                  if (props.details.coding[codingSystemKeys.OSICS_10]) {
                    props.onSelectDetail('coding', {
                      [codingSystemKeys.OSICS_10]: {
                        ...props.details.coding[codingSystemKeys.OSICS_10],
                        osics_body_area_id: bodyAreaId,
                      },
                    });
                  }
                  if (props.details.coding[codingSystemKeys.DATALYS]) {
                    props.onSelectDetail('coding', {
                      [codingSystemKeys.DATALYS]: {
                        ...props.details.coding[codingSystemKeys.DATALYS],
                        datalys_body_area_id: bodyAreaId,
                      },
                    });
                  }
                  if (
                    props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                  ) {
                    props.onSelectDetail('coding', {
                      [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
                        ...props.details.coding[
                          codingSystemKeys.CLINICAL_IMPRESSIONS
                        ],
                        clinical_impression_body_area_id: bodyAreaId,
                      },
                    });
                  }
                }}
                invalid={isBodyAreaFieldInvalid}
                isDisabled={props.hasRecurrence || props.isRequestPending}
                displayValidationText
              />
            ) : (
              <div css={style.description}>
                <span css={style.descriptionLabel}>
                  {props.t('Body area:')}
                </span>
                <span css={style.descriptionValue}>
                  {
                    props.bodyAreas.find(
                      (bodyArea) =>
                        bodyArea.id ===
                          props.details.coding[codingSystemKeys.OSICS_10]
                            ?.osics_body_area_id ||
                        bodyArea.id ===
                          props.details.coding[codingSystemKeys.DATALYS]
                            ?.datalys_body_area_id ||
                        bodyArea.id ===
                          props.details.coding[
                            codingSystemKeys.CLINICAL_IMPRESSIONS
                          ]?.clinical_impression_body_area_id
                    )?.name
                  }
                </span>
                {!props.hasRecurrence &&
                  !props.details.coding[
                    codingSystemKeys.CLINICAL_IMPRESSIONS
                  ] && (
                    <IconButton
                      icon="icon-edit"
                      isTransparent
                      onClick={() => setIsEditBodyAreaSelectShown(true)}
                      isDisabled={props.isRequestPending}
                    />
                  )}
              </div>
            )}
          </div>

          {(props.details.coding[codingSystemKeys.OSICS_10] ||
            props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) && (
            <div css={style.code}>
              <div css={style.description}>
                <span css={style.descriptionLabel}>{props.t('Code:')}</span>
                <span css={style.descriptionValue}>
                  {props.details.coding[codingSystemKeys.OSICS_10]?.osics_id ||
                    props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                      ?.code}
                </span>
              </div>
            </div>
          )}

          {props.details.coding[codingSystemKeys.DATALYS] && (
            <div css={style.tissueType}>
              <div css={style.description}>
                <span css={style.descriptionLabel}>
                  {props.t('Tissue type: ')}
                </span>
                <span css={style.descriptionValue}>
                  {
                    props.details.coding[codingSystemKeys.DATALYS]
                      ?.datalys_tissue_type
                  }
                </span>
              </div>
            </div>
          )}
        </>
      )}
      {window.featureFlags['include-bamic-on-injury'] &&
        props.details.isBamic && (
          <>
            <div css={style.bamicGrade}>
              <Select
                appendToBody
                optional
                label={props.t('Grade')}
                value={props.details?.bamic_grade_id}
                options={props.bamicGrades.map((grade) => ({
                  value: grade.id,
                  label: grade.name,
                }))}
                isDisabled={props.isRequestPending}
                onChange={(bamicGradeId) =>
                  props.onSelectDetail('bamic_grade_id', bamicGradeId)
                }
              />
            </div>
            <div css={style.bamicSite}>
              <Select
                appendToBody
                optional
                label={props.t('Site')}
                value={props.details?.bamic_site_id || null}
                options={bamicSiteOptions}
                isDisabled={
                  props.isRequestPending ||
                  !props.details?.bamic_grade_id ||
                  !bamicSiteOptions?.length
                }
                onChange={(bamicSiteId) =>
                  props.onSelectDetail('bamic_site_id', bamicSiteId)
                }
              />
            </div>
          </>
        )}
      {!isV2CodingSystem && renderOnsetSelection()}
      {window.featureFlags['nfl-injury-flow-fields'] && (
        <div css={style.onsetDescription}>
          <Textarea
            value={props.details.onsetDescription}
            appendToBody
            label={props.t('Description of onset')}
            onChange={(text) => props.onSelectDetail('onsetDescription', text)}
            disabled={
              window.featureFlags['pm-injury-edit-mode-of-onset']
                ? props.isRequestPending
                : props.isRequestPending || props.isContinuationIssue
            }
            kitmanDesignSystem
            optionalText={props.t('Optional')}
          />
        </div>
      )}
      {(props.details.coding[codingSystemKeys.OSICS_10] ||
        props.details.coding[codingSystemKeys.DATALYS] ||
        props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) && (
        <div css={style.side}>
          <SegmentedControl
            selectedButton={getSelectedSide()}
            buttons={props.sides.map(({ name, id }) => ({
              name,
              value: id,
            }))}
            label={props.t('Side')}
            maxWidth={400}
            onClickButton={(sideId) => {
              if (!window.featureFlags['emr-multiple-coding-systems']) {
                props.onSelectDetail('side', sideId);
                return;
              }
              if (props.details.coding[codingSystemKeys.OSICS_10]) {
                props.onSelectDetail('coding', {
                  [codingSystemKeys.OSICS_10]: {
                    ...props.details.coding[codingSystemKeys.OSICS_10],
                    side_id: sideId,
                  },
                });
              }
              if (props.details.coding[codingSystemKeys.DATALYS]) {
                props.onSelectDetail('coding', {
                  [codingSystemKeys.DATALYS]: {
                    ...props.details.coding[codingSystemKeys.DATALYS],
                    side_id: sideId,
                  },
                });
              }
              if (props.details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
                props.onSelectDetail('coding', {
                  [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
                    ...props.details.coding[
                      codingSystemKeys.CLINICAL_IMPRESSIONS
                    ],
                    side_id: sideId,
                  },
                });
              }
            }}
            invalid={isSideFieldInvalid()}
            isDisabled={isPathologyFieldDisabled}
            displayValidationText
          />
        </div>
      )}
      {window.featureFlags['multi-part-injury-ci-code'] && (
        <>
          <hr css={style.divider} />
          {secondaryPathologies.map((pathology) => {
            return (
              <Fragment key={pathology.id}>
                <div css={style.secondaryPathology}>
                  <AsyncSelect
                    label={props.t('Secondary CI Code')}
                    value={getCodingFieldOption({
                      [`${issueCodingSystem}`]: pathology.record,
                    })}
                    placeholder=""
                    onChange={(coding) => {
                      editSecondaryPathologyItem(
                        pathology.id,
                        'record',
                        coding.value
                      );
                    }}
                    loadOptions={(value, callback) =>
                      searchCoding({
                        filter: value,
                        codingSystem: issueCodingSystem,
                      })
                        .then((res) => {
                          callback(
                            res.results.map((coding) =>
                              getCodingFieldOption({
                                [`${issueCodingSystem}`]: coding,
                              })
                            )
                          );
                        })
                        .catch(() => {})
                    }
                    minimumLetters={3}
                    invalid={isSecondaryPathologyFieldInvalid(
                      pathology.record,
                      pathology.id
                    )}
                    displayValidationText
                  />
                </div>
                <div css={[style.secondaryPathologySide]}>
                  <SegmentedControl
                    selectedButton={getSelectedSide()}
                    buttons={props.sides.map(({ name, id }) => ({
                      name,
                      value: id,
                    }))}
                    isDisabled
                    label={props.t('Side')}
                    maxWidth={400}
                    onClickButton={() => {}}
                  />
                </div>
                <div css={[style.removeSecondaryPathology]}>
                  <IconButton
                    icon="icon-bin"
                    isTransparent
                    onClick={() => removeSecondaryPathology(pathology.id)}
                  />
                </div>

                <div css={style.secondaryPathologyDetails}>
                  <div css={style.description}>
                    <span css={style.descriptionLabel}>
                      {props.t('Classification:')}
                    </span>
                    <span css={style.descriptionValue}>
                      {props.classifications.find(
                        (classification) =>
                          classification.id ===
                            pathology.record?.clinical_impression_classification
                              .id ||
                          classification.id ===
                            pathology.record
                              ?.clinical_impression_classification_id
                      )?.name || ' - '}
                    </span>
                  </div>
                  <div css={style.description}>
                    <span css={style.descriptionLabel}>
                      {props.t('Body Area:')}
                    </span>
                    <span css={style.descriptionValue}>
                      {props.bodyAreas.find(
                        (bodyArea) =>
                          bodyArea.id ===
                            pathology.record?.clinical_impression_body_area
                              ?.id ||
                          bodyArea.id ===
                            pathology.record?.clinical_impression_body_area_id
                      )?.name || ' - '}
                    </span>
                  </div>
                  <div css={style.description}>
                    <span css={style.descriptionLabel}>{props.t('Code:')}</span>
                    <span css={style.descriptionValue}>
                      {pathology.record?.code || ' - '}
                    </span>
                  </div>
                </div>
                <hr css={style.divider} />
              </Fragment>
            );
          })}
          <TextButton
            isDisabled={false}
            text={props.t('Add diagnosis')}
            type="secondary"
            onClick={addSecondaryPathology}
            kitmanDesignSystem
          />
        </>
      )}
      {
        // NOTE: The details.coding object will be the issue.osics object should FF 'emr-multiple-coding-systems' be off
        window.featureFlags['concussion-medical-area'] &&
          props.details.coding[issueCodingSystem]?.groups?.includes(
            'concussion'
          ) && (
            <div css={style.concussion}>
              <ConcussionAssessmentSection
                athleteId={props.athleteId}
                showAssessmentReportSelector={
                  props.showAssessmentReportSelector
                }
                setShowAssessmentReportSelector={(show: boolean) => {
                  if (!show) {
                    // Clear the assessments when no assessment was performed is selected
                    props.onSelectDetail('concussion_assessments', []);
                  }
                  props.onChangeShowAssessmentReportSelector(show);
                }}
                invalidFields={
                  props.showAssessmentReportSelector &&
                  (!props.details.concussion_assessments ||
                    props.details.concussion_assessments.length < 1)
                    ? ['attached_concussion_assessments']
                    : []
                }
                onUpdateAttachedConcussionAssessments={(selection) =>
                  props.onSelectDetail('concussion_assessments', selection)
                }
                attachedConcussionAssessments={
                  props.details.concussion_assessments
                }
              />
            </div>
          )
      }
    </Box>
  );
};

export const EditViewTranslated = withNamespaces()(EditView);
export default EditView;
