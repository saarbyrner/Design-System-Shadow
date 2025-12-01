import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import $ from 'jquery';
import moment from 'moment-timezone';
import { TestProviders } from '@kitman/common/src/utils/test_utils';
import {
  mockedPastAthlete,
  mockedSquadAthletes,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data as mockedIssues } from '../../AddVaccinationSidePanel/__tests__/getAthleteIssues';

import AddTUESidePanel from '../index';

const formFields = {
  athleteSelect:
    '[data-testid="AddTUESidePanel|AthleteSelector"] LoadNamespace(Select)',
  tueDate: '[data-testid="AddTUESidePanel|TUEDate"] LoadNamespace(DatePicker)',
  tueNameInput: '[data-testid="AddTUESidePanel|TUEName"] InputTextField',
  tueExpirationDateInput:
    '[data-testid="AddTUESidePanel|ExpirationDate"] LoadNamespace(DatePicker)',
  associatedInjuriesSelect:
    '[data-testid="AddTUESidePanel|AssociatedInjuries"] LoadNamespace(Select)',
  visibilitySelect:
    '[data-testid="AddTUESidePanel|Visibility"] LoadNamespace(Select)',
  addAttachmentSelect:
    '[data-testid="AddTUESidePanel|AddAttachment"] TooltipMenu',
  actions: '[data-testid="AddTUESidePanel|Actions"] ForwardRef(TextButton)',
};

describe('<AddTUESidePanel />', () => {
  let props;
  let renderTestComponent;

  beforeEach(() => {
    props = {
      isOpen: true,
      squadAthletes: mockedSquadAthletes,
      onClose: sinon.spy(),
      onFileUploadStart: sinon.spy(),
      onFileUploadSuccess: sinon.spy(),
      onFileUploadFailure: sinon.spy(),
      initialDataRequestStatus: sinon.spy(),
      t: (t) => t,
    };
    moment.tz.setDefault('UTC');

    renderTestComponent = (additionalProps = {}) => {
      return (
        <TestProviders
          store={{
            medicalHistory: {},
            medicalApi: {},
          }}
        >
          <AddTUESidePanel {...props} {...additionalProps} />
        </TestProviders>
      );
    };
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('renders the panel with the proper title', () => {
    const wrapper = mount(renderTestComponent());
    expect(wrapper.find('SlidingPanel').props().isOpen).to.eq(true);
    expect(wrapper.find('SlidingPanel').props().title).to.eq('Add TUE');
  });

  it('renders the correct content', () => {
    const wrapper = mount(renderTestComponent());

    const athleteSelect = wrapper.find(formFields.athleteSelect);
    const tueDate = wrapper.find(formFields.tueDate);
    const tueNameInput = wrapper.find(formFields.tueNameInput);
    const tueExpirationDateInput = wrapper.find(
      formFields.tueExpirationDateInput
    );
    const associatedInjuriesSelect = wrapper.find(
      formFields.associatedInjuriesSelect
    );
    const visibilitySelect = wrapper.find(formFields.visibilitySelect);
    const addAttachmentSelect = wrapper.find(formFields.addAttachmentSelect);

    expect(athleteSelect.props().label).to.equal('Athlete');
    expect(tueDate.props().label).to.equal('Date of TUE');
    expect(tueNameInput.props().label).to.equal('Name of TUE');
    expect(tueExpirationDateInput.props().label).to.equal('Expiration date');
    expect(associatedInjuriesSelect.props().label).to.equal(
      'Associated injury / illness'
    );
    expect(associatedInjuriesSelect.props().isDisabled).to.equal(true);
    expect(associatedInjuriesSelect.props().optional).to.equal(true);
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
      // Vaccination/TUE created for Psych visibility only is not working, disabled for now.
      // {
      //   value: 'PSYCH_TEAM',
      //   label: 'Psych team',
      // },
    ]);
    expect(addAttachmentSelect.props().menuItems[0].description).to.equal(
      'File'
    );
  });

  it('enables the athlete issues selector when there is an associated athlete', () => {
    const wrapper = mount(renderTestComponent({ athleteId: 1 }));
    const associatedInjuriesSelect = wrapper.find(
      formFields.associatedInjuriesSelect
    );
    expect(associatedInjuriesSelect.props().isDisabled).to.equal(false);
  });

  it('calls the correct function when clicking the close button', () => {
    const wrapper = mount(renderTestComponent());
    wrapper.find('SlidingPanel').props().onClose();

    expect(props.onClose.calledOnce).to.equal(true);
  });

  it('shows an error message when the initial request fails', async () => {
    const wrapper = mount(
      renderTestComponent({ initialDataRequestStatus: 'FAILURE' })
    );
    expect(wrapper.find('LoadNamespace(AppStatus)').props().status).to.equal(
      'error'
    );
  });

  describe('when selecting a player and the request succeeds', () => {
    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
      sinon
        .stub($, 'ajax')
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
    });

    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
      $.ajax.restore();
    });

    it('populates the associated issues selector with the correct options', async () => {
      const wrapper = mount(renderTestComponent());

      const athleteSelect = wrapper.find(formFields.athleteSelect);

      athleteSelect.props().onChange(1);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      wrapper.update();

      const associatedInjuriesSelect = wrapper.find(
        formFields.associatedInjuriesSelect
      );

      const [openIssues, closedIssues, chronicIssues] =
        associatedInjuriesSelect.props().options;
      expect(openIssues.label).to.equal('Open injury/ illness');
      expect(openIssues.options).to.deep.equal([
        { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
        {
          value: 'Injury_3',
          label:
            'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
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
      expect(chronicIssues.label).to.equal('Chronic Issues');
      expect(chronicIssues.options).to.deep.equal([
        {
          value: 'ChronicInjury_10',
          label: 'Feb 17, 2023 - Test Chronic 1', // Displays title where provided
        },
        {
          value: 'ChronicInjury_11',
          label: 'Feb 17, 2023 - Test Chronic 2', // Displays title where provided
        },
        {
          value: 'ChronicInjury_12',
          label: 'Feb 17, 2023 - 1st CMC joint instability [Right]', // Title not provided
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

      const athleteSelect = wrapper.find(formFields.athleteSelect);
      athleteSelect.props().onChange(1);

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

      const publishButton = wrapper.find(formFields.actions).at(0);

      publishButton.props().onClick();
      wrapper.update();

      const athleteSelect = wrapper.find(formFields.athleteSelect);
      const tueDate = wrapper.find(formFields.tueDate);
      const tueNameInput = wrapper.find(formFields.tueNameInput);
      const tueExpirationDateInput = wrapper.find(
        formFields.tueExpirationDateInput
      );

      expect(athleteSelect.props().invalid).to.equal(true);
      expect(tueDate.props().invalid).to.equal(true);
      expect(tueNameInput.props().invalid).to.equal(true);
      expect(tueExpirationDateInput.props().invalid).to.equal(true);
    });
  });

  describe('saving a new TUE record', () => {
    let api;
    let clock;

    beforeEach(() => {
      const deferred = $.Deferred();
      deferred.resolveWith(null, [{}]);

      api = sinon.stub($, 'ajax');

      api.withArgs(sinon.match({ url: '/file_upload_url' })).returns(deferred);
      api.withArgs(sinon.match({ url: '/attachments' })).returns(deferred);
      api
        .withArgs(
          sinon.match({
            url: '/ui/medical/athletes/2/issue_occurrences?grouped=true',
          })
        )
        .returns($.Deferred().resolveWith(null, [mockedIssues]));

      // for testing the setTimeout calls
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      $.ajax.restore();
      clock.restore();
    });

    it('saves the attachments when clicking the save button', async () => {
      const wrapper = mount(renderTestComponent());

      // Fill the start of the form
      const athleteSelect = wrapper.find(formFields.athleteSelect);
      const tueDate = wrapper.find(formFields.tueDate);
      const tueNameInput = wrapper.find(formFields.tueNameInput);
      const tueExpirationDateInput = wrapper.find(
        formFields.tueExpirationDateInput
      );
      const associatedInjuriesSelect = wrapper.find(
        formFields.associatedInjuriesSelect
      );

      athleteSelect.props().onChange(1);

      // Fetch the issues when selecting an athlete
      expect(api.getCall(0).args[0].url).to.eq(
        '/ui/medical/athletes/1/issue_occurrences'
      );

      expect(api.getCall(0).args[0].data.grouped).to.eq(true);

      // Fill the rest of the form
      tueNameInput.props().onChange({ target: { value: 'TUE name' } });
      tueDate.props().onDateChange('2021-12-21T15:19:24+00:00');
      tueExpirationDateInput.props().onDateChange('2021-12-21T15:19:24+00:00');
      associatedInjuriesSelect
        .props()
        .onChange(['Injury_1', 'Illness_1', 'ChronicInjury_1']);
      const fileAttachementBtn = wrapper.find('TooltipMenu').props()
        .menuItems[0];
      fileAttachementBtn.onClick();
      wrapper.update();

      const uploadFileField = wrapper.find('LoadNamespace(FileUploadField)');
      uploadFileField.props().updateFiles([
        {
          filename: 'file.pdf',
          fileSize: 100,
          fileType: 'application/pdf',
          file: {
            name: 'file.pdf',
            size: 12,
          },
        },
      ]);

      wrapper.update();

      // Click the publish button
      const publishButton = wrapper.find(formFields.actions).at(0);

      publishButton.props().onClick();

      wrapper.update();

      await Promise.resolve();
      expect(api.getCall(1).args[0].url).to.eq('/attachments');
    });

    it('saves the form data when clicking the save button', async () => {
      const wrapper = mount(renderTestComponent());

      // Fill the start of the form

      const athleteSelect = wrapper.find(formFields.athleteSelect);
      const tueDate = wrapper.find(formFields.tueDate);
      const tueNameInput = wrapper.find(formFields.tueNameInput);
      const tueExpirationDateInput = wrapper.find(
        formFields.tueExpirationDateInput
      );
      const associatedInjuriesSelect = wrapper.find(
        formFields.associatedInjuriesSelect
      );

      athleteSelect.props().onChange(1);

      // Fetch the issues when selecting an athlete
      expect(api.getCall(0).args[0].url).to.eq(
        '/ui/medical/athletes/1/issue_occurrences'
      );

      expect(api.getCall(0).args[0].data.grouped).to.eq(true);

      // Fill the rest of the form
      tueNameInput.props().onChange({ target: { value: 'TUE name' } });

      tueDate.props().onDateChange('2021-12-21T15:19:24+00:00');
      tueExpirationDateInput.props().onDateChange('2021-12-21T15:19:24+00:00');
      associatedInjuriesSelect
        .props()
        .onChange(['Injury_1', 'Illness_1', 'ChronicInjury_1']);

      const fileAttachementBtn = wrapper.find('TooltipMenu').props()
        .menuItems[0];
      fileAttachementBtn.onClick();

      wrapper.update();

      // Click the publish button
      const publishButton = wrapper.find(formFields.actions).at(0);

      publishButton.props().onClick();

      wrapper.update();

      await Promise.resolve();
      expect(api.getCall(1).args[0].url).to.eq('/athletes/1/medical_notes');
      expect(api.getCall(1).args[0].data).to.eq(
        JSON.stringify({
          athlete_id: 1,
          note: {
            attachment_ids: [],
            expiration_date: '2021-12-21T15:19:24+00:00',
            injury_ids: [1],
            illness_ids: [1],
            chronic_issue_ids: [1],
            medical_type: 'TUE',
            medical_name: 'TUE name',
            note: 'TUE',
            note_date: '2021-12-21T15:19:24+00:00',
            note_type: 3,
            restricted: false,
            restricted_to_psych: false,
          },
          from_api: true,
          scope_to_org: true,
        })
      );
    });
  });

  describe('[PLAYER MOVEMENT]', () => {
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
    });

    afterEach(() => {
      $.ajax.restore();
      medicalSharedApi.useGetAthleteDataQuery.restore();
    });

    it('correctly sets the min date a TUE can be entered', async () => {
      const wrapper = mount(renderTestComponent({ athleteId: 1 }));

      const athleteSelect = wrapper.find(formFields.athleteSelect);

      athleteSelect.props().onChange(1);

      await wrapper.update();

      await Promise.resolve();
      await Promise.resolve();

      const tueDate = wrapper.find(formFields.tueDate);

      expect(tueDate.props().minDate).to.eq('2022-12-16T05:04:33');
    });
  });
});
