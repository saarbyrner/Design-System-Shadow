import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { colors } from '@kitman/common/src/variables';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';

import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';

import PlayerLeftForm from '../index';

const mockTransferRecord = {
  data_sharing_consent: true,
  joined_at: null,
  left_at: '2022-11-22T05:01:08-05:00',
  transfer_type: 'Trade',
};

describe('<PlayerLeftForm/>', () => {
  const props = {
    issueHasOutstandingFields: false,
    playerTransferRecord: mockTransferRecord,
    t: i18nextTranslateStub(),
  };

  describe('render content', () => {
    describe('when the player is onTrial', () => {
      let container;
      let buttons;
      const playerOnTrialProp = {
        athleteData: { constraints: { organisation_status: 'TRIAL_ATHLETE' } },
      };

      beforeEach(() => {
        container = render(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <PlayerLeftForm {...props} {...playerOnTrialProp} />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        ).container;
        buttons = container.getElementsByClassName(
          'textButton--kitmanDesignSystem'
        );
      });

      it('does not render the content', () => {
        expect(screen.queryByText(/Action required/i)).not.toBeInTheDocument();
        expect(
          screen.queryByText(
            /Player moved on 22 Nov 2022. Update status or mark as player left club./i
          )
        ).not.toBeInTheDocument();

        expect(buttons).toHaveLength(0);
      });
    });

    describe('when the player has not been marked as having left the club', () => {
      let container;
      let buttons;

      beforeEach(() => {
        container = render(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <PlayerLeftForm {...props} />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        ).container;
        buttons = container.getElementsByClassName(
          'textButton--kitmanDesignSystem'
        );
      });

      it('renders the correct initial content', () => {
        expect(screen.getByText(/Action required/i)).toBeInTheDocument();
        expect(
          screen.getByText(
            /Player moved on 22 Nov 2022. Update status or mark as player left club./i
          )
        ).toBeInTheDocument();

        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('Update');
      });

      it('toggles the correct state', async () => {
        await userEvent.click(buttons[0]);
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent('Cancel');
        expect(buttons[0]).toBeEnabled();
        expect(buttons[1]).toHaveTextContent('Save');
        expect(buttons[1]).toBeEnabled();
      });
    });

    describe('when organisation does not own the issue', () => {
      let container;
      let buttons;

      beforeEach(() => {
        container = render(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 47 },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <PlayerLeftForm {...props} />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        ).container;
        buttons = container.getElementsByClassName(
          'textButton--kitmanDesignSystem'
        );
      });

      it('does not render any actions', () => {
        expect(screen.getByText(/Action required/i)).toBeInTheDocument();
        expect(
          screen.getByText(
            /Player moved on 22 Nov 2022. Update status or mark as player left club./i
          )
        ).toBeInTheDocument();

        expect(screen.getByTestId('PlayerLeftForm|Wrapper')).toHaveStyle(
          `background: ${colors.grey_200};`
        );

        expect(buttons).toHaveLength(0);
      });
    });

    describe('[feature flag] display-plc-for-all-injuries', () => {
      let buttons;

      beforeEach(() => {
        window.featureFlags['display-plc-for-all-injuries'] = true;
        const { container } = render(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <PlayerLeftForm
                {...props}
                playerTransferRecord={{ ...mockTransferRecord, left_at: null }}
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        );
        buttons = container.getElementsByClassName(
          'textButton--kitmanDesignSystem'
        );
      });
      afterEach(() => {
        window.featureFlags['display-plc-for-all-injuries'] = false;
      });

      it('renders the correct initial content', () => {
        expect(
          screen.getByText(
            'Ensure all statuses are added and mark "Player left Club" if injury not Resolved when player moved'
          )
        ).toBeInTheDocument();

        expect(screen.getByTestId('PlayerLeftForm|Wrapper')).toHaveStyle(
          `color: ${colors.s18};`
        );
        expect(screen.getByTestId('PlayerLeftForm|Wrapper')).toHaveStyle(
          `background: ${colors.white};`
        );

        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('Update');
        expect(buttons[0]).toBeEnabled();
      });

      it('toggles the correct state', async () => {
        await userEvent.click(buttons[0]);
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent('Cancel');
        expect(buttons[0]).toBeEnabled();
        expect(buttons[1]).toHaveTextContent('Save');
        expect(buttons[1]).toBeEnabled();
      });
    });

    describe('[feature flag] disable-plc-if-outstanding-questions', () => {
      let buttons;
      let rerenderComponent;

      beforeEach(() => {
        window.featureFlags['preliminary-injury-illness'] = true;
        window.featureFlags['disable-plc-if-outstanding-questions'] = true;
        const { rerender, container } = render(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <PlayerLeftForm
                {...{ ...props, issueHasOutstandingFields: true }}
                playerTransferRecord={{ ...mockTransferRecord, left_at: null }}
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        );
        rerenderComponent = rerender;
        buttons = container.getElementsByClassName(
          'textButton--kitmanDesignSystem'
        );
      });
      afterEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
        window.featureFlags['disable-plc-if-outstanding-questions'] = false;
      });

      it('disables the update button if there are outstanding fields', async () => {
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('Update');
        expect(buttons[0]).toBeDisabled();
      });

      it('enables the update button if there are no outstanding fields', async () => {
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('Update');
        expect(buttons[0]).toBeDisabled();

        rerenderComponent(
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
            }}
          >
            <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
              <PlayerLeftForm
                {...{ ...props, issueHasOutstandingFields: false }}
                playerTransferRecord={{ ...mockTransferRecord, left_at: null }}
              />
            </MockedIssueContextProvider>
          </MockedOrganisationContextProvider>
        );

        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveTextContent('Update');
        expect(buttons[0]).toBeEnabled();
      });
    });
  });
});
