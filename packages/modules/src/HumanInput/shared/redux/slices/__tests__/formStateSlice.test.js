import { data } from '@kitman/modules/src/Scouts/shared/redux/services/mocks/data/mock_form_structure';
import mockHumanInputForm from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/data/fetchStaffProfile';
import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import formStateSlice, {
  onBuildFormState,
  onUpdateField,
  onResetForm,
  onSetFormAnswersSet,
  onUpdateFormStructure,
  onUpdateShouldShowMenu,
} from '../formStateSlice';

const SUBSET =
  data[61].form_template_version.form_elements[0].form_elements[0].form_elements.slice(
    0,
    1
  );

const PL_FORM_ANSWERS_SUBSET = humanInputFormMockData.form_answers;
const PL_FORM_ELEMENTS =
  humanInputFormMockData.form_template_version.form_elements;

const initialState = {
  form: {},
  structure: {},
  config: {
    shouldShowMenu: true,
  },
};

describe('[formStateSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formStateSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  describe('build state', () => {
    let action;
    beforeEach(() => {
      action = onBuildFormState({
        elements: SUBSET,
      });
    });
    it('should correctly build the form state', () => {
      const updatedState = formStateSlice.reducer(initialState, action);
      const expectedState = {
        2692: '',
        2693: '',
        2694: '',
        2696: null,
        2697: null,
        2698: '',
        2699: '',
        2700: '',
        2701: '',
        2702: null,
        2703: '',
        2704: null,
        2706: '',
        2707: '',
        2708: '',
        2709: '',
        2711: '',
        2712: '',
        2713: '',
        2714: '',
        2715: '',
        2716: '',
        2717: '',
        2719: null,
        2721: '',
        2722: '',
        2723: '',
        2724: '',
      };
      expect(updatedState.form).toEqual(expectedState);
    });
    it('should correctly build the element state', () => {
      const updatedState = formStateSlice.reducer(initialState, action);
      const expectedState = {
        insurance_carrier: {
          config: {
            data_point: false,
            element_id: 'insurance_carrier',
            optional: true,
            optional_condition: {
              element_id: 'insurance_has_insurance',
              type: '==',
              value: true,
              value_type: 'boolean',
            },
            text: 'Insurance Carrier',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2721,
          order: 1,
          visible: true,
        },
        insurance_group_no: {
          config: {
            data_point: false,
            element_id: 'insurance_group_no',
            optional: true,
            optional_condition: {
              element_id: 'insurance_has_insurance',
              type: '==',
              value: true,
              value_type: 'boolean',
            },
            text: 'Group Number',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2722,
          order: 2,
          visible: true,
        },
        insurance_has_insurance: {
          config: {
            data_point: false,
            default_value: false,
            element_id: 'insurance_has_insurance',
            optional: true,
            text: 'Do you have insurance?',
          },
          element_type: 'Forms::Elements::Inputs::Boolean',
          form_elements: [],
          id: 2719,
          order: 1,
          visible: true,
        },
        insurance_insurance_id: {
          config: {
            data_point: false,
            element_id: 'insurance_insurance_id',
            optional: true,
            optional_condition: {
              element_id: 'insurance_has_insurance',
              type: '==',
              value: true,
              value_type: 'boolean',
            },
            text: 'Insurance ID',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2724,
          order: 4,
          visible: true,
        },
        insurance_policy_no: {
          config: {
            data_point: false,
            element_id: 'insurance_policy_no',
            optional: true,
            optional_condition: {
              element_id: 'insurance_has_insurance',
              type: '==',
              value: true,
              value_type: 'boolean',
            },
            text: 'Policy Number',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2723,
          order: 3,
          visible: true,
        },
        parentguardian_address_0: {
          config: {
            data_point: false,
            element_id: 'parentguardian_address_0',
            optional: false,
            text: 'Parent/ Guardian Address',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2711,
          order: 1,
          visible: true,
        },
        parentguardian_address_1: {
          config: {
            data_point: false,
            element_id: 'parentguardian_address_1',
            optional: true,
            text: 'Address Continued',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2712,
          order: 2,
          visible: true,
        },
        parentguardian_city: {
          config: {
            custom_params: {
              columns: 1,
            },
            data_point: false,
            element_id: 'parentguardian_city',
            optional: false,
            text: 'City',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2715,
          order: 5,
          visible: true,
        },
        parentguardian_country: {
          config: {
            custom_params: {
              columns: 1,
            },
            data_point: false,
            element_id: 'parentguardian_country',
            optional: false,
            text: 'Country',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2713,
          order: 3,
          visible: true,
        },
        parentguardian_country_code: {
          config: {
            custom_params: {
              columns: 1,
            },
            data_point: false,
            element_id: 'parentguardian_country_code',
            optional: false,
            text: 'Country Code',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2717,
          order: 6,
          visible: true,
        },
        parentguardian_email: {
          config: {
            custom_params: {
              type: 'email',
            },
            data_point: false,
            element_id: 'parentguardian_email',
            optional: false,
            text: 'Contact Email',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2708,
          order: 3,
          visible: true,
        },
        parentguardian_firstname: {
          config: {
            data_point: false,
            element_id: 'parentguardian_firstname',
            optional: false,
            text: 'First Name',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2706,
          order: 1,
          visible: true,
        },
        parentguardian_lastname: {
          config: {
            data_point: false,
            element_id: 'parentguardian_lastname',
            optional: false,
            text: 'Last Name',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2707,
          order: 2,
          visible: true,
        },
        parentguardian_phone: {
          config: {
            custom_params: {
              columns: 3,
              default_country_code: 'US',
              type: 'phone',
            },
            data_point: false,
            element_id: 'parentguardian_phone',
            optional: false,
            text: 'Phone',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2709,
          order: 4,
          visible: true,
        },
        parentguardian_state: {
          config: {
            custom_params: {
              columns: 3,
            },
            data_point: false,
            element_id: 'parentguardian_state',
            optional: false,
            text: 'State/ Province',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2714,
          order: 4,
          visible: true,
        },
        parentguardian_zipcode: {
          config: {
            custom_params: {
              columns: 3,
            },
            data_point: false,
            element_id: 'parentguardian_zipcode',
            optional: false,
            text: 'Postal Code',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2716,
          order: 6,
          visible: true,
        },
        playerdetails_academy_registration_date: {
          config: {
            data_point: false,
            element_id: 'playerdetails_academy_registration_date',
            optional: false,
            text: 'Initial registration date in the academy',
            type: 'date',
          },
          element_type: 'Forms::Elements::Inputs::DateTime',
          form_elements: [],
          id: 2702,
          order: 11,
          visible: true,
        },
        playerdetails_birthplace: {
          config: {
            custom_params: {
              columns: 2,
            },
            data_point: false,
            element_id: 'playerdetails_birthplace',
            optional: false,
            text: 'Place of birth',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2698,
          order: 7,
          visible: true,
        },
        playerdetails_country_code: {
          config: {
            custom_params: {
              columns: 1,
            },
            data_point: false,
            element_id: 'playerdetails_country_code',
            optional: false,
            text: 'Country Code',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2700,
          order: 9,
          visible: true,
        },
        playerdetails_dob: {
          config: {
            custom_params: {
              columns: 2,
            },
            data_point: false,
            element_id: 'playerdetails_dob',
            optional: false,
            text: 'DOB',
            type: 'date',
          },
          element_type: 'Forms::Elements::Inputs::DateTime',
          form_elements: [],
          id: 2696,
          order: 5,
          visible: true,
        },
        playerdetails_dob_confirmation: {
          config: {
            custom_params: {
              columns: 2,
            },
            data_point: false,
            element_id: 'playerdetails_dob_confirmation',
            optional: false,
            text: 'DOB Confirmation',
            type: 'date',
            validation: {
              element_id: 'playerdetails_dob',
              type: '==',
              value: true,
              value_type: 'boolean',
            },
          },
          element_type: 'Forms::Elements::Inputs::DateTime',
          form_elements: [],
          id: 2697,
          order: 6,
          visible: true,
        },
        playerdetails_email: {
          config: {
            custom_params: {
              type: 'email',
            },
            data_point: false,
            element_id: 'playerdetails_email',
            optional: false,
            text: 'Contact Email',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2699,
          order: 8,
          visible: true,
        },
        playerdetails_firstname: {
          config: {
            data_point: false,
            element_id: 'playerdetails_firstname',
            optional: false,
            text: 'First Name',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2692,
          order: 1,
          visible: true,
        },
        playerdetails_gender: {
          config: {
            custom_params: {
              columns: 2,
            },
            data_point: false,
            element_id: 'playerdetails_gender',
            items: [
              {
                label: 'Male',
                value: 'Male',
              },
              {
                label: 'Female',
                value: 'Female',
              },
              {
                label: 'Other',
                value: 'Other',
              },
            ],
            optional: false,
            text: 'Gender',
          },
          element_type: 'Forms::Elements::Inputs::SingleChoice',
          form_elements: [],
          id: 2699,
          order: 4,
          visible: true,
        },
        playerdetails_graduation_date: {
          config: {
            data_point: false,
            element_id: 'playerdetails_graduation_date',
            items: [
              {
                label: '2033',
                value: '2033',
              },
              {
                label: '2032',
                value: '2032',
              },
              {
                label: '2031',
                value: '2031',
              },
              {
                label: '2030',
                value: '2030',
              },
              {
                label: '2029',
                value: '2029',
              },
              {
                label: '2028',
                value: '2028',
              },
              {
                label: '2027',
                value: '2027',
              },
              {
                label: '2026',
                value: '2026',
              },
              {
                label: '2025',
                value: '2025',
              },
              {
                label: '2024',
                value: '2024',
              },
              {
                label: '2023',
                value: '2023',
              },
            ],
            optional: false,
            text: 'High school graduation date',
          },
          element_type: 'Forms::Elements::Inputs::SingleChoice',
          form_elements: [],
          id: 2703,
          order: 12,
          visible: true,
        },
        playerdetails_is_mls_next_pro: {
          config: {
            data_point: false,
            element_id: 'playerdetails_is_mls_next_pro',
            optional: false,
            text: 'Are you currently a registered MLS NEXT Pro player?',
          },
          element_type: 'Forms::Elements::Inputs::Boolean',
          form_elements: [],
          id: 2704,
          order: 13,
          visible: true,
        },
        playerdetails_lastname: {
          config: {
            data_point: false,
            element_id: 'playerdetails_lastname',
            optional: false,
            text: 'Last Name',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2694,
          order: 3,
          visible: true,
        },
        playerdetails_middlename: {
          config: {
            data_point: false,
            element_id: 'playerdetails_middlename',
            optional: true,
            text: 'Middle Name',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2693,
          order: 2,
          visible: true,
        },
        playerdetails_phone: {
          config: {
            custom_params: {
              columns: 3,
              default_country_code: 'US',
              type: 'phone',
            },
            data_point: false,
            element_id: 'playerdetails_phone',
            optional: false,
            text: 'Phone',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2701,
          order: 10,
          visible: true,
        },
      };
      expect(updatedState.elements).toEqual(expectedState);
    });
    it('should correctly update a form value', () => {
      const updateAction = onUpdateField({
        playerdetails_firstname: 'Ricky',
      });
      const updatedState = formStateSlice.reducer(initialState, updateAction);

      expect(updatedState.form.playerdetails_firstname).toEqual('Ricky');
    });
    it('should correctly reset the form state', () => {
      const resetAction = onResetForm();
      const resetState = formStateSlice.reducer(initialState, resetAction);

      expect(resetState.form).toEqual({});
      expect(resetState.elements).toEqual({});
    });
  });

  describe('onSetFormAnswersSet', () => {
    let buildAction;
    let setAnswersAction;

    beforeEach(() => {
      buildAction = onBuildFormState({
        elements: PL_FORM_ELEMENTS,
      });
      setAnswersAction = onSetFormAnswersSet({
        formAnswers: PL_FORM_ANSWERS_SUBSET,
      });
    });

    it('set form answers set preloaded to the state', () => {
      let updatedState;

      // build initial form state with default values
      updatedState = formStateSlice.reducer(initialState, buildAction);

      // update form state with form answers set from API response
      updatedState = formStateSlice.reducer(updatedState, setAnswersAction);

      expect(updatedState.form[24112]).toEqual(778530);
      expect(updatedState.form[24113]).toEqual('Tomas');
      expect(updatedState.form[24114]).toEqual('Albornoz');
      expect(updatedState.form[24115]).toEqual('2023-11-15');
      expect(updatedState.form[24116]).toEqual(3);
      expect(updatedState.form[24117]).toEqual('');
      expect(updatedState.form[24118]).toEqual([]);
    });
  });

  describe('onUpdateFormStructure', () => {
    it('should update the form structure properly', () => {
      const user = { fullname: 'Pika Chu', is_active: true };
      const action = onUpdateFormStructure({
        structure: { user },
      });
      const initialStateWithStructure = {
        ...initialState,
        structure: mockHumanInputForm,
      };
      const updatedState = {
        ...initialStateWithStructure,
        structure: { ...mockHumanInputForm, user },
      };
      expect(formStateSlice.reducer(initialStateWithStructure, action)).toEqual(
        updatedState
      );
    });
  });

  describe('config changes', () => {
    it('should update shouldShowMenu', () => {
      const shouldShowMenu = true;
      const action = onUpdateShouldShowMenu(shouldShowMenu);
      const updatedState = {
        ...initialState,
        config: { ...initialState.config, shouldShowMenu },
      };
      expect(formStateSlice.reducer(initialState, action)).toEqual(
        updatedState
      );
    });
  });
});
