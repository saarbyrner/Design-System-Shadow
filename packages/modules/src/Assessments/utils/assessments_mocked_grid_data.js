/* eslint-disable */

const getRandomId = () => Math.floor(Math.random() * 10000);
const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));
const getRandomIntFromInterval = (min, max) => {
  const formattedMin = Math.ceil(min);
  const formattedMax = Math.floor(max);
  return Math.floor(
    Math.random() * (formattedMax - formattedMin + 1) + formattedMin
  );
};

const NB_OF_ATHLETES = 25;
const ATHLETE_NAMES = [
  'John Doe',
  'Peter Grant',
  'Paul Smith',
  'Robert Nash',
  'Norman Peterson',
  'Robert Kent',
  'Peter Maccao',
  'John Deloi',
  'Frank Cosmin',
  'Kevin Roth',
  'Sean Steveson',
  'Nick Thomas',
  'William Brenson',
  'Ronald Wayne',
  'Johan Linner',
  'Alfred Johanson',
  'Dwayne Lester',
  'Phillip Carmello',
  'James Lawler',
  'David Stone',
  'Hugh Terrence',
  'Bob Klain',
  'Luke Towsend',
  'Harry North',
  'Ben Stewart',
];

const ATHLETE_COMMENTS = [
  '<p>A comment</p>',
  '<p>A comment with <strong>bold text</strong></p>',
  '<p>A comment with <u>text with underline</u></p>',
  '<p>A comment with <em>italic text</em></p>',
  '<p>A comment with <del>deleted text</del></p>',
  '<p>A comment with <del><em>deleted italic text</em></del></p>',
  '<p>A large comment with <em>italic text</em>, <strong>a bold text</strong>, <u>a text with underline</u> and a <del>deleted text</del> as well</p>',
  '<p>A comment with <del><em><strong>deleted italic bold text</strong></em></del></p>',
];

const METRICS = [
  { metricName: 'Body Weight', metricId: 'body_weight' },
  { metricName: 'Muscles', metricId: 'muscles' },
  { metricName: 'Bones', metricId: 'bones' },
  { metricName: 'Body Flexibility', metricId: 'body_flexibility' },
];

const athletes = [...Array(NB_OF_ATHLETES).keys()].map((_, index: number) => ({
  id: getRandomId(),
  fullname: ATHLETE_NAMES[index],
  avatar_url:
    'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?markalign=left,bottom&markpad=0&markfit=max&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P3R4dGNscj1mZmYmdHh0c2l6ZT0xNiZ0eHRzaGFkPTImYmc9OTUyNDJmMzgmdHh0Zm9udD1BdmVuaXIgTmV4dCBDb25kZW5zZWQgTWVkaXVtJnR4dGFsaWduPWNlbnRlciZ0eHRwYWQ9NSZ3PTM2JnR4dDY0PU56YzM&?ixlib=rails-3.1.0&auto=enhance&crop=faces&fit=crop&w=100&h=100',
  position_group: 'Back',
}));

/*
 * HEADER
 */

const getRandomHeader = () => ({
  id: getRandomId(),
  item_type: 'AssessmentHeader',
  item: {
    id: getRandomId(),
    name: `Section ${getRandomId()}`,
  },
  order: 0,
});

/*
 * METRIC
 */

const getRandomMetricAnswer = (athleteId) => ({
  id: getRandomId(),
  athlete_id: athleteId,
  value: getRandomIntFromInterval(1, 4),
  note: {
    content: ATHLETE_COMMENTS[getRandomInt(ATHLETE_COMMENTS.length)],
    edit_history: {
      date: '2020-11-12T09:00:44Z',
      user: {
        id: 422321,
        firstname: 'Ian',
        lastname: 'Surinam',
        fullname: 'Ian Surinam',
      },
    },
  },
  users: [],
  previous_answer: null,
  colour: null,
  edit_history: {
    date: '2020-11-12T09:00:44Z',
    user: {
      id: 422321,
      firstname: 'Ian',
      lastname: 'Surinam',
      fullname: 'Ian Surinam',
    },
  },
});

const getRandomMetric = () => {
  const { metricName, metricId } = METRICS[getRandomInt(METRICS.length)];

  return {
    id: getRandomId(),
    item_type: 'AssessmentMetric',
    item: {
      id: getRandomId(),
      training_variable: {
        id: 3443,
        name: metricName,
        description: null,
        perma_id: metricId,
        variable_type_id: 1,
        min: 1,
        max: 4,
        invert_scale: false,
      },
      answers: athletes.map((athlete) => getRandomMetricAnswer(athlete.id)),
    },
    order: 1,
  };
};

/*
 * STATUS
 */

const getRandomStatusNote = (athleteId) => ({
  id: getRandomId(),
  athlete_id: athleteId,
  note: null,
  users: [],
});

const getRandomStatus = () => ({
  id: getRandomId(),
  item_type: 'AssessmentStatus',
  item: {
    id: getRandomId(),
    source: 'catapult',
    variable: 'metabolic_power_band_3_total_duration',
    summary: 'min',
    period_scope: 'last_x_days',
    period_length: 2,
    notes: athletes.map((athlete) => getRandomStatusNote(athlete.id)),
  },
  order: 3,
});

/*
 * GET ASSESSMENT
 */

export default () => [
  {
    id: getRandomId(),
    assessment_template: null,
    assessment_group_date: '2020-10-16T12:12:17Z',
    event_type: null,
    event: null,
    name: 'Assessment 1',
    items: [getRandomMetric(), getRandomMetric(), getRandomMetric()],
    athletes,
  },
  {
    id: getRandomId(),
    assessment_template: null,
    assessment_group_date: '2020-10-16T12:12:17Z',
    event_type: 'TrainingSession',
    event: {
      date: '2020-10-16T12:12:17Z',
      duration: 20,
      id: 546232,
      session_type_name: 'cardio',
    },
    name: 'Assessment 2',
    items: [
      getRandomHeader(),
      getRandomMetric(),
      getRandomStatus(),
      getRandomMetric(),
      getRandomMetric(),
      getRandomMetric(),
    ],
    athletes,
  },
];
