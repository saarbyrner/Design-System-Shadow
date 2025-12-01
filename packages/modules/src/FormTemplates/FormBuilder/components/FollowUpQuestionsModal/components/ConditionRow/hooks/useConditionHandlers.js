// @flow
import { useCallback } from 'react';

const useConditionHandlers = (
  setFollowUpQuestionsModal: Function,
  index: number
) => {
  const addCondition = useCallback(() => {
    setFollowUpQuestionsModal((prevState) => {
      const updatedQuestions = [...prevState];

      const hasMultipleConditions =
        updatedQuestions[index].condition?.conditions?.length > 1;

      updatedQuestions[index] = {
        ...updatedQuestions[index],
        condition: {
          conditions: [
            ...(hasMultipleConditions
              ? updatedQuestions[index].condition.conditions
              : [updatedQuestions[index].condition]),
            {
              type: '==',
              value: '',
              element_id: '',
              value_type: 'string',
              conditions: null,
            },
          ],
          type: 'or', // 'OR' by default
        },
      };

      return updatedQuestions;
    });
  }, [setFollowUpQuestionsModal, index]);

  const removeCondition = useCallback(
    (subIndex: number) => {
      setFollowUpQuestionsModal((prevState) => {
        const updatedQuestions = [...prevState];
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          condition: {
            ...updatedQuestions[index].condition,
            conditions: (
              updatedQuestions[index].condition?.conditions || []
            ).filter((_, idx) => idx !== subIndex),
          },
        };

        if (updatedQuestions[index].condition?.conditions?.length === 1) {
          updatedQuestions[index] = {
            ...updatedQuestions[index],
            condition: {
              ...updatedQuestions[index].condition?.conditions[0],
              conditions: null,
            },
          };
        }

        return updatedQuestions;
      });
    },
    [setFollowUpQuestionsModal, index]
  );

  const handleOperatorChange = useCallback(
    (e: Object) => {
      setFollowUpQuestionsModal((prevState) => {
        const updatedQuestions = [...prevState];
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          condition: {
            ...updatedQuestions[index].condition,
            type: e.target.value,
          },
        };

        return updatedQuestions;
      });
    },
    [setFollowUpQuestionsModal, index]
  );

  return { addCondition, removeCondition, handleOperatorChange };
};

export default useConditionHandlers;
