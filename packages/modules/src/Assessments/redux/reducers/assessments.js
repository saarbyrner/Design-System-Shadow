// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';
import type { Assessment, AssessmentItem } from '../../types';

export default function (
  state: $PropertyType<Store, 'assessments'> = [],
  action: Action
) {
  switch (action.type) {
    case 'SAVE_ASSESSMENT_ITEM_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id !== action.payload.assessmentId) {
          return assessment;
        }

        const itemIndex = assessment.items.findIndex(
          (assessmentItem) =>
            assessmentItem.id === action.payload.assessmentItem.id
        );

        if (itemIndex >= 0) {
          const newItem = assessment.items.slice();

          newItem[itemIndex] = action.payload.assessmentItem;

          if (newItem[itemIndex].item_type === 'AssessmentMetric') {
            const totalAnswers = newItem[itemIndex].item.answers.length;
            const answerIndex = newItem[itemIndex].item.answers.findIndex(
              (answer) => answer.athlete_id === action.payload.athleteId
            );
            const selectedAnswer =
              // $FlowFixMe at least, there is one answer at this point
              action.payload.assessmentItem.item.answers[answerIndex];

            /* Populate the answers array just with the selected answer */
            // $FlowFixMe at least, there is one answer at this point
            newItem[itemIndex].item.answers.splice(
              0,
              totalAnswers,
              selectedAnswer
            );
          }

          return {
            ...assessment,
            items: newItem,
          };
        }

        return {
          ...assessment,
          items: [...assessment.items, action.payload.assessmentItem],
        };
      });

      return assessments;
    }
    case 'DELETE_ASSESSMENT_SUCCESS': {
      const filteredAssessments: Array<Assessment> = state.filter(
        (assessment) => assessment.id !== action.payload.assessmentId
      );

      return filteredAssessments;
    }
    case 'DELETE_ASSESSMENT_ITEM_SUCCESS': {
      const filteredAssessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id !== action.payload.assessmentId) {
          return assessment;
        }

        return {
          ...assessment,
          items: assessment.items.filter(
            (assessmentItem) =>
              assessmentItem.id !== action.payload.assessmentItemId
          ),
        };
      });

      return filteredAssessments;
    }
    case 'SAVE_ASSESSMENT_SUCCESS': {
      const newOrUpdatedAssessment = action.payload.assessment;
      const existingIndex = state.findIndex(
        (assessment) => assessment.id === newOrUpdatedAssessment.id
      );

      if (existingIndex !== -1) {
        // This is an update to an existing assessment. Replace it in the array.
        const newState = [...state];
        newState[existingIndex] = newOrUpdatedAssessment;
        return newState;
      }

      // This is a new assessment. Add it to the top of the list for visibility.
      return [newOrUpdatedAssessment, ...state];
    }
    case 'FETCH_ASSESSMENTS_SUCCESS': {
      return action.payload.reset
        ? action.payload.assessments
        : [...state, ...action.payload.assessments];
    }
    case 'SAVE_TEMPLATE_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id === action.payload.assessmentId) {
          return {
            ...assessment,
            assessment_template: action.payload.template,
          };
        }
        return assessment;
      });

      return assessments;
    }
    case 'DELETE_TEMPLATE_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.assessment_template?.id === action.payload.templateId) {
          return { ...assessment, assessment_template: null };
        }
        return assessment;
      });

      return assessments;
    }
    case 'RENAME_TEMPLATE_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.assessment_template?.id === action.payload.templateId) {
          return {
            ...assessment,
            assessment_template: {
              id: action.payload.templateId,
              name: action.payload.templateName,
            },
          };
        }
        return assessment;
      });

      return assessments;
    }
    case 'SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) =>
        action.payload.assessment.id === assessment.id
          ? action.payload.assessment
          : assessment
      );

      return assessments;
    }
    case 'SAVE_ASSESSMENT_ATHLETES_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id !== action.payload.assessmentId) {
          return assessment;
        }

        return {
          ...assessment,
          athletes: action.payload.athletes,
        };
      });

      return assessments;
    }

    case 'SAVE_ASSESSMENT_ITEM_COMMENTS_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id !== action.payload.assessmentId) {
          return assessment;
        }

        const { comments } = action.payload;

        const newItems = assessment.items.map((item: AssessmentItem) => {
          const commentIndex = comments.findIndex(
            (comment) => comment.assessment_item_id === item.id
          );

          if (commentIndex >= 0) {
            const newItem = { ...item };
            const newNote = {
              content: comments[commentIndex].value,
              edit_history: null,
            };
            const athleteId = comments[commentIndex].athlete_id;

            if (newItem.item_type === 'AssessmentMetric') {
              const answerIndex = newItem.item.answers.findIndex(
                (note) => note.athlete_id === athleteId
              );

              if (answerIndex >= 0) {
                newItem.item.answers[answerIndex].note = newNote;
              } else {
                // $FlowFixMe This should be populated from the server response so it contains an id.
                newItem.item.answers.push({
                  athlete_id: athleteId,
                  note: newNote,
                });
              }
            }

            if (newItem.item_type === 'AssessmentStatus') {
              const noteIndex = newItem.item.notes.findIndex(
                (note) => note.athlete_id === athleteId
              );

              if (noteIndex >= 0) {
                newItem.item.notes[noteIndex].note = newNote;
              } else {
                // $FlowFixMe This should be populated from the server response so it contains an id.
                newItem.item.notes.push({
                  athlete_id: athleteId,
                  note: newNote,
                });
              }
            }

            return newItem;
          }

          return item;
        });

        return {
          ...assessment,
          items: newItems,
        };
      });

      return assessments;
    }
    case 'SAVE_METRIC_SCORES_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id !== action.payload.assessmentId) {
          return assessment;
        }

        const newItems = assessment.items.map((item) => {
          if (item.item_type !== 'AssessmentMetric') {
            return item;
          }

          const newItem = { ...item };

          action.payload.scores.forEach((score) => {
            if (score.assessment_item_id === item.id) {
              if (newItem.item.answers.length > 0) {
                const answerIndex = newItem.item.answers.findIndex(
                  // eslint-disable-next-line max-nested-callbacks
                  (answer) => answer.athlete_id === score.athlete_id
                );

                if (answerIndex >= 0) {
                  newItem.item.answers[answerIndex].value = score.value;
                  newItem.item.answers[answerIndex].colour = score.colour;
                }
              }
              // $FlowFixMe we need to set an answer with this properties
              newItem.item.answers.push({
                athlete_id: score.athlete_id,
                value: score.value,
                colour: score.colour,
              });
            }
          });

          return newItem;
        });

        return {
          ...assessment,
          items: newItems,
        };
      });

      return assessments;
    }
    case 'FETCH_ASSESSMENT_WITH_ANSWERS_SUCCESS': {
      const assessments: Array<Assessment> = state.map((assessment) => {
        if (assessment.id !== action.payload.assessmentId) {
          return assessment;
        }

        return {
          ...assessment,
          items: action.payload.assessment.items,
        };
      });

      return assessments;
    }

    default:
      return state;
  }
}
