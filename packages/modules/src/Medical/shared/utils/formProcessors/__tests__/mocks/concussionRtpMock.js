// @flow
export default {
  id: 104,
  organisation_id: 6,
  form: {
    id: 21,
    category: 'medical',
    group: 'pac_12',
    key: 'concussion_rtp',
    name: 'Concussion RTP',
    form_type: null,
    config: null,
    enabled: true,
    created_at: '2022-08-09T14:28:02Z',
    updated_at: '2022-08-09T14:28:02Z',
  },
  form_template_version: {
    id: 15,
    name: 'concussion_rtp',
    version: 1,
    created_at: '2022-08-09T14:27:03Z',
    updated_at: '2022-08-09T14:27:03Z',
    editor: {
      id: 117364,
      firstname: 'Davide',
      lastname: 'Gulli',
      fullname: 'Davide Gulli',
    },
    config: {
      association: {
        type: 'injury',
        source: 'element_id',
        element_id: 'injury_id',
      },
      custom_params: {
        header_tile: 'Assessment results',
        merge_sections: true,
      },
    },
    form_elements: [
      {
        id: 608,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Initial details',
          element_id: 'section_initial_details',
          custom_params: {
            columns: 1,
          },
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [
          {
            id: 609,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'surveillance',
                  label: 'COVID-19 Surveillance',
                },
                {
                  value: 'aches_and_pains',
                  label: 'Aches and pains',
                },
                {
                  value: 'confirmation_pcr',
                  label: 'COVID-19 Confirmation PCR',
                },
                {
                  value: 'reentry_screening',
                  label: 'COVID-19 Re-entry Screening',
                },
                {
                  value: 'flexibility',
                  label: 'Flexibility',
                },
                {
                  value: 'screening',
                  label: 'COVID-19 Screening',
                },
                {
                  value: 'prevention',
                  label: 'Prevention',
                },
                {
                  value: 'contact_tracing',
                  label: 'COVID-19 Contact Tracing',
                },
                {
                  value: 'injury',
                  label: 'Injury',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
              ],
              text: 'Reason',
              data_point: false,
              element_id: 'reason',
              optional: false,
            },
            visible: true,
            order: 1,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 610,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              data_source: 'injuries',
              data_source_params: ['athlete_id'],
              text: 'Injury',
              data_point: false,
              element_id: 'injury_id',
              condition: {
                element_id: 'reason',
                type: '==',
                value_type: 'string',
                value: 'injury',
              },
              optional: true,
            },
            visible: true,
            order: 2,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 611,
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
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
        ],
      },
      {
        id: 612,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Symptom details',
          element_id: 'section_symptom_details',
          custom_params: {
            columns: 1,
          },
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [
          {
            id: 613,
            element_type: 'Forms::Elements::Inputs::DateTime',
            config: {
              type: 'date',
              text: 'Symptom resolution date',
              data_point: false,
              element_id: 'symptom_resolution_date',
              custom_params: {
                icon: 'calendar',
              },
              optional: true,
            },
            visible: true,
            order: 1,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 614,
            element_type: 'Forms::Elements::Inputs::MultipleChoice',
            config: {
              items: [
                {
                  value: 'definite',
                  label:
                    'Definite - Concussion is the only explanation for the clinical presentation',
                },
                {
                  value: 'possible',
                  label:
                    'Possible - Concussion is not the most likely cause of the clinical presentation',
                },
                {
                  value: 'probable',
                  label:
                    'Probable - Concussion is the most likely cause of the clinical presentation',
                },
              ],
              text: 'Confidence of diagnosis',
              data_point: false,
              element_id: 'confidence_of_diagnosis',
              optional: false,
            },
            visible: true,
            order: 2,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 615,
            element_type: 'Forms::Elements::Inputs::Number',
            config: {
              type: 'integer',
              text: 'Duration until athlete returned to "pre-injured" state',
              data_point: false,
              element_id: 'duration_until_returned',
              custom_params: {
                unit: 'days',
              },
              optional: false,
            },
            visible: true,
            order: 3,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 616,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Describe self-reported course of symptom recovery',
              data_point: false,
              element_id: 'course_symptom_recovery',
              optional: false,
            },
            visible: true,
            order: 4,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
        ],
      },
      {
        id: 617,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Other medication details',
          element_id: 'section_other_details',
          custom_params: {
            columns: 1,
          },
        },
        visible: true,
        order: 3,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [
          {
            id: 618,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'Is the athlete currently taking RX medication unrelated to concussion?',
              data_point: false,
              element_id: 'rx_unrelated',
              optional: false,
            },
            visible: true,
            order: 1,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 619,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'group_rx_unrelated_yes',
              custom_params: {
                columns: 2,
              },
              condition: {
                element_id: 'rx_unrelated',
                type: '==',
                value_type: 'boolean',
                value: true,
              },
            },
            visible: true,
            order: 2,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [
              {
                id: 620,
                element_type: 'Forms::Elements::Inputs::MultipleChoice',
                config: {
                  items: [
                    {
                      value: 'acid_reflux_heartburn',
                      label: 'Acid reflux/heartburn',
                    },
                    {
                      value: 'allergy',
                      label: 'Allergy',
                    },
                    {
                      value: 'anti_anxiety',
                      label: 'Anti-anxiety',
                    },
                    {
                      value: 'anti_depressants',
                      label: 'Anti-depressants',
                    },
                    {
                      value: 'anti_psychotic',
                      label: 'Anti-psychotic',
                    },
                    {
                      value: 'asthma',
                      label: 'Asthma',
                    },
                    {
                      value: 'birth_control',
                      label: 'Birth control',
                    },
                    {
                      value: 'narcotic_pain_medication',
                      label: 'Narcotic Pain medication',
                    },
                    {
                      value: 'non_narcotic_pain_medication',
                      label: 'Non-narcotic pain medication',
                    },
                    {
                      value: 'other',
                      label: 'Other',
                    },
                    {
                      value: 'psycho_stimulant',
                      label: 'Psycho-stimulant',
                    },
                    {
                      value: 'sleep_aid_sedative',
                      label: 'Sleep aid/sedative',
                    },
                  ],
                  text: 'Prescription medication - type',
                  data_point: false,
                  element_id: 'prescription_medication_type',
                  optional: true,
                },
                visible: true,
                order: 1,
                created_at: '2022-08-09T14:27:03Z',
                updated_at: '2022-08-09T14:27:03Z',
                form_elements: [],
              },
              {
                id: 621,
                element_type: 'Forms::Elements::Inputs::MultipleChoice',
                config: {
                  items: [
                    {
                      value: 'academic_requirement',
                      label: 'Academic requirement',
                    },
                    {
                      value: 'anxiety',
                      label: 'Anxiety',
                    },
                    {
                      value: 'depression',
                      label: 'Depression',
                    },
                    {
                      value: 'malingering',
                      label: 'Malingering',
                    },
                    {
                      value: 'motivation',
                      label: 'Motivation (eg. decreased motivated to RTP)',
                    },
                    {
                      value: 'other_injuries',
                      label: 'Other Injuries (Non-concussive)',
                    },
                    {
                      value: 'physical_activity',
                      label: 'Physical activity',
                    },
                    {
                      value: 'secondary_gain',
                      label: 'Secondary gain',
                    },
                    {
                      value: 'somatization',
                      label: 'Somatization',
                    },
                    {
                      value: 'symptom_exaggeration',
                      label: 'Symptom exaggeration',
                    },
                  ],
                  text: 'Was recovery prolonged by any of the following?',
                  data_point: false,
                  element_id: 'was_recovery_prolonged',
                  optional: true,
                },
                visible: true,
                order: 2,
                created_at: '2022-08-09T14:27:03Z',
                updated_at: '2022-08-09T14:27:03Z',
                form_elements: [],
              },
            ],
          },
        ],
      },
      {
        id: 622,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Post-injury psychiatric details',
          element_id: 'section_psychiatric_details',
          custom_params: {
            columns: 1,
          },
        },
        visible: true,
        order: 4,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [
          {
            id: 623,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'Did the athlete experience any post-injury psychiatric issues?',
              data_point: false,
              element_id: 'psychiatric_issues',
              optional: false,
            },
            visible: true,
            order: 1,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 624,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'group_psychiatric_issues_yes',
              custom_params: {
                columns: 2,
              },
              condition: {
                element_id: 'psychiatric_issues',
                type: '==',
                value_type: 'boolean',
                value: true,
              },
            },
            visible: true,
            order: 2,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [
              {
                id: 625,
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
                  data_point: false,
                  element_id: 'post_injury_psychiatric_type',
                  optional: true,
                },
                visible: true,
                order: 1,
                created_at: '2022-08-09T14:27:03Z',
                updated_at: '2022-08-09T14:27:03Z',
                form_elements: [],
              },
              {
                id: 626,
                element_type: 'Forms::Elements::Inputs::MultipleChoice',
                config: {
                  items: [
                    {
                      value: 'anti_anxiety',
                      label: 'Anti-anxiety',
                    },
                    {
                      value: 'anti_depressants',
                      label: 'Anti-depressants',
                    },
                    {
                      value: 'anti_psychotic',
                      label: 'Anti-psychotic',
                    },
                    {
                      value: 'other',
                      label: 'Other',
                    },
                    {
                      value: 'psychiatric_therapy',
                      label: 'Psychiatric therapy',
                    },
                  ],
                  text: 'Post-injury Psychiatric Treatment Provided',
                  data_point: false,
                  element_id: 'post_injury_psychiatric_treatment',
                  optional: true,
                },
                visible: true,
                order: 2,
                created_at: '2022-08-09T14:27:03Z',
                updated_at: '2022-08-09T14:27:03Z',
                form_elements: [],
              },
            ],
          },
        ],
      },
      {
        id: 627,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Recovery details',
          element_id: 'section_recovery_details',
          custom_params: {
            columns: 1,
          },
        },
        visible: true,
        order: 5,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [
          {
            id: 628,
            element_type: 'Forms::Elements::Inputs::DateTime',
            config: {
              type: 'date',
              text: 'Date of return to unrestricted play',
              data_point: false,
              element_id: 'return_unrestricted_play',
              custom_params: {
                icon: 'calendar',
              },
              optional: true,
            },
            visible: true,
            order: 1,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 629,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'athlete_dq_for_the_season',
                  label: 'Athlete DQ for the season',
                },
                {
                  value: 'athlete_dq_retired_from_multiple_concussions',
                  label: 'Athlete DQ/retired from multiples concussions',
                },
                {
                  value: 'athlete_dq_retired_from_sport_for_pcs',
                  label: 'Athlete DQ/retired from sport for PCS',
                },
                {
                  value: 'following_a_return_to_play_progression',
                  label: 'Following a return to play progression',
                },
                {
                  value: 'the_day_symptoms_resolved',
                  label: 'The day symptoms resolved',
                },
                {
                  value: 'while_symptomatic',
                  label: 'While symptomatic',
                },
              ],
              text: 'When did athlete return to unrestricted play?',
              data_point: false,
              element_id: 'unrestricted_play_details',
              optional: false,
            },
            visible: true,
            order: 2,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 630,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'Did the session end before full recovery?',
              data_point: false,
              element_id: 'session_ended_before_recovery',
              optional: false,
            },
            visible: true,
            order: 3,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 631,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'group_session_ended_before_recovery_no',
              custom_params: {
                columns: 2,
              },
              condition: {
                element_id: 'session_ended_before_recovery',
                type: '==',
                value_type: 'boolean',
                value: false,
              },
            },
            visible: true,
            order: 4,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [
              {
                id: 632,
                element_type: 'Forms::Elements::Inputs::Number',
                config: {
                  type: 'integer',
                  text: 'Days from injury to end of season',
                  data_point: false,
                  element_id: 'days_to_end_season',
                  custom_params: {
                    unit: 'days',
                  },
                  optional: true,
                },
                visible: true,
                order: 1,
                created_at: '2022-08-09T14:27:03Z',
                updated_at: '2022-08-09T14:27:03Z',
                form_elements: [],
              },
            ],
          },
          {
            id: 633,
            element_type: 'Forms::Elements::Inputs::MultipleChoice',
            config: {
              items: [
                {
                  value: 'atc',
                  label: 'ATC',
                },
                {
                  value: 'doctor_of_osteopathy',
                  label: 'Doctor of Osteopathy',
                },
                {
                  value: 'neurologist',
                  label: 'Neurologist',
                },
                {
                  value: 'neurosurgeon',
                  label: 'Neurosurgeon',
                },
                {
                  value: 'occupational_medicine_md',
                  label: 'Occupational Medicine MD',
                },
                {
                  value: 'orthopedic_surgeon',
                  label: 'Orthopedic Surgeon',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
                {
                  value: 'parent',
                  label: 'Parent',
                },
                {
                  value: 'pediatrician',
                  label: 'Pediatrician',
                },
                {
                  value: 'physical_therapist',
                  label: 'Physical Therapist',
                },
                {
                  value: 'physician_assistant',
                  label: 'Physician Assistant',
                },
                {
                  value: 'primary_care_physician',
                  label: 'Primary Care Physician',
                },
                {
                  value: 'team_physician',
                  label: 'Team Physician',
                },
              ],
              text: 'Who provided clearance?',
              data_point: false,
              element_id: 'who_provided_clearance',
              optional: false,
            },
            visible: true,
            order: 5,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 634,
            element_type: 'Forms::Elements::Inputs::MultipleChoice',
            config: {
              items: [
                {
                  value: 'athlete_self_reported',
                  label: 'Athlete self-reported',
                },
                {
                  value: 'bess_performance',
                  label: 'BESS Performance',
                },
                {
                  value: 'clinical_testing',
                  label: 'Clinical Testing',
                },
                {
                  value: 'neurocognitive_exam',
                  label: 'Neurocognitive exam',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
                {
                  value: 'sac_performance',
                  label: 'SAC Performance',
                },
                {
                  value: 'state_law',
                  label: 'State law',
                },
                {
                  value: 'state_national_guideline',
                  label: 'State/national guideline',
                },
                {
                  value: 'symptom_checklist',
                  label: 'Symptom Checklist',
                },
                {
                  value: 'university_policy',
                  label: 'University policy',
                },
                {
                  value: 'voms_performance',
                  label: 'VOMS Performance',
                },
              ],
              text: 'What items were used in return to play decisions?',
              data_point: false,
              element_id: 'items_used_rtp',
              optional: false,
            },
            visible: true,
            order: 6,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
        ],
      },
      {
        id: 635,
        element_type: 'Forms::Elements::Layouts::Section',
        config: {
          title: 'Academic impact',
          element_id: 'section_academic_impact',
          custom_params: {
            columns: 1,
          },
        },
        visible: true,
        order: 6,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [
          {
            id: 636,
            element_type: 'Forms::Elements::Inputs::Number',
            config: {
              type: 'integer',
              text: 'Days before return to normal academic performance',
              data_point: false,
              element_id: 'days_before_return',
              custom_params: {
                unit: 'days',
              },
              optional: false,
            },
            visible: true,
            order: 1,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 637,
            element_type: 'Forms::Elements::Inputs::SingleChoice',
            config: {
              items: [
                {
                  value: 'full_time',
                  label: 'Full Time',
                },
                {
                  value: 'gradual',
                  label: 'Gradual',
                },
                {
                  value: 'outside_academic_calendar',
                  label: 'Outside Academic Calendar',
                },
                {
                  value: 'unspecified',
                  label: 'Unspecified',
                },
              ],
              text: 'Did athlete make full or gradual return to school?',
              data_point: false,
              element_id: 'full_gradual_return',
              custom_params: {
                style: 'grid',
              },
              optional: false,
            },
            visible: true,
            order: 2,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 638,
            element_type: 'Forms::Elements::Inputs::Boolean',
            config: {
              text: 'Were any academic modifications required?',
              data_point: false,
              element_id: 'modifications_required',
              optional: false,
            },
            visible: true,
            order: 3,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
          {
            id: 639,
            element_type: 'Forms::Elements::Layouts::Group',
            config: {
              element_id: 'group_modifications_required_yes',
              custom_params: {
                columns: 2,
              },
              condition: {
                element_id: 'modifications_required',
                type: '==',
                value_type: 'boolean',
                value: true,
              },
            },
            visible: true,
            order: 4,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [
              {
                id: 640,
                element_type: 'Forms::Elements::Inputs::MultipleChoice',
                config: {
                  items: [
                    {
                      value: 'decreased_homework',
                      label: 'Decreased homework',
                    },
                    {
                      value: 'excused_from_class',
                      label: 'Excused from class(es)',
                    },
                    {
                      value: 'extended_exam_deadline',
                      label: 'Extended exam deadline/study time',
                    },
                    {
                      value: 'extended_homework_deadline',
                      label: 'Extended homework deadline',
                    },
                    {
                      value: 'more_time_on_exams',
                      label: 'More time on exams',
                    },
                    {
                      value: 'note_taker',
                      label: 'Note taker',
                    },
                    {
                      value: 'other',
                      label: 'Other',
                    },
                  ],
                  text: 'Academic Modifications Provided',
                  data_point: false,
                  element_id: 'academic_modifications',
                  condition: {
                    element_id: 'modifications_required',
                    type: '==',
                    value_type: 'boolean',
                    value: true,
                  },
                  optional: true,
                },
                visible: true,
                order: 1,
                created_at: '2022-08-09T14:27:03Z',
                updated_at: '2022-08-09T14:27:03Z',
                form_elements: [],
              },
            ],
          },
          {
            id: 641,
            element_type: 'Forms::Elements::Inputs::Text',
            config: {
              text: 'Additional return to activity comments',
              data_point: false,
              element_id: 'additional_comments',
              optional: false,
            },
            visible: true,
            order: 5,
            created_at: '2022-08-09T14:27:03Z',
            updated_at: '2022-08-09T14:27:03Z',
            form_elements: [],
          },
        ],
      },
    ],
  },
  athlete: {
    id: 2942,
    firstname: 'Adam',
    lastname: 'Conway',
    fullname: 'Conway Adam',
    position: {
      id: 77,
      name: 'Scrum Half',
      order: 8,
    },
    availability: 'unavailable',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
  },
  editor: {
    id: 97443,
    firstname: 'David',
    lastname: 'Kelly',
    fullname: 'David Kelly',
  },
  status: 'complete',
  event_id: null,
  date: '2022-08-12T07:32:11Z',
  created_at: '2022-08-12T07:32:11Z',
  updated_at: '2022-08-12T07:32:12Z',
  form_answers: [
    {
      id: 3952,
      form_element: {
        id: 609,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'surveillance',
              label: 'COVID-19 Surveillance',
            },
            {
              value: 'aches_and_pains',
              label: 'Aches and pains',
            },
            {
              value: 'confirmation_pcr',
              label: 'COVID-19 Confirmation PCR',
            },
            {
              value: 'reentry_screening',
              label: 'COVID-19 Re-entry Screening',
            },
            {
              value: 'flexibility',
              label: 'Flexibility',
            },
            {
              value: 'screening',
              label: 'COVID-19 Screening',
            },
            {
              value: 'prevention',
              label: 'Prevention',
            },
            {
              value: 'contact_tracing',
              label: 'COVID-19 Contact Tracing',
            },
            {
              value: 'injury',
              label: 'Injury',
            },
            {
              value: 'other',
              label: 'Other',
            },
          ],
          text: 'Reason',
          data_point: false,
          element_id: 'reason',
          optional: false,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 'screening',
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3953,
      form_element: {
        id: 613,
        element_type: 'Forms::Elements::Inputs::DateTime',
        config: {
          type: 'date',
          text: 'Symptom resolution date',
          data_point: false,
          element_id: 'symptom_resolution_date',
          custom_params: {
            icon: 'calendar',
          },
          optional: true,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: '2023-05-10T09:30:59Z',
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3954,
      form_element: {
        id: 618,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'Is the athlete currently taking RX medication unrelated to concussion?',
          data_point: false,
          element_id: 'rx_unrelated',
          optional: false,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: false,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3955,
      form_element: {
        id: 620,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'acid_reflux_heartburn',
              label: 'Acid reflux/heartburn',
            },
            {
              value: 'allergy',
              label: 'Allergy',
            },
            {
              value: 'anti_anxiety',
              label: 'Anti-anxiety',
            },
            {
              value: 'anti_depressants',
              label: 'Anti-depressants',
            },
            {
              value: 'anti_psychotic',
              label: 'Anti-psychotic',
            },
            {
              value: 'asthma',
              label: 'Asthma',
            },
            {
              value: 'birth_control',
              label: 'Birth control',
            },
            {
              value: 'narcotic_pain_medication',
              label: 'Narcotic Pain medication',
            },
            {
              value: 'non_narcotic_pain_medication',
              label: 'Non-narcotic pain medication',
            },
            {
              value: 'other',
              label: 'Other',
            },
            {
              value: 'psycho_stimulant',
              label: 'Psycho-stimulant',
            },
            {
              value: 'sleep_aid_sedative',
              label: 'Sleep aid/sedative',
            },
          ],
          text: 'Prescription medication - type',
          data_point: false,
          element_id: 'prescription_medication_type',
          optional: true,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3956,
      form_element: {
        id: 623,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'Did the athlete experience any post-injury psychiatric issues?',
          data_point: false,
          element_id: 'psychiatric_issues',
          optional: false,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: false,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3957,
      form_element: {
        id: 625,
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
          data_point: false,
          element_id: 'post_injury_psychiatric_type',
          optional: true,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3958,
      form_element: {
        id: 628,
        element_type: 'Forms::Elements::Inputs::DateTime',
        config: {
          type: 'date',
          text: 'Date of return to unrestricted play',
          data_point: false,
          element_id: 'return_unrestricted_play',
          custom_params: {
            icon: 'calendar',
          },
          optional: true,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: '2022-05-15T09:31:25Z',
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3959,
      form_element: {
        id: 632,
        element_type: 'Forms::Elements::Inputs::Number',
        config: {
          type: 'integer',
          text: 'Days from injury to end of season',
          data_point: false,
          element_id: 'days_to_end_season',
          custom_params: {
            unit: 'days',
          },
          optional: true,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 5,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3960,
      form_element: {
        id: 636,
        element_type: 'Forms::Elements::Inputs::Number',
        config: {
          type: 'integer',
          text: 'Days before return to normal academic performance',
          data_point: false,
          element_id: 'days_before_return',
          custom_params: {
            unit: 'days',
          },
          optional: false,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 567,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3961,
      form_element: {
        id: 640,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'decreased_homework',
              label: 'Decreased homework',
            },
            {
              value: 'excused_from_class',
              label: 'Excused from class(es)',
            },
            {
              value: 'extended_exam_deadline',
              label: 'Extended exam deadline/study time',
            },
            {
              value: 'extended_homework_deadline',
              label: 'Extended homework deadline',
            },
            {
              value: 'more_time_on_exams',
              label: 'More time on exams',
            },
            {
              value: 'note_taker',
              label: 'Note taker',
            },
            {
              value: 'other',
              label: 'Other',
            },
          ],
          text: 'Academic Modifications Provided',
          data_point: false,
          element_id: 'academic_modifications',
          condition: {
            element_id: 'modifications_required',
            type: '==',
            value_type: 'boolean',
            value: true,
          },
          optional: true,
        },
        visible: true,
        order: 1,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3962,
      form_element: {
        id: 610,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          data_source: 'injuries',
          data_source_params: ['athlete_id'],
          text: 'Injury',
          data_point: false,
          element_id: 'injury_id',
          condition: {
            element_id: 'reason',
            type: '==',
            value_type: 'string',
            value: 'injury',
          },
          optional: true,
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3963,
      form_element: {
        id: 614,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'definite',
              label:
                'Definite - Concussion is the only explanation for the clinical presentation',
            },
            {
              value: 'possible',
              label:
                'Possible - Concussion is not the most likely cause of the clinical presentation',
            },
            {
              value: 'probable',
              label:
                'Probable - Concussion is the most likely cause of the clinical presentation',
            },
          ],
          text: 'Confidence of diagnosis',
          data_point: false,
          element_id: 'confidence_of_diagnosis',
          optional: false,
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: ['definite'],
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3964,
      form_element: {
        id: 621,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'academic_requirement',
              label: 'Academic requirement',
            },
            {
              value: 'anxiety',
              label: 'Anxiety',
            },
            {
              value: 'depression',
              label: 'Depression',
            },
            {
              value: 'malingering',
              label: 'Malingering',
            },
            {
              value: 'motivation',
              label: 'Motivation (eg. decreased motivated to RTP)',
            },
            {
              value: 'other_injuries',
              label: 'Other Injuries (Non-concussive)',
            },
            {
              value: 'physical_activity',
              label: 'Physical activity',
            },
            {
              value: 'secondary_gain',
              label: 'Secondary gain',
            },
            {
              value: 'somatization',
              label: 'Somatization',
            },
            {
              value: 'symptom_exaggeration',
              label: 'Symptom exaggeration',
            },
          ],
          text: 'Was recovery prolonged by any of the following?',
          data_point: false,
          element_id: 'was_recovery_prolonged',
          optional: true,
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3965,
      form_element: {
        id: 626,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'anti_anxiety',
              label: 'Anti-anxiety',
            },
            {
              value: 'anti_depressants',
              label: 'Anti-depressants',
            },
            {
              value: 'anti_psychotic',
              label: 'Anti-psychotic',
            },
            {
              value: 'other',
              label: 'Other',
            },
            {
              value: 'psychiatric_therapy',
              label: 'Psychiatric therapy',
            },
          ],
          text: 'Post-injury Psychiatric Treatment Provided',
          data_point: false,
          element_id: 'post_injury_psychiatric_treatment',
          optional: true,
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3966,
      form_element: {
        id: 629,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'athlete_dq_for_the_season',
              label: 'Athlete DQ for the season',
            },
            {
              value: 'athlete_dq_retired_from_multiple_concussions',
              label: 'Athlete DQ/retired from multiples concussions',
            },
            {
              value: 'athlete_dq_retired_from_sport_for_pcs',
              label: 'Athlete DQ/retired from sport for PCS',
            },
            {
              value: 'following_a_return_to_play_progression',
              label: 'Following a return to play progression',
            },
            {
              value: 'the_day_symptoms_resolved',
              label: 'The day symptoms resolved',
            },
            {
              value: 'while_symptomatic',
              label: 'While symptomatic',
            },
          ],
          text: 'When did athlete return to unrestricted play?',
          data_point: false,
          element_id: 'unrestricted_play_details',
          optional: false,
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 'following_a_return_to_play_progression',
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3967,
      form_element: {
        id: 637,
        element_type: 'Forms::Elements::Inputs::SingleChoice',
        config: {
          items: [
            {
              value: 'full_time',
              label: 'Full Time',
            },
            {
              value: 'gradual',
              label: 'Gradual',
            },
            {
              value: 'outside_academic_calendar',
              label: 'Outside Academic Calendar',
            },
            {
              value: 'unspecified',
              label: 'Unspecified',
            },
          ],
          text: 'Did athlete make full or gradual return to school?',
          data_point: false,
          element_id: 'full_gradual_return',
          custom_params: {
            style: 'grid',
          },
          optional: false,
        },
        visible: true,
        order: 2,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 'outside_academic_calendar',
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3968,
      form_element: {
        id: 611,
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
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: null,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3969,
      form_element: {
        id: 615,
        element_type: 'Forms::Elements::Inputs::Number',
        config: {
          type: 'integer',
          text: 'Duration until athlete returned to "pre-injured" state',
          data_point: false,
          element_id: 'duration_until_returned',
          custom_params: {
            unit: 'days',
          },
          optional: false,
        },
        visible: true,
        order: 3,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 67,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3970,
      form_element: {
        id: 630,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'Did the session end before full recovery?',
          data_point: false,
          element_id: 'session_ended_before_recovery',
          optional: false,
        },
        visible: true,
        order: 3,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: false,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3971,
      form_element: {
        id: 638,
        element_type: 'Forms::Elements::Inputs::Boolean',
        config: {
          text: 'Were any academic modifications required?',
          data_point: false,
          element_id: 'modifications_required',
          optional: false,
        },
        visible: true,
        order: 3,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: false,
      created_at: '2022-08-12T07:32:11Z',
      updated_at: '2022-08-12T07:32:11Z',
    },
    {
      id: 3972,
      form_element: {
        id: 616,
        element_type: 'Forms::Elements::Inputs::Text',
        config: {
          text: 'Describe self-reported course of symptom recovery',
          data_point: false,
          element_id: 'course_symptom_recovery',
          optional: false,
        },
        visible: true,
        order: 4,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 'Mi',
      created_at: '2022-08-12T07:32:12Z',
      updated_at: '2022-08-12T07:32:12Z',
    },
    {
      id: 3973,
      form_element: {
        id: 633,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'atc',
              label: 'ATC',
            },
            {
              value: 'doctor_of_osteopathy',
              label: 'Doctor of Osteopathy',
            },
            {
              value: 'neurologist',
              label: 'Neurologist',
            },
            {
              value: 'neurosurgeon',
              label: 'Neurosurgeon',
            },
            {
              value: 'occupational_medicine_md',
              label: 'Occupational Medicine MD',
            },
            {
              value: 'orthopedic_surgeon',
              label: 'Orthopedic Surgeon',
            },
            {
              value: 'other',
              label: 'Other',
            },
            {
              value: 'parent',
              label: 'Parent',
            },
            {
              value: 'pediatrician',
              label: 'Pediatrician',
            },
            {
              value: 'physical_therapist',
              label: 'Physical Therapist',
            },
            {
              value: 'physician_assistant',
              label: 'Physician Assistant',
            },
            {
              value: 'primary_care_physician',
              label: 'Primary Care Physician',
            },
            {
              value: 'team_physician',
              label: 'Team Physician',
            },
          ],
          text: 'Who provided clearance?',
          data_point: false,
          element_id: 'who_provided_clearance',
          optional: false,
        },
        visible: true,
        order: 5,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: ['neurologist'],
      created_at: '2022-08-12T07:32:12Z',
      updated_at: '2022-08-12T07:32:12Z',
    },
    {
      id: 3974,
      form_element: {
        id: 641,
        element_type: 'Forms::Elements::Inputs::Text',
        config: {
          text: 'Additional return to activity comments',
          data_point: false,
          element_id: 'additional_comments',
          optional: false,
        },
        visible: true,
        order: 5,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: 'Is this mandatory…?????',
      created_at: '2022-08-12T07:32:12Z',
      updated_at: '2022-08-12T07:32:12Z',
    },
    {
      id: 3975,
      form_element: {
        id: 634,
        element_type: 'Forms::Elements::Inputs::MultipleChoice',
        config: {
          items: [
            {
              value: 'athlete_self_reported',
              label: 'Athlete self-reported',
            },
            {
              value: 'bess_performance',
              label: 'BESS Performance',
            },
            {
              value: 'clinical_testing',
              label: 'Clinical Testing',
            },
            {
              value: 'neurocognitive_exam',
              label: 'Neurocognitive exam',
            },
            {
              value: 'other',
              label: 'Other',
            },
            {
              value: 'sac_performance',
              label: 'SAC Performance',
            },
            {
              value: 'state_law',
              label: 'State law',
            },
            {
              value: 'state_national_guideline',
              label: 'State/national guideline',
            },
            {
              value: 'symptom_checklist',
              label: 'Symptom Checklist',
            },
            {
              value: 'university_policy',
              label: 'University policy',
            },
            {
              value: 'voms_performance',
              label: 'VOMS Performance',
            },
          ],
          text: 'What items were used in return to play decisions?',
          data_point: false,
          element_id: 'items_used_rtp',
          optional: false,
        },
        visible: true,
        order: 6,
        created_at: '2022-08-09T14:27:03Z',
        updated_at: '2022-08-09T14:27:03Z',
        form_elements: [],
      },
      value: ['neurocognitive_exam'],
      created_at: '2022-08-12T07:32:12Z',
      updated_at: '2022-08-12T07:32:12Z',
    },
  ],
  extra: null,
};

export const expectedFormInfoResult = {
  formMeta: {
    id: 21,
    category: 'medical',
    group: 'pac_12',
    key: 'concussion_rtp',
    name: 'Concussion RTP',
    form_type: null,
    config: null,
    enabled: true,
    created_at: '2022-08-09T14:28:02Z',
    updated_at: '2022-08-09T14:28:02Z',
  },
  headerTitle: 'Assessment results',
  mergeSections: true,
  hideFormInfo: undefined,
  athlete: {
    id: 2942,
    firstname: 'Adam',
    lastname: 'Conway',
    fullname: 'Conway Adam',
    position: { id: 77, name: 'Scrum Half', order: 8 },
    availability: 'unavailable',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
  },
  editor: {
    id: 97443,
    firstname: 'David',
    lastname: 'Kelly',
    fullname: 'David Kelly',
  },
  status: 'complete',
  date: '2022-08-12T07:32:11Z',
  attachments: [],
  created_at: '2022-08-12T07:32:11Z',
  updated_at: '2022-08-12T07:32:12Z',
  linked_injuries_illnesses: [],
};

export const expectedFormattedResults = [
  {
    title: 'Initial details',
    elementId: 'section_initial_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Reason:',
            answer: 'COVID-19 Screening',
            id: 'reason',
            type: 'questionAndAnswer',
          },
        ],
        id: 609,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 608,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Symptom details',
    elementId: 'section_symptom_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Symptom resolution date:',
            answer: 'May 10, 2023',
            id: 'symptom_resolution_date',
            type: 'questionAndAnswer',
          },
        ],
        id: 613,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Confidence of diagnosis:',
            answer:
              'Definite - Concussion is the only explanation for the clinical presentation',
            id: 'confidence_of_diagnosis',
            type: 'questionAndAnswer',
          },
        ],
        id: 614,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Duration until athlete returned to "pre-injured" state:',
            answer: '67 days',
            id: 'duration_until_returned',
            type: 'questionAndAnswer',
          },
        ],
        id: 615,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Describe self-reported course of symptom recovery:',
            answer: 'Mi',
            id: 'course_symptom_recovery',
            type: 'questionAndAnswer',
          },
        ],
        id: 616,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 612,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Other medication details',
    elementId: 'section_other_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question:
              'Is the athlete currently taking RX medication unrelated to concussion?',
            answer: 'No',
            id: 'rx_unrelated',
            type: 'questionAndAnswer',
          },
        ],
        id: 618,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 617,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Post-injury psychiatric details',
    elementId: 'section_psychiatric_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question:
              'Did the athlete experience any post-injury psychiatric issues?',
            answer: 'No',
            id: 'psychiatric_issues',
            type: 'questionAndAnswer',
          },
        ],
        id: 623,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 622,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Recovery details',
    elementId: 'section_recovery_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Date of return to unrestricted play:',
            answer: 'May 15, 2022',
            id: 'return_unrestricted_play',
            type: 'questionAndAnswer',
          },
        ],
        id: 628,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'When did athlete return to unrestricted play?',
            answer: 'Following a return to play progression',
            id: 'unrestricted_play_details',
            type: 'questionAndAnswer',
          },
        ],
        id: 629,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Did the session end before full recovery?',
            answer: 'No',
            id: 'session_ended_before_recovery',
            type: 'questionAndAnswer',
          },
        ],
        id: 630,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Days from injury to end of season:',
            answer: '5 days',
            id: 'days_to_end_season',
            type: 'questionAndAnswer',
          },
        ],
        id: 631,
        isConditional: true,
        isGroupInData: true,
        type: 'group',
        columns: 2,
      },
      {
        questionsAndAnswers: [
          {
            question: 'Who provided clearance?',
            answer: 'Neurologist',
            id: 'who_provided_clearance',
            type: 'questionAndAnswer',
          },
        ],
        id: 633,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'What items were used in return to play decisions?',
            answer: 'Neurocognitive exam',
            id: 'items_used_rtp',
            type: 'questionAndAnswer',
          },
        ],
        id: 634,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 627,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Academic impact',
    elementId: 'section_academic_impact',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Days before return to normal academic performance:',
            answer: '567 days',
            id: 'days_before_return',
            type: 'questionAndAnswer',
          },
        ],
        id: 636,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Did athlete make full or gradual return to school?',
            answer: 'Outside Academic Calendar',
            id: 'full_gradual_return',
            type: 'questionAndAnswer',
          },
        ],
        id: 637,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Were any academic modifications required?',
            answer: 'No',
            id: 'modifications_required',
            type: 'questionAndAnswer',
          },
        ],
        id: 638,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Additional return to activity comments:',
            answer: 'Is this mandatory…?????',
            id: 'additional_comments',
            type: 'questionAndAnswer',
          },
        ],
        id: 641,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 635,
    sidePanelSection: false,
    columns: 1,
  },
];
