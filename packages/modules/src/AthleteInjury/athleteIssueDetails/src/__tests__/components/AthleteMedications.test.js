import { render, screen } from '@testing-library/react';
import i18n from 'i18next'; // Import i18n for the stub
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteMedications from '../../components/AthleteMedications';

describe('Athlete Issue Details <AthleteMedications /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      diagnostic: {
        id: 123,
        type: 'CT Scan',
        diagnostic_date: '2018-06-10 10:18:24',
        is_medication: true,
        attachments: [
          {
            id: 213456,
            url: 'https://injpro-staging.s3.eu-west-1.amazonaws.com/kitman/x.jpg',
            filename: 'medication_1.jpg',
            filetype: 'JPG',
            filesize: 32,
            audio_file: false,
          },
          {
            id: 678904,
            url: 'https://injpro-staging.s3.eu-west-1.amazonaws.com/kitman/y.jpg',
            filename: 'medication_2.jpg',
            filetype: 'JPG',
            filesize: 32,
            audio_file: false,
          },
        ],
        medical_meta: {
          is_completed: false,
          dosage: '2',
          end_date: null,
          frequency: 'daily',
          notes: 'this is a medication note',
          start_date: '2018-08-01T00:00:00+01:00',
          type: 'medication type',
        },
      },
      emptyMessage: 'No Medications added to this injury occurrence.',
      orgTimeZone: 'Europe/Dublin',
      t: i18nextTranslateStub(i18n),
    };
  });

  it('renders all medication details correctly (type, dosage, frequency, notes)', () => {
    render(<AthleteMedications {...props} />);

    expect(screen.getByText('medication type')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
    expect(screen.getByText('this is a medication note')).toBeInTheDocument();

    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders the correct attachments', () => {
    render(<AthleteMedications {...props} />);
    expect(screen.getByText('medication_1.jpg')).toBeInTheDocument();
    expect(screen.getByText('medication_2.jpg')).toBeInTheDocument();
  });

  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('renders the correct creation date', () => {
      render(<AthleteMedications {...props} />);
      expect(
        screen.getByText('Medication added on 10 Jun 2018')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('renders the correct creation date', () => {
      render(<AthleteMedications {...props} />);
      expect(
        screen.getByText('Medication added on Jun 10, 2018')
      ).toBeInTheDocument();
    });
  });

  describe('When there is no attached medication', () => {
    beforeEach(() => {
      props.diagnostic.medical_meta = null;
    });

    it('displays the correct empty text', () => {
      render(<AthleteMedications {...props} />);
      expect(
        screen.getByText('No Medications added to this injury occurrence.')
      ).toBeInTheDocument();
    });
  });

  describe('When the medication is completed and the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
      props.diagnostic.medical_meta.is_completed = false; // Matches original test
      props.diagnostic.medical_meta.end_date = '2018-11-24T12:00:00+01:00';
    });

    it('renders the start date', () => {
      render(<AthleteMedications {...props} />);
      expect(screen.getByText('31 Jul 2018')).toBeInTheDocument();
    });

    it('renders the end date', () => {
      render(<AthleteMedications {...props} />);
      expect(screen.getByText('24 Nov 2018')).toBeInTheDocument();
    });
  });

  describe('When the medication is completed and the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
      props.diagnostic.medical_meta.is_completed = false; // Matches original test
      props.diagnostic.medical_meta.end_date = '2018-11-24T12:00:00+01:00';
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('renders the start date', () => {
      render(<AthleteMedications {...props} />);
      expect(screen.getByText('Jul 31, 2018')).toBeInTheDocument();
    });

    it('renders the end date', () => {
      render(<AthleteMedications {...props} />);
      expect(screen.getByText('Nov 24, 2018')).toBeInTheDocument();
    });
  });

  describe('When there are no attachments on the medication', () => {
    beforeEach(() => {
      props.diagnostic.attachments = [];
    });

    it('does not render the attachment section', () => {
      render(<AthleteMedications {...props} />);
      expect(screen.queryByText('medication_1.jpg')).not.toBeInTheDocument();
      expect(screen.queryByText('medication_2.jpg')).not.toBeInTheDocument();
    });
  });

  describe('When there are no notes on the medication', () => {
    beforeEach(() => {
      props.diagnostic.medical_meta.notes = '';
    });

    it('renders the correct empty text for the notes', () => {
      render(<AthleteMedications {...props} />);
      expect(screen.getByText('No note added.')).toBeInTheDocument();
      expect(
        screen.queryByText('this is a medication note')
      ).not.toBeInTheDocument();
    });
  });
});
