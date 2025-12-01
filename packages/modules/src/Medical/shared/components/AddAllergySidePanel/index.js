// @flow
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  AsyncSelect,
  AppStatus,
  DatePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
  SegmentedControl,
  Textarea,
  TooltipMenu,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption as Option } from '@kitman/components/src/types';
import {
  saveNote,
  getAllergyMedications,
  saveAllergyMedication,
  updateAllergy,
} from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { NOTE_TYPE } from '@kitman/modules/src/Medical/shared/types/medical/MedicalNote';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { NonMedicalAllergy } from '../../hooks/useNonMedicalAllergies';
import useAllergyForm from './hooks/useAllergyForm';
import type { RequestStatus } from '../../types';
import type { AllergyDataResponse } from '../../types/medical';
import SeverityLabel from './components/SeverityLabel';
import style from './styles';
import AthleteConstraints from '../AthleteConstraints';

type Props = {
  isOpen: boolean,
  isAthleteSelectable: boolean,
  initialDataRequestStatus: RequestStatus,
  squadAthletes: Array<Option>,
  nonMedicalAllergies: Array<NonMedicalAllergy>,
  athleteId?: ?number,
  selectedAllergy: AllergyDataResponse | null,
  enableReloadData: Function,
  onSaveAllergy: Function,
  onSaveAllergyStart: Function,
  onSaveAllergySuccess: Function,
  onClose: Function,
};

const AddAllergySidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const { permissions } = usePermissions();
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const [showDate, setShowDate] = useState<boolean>(false);
  const [allergyTypes, setAllergyTypes] = useState<Array<NonMedicalAllergy>>(
    []
  );
  const [selectedAllergyType, setSelectedAllergyType] = useState(0);
  const [selectedAllergen, setSelectedAllergen] = useState(0);
  const [filteredNonMedicalAllergies, setFilteredNonMedicalAllergies] =
    useState<Array<NonMedicalAllergy>>([]);

  const { formState, dispatch } = useAllergyForm();

  const getAllergyType = (existingType) => {
    const findAlleryType = allergyTypes.find(
      (obj) => obj.type === existingType
    );
    if (findAlleryType) {
      setSelectedAllergyType(findAlleryType.value);
    }
  };

  const populateSelectedAllergy = (allergy) => {
    const {
      athlete_id: athleteId,
      allergen: {
        allergen_type: allergenType,
        id: allergenValue,
        name: allergenLabel,
      },
      display_name: allergyName,
      ever_been_hospitalised: everBeenHospitalised,
      require_epinephrine: requireEpinephrine,
      symptoms,
      severity,
      diagnosed_on: allergyDate,
    } = allergy;
    getAllergyType(allergenType);
    dispatch({
      type: 'AUTOPOPULATE_SELECTED_ALLERGY',
      athleteId,
      allergen: {
        type: allergenType,
        name: allergenLabel,
        id: allergenValue,
      },
      allergenName: {
        // $FlowFixMe
        label: allergenLabel,
        type: allergenType,
        value: allergenValue,
      },
      allergyName,
      symptoms,
      severity,
      everBeenHospitalised,
      requireEpinephrine,
    });
    if (allergyDate) {
      setShowDate(true);
      dispatch({
        type: 'SET_ALLERGY_DATE',
        allergyDate: moment(allergyDate).format(dateTransferFormat),
      });
    }
  };

  useEffect(() => {
    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }
    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      setSelectedAllergyType(0);
      setSelectedAllergen(0);
      dispatch({ type: 'CLEAR_FORM' });
    }

    // if editing, populate fields
    if (props.isOpen && props.selectedAllergy) {
      populateSelectedAllergy(props.selectedAllergy);
    }
  }, [props.athleteId, props.isOpen]);

  useEffect(() => {
    const types = [
      'Medicine allergy',
      ...new Set(
        props.nonMedicalAllergies.map(
          (nonMedicalAllergy) => nonMedicalAllergy.type
        )
      ),
    ]
      .map((nonMedicalAllergy, index) => {
        return {
          label: nonMedicalAllergy,
          value: index,
          type: nonMedicalAllergy,
        };
      })
      .sort((allergyA, allergyB) =>
        allergyA.label?.localeCompare(allergyB.label)
      );
    setAllergyTypes(types);
  }, [props.nonMedicalAllergies]);

  // Handle Medical Allergen selection
  const allergyChange = (allergen: any) => {
    if (!selectedAllergyType) {
      // checks if "Medicine" is selected allergy type
      dispatch({
        type: 'SET_ALLERGEN',
        allergenName: allergen,
        allergen: {
          type: 'FdbAllergen',
          id: allergen.value,
          name: allergen.label,
        },
      });
    } else {
      dispatch({
        type: 'SET_ALLERGEN',
        allergenName: allergen,
        allergen: {
          type: allergen.type,
          name: allergen.label,
          id: allergen.value,
        },
      });
    }
  };

  useEffect(() => {
    const type = allergyTypes.find(
      (allergyType) => allergyType.value === selectedAllergyType
    );
    const filteredData = props.nonMedicalAllergies.filter(
      (allergy) => allergy.type === type?.type
    );
    const filteredAllergies = filteredData.sort((allergyA, allergyB) =>
      allergyA.label?.localeCompare(allergyB.label)
    );
    setFilteredNonMedicalAllergies(filteredAllergies);
    // check if selected allergy type is "Optional allergy"
    if (selectedAllergyType === 10) {
      // selecting first option as default value
      setSelectedAllergen(filteredAllergies[0].value);
      allergyChange(filteredAllergies[0]);
    }
    // if editing an allergy, find the allergen
    if (props.selectedAllergy?.allergen?.id) {
      const findAllergen = filteredAllergies.find(
        (allergy) => allergy.value === props.selectedAllergy?.allergen.id
      );
      setSelectedAllergen(findAllergen?.value);
    }
  }, [selectedAllergyType]);

  const findAllergyByValue = (allergy: number) => {
    return props.nonMedicalAllergies.find(
      (nonMedicalAllergy) => nonMedicalAllergy.value === allergy
    );
  };

  const onClickAllergyType = (allergy: number) => {
    dispatch({
      type: 'SET_ALLERGEN',
      allergen: { rcopia_id: '', type: '', search_expression: '' },
      allergenName: { value: null, label: '' },
    });
    setSelectedAllergyType(allergy);
  };

  const onAthleteChange = (athleteId: number) => {
    dispatch({ type: 'SET_ATHLETE_ID', athleteId });
  };

  // Form Allergy field title based on feature flag
  const getAllergyTitle = () => {
    return permissions.medical.allergies.canCreate
      ? props.t('Allergy title')
      : props.t('Name of Allergy');
  };

  // Allergy medication save, new flow.
  const onSaveAllergyMedication = () => {
    const allergyData = {
      athlete_id: formState.athlete_id,
      allergen: formState.allergen,
      name: formState.name,
      ever_been_hospitalised: formState.ever_been_hospitalised,
      require_epinephrine: formState.require_epinephrine,
      symptoms: formState.symptoms,
      severity: formState.severity,
      diagnosed_on: formState.allergy_date,
    };

    setIsValidationCheckAllowed(true);

    const requiredFields = [
      formState.athlete_id,
      formState.severity,
      formState.allergen.id,
    ];

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    if (!allRequiredFieldsAreValid) {
      return;
    }
    props.onSaveAllergyStart(formState.allergen_name.value);

    const allergyMedicationEndpoint = props.selectedAllergy
      ? updateAllergy(props.selectedAllergy.id, allergyData)
      : saveAllergyMedication(allergyData);

    allergyMedicationEndpoint
      .then(() => {
        setRequestStatus('SUCCESS');
        props.onSaveAllergySuccess(formState.allergen_name.value);
        props.onSaveAllergy?.();
        props.enableReloadData?.(true);
        props.onClose();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  // Normal Allergy Medical Note flow
  const onSave = () => {
    const noteData = {
      attachment_ids: [],
      note_date: formState.allergy_date,
      note_type: NOTE_TYPE.MEDICAL_NOTE_ID,
      medical_type: 'Allergy',
      medical_name: formState.allergy_name,
      injury_ids: formState.injury_occurrence_ids,
      illness_ids: formState.illness_occurrence_ids,
      restricted: formState.restricted_to_doc,
      psych_only: formState.restricted_to_psych,
      note: 'Allergy',
    };

    setIsValidationCheckAllowed(true);
    const requiredFields = [
      formState.athlete_id,
      formState.allergy_date,
      formState.allergy_name,
    ];
    const allRequiredFieldsAreValid = requiredFields.every((item) => item);
    if (!allRequiredFieldsAreValid) {
      return;
    }

    setRequestStatus('PENDING');
    saveNote(
      // $FlowFixMe athleteID will never be null at this point
      formState.athlete_id,
      noteData
    )
      .then(() => {
        setRequestStatus('SUCCESS');
        props.onSaveAllergy?.();
        props.onClose();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const didAnyRequestFail = [
    requestStatus,
    props.initialDataRequestStatus,
  ].some((status) => status === 'FAILURE');

  const renderAthleteSelector = () => {
    const fromAthlete = !props.isAthleteSelectable && !!props.athleteId;
    const fromEdit = !props.isAthleteSelectable && props.selectedAllergy;

    return (
      <AthleteConstraints athleteId={formState.athlete_id}>
        {({ organisationStatus, athleteSelector, isLoading }) => (
          <div
            css={style.player}
            data-testid="AddAllergySidePanel|AthleteSelect"
          >
            <Select
              label={props.t('Athlete')}
              onChange={(id) => onAthleteChange(id)}
              value={formState.athlete_id}
              options={
                organisationStatus === 'PAST_ATHLETE'
                  ? athleteSelector
                  : props.squadAthletes
              }
              isDisabled={
                fromAthlete ||
                fromEdit ||
                isLoading ||
                requestStatus === 'PENDING'
              }
              invalid={isValidationCheckAllowed && !formState.athlete_id}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  return (
    <div css={style.sidePanel} data-testid="AddAllergySidePanel|Parent">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={
          props.selectedAllergy
            ? props.t('Edit allergy')
            : props.t('Add allergy')
        }
        onClose={() => props.onClose()}
        width={659}
      >
        <div css={style.content}>
          {renderAthleteSelector()}

          {permissions.medical.allergies.canCreate && (
            <>
              <div css={style.allergyDetailsSection}>
                <h4 css={style.heading}>{props.t('Allergy details')}</h4>{' '}
              </div>

              <div
                css={style.allergyTypeSelect}
                data-testid="AddAllergySidePanel|AllergenTypeSelect"
              >
                <Select
                  label={props.t('Type')}
                  options={allergyTypes}
                  onChange={(type) => onClickAllergyType(type)}
                  value={selectedAllergyType}
                  isDisabled={!!props.selectedAllergy}
                />
              </div>
              <div
                css={style.allergySelect}
                data-testid="AddAllergySidePanel|AllergenSelect"
              >
                {!selectedAllergyType ? (
                  <AsyncSelect
                    label={props.t('Allergen(s)')}
                    placeholder={props.t('Search...')}
                    onChange={(type) => allergyChange(type)}
                    value={formState.allergen_name}
                    loadOptions={(value, callback) => {
                      getAllergyMedications(value)
                        .then((res) => {
                          callback(
                            res.options?.map((all) => {
                              return {
                                value: all.id,
                                label: all.name,
                              };
                            })
                          );
                        })
                        .catch(() => {
                          setRequestStatus('FAILURE');
                        });
                    }}
                    invalid={
                      isValidationCheckAllowed &&
                      formState.allergen.rcopia_id === ''
                    }
                    isDisabled={!!props.selectedAllergy}
                  />
                ) : (
                  <Select
                    label={props.t('Allergen(s)')}
                    options={filteredNonMedicalAllergies}
                    onChange={(type) => {
                      const allergy = findAllergyByValue(type);
                      setSelectedAllergen(type);
                      allergyChange(allergy);
                    }}
                    value={selectedAllergen}
                    invalid={isValidationCheckAllowed && !formState.allergen.id}
                    isDisabled={!!props.selectedAllergy}
                  />
                )}
              </div>
              <div css={style.questions}>
                <div css={style.question}>
                  <span>
                    {props.t(
                      'Has the athlete ever been hospitalised for this allergy?'
                    )}
                  </span>
                  <SegmentedControl
                    buttons={[
                      { name: props.t('Yes'), value: 1 },
                      { name: props.t('No'), value: 0 },
                    ]}
                    width="inline"
                    maxWidth={200}
                    onClickButton={(hospitalised) => {
                      dispatch({
                        type: 'SET_EVER_HOSPITALISED',
                        everBeenHospitalised: Boolean(hospitalised),
                      });
                    }}
                    selectedButton={Number(formState.ever_been_hospitalised)}
                    color={colors.grey_200}
                    isSeparated
                  />
                </div>
                <div css={style.question}>
                  <span>
                    {props.t(
                      'Does the athlete require an EpiPen for the allergy?'
                    )}
                  </span>
                  <SegmentedControl
                    buttons={[
                      { name: props.t('Yes'), value: 1 },
                      { name: props.t('No'), value: 0 },
                    ]}
                    width="inline"
                    maxWidth={200}
                    onClickButton={(epinephrine) => {
                      dispatch({
                        type: 'SET_REQUIRE_EPINEPHRINE',
                        requireEpinephrine: Boolean(epinephrine),
                      });
                    }}
                    selectedButton={Number(formState.require_epinephrine)}
                    color={colors.grey_200}
                    isSeparated
                  />
                </div>
              </div>

              <div
                css={style.symptoms}
                data-testid="AddAllergySidePanel|Symptoms"
              >
                <Textarea
                  label={props.t('Allergy symptoms')}
                  value={formState.symptoms}
                  onChange={(symptoms) =>
                    dispatch({
                      type: 'SET_SYMPTOMS',
                      symptoms,
                    })
                  }
                  maxLimit={65535}
                  kitmanDesignSystem
                  t={props.t}
                  disabled={requestStatus === 'PENDING'}
                  optionalText="Optional"
                />
              </div>

              <div
                css={style.severity}
                data-testid="AddAllergySidePanel|Severity"
              >
                <SegmentedControl
                  buttons={[
                    { name: props.t('Severe'), value: 'severe' },
                    { name: props.t('Moderate'), value: 'moderate' },
                    { name: props.t('Mild'), value: 'mild' },
                    { name: props.t('Not Specified'), value: 'none' },
                  ]}
                  label={props.t('Severity')}
                  width="inline"
                  maxWidth={400}
                  onClickButton={(severity) => {
                    dispatch({
                      type: 'SET_SEVERITY',
                      severity,
                    });
                  }}
                  selectedButton={formState.severity}
                  invalid={isValidationCheckAllowed && !formState.severity}
                  color={colors.grey_200}
                  isSeparated
                />

                {formState?.severity && formState.allergen_name?.label && (
                  <SeverityLabel
                    showPreviewLabel
                    label={formState.name || formState.allergen_name?.label}
                    severity={formState?.severity}
                    t={props.t}
                  />
                )}
              </div>
            </>
          )}

          <div
            css={style.custom_allergy_name}
            data-testid="AddAllergySidePanel|CustomAllergyName"
          >
            <InputTextField
              name="custom_allergy_name"
              label={getAllergyTitle()}
              kitmanDesignSystem
              value={formState.name || formState.allergy_name}
              onChange={(e) => {
                // Use same Allergy Name field, with conditional label for both flows. Optional only for newer flow
                dispatch({
                  type: 'SET_CUSTOM_ALLERGY_NAME',
                  customAllergyName: e.target.value,
                });
                dispatch({
                  type: 'SET_ALLERGY_NAME',
                  allergyName: e.target.value,
                });
              }}
              invalid={
                isValidationCheckAllowed &&
                !formState.allergy_name &&
                selectedAllergyType === 10
              }
              optional={
                selectedAllergyType !== 10 // check if allergy is optional
              }
            />
          </div>

          {permissions.medical.allergies.canCreate && (
            <div
              css={style.extraDateOption}
              data-testid="AddAllergySidePanel|OptionalDate"
            >
              <>
                {!showDate && (
                  <TooltipMenu
                    tooltipTriggerElement={
                      <TextButton
                        text={props.t('Add more detail')}
                        type="secondary"
                        iconAfter="icon-chevron-down"
                        kitmanDesignSystem
                      />
                    }
                    menuItems={[
                      {
                        description: props.t('Diagnosed on'),
                        onClick: () => setShowDate(!showDate),
                      },
                    ]}
                    placement="bottom-start"
                    appendToParent
                    kitmanDesignSystem
                    disabled={requestStatus === 'PENDING'}
                  />
                )}
                {showDate && (
                  <>
                    <div css={style.dateHeading}>
                      <h4 css={[style.heading, style.noBorder]}>
                        {props.t('Diagnosed on')}
                      </h4>
                      <TextButton
                        onClick={() => {
                          setShowDate(!showDate);
                          dispatch({
                            type: 'SET_ALLERGY_DATE',
                            allergyDate: '',
                          });
                        }}
                        iconBefore="icon-bin"
                        type="subtle"
                        kitmanDesignSystem
                      />
                    </div>
                    <div css={style.datePicker}>
                      <DatePicker
                        label={props.t('Date')}
                        onDateChange={(date) => {
                          dispatch({
                            type: 'SET_ALLERGY_DATE',
                            allergyDate: moment(date).format(),
                          });
                        }}
                        value={
                          formState.allergy_date
                            ? moment(formState.allergy_date)
                            : null
                        }
                        maxDate={moment()}
                        disabled={requestStatus === 'PENDING'}
                        optional
                        kitmanDesignSystem
                      />
                    </div>
                  </>
                )}
              </>
            </div>
          )}
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={
              permissions.medical.allergies.canCreate
                ? onSaveAllergyMedication
                : onSave
            }
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
        {didAnyRequestFail && <AppStatus status="error" />}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddAllergySidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddAllergySidePanel);
export default AddAllergySidePanel;
