import $ from 'jquery';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as useEventTrackingHook from '@kitman/common/src/hooks/useEventTracking';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { axios } from '@kitman/common/src/utils/services';
import { data as mockedInjuryReportData } from '@kitman/services/src/mocks/handlers/medical/getInjuryReport';
import RosterOverviewTab from '../index';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addTreatmentsSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addVaccinationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addAllergySidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicalAlertSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addConcussionTestResultsSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
      isAthleteSelectable: true,
    },
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  globalApi: {},
  medicalApi: {},
  medicalSharedApi: {},
  medicalHistory: {},
});

const defaultPermissions = DEFAULT_CONTEXT_VALUE.permissions.medical;
const defaultConcussionPermissions =
  DEFAULT_CONTEXT_VALUE.permissions.concussion;

describe('<RosterOverviewTab />', () => {
  const props = {
    fetchGrid: sinon.spy(),
    grid: {
      columns: [
        {
          row_key: 'athlete',
          name: 'Athlete',
          readonly: true,
          id: 1,
          default: true,
        },
        {
          row_key: 'open_injuries_illnesses',
          name: 'Open Injury/ Illness',
          readonly: true,
          id: 2,
          default: true,
        },
        {
          row_key: 'squad',
          name: 'Squad',
          readonly: true,
          id: 3,
          default: true,
        },
        {
          row_key: 'latest_note',
          name: 'Latest Note',
          readonly: true,
          id: 4,
          default: true,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: {
            avatar_url: 'john_do_avatar.jpg',
            fullname: 'John Doh',
            availability: 'unavailable',
            position: 'Scrum Half',
          },
          availability_status: {
            availability: 'unavailable',
            unavailable_since: '45 days',
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [
              {
                id: 1,
                issue_id: 10,
                name: 'Sore Ankle',
                status: 'unavailable',
              },
            ],
          },
          latest_note: {
            title: 'Note 1234',
            date: 'Nov 21, 22',
            content: 'Blah blah blah',
            restricted_annotation: false,
          },
          squad: [{ name: 'Blah', primary: true }],
        },
        {
          id: 2,
          athlete: {
            avatar_url: 'jane_do_avatar.jpg',
            fullname: 'Jane Doh',
            availability: 'injured',
            position: 'Fly Half',
          },
          availability_status: {
            availability: 'unavailable',
            unavailable_since: '45 days',
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [
              {
                id: 2,
                issue_id: 11,
                name: 'Broken Ankle',
                status: 'unavailable',
              },
            ],
          },
          latest_note: {
            title: 'Note 2345',
            date: 'Nov 22, 22',
            content: 'Blah blah blah aaah',
            restricted_annotation: false,
          },
          squad: [
            { name: 'Blah', primary: true },
            { name: 'Blabbedy', primary: false },
          ],
        },
      ],
      next_id: null,
    },
    filters: {
      athlete_name: '',
      positions: [],
      squads: [],
      availabilities: [],
      issues: [],
    },
    onFiltersUpdate: sinon.stub(),
    onOpenAddDiagnosticSidePanel: sinon.spy(),
    onOpenAddIssuePanel: sinon.spy(),
    onOpenAddMedicalNotePanel: sinon.spy(),
    onOpenAddModificationSidePanel: sinon.spy(),
    onOpenAddTreatmentsSidePanel: sinon.spy(),
    onOpenAddAllergySidePanel: sinon.spy(),
    onOpenAddVaccinationPanel: sinon.spy(),
    onOpenAddConcussionTestResultSidePanel: sinon.spy(),
    onOpenAddTUESidePanel: sinon.spy(),
    onSetRequestStatus: sinon.spy(),
    requestStatus: 'PENDING',
    t: (t) => t,
  };

  beforeEach(() => {
    const trackEventSpy = sinon.spy();
    sinon
      .stub(useEventTrackingHook, 'default')
      .returns({ trackEvent: trackEventSpy });
  });

  afterEach(() => {
    useEventTrackingHook.default.restore();
  });

  const getWrapper = (medicalPermissions, concussionPermissions) => {
    return mount(
      <Provider store={store}>
        <RosterOverviewTab {...props} />
      </Provider>,
      {
        wrappingComponent: PermissionsContext.Provider,
        wrappingComponentProps: {
          value: {
            permissions: {
              medical: {
                ...defaultPermissions,
                ...medicalPermissions,
              },
              general: {
                ancillaryRange: { canManage: false },
              },
              concussion: {
                ...defaultConcussionPermissions,
                ...concussionPermissions,
              },
            },
          },
        },
      }
    );
  };

  describe('when loading the initial data', () => {
    it('renders a loader', () => {
      const wrapper = shallow(<RosterOverviewTab {...props} />);
      expect(wrapper.find('DelayedLoadingFeedback')).to.have.length(1);
    });
  });

  describe('when the requests are successful', () => {
    let clock;
    const mockedPositionGroups = [
      {
        id: 1,
        name: 'Position Group 1',
        positions: [
          { id: 1, name: 'Position 1' },
          { id: 2, name: 'Position 2' },
        ],
      },
    ];
    const mockedSquads = [{ id: 1, name: 'Squad 1' }];

    beforeEach(() => {
      clock = sinon.useFakeTimers();

      sinon
        .stub($, 'ajax')
        .withArgs(
          sinon.match({
            url: `/ui/squads/permitted`,
          })
        )
        .returns($.Deferred().resolveWith(null, [mockedSquads]))
        .withArgs(
          sinon.match({
            url: `/medical/rosters/injury_report`,
          })
        )
        .returns($.Deferred().resolveWith(null, [mockedInjuryReportData]))
        .withArgs(
          sinon.match({
            url: `/ui/permissions`,
          })
        )
        .returns($.Deferred().resolveWith(null, []));

      sinon.stub(axios, 'get').resolves({ data: mockedPositionGroups });
    });

    afterEach(() => {
      clock.restore();
      $.ajax.restore();
      axios.get.restore();
    });

    describe('rendering content', () => {
      describe('default permissions', () => {
        it('renders the correct content', async () => {
          const wrapper = getWrapper();
          clock.tick(400);
          await Promise.resolve();
          await Promise.resolve();
          await Promise.resolve();
          await Promise.resolve();
          await Promise.resolve();
          wrapper.update();
          expect(wrapper.find('.rosterOverviewTab')).to.have.length(2);
          expect(
            wrapper.find('AddMedicalNoteSidePanelContainer')
          ).to.have.length(1);
          const addMenuButton = wrapper.find(
            '[data-testid="ActionButtons|TooltipMenu"]'
          );
          expect(addMenuButton).to.have.length(0);
          const printInjuryReportButton = wrapper.find(
            '[data-testid="ActionButtons|InjuryReport"]'
          );
          expect(printInjuryReportButton).to.have.length(0);
          const header = wrapper.find('.rosterOverviewTab header');
          expect(header).to.have.length(1);
          const title = wrapper.find('h3').find('[className$="-title"]');
          expect(title.text()).to.eq('Team');
          const grid = wrapper.find('LoadNamespace(RosterOverviewGrid)');
          expect(grid).to.have.length(1);
        });
      });
    });

    describe('[permissions] permissions.medical.issues.canCreate is true', () => {
      let wrapper;
      let addButton;

      beforeEach(async () => {
        wrapper = getWrapper({ issues: { canCreate: true } });
        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
        addButton = wrapper.find('[data-testid="ActionButtons|TooltipMenu"]');
      });

      it('renders the add action button', () => {
        expect(addButton).to.have.length(1);
      });

      it('renders the correct actions', () => {
        const actionsTooltipMenu = addButton.find('TooltipMenu');
        expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
        expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
          'Injury/ Illness'
        );
      });
    });

    describe('[permissions] permissions.medical.notes.canCreate is true', () => {
      let wrapper;
      let addButton;

      beforeEach(async () => {
        wrapper = getWrapper({ notes: { canCreate: true } });
        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
        addButton = wrapper.find('[data-testid="ActionButtons|TooltipMenu"]');
      });

      it('renders the add action button', () => {
        expect(addButton).to.have.length(1);
      });

      it('renders the correct actions', () => {
        const actionsTooltipMenu = addButton.find('TooltipMenu');
        expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
        expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
          'Note'
        );
      });
    });

    describe('[permissions] permissions.medical.availability.canView', () => {
      let wrapper;

      beforeEach(async () => {
        wrapper = getWrapper({
          availability: {
            canView: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      it('renders the correct filters', () => {
        const filters = wrapper.find('[className$="-filter"]');
        const athleteSearch = filters.at(1).find('LoadNamespace(InputText)');
        const squadSelector = filters.at(2).find('LoadNamespace(Select)');
        const positionSelector = filters.at(3).find('LoadNamespace(Select)');
        const availabilitySelector = filters
          .at(4)
          .find('LoadNamespace(Select)');
        expect(athleteSearch).to.have.length(1);
        expect(squadSelector.props().placeholder).to.eq('Squad');
        expect(positionSelector.props().placeholder).to.eq('Position');
        expect(availabilitySelector.props().placeholder).to.eq('Availability');
      });

      it('defaults the squad select to the active squad', () => {
        const filters = wrapper.find('[className$="-filter"]');
        const squadSelector = filters.at(2).find('LoadNamespace(Select)');
        expect(squadSelector.props().options[0].value).to.eq(
          mockedSquads[0].id
        );
      });
    });

    describe('[feature flag] injured-filter-on-roster-page', () => {
      let wrapper;
      beforeEach(async () => {
        window.setFlag('injured-filter-on-roster-page', true);
        wrapper = getWrapper({
          availability: {
            canView: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        window.setFlag('injured-filter-on-roster-page', false);
        if (wrapper) {
          wrapper.unmount();
        }
      });

      it('renders the injury filter', () => {
        const filters = wrapper.find('[className$="-filter"]');
        const injuredSelector = filters.at(5).find('LoadNamespace(Select)');
        expect(injuredSelector.props().placeholder).to.eq('Injured');
      });

      it('calls the props onFilters Update when a injury option is selected', () => {
        const filters = wrapper.find('[className$="-filter"]');
        const injuredSelector = filters.at(5).find('LoadNamespace(Select)');
        injuredSelector.props().onChange(['open_issues']);
        expect(
          props.onFiltersUpdate.calledWith({
            issues: ['open_issues'],
          })
        ).to.equal(true);
      });
    });

    describe('[feature-flag] availability-info-disabled', () => {
      let wrapper;

      beforeEach(async () => {
        window.setFlag('availability-info-disabled', true);
        wrapper = getWrapper({
          availability: {
            canView: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      it('does not render the availability filter', () => {
        const filters = wrapper.find('[className$="-filter"]');
        expect(filters.at(4).find('LoadNamespace(Select)').exists()).to.eq(
          false
        );
      });
    });

    describe('[permissions] permissions.medical.diagnostics.canCreate', () => {
      let wrapper;

      beforeEach(async () => {
        wrapper = getWrapper({
          diagnostics: {
            canCreate: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      describe('[permission] permissons.medical.diagnostics.canCreate is true', () => {
        it('renders the correct actions', () => {
          const actionsTooltipMenu = wrapper
            .find('[className$="-Actions"]')
            .find('TooltipMenu');
          expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
          expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
            'Diagnostic'
          );
          actionsTooltipMenu.props().menuItems[0].onClick();
          expect(props.onOpenAddDiagnosticSidePanel.calledOnce).to.eq(true);
        });
      });
    });

    describe('[permissions] permissions.medical.treatments.canCreate', () => {
      let wrapper;

      beforeEach(async () => {
        wrapper = getWrapper({
          treatments: {
            canCreate: true,
          },
          issues: {
            canEdit: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      it('renders the correct actions', () => {
        const actionsTooltipMenu = wrapper
          .find('[className$="-Actions"]')
          .find('TooltipMenu');
        expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
        expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
          'Treatment'
        );
        actionsTooltipMenu.props().menuItems[0].onClick();
        expect(props.onOpenAddTreatmentsSidePanel.calledOnce).to.eq(true);
      });
    });

    describe('[permissions] permissions.medical.tue.canCreate', () => {
      let wrapper;

      beforeEach(async () => {
        window.setFlag('pm-show-tue', true);
        wrapper = getWrapper({
          tue: {
            canCreate: true,
          },
          issues: {
            canEdit: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      it('renders the correct actions', () => {
        const actionsTooltipMenu = wrapper
          .find('[className$="-Actions"]')
          .find('TooltipMenu');
        expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
        expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
          'TUE'
        );
        actionsTooltipMenu.props().menuItems[0].onClick();
        expect(props.onOpenAddTUESidePanel.calledOnce).to.eq(true);
      });
    });

    describe('[permissions] permissions.medical.allergy.canCreate', () => {
      let wrapper;

      beforeEach(async () => {
        wrapper = getWrapper({
          allergies: {
            canCreate: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      describe('[permission] permissons.medical.allergies.canCreate is true', () => {
        it('renders the correct actions', () => {
          const actionsTooltipMenu = wrapper
            .find('[className$="-Actions"]')
            .find('TooltipMenu');
          expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
          expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
            'Allergy'
          );
          actionsTooltipMenu.props().menuItems[0].onClick();
          expect(props.onOpenAddAllergySidePanel.calledOnce).to.eq(true);
        });
      });
    });

    describe('[permissions] permissions.medical.vaccinations.canCreate', () => {
      let wrapper;

      beforeEach(async () => {
        wrapper = getWrapper({
          vaccinations: {
            canCreate: true,
          },
          issues: {
            canEdit: true,
          },
        });

        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
      });

      afterEach(() => {
        if (wrapper) {
          wrapper.unmount();
        }
      });

      it('renders the correct actions', () => {
        const actionsTooltipMenu = wrapper
          .find('[className$="-Actions"]')
          .find('TooltipMenu');
        expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
        expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
          'Vaccination'
        );
        actionsTooltipMenu.props().menuItems[0].onClick();
        expect(props.onOpenAddVaccinationPanel.calledOnce).to.eq(true);
      });
    });

    describe('[feature flag] concussion-medical-area', () => {
      beforeEach(async () => {
        window.setFlag('concussion-medical-area', true);
      });

      afterEach(() => {
        window.setFlag('concussion-medical-area', false);
      });

      describe('[permissions] permissions.concussion.canManageNpcAssessments', () => {
        let wrapper;

        beforeEach(async () => {
          wrapper = getWrapper(
            { issues: { canEdit: true } },
            {
              canManageNpcAssessments: true,
            }
          );

          clock.tick(400);
          await Promise.resolve();
          await Promise.resolve();
          await Promise.resolve();
          wrapper.update();
        });

        afterEach(() => {
          if (wrapper) {
            wrapper.unmount();
          }
        });

        it('renders the correct actions', () => {
          const actionsTooltipMenu = wrapper
            .find('[className$="-Actions"]')
            .find('TooltipMenu');
          expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
          expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
            'Concussion test'
          );
          props.onOpenAddConcussionTestResultSidePanel.resetHistory();
          actionsTooltipMenu.props().menuItems[0].subMenuItems[0].onClick();
          expect(
            props.onOpenAddConcussionTestResultSidePanel.calledOnceWith('NPC')
          ).to.eq(true);
        });
      });

      describe('[permissions] permissions.concussion.canManageKingDevickAssessments', () => {
        let wrapper;

        beforeEach(async () => {
          wrapper = getWrapper(
            { issues: { canEdit: true } },
            {
              canManageConcussionAssessments: true,
              canManageKingDevickAssessments: true,
            }
          );

          clock.tick(400);
          await Promise.resolve();
          await Promise.resolve();
          await Promise.resolve();
          wrapper.update();
        });

        afterEach(() => {
          if (wrapper) {
            wrapper.unmount();
          }
        });

        it('renders the correct actions', () => {
          const actionsTooltipMenu = wrapper
            .find('[className$="-Actions"]')
            .find('TooltipMenu');
          expect(actionsTooltipMenu.props().menuItems.length).to.eq(1);
          expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
            'Concussion test'
          );
          props.onOpenAddConcussionTestResultSidePanel.resetHistory();
          // As canManageConcussionAssessments controls NPC as well both options will be present
          actionsTooltipMenu.props().menuItems[0].subMenuItems[1].onClick();
          expect(
            props.onOpenAddConcussionTestResultSidePanel.calledOnceWith(
              'KING-DEVICK'
            )
          ).to.eq(true);
        });
      });
    });

    describe('[permissions] permissions.medical.issues.canCreate is true && [feature-flag] chronic-injury-illness', () => {
      let wrapper;
      let addButton;

      beforeEach(async () => {
        window.setFlag('chronic-injury-illness', true);
        wrapper = getWrapper({ issues: { canCreate: true } });
        clock.tick(400);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();
        addButton = wrapper.find('[data-testid="ActionButtons|TooltipMenu"]');
      });

      afterEach(() => {
        window.setFlag('chronic-injury-illness', false);
      });

      it('renders the add action button', () => {
        expect(addButton).to.have.length(1);
      });

      it('renders the correct actions', () => {
        const actionsTooltipMenu = addButton.find('TooltipMenu');
        expect(actionsTooltipMenu.props().menuItems.length).to.eq(2);
        expect(actionsTooltipMenu.props().menuItems[0].description).to.eq(
          'Injury/ Illness'
        );
        expect(actionsTooltipMenu.props().menuItems[1].description).to.eq(
          'Chronic condition'
        );
      });
    });
  });
});
