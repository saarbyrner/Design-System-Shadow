import moment from 'moment-timezone';
import {
  countries,
  timezones,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import processForm from '../kingDevickAndNpcProcessor';
import kingDevickMock, {
  expectedFormInfoResult as kingDevickFormInfoResult,
} from './mocks/kingDevickMock';
import npcMock, {
  expectedFormInfoResult as npcFormInfoResult,
} from './mocks/npcMock';

describe('kingDevickAndNpcProcessor', () => {
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

  it('correctly processes a King-Devick form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      kingDevickMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(kingDevickFormInfoResult);

    expect(formattedFormResults).toHaveLength(1);
    const mainSection = formattedFormResults[0];

    expect(mainSection.elementId).toEqual('section_main');
    expect(mainSection.sidePanelSection).toEqual(false);
    expect(mainSection.columns).toEqual(2);
    expect(mainSection.elements).toHaveLength(6);

    // Confirm questions parse out as expected

    expect(mainSection.elements[0].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[0].questionsAndAnswers[0]).toEqual({
      question: 'Date of examination:',
      answer: 'August 17, 2022',
      id: 'date_of_examination',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[1].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[1].questionsAndAnswers[0]).toEqual({
      answer: '1:00 PM',
      id: 'time_of_examination',
      question: 'Time of examination:',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[2].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[2].questionsAndAnswers[0]).toEqual({
      answer: 'King Devick - Initial assessment',
      id: 'assessment_type',
      question: 'Assessment type:',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[3].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[3].questionsAndAnswers[0]).toEqual({
      answer: 'Diarmaid Brennan',
      id: 'examiner_name',
      question: 'Examiner:',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[4].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[4].questionsAndAnswers[0]).toEqual({
      answer: '6',
      id: 'score',
      question: 'Score:',
      type: 'questionAndAnswer',
    });
  });

  it('correctly processes an NPC form', () => {
    const { formattedFormResults, formInfoResult } = processForm(npcMock, {
      countries,
      timezones,
      injuries: [],
    });

    expect(formInfoResult).toEqual(npcFormInfoResult);

    expect(formattedFormResults).toHaveLength(1);
    const mainSection = formattedFormResults[0];

    expect(mainSection.elementId).toEqual('section_main');
    expect(mainSection.sidePanelSection).toEqual(false);
    expect(mainSection.columns).toEqual(2);
    expect(mainSection.elements).toHaveLength(7);

    expect(mainSection.elements[0].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[0].questionsAndAnswers[0]).toEqual({
      question: 'Date of examination:',
      answer: 'August 17, 2022',
      id: 'date_of_examination',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[1].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[1].questionsAndAnswers[0]).toEqual({
      question: 'Time of examination:',
      answer: '1:00 PM',
      id: 'time_of_examination',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[2].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[2].questionsAndAnswers[0]).toEqual({
      question: 'Assessment type:',
      answer: 'Near Point of Convergence - Initial assessment',
      id: 'assessment_type',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[3].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[3].questionsAndAnswers[0]).toEqual({
      question: 'Examiner:',
      answer: 'Diarmaid Brennan',
      id: 'examiner_name',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[4].questionsAndAnswers).toHaveLength(3);
    expect(mainSection.elements[4].questionsAndAnswers[0]).toEqual({
      question: 'Distance 1:',
      answer: '2',
      id: 'distance1',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[4].questionsAndAnswers[1]).toEqual({
      question: 'Distance 2:',
      answer: '3',
      id: 'distance2',
      type: 'questionAndAnswer',
    });
    expect(mainSection.elements[4].questionsAndAnswers[2]).toEqual({
      question: 'Distance 3:',
      answer: '6',
      id: 'distance3',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[5].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[5].questionsAndAnswers[0]).toEqual({
      question: 'Average:',
      answer: '3',
      id: 'average',
      type: 'questionAndAnswer',
    });

    expect(mainSection.elements[6].questionsAndAnswers).toHaveLength(1);
    expect(mainSection.elements[6].questionsAndAnswers[0].attachment).toEqual({
      id: 100,
      url: '',
      filename: '',
      filetype: '',
      filesize: 12345,
      created: '2024-08-20T20:45:21Z',
      created_by: {
        id: 155134,
        firstname: 'Cathal',
        lastname: 'Diver',
        fullname: 'Cathal Diver',
      },
      attachment_date: '2024-08-20T20:45:21Z',
    });
  });
});
