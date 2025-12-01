// @flow
export default {
  id: 859,
  organisation_id: 6,
  form: {
    id: 99,
    category: 'legal',
    group: 'isu',
    key: 'release_and_indemnification_feb_2023',
    name: 'Release and Indemnification Feb 2023',
    fullname: null,
    form_type: 'registration',
    config: null,
    enabled: true,
    created_at: '2023-06-13T11:19:23Z',
    updated_at: '2023-06-13T11:19:23Z',
  },
  form_template_version: {
    id: 79,
    name: 'release_and_indemnification_feb_2023',
    version: 1,
    created_at: '2023-06-13T11:17:43Z',
    updated_at: '2023-06-13T11:17:43Z',
    editor: {
      id: 18371,
      firstname: 'Chris',
      lastname: 'McGrath',
      fullname: 'Chris McGrath',
    },
    config: null,
    form_elements: [
      {
        id: 20853,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Release and Indemnification Agreement',
          element_id: 'section',
        },
        visible: true,
        order: 1,
        form_elements: [
          {
            id: 20854,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Student-athlete name',
              data_point: false,
              element_id: 'athlete_name',
              optional: false,
            },
            visible: true,
            order: 1,
            form_elements: [],
          },
          {
            id: 20855,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'cross_country',
                  label: 'Cross Country',
                },
                {
                  value: 'football',
                  label: 'Football',
                },
                {
                  value: 'gymnastics',
                  label: 'Gymnastics',
                },
                {
                  value: 'mens_basketball',
                  label: "Men's Basketball",
                },
                {
                  value: 'mens_golf',
                  label: "Men's Golf",
                },
                {
                  value: 'soccer',
                  label: 'Soccer',
                },
                {
                  value: 'softball',
                  label: 'Softball',
                },
                {
                  value: 'swimming_diving',
                  label: 'Swimming and Diving',
                },
                {
                  value: 'tennis',
                  label: 'Tennis',
                },
                {
                  value: 'track',
                  label: 'Track and Field',
                },
                {
                  value: 'volleyball',
                  label: 'Volleyball',
                },
                {
                  value: 'womens_basketball',
                  label: "Women's Basketball",
                },
                {
                  value: 'womens_golf',
                  label: "Women's Golf",
                },
                {
                  value: 'wrestling',
                  label: 'Wrestling',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
              ],
              text: 'Sport',
              data_point: false,
              element_id: 'sport',
              optional: false,
            },
            visible: true,
            order: 2,
            form_elements: [],
          },
          {
            id: 20856,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Other sport',
              data_point: false,
              element_id: 'sport_other',
              condition: {
                element_id: 'sport',
                type: '==',
                value_type: 'string',
                value: 'other',
              },
              optional: true,
            },
            visible: true,
            order: 3,
            form_elements: [],
          },
          {
            id: 20857,
            element_type: 'Forms::Elements::Layouts::Content',
            config: {
              text: 'Participation in sports requires an acceptance of risk of injury. Periodic analysis of injury patterns continuously leads to refinement in rules and regulations and other safety guidelines. The athlete and the athletics program have a mutual need for an informed awareness of the risks being accepted and for sharing the responsibility of those risks. At Iowa State University, we make every effort to decrease your injury risks. As risks are identified, steps are taken to minimize the causes, where possible. Even with these efforts, a certain number of injuries will occur. The student-athlete and his/her parents/guardians should be aware of this fact.',
              element_id: 'content_1',
            },
            visible: true,
            order: 4,
            form_elements: [],
          },
          {
            id: 20858,
            element_type: 'Forms::Elements::Layouts::Content',
            config: {
              text: 'I am aware that playing, practicing, training, and/or other involvement in any sport can be a dangerous activity involving MANY RISKS OF INJURY, including, but not limited to the potential for catastrophic injury. I understand that the dangers and risks of playing, practicing, or training in any athletic activity include, but are not limited to, death, serious neck and spinal injuries which may result in complete or partial paralysis or brain damage, serious injury to virtually all bones, joints, ligaments, muscles, tendons, and other aspects of the musculoskeletal system, and serious injury or impairment to other aspects of my body, general health and well-being. Because of the aforementioned dangers of participating in any athletic activity, I recognize the importance of following all instructions of the coaching staff, strength and conditioning staff, and/or Sports Medicine staff. Furthermore, I understand that the possibility of injury, including catastrophic injury, does exist even though proper rules and techniques are followed to the fullest. I also understand there are risks involved with traveling in connection with intercollegiate athletics.',
              element_id: 'content_2',
            },
            visible: true,
            order: 5,
            form_elements: [],
          },
          {
            id: 20859,
            element_type: 'Forms::Elements::Layouts::Content',
            config: {
              text: 'In consideration of Iowa State University Department of Athletics permitting me to participate in intercollegiate athletics and to engage in all activities and travel related to my sport, I hereby voluntarily assume all risks associated with participation and agree to exonerate, save harmless and release Iowa State University, its agents, servants, trustees, and employees from any and all liability, any medical expenses not covered by Iowa State University medical coverage policies, and all claims, causes of action or demands of any kind and nature whatsoever which may arise by or in connection with my participation in any activities related to intercollegiate athletics. The terms, hereof shall serve as release and assumption of risk for my heirs, estate, executor, administrator, assignees, and all members of my family.',
              element_id: 'content_3',
            },
            visible: true,
            order: 6,
            form_elements: [],
          },
          {
            id: 20860,
            element_type: 'Forms::Elements::Layouts::Content',
            config: {
              text: 'I HAVE CAREFULLY READ THIS AGREEMENT AND UNDERSTAND IT TO BE A RELEASE OF ALL CLAIMS AND CAUSES OF ACTION FOR MY INJURY OR DEATH OR DAMAGE TO MY PROPERTY THAT OCCURS WHILE PARTICIPATING IN INTERCOLLEGIATE ATHLETICS AND IT OBLIGATES ME TO INDEMNIFY THE PARTIES NAMED FOR ANY LIABILITY FOR INJURY OR DEATH OF ANY PERSON AND DAMAGE TO PROPERTY CAUSED BY MY NEGLIGENT OR INTENTIONAL ACT OR OMISSION.',
              element_id: 'content_4',
            },
            visible: true,
            order: 7,
            form_elements: [],
          },
          {
            id: 20861,
            element_type: 'Forms::Elements::Inputs::Attachment',
            config: {
              text: 'Player Signature',
              data_point: false,
              element_id: 'player_signature',
              custom_params: {
                type: 'signature',
              },
              optional: false,
            },
            visible: true,
            order: 8,
            form_elements: [],
          },
          {
            id: 20862,
            element_type: 'Forms::Elements::Inputs::DateTime',
            config: {
              type: 'date',
              text: 'Date',
              data_point: false,
              element_id: 'date',
              optional: false,
            },
            visible: true,
            order: 9,
            form_elements: [],
          },
        ],
      },
    ],
  },
  athlete: {
    id: 92153,
    firstname: 'Willian',
    lastname: 'Gama',
    fullname: 'Willian Gama',
    position: {
      id: 73,
      name: 'Second Row',
      order: 4,
    },
    availability: 'available',
    avatar_url:
      'https://kitman.imgix.net/avatar.jpg?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
  },
  editor: {
    id: 156225,
    firstname: 'Willian',
    lastname: 'Gama',
    fullname: 'Willian Gama',
  },
  status: 'complete',
  concussion_diagnosed: null,
  event_id: null,
  date: '2023-06-26T10:47:21Z',
  created_at: '2023-06-26T09:47:22Z',
  updated_at: '2023-06-26T09:47:22Z',
  form_answers: [
    {
      id: 38946,
      form_element: {
        id: 20854,
        element_type: 'Forms::Elements::Inputs::Text',
        config: {
          text: 'Student-athlete name',
          data_point: false,
          element_id: 'athlete_name',
          optional: false,
        },
        visible: true,
        order: 1,
        form_elements: [],
      },
      value: 'student athlete name',
      created_at: '2023-06-26T09:47:22Z',
      updated_at: '2023-06-26T09:47:22Z',
    },
    {
      id: 38947,
      form_element: {
        id: 20855,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'cross_country',
              label: 'Cross Country',
            },
            {
              value: 'football',
              label: 'Football',
            },
            {
              value: 'gymnastics',
              label: 'Gymnastics',
            },
            {
              value: 'mens_basketball',
              label: "Men's Basketball",
            },
            {
              value: 'mens_golf',
              label: "Men's Golf",
            },
            {
              value: 'soccer',
              label: 'Soccer',
            },
            {
              value: 'softball',
              label: 'Softball',
            },
            {
              value: 'swimming_diving',
              label: 'Swimming and Diving',
            },
            {
              value: 'tennis',
              label: 'Tennis',
            },
            {
              value: 'track',
              label: 'Track and Field',
            },
            {
              value: 'volleyball',
              label: 'Volleyball',
            },
            {
              value: 'womens_basketball',
              label: "Women's Basketball",
            },
            {
              value: 'womens_golf',
              label: "Women's Golf",
            },
            {
              value: 'wrestling',
              label: 'Wrestling',
            },
            {
              value: 'other',
              label: 'Other',
            },
          ],
          text: 'Sport',
          data_point: false,
          element_id: 'sport',
          optional: false,
        },
        visible: true,
        order: 2,
        form_elements: [],
      },
      value: 'football',
      created_at: '2023-06-26T09:47:22Z',
      updated_at: '2023-06-26T09:47:22Z',
    },
    {
      id: 38948,
      form_element: {
        id: 20861,
        element_type: 'Forms::Elements::Inputs::Attachment',
        config: {
          text: 'Player Signature',
          data_point: false,
          element_id: 'player_signature',
          custom_params: {
            type: 'signature',
          },
          optional: false,
        },
        visible: true,
        order: 8,
        form_elements: [],
      },
      value: '284862',
      attachment: {
        id: 284862,
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
      },
      created_at: '2023-06-26T09:47:22Z',
      updated_at: '2023-06-26T09:47:22Z',
    },
    {
      id: 38949,
      form_element: {
        id: 20862,
        element_type: 'Forms::Elements::Inputs::DateTime',
        config: {
          type: 'date',
          text: 'Date',
          data_point: false,
          element_id: 'date',
          optional: false,
        },
        visible: true,
        order: 9,
        form_elements: [],
      },
      value: '2023-06-26T00:00:00Z',
      created_at: '2023-06-26T09:47:22Z',
      updated_at: '2023-06-26T09:47:22Z',
    },
  ],
  extra: null,
};

export const expectedFormInfoResult = {
  formMeta: {
    id: 99,
    category: 'legal',
    group: 'isu',
    key: 'release_and_indemnification_feb_2023',
    name: 'Release and Indemnification Feb 2023',
    fullname: null,
    form_type: 'registration',
    config: null,
    enabled: true,
    created_at: '2023-06-13T11:19:23Z',
    updated_at: '2023-06-13T11:19:23Z',
  },
  headerTitle: undefined,
  mergeSections: undefined,
  hideFormInfo: undefined,
  athlete: {
    id: 92153,
    firstname: 'Willian',
    lastname: 'Gama',
    fullname: 'Willian Gama',
    position: { id: 73, name: 'Second Row', order: 4 },
    availability: 'available',
    avatar_url:
      'https://kitman.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
  },
  editor: {
    id: 156225,
    firstname: 'Willian',
    lastname: 'Gama',
    fullname: 'Willian Gama',
  },
  status: 'complete',
  date: '2023-06-26T10:47:21Z',
  created_at: '2023-06-26T09:47:22Z',
  updated_at: '2023-06-26T09:47:22Z',
  linked_injuries_illnesses: [],
  attachments: [
    {
      attachment_date: '2024-08-20T20:45:21Z',
      created: '2024-08-20T20:45:21Z',
      created_by: {
        firstname: 'Cathal',
        fullname: 'Cathal Diver',
        id: 155134,
        lastname: 'Diver',
      },
      filename: '',
      filesize: 12345,
      filetype: '',
      id: 284862,
      url: '',
    },
  ],
};

export const expectedFormattedResults = [
  {
    title: 'Release and Indemnification Agreement',
    elementId: 'section',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Student-athlete name:',
            answer: 'student athlete name',
            id: 'athlete_name',
            type: 'questionAndAnswer',
          },
        ],
        id: 20854,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Sport:',
            answer: 'Football',
            id: 'sport',
            type: 'questionAndAnswer',
          },
        ],
        id: 20855,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question:
              'Participation in sports requires an acceptance of risk of injury. Periodic analysis of injury patterns continuously leads to refinement in rules and regulations and other safety guidelines. The athlete and the athletics program have a mutual need for an informed awareness of the risks being accepted and for sharing the responsibility of those risks. At Iowa State University, we make every effort to decrease your injury risks. As risks are identified, steps are taken to minimize the causes, where possible. Even with these efforts, a certain number of injuries will occur. The student-athlete and his/her parents/guardians should be aware of this fact.',
            answer: null,
            id: 'content_1',
            type: 'descriptionContent',
          },
        ],
        id: 20857,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question:
              'I am aware that playing, practicing, training, and/or other involvement in any sport can be a dangerous activity involving MANY RISKS OF INJURY, including, but not limited to the potential for catastrophic injury. I understand that the dangers and risks of playing, practicing, or training in any athletic activity include, but are not limited to, death, serious neck and spinal injuries which may result in complete or partial paralysis or brain damage, serious injury to virtually all bones, joints, ligaments, muscles, tendons, and other aspects of the musculoskeletal system, and serious injury or impairment to other aspects of my body, general health and well-being. Because of the aforementioned dangers of participating in any athletic activity, I recognize the importance of following all instructions of the coaching staff, strength and conditioning staff, and/or Sports Medicine staff. Furthermore, I understand that the possibility of injury, including catastrophic injury, does exist even though proper rules and techniques are followed to the fullest. I also understand there are risks involved with traveling in connection with intercollegiate athletics.',
            answer: null,
            id: 'content_2',
            type: 'descriptionContent',
          },
        ],
        id: 20858,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question:
              'In consideration of Iowa State University Department of Athletics permitting me to participate in intercollegiate athletics and to engage in all activities and travel related to my sport, I hereby voluntarily assume all risks associated with participation and agree to exonerate, save harmless and release Iowa State University, its agents, servants, trustees, and employees from any and all liability, any medical expenses not covered by Iowa State University medical coverage policies, and all claims, causes of action or demands of any kind and nature whatsoever which may arise by or in connection with my participation in any activities related to intercollegiate athletics. The terms, hereof shall serve as release and assumption of risk for my heirs, estate, executor, administrator, assignees, and all members of my family.',
            answer: null,
            id: 'content_3',
            type: 'descriptionContent',
          },
        ],
        id: 20859,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question:
              'I HAVE CAREFULLY READ THIS AGREEMENT AND UNDERSTAND IT TO BE A RELEASE OF ALL CLAIMS AND CAUSES OF ACTION FOR MY INJURY OR DEATH OR DAMAGE TO MY PROPERTY THAT OCCURS WHILE PARTICIPATING IN INTERCOLLEGIATE ATHLETICS AND IT OBLIGATES ME TO INDEMNIFY THE PARTIES NAMED FOR ANY LIABILITY FOR INJURY OR DEATH OF ANY PERSON AND DAMAGE TO PROPERTY CAUSED BY MY NEGLIGENT OR INTENTIONAL ACT OR OMISSION.',
            answer: null,
            id: 'content_4',
            type: 'descriptionContent',
          },
        ],
        id: 20860,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            type: 'attachment',
            attachment: {
              id: 284862,
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
            },
            id: 'player_signature',
            displayType: 'signature',
            title: 'Player signature:',
            signatureName: 'Willian Gama',
          },
        ],
        id: 20861,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Date:',
            answer: 'Jun 26, 2023',
            id: 'date',
            type: 'questionAndAnswer',
          },
        ],
        id: 20862,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 20853,
    sidePanelSection: false,
  },
];
