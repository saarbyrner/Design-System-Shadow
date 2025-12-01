// @flow
export const mockQuestionsOnSpace = [
  {
    id: 1,
    isConditional: false,
    isGroupInData: false,
    questionsAndAnswers: [
      {
        id: 'q001',
        question: 'How far is the moon?',
        answer: '384,400 km',
        type: 'questionAndAnswer',
      },
    ],
    type: 'group',
  },
  {
    id: 2,
    isConditional: false,
    isGroupInData: true,
    title: 'Group title',
    questionsAndAnswers: [
      {
        id: 'q001_001',
        question: 'How long was the drive?',
        answer: 'Just under six months',
        type: 'questionAndAnswer',
      },
      {
        id: 'q001_002',
        question: 'Was there cheese there?',
        answer: 'no',
        type: 'questionAndAnswer',
      },
      {
        id: 'q001_003',
        question: 'Is it haunted',
        answer: 'yes',
        type: 'questionAndAnswer',
      },
    ],
    type: 'group',
  },
  {
    id: 3,
    isConditional: false,
    isGroupInData: false,
    questionsAndAnswers: [
      {
        id: 'q002',
        question: 'How far is mars today?',
        answer: '186 million km',
        type: 'questionAndAnswer',
      },
    ],
    type: 'group',
  },
  {
    id: 4,
    isConditional: false,
    isGroupInData: false,
    questionsAndAnswers: [
      {
        id: 'q002_001',
        question: 'What year do spaceX plan to land there?',
        answer: '2030',
        type: 'questionAndAnswer',
      },
      {
        id: 'q002_002',
        question: 'Will Elon also buy Twitter?',
        answer:
          "Billionaire Elon Musk called off his deal to buy social media company Twitter, according to a filing on Friday with the Securities and Exchange Commission. Skadden Arps attorney Mike Ringler said in a letter to Twitter's chief legal officer that Twitter has not complied with its contractual obligations.",
        type: 'questionAndAnswer',
      },
    ],
    type: 'group',
  },
];

export const mockQuestionsOnSport = [
  {
    id: 10,
    isConditional: false,
    isGroupInData: false,
    questionsAndAnswers: [
      {
        question: 'When is the next world cup?',
        answer: '2022 FIFA World Cup will begin on Monday, 21 November',
        id: 'q003',
        type: 'questionAndAnswer',
      },
    ],
    type: 'group',
  },
  {
    type: 'separator',
    id: 's001',
  },
  {
    id: 11,
    isConditional: true,
    isGroupInData: true,
    title: 'Group title',
    questionsAndAnswers: [
      {
        id: 'q003_001',
        question: 'Where will it be?',
        answer: 'Qatar',
        type: 'questionAndAnswer',
      },
      {
        id: 'q003_002',
        question: 'Who is favoured team to win it?',
        answer: 'Brazil',
        type: 'questionAndAnswer',
      },
    ],
    type: 'group',
  },
];

export const mockSections = [
  {
    title: 'Space',
    elements: mockQuestionsOnSpace,
    id: 1,
    sidePanelSection: false,
  },
  {
    title: 'Sport',
    elements: mockQuestionsOnSport,
    id: 2,
    sidePanelSection: false,
  },
];

export const mockTableData = {
  questionsAndAnswers: [
    {
      question: 'Headache:',
      answer: '2',
      id: 'headache',
      type: 'questionAndAnswer',
    },
    {
      question: '"Pressure in head":',
      answer: '1',
      id: 'pressure_in_head',
      type: 'questionAndAnswer',
    },
    {
      question: 'Neck Pain:',
      answer: '1',
      id: 'neck_pain',
      type: 'questionAndAnswer',
    },
    {
      question: 'Nausea or vomiting:',
      answer: '1',
      id: 'nausea_or_vomiting',
      type: 'questionAndAnswer',
    },
    {
      question: 'Dizziness:',
      answer: '1',
      id: 'dizziness',
      type: 'questionAndAnswer',
    },
    {
      question: 'Blurred vision:',
      answer: '0',
      id: 'blurred_vision',
      type: 'questionAndAnswer',
    },
    {
      question: 'Balance problems:',
      answer: '1',
      id: 'balance_problems',
      type: 'questionAndAnswer',
    },
    {
      question: 'Sensitivity to light:',
      answer: '1',
      id: 'sensitivity_to_light',
      type: 'questionAndAnswer',
    },
    {
      question: 'Sensitivity to noise:',
      answer: '0',
      id: 'sensitivity_to_noise',
      type: 'questionAndAnswer',
    },
    {
      question: 'Feeling slowed down:',
      answer: '1',
      id: 'feeling_slowed_down',
      type: 'questionAndAnswer',
    },
    {
      question: 'Feeling like "in a fog":',
      answer: '0',
      id: 'feeling_like_in_a_fog',
      type: 'questionAndAnswer',
    },
    {
      question: '"Don\'t feel right":',
      answer: '1',
      id: 'dont_feel_right',
      type: 'questionAndAnswer',
    },
    {
      question: 'Difficulty concentrating:',
      answer: '1',
      id: 'difficulty_concentrating',
      type: 'questionAndAnswer',
    },
    {
      question: 'Difficulty remembering:',
      answer: '1',
      id: 'difficulty_remembering',
      type: 'questionAndAnswer',
    },
    {
      question: 'Fatigue or low energy:',
      answer: '2',
      id: 'fatigue_or_low_energy',
      type: 'questionAndAnswer',
    },
    {
      question: 'Confusion:',
      answer: '0',
      id: 'confusion',
      type: 'questionAndAnswer',
    },
    {
      question: 'Drowsiness:',
      answer: '2',
      id: 'drowsiness',
      type: 'questionAndAnswer',
    },
    {
      question: 'More emotional:',
      answer: '0',
      id: 'more_emotional',
      type: 'questionAndAnswer',
    },
    {
      question: 'Irritability:',
      answer: '2',
      id: 'irritability',
      type: 'questionAndAnswer',
    },
    {
      question: 'Sadness:',
      answer: '0',
      id: 'sadness',
      type: 'questionAndAnswer',
    },
    {
      question: 'Nervous or Anxious:',
      answer: '0',
      id: 'nervous_or_anxious',
      type: 'questionAndAnswer',
    },
    {
      question: 'Trouble falling asleep (if applicable):',
      answer: '2',
      id: 'trouble_falling_asleep',
      type: 'questionAndAnswer',
    },
  ],
  id: 1,
  isConditional: false,
  isGroupInData: true,
  columns: 3,
  title: 'Symptom scores',
  type: 'table',
};

export const mockSignatureAttachment = {
  id: 1,
  url: '../img/checkmark.png',
  filename: 'player_signature.jpeg',
  filetype: 'binary/octet-stream',
  filesize: 160395,
  audio_file: false,
  confirmed: true,
  presigned_post: null,
  download_url: '../img/checkmark.png',
  created_by: {
    id: 24765,
    firstname: 'Niall',
    lastname: 'Kennedy',
    fullname: 'Niall Kennedy',
  },
  attachment_date: '2022-09-05T12:54:28Z',
};

export const mockColorGroup = {
  questionsAndAnswers: [
    {
      question: 'Rating:',
      answer: '1',
      id: 'rating_range_2',
      type: 'questionAndAnswer',
      renderConfig: {
        renderAs: 'color',
        valueMap: {
          '0': '#C31D2B',
          '1': '#FFAB00',
          '2': '#43B374',
        },
      },
    },
  ],
  id: 2,
  isConditional: false,
  isGroupInData: false,
  type: 'group',
};
