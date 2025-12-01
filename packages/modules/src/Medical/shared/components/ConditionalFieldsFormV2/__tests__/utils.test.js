import { getDescendantQuestionIds } from '../utils';

describe('getDescendantQuestionIds', () => {
  it('should return an empty array for a question with no children', () => {
    const question = {
      question: {
        id: 1,
      },
      children: [],
    };
    expect(getDescendantQuestionIds(question)).toEqual([]);
  });

  it('should return the id of a direct child', () => {
    const question = {
      question: {
        id: 1,
      },
      children: [
        {
          question: {
            id: 2,
          },
          children: [],
        },
      ],
    };
    expect(getDescendantQuestionIds(question)).toEqual([2]);
  });

  it('should return the ids of nested children', () => {
    const question = {
      question: {
        id: 1,
      },
      children: [
        {
          question: {
            id: 2,
          },
          children: [
            {
              question: {
                id: 3,
              },
              children: [],
            },
          ],
        },
        {
          question: {
            id: 4,
          },
          children: [],
        },
      ],
    };
    expect(getDescendantQuestionIds(question)).toEqual([2, 3, 4]);
  });
});
