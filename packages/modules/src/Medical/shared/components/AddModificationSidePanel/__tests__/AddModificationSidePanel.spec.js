import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import $ from 'jquery';
import moment from 'moment-timezone';
import { data as mockedIssues } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { data as mockedModifications } from '@kitman/services/src/mocks/handlers/medical/getMedicalNotes';
import { TestProviders } from '@kitman/common/src/utils/test_utils';

import {
  mockedPastAthlete,
  mockedSquadAthletes,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';

import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import AddModificationSidePanel from '../index';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../contexts/IssueContext/utils/mocks';

const mockedModificationType = {
  id: 2564,
  name: 'Modification note',
};

const props = {
  isOpen: true,
  squadAthletes: mockedSquadAthletes,
  onClose: sinon.spy(),
  t: (t) => t,
};

let ajaxStub;

const renderTestComponent = (additionalProps = {}) => {
  return (
    <TestProviders
      store={{
        medicalHistory: {},
        medicalApi: {},
      }}
    >
      <AddModificationSidePanel {...props} {...additionalProps} />
    </TestProviders>
  );
};

const stubAJAX = () => {
  ajaxStub = sinon.stub($, 'ajax');
  ajaxStub
    .withArgs(
      sinon.match({
        url: '/ui/annotations/modification_type',
      })
    )
    .returns($.Deferred().resolveWith(null, [mockedModificationType]))
    .withArgs(sinon.match({ url: '/medical/modifications/search' }))
    .returns($.Deferred().resolveWith(null, [mockedModifications]))
    .withArgs(
      sinon.match({
        url: '/ui/medical/athletes/1/issue_occurrences',
        data: {
          grouped: true,
        },
      })
    )
    .returns($.Deferred().resolveWith(null, [mockedIssues.groupedIssues]))
    .withArgs(
      sinon.match({
        url: '/medical/modifications',
      })
    )
    .returns($.Deferred().resolveWith(null, []));

  return ajaxStub;
};

describe('<AddModificationSidePanel />', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  context('when mounting the panel', () => {
    describe('when the request to fetch the modification type succeeds', () => {
      beforeEach(() => {
        stubAJAX();
      });

      afterEach(() => {
        moment.tz.setDefault();
        $.ajax.restore();
      });

      it('renders the panel with the proper title', async () => {
        const wrapper = shallow(<AddModificationSidePanel {...props} />);

        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();

        expect(wrapper.find('SlidingPanel').props().isOpen).to.eq(true);
        expect(wrapper.find('SlidingPanel').props().title).to.eq(
          'Add modification'
        );
      });

      it('renders the active modifications', async () => {
        const wrapper = mount(renderTestComponent({ athleteId: 1 }));

        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();

        const activeModification = wrapper.find('Accordion');

        const activeModificationTitle = activeModification
          .find('[className$="-activeModificationTitle"]')
          .at(0);
        expect(activeModificationTitle.text()).to.equal('Rehab update');

        const activeModificationDate = activeModification
          .find('[className$="-activeModificationDate"]')
          .at(0);
        expect(activeModificationDate.text()).to.equal('Jun 23, 2021');

        const activeModificationDescription = activeModification
          .find('[className$="-activeModificationDescription"]')
          .at(0);
        expect(activeModificationDescription.text()).to.equal(
          mockedModifications.medical_notes[0].content
        );
      });

      it('renders the form correctly', async () => {
        const wrapper = mount(renderTestComponent());

        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();

        const playerSelect = wrapper.find(
          '[className$="-player"] LoadNamespace(Select)'
        );
        expect(playerSelect.props().label).to.equal('Athlete');

        const titleInput = wrapper.find(
          '[className$="-modificationTitle"] InputTextField'
        );
        expect(titleInput.props().label).to.equal('Title');

        const startDatePicker = wrapper.find(
          '[className$="-startDate"] LoadNamespace(DatePicker)'
        );
        expect(startDatePicker.props().label).to.equal('Start date');

        const endDatePicker = wrapper.find(
          '[className$="-endDate"] LoadNamespace(DatePicker)'
        );
        expect(endDatePicker.props().label).to.equal('End date');
        expect(endDatePicker.props().optional).to.equal(true);

        const detailsEditor = wrapper.find('LoadNamespace(RichTextEditor)');
        expect(detailsEditor.props().label).to.equal('Modification details');

        const athleteIssuesSelect = wrapper.find(
          '[className$="-athleteIssues"] LoadNamespace(Select)'
        );
        expect(athleteIssuesSelect.props().label).to.equal(
          'Associated injury/ illness'
        );
        expect(athleteIssuesSelect.props().isDisabled).to.equal(true);
        expect(athleteIssuesSelect.props().optional).to.equal(true);

        const visibilitySelect = wrapper.find(
          '[className$="-visibility"] LoadNamespace(Select)'
        );
        expect(visibilitySelect.props().label).to.equal('Visibility');
        expect(visibilitySelect.props().options).to.deep.eq([
          {
            value: 'DEFAULT',
            label: 'Default visibility',
          },
          {
            value: 'DOCTORS',
            label: 'Doctors',
          },
          {
            value: 'PSYCH_TEAM',
            label: 'Psych team',
          },
        ]);
      });

      it('enables the athlete issues selector when there is an associated athlete', async () => {
        const wrapper = mount(renderTestComponent({ athleteId: 1 }));

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();

        const athleteIssuesSelect = wrapper.find(
          '[className$="-athleteIssues"] LoadNamespace(Select)'
        );
        expect(athleteIssuesSelect.props().isDisabled).to.equal(false);
      });

      it('calls the correct function when clicking the close button', () => {
        const wrapper = shallow(<AddModificationSidePanel {...props} />);
        wrapper.find('SlidingPanel').props().onClose();

        expect(props.onClose.calledOnce).to.equal(true);
      });

      it('shows an error message when the initial request fails', async () => {
        const wrapper = mount(
          renderTestComponent({ initialDataRequestStatus: 'FAILURE' })
        );
        expect(
          wrapper.find('LoadNamespace(AppStatus)').props().status
        ).to.equal('error');
      });
    });

    describe('when the request to fetch the modification type fails', () => {
      beforeEach(() => {
        sinon
          .stub($, 'ajax')
          .withArgs(
            sinon.match({
              url: '/ui/annotations/modification_type',
            })
          )
          .returns($.Deferred().reject());
      });

      afterEach(() => {
        $.ajax.restore();
      });

      it('shows an error message when the request fails', async () => {
        const wrapper = mount(renderTestComponent());

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        wrapper.update();

        expect(
          wrapper.find('LoadNamespace(AppStatus)').props().status
        ).to.equal('error');
      });
    });
  });

  describe('when selecting a player and the request succeeds', () => {
    beforeEach(() => {
      stubAJAX();
    });

    afterEach(() => {
      $.ajax.restore();
    });

    it('populates the associated issues selector with the correct options', async () => {
      const wrapper = mount(renderTestComponent());

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );
      playerSelect.props().onChange(1);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      wrapper.update();

      const athleteIssuesSelect = wrapper.find(
        '[className$="-athleteIssues"] LoadNamespace(Select)'
      );

      const [openIssues, closedIssues] = athleteIssuesSelect.props().options;
      expect(openIssues.label).to.equal('Open injury/ illness');
      expect(openIssues.options).to.deep.equal([
        { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
        {
          value: 'Injury_3',
          label:
            'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
        },
        {
          value: 'Injury_11',
          label: 'May 23, 2020 - Preliminary',
        },
        {
          value: 'Injury_400',
          label: 'May 23, 2020 - Acute Concussion [N/A]',
        },
      ]);
      expect(closedIssues.label).to.equal('Prior injury/illness');
      expect(closedIssues.options).to.deep.equal([
        {
          value: 'Injury_1',
          label:
            'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
        },
        { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
        {
          value: 'Illness_3',
          label: 'Feb 4, 2020 - Emotional stress',
        },
      ]);
    });
  });

  describe('when selecting a player and the request fails', () => {
    beforeEach(() => {
      sinon
        .stub($, 'ajax')
        .withArgs(
          sinon.match({
            url: '/ui/medical/athletes/1/issue_occurrences',
            data: {
              grouped: true,
            },
          })
        )
        .returns($.Deferred().reject());
    });

    afterEach(() => {
      $.ajax.restore();
    });

    it('shows an error message when the request fails', async () => {
      const wrapper = mount(renderTestComponent());

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );
      playerSelect.props().onChange(1);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      wrapper.update();

      expect(wrapper.find('LoadNamespace(AppStatus)').props().status).to.equal(
        'error'
      );
    });
  });

  describe('when saving without setting the required fields', () => {
    it('sets the required fields as invalid', () => {
      const wrapper = mount(renderTestComponent());

      // Click saveButton
      const saveButton = wrapper.find('ForwardRef(TextButton)');
      saveButton.props().onClick();
      wrapper.update();

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );
      expect(playerSelect.props().invalid).to.equal(true);

      const titleInput = wrapper.find(
        '[className$="-modificationTitle"] InputTextField'
      );
      expect(titleInput.props().invalid).to.equal(true);

      const detailsEditor = wrapper.find('LoadNamespace(RichTextEditor)');
      expect(detailsEditor.props().isInvalid).to.equal(true);
    });
  });

  describe('when saving after setting the required fields', () => {
    let api;

    beforeEach(() => {
      api = stubAJAX();
    });

    afterEach(() => {
      $.ajax.restore();
    });

    it('saves the form with the correct data', async () => {
      const storeFake = (state) => ({
        default: () => {},
        subscribe: () => {},
        dispatch: () => {},
        getState: () => ({ ...state }),
      });

      const store = storeFake({
        addDiagnosticAttachmentSidePanel: {
          isOpen: false,
        },
        medicalApi: {},
        toasts: [],
        medicalHistory: {},
      });

      const wrapper = mount(
        <Provider store={store}>
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddModificationSidePanel {...props} />
          </MockedIssueContextProvider>
        </Provider>
      );

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      wrapper.update();

      // Set required fields
      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );
      playerSelect.props().onChange(1);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      wrapper.update();

      const titleInput = wrapper.find(
        '[className$="-modificationTitle"] InputTextField'
      );
      titleInput.props().onChange({ target: { value: 'New modification' } });

      const startDatePicker = wrapper.find(
        '[className$="-startDate"] LoadNamespace(DatePicker)'
      );
      startDatePicker.props().onDateChange('2020-03-27T00:00:00.000Z');

      const detailsEditor = wrapper.find('LoadNamespace(RichTextEditor)');
      detailsEditor.props().onChange('Details of new modification');

      wrapper.update();

      // Click saveButton
      const saveButton = wrapper.find('ForwardRef(TextButton)').first();
      saveButton.props().onClick();

      expect(api.getCall(3).args[0].url).to.eq('/medical/modifications');
      expect(api.getCall(3).args[0].data).to.eq(
        JSON.stringify({
          annotationable_type: 'Athlete',
          organisation_annotation_type_id: 2564,
          document_note_category_ids: [],
          annotationable_id: 1,
          title: 'New modification',
          annotation_date: '2020-03-27T00:00:00+00:00',
          content: 'Details of new modification',
          illness_occurrence_ids: [],
          injury_occurrence_ids: [mockedIssueContextValue.issue.id],
          chronic_issue_ids: [],
          restricted_to_doc: false,
          restricted_to_psych: false,
          attachments_attributes: [],
          annotation_actions_attributes: [],
          scope_to_org: true,
        })
      );
    });
  });

  describe('[PLAYER MOVEMENT] - player-movement-entity-modifications FF ON', () => {
    let api;

    beforeEach(() => {
      api = sinon.stub($, 'ajax');

      api
        .withArgs(
          sinon.match({
            url: '/ui/medical/athletes/1/issue_occurrences',
            data: {
              grouped: true,
              include_issue: true,
            },
          })
        )
        .returns($.Deferred().resolveWith(null, [mockedIssues.groupedIssues]));
      sinon
        .stub(medicalSharedApi, 'useGetAthleteDataQuery')
        .returns({ data: mockedPastAthlete });

      window.featureFlags['player-movement-entity-modifications'] = true;
    });

    afterEach(() => {
      $.ajax.restore();
      medicalSharedApi.useGetAthleteDataQuery.restore();
      window.featureFlags['player-movement-entity-modifications'] = false;
    });

    it('correctly sets the min date range on the StartDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 1 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|StartDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().minDate).to.eq('2022-12-16T05:04:33');
    });

    it('correctly sets the max date range on the StartDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 1 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|StartDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().maxDate).to.eq('2023-01-28T23:59:59');
    });

    it('correctly sets the min date range on the EndDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 5 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|EndDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().label).to.equal('End date');
      expect(startDate.props().minDate).to.equal('2022-12-16T05:04:33');
    });

    it('correctly sets the max date range on the EndDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 5 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|EndDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().label).to.equal('End date');
      expect(startDate.props().maxDate).to.equal('2023-01-28T23:59:59');
    });
  });

  describe('[PLAYER MOVEMENT] - player-movement-entity-modifications FF OFF', () => {
    let api;

    beforeEach(() => {
      moment.tz.setDefault('UTC');

      api = sinon.stub($, 'ajax');

      api
        .withArgs(
          sinon.match({
            url: '/ui/medical/athletes/1/issue_occurrences',
            data: {
              grouped: true,
              include_issue: true,
            },
          })
        )
        .returns($.Deferred().resolveWith(null, [mockedIssues.groupedIssues]));
      sinon
        .stub(medicalSharedApi, 'useGetAthleteDataQuery')
        .returns({ data: mockedPastAthlete });

      window.featureFlags['player-movement-entity-modifications'] = false;
    });

    afterEach(() => {
      moment.tz.setDefault();
      $.ajax.restore();
      medicalSharedApi.useGetAthleteDataQuery.restore();
    });

    it('correctly sets the min date range on the StartDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 1 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|StartDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().minDate).to.eq('2022-12-16T05:04:33');
    });

    it('correctly sets the max date range on the StartDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 1 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|StartDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().maxDate).to.eq('2023-01-28T23:59:59');
    });

    it('correctly sets the min date range on the EndDate picker to equal the annotation date', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 5 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|EndDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().label).to.equal('End date');

      const annotationDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|StartDate"] LoadNamespace(DatePicker)'
      );

      // its set to the annotation date
      expect(startDate.props().minDate.toString()).to.equal(
        annotationDate.props().value.toString()
      );
    });

    it('does not set the max date range on the EndDate picker', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 5 }));

      const playerSelect = wrapper.find(
        '[className$="-player"] LoadNamespace(Select)'
      );

      playerSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const startDate = wrapper.find(
        '[data-testid="AddModificationSidePanel|EndDate"] LoadNamespace(DatePicker)'
      );

      expect(startDate.props().label).to.equal('End date');
      expect(startDate.props().maxDate).to.equal(false);
    });
  });
});
