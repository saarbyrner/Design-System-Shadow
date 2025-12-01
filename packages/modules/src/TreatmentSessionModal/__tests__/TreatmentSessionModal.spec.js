import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import moment from 'moment-timezone';
import TreatmentSessionModal from '../index';

describe('<TreatmentSessionModal /> Component', () => {
  const props = {
    athlete: {
      id: 1234567,
      fullname: 'Test Athlete',
    },
    attachedFiles: [],
    bodyAreaOptions: [
      {
        id: 123,
        name: 'Arm',
        isGroupOption: true,
      },
      {
        id: 1234,
        name: 'Bicep',
        isGroupOption: false,
      },
    ],
    isOpen: false,
    noteContent: '',
    onClickCloseModal: sinon.spy(),
    onAddTreatmentAttributes: sinon.spy(),
    reasonOptions: [
      {
        id: 'broken_arm',
        name: 'Broken Arm [Left]',
        isGroupOption: true,
      },
      {
        id: 'sore_head',
        name: 'Sore Head [N/A]',
        isGroupOption: false,
      },
    ],
    selectedPractitioner: 999,
    selectedTimezone: 'Europe/Dublin',
    onClickSaveTreatmentSession: sinon.spy(),
    t: (t) => t,
    treatmentAttributes: [
      {
        duration: null,
        issue_id: null,
        issue_type: null,
        reason: null,
        treatment_body_areas_attributes: [],
        treatment_modality_id: null,
        note: '',
      },
    ],
    treatmentModalityOptions: [
      {
        key_name: 'modality_one',
        name: 'Modality One',
        isGroupOption: true,
      },
      {
        key_name: 'modality_two',
        name: 'Modality Two',
        isGroupOption: false,
      },
    ],
    treatmentTitle: '',
    users: [{ id: 999, name: 'test' }],
  };

  it('contains a modal', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    const Modal = wrapper.find('Modal');
    expect(Modal).to.have.length(1);
    expect(Modal.props().isOpen).to.eq(false);
  });

  describe('when the date is October 15, 2020 19:59:11', () => {
    let timer;

    beforeEach(() => {
      moment.tz.setDefault('UTC');
      const morningTime = new Date(Date.UTC(2020, 9, 15, 19, 59, 11, 0));
      timer = sinon.useFakeTimers(morningTime.getTime());
    });

    afterEach(() => {
      moment.tz.setDefault();
      timer.restore();
    });

    describe('when the update-time-picker and standard-date-formatting flags are off', () => {
      beforeEach(() => {
        window.featureFlags['update-time-picker'] = false;
        window.featureFlags['standard-date-formatting'] = false;
      });
      it('defaults the treatment date and time correctly', () => {
        const wrapper = shallow(<TreatmentSessionModal {...props} />);

        expect(
          wrapper
            .find('.treatmentSessionModal__date LoadNamespace(DatePicker)')
            .props().value
        ).to.eq('2020-10-15');
        expect(
          wrapper
            .find('.treatmentSessionModal__startTime LoadNamespace(TimePicker)')
            .props()
            .value.format('HH:mm')
        ).to.eq('20:00'); // Timezone is set correctly to Europe/Dublin
        expect(
          wrapper
            .find('.treatmentSessionModal__endTime LoadNamespace(TimePicker)')
            .props().value
        ).to.eq(null);
      });
    });

    describe('when the update-time-picker and standard-date-formatting flags are on', () => {
      beforeEach(() => {
        window.featureFlags['update-time-picker'] = true;
        window.featureFlags['standard-date-formatting'] = true;
      });

      afterEach(() => {
        window.featureFlags['update-time-picker'] = false;
        window.featureFlags['standard-date-formatting'] = false;
      });

      it('defaults the treatment date and time correctly', () => {
        const wrapper = shallow(<TreatmentSessionModal {...props} />);

        expect(
          wrapper
            .find('.treatmentSessionModal__date LoadNamespace(DatePicker)')
            .props().value
        ).to.eq('2020-10-15');
        expect(
          wrapper
            .find('.treatmentSessionModal__startTime LoadNamespace(TimePicker)')
            .props()
            .value.format('HH:mm')
        ).to.eq('20:00'); // Timezone is set correctly to Europe/Dublin
        expect(
          wrapper
            .find('.treatmentSessionModal__endTime LoadNamespace(TimePicker)')
            .props()
            .value.format('HH:mm')
        ).to.eq('20:30'); // Timezone is set correctly to Europe/Dublin
      });
    });
  });

  it('calls the correct props when closing the modal', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    const Modal = wrapper.find('Modal');
    Modal.props().close();
    expect(props.onClickCloseModal.calledOnce).to.eq(true);
  });

  it('shows the athlete name and modal title', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(wrapper.find('.treatmentSessionModal__modalTitle').text()).to.eq(
      'Test Athlete New Treatment Session'
    );
  });

  it('contains a dropdown to choose the practitioner', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__practitioner LoadNamespace(Dropdown)'
      ).length
    ).to.eq(1);
  });

  it('contains a DatePicker component', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__date LoadNamespace(DatePicker)')
        .length
    ).to.eq(1);
  });

  it('contains two TimePicker components', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__dateTimeRow LoadNamespace(TimePicker)'
      ).length
    ).to.eq(2);
  });

  it('contains a TimePicker component for the treatment start time', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      ).length
    ).to.eq(1);
  });

  it('contains a TimePicker component for the treatment end time', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__endTime LoadNamespace(TimePicker)')
        .length
    ).to.eq(1);
  });

  it('contains a dropdown to choose the timezone', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__timezone LoadNamespace(Dropdown)')
        .length
    ).to.eq(1);
  });

  it('contains an InputText component to choose the treatment title', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__title LoadNamespace(InputText)')
        .length
    ).to.eq(1);
  });

  it('shows the total duration of the treatment', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__totalDuration--time').length
    ).to.eq(1);
  });

  it('contains a treatments section', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__treatmentsSection').length
    ).to.eq(1);
    expect(
      wrapper
        .find(
          '.treatmentSessionModal__treatmentsSection .treatmentSessionModal__label'
        )
        .text()
    ).to.eq('Treatments');
  });

  it('contains a GroupedDropdown component to choose the treatment modality', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__modality LoadNamespace(GroupedDropdown)'
      ).length
    ).to.eq(1);
  });

  it('contains a MultiSelectDropdown component to choose the treatment body areas', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__bodyArea LoadNamespace(MultiSelectDropdown)'
      ).length
    ).to.eq(1);
  });

  it('contains a GroupedDropdown component to choose the treatment reason', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__reason LoadNamespace(GroupedDropdown)'
      ).length
    ).to.eq(1);
  });

  it('contains a InputNumeric component to choose the treatment duration', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__duration LoadNamespace(InputNumeric)'
      ).length
    ).to.eq(1);
  });

  it('contains a IconButton component to add a new treatment', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__addTreatment IconButton').length
    ).to.eq(1);
  });

  describe('when the treatment-tracker-iteration-two flag is on', () => {
    beforeEach(() => {
      window.featureFlags['treatment-tracker-iteration-two'] = true;
    });

    afterEach(() => {
      window.featureFlags['treatment-tracker-iteration-two'] = false;
    });

    it('contains a treaetment note TextArea component', () => {
      const wrapper = shallow(<TreatmentSessionModal {...props} />);
      expect(
        wrapper.find('.treatmentSessionModal__row--notes Textarea').length
      ).to.eq(1);
    });
  });

  it('contains a note section with a TextArea component', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find('.treatmentSessionModal__noteText Textarea').length
    ).to.eq(1);
  });

  it('contains a FileUploadArea component', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);
    expect(
      wrapper.find(
        '.treatmentSessionModal__fileUpload LoadNamespace(FileUploadArea)'
      ).length
    ).to.eq(1);
  });

  it('contains a footer with a ForwardRef(TextButton) component to save the treatment', () => {
    const wrapper = shallow(<TreatmentSessionModal {...props} />);

    expect(
      wrapper.find('.treatmentSessionModal__footer ForwardRef(TextButton)')
        .length
    ).to.eq(1);
  });

  describe('when the rich-text-editor feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rich-text-editor': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('contains a Rich Text Editor', () => {
      const wrapper = shallow(<TreatmentSessionModal {...props} />);
      expect(wrapper.find('LoadNamespace(RichTextEditor)').length).to.eq(1);
    });
  });

  describe('when the treatment-and-rehab-templates feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'treatment-and-rehab-templates': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('contains a tooltip menu for applying templates', () => {
      const wrapper = shallow(<TreatmentSessionModal {...props} />);
      const tooltipMenu = wrapper.find('TooltipMenu');
      expect(tooltipMenu.length).to.eq(1);

      tooltipMenu.props().menuItems[0].onClick();

      expect(props.onAddTreatmentAttributes.calledOnce).to.eq(true);
    });
  });

  describe('when the treatment-and-rehab-templates feature flag is not enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'treatment-and-rehab-templates': false,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('does not contain a tooltip menu for applying templates', () => {
      const wrapper = shallow(<TreatmentSessionModal {...props} />);
      const tooltipMenu = wrapper.find('TooltipMenu');
      expect(tooltipMenu.length).to.eq(0);
    });
  });

  describe('when the athlete property is not supplied and athletes are', () => {
    const athletes = [
      { name: 'athlete_01', id: 1 },
      { name: 'athlete_02', id: 2 },
    ];

    it('does not show the athlete name and modal title', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athlete={null} athletes={athletes} />
      );
      expect(wrapper.find('.treatmentSessionModal__modalTitle').text()).to.eq(
        'New Treatment Session'
      );
    });

    it('does not show the treatments section', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athlete={null} athletes={athletes} />
      );
      expect(
        wrapper.find('.treatmentSessionModal__treatmentsSection').length
      ).to.eq(0);
    });

    it('renders and athlete selection dropdown', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athlete={null} athletes={athletes} />
      );
      const dropdownHolder = wrapper.find('.treatmentSessionModal__athlete');
      expect(dropdownHolder.length).to.eq(1);

      const dropdown = dropdownHolder.find('LoadNamespace(Dropdown)');
      expect(dropdown.length).to.eq(1);
    });

    it('calls onSelectAthlete callback when an athlete is selected', () => {
      const onSelectAthlete = sinon.spy();
      const wrapper = shallow(
        <TreatmentSessionModal
          {...props}
          athlete={null}
          athletes={athletes}
          onSelectAthlete={onSelectAthlete}
        />
      );
      const dropdownHolder = wrapper.find('.treatmentSessionModal__athlete');
      expect(dropdownHolder.length).to.eq(1);

      const dropdown = dropdownHolder.find('LoadNamespace(Dropdown)');
      expect(dropdown.length).to.eq(1);

      dropdown.props().onChange(2);

      expect(
        onSelectAthlete.calledOnceWith({
          id: 2,
          fullname: 'athlete_02',
        })
      ).to.eq(true);
    });
  });

  describe('when the athlete and athletes properties are supplied', () => {
    const athletes = [
      { name: 'athlete_01', id: 1 },
      { name: 'athlete_02', id: 2 },
    ];

    const expectedToIgore = [
      'duration',
      'treatmentSession_textarea',
      'filepond',
      'grouped_dropdown',
    ];

    it('does show the treatments section', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athletes={athletes} />
      );
      expect(
        wrapper.find('.treatmentSessionModal__treatmentsSection').length
      ).to.eq(1);
    });

    it('does not require GroupDrodowns to have a picked value', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athletes={athletes} />
      );
      expect(
        wrapper.find('FormValidator').props().inputNamesToIgnore
      ).to.deep.eq(expectedToIgore);
    });

    it('contains am optional label for treatment modality', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athletes={athletes} />
      );

      const treatmentModality = wrapper.find(
        '.treatmentSessionModal__modality'
      );
      expect(treatmentModality.length).to.eq(1);

      expect(
        wrapper.find(
          '.treatmentSessionModal__modality LoadNamespace(GroupedDropdown)'
        ).length
      ).to.eq(1);

      expect(treatmentModality.find('.dropdownWrapper__optional').length).to.eq(
        1
      );
    });

    it('contains am optional label for treatment reason', () => {
      const wrapper = shallow(
        <TreatmentSessionModal {...props} athletes={athletes} />
      );

      const treatmentReason = wrapper.find('.treatmentSessionModal__reason');
      expect(treatmentReason.length).to.eq(1);

      expect(
        wrapper.find(
          '.treatmentSessionModal__reason LoadNamespace(GroupedDropdown)'
        ).length
      ).to.eq(1);

      expect(treatmentReason.find('.dropdownWrapper__optional').length).to.eq(
        1
      );
    });
  });

  describe('when the update-time-picker and standard-date-formatting flags are on', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      window.featureFlags['update-time-picker'] = true;
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags['update-time-picker'] = false;
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('validates successfully even if end time is before start time', () => {
      // NOTE: component logic will alter endTime state so is not before startTime
      const wrapper = mount(<TreatmentSessionModal {...props} isOpen />);

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );

      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T09:00:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');
      validator.props().customValidation({
        attr: () => 'end_time', // validateEndTime only checks name attribute
      });

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(0);
    });

    it('validates as an error when end time is the same as start time', () => {
      const wrapper = mount(<TreatmentSessionModal {...props} isOpen />);

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );

      startTimePicker.props().onChange(moment('2022-05-06T10:30:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-06T10:30:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');
      validator.props().customValidation({
        attr: () => 'end_time', // validateEndTime only checks name attribute
      });

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(1);
    });

    it('validates successfully when end time is after start time', () => {
      const wrapper = shallow(<TreatmentSessionModal {...props} isOpen />);

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );
      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T10:05:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');
      validator.props().customValidation({
        attr: () => 'end_time', // validateEndTime only checks name attribute
      });

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(0);
    });

    it('displays warning when end time is before start time', () => {
      // NOTE: component logic will alter endTime state so is not before startTime
      // EndTime will be at the selected time the day after startTime
      // Warning is to highlight to user they are making a session across midnight

      const testTreatmentAttributes = [
        {
          duration: null,
          issue_id: null,
          issue_type: null,
          reason: 1,
          treatment_body_areas_attributes: [],
          treatment_modality_id: 1,
          note: '',
        },
      ];

      const wrapper = mount(
        <TreatmentSessionModal
          {...props}
          treatmentAttributes={testTreatmentAttributes}
          isOpen
        />
      );

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );

      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T09:00:00.000Z'));
      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--warningMessage').length
      ).to.eq(1);

      const validator = wrapper.find('FormValidator');
      props.onClickSaveTreatmentSession.resetHistory();
      validator.props().successAction();

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(0);
    });

    it('calls onClickSaveTreatmentSession with date string values', () => {
      const testTreatmentAttributes = [
        {
          duration: null,
          issue_id: null,
          issue_type: null,
          reason: 1,
          treatment_body_areas_attributes: [],
          treatment_modality_id: 1,
          note: '',
        },
      ];

      const wrapper = mount(
        <TreatmentSessionModal
          {...props}
          treatmentAttributes={testTreatmentAttributes}
          isOpen
        />
      );

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );
      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T11:20:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');

      props.onClickSaveTreatmentSession.resetHistory();
      validator.props().successAction();

      expect(props.onClickSaveTreatmentSession.called).to.equal(true);

      expect(
        props.onClickSaveTreatmentSession.calledWithExactly(
          '2022-05-07T10:00:00Z',
          '2022-05-07T11:20:00Z'
        )
      ).to.equal(true);
    });

    it('calls onClickSaveTreatmentSession with next day end date string value', () => {
      const testTreatmentAttributes = [
        {
          duration: null,
          issue_id: null,
          issue_type: null,
          reason: 1,
          treatment_body_areas_attributes: [],
          treatment_modality_id: 1,
          note: '',
        },
      ];

      const wrapper = mount(
        <TreatmentSessionModal
          {...props}
          treatmentAttributes={testTreatmentAttributes}
          isOpen
        />
      );

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );
      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T09:00:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');

      props.onClickSaveTreatmentSession.resetHistory();
      validator.props().successAction();

      expect(props.onClickSaveTreatmentSession.called).to.equal(true);

      expect(
        props.onClickSaveTreatmentSession.calledWithExactly(
          '2022-05-07T10:00:00Z',
          '2022-05-08T09:00:00Z'
        )
      ).to.equal(true);
    });
  });

  describe('when the update-time-picker and standard-date-formatting flags are off', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      window.featureFlags['update-time-picker'] = false;
      window.featureFlags['standard-date-formatting'] = false;
    });

    afterEach(() => {
      moment.tz.setDefault();
    });

    it('validates successfully even if end time is before start time', () => {
      // NOTE: component logic will alter endTime state so is not before startTime
      const wrapper = mount(<TreatmentSessionModal {...props} isOpen />);

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );

      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T09:00:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');
      validator.props().customValidation({
        attr: () => 'end_time', // validateEndTime only checks name attribute
      });

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(0);
    });

    it('validates as an error when end time is the same as start time', () => {
      const wrapper = mount(<TreatmentSessionModal {...props} isOpen />);

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );

      startTimePicker.props().onChange(moment('2022-05-06T10:30:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-06T10:30:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');
      validator.props().customValidation({
        attr: () => 'end_time', // validateEndTime only checks name attribute
      });

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(1);
    });

    it('validates successfully when end time is after start time', () => {
      const wrapper = shallow(<TreatmentSessionModal {...props} isOpen />);

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );
      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T10:05:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');
      validator.props().customValidation({
        attr: () => 'end_time', // validateEndTime only checks name attribute
      });

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(0);
    });

    it('displays warning when end time is before start time', () => {
      // NOTE: component logic will alter endTime state so is not before startTime
      // EndTime will be at the selected time the day after startTime
      // Warning is to highlight to user they are making a session across midnight

      const testTreatmentAttributes = [
        {
          duration: null,
          issue_id: null,
          issue_type: null,
          reason: 1,
          treatment_body_areas_attributes: [],
          treatment_modality_id: 1,
          note: '',
        },
      ];

      const wrapper = mount(
        <TreatmentSessionModal
          {...props}
          treatmentAttributes={testTreatmentAttributes}
          isOpen
        />
      );

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );

      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T09:00:00.000Z'));
      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--warningMessage').length
      ).to.eq(1);

      const validator = wrapper.find('FormValidator');
      props.onClickSaveTreatmentSession.resetHistory();
      validator.props().successAction();

      wrapper.update();

      expect(
        wrapper.find('.treatmentSessionModal__endTime--errorMessage').length
      ).to.eq(0);
    });

    it('calls onClickSaveTreatmentSession with date string values', () => {
      const testTreatmentAttributes = [
        {
          duration: null,
          issue_id: null,
          issue_type: null,
          reason: 1,
          treatment_body_areas_attributes: [],
          treatment_modality_id: 1,
          note: '',
        },
      ];

      const wrapper = mount(
        <TreatmentSessionModal
          {...props}
          treatmentAttributes={testTreatmentAttributes}
          isOpen
        />
      );

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );
      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T11:20:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');

      props.onClickSaveTreatmentSession.resetHistory();
      validator.props().successAction();

      expect(props.onClickSaveTreatmentSession.called).to.equal(true);

      expect(
        props.onClickSaveTreatmentSession.calledWithExactly(
          '2022-05-07T10:00:00Z',
          '2022-05-07T11:20:00Z'
        )
      ).to.equal(true);
    });

    it('calls onClickSaveTreatmentSession with next day end date string value', () => {
      const testTreatmentAttributes = [
        {
          duration: null,
          issue_id: null,
          issue_type: null,
          reason: 1,
          treatment_body_areas_attributes: [],
          treatment_modality_id: 1,
          note: '',
        },
      ];

      const wrapper = mount(
        <TreatmentSessionModal
          {...props}
          treatmentAttributes={testTreatmentAttributes}
          isOpen
        />
      );

      const startTimePicker = wrapper.find(
        '.treatmentSessionModal__startTime LoadNamespace(TimePicker)'
      );
      startTimePicker.props().onChange(moment('2022-05-07T10:00:00.000Z'));
      wrapper.update();

      const endTimePicker = wrapper.find(
        '.treatmentSessionModal__endTime LoadNamespace(TimePicker)'
      );
      endTimePicker.props().onChange(moment('2022-05-07T09:00:00.000Z'));
      wrapper.update();

      const validator = wrapper.find('FormValidator');

      props.onClickSaveTreatmentSession.resetHistory();
      validator.props().successAction();

      expect(props.onClickSaveTreatmentSession.called).to.equal(true);

      expect(
        props.onClickSaveTreatmentSession.calledWithExactly(
          '2022-05-07T10:00:00Z',
          '2022-05-08T09:00:00Z'
        )
      ).to.equal(true);
    });
  });
});
