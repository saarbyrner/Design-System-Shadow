import { render, screen } from '@testing-library/react';
import PresentationView from '../PresentationView';

describe('<PresentationView />', () => {
  const mockProps = {
    highlightEmptyQuestions: true,
    conditionalFields: [
      {
        id: 1,
        question: 'Question 1',
        answer: { value: 'Answer 1' },
        order: 2,
        parent_question_id: null,
      },
      {
        id: 2,
        question: 'Question 2',
        answer: { value: '' },
        order: 1,
        parent_question_id: null,
      },
      {
        id: 3,
        question: 'Follow-up Question 1',
        answer: { value: 'Follow-up Answer 1' },
        parent_question_id: 1,
      },
    ],
  };

  it('renders the component questions and follow-up questions', () => {
    render(<PresentationView {...mockProps} />);

    expect(screen.getByText('Question 2:')).toBeInTheDocument();
    expect(screen.getByText('Question 1:')).toBeInTheDocument();
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
    expect(screen.getByText('Follow-up Question 1:')).toBeInTheDocument();
    expect(screen.getByText('Follow-up Answer 1')).toBeInTheDocument();
  });

  it('renders in red question if answer is empty', () => {
    render(<PresentationView {...mockProps} />);
    const emptyQuestion = screen.getByText('Question 2:');
    const color = window.getComputedStyle(emptyQuestion).color;
    const redColorRgb = 'rgb(195, 29, 43)';
    expect(color).toBe(redColorRgb);
  });
});
