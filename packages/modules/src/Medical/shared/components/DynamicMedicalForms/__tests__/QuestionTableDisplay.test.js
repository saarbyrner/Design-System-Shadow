import { render, screen } from '@testing-library/react';

import QuestionTableDisplay from '../QuestionTableDisplay';
import { mockTableData } from '../mocks/data.mock';


describe('<QuestionTableDisplay />', () => {
  it('renders the correct content for the table', () => {
    render(<QuestionTableDisplay group={mockTableData} expandTable />);

    const questionGroup = screen.getAllByTestId(
      'QuestionTableDisplay|QuestionAndAnswer'
    );
    expect(questionGroup).toHaveLength(22);

    const questions = screen.getAllByTestId('QuestionTableDisplay|Question');
    const answers = screen.getAllByTestId('QuestionTableDisplay|Answer');

    expect(questions[0]).toHaveTextContent('Headache:');
    expect(answers[0]).toHaveTextContent('2');

    expect(questions[21]).toHaveTextContent(
      'Trouble falling asleep (if applicable):'
    );
    expect(answers[21]).toHaveTextContent('2');
  });
});
