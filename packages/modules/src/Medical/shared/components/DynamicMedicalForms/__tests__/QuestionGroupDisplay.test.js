import { render, screen } from '@testing-library/react';
import colors from '@kitman/common/src/variables/colors';

import QuestionGroupDisplay from '../QuestionGroupDisplay';
import { mockQuestionsOnSpace, mockColorGroup } from '../mocks/data.mock';

describe('<QuestionGroupDisplay />', () => {
  it('renders the correct content for single entry group', () => {
    render(<QuestionGroupDisplay group={mockQuestionsOnSpace[0]} />);

    const questionGroup = screen.getAllByTestId(
      'QuestionGroupDisplay|QuestionAndAnswer'
    );
    expect(questionGroup[0]).toBeInTheDocument();

    const question = screen.getByTestId('QuestionGroupDisplay|Question');
    const answer = screen.getByTestId('QuestionGroupDisplay|Answer');

    expect(question).toHaveTextContent('How far is the moon?');
    expect(answer).toHaveTextContent('384,400 km');
  });

  it('renders the correct content for multiple entry group', () => {
    render(<QuestionGroupDisplay group={mockQuestionsOnSpace[1]} />);

    const title = screen.getByTestId('QuestionGroupDisplay|Title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Group title');

    const questionGroup = screen.getAllByTestId(
      'QuestionGroupDisplay|QuestionAndAnswer'
    );

    expect(questionGroup).toHaveLength(3);

    expect(questionGroup[0]).toHaveTextContent('How long was the drive?');
    expect(questionGroup[0]).toHaveTextContent('Just under six months');

    expect(questionGroup[1]).toHaveTextContent('Was there cheese there?');
    expect(questionGroup[1]).toHaveTextContent('no');

    expect(questionGroup[2]).toHaveTextContent('Is it haunted');
    expect(questionGroup[2]).toHaveTextContent('yes');
  });

  it('renders the correct content for range color answer', () => {
    render(<QuestionGroupDisplay group={mockColorGroup} />);

    const questionGroup = screen.getByTestId(
      'QuestionGroupDisplay|QuestionAndAnswer'
    );
    expect(questionGroup).toBeInTheDocument();

    const question = screen.getByTestId('QuestionGroupDisplay|Question');
    const answer = screen.getByTestId('QuestionGroupDisplay|Answer');

    expect(question).toHaveTextContent('Rating:');
    expect(answer).toHaveTextContent('1 :');

    const colorBlock = screen.getByTestId(
      'QuestionGroupDisplay|AnswerRangeColor'
    );

    expect(colorBlock).toHaveStyle(`background-color: ${colors.yellow_100}`);
  });
});
