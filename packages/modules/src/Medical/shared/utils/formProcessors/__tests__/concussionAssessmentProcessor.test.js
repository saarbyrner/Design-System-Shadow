import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  countries,
  timezones,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import processForm from '../concussionAssessmentProcessor';
import concussionAssessmentMock, {
  expectedFormInfoResult,
  expectedFormattedResults,
} from './mocks/concussionAssessmentMock';

describe('concussionAssessmentProcessor', () => {
  i18nextTranslateStub();
  window.featureFlags = {};

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

  describe('when the concussion-web-show-sac flag is off', () => {
    beforeEach(() => {
      window.featureFlags['concussion-web-show-sac'] = false;
    });

    it('correctly processes a Concussion Assessment form', () => {
      const { formattedFormResults, formInfoResult } = processForm(
        concussionAssessmentMock,
        {
          countries,
          timezones,
          injuries: [],
        }
      );

      expect(formInfoResult).toEqual(expectedFormInfoResult);

      // Test we have expected sections.
      expect(formattedFormResults).toHaveLength(8);
      expect(formattedFormResults).toEqual(expectedFormattedResults);
    });
  });

  describe('when the concussion-web-show-sac flag is on', () => {
    beforeEach(() => {
      window.featureFlags['concussion-web-show-sac'] = true;
    });

    afterEach(() => {
      window.featureFlags['concussion-web-show-sac'] = false;
    });

    it('correctly processes a Concussion Assessment form', () => {
      const { formattedFormResults } = processForm(concussionAssessmentMock, {
        countries,
        timezones,
        injuries: [],
      });
      // Test we have expected sections.
      const sacSection = {
        title: 'Standardized Assessment of Concussion (SAC)',
        elements: [
          {
            questionsAndAnswers: [
              {
                question: 'Score:',
                answer: '38 of 50',
                id: 'sac_score',
                type: 'questionAndAnswer',
              },
            ],
            id: 0,
            isConditional: false,
            isGroupInData: false,
            type: 'group',
          },
        ],
        id: 1,
        elementId: 'sac_section',
        sidePanelSection: false,
      };
      expect(formattedFormResults).toHaveLength(9);
      expect(formattedFormResults[1]).toEqual(sacSection);
    });
  });
});
