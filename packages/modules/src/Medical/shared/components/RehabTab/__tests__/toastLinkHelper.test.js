import moment from 'moment-timezone';
import toastLinkHelper from '../toastLinkHelper';

describe('toastLinkHelper', () => {
  const sessionExercise1 = {
    athlete_id: 1,
    destination_session_dates: ['2023-05-21'],
    issue_type: 'Injury',
    issue_id: 3,
  };

  const sessionExercise2 = {
    athlete_id: 1,
    destination_session_dates: ['2023-05-21'],
    issue_type: '',
    issue_id: 4,
  };

  const sessionExercise3 = {
    athlete_id: 1,
    destination_session_dates: [],
    issue_type: '',
    issue_id: 45,
  };

  const athleteName = 'David Kelly';

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('forms expected link with no injury name', () => {
    const link = toastLinkHelper(
      athleteName,
      '',
      sessionExercise1,
      'rehabCopy',
      1
    );

    expect(link.linkTitle).toBe('Rehabs added Successfully');
    expect(link.linkText).toBe('May 21, 2023');
    expect(link.linkValue).toBe(
      '/medical/athletes/1/injuries/3?display_date=2023-05-21#rehab'
    );
  });

  it('forms expected link with Athlete name', () => {
    const link = toastLinkHelper(
      athleteName,
      '',
      sessionExercise1,
      'rehabCopy',
      2
    );

    expect(link.linkTitle).toBe('Rehabs added Successfully');
    expect(link.linkText).toBe('David Kelly - May 21, 2023');
    expect(link.linkValue).toBe(
      '/medical/athletes/1/injuries/3?display_date=2023-05-21#rehab'
    );
  });

  it('forms expected injury link to a copied rehab', () => {
    const link = toastLinkHelper(
      athleteName,
      'someDate - some injury',
      sessionExercise1,
      'rehabCopy',
      1
    );

    expect(link.linkTitle).toBe('Rehabs added Successfully');
    expect(link.linkText).toBe('some injury - May 21, 2023');
    expect(link.linkValue).toBe(
      '/medical/athletes/1/injuries/3?display_date=2023-05-21#rehab'
    );
  });

  it('forms expected injury link to a copied rehab with athlete name', () => {
    const link = toastLinkHelper(
      athleteName,
      'someDate - some injury',
      sessionExercise1,
      'rehabCopy',
      2
    );

    expect(link.linkTitle).toBe('Rehabs added Successfully');
    expect(link.linkText).toBe('David Kelly - some injury - May 21, 2023');
    expect(link.linkValue).toBe(
      '/medical/athletes/1/injuries/3?display_date=2023-05-21#rehab'
    );
  });

  it('forms expected injury link to a copied maintenance rehab', () => {
    const link = toastLinkHelper(
      athleteName,
      '',
      sessionExercise2,
      'maintenanceCopy',
      1
    );

    expect(link.linkTitle).toBe('Maintenance added Successfully');
    expect(link.linkText).toBe('Maintenance - May 21, 2023');
    expect(link.linkValue).toBe(
      '/medical/athletes/1?display_date=2023-05-21#maintenance'
    );
  });

  it('forms expected injury link to a copied maintenance rehab without date', () => {
    const link = toastLinkHelper(
      athleteName,
      '',
      sessionExercise3,
      'maintenanceCopy',
      1
    );

    expect(link.linkTitle).toBe('Maintenance added Successfully');
    expect(link.linkText).toBe('Maintenance');
    expect(link.linkValue).toBe('/medical/athletes/1#maintenance');
  });

  it('forms expected injury link to a linked rehab', () => {
    const link = toastLinkHelper(
      athleteName,
      'someDate - some injury',
      sessionExercise1,
      'maintenanceLinkedToInjury',
      1
    );

    expect(link.linkTitle).toBe('Rehabs linked Successfully');
    expect(link.linkText).toBe('some injury - May 21, 2023');
    expect(link.linkValue).toBe(
      '/medical/athletes/1/injuries/3?display_date=2023-05-21#rehab'
    );
  });

  it('forms expected injury link to a linked rehab without dates', () => {
    const link = toastLinkHelper(
      athleteName,
      'someDate - some injury',
      sessionExercise3,
      'maintenanceLinkedToInjury',
      1
    );

    expect(link.linkTitle).toBe('Rehabs linked Successfully');
    expect(link.linkText).toBe('some injury');
    expect(link.linkValue).toBe('/medical/athletes/1#rehab');
  });
});
