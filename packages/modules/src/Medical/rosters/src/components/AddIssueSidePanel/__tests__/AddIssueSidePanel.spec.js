import $ from 'jquery';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { data as issuesData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { data as mockCI } from '@kitman/services/src/mocks/handlers/medical/clinicalImpressions';
import { data as mockDatalys } from '@kitman/services/src/mocks/handlers/medical/datalys';
import { data as mockSides } from '@kitman/services/src/mocks/handlers/medical/getSides';
import { MOCK_RESPONSE } from '@kitman/modules/src/Medical/shared/services/getIssueFieldsConfig';
import i18n from 'i18next';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { initialStore } from '../../../redux/store';
import AddIssueSidePanel from '../index';
import EventInformation from '../components/EventInformation';

describe('<AddIssueSidePanel />', () => {
  const store = storeFake(initialStore);
  const i18nT = i18nextTranslateStub(i18n);

  const props = {
    preliminarySchema: {
      activity: 'optional',
      game_id: 'optional',
      training_session_id: 'optional',
      position_when_injured_id: 'optional',
      presentation_type: 'optional',
    },
    activityGroups: [],
    activeSquad: {},
    athleteData: {},
    attachedConcussionAssessments: [],
    currentPage: 1,
    enteredInitialNote: '',
    enteredSupplementalPathology: null,
    fetchGameAndTrainingOptions: sinon.spy(),
    gameOptions: [],
    otherEventOptions: [],
    grades: [],
    initialDataRequestStatus: 'SUCCESS',
    isAthleteSelectable: false,
    isBamic: false,
    isOpen: true,
    onAddStatus: sinon.spy(),
    onClose: sinon.spy(),
    onEnterSupplementalPathology: sinon.spy(),
    onRemoveStatus: sinon.spy(),
    onRemoveSupplementalPathology: sinon.spy(),
    onSelectActivity: sinon.spy(),
    onSelectAthlete: sinon.spy(),
    onSelectBamicGrade: sinon.spy(),
    onSelectBamicSite: sinon.spy(),
    onSelectBodyArea: sinon.spy(),
    onSelectClassification: sinon.spy(),
    onSelectCoding: sinon.spy(),
    onSelectContinuationIssue: sinon.spy(),
    onSelectDiagnosisDate: sinon.spy(),
    onSelectEvent: sinon.spy(),
    onSelectExaminationDate: sinon.spy(),
    onSelectIssueType: sinon.spy(),
    onSelectOnset: sinon.spy(),
    onSelectPathology: sinon.spy(),
    onSelectPositionWhenInjured: sinon.spy(),
    onSelectPreviousIssue: sinon.spy(),
    onSelectSessionCompleted: sinon.spy(),
    onSelectSide: sinon.spy(),
    onSelectSquad: sinon.spy(),
    onSelectPresentationType: sinon.spy(),
    onUpdatePresentationFreeText: sinon.spy(),
    onSelectTimeOfInjury: sinon.spy(),
    onUpdateAttachedConcussionAssessments: sinon.spy(),
    onUpdateInitialNote: sinon.spy(),
    onUpdateStatusDate: sinon.spy(),
    onUpdateStatusType: sinon.spy(),
    onUpdatePrimaryMechanismFreetext: sinon.spy(),
    onUpdateInjuryMechanismFreetext: sinon.spy(),
    onChronicConditionOnsetDate: sinon.spy(),
    chronicConditionOnsetDate: null,
    permissions: {
      medical: {
        notes: {
          canCreate: false,
        },
      },
      concussion: {
        canAttachConcussionAssessments: true,
        canManageConcussionAssessments: true,
      },
    },
    positionGroups: [],
    requestStatus: 'SUCCESS',
    selectedActivity: null,
    selectedAthlete: null,
    selectedBamicGrade: null,
    selectedBamicSite: null,
    selectedCoding: {},
    selectedSupplementalCoding: {},
    selectedDiagnosisDate: null,
    selectedEvent: null,
    selectedEventType: null,
    selectedExaminationDate: null,
    selectedIssueType: 'INJURY',
    selectedOnset: null,
    selectedPositionWhenInjured: null,
    selectedPresentationType: null,
    selectedIssue: null,
    selectedSessionCompleted: null,
    selectedSide: null,
    selectedTimeOfInjury: null,
    injuryMechanismFreetext: '',
    primaryMechanismFreetext: '',
    sides: [],
    squadAthletesOptions: [],
    statuses: [{ status: '', date: null }],
    trainingSessionOptions: [],
    injuryStatuses: [
      {
        description: 'Causing unavailability (time-loss)',
        id: 1,
      },
      {
        description: 'Not affecting availability (medical attention)',
        id: 2,
      },
      {
        description: 'Resolved',
        id: 3,
      },
    ],
    conditionalFieldsQuestions: [],
    pathologyGroupRequestStatus: null,
    t: i18nT,
  };
  const componentSelector = (key) => `[data-testid="AddIssueSidePanel|${key}"]`;
  let ajaxStub;

  beforeEach(async () => {
    ajaxStub = sinon.stub($, 'ajax');
    ajaxStub
      .withArgs(sinon.match({ url: '/ui/fields/medical/issues/create_params' }))
      .returns($.Deferred().resolveWith(null, [MOCK_RESPONSE]))
      .withArgs(
        sinon.match({
          url: '/ui/medical/injuries/osics_pathologies',
        })
      )
      .returns($.Deferred().resolveWith(null, [[]]))
      .withArgs(
        sinon.match({
          url: '/ui/medical/datalys_classifications',
        })
      )
      .returns(
        $.Deferred().resolveWith(null, [mockDatalys.datalys_classifications])
      )
      .withArgs(
        sinon.match({
          url: '/ui/medical/clinical_impressions_classifications',
        })
      )
      .returns(
        $.Deferred().resolveWith(null, [
          mockCI.clinical_impression_classifications,
        ])
      )
      .withArgs(
        sinon.match({
          url: '/ui/medical/clinical_impressions_body_areas',
        })
      )
      .returns(
        $.Deferred().resolveWith(null, [mockCI.clinical_impression_body_areas])
      )
      .withArgs(
        sinon.match({
          url: '/ui/medical/datalys_body_areas',
        })
      )
      .returns($.Deferred().resolveWith(null, [mockDatalys.datalys_body_areas]))
      .withArgs(
        sinon.match({
          url: '/ui/medical/sides',
        })
      )
      .returns($.Deferred().resolveWith(null, [mockSides]))

      .withArgs(
        sinon.match({
          url: '/ui/medical/athletes/12/issue_occurrences',
          data: {
            issue_status: 'open',
            grouped: true,
            include_previous_organisation: true,
          },
        })
      )
      .returns($.Deferred().resolveWith(null, [issuesData]))

      .withArgs(
        sinon.match({
          url: '/athletes/12/injuries/2',
          data: { scope_to_org: true, detailed: true },
        })
      )
      .returns(
        $.Deferred().resolveWith(null, [
          { id: 2, athlet: 12, title: 'Issue title' },
        ])
      );

    sinon
      .stub(medicalSharedApi, 'useGetAthleteDataQuery')
      .returns({ data: mockedPastAthlete });
  });

  afterEach(() => {
    medicalSharedApi.useGetAthleteDataQuery.restore();
    $.ajax.restore();
  });

  const codingKey = codingSystemKeys.OSICS_10;

  const mountFunction = ({
    mockedStore = storeFake(initialStore),
    mockedProps = props,
    mockedCodingKey = codingKey,
  }) => {
    return mount(
      <Provider store={mockedStore}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { coding_system_key: mockedCodingKey },
          }}
        >
          <AddIssueSidePanel {...mockedProps} />
        </MockedOrganisationContextProvider>
      </Provider>
    );
  };

  it('renders', () => {
    const wrapper = shallow(<AddIssueSidePanel {...props} />);
    expect(wrapper.find('.addIssueSidePanel')).to.have.length(1);
    expect(
      wrapper.find('.addIssueSidePanel SlidingPanel').props().isOpen
    ).to.eq(true);
    expect(wrapper.find('.addIssueSidePanel SlidingPanel').props().title).to.eq(
      'Add injury/ illness'
    );
  });

  it('shows the first page when currentPage is 1', () => {
    const wrapper = shallow(<AddIssueSidePanel {...props} currentPage={1} />);

    expect(
      wrapper.find(componentSelector('Page1')).props().style
    ).to.deep.equal({
      display: 'block',
    });
  });

  it('shows the first page when currentPage is 2', () => {
    const wrapper = shallow(<AddIssueSidePanel {...props} currentPage={2} />);

    expect(
      wrapper.find(componentSelector('Page2')).props().style
    ).to.deep.equal({
      display: 'block',
    });
  });

  it('shows the first page when currentPage is 3', () => {
    const wrapper = shallow(<AddIssueSidePanel {...props} currentPage={3} />);

    expect(
      wrapper.find(componentSelector('Page3')).props().style
    ).to.deep.equal({
      display: 'block',
    });
  });

  it('shows the first page when currentPage is 4', () => {
    const wrapper = shallow(<AddIssueSidePanel {...props} currentPage={4} />);

    expect(
      wrapper.find(componentSelector('Page4')).props().style
    ).to.deep.equal({
      display: 'block',
    });
  });

  describe('[FORM FIELDS] Initial Information', () => {
    let wrapper;

    it('Progress: contains a progress tracker component with the correct progress', async () => {
      wrapper = mountFunction({ mockedStore: store, mockedProps: props });
      await Promise.resolve();
      wrapper.update();
      expect(wrapper.find('ProgressTracker').props().currentHeadingId).to.eq(1);
    });

    it('Actions: has the correct actions', async () => {
      wrapper = mountFunction({
        mockedProps: {
          ...props,
          selectedIssueType: 'ILLNESS_RECURRENCE',
          selectedAthlete: 12,
        },
      });
      await Promise.resolve();
      wrapper.update();
      const nextAction = wrapper.find(
        '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
      );
      expect(nextAction).to.have.length(1);
      expect(nextAction.text()).to.equal('Next');
    });

    describe('Issue Continuation', () => {
      it('Issue continuation: fetches a list of issues when the user selects an athlete', async () => {
        wrapper = mountFunction({
          mockedProps: {
            ...props,
            selectedIssueType: 'INJURY_CONTINUATION',
            selectedAthlete: 12,
          },
        });
        await Promise.resolve();
        wrapper.update();

        const InitialInformation = wrapper.find(
          'LoadNamespace(InitialInformation)'
        );
        expect(InitialInformation.props().issueIsAContinuation).to.eq(true);
        expect(
          InitialInformation.props().continuationIssueProps.isLoading
        ).to.eq(false);
        expect(
          InitialInformation.props().continuationIssueProps
            .athletePreviousOrganisationIssues
        ).to.deep.eq(issuesData);
      });

      it('Issue continuation: fetches the issue details when selecting an issue', async () => {
        wrapper = mountFunction({
          mockedProps: {
            ...props,
            selectedIssueType: 'INJURY_CONTINUATION',
            selectedAthlete: 12,
          },
        });
        await Promise.resolve();
        wrapper.update();

        // Select an injury
        const InitialInformation = wrapper.find(
          'LoadNamespace(InitialInformation)'
        );
        InitialInformation.props().continuationIssueProps.onSelectContinuationIssue(
          2
        );

        await Promise.resolve();
        wrapper.update();

        expect(
          props.onSelectContinuationIssue.calledWith({
            id: 2,
            athlet: 12,
            title: 'Issue title',
          })
        ).to.equal(true);
        expect(
          wrapper.find('LoadNamespace(InitialInformation)').props()
            .continuationIssueProps.isIssueDetailsLoading
        ).to.equal(false);
      });
    });

    it('Issue continuation: dispatches no prior record when the continuation is outside of the system', async () => {
      wrapper = mountFunction({
        mockedProps: {
          ...props,
          selectedIssueType: 'INJURY_CONTINUATION',
          selectedAthlete: 12,
        },
      });
      await Promise.resolve();
      wrapper.update();

      // Select an injury
      const InitialInformation = wrapper.find(
        'LoadNamespace(InitialInformation)'
      );
      InitialInformation.props().continuationIssueProps.onSelectContinuationIssue(
        -1
      );

      await Promise.resolve();
      wrapper.update();

      // No api call gets fired.
      expect(
        props.onSelectContinuationIssue.calledWith({
          id: -1,
        })
      ).to.equal(true);
    });
  });

  describe('when viewing a past athlete', () => {
    let wrapper;

    it('it passes the correct options for athleteIDProps when viewing a current athlete', async () => {
      wrapper = mountFunction({
        mockedProps: {
          ...props,
          selectedIssueType: 'ILLNESS_RECURRENCE',
          selectedAthlete: 12,
          activeSquad: {
            id: 8,
            name: 'International Squad',
          },
          athleteData: {
            id: 1,
            fullname: 'John Doe',
            squad_names: [
              { name: 'Squad 1', id: 1 },
              { name: 'Squad 2', id: 2 },
              { name: 'Squad 3', id: 3 },
              { name: 'Squad 4', id: 4 },
            ],
          },
        },
      });
      await Promise.resolve();
      wrapper.update();
      const initialInformation = wrapper.find(
        'LoadNamespace(InitialInformation)'
      );
      expect(initialInformation).to.have.length(1);
      expect(initialInformation.props().athleteIDProps.value).to.eq(12);
    });

    it('it passes the correct options for athleteIDProps when viewing a past athlete', async () => {
      wrapper = mountFunction({
        mockedProps: {
          ...props,
          selectedIssueType: 'ILLNESS_RECURRENCE',
          selectedAthlete: 24,
          activeSquad: {
            id: 24,
            name: 'WWE',
          },
        },
      });

      await Promise.resolve();
      wrapper.update();
      const initialInformation = wrapper.find(
        'LoadNamespace(InitialInformation)'
      );
      expect(initialInformation).to.have.length(1);
      expect(initialInformation.props().athleteIDProps.value).to.eq(24);
      expect(
        initialInformation.props().athleteIDProps.squadAthletesOptions
      ).to.deep.eq([
        { label: 'Macho Man Randy Savage', value: 24, squad_id: 24 },
      ]);
    });
  });

  describe('[FORM FIELDS] Event Information', () => {
    it('Progress: contains a progress tracker component with the correct progress', async () => {
      const wrapper = mountFunction({
        mockedStore: store,
        mockedProps: { ...props, currentPage: 3 },
      });
      await Promise.resolve();
      wrapper.update();
      expect(wrapper.find('ProgressTracker').props().currentHeadingId).to.eq(3);
    });

    it('Event: has a game_id field when the selectedEvent is not other', async () => {
      const wrapper = mountFunction({
        mockedProps: {
          ...props,
          currentPage: 3,
          selectedEvent: 'literaly_anything_else',
        },
      });
      await Promise.resolve();
      wrapper.update();
      const Page3 = wrapper.find(componentSelector('Page3'));
      expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
      expect(Page3.find('LoadNamespace(Select)').at(0).props().label).to.eq(
        'Event'
      );
    });

    it('Event: has a game_id field which is disabled if no athlete selected', async () => {
      const wrapper = mountFunction({
        mockedProps: {
          ...props,
          currentPage: 3,
          selectedEvent: 'literaly_anything_else',
        },
      });
      await Promise.resolve();
      wrapper.update();
      const Page3 = wrapper.find(componentSelector('Page3'));
      expect(
        Page3.find('LoadNamespace(Select)').at(0).props().isDisabled
      ).to.eq(true);
    });

    it('Event: does not have activity_id, position_when_injured_id, Session completed or time of injury when selectedIssueType is ILLNESS', async () => {
      const wrapper = mountFunction({
        mockedProps: {
          ...props,
          currentPage: 3,
          selectedEvent: 'literaly_anything_else',
          selectedIssueType: 'ILLNESS',
        },
      });
      await Promise.resolve();
      wrapper.update();
      const Page3 = wrapper.find(componentSelector('Page3'));
      expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
      expect(Page3.find('LoadNamespace(TimePicker)')).to.have.length(0);
      expect(Page3.find('SegmentedControl')).to.have.length(0);
      expect(Page3.find('InputNumeric')).to.have.length(0);
    });

    it('Event: does not have activity_id, position_when_injured_id, Session completed or time of injury when selectedIssueType is INJURY and no event is selected', async () => {
      const wrapper = mountFunction({
        mockedProps: { ...props, currentPage: 3, selectedIssueType: 'INJURY' },
      });
      await Promise.resolve();
      wrapper.update();
      const Page3 = wrapper.find(componentSelector('Page3'));
      expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
      expect(Page3.find('LoadNamespace(TimePicker)')).to.have.length(0);
      expect(Page3.find('SegmentedControl')).to.have.length(0);
      expect(Page3.find('InputNumeric')).to.have.length(0);
    });

    it('Mechanism: has a activity_id field when the selectedEvent is other', async () => {
      const wrapper = mountFunction({
        mockedProps: {
          ...props,
          currentPage: 3,
          selectedEvent: 'other',
          selectedEventType: 'other',
        },
      });
      await Promise.resolve();
      wrapper.update();
      const Page3 = wrapper.find(componentSelector('Page3'));
      expect(Page3.find('LoadNamespace(Select)')).to.have.length(3);
      expect(Page3.find('LoadNamespace(Select)').at(2).props().label).to.eq(
        'Mechanism'
      );
    });

    describe('[FEATURE FLAG] medical-additional-event-info-events ON', () => {
      beforeEach(() => {
        window.featureFlags['medical-additional-event-info-events'] = true;
      });
      afterEach(() => {
        window.featureFlags['medical-additional-event-info-events'] = false;
      });

      it('Correctly validates fields for injury when the selectedEvent is game', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'game',
            selectedEventType: 'game',
          },
        });
        await Promise.resolve();
        wrapper.update();

        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(4);
        expect(Page3.find('LoadNamespace(Select)').at(0).props().label).to.eq(
          'Event'
        );
        expect(Page3.find('LoadNamespace(Select)').at(2).props().label).to.eq(
          'Mechanism'
        );
        expect(Page3.find('LoadNamespace(Select)').at(3).props().label).to.eq(
          'Position'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        const eventInfoComponent = wrapper.find(EventInformation);

        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          true
        );

        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(true);

        // RenderPresentationTypeSelect() only present for NFL so should be valid to allow progress when non NFL flow
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(false);
      });

      it('Correctly validates fields for injury when the selectedEvent is other', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'other',
            selectedEventType: 'other',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(3);
        expect(Page3.find('LoadNamespace(Select)').at(2).props().label).to.eq(
          'Mechanism'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        const eventInfoComponent = wrapper.find(EventInformation);
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          true // Invalid as activity_id is required
        );

        // Selection UI from renderPositionWhenInjuredSelect() only present when selected event is NOT other
        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(false);

        // RenderPresentationTypeSelect() only present for NFL so should be valid to allow progress when non NFL flow
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(false);
      });

      it('Correctly validates fields for injury when the selectedEventType is nonsport', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'other',
            selectedEventType: 'nonsport',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
        expect(Page3.find('LoadNamespace(Select)').at(0).props().label).to.eq(
          'Event'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        // When FEATURE FLAG medical-additional-event-info-events is on
        // It skips validation of activity_id, position_when_injured_id, presentation_type
        const eventInfoComponent = wrapper.find(EventInformation);
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          false
        );
        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(false);

        // RenderPresentationTypeSelect() only present for NFL so should be valid to allow progress when non NFL flow
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(false);
      });

      it('Correctly validates fields for injury when the selectedEventType is prior', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'other',
            selectedEventType: 'prior',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
        expect(Page3.find('LoadNamespace(Select)').at(0).props().label).to.eq(
          'Event'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        // When FEATURE FLAG medical-additional-event-info-events is on
        // It skips validation of activity_id, position_when_injured_id, presentation_type
        const eventInfoComponent = wrapper.find(EventInformation);
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          false
        );
        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(false);

        // RenderPresentationTypeSelect() only present for NFL so should be valid to allow progress when non NFL flow
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(false);
      });
    });

    describe('[FEATURE FLAG] medical-additional-event-info-events OFF', () => {
      beforeEach(() => {
        window.featureFlags['medical-additional-event-info-events'] = false;
      });

      it('Correctly validates fields for injury when the selectedEvent is game', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'game',
            selectedEventType: 'game',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(4);
        expect(Page3.find('LoadNamespace(Select)').at(2).props().label).to.eq(
          'Mechanism'
        );
        expect(Page3.find('LoadNamespace(Select)').at(3).props().label).to.eq(
          'Position'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        const eventInfoComponent = wrapper.find(EventInformation);

        // When FEATURE FLAG medical-additional-event-info-events is off
        // Then validation is not skipped
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          true
        );

        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(true);

        // Maintaining existing checks but unclear why we validate this
        // as selection UI from renderPresentationTypeSelect() only present for NFL
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(true);
      });

      it('Correctly validates fields for injury when the selectedEvent is other', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'other',
            selectedEventType: 'other',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(3);
        expect(Page3.find('LoadNamespace(Select)').at(2).props().label).to.eq(
          'Mechanism'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        const eventInfoComponent = wrapper.find(EventInformation);

        // When FEATURE FLAG medical-additional-event-info-events is off
        // Then validation is not skipped
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          true
        );
        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(true);

        // Maintaining existing checks but unclear why we validate this
        // as selection UI from renderPresentationTypeSelect() only present for NFL
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(true);
      });

      it('Correctly validates fields for injury when the selectedEventType is nonsport', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'other',
            selectedEventType: 'nonsport',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
        expect(Page3.find('LoadNamespace(Select)').at(0).props().label).to.eq(
          'Event'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        // When FEATURE FLAG medical-additional-event-info-events is off
        // Then validation is not skipped
        const eventInfoComponent = wrapper.find(EventInformation);
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          true
        );
        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(true);

        // Maintaining existing checks but unclear why we validate this
        // as selection UI from renderPresentationTypeSelect() only present for NFL
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(true);
      });

      it('Correctly validates fields for injury when the selectedEventType is prior', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedIssueType: 'INJURY',
            selectedEvent: 'other',
            selectedEventType: 'prior',
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(Page3.find('LoadNamespace(Select)')).to.have.length(2);
        expect(Page3.find('LoadNamespace(Select)').at(0).props().label).to.eq(
          'Event'
        );

        const nextAction = wrapper.find(
          '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
        );
        expect(nextAction).to.have.length(1);
        expect(nextAction.text()).to.equal('Next');

        // Click next to trigger validation
        nextAction.props().onClick();
        wrapper.update();

        // When FEATURE FLAG medical-additional-event-info-events is off
        // Then validation is not skipped
        const eventInfoComponent = wrapper.find(EventInformation);
        expect(eventInfoComponent.props().activityIDProps.isInvalid).to.equal(
          true
        );
        expect(
          eventInfoComponent.props().positionWhenInjuredProps.isInvalid
        ).to.equal(true);

        // Maintaining existing checks but unclear why we validate this
        // as selection UI from renderPresentationTypeSelect() only present for NFL
        expect(
          eventInfoComponent.props().presentationTypeProps.isInvalid
        ).to.equal(true);
      });
    });

    it('Position: has a position_when_injured_id field when the selectedEvent is not other', async () => {
      const wrapper = mountFunction({
        mockedProps: {
          ...props,
          currentPage: 3,
          selectedEvent: 'game',
          selectedEventType: 'game',
        },
      });
      await Promise.resolve();
      wrapper.update();
      const Page3 = wrapper.find(componentSelector('Page3'));
      expect(Page3.find('LoadNamespace(Select)')).to.have.length(4);
      expect(Page3.find('LoadNamespace(Select)').at(3).props().label).to.eq(
        'Position'
      );
    });

    it('Actions: has the correct actions', async () => {
      const wrapper = mountFunction({
        mockedProps: { ...props, currentPage: 3 },
      });
      await Promise.resolve();
      wrapper.update();
      const nextAction = wrapper.find(
        '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
      );
      expect(nextAction).to.have.length(1);
      expect(nextAction.text()).to.equal('Next');
    });

    describe('[FEATURE FLAG] nfl-injury-flow-fields', () => {
      beforeEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = true;
      });
      afterEach(() => {
        window.featureFlags['nfl-injury-flow-fields'] = false;
      });

      it('Event: does not include unlisted game and unlisted session and includes prior and nonfootball', async () => {
        const wrapper = mountFunction({
          mockedProps: {
            ...props,
            currentPage: 3,
            selectedDiagnosisDate: new Date(),
          },
        });
        await Promise.resolve();
        wrapper.update();
        const Page3 = wrapper.find(componentSelector('Page3'));
        expect(
          Page3.find('LoadNamespace(Select)').at(0).props().options
        ).to.deep.eq([
          {
            label: 'Other',
            options: [
              {
                label: 'Other',
                value: 'other_other',
              },
              {
                label: 'Not Club Football-Related',
                value: 'other_nonfootball',
              },
              {
                label: 'Injury Occurred Prior to/Outside of NFL',
                value: 'other_prior',
              },
            ],
          },
        ]);
      });
    });
  });

  describe('[FEATURE FLAG] preliminary-injury-illness', () => {
    beforeEach(() => {
      window.featureFlags['preliminary-injury-illness'] = true;
    });
    afterEach(() => {
      window.featureFlags['preliminary-injury-illness'] = false;
    });
    it('Actions: has the correct actions', async () => {
      const wrapper = mountFunction({
        mockedProps: { ...props, currentPage: 3 },
      });
      await Promise.resolve();
      wrapper.update();
      const actions = wrapper.find(
        '.addIssueSidePanel__panelActionContainer ForwardRef(TextButton)'
      );
      expect(actions).to.have.length(2);
      expect(actions.at(0).text()).to.equal('Save Progress');
      expect(actions.at(1).text()).to.equal('Next');
    });
  });

  describe('[REQUEST STATUS] it display the correct state for the request status', () => {
    it('displays an error state', () => {
      const wrapper = shallow(
        <AddIssueSidePanel {...props} requestStatus="FAILURE" />
      );
      expect(wrapper.find('.addIssueSidePanel')).to.have.length(1);
      expect(wrapper.find('LoadNamespace(AppStatus)').props().status).to.eq(
        'error'
      );
    });

    it('displays a loading state', () => {
      const wrapper = shallow(
        <AddIssueSidePanel {...props} requestStatus="PENDING" />
      );
      expect(wrapper.find('.addIssueSidePanel')).to.have.length(1);
      expect(wrapper.find('LoadNamespace(AppStatus)').props().status).to.eq(
        'loading'
      );
    });

    it('does not display the app status', () => {
      const wrapper = shallow(
        <AddIssueSidePanel {...props} requestStatus="SUCCESS" />
      );
      expect(wrapper.find('.addIssueSidePanel')).to.have.length(1);
      expect(wrapper.find('LoadNamespace(AppStatus)')).to.have.length(0);
    });
  });

  describe('[FEATURE FLAG] chronic-injury-illness', () => {
    let wrapper;

    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
    });
    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
    });

    describe('with props.selectedIssueType = CHRONIC_INJURY', () => {
      it('should show Chronic condition panel', async () => {
        wrapper = shallow(
          <AddIssueSidePanel {...props} selectedIssueType="CHRONIC_INJURY" />
        );
        expect(wrapper.props().children.props.title).to.eq(
          'Add chronic condition'
        );
      });

      it('should not show Chronic condition panel', async () => {
        wrapper = shallow(
          <AddIssueSidePanel {...props} selectedIssueType="INJURY" />
        );
        expect(wrapper.props().children.props.title).to.not.eq(
          'Add chronic condition'
        );
      });
    });
  });

  describe('[FEATURE FLAG] chronic-conditions-updated-fields', () => {
    let wrapper;

    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
      window.featureFlags['chronic-conditions-updated-fields'] = true;
    });
    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
      window.featureFlags['chronic-conditions-updated-fields'] = false;
    });

    it('should show only the Initial Information and Diagnosis Information sections', async () => {
      wrapper = shallow(
        <AddIssueSidePanel {...props} selectedIssueType="CHRONIC_INJURY" />
      );
      expect(wrapper.props().children.props.title).to.eq(
        'Add chronic condition'
      );
      expect(
        wrapper.props().children.props.children.props.children[0].props.children
          .props.headings.length
      ).to.eq(2);
      expect(
        wrapper.props().children.props.children.props.children[0].props.children
          .props.headings[0].name
      ).to.eq('Initial Information');
      expect(
        wrapper.props().children.props.children.props.children[0].props.children
          .props.headings[1].name
      ).to.eq('Diagnosis Information');
    });
  });
});
