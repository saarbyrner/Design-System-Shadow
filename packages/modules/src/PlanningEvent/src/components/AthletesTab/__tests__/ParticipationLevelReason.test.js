import $ from 'jquery';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ParticipationLevelReason from '../ParticipationLevelReason';

jest.mock('@kitman/common/src/utils');

describe('<ParticipationLevelReason />', () => {
  const mockedParticipationLevelReasons = [
    { id: 1, value: 1, label: 'Injury/Illness' },
    { id: 2, value: 2, label: 'Non Injury' },
  ];

  beforeEach(() => {
    window.setFlag('planning-participation-reason', true);
  });

  const issues = [
    {
      id: 261,
      pathology: 'Test Pathology 1',
      title: 'Test Pathology 1 Title',
      code: 'FIRST',
      type: 'illness',
      status: 'open',
    },
    {
      id: 259,
      pathology: 'Test Pathology 2',
      issue_occurrence_title: 'Test Pathology 2 Title',
      code: 'SECOND',
      type: 'injury',
      status: 'closed',
    },
    {
      id: 257,
      pathology: 'Test Pathology 3',
      code: 'THIRD',
      type: 'injury',
      status: 'open',
      chronic: true,
    },
    {
      id: 543,
      pathology: null,
      code: 'FOURTH',
      type: 'injury',
      status: 'open',
    },
  ];

  const props = {
    updateAttribute: jest.fn(),
    rowData: {
      id: 1,
      participation_level_reason: 1,
      related_issue: null,
      related_issues: [
        {
          id: 261,
          type: 'illness',
          pathology: 'Test Pathology 1',
          code: 'FIRST',
          status: 'Out',
        },
        {
          id: 259,
          type: 'injury',
          pathology: 'Test Pathology 2',
          code: 'SECOND',
          status: 'Out',
        },
      ],
      athlete: {
        id: 3392,
        fullname: 'Phil Funk',
        avatar_url: '',
        availability: 'unavailable',
        position: 'Unknown',
        issues,
      },
    },
    participationLevelReasons: mockedParticipationLevelReasons,
    disabledRows: [],
    t: (key) => key,
  };

  describe('athlete has issues', () => {
    it('renders correctly when participation level reason is null', async () => {
      render(<ParticipationLevelReason {...props} />);

      const selector = screen.getByText('Participation Level Reason');

      expect(selector).toBeInTheDocument();
    });

    it('shows the athlete issues when clicking on Injury/Illness', async () => {
      const user = userEvent.setup();
      render(<ParticipationLevelReason {...props} />);

      const selector = screen.getByText('Participation Level Reason');

      expect(selector).toBeInTheDocument();

      await user.click(selector);

      const issuesOption = screen.getByText('Injury/Illness');
      expect(issuesOption).toBeInTheDocument();

      await user.hover(issuesOption);

      expect(screen.getByText('Test Pathology 1')).toBeInTheDocument();
    });

    it('shows the Preliminary Injury label if either code or pathology is in a preliminary state', async () => {
      const user = userEvent.setup();
      render(<ParticipationLevelReason {...props} />);

      const selector = screen.getByText('Participation Level Reason');

      expect(selector).toBeInTheDocument();

      await user.click(selector);

      const issuesOption = screen.getByText('Injury/Illness');
      expect(issuesOption).toBeInTheDocument();

      await user.hover(issuesOption);

      expect(screen.getByText('Preliminary Injury')).toBeInTheDocument();
    });

    it('shows the related issue when it already exists', async () => {
      const relatedIssueExists = {
        ...props,
      };
      relatedIssueExists.rowData.related_issue = issues[0];

      render(<ParticipationLevelReason {...relatedIssueExists} />);

      const issuesOption = screen.getByText(
        `Injury/Illness : ${issues[0].pathology}`
      );

      expect(issuesOption).toBeInTheDocument();
    });

    it('shows the Preliminary Injury related issue when it already exists', async () => {
      const relatedIssueExists = {
        ...props,
      };
      relatedIssueExists.rowData.related_issue = issues[3];

      render(<ParticipationLevelReason {...relatedIssueExists} />);

      const issuesOption = screen.getByText(
        `Injury/Illness : Preliminary Injury`
      );

      expect(issuesOption).toBeInTheDocument();
    });
  });

  describe('athlete has no issues', () => {
    const propsNoIssue = {
      updateAttribute: () => {},
      rowData: {
        participation_level_reason: null,
        athlete: {
          id: 3392,
          fullname: 'Athlete No Issues',
          avatar_url: '',
          availability: 'unavailable',
          position: 'Unknown',
          issues: [],
        },
      },
      participationLevelReasons: mockedParticipationLevelReasons,
      disabledRows: [],
      t: (key) => key,
    };

    it('removes injury/illness option when athlete has no open or closed issues', async () => {
      const user = userEvent.setup();
      render(<ParticipationLevelReason {...propsNoIssue} />);

      const selector = screen.getByText('Participation Level Reason');
      expect(selector).toBeInTheDocument();

      user.click(selector);

      const issuesOption = screen.queryByText('Injury/Illness');
      expect(issuesOption).not.toBeInTheDocument();
    });
  });

  describe('when "link-multi-injuries-to-participation-level" FF switched on', () => {
    beforeEach(() => {
      window.setFlag('link-multi-injuries-to-participation-level', true);
    });

    it('user can select single selection participation reason', async () => {
      const user = userEvent.setup();
      render(<ParticipationLevelReason {...props} />);
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        screen.getByText(
          'Injury/Illness - Test Pathology 1 Title, Test Pathology 2 Title'
        )
      ).toBeInTheDocument();

      await user.click(screen.getByRole('textbox'));
      await user.click(screen.getByText('Non Injury'));

      expect(props.updateAttribute).toHaveBeenNthCalledWith(
        1,
        {
          participation_level_reason: 2,
          related_issues: null,
        },
        props.rowData
      );
    });

    it('user can select multiple injuries', async () => {
      const user = userEvent.setup();
      render(<ParticipationLevelReason {...props} />);
      await waitFor(() =>
        expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      );
      expect(
        screen.getByText(
          'Injury/Illness - Test Pathology 1 Title, Test Pathology 2 Title'
        )
      ).toBeInTheDocument();

      await user.click(screen.getByRole('textbox'));
      await user.hover(await screen.findByText('Injury/Illness'));
      // IMPORTANT: user.click doesn’t click the element so fireEvent.click is
      // used.
      fireEvent.click(screen.getByText('Chronic | Test Pathology 3'));
      // doesn't get called until user closes menu
      expect(props.updateAttribute).not.toHaveBeenCalled();

      // click away from menu
      await user.click(
        screen.getByText(
          'Injury/Illness - Test Pathology 1 Title, Test Pathology 2 Title, Test Pathology 3'
        )
      );

      expect(props.updateAttribute).toHaveBeenCalledTimes(1);
      expect(props.updateAttribute).toHaveBeenLastCalledWith(
        {
          participation_level_reason: 1,
          related_issues: [
            {
              related_issue_id: '261',
              related_issue_type: 'illness',
            },
            {
              related_issue_id: '259',
              related_issue_type: 'injury',
            },
            {
              related_issue_id: '257',
              related_issue_type: 'injury',
            },
          ],
        },
        props.rowData
      );
    });

    describe('when related issue is null (edge-case)', () => {
      it('should use valid related issue if exists', async () => {
        render(
          <ParticipationLevelReason
            {...props}
            rowData={{
              ...props.rowData,
              related_issues: [
                {
                  id: 261,
                  type: 'illness',
                  pathology: 'Test Pathology 1',
                  code: 'FIRST',
                  status: 'Out',
                },
                null,
              ],
            }}
          />
        );
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        expect(
          screen.getByText('Injury/Illness - Test Pathology 1 Title')
        ).toBeInTheDocument();
      });

      it('should use participation_level_reason if no valid related issues', async () => {
        render(
          <ParticipationLevelReason
            {...props}
            rowData={{
              ...props.rowData,
              related_issues: [null],
            }}
          />
        );
        await waitFor(() =>
          expect(screen.queryByText('Loading')).not.toBeInTheDocument()
        );

        expect(screen.getByText('Injury/Illness')).toBeInTheDocument();
      });
    });

    describe('when there are no issues associated with the athlete', () => {
      let ajaxRequest;

      beforeEach(() => {
        ajaxRequest = jest.spyOn($, 'ajax');
      });

      afterEach(jest.restoreAllMocks);

      it('doesn’t fetch issue titles', () => {
        render(
          <ParticipationLevelReason
            {...props}
            rowData={{
              ...props.rowData,
              athlete: {
                ...props.rowData.athlete,
                issues: [],
              },
            }}
          />
        );

        expect(ajaxRequest).not.toHaveBeenCalled();
      });
    });
  });
});
