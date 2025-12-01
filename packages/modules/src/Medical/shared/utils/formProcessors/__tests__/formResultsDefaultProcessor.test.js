import moment from 'moment-timezone';
import {
  countries,
  timezones,
  medicalDocumentCategories,
  shoesV2,
  gameEvents,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import careDemographicMock, {
  expectedFormInfoResult as careInfoResult,
  expectedFormattedResults as careFormResults,
} from './mocks/careDemographicMock';
import concussionHistoryMock, {
  expectedFormInfoResult as historyInfoResult,
  expectedFormattedResults as historyFormResults,
} from './mocks/concussionHistoryMock';
import concussionIncidentMock, {
  expectedFormInfoResult as incidentInfoResult,
  expectedFormattedResults as incidentFormResults,
} from './mocks/concussionIncidentMock';
import concussionRtpMock, {
  expectedFormInfoResult as rtpInfoResult,
  expectedFormattedResults as rtpFormResults,
} from './mocks/concussionRtpMock';
import {
  rangeColorMock,
  expectedFormattedResults as rangeColorFormResults,
} from './mocks/rangeColorMock';
import generalMedicalMock, {
  expectedFormInfoResult as generalMedicalInfoResult,
  expectedFormattedResults as generalMedicalResults,
} from './mocks/generalMedicalMock';
import prophylacticAnkleSupportV3Mock, {
  expectedFormInfoResult as prophylacticAnkleSupportV3InfoResult,
  expectedFormattedResults as prophylacticAnkleSupportV3Results,
} from './mocks/prophylacticAnkleSupportV3.mock';
import processForm, {
  isConditionMet,
  formatAnswer,
  formatQuestion,
  recursiveFindDataSource,
  recursiveFindDataSourceLabel,
} from '../formResultsDefaultProcessor';

describe('formResultsDefaultProcessor', () => {
  let locale;
  beforeEach(() => {
    locale = moment.locale();
    moment.locale('en');
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.locale(locale);
    moment.tz.setDefault();
  });

  it('correctly processes a general medical form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      generalMedicalMock,
      {
        countries,
        timezones,
        injuries: [],
        medical_document_categories: medicalDocumentCategories,
      }
    );

    expect(formInfoResult).toEqual(generalMedicalInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(1);
    expect(formattedFormResults).toEqual(generalMedicalResults);
  });

  it('correctly processes a care demographic form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      careDemographicMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(careInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(5);
    expect(formattedFormResults).toEqual(careFormResults);
  });

  it('correctly processes a concussion history form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      concussionHistoryMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(historyInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(3);
    expect(formattedFormResults).toEqual(historyFormResults);
  });

  it('correctly processes a concussion incident form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      concussionIncidentMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(incidentInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(4);
    expect(formattedFormResults).toEqual(incidentFormResults);
  });

  it('correctly processes a concussion RTP form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      concussionRtpMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(rtpInfoResult);
    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(6);
    expect(formattedFormResults).toEqual(rtpFormResults);
  });

  it('correctly processes a prophylactic Ankle Support V3 form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      prophylacticAnkleSupportV3Mock,
      {
        game_events: gameEvents,
        footwear_v2s: shoesV2,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(prophylacticAnkleSupportV3InfoResult);

    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(1);
    expect(formattedFormResults).toEqual(prophylacticAnkleSupportV3Results);
  });

  it('correctly formats a question', () => {
    expect(formatQuestion('My Question?')).toEqual('My Question?');
    expect(formatQuestion('My Question')).toEqual('My Question:');

    // IF question mark at the end colon not added
    expect(formatQuestion('I have a Question?', false)).toEqual(
      'I have a Question?'
    );
    // IF include colon is false then colon not added
    expect(formatQuestion('I have a Question', false)).toEqual(
      'I have a Question'
    );
  });

  it('correctly checks answer meets == condition with true boolean', () => {
    const answers = {
      psychiatric_issues: { value: true },
    };

    const element = {
      id: 240,
      element_type: 'Forms::Elements::Inputs::MultipleChoice',
      config: {
        items: [
          {
            value: 'alcohol_abuse',
            label: 'Alcohol abuse',
          },
          {
            value: 'anxiety_disorder',
            label: 'Anxiety disorder',
          },
          {
            value: 'drug_abuse',
            label: 'Drug abuse',
          },
          {
            value: 'mood_disorder',
            label: 'Mood disorder',
          },
          {
            value: 'other',
            label: 'Other',
          },
          {
            value: 'ptsd',
            label: 'PTSD',
          },
          {
            value: 'personality_disorder',
            label: 'Personality disorder',
          },
          {
            value: 'psychotic_disorder',
            label: 'Psychotic disorder',
          },
          {
            value: 'somatoform_disorder',
            label: 'Somatoform disorder',
          },
        ],
        text: 'Post-injury Psychiatric Type',
        element_id: 'post_injury_psychiatric_type',
        condition: {
          element_id: 'psychiatric_issues',
          type: '==',
          value_type: 'boolean',
          value: true,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer meets == condition with expected false boolean', () => {
    const answers = {
      psychiatric_issues: { value: false },
    };

    const element = {
      id: 240,
      element_type: 'Forms::Elements::Inputs::MultipleChoice',
      config: {
        items: [
          {
            value: 'alcohol_abuse',
            label: 'Alcohol abuse',
          },
          {
            value: 'anxiety_disorder',
            label: 'Anxiety disorder',
          },
          {
            value: 'drug_abuse',
            label: 'Drug abuse',
          },
          {
            value: 'mood_disorder',
            label: 'Mood disorder',
          },
          {
            value: 'other',
            label: 'Other',
          },
          {
            value: 'ptsd',
            label: 'PTSD',
          },
          {
            value: 'personality_disorder',
            label: 'Personality disorder',
          },
          {
            value: 'psychotic_disorder',
            label: 'Psychotic disorder',
          },
          {
            value: 'somatoform_disorder',
            label: 'Somatoform disorder',
          },
        ],
        text: 'Post-injury Psychiatric Type',
        element_id: 'post_injury_psychiatric_type',
        condition: {
          element_id: 'psychiatric_issues',
          type: '==',
          value_type: 'boolean',
          value: false,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer does not meet == condition with false boolean', () => {
    const answers = {
      psychiatric_issues: { value: false },
    };

    const element = {
      id: 240,
      element_type: 'Forms::Elements::Inputs::MultipleChoice',
      config: {
        items: [
          {
            value: 'alcohol_abuse',
            label: 'Alcohol abuse',
          },
          {
            value: 'anxiety_disorder',
            label: 'Anxiety disorder',
          },
          {
            value: 'drug_abuse',
            label: 'Drug abuse',
          },
          {
            value: 'mood_disorder',
            label: 'Mood disorder',
          },
          {
            value: 'other',
            label: 'Other',
          },
          {
            value: 'ptsd',
            label: 'PTSD',
          },
          {
            value: 'personality_disorder',
            label: 'Personality disorder',
          },
          {
            value: 'psychotic_disorder',
            label: 'Psychotic disorder',
          },
          {
            value: 'somatoform_disorder',
            label: 'Somatoform disorder',
          },
        ],
        text: 'Post-injury Psychiatric Type',
        element_id: 'post_injury_psychiatric_type',
        condition: {
          element_id: 'psychiatric_issues',
          type: '==',
          value_type: 'boolean',
          value: true,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks answer meets == condition with matching string', () => {
    const answers = {
      reason: { value: 'other' },
    };

    const element = {
      id: 229,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Other',
        data_point: false,
        element_id: 'reason_other',
        condition: {
          element_id: 'reason',
          type: '==',
          value_type: 'string',
          value: 'other',
        },
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-07-21T13:56:29Z',
      updated_at: '2022-07-21T13:56:29Z',
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer does not meet == condition with non matching string', () => {
    const answers = {
      reason: { value: 'no match' },
    };

    const element = {
      id: 229,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Other',
        data_point: false,
        element_id: 'reason_other',
        condition: {
          element_id: 'reason',
          type: '==',
          value_type: 'string',
          value: 'other',
        },
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-07-21T13:56:29Z',
      updated_at: '2022-07-21T13:56:29Z',
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks answer meets == condition with number', () => {
    const answers = {
      test: { value: 100 },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: '==',
          value_type: 'number',
          value: 100,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer does not meets == condition with number', () => {
    const answers = {
      test: { value: 40 },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: '==',
          value_type: 'number',
          value: 100,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks array answer meets == condition with matching string', () => {
    // We allow == compare to array answer from multiselect if there is only 1 entry and is equal
    const answers = {
      reason: { value: ['other'] },
    };

    const element = {
      id: 229,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Other',
        data_point: false,
        element_id: 'reason_other',
        condition: {
          element_id: 'reason',
          type: '==',
          value_type: 'string',
          value: 'other',
        },
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-07-21T13:56:29Z',
      updated_at: '2022-07-21T13:56:29Z',
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks array answer meets == condition with non matching string', () => {
    const answers = {
      reason: { value: ['other'] },
    };

    const element = {
      id: 229,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Other',
        data_point: false,
        element_id: 'reason_other',
        condition: {
          element_id: 'reason',
          type: '==',
          value_type: 'string',
          value: 'test',
        },
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-07-21T13:56:29Z',
      updated_at: '2022-07-21T13:56:29Z',
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks answer meets != condition with non matching string', () => {
    const answers = {
      shoe_brand: { value: 'adidas' },
    };

    const element = {
      id: 229,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        text: 'other',
        data_point: false,
        element_id: 'reason_other',
        condition: {
          element_id: 'shoe_brand',
          type: '!=',
          value_type: 'string',
          value: 'other',
        },
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-07-21T13:56:29Z',
      updated_at: '2022-07-21T13:56:29Z',
      form_elements: [],
    };

    // adidas != other
    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer does not meet != condition with matching string', () => {
    const answers = {
      shoe_brand: { value: 'other' },
    };

    const element = {
      id: 229,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        text: 'other',
        data_point: false,
        element_id: 'reason_other',
        condition: {
          element_id: 'shoe_brand',
          type: '!=',
          value_type: 'string',
          value: 'other',
        },
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-07-21T13:56:29Z',
      updated_at: '2022-07-21T13:56:29Z',
      form_elements: [],
    };

    // other != other
    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks answer meets < condition with number', () => {
    const answers = {
      test: { value: 99 },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: '<',
          value_type: 'number',
          value: 100,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer meets <= condition with number', () => {
    const answers = {
      test: { value: 99 },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: '<=',
          value_type: 'number',
          value: 100,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer meets > condition with number', () => {
    const answers = {
      test: { value: 101 },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: '>',
          value_type: 'number',
          value: 100,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer meets >= condition with number', () => {
    const answers = {
      test: { value: 101 },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: '>=',
          value_type: 'number',
          value: 100,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer meets is_answered condition type', () => {
    const answers = {
      test: { value: 'hello' },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: 'is_answered',
          value_type: 'boolean',
          value: true,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks a null answer does not meet is_answered condition type', () => {
    const answers = {
      test: { value: null },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: 'is_answered',
          value_type: 'boolean',
          value: true,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks an empty answer does not meet is_answered condition type', () => {
    const answers = {
      test: { value: '' },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: 'is_answered',
          value_type: 'boolean',
          value: true,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks answer does not meet is_answered condition type', () => {
    const answers = {
      test: { value: 'hello' },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Text',
      config: {
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: 'is_answered',
          value_type: 'boolean',
          value: false,
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly checks answer meets in condition type', () => {
    const answers = {
      test: { value: ['allowed', 'values', 'test'] },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: 'in',
          value_type: 'string',
          value: 'test',
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(true);
  });

  it('correctly checks answer does not meet in condition type', () => {
    const answers = {
      test: { value: ['allowed', 'values'] },
    };

    const element = {
      id: 249,
      element_type: 'Forms::Elements::Inputs::Number',
      config: {
        type: 'integer',
        text: 'Days before return to normal academic performance',
        element_id: 'test',
        condition: {
          element_id: 'test',
          type: 'in',
          value_type: 'string',
          value: 'test',
        },
        optional: true,
      },
      visible: true,
      form_elements: [],
    };

    expect(isConditionMet(element, answers)).toEqual(false);
  });

  it('correctly formats a DateTime date answer', () => {
    const answer = { value: '2022-08-16T13:47:10Z', items: null };
    const answerType = 'Forms::Elements::Inputs::DateTime';

    const config = {
      type: 'date',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual('Aug 16, 2022');
  });

  it('correctly formats a DateTime time answer', () => {
    const answer = { value: '2022-08-16T13:47:10Z', items: null };
    const answerType = 'Forms::Elements::Inputs::DateTime';

    const config = {
      type: 'time',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual('1:47 PM');
  });

  it('correctly formats a true Boolean answer', () => {
    const answer = { value: true, items: null };
    const answerType = 'Forms::Elements::Inputs::Boolean';

    const config = {
      type: 'time',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual('Yes');
  });

  it('correctly formats a false Boolean answer', () => {
    const answer = { value: false, items: null };
    const answerType = 'Forms::Elements::Inputs::Boolean';
    const config = {};

    expect(formatAnswer(answer, answerType, config)).toEqual('No');
  });

  it('correctly formats am integer number answer', () => {
    const answer = { value: 100, items: null };
    const answerType = 'Forms::Elements::Inputs::Number';
    const config = {
      type: 'integer',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual('100');
  });

  it('correctly formats a floating number answer', () => {
    const answer = { value: 100.1234, items: null };
    const answerType = 'Forms::Elements::Inputs::Number';
    const config = {
      type: 'decimal',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual('100.123');
  });

  it('correctly formats a multiple choice answer', () => {
    const answer = {
      value: [1, 2],
      items: [
        { value: 1, label: 'one' },
        { value: 2, label: 'two' },
        { value: 3, label: 'three' },
      ],
    };
    const answerType = 'Forms::Elements::Inputs::MultipleChoice';
    const config = {};

    expect(formatAnswer(answer, answerType, config)).toEqual('one, two');
  });

  it('correctly formats a single choice answer', () => {
    const answer = {
      value: 3,
      items: [
        { value: 2, label: 'one' },
        { value: 2, label: 'two' },
        { value: 3, label: 'three' },
      ],
    };
    const answerType = 'Forms::Elements::Inputs::SingleChoice';
    const config = {};

    expect(formatAnswer(answer, answerType, config)).toEqual('three');
  });

  it('correctly formats a content element', () => {
    const answer = { value: null, items: null };
    const answerType = 'Forms::Elements::Layouts::Content';
    const config = {
      text: 'Hello world',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual(null);
  });

  it('correctly formats a Kt1000 answer', () => {
    const answer = {
      value: {
        displacement: 7.4,
        force: 23,
      },
      items: null,
    };
    const answerType = 'Forms::Elements::Customs::Kt1000';

    const config = {
      text: 'KT-1000',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual(
      'Displacement: 7.4, Force: 23'
    );
  });

  it('correctly formats a BloodPressure answer', () => {
    const answer = {
      value: {
        systolic: 120,
        diastolic: 80,
      },
      items: null,
    };
    const answerType = 'Forms::Elements::Customs::BloodPressure';

    const config = {
      text: 'Blood Pressure',
    };

    expect(formatAnswer(answer, answerType, config)).toEqual(
      'Systolic: 120, Diastolic: 80'
    );
  });

  it('correctly processes a form with range color elements', () => {
    const { formattedFormResults } = processForm(rangeColorMock, {
      countries,
      timezones,
      injuries: [],
    });

    // Test we have expected sections.
    expect(formattedFormResults.length).toEqual(1);
    expect(formattedFormResults).toEqual(rangeColorFormResults);
  });

  it('correctly finds a data source in 2 layers of dependency', () => {
    const answerChain = ['signature']; // shoe_model_type
    const formAnswers = {
      shoe_brand: {
        value: 'adidas',
        items: [],
        dataSource: 'rootDataSource',
        dataDependsOn: null,
      },
      shoe_model: {
        value: 'byw_select',
        items: [],
        dataDependsOn: 'shoe_brand',
      },
      shoe_model_type: {
        value: 'signature',
        items: [],
        dataDependsOn: 'shoe_model',
      },
    };

    const { rootDataSource, answerChain: answerChainUpdated } =
      recursiveFindDataSource('shoe_model', formAnswers, answerChain);
    expect(answerChainUpdated).toEqual(['signature', 'byw_select', 'adidas']);
    expect(rootDataSource).toEqual('rootDataSource');
  });

  it('correctly finds a data source label', () => {
    const answerChain = ['signature', 'byw_select', 'adidas'];
    const result = recursiveFindDataSourceLabel(answerChain, shoesV2);
    expect(result).toEqual('Player Signature Shoe');
  });

  it('correctly finds another data source label', () => {
    const answerChain = ['dame_8_custom', 'dame_8', 'adidas'];
    const result = recursiveFindDataSourceLabel(answerChain, shoesV2);
    expect(result).toEqual('Custom Model');
  });
});
