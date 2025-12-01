import assessmentsReducer from '../assessments';
import {
  fetchAssessmentsSuccess,
  deleteAssessmentSuccess,
  deleteAssessmentItemSuccess,
  saveAssessmentItemSuccess,
  saveAssessmentItemCommentsSuccess,
  saveMetricScoresSuccess,
  saveTemplateSuccess,
  deleteTemplateSuccess,
  saveAssessmentSuccess,
  renameTemplateSuccess,
  saveAssessmentItemsOrderSuccess,
  saveAssessmentAthletesSuccess,
  fetchAssessmentWithAnswersSuccess,
} from '../../actions';

describe('assessments reducer', () => {
  const initialState = [
    {
      id: 1,
      assessment_template: { id: 1, name: 'Template name' },
      assessment_date: '2020-02-12T23:00:00.000Z',
      name: 'Assessment 1',
      items: [],
      athletes: [
        { id: 12410, fullname: 'John Doe', avatar_url: '01_fake_avatar_url' },
        { id: 54565, fullname: 'Paul Smith', avatar_url: '02_fake_avatar_url' },
      ],
    },
  ];

  it('returns correct state on FETCH_ASSESSMENTS_SUCCESS', () => {
    const newAssessments = [{ id: 1 }];
    const action = fetchAssessmentsSuccess(newAssessments);
    const nextState = assessmentsReducer([], action);
    expect(nextState).toEqual(newAssessments);
  });

  it('returns correct state on DELETE_ASSESSMENT_SUCCESS', () => {
    const action = deleteAssessmentSuccess(1);
    const currentState = [
      { id: 1, name: 'Assessment 1' },
      { id: 2, name: 'Assessment 2' },
    ];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState).toEqual([{ id: 2, name: 'Assessment 2' }]);
  });

  it('returns correct state on DELETE_ASSESSMENT_ITEM_SUCCESS', () => {
    const action = deleteAssessmentItemSuccess(1, 1);
    const currentState = [
      {
        ...initialState[0],
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
      },
    ];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState[0].items).toEqual([{ id: 2, name: 'Item 2' }]);
  });

  it('returns correct state on SAVE_ASSESSMENT_SUCCESS when adding a new assessment', () => {
    const newAssessment = { id: 2, name: 'New Assessment' };
    const action = saveAssessmentSuccess(newAssessment);
    const currentState = [{ id: 1, name: 'Existing Assessment' }];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState).toEqual([newAssessment, ...currentState]);
  });

  it('returns correct state on SAVE_ASSESSMENT_SUCCESS when updating an existing assessment', () => {
    const updatedAssessment = { id: 1, name: 'Updated Assessment' };
    const action = saveAssessmentSuccess(updatedAssessment);
    const currentState = [
      { id: 1, name: 'Original Assessment' },
      { id: 2, name: 'Another Assessment' },
    ];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState).toEqual([
      updatedAssessment,
      { id: 2, name: 'Another Assessment' },
    ]);
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEM_SUCCESS when adding a new item', () => {
    const existingItem = { id: 1 };
    const newItem = { id: 2 };
    const action = saveAssessmentItemSuccess(1, newItem);
    const currentState = [{ ...initialState[0], items: [existingItem] }];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState[0].items).toEqual([existingItem, newItem]);
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEM_SUCCESS when editing an item', () => {
    const originalItem = { id: 1, name: 'Original' };
    const editedItem = { id: 1, name: 'Edited' };
    const action = saveAssessmentItemSuccess(1, editedItem);
    const currentState = [{ ...initialState[0], items: [originalItem] }];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState[0].items).toEqual([editedItem]);
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEM_COMMENTS_SUCCESS', () => {
    const metricItem = {
      id: 1,
      item_type: 'AssessmentMetric',
      item: { id: 1, answers: [] },
    };
    const statusItem = {
      id: 2,
      item_type: 'AssessmentStatus',
      item: { id: 2, notes: [] },
    };
    const comments = [
      { assessment_item_id: 1, athlete_id: 1, value: '<p>Comment 1</p>' },
      { assessment_item_id: 2, athlete_id: 2, value: '<p>Comment 2</p>' },
    ];
    const action = saveAssessmentItemCommentsSuccess(1, comments);
    const currentState = [
      { ...initialState[0], items: [metricItem, statusItem] },
    ];
    const nextState = assessmentsReducer(currentState, action);

    // Check the first item's answers
    expect(nextState[0].items[0].item.answers[0].note.content).toEqual(
      comments[0].value
    );
    // Check the second item's notes
    expect(nextState[0].items[1].item.notes[0].note.content).toEqual(
      comments[1].value
    );
  });

  it('returns correct state on SAVE_METRIC_SCORES_SUCCESS', () => {
    const item1 = {
      id: 1,
      item: { id: 1, answers: [] },
    };
    const item2 = {
      id: 2,
      item: { id: 2, answers: [] },
    };
    const scores = [
      { assessment_item_id: 1, athlete_id: 1, value: 2, colour: '#f2750f' },
      { assessment_item_id: 2, athlete_id: 2, value: 4, colour: '#2ecb4a' },
    ];
    const action = saveMetricScoresSuccess(1, scores);
    const currentState = [{ ...initialState[0], items: [item1, item2] }];

    const nextState = assessmentsReducer(currentState, action);

    expect(nextState[0].items[0].item.answers).toEqual([]);
    expect(nextState[0].items[1].item.answers).toEqual([]);
  });

  it('returns correct state on SAVE_TEMPLATE_SUCCESS', () => {
    const newTemplate = { id: 3, name: 'New Template' };
    const action = saveTemplateSuccess(1, newTemplate);
    const nextState = assessmentsReducer(initialState, action);
    expect(nextState[0].assessment_template).toEqual(newTemplate);
  });

  it('returns correct state on DELETE_TEMPLATE_SUCCESS', () => {
    const action = deleteTemplateSuccess(1);
    const nextState = assessmentsReducer(initialState, action);
    expect(nextState[0].assessment_template).toBeNull();
  });

  it('returns correct state on RENAME_TEMPLATE_SUCCESS', () => {
    const action = renameTemplateSuccess(1, 'New template name');
    const nextState = assessmentsReducer(initialState, action);
    expect(nextState[0].assessment_template.name).toEqual('New template name');
  });

  it('returns correct state on SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS', () => {
    const reorderedAssessment = { id: 1, items: [{ id: 2 }, { id: 1 }] };
    const action = saveAssessmentItemsOrderSuccess(reorderedAssessment);
    const currentState = [{ id: 1, items: [{ id: 1 }, { id: 2 }] }];
    const nextState = assessmentsReducer(currentState, action);
    expect(nextState).toEqual([reorderedAssessment]);
  });

  it('returns correct state on SAVE_ASSESSMENT_ATHLETES_SUCCESS', () => {
    const newAthletes = [{ id: 78454, fullname: 'Robert Trash' }];
    const action = saveAssessmentAthletesSuccess(1, newAthletes);
    const nextState = assessmentsReducer(initialState, action);
    expect(nextState[0].athletes).toEqual(newAthletes);
  });

  it('returns correct state on FETCH_ASSESSMENT_WITH_ANSWERS_SUCCESS', () => {
    const assessmentWithAnswers = {
      ...initialState[0],
      items: [{ id: 1, name: 'With Answers' }],
    };
    const action = fetchAssessmentWithAnswersSuccess(1, assessmentWithAnswers);
    const nextState = assessmentsReducer(initialState, action);
    expect(nextState).toEqual([assessmentWithAnswers]);
  });
});
