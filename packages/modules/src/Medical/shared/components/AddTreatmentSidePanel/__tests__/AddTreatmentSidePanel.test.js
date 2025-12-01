import $ from 'jquery';
import moment from 'moment-timezone';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockedCurrentUser } from '@kitman/services/src/mocks/handlers/medical/getCurrentUser';
import { Provider } from 'react-redux';
import { getTreatmentSessionsOptions as mockTreatmentSessionsOptions } from '../mocks/getTreatmentSessionsOptions';
import mockDuplicateTreatment from '../mocks/mockDuplicateTreatment';
import mockedSquadAthletes from '../mocks/mockedSquadAthletes';
import mockStafUsers from '../mocks/mockStafUsers';

import AddTreatmentSidePanel from '..';

describe('<AddTreatmentSidePanel/>', () => {
  moment.tz.setDefault('Europe/Dublin');

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
    medicalHistory: {},
  });

  let api;

  const props = {
    athleteId: null,
    initialDataRequestStatus: null,
    isAthleteSelectable: false,
    isDuplicatingTreatment: false,
    duplicateTreatment: mockDuplicateTreatment,
    isOpen: true,
    onSaveTreatment: jest.fn(),
    onClose: jest.fn(),
    onFileUploadStart: jest.fn(),
    onFileUploadSuccess: jest.fn(),
    onFileUploadFailure: jest.fn(),
    staffUsers: mockStafUsers,
    squadAthletes: mockedSquadAthletes,
    t: i18nextTranslateStub(),
  };

  const mountWithProvider = (otherProps) => {
    return (
      <Provider store={store}>
        <AddTreatmentSidePanel {...props} {...otherProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    document.body.dataset.timezone = 'Europe/Dublin';
    moment.tz.setDefault('UTC');
    i18nextTranslateStub();
    api = sinon.stub($, 'ajax');
    api
      .withArgs(
        sinon.match({
          url: '/ui/current_user',
        })
      )
      .returns($.Deferred().resolveWith(null, [mockedCurrentUser]))
      .withArgs(
        sinon.match({
          url: '/medical/athletes/3/treatment_session_options',
        })
      )
      .returns($.Deferred().resolveWith(null, [mockTreatmentSessionsOptions]));
  });

  afterEach(() => {
    $.ajax.restore();
  });

  describe('content', () => {
    let mockedDate;
    let timer;

    beforeEach(() => {
      mockedDate = moment('2020-10-15T08:00:00');
      timer = sinon.useFakeTimers(mockedDate.toDate());
    });

    afterEach(() => {
      timer.restore();
    });

    it('renders the default form', async () => {
      let container;
      await act(async () => {
        container = render(mountWithProvider()).container;
      });

      expect(
        screen.getByTestId('AddTreatmentForm|Athlete')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Practitioner')
      ).toBeInTheDocument();

      const startDate = container.querySelector(`input[name="start_date"]`);
      const endDate = container.querySelector(`input[name="end_date"]`);

      expect(startDate).toHaveValue('15 Oct 2020');
      expect(endDate).toHaveValue('15 Oct 2020');

      const dateFields = container.querySelectorAll('.rc-time-picker-input');
      const startTime = dateFields[0];
      expect(startTime).toHaveValue('9:00 am');
      const endtime = dateFields[1];
      expect(endtime).toHaveValue('9:30 am');

      expect(screen.getByTestId('AddTreatmentForm|Timezone')).toHaveTextContent(
        'Europe/Dublin'
      );

      const treatmentTitle = container.querySelector(`input[name="title"]`);
      expect(treatmentTitle).toHaveValue('Treatment note');

      expect(
        screen.getByTestId('AddTreatmentForm|TotalDuration')
      ).toHaveTextContent('30 mins');

      const buttons = screen.getAllByRole('button');
      // buttons[2...5] are the richtext input
      expect(buttons).toHaveLength(6);

      const closeIcon = buttons[0];
      expect(closeIcon).toBeInTheDocument();

      const copyNoteButton = buttons[5];
      expect(copyNoteButton).toHaveTextContent('Save');

      const formTitle = screen.getByTestId('sliding-panel|title');
      expect(formTitle).toHaveTextContent('Add treatment');

      expect(screen.getByTestId('AddTreatmentForm|Title')).toHaveTextContent(
        'Treatment'
      );
      expect(screen.getByTestId('AddTreatmentForm|Title')).toHaveTextContent(
        '1'
      );

      expect(
        screen.getByTestId('AddTreatmentForm|Modality')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|BodyArea')
      ).toBeInTheDocument();
      expect(screen.getByTestId('AddTreatmentForm|Reason')).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Duration')
      ).toBeInTheDocument();
      expect(screen.getByTestId('AddTreatmentForm|Note')).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|AddAttachments')
      ).toBeInTheDocument();

      fireEvent.click(buttons[0]);

      expect(props.onClose).toHaveBeenCalled();
    });

    describe('[feature-flag] referring-physician-treatments-diagnostics', () => {
      beforeEach(() => {
        window.featureFlags[
          'referring-physician-treatments-diagnostics'
        ] = true;
      });
      afterEach(() => {
        window.featureFlags[
          'referring-physician-treatments-diagnostics'
        ] = false;
      });

      it('renders the referring physican field', async () => {
        await act(async () => {
          return render(mountWithProvider()).container;
        });

        expect(
          screen.getByTestId('AddTreatmentForm|ReferringPhysician')
        ).toBeInTheDocument();
      });
    });

    it('does not call onSaveTreatment if the form is invalid', async () => {
      await act(async () => {
        render(mountWithProvider());
      });
      const buttons = screen.getAllByRole('button');
      // buttons[2...5] are the richtext input
      expect(buttons).toHaveLength(6);

      const closeIcon = buttons[0];
      expect(closeIcon).toBeInTheDocument();

      const copyNoteButton = buttons[5];
      expect(copyNoteButton).toHaveTextContent('Save');
      fireEvent.click(buttons[5]);
      expect(props.onSaveTreatment).not.toHaveBeenCalled();
    });
  });

  describe('An athleteId is passed', () => {
    it('has the correct name for the athlete id', async () => {
      await act(async () => {
        render(mountWithProvider({ athleteId: 1 }));
      });
      await expect(screen.getByText('Frank Castle')).toBeInTheDocument();
    });
  });

  describe('duplicating a treatment', () => {
    it('has the correct fields prefilled', async () => {
      let container;

      const startDate = moment().set({
        hour: moment(mockDuplicateTreatment.start_time).get('hours'),
        minutes: moment(mockDuplicateTreatment.start_time).get('minutes'),
        seconds: moment(mockDuplicateTreatment.start_time).get('seconds'),
      });

      const endDate = moment(startDate).set({
        hour: moment(mockDuplicateTreatment.end_time).get('hours'),
        minutes: moment(mockDuplicateTreatment.end_time).get('minutes'),
        seconds: moment(mockDuplicateTreatment.end_time).get('seconds'),
      });

      await act(async () => {
        container = render(
          mountWithProvider({
            isDuplicatingTreatment: true,
            duplicateTreatment: mockDuplicateTreatment,
          })
        ).container;
      });

      const formTitle = screen.getByTestId('sliding-panel|title');
      expect(formTitle).toHaveTextContent('Duplicate treatment');
      expect(screen.getByText('Wade Wilson')).toBeInTheDocument();

      const treatmentStartDate = container.querySelector(
        `input[name="start_date"]`
      );
      const treatmentEndDate = container.querySelector(
        `input[name="end_date"]`
      );

      expect(treatmentStartDate).toHaveValue(
        moment(startDate).format('DD MMM YYYY')
      );

      expect(treatmentEndDate).toHaveValue(
        moment(endDate).format('DD MMM YYYY')
      );

      const dateFields = container.querySelectorAll('.rc-time-picker-input');
      const startTime = dateFields[0];
      expect(startTime).toHaveValue('12:00 pm');
      const endtime = dateFields[1];
      expect(endtime).toHaveValue('12:30 pm');

      expect(screen.getByTestId('AddTreatmentForm|Timezone')).toHaveTextContent(
        'Europe/Dublin'
      );

      expect(screen.getByTestId('AddTreatmentForm|Modality')).toHaveTextContent(
        'Ice Pack'
      );
      expect(screen.getByTestId('AddTreatmentForm|BodyArea')).toHaveTextContent(
        'Ankle - Left'
      );
      expect(screen.getByTestId('AddTreatmentForm|Reason')).toHaveTextContent(
        'General Treatment - unrelated to issue'
      );
      expect(screen.getByTestId('AddTreatmentForm|Note')).toHaveTextContent(
        'Natus quod qui explicabo et nisi.'
      );
    });
  });

  describe('[feature-flag] treatments-multi-modality is on', () => {
    let mockedDate;
    let timer;

    beforeEach(() => {
      window.featureFlags['treatments-multi-modality'] = true;
      mockedDate = moment('2020-10-15T08:00:00');
      timer = sinon.useFakeTimers(mockedDate.toDate());
    });
    afterEach(() => {
      window.featureFlags['treatments-multi-modality'] = false;
      timer.restore();
    });

    it('render the multi-add modality flow', async () => {
      let container;

      await act(async () => {
        container = render(mountWithProvider()).container;
      });

      expect(
        screen.getByTestId('AddTreatmentForm|Athlete')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Practitioner')
      ).toBeInTheDocument();

      const startDate = container.querySelector(`input[name="start_date"]`);
      const endDate = container.querySelector(`input[name="end_date"]`);

      expect(startDate).toHaveValue('15 Oct 2020');
      expect(endDate).toHaveValue('15 Oct 2020');

      const dateFields = container.querySelectorAll('.rc-time-picker-input');
      const startTime = dateFields[0];
      expect(startTime).toHaveValue('9:00 am');
      const endtime = dateFields[1];
      expect(endtime).toHaveValue('9:30 am');

      expect(screen.getByTestId('AddTreatmentForm|Timezone')).toHaveTextContent(
        'Europe/Dublin'
      );

      const treatmentTitle = container.querySelector(`input[name="title"]`);
      expect(treatmentTitle).toHaveValue('Treatment note');

      expect(
        screen.getByTestId('AddTreatmentForm|TotalDuration')
      ).toHaveTextContent('30 mins');

      const buttons = screen.getAllByRole('button');
      // buttons[2...5] are the richtext input
      expect(buttons).toHaveLength(6);

      const closeIcon = buttons[0];
      expect(closeIcon).toBeInTheDocument();

      const copyNoteButton = buttons[5];
      expect(copyNoteButton).toHaveTextContent('Save');

      const formTitle = screen.getByTestId('sliding-panel|title');
      expect(formTitle).toHaveTextContent('Add treatment');

      expect(
        screen.getByTestId('AddTreatmentForm|Multi|Title')
      ).toHaveTextContent('Add treatments');

      expect(
        screen.getByTestId('AddTreatmentForm|Multi|Modality')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Multi|BodyArea')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Multi|Reason')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Multi|Duration')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|Multi|AddTreatment')
      ).toBeInTheDocument();
    });

    describe('[feature-flag] referring-physician-treatments-diagnostics', () => {
      beforeEach(() => {
        window.featureFlags[
          'referring-physician-treatments-diagnostics'
        ] = true;
      });
      afterEach(() => {
        window.featureFlags[
          'referring-physician-treatments-diagnostics'
        ] = false;
      });

      it('renders the referring physican field', async () => {
        await act(async () => {
          return render(mountWithProvider()).container;
        });

        expect(
          screen.getByTestId('AddTreatmentForm|ReferringPhysician')
        ).toBeInTheDocument();
      });
    });

    it('disables the save button if there are no treatments added', async () => {
      await act(async () => {
        render(mountWithProvider());
      });

      const buttons = screen.getAllByRole('button');
      // buttons[2...5] are the richtext input
      expect(buttons).toHaveLength(6);

      const closeIcon = buttons[0];
      expect(closeIcon).toBeInTheDocument();

      const saveButton = buttons[5];
      expect(saveButton).toHaveTextContent('Save');
      expect(saveButton).toHaveAttribute('disabled');
    });
  });

  describe('[feature-flag]treatments-billing', () => {
    beforeEach(() => {
      window.featureFlags['treatments-billing'] = true;
    });
    afterEach(() => {
      window.featureFlags['treatments-billing'] = false;
    });

    it('renders the billing fields', async () => {
      await act(async () => {
        render(mountWithProvider());
      });

      expect(
        screen.getByTestId('AddTreatmentForm|CPTCode')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|IsBilling')
      ).toBeInTheDocument();
    });

    it('toggles the insurance fields', async () => {
      let container;
      await act(async () => {
        container = render(mountWithProvider()).container;
      });
      fireEvent.click(container.querySelector(`.toggleSwitch__input`));
      expect(
        screen.getByTestId('AddTreatmentForm|InsurancePaid')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('AddTreatmentForm|AthletePaid')
      ).toBeInTheDocument();
    });

    describe('[feature-flag] treatments-billing-extra-fields is on', () => {
      beforeEach(() => {
        window.featureFlags['treatments-billing-extra-fields'] = true;
      });
      afterEach(() => {
        window.featureFlags['treatments-billing-extra-fields'] = false;
      });

      it('renders the extra billing fields', async () => {
        await act(async () => {
          render(mountWithProvider());
        });

        expect(
          screen.getByTestId('AddTreatmentForm|CPTCode')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('AddTreatmentForm|IsBilling')
        ).toBeInTheDocument();
      });

      it('toggles the insurance fields', async () => {
        let container;
        await act(async () => {
          container = render(mountWithProvider()).container;
        });
        fireEvent.click(container.querySelector(`.toggleSwitch__input`));
        expect(
          screen.getByTestId('AddTreatmentForm|AmountCharged')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('AddTreatmentForm|DiscountOrReduction')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('AddTreatmentForm|InsurancePaid')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('AddTreatmentForm|AmountDue')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('AddTreatmentForm|AthletePaid')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('AddTreatmentForm|DatePaidDate')
        ).toBeInTheDocument();
      });
    });
  });
});
