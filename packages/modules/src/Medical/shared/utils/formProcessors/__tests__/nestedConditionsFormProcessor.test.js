import moment from 'moment-timezone';
import {
  countries,
  timezones,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import processForm, { isConditionMet } from '../formResultsDefaultProcessor';

import prophylacticAnkleSupportMock, {
  expectedFormInfoResult as prophylacticAnkleSupportInfoResult,
  expectedFormattedResults as prophylacticAnkleSupportResults,
} from './mocks/prophylacticAnkleSupportMock';

describe('Default forms processor: Nested conditions', () => {
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

  it('correctly checks answer meets "and" type condition', () => {
    const testElement = {
      config: {
        condition: {
          type: 'and',
          conditions: [
            {
              element_id: 'Q1',
              type: '==',
              value_type: 'number',
              value: 100,
            },
            {
              element_id: 'Q2',
              type: '==',
              value_type: 'number',
              value: 50,
            },
          ],
        },
      },
    };

    const answers1 = {
      Q1: { value: 100 },
      Q2: { value: 50 },
    };
    // (100 == 100 && 50 == 50) expect true
    expect(isConditionMet(testElement, answers1)).toEqual(true);

    const answers2 = {
      Q1: { value: 100 },
      Q2: { value: 60 },
    };

    // (100 == 100 && 60 == 50) expect false
    expect(isConditionMet(testElement, answers2)).toEqual(false);
  });

  it('correctly checks answer meets "or" type condition', () => {
    const testElement = {
      config: {
        condition: {
          type: 'or',
          conditions: [
            {
              element_id: 'Q1',
              type: '==',
              value_type: 'number',
              value: 100,
            },
            {
              element_id: 'Q2',
              type: '==',
              value_type: 'number',
              value: 50,
            },
          ],
        },
      },
    };

    const answers1 = {
      Q1: { value: 100 },
      Q2: { value: 50 },
    };
    // (100 == 100 || 50 == 50) expect true
    expect(isConditionMet(testElement, answers1)).toEqual(true);

    const answers2 = {
      Q1: { value: 100 },
      Q2: { value: 60 },
    };

    // (100 == 100 || 60 == 50) expect true
    expect(isConditionMet(testElement, answers2)).toEqual(true);

    const answers3 = {
      Q1: { value: 99 },
      Q2: { value: 60 },
    };

    // (99 == 100 || 60 == 50) expect false
    expect(isConditionMet(testElement, answers3)).toEqual(false);
  });

  it('correctly checks answer meets "and" with nested "or" type condition', () => {
    const testElement = {
      config: {
        condition: {
          type: 'and',
          conditions: [
            {
              element_id: 'Q1',
              type: '==',
              value_type: 'number',
              value: 100,
            },
            {
              type: 'or',
              conditions: [
                {
                  element_id: 'Q2',
                  type: '==',
                  value_type: 'number',
                  value: 50,
                },
                {
                  element_id: 'Q2',
                  type: '==',
                  value_type: 'number',
                  value: 60,
                },
              ],
            },
          ],
        },
      },
    };

    const answers1 = {
      Q1: { value: 100 },
      Q2: { value: 50 },
    };
    // (100 == 100 && ( 50 == 50 || 50 == 60 ))  expect true
    expect(isConditionMet(testElement, answers1)).toEqual(true);

    const answers2 = {
      Q1: { value: 99 },
      Q2: { value: 50 },
    };

    // (99 == 100 && ( 50 == 50  || 50 == 60))  expect false
    expect(isConditionMet(testElement, answers2)).toEqual(false);

    const answers3 = {
      Q1: { value: 100 },
      Q2: { value: 60 },
    };

    // (100 == 100 && ( 50 == 50  || 60 = 60))  expect true
    expect(isConditionMet(testElement, answers3)).toEqual(true);
  });

  it('correctly processes a form with nested conditions', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      prophylacticAnkleSupportMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(prophylacticAnkleSupportInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(1);
    expect(formattedFormResults).toEqual(prophylacticAnkleSupportResults);
  });
});
