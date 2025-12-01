import { render, screen, within } from '@testing-library/react';

import QuestionSectionsDisplay from '../QuestionSectionsDisplay';
import {
  mockSections,
  mockQuestionsOnSpace,
  mockQuestionsOnSport,
} from '../mocks/data.mock';

jest.mock('../QuestionGroupDisplay', () => (props) => (
  <div data-testid="QuestionGroupDisplay">{JSON.stringify(props.group)}</div>
));

describe('<QuestionSectionsDisplay />', () => {
  const props = {
    sections: mockSections,
  };

  it('renders the correct content', () => {
    render(<QuestionSectionsDisplay {...props} />);

    const sections = screen.getAllByTestId('QuestionSectionsDisplay|Section');
    expect(sections).toHaveLength(2);

    const section1 = sections[0];
    const section2 = sections[1];

    const sectionTitle1 = within(section1).getByTestId(
      'QuestionSectionsDisplay|Title'
    );
    const sectionTitle2 = within(section2).getByTestId(
      'QuestionSectionsDisplay|Title'
    );

    expect(sectionTitle1).toHaveTextContent('Space');
    expect(sectionTitle2).toHaveTextContent('Sport');

    const section1QuestionGroups = within(section1).getAllByTestId(
      'QuestionGroupDisplay'
    );
    expect(section1QuestionGroups).toHaveLength(4);

    const section2QuestionGroups = within(section2).getAllByTestId(
      'QuestionGroupDisplay'
    );
    expect(section2QuestionGroups).toHaveLength(2);

    expect(section1QuestionGroups[0]).toHaveTextContent(
      JSON.stringify(mockQuestionsOnSpace[0])
    );
    expect(section1QuestionGroups[1]).toHaveTextContent(
      JSON.stringify(mockQuestionsOnSpace[1])
    );
    expect(section1QuestionGroups[2]).toHaveTextContent(
      JSON.stringify(mockQuestionsOnSpace[2])
    );
    expect(section1QuestionGroups[3]).toHaveTextContent(
      JSON.stringify(mockQuestionsOnSpace[3])
    );

    expect(section2QuestionGroups[0]).toHaveTextContent(
      JSON.stringify(mockQuestionsOnSport[0])
    );
    expect(section2QuestionGroups[1]).toHaveTextContent(
      JSON.stringify(mockQuestionsOnSport[2])
    );

    expect(
      within(section2).getByTestId('QuestionSectionsDisplay|Separator')
    ).toBeInTheDocument();
  });
});
