// @flow

import type { SerializedQuestion } from '@kitman/modules/src/ConditionalFields/shared/types';

export const getDescendantQuestionIds = (
  question: SerializedQuestion
): Array<number> => {
  let descendantIds = [];
  if (question.children?.length > 0) {
    question.children.forEach((child) => {
      // Access the id through the nested 'question' property
      descendantIds.push(child.question.id);
      descendantIds = descendantIds.concat(getDescendantQuestionIds(child));
    });
  }
  return descendantIds;
};
