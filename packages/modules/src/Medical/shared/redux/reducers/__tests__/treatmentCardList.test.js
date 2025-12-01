import treatmentCardListReducer from '../treatmentCardList';

describe('treatmentCardList reducer', () => {
  const initialState = {
    athleteTreatments: {},
    invalidEditTreatmentCards: [],
  };

  it('returns correct state on INITIALISE_EDIT_TREATMENT_STATE', () => {
    const action = {
      type: 'INITIALISE_EDIT_TREATMENT_STATE',
      payload: {
        selectedAthleteIds: [33197],
        selectedTreatment: {
          id: 26151,
          user: {
            id: 31369,
            firstname: 'Rory',
            lastname: 'Thornburgh',
            fullname: 'Rory Thornburgh',
          },
          athlete: {
            id: 58157,
            firstname: 'Message',
            lastname: 'Test Steve1',
            fullname: 'Test Steve1 Message',
            shortname: 'M Test Steve1',
            avatar_url:
              'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
          },
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          created_by: {
            id: 31369,
            firstname: 'Rory',
            lastname: 'Thornburgh',
            fullname: 'Rory Thornburgh',
          },
          created_at: '2022-07-25T15:26:58Z',
          treatments: [
            {
              id: 44042,
              treatment_modality: {
                id: 39,
                name: 'Cold Tub',
                treatment_category: {
                  id: 3,
                  name: 'Cryotherapy/Compression',
                },
              },
              duration: 60,
              reason: null,
              issue_type: null,
              issue: null,
              treatment_body_areas: [
                {
                  id: 63494,
                  treatable_area_type: 'Emr::Private::Models::BodyPart',
                  treatable_area: {
                    id: 44,
                    name: '1st Rib',
                    osics_body_area: {
                      id: 3,
                      name: 'Chest',
                    },
                  },
                  side: {
                    id: 5,
                    name: 'N/A',
                  },
                  name: 'N/A 1st Rib',
                },
                {
                  id: 63495,
                  treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
                  treatable_area: {
                    id: 3,
                    name: 'Chest',
                  },
                  side: {
                    id: 5,
                    name: 'N/A',
                  },
                  name: 'N/A Chest',
                },
              ],
              issue_name: null,
              note: 'Test Modality Note',
              cpt_code: null,
              is_billable: false,
              amount_paid_athlete: null,
              amount_paid_insurance: null,
            },
          ],
          annotation: {
            id: 1904344,
            organisation_annotation_type: null,
            annotationable_type: 'TreatmentSession',
            annotationable: null,
            title: null,
            content: 'Test Note',
            annotation_date: '2022-07-20T23:00:00Z',
            annotation_actions: [],
            expiration_date: null,
            attachments: [],
            archived: false,
            created_by: {
              id: 31369,
              fullname: 'Rory Thornburgh',
            },
            created_at: '2022-07-25T15:26:58Z',
            updated_by: null,
            updated_at: '2022-07-25T15:26:58Z',
          },
        },
      },
    };

    const nextState = treatmentCardListReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: '',
          },
        },
      },
      invalidEditTreatmentCards: [],
    });
  });

  it('returns correct state on SET_TREATMENT_FIELD_VALUE', () => {
    const state = {
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: [],
    };

    const action = {
      type: 'SET_TREATMENT_FIELD_VALUE',
      payload: {
        id: 33197,
        fieldKey: 'date',
        value: '2022-05-22T15:26:58Z',
      },
    };

    const nextState = treatmentCardListReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-05-22T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
    });
  });

  it('returns correct state on CLEAR_SELECTED_TREATMENTS', () => {
    const state = {
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: ['33197'],
    };

    const action = {
      type: 'CLEAR_SELECTED_TREATMENTS',
    };

    const nextState = treatmentCardListReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {},
      invalidEditTreatmentCards: [],
    });
  });

  it('returns correct state on ADD_TREATMENT_ROW', () => {
    const state = {
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: [],
    };

    const action = {
      type: 'ADD_TREATMENT_ROW',
      payload: {
        id: 33197,
      },
    };

    const nextState = treatmentCardListReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
            {
              treatment_modality_id: null,
              duration: null,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
    });
  });

  it('returns correct state on REMOVE_TREATMENT_ROW', () => {
    const state = {
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
            {
              treatment_modality_id: null,
              duration: null,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: [],
    };

    const action = {
      type: 'REMOVE_TREATMENT_ROW',
      payload: {
        id: 33197,
        treatmentIndex: 1,
      },
    };

    const nextState = treatmentCardListReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
    });
  });

  it('returns correct state on REMOVE_ATHLETE', () => {
    const state = {
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
        12345: {
          athlete_id: 12345,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: [],
    };

    const action = {
      type: 'REMOVE_ATHLETE',
      payload: {
        id: 33197,
      },
    };

    const nextState = treatmentCardListReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {
        12345: {
          athlete_id: 12345,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
    });
  });

  it('returns correct state on VALIDATE_EDIT_TREATMENT_CARDS', () => {
    const state = {
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
        12345: {
          athlete_id: 12345,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: null,
              duration: 60,
              reason: 'general',
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
        6789: {
          athlete_id: 6789,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T16:05:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 12,
              duration: 60,
              reason: 'general',
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: [],
    };

    const action = {
      type: 'VALIDATE_EDIT_TREATMENT_CARDS',
    };

    const nextState = treatmentCardListReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteTreatments: {
        33197: {
          athlete_id: 33197,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 39,
              duration: 60,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
        12345: {
          athlete_id: 12345,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T19:35:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: null,
              duration: 60,
              reason: 'general',
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [
                '{"treatable_area_type":"Emr::Private::Models::BodyPart","treatable_area_id":44,"side_id":5}',
                '{"treatable_area_type":"Emr::Private::Models::OsicsBodyArea","treatable_area_id":3,"side_id":5}',
              ],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
        6789: {
          athlete_id: 6789,
          date: '2022-07-25T15:26:58Z',
          user_id: 31369,
          start_time: '2022-07-21T16:05:00Z',
          end_time: '2022-07-21T16:05:00Z',
          timezone: 'Europe/Dublin',
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: 12,
              duration: 60,
              reason: 'general',
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              is_billable: false,
              cpt_code: '',
              amount_paid_insurance: '',
              amount_paid_athlete: '',
              note: '',
            },
          ],
          annotation_attributes: {
            content: 'Test Note',
          },
        },
      },
      invalidEditTreatmentCards: ['6789', '12345', '33197'],
    });
  });
});
