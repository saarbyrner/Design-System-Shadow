import moment from 'moment-timezone';
import {
  countries,
  timezones,
  medicalDocumentCategories,
  shoes,
  shoesV2,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import { processElement } from '../formResultsDefaultProcessor';

describe('formDataSources', () => {
  const dataSources = {
    countries,
    timezones,
    injuries: [],
    footwares: shoes,
    footwear_v2s: shoesV2,
    medical_document_categories: medicalDocumentCategories,
  };

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

  it('correctly processes an Element that needs medical_document_categories data source', () => {
    const element = {
      id: 1822,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        data_source: 'medical_document_categories',
        text: 'Categories',
        data_point: false,
        element_id: 'document_categories',
        optional: false,
      },
      visible: true,
      order: 6,
      created_at: '2022-09-21T18:23:19Z',
      updated_at: '2022-09-21T18:23:19Z',
      form_elements: [],
    };
    const section = { elements: [] };
    const group = { questionsAndAnswers: [] };
    const formAnswers = { document_categories: { value: '13', items: [] } };

    processElement(
      element,
      section,
      group,
      formAnswers,
      dataSources,
      null,
      null
    );

    const expectedResult = {
      answer: 'Insurance Docs',
      id: 'document_categories',
      question: 'Categories:',
      type: 'questionAndAnswer',
    };
    expect(group.questionsAndAnswers).toEqual([expectedResult]);
  });

  it('correctly processes an multi choice that needs medical_document_categories data source', () => {
    const element = {
      id: 1822,
      element_type: 'Forms::Elements::Inputs::MultipleChoice',
      config: {
        data_source: 'medical_document_categories',
        text: 'Categories',
        data_point: false,
        element_id: 'document_categories',
        optional: false,
      },
      visible: true,
      order: 6,
      created_at: '2022-09-21T18:23:19Z',
      updated_at: '2022-09-21T18:23:19Z',
      form_elements: [],
    };
    const section = { elements: [] };
    const group = { questionsAndAnswers: [] };
    const formAnswers = {
      document_categories: { value: [13, 19], items: [] },
    };

    processElement(
      element,
      section,
      group,
      formAnswers,
      dataSources,
      null,
      null
    );

    const expectedResult = {
      answer: 'Insurance Docs, Consultant Note',
      id: 'document_categories',
      question: 'Categories:',
      type: 'questionAndAnswer',
    };
    expect(group.questionsAndAnswers).toEqual([expectedResult]);
  });

  it('correctly processes an Element that needs footwares data source', () => {
    const element = {
      id: 1822,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        data_source: 'footwares',
        text: 'What shoe do you ware',
        data_point: false,
        element_id: 'shoe',
        custom_params: {
          style: 'searchbar',
        },
        optional: false,
      },
      visible: true,
      order: 6,
      created_at: '2022-09-21T18:23:19Z',
      updated_at: '2022-09-21T18:23:19Z',
      form_elements: [],
    };
    const section = { elements: [] };
    const group = { questionsAndAnswers: [] };
    const formAnswers = { shoe: { value: 2, items: [] } };

    processElement(
      element,
      section,
      group,
      formAnswers,
      dataSources,
      null,
      null
    );

    const expectedResult = {
      answer: 'Nike Shoe',
      id: 'shoe',
      question: 'What shoe do you ware:',
      type: 'questionAndAnswer',
    };
    expect(group.questionsAndAnswers).toEqual([expectedResult]);
  });

  it('correctly processes an Element that needs timezones data source', () => {
    const element = {
      id: 468,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        data_source: 'timezones',
        text: 'Time zone',
        data_point: false,
        element_id: 'timezone_of_injury',
        optional: true,
      },
      visible: true,
      order: 3,
      created_at: '2022-08-09T12:39:28Z',
      updated_at: '2022-08-09T12:39:28Z',
      form_elements: [],
    };
    const section = { elements: [] };
    const group = { questionsAndAnswers: [] };
    const formAnswers = {
      timezone_of_injury: { value: 'Africa/Abidjan', items: [] },
    };

    processElement(
      element,
      section,
      group,
      formAnswers,
      dataSources,
      null,
      null
    );

    const expectedResult = {
      answer: 'Africa/Abidjan',
      id: 'timezone_of_injury',
      question: 'Time zone:',
      type: 'questionAndAnswer',
    };
    expect(group.questionsAndAnswers).toEqual([expectedResult]);
  });

  it('correctly processes an Element that needs countries data source', () => {
    const element = {
      id: 1822,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        data_source: 'countries',
        text: 'Country of birth',
        data_point: false,
        element_id: 'country',
        custom_params: {
          style: 'searchbar',
        },
        optional: false,
      },
      visible: true,
      order: 6,
      created_at: '2022-09-21T18:23:19Z',
      updated_at: '2022-09-21T18:23:19Z',
      form_elements: [],
    };
    const section = { elements: [] };
    const group = { questionsAndAnswers: [] };
    const formAnswers = { country: { value: 'united_kingdom', items: [] } };

    processElement(
      element,
      section,
      group,
      formAnswers,
      dataSources,
      null,
      null
    );

    const expectedResult = {
      answer: 'United Kingdom',
      id: 'country',
      question: 'Country of birth:',
      type: 'questionAndAnswer',
    };
    expect(group.questionsAndAnswers).toEqual([expectedResult]);
  });

  it('correctly processes an Element that has dependency on a prior data source', () => {
    const element = {
      id: 24091,
      element_type: 'Forms::Elements::Inputs::SingleChoice',
      config: {
        items: [],
        data_depends_on: 'shoe_brand',
        text: 'Shoe Model Selection',
        data_point: false,
        skip_backend_validation: true,
        element_id: 'shoe_model',
        custom_params: {
          style: 'searchbar',
          data_depends_on: 'shoe_brand',
        },
        repeatable: false,
        optional: false,
      },
      visible: true,
      order: 6,
      form_elements: [],
    };

    const section = { elements: [] };
    const group = { questionsAndAnswers: [] };
    const formAnswers = {
      shoe_model: {
        value: 'byw_select',
        items: [],
      },
      shoe_brand: {
        value: 'adidas',
        items: [],
        dataSource: 'footwear_v2s',
      },
    };

    processElement(
      element,
      section,
      group,
      formAnswers,
      dataSources,
      null,
      null
    );

    const expectedResult = {
      answer: 'Byw select',
      id: 'shoe_model',
      question: 'Shoe Model Selection:',
      type: 'questionAndAnswer',
    };
    expect(group.questionsAndAnswers).toEqual([expectedResult]);
  });
});
