/* eslint jest/no-conditional-expect: "off" */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  MockedIssueContextProvider,
  mockedIssueContextValue,
  mockedChronicIssueContextValue,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import PresentationView from '../PresentationView';

describe('PresentationView', () => {
  let component;
  const props = {
    issueDate: '2021-05-01',
    reportedDate: '2022-02-09',
    isFieldVisible: () => true,
    getFieldLabel: (name) => name,
    injuryMechanisms: [{ id: 1, name: 'Other' }],
    issueContactTypes: [
      { name: 'Direct contact', id: 1, parent_id: null },
      { name: 'Indirect Contact', id: 2, parent_id: null },
      {
        name: 'With Other',
        id: 4,
        requires_additional_input: true,
        parent_id: 1,
      },
    ],
    t: i18nextTranslateStub(),
  };

  const expectEventPanelToRender = () => {
    expect(component.getByText('Event:')).toBeInTheDocument();
    expect(
      component.getByText('Chelsea (Away), Champions League (2-1)')
    ).toBeInTheDocument();
    expect(component.getByText('Mechanism:')).toBeInTheDocument();
    expect(component.getByText('Being tackled')).toBeInTheDocument();
    expect(component.getByText('Session completed:')).toBeInTheDocument();
    expect(component.getByText('No')).toBeInTheDocument();
    expect(component.getByText('Position:')).toBeInTheDocument();
    expect(component.getByText('Quarterback')).toBeInTheDocument();
  };

  const renderComponent = (issue) =>
    render(
      <MockedIssueContextProvider issueContext={issue}>
        <PresentationView {...props} />
      </MockedIssueContextProvider>
    );

  const rerenderComponent = (issue) =>
    component.rerender(
      <MockedIssueContextProvider issueContext={issue}>
        <PresentationView {...props} />
      </MockedIssueContextProvider>
    );

  describe('game/training render', () => {
    beforeEach(() => {
      window.featureFlags = { 'nfl-injury-flow-fields': false };
      component = renderComponent(mockedIssueContextValue);
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the correct content', () => {
      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(
        component.getByText('Chelsea (Away), Champions League (2-1)')
      ).toBeInTheDocument();
      expect(component.getByText('Mechanism:')).toBeInTheDocument();
      expect(component.getByText('Being tackled')).toBeInTheDocument();
      expect(component.getByText('Session completed:')).toBeInTheDocument();
      expect(component.getByText('No')).toBeInTheDocument();
      expect(component.getByText('Position:')).toBeInTheDocument();
      expect(component.getByText('Quarterback')).toBeInTheDocument();
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders the correct event fields & content in default flow (nfl-injury-flow-fields is OFF)', () => {
      window.featureFlags['chronic-conditions-updates'] = false;
      expectEventPanelToRender();
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders the correct event fields & content in default flow (nfl-injury-flow-fields is ON)', () => {
      window.featureFlags['chronic-conditions-updates'] = true;
      expectEventPanelToRender();
    });

    it('renders the correct content when the event is unlisted', () => {
      rerenderComponent({
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          game: null,
        },
      });
      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(component.getByText('Unlisted Game')).toBeInTheDocument();
    });

    describe('nfl-injury-flow-fields fields', () => {
      beforeEach(() => {
        window.featureFlags = { 'nfl-injury-flow-fields': true };
      });

      it('renders the correct content with the nfl-injury-flow-fields feature flag', () => {
        rerenderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            issue_contact_type: {
              name: 'With Other',
              id: 4,
              requires_additional_input: true,
              parent_id: 1,
            },
          },
        });
        expect(component.getByText('Reported date:')).toBeInTheDocument();
        expect(component.getByText('Feb 9, 2022')).toBeInTheDocument();
        expect(component.getByText('Presentation:')).toBeInTheDocument();
        expect(component.getByText('Contact Type:')).toBeInTheDocument();
        expect(component.getByText('injury_mechanism:')).toBeInTheDocument();
        expect(
          component.getByText('Direct contact : With Other')
        ).toBeInTheDocument();
        expect(
          component.getByText(
            'Additional description of injury mechanism/circumstances:'
          )
        ).toBeInTheDocument();
        expect(
          component.getByText('Mocked mechanism description')
        ).toBeInTheDocument();
      });

      it('renders the presentation_type other freetext field', () => {
        rerenderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            game: null,
            presentation_type: {
              name: 'Other',
              id: 0,
              require_additional_input: true,
            },
            freetext_components: [
              {
                name: 'presentation_types',
                value: 'Free Text',
              },
            ],
          },
        });
        expect(
          component.getByText('Other - Presentation:')
        ).toBeInTheDocument();
        expect(component.getByText('Free Text')).toBeInTheDocument();
      });

      it('renders the primary_mechanism other freetext field', () => {
        rerenderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            game: null,
            freetext_components: [
              {
                name: 'primary_mechanisms',
                value: 'Free Text',
              },
            ],
          },
        });
        expect(component.getByText('Other - Mechanism:')).toBeInTheDocument();
        expect(component.getByText('Free Text')).toBeInTheDocument();
      });

      it('renders the issue_contact_types other freetext field', () => {
        rerenderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            game: null,
            freetext_components: [
              {
                name: 'issue_contact_types',
                value: 'Free Text',
              },
            ],
          },
        });
        expect(
          component.getByText('Other - Contact Type:')
        ).toBeInTheDocument();
        expect(component.getByText('Free Text')).toBeInTheDocument();
      });

      it('renders the injury_mechanism other freetext field', () => {
        rerenderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            game: null,
            freetext_components: [
              {
                name: 'injury_mechanisms',
                value: 'Free Text',
              },
            ],
          },
        });
        expect(
          component.getByText('Other - injury_mechanism:')
        ).toBeInTheDocument();
        expect(component.getByText('Free Text')).toBeInTheDocument();
      });

      it('renders the date field and disclaimer when the issue is a continuation', () => {
        rerenderComponent({
          ...mockedIssueContextValue,
          isContinuationIssue: true,
        });
        expect(component.getByText('Event information:')).toBeInTheDocument();
        expect(
          component.getByText('Game from a previous organization')
        ).toBeInTheDocument();
      });
    });
  });

  describe('other render', () => {
    beforeEach(() => {
      window.featureFlags = { 'nfl-injury-flow-fields': true };
      component = renderComponent({
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          activity_type: 'other',
        },
      });
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the relevant fields only presentable by other', () => {
      expect(component.getByText('Reported date:')).toBeInTheDocument();
      expect(component.getByText('Feb 9, 2022')).toBeInTheDocument();
      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(component.getByText('Other')).toBeInTheDocument();
      expect(component.getByText('Mechanism:')).toBeInTheDocument();
      expect(component.getByText('Being tackled')).toBeInTheDocument();
      expect(component.getByText('Presentation:')).toBeInTheDocument();
      expect(component.getByText('Contact Type:')).toBeInTheDocument();
      expect(component.getByText('injury_mechanism:')).toBeInTheDocument();
      expect(
        component.getByText(
          'Additional description of injury mechanism/circumstances:'
        )
      ).toBeInTheDocument();
      expect(
        component.getByText('Mocked mechanism description')
      ).toBeInTheDocument();
    });
  });

  describe('prior render', () => {
    describe('[FEATURE-FLAG]: nfl-injury-flow-fields] on', () => {
      beforeEach(() => {
        window.featureFlags = { 'nfl-injury-flow-fields': true };
        component = renderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            activity_type: 'prior',
          },
        });
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders the relevant fields only presentable by prior', () => {
        expect(component.getByText('Event:')).toBeInTheDocument();
        expect(
          component.getByText('Injury Occurred Prior to/Outside of NFL')
        ).toBeInTheDocument();
      });
    });

    describe('[FEATURE-FLAG]: nfl-injury-flow-fields] off', () => {
      beforeEach(() => {
        window.featureFlags = { 'nfl-injury-flow-fields': false };
        component = renderComponent({
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssueContextValue.issue,
            activity_type: 'prior',
          },
        });
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders the relevant fields only presentable by prior', () => {
        expect(component.getByText('Event:')).toBeInTheDocument();
        expect(
          component.getByText('Injury occurred prior to this club')
        ).toBeInTheDocument();
      });
    });
  });

  describe('nonfootball render', () => {
    beforeEach(() => {
      window.featureFlags = { 'nfl-injury-flow-fields': true };
      component = renderComponent({
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          activity_type: 'nonfootball',
        },
      });
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the relevant fields only presentable by nonfootball', () => {
      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(
        component.getByText('Not Club Football-Related')
      ).toBeInTheDocument();
    });
  });

  describe('nonsport render', () => {
    beforeEach(() => {
      component = renderComponent({
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          activity_type: 'nonsport',
        },
      });
    });

    it('renders the relevant fields only presentable by nonsport', () => {
      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(component.getByText('Not club activity')).toBeInTheDocument();
    });
  });

  describe('[chronic-conditions-updated-fields] FF', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['chronic-conditions-updated-fields'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
      window.featureFlags['chronic-conditions-updated-fields'] = false;
    });

    it('displays the Event details for chronic issues correctly when FF chronic-conditions-updates ON', () => {
      window.featureFlags = { 'chronic-conditions-updates': true };
      component = renderComponent({
        ...mockedChronicIssueContextValue,
      });

      rerenderComponent({
        ...mockedChronicIssueContextValue,
        isChronicIssue: true,
      });

      // Correct date label
      expect(component.queryByText('Reported date:')).not.toBeInTheDocument();

      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(
        component.queryByText('Session completed:')
      ).not.toBeInTheDocument();
    });

    it('displays Reported date and other fields in Event details for NON chronic issues when FF chronic-conditions-updated-fields OFF', () => {
      window.featureFlags = {
        'chronic-conditions-updates': false,
        'nfl-injury-flow-fields': true,
      };
      component = renderComponent({
        ...mockedChronicIssueContextValue,
      });

      expect(component.getByText('Reported date:')).toBeInTheDocument();
      expect(component.getByText('Event:')).toBeInTheDocument();
      expect(component.getByText('Session completed:')).toBeInTheDocument();

      rerenderComponent({
        ...mockedChronicIssueContextValue,
        isChronicIssue: false,
      });

      expect(component.getByText('Reported date:')).toBeInTheDocument();
      expect(component.getByText('Event:')).toBeInTheDocument();
    });
  });

  describe('Date of injury field rendering (CI coding system)', () => {
    afterEach(() => {
      window.featureFlags = {};
    });

    it.each([
      {
        description:
          'renders the field when codingSystemIsCI is true and the relevant FF is off',
        hasCiCoding: true,
        pmEditingFF: false,
        shouldRender: true,
      },
      {
        description:
          'does NOT render the field when codingSystemIsCI is true and the relevant FF is on',
        hasCiCoding: true,
        pmEditingFF: true,
        shouldRender: false,
      },
      {
        description:
          'does render the field when codingSystemIsCI is false, even if the FF is off',
        hasCiCoding: false,
        pmEditingFF: false,
        shouldRender: true,
      },
    ])('$description', ({ hasCiCoding, pmEditingFF, shouldRender }) => {
      window.featureFlags = {
        'pm-editing-examination-and-date-of-injury': pmEditingFF,
      };

      // Setup issue context based on whether CI coding is needed
      const testIssueContext = {
        ...mockedIssueContextValue,
        issue: {
          ...mockedIssueContextValue.issue,
          ...(hasCiCoding && {
            coding: {
              [codingSystemKeys.CLINICAL_IMPRESSIONS]: true,
            },
          }),
        },
      };

      component = renderComponent(testIssueContext);

      if (shouldRender) {
        expect(component.getByText('Date of injury:')).toBeInTheDocument();
        expect(component.getByText('May 1, 2021')).toBeInTheDocument();
      } else {
        expect(
          component.queryByText('Date of injury:')
        ).not.toBeInTheDocument();
        expect(component.queryByText('May 1, 2021')).not.toBeInTheDocument();
      }
    });
  });
});
