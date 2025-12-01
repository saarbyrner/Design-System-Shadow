import { screen } from '@testing-library/react';

import {
  storeFake,
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import { occurrenceTypeEnumLike } from '@kitman/modules/src/Medical/issues/src/enumLikes';
import HeaderDetails from '@kitman/modules/src/Medical/issues/src/components/IssueHeader/HeaderDetails';

const defaultProps = {
  t: i18nextTranslateStub(),
};

const defaultIssueContext = {
  ...mockedIssueContextValue,
};

const renderComponent = ({
  issueContext = defaultIssueContext,
  props = defaultProps,
} = {}) => {
  return renderWithProvider(
    <MockedIssueContextProvider
      issueContext={{ ...defaultIssueContext, ...issueContext }}
    >
      <HeaderDetails {...{ ...defaultProps, ...props }} />
    </MockedIssueContextProvider>,
    storeFake({
      medicalApi: {},
    })
  );
};

describe('<HeaderDetails />', () => {
  it('does not render the type details content when view type is EDIT', () => {
    expect.hasAssertions();

    renderComponent({
      props: {
        ...defaultProps,
        viewType: 'EDIT',
      },
    });

    const listItems = screen.getAllByRole('listitem');

    expect(listItems[0]).toHaveTextContent('Added on: Feb 10, 2022');
    expect(listItems[1]).toHaveTextContent('Added by: Hugo Beuzeboc');
  });
  it('renders the correct content when view type is PRESENTATION', () => {
    expect.hasAssertions();

    renderComponent({
      props: {
        ...defaultProps,
        viewType: 'PRESENTATION',
      },
    });

    const listItems = screen.getAllByRole('listitem');

    expect(listItems[0]).toHaveTextContent(
      `Type: ${occurrenceTypeEnumLike.recurrence}`
    );
    expect(listItems[1]).toHaveTextContent('Squad: First Team');
    expect(listItems[2]).toHaveTextContent('Added on: Feb 10, 2022');
    expect(listItems[3]).toHaveTextContent('Added by: Hugo Beuzeboc');
  });

  describe('when the issue is new', () => {
    it('renders correctly', () => {
      renderComponent({
        issueContext: {
          issue: {
            ...mockedIssueContextValue.issue,
            occurrence_type: occurrenceTypeEnumLike.new,
          },
        },
        props: { viewType: 'PRESENTATION' },
      });

      const listItems = screen.getAllByRole('listitem');

      expect(listItems[0]).toHaveTextContent(
        `Type: ${occurrenceTypeEnumLike.new}`
      );
    });
  });

  describe('when the issue is a recurrence', () => {
    it('renders correctly', () => {
      renderComponent({
        issueContext: {
          issue: {
            ...mockedIssueContextValue.issue,
            occurrence_type: occurrenceTypeEnumLike.recurrence,
          },
        },
        props: { viewType: 'PRESENTATION' },
      });

      const listItems = screen.getAllByRole('listitem');

      expect(listItems[0]).toHaveTextContent(
        `Type: ${occurrenceTypeEnumLike.recurrence}`
      );
    });
  });

  describe('when the issue is a continuation', () => {
    it('renders the issue title and organisation', () => {
      renderComponent({
        issueContext: {
          issue: {
            ...mockedIssueContextValue.issue,
            occurrence_type: occurrenceTypeEnumLike.continuation,
            issue_occurrence_title: 'Issue title',
            continuation_issue: {
              id: 1,
              issue_occurrence_title: 'Original issue title',
              organisation_name: 'NFL',
            },
          },
        },
        props: { viewType: 'PRESENTATION' },
      });

      const listItems = screen.getAllByRole('listitem');

      expect(listItems[0]).toHaveTextContent(
        `Type: ${occurrenceTypeEnumLike.continuation}`
      );
      expect(listItems[1]).toHaveTextContent(
        'Continuation of: Original issue title (NFL)'
      );

      expect(
        screen.getByRole('link', { name: 'Original issue title (NFL)' })
      ).toHaveAttribute('href', '/medical/athletes/15642/injuries/1');
    });
  });

  describe('squad information', () => {
    it('renders correctly', () => {
      renderComponent({ props: { viewType: 'PRESENTATION' } });

      const listItems = screen.getAllByRole('listitem');

      expect(listItems[1]).toHaveTextContent('Squad: First Team');
    });
  });
});
