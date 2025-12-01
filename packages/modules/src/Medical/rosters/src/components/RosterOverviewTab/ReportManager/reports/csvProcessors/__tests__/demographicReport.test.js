import moment from 'moment';
import data from '@kitman/services/src/mocks/handlers/exports/exportDemographicReport/exportDemographicReportData.mock';
import exportDemographicReportCSV from '../demographicReport';

jest.mock('@kitman/common/src/utils/downloadCSV');

describe('DemographicReport CSV', () => {
  const defaultLocale = moment.locale();

  afterEach(() => {
    moment.locale(defaultLocale);
    jest.resetAllMocks();
  });

  const reportTitle = 'Emergency Medical Report_12_05_2023';
  const labels = {
    jersey_number: '#',
    fullname: 'Name',
    firstname: 'First Name',
    lastname: 'Last Name',
    id: 'Id',
    nfl_id: 'Player Id',
    position: 'Pos',
    date_of_birth: 'Date of Birth',
    dob_short: 'Date of Birth',
    height: 'Height',
    weight_pounds: 'Weight (lbs)',
    weight_kilograms: 'Weight (kg)',
    allergies: 'Allergies',
    athlete_medical_alerts: 'Alerts',
  };
  const defaultColumns = [
    'jersey_number',
    'fullname',
    'nfl_id',
    'position',
    'dob_short',
    'height',
    'allergies',
    'athlete_medical_alerts',
  ];

  const exportData = {
    athletes: data.athletes,
    columns: defaultColumns,
    extraSettings: ['download_csv'],
  };

  it('outputs the demographic report format without severity', () => {
    moment.locale('en-IE');
    const link = {
      click: jest.fn(),
      remove: jest.fn(),
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => link);

    const onError = jest.fn();
    const onSuccess = jest.fn();
    exportDemographicReportCSV(
      reportTitle,
      exportData,
      labels,
      onError,
      onSuccess
    );

    expect(link.target).toEqual('_blank');
    expect(link.download).toEqual('Emergency_Medical_Report_12_05_2023.csv');
    expect(link.href).toEqual(
      'data:text/csv;charset=utf-8,%22%23%22%2C%22Name%22%2C%22Player%20Id%22%2C%22Pos%22%2C%22Date%20of%20Birth%22%2C%22Height%22%2C%22Allergies%22%2C%22Alerts%22%0A%2244%22%2C%22Cannone%2C%20Niccolo%22%2C%22NFL_100%22%2C%22Hooker%22%2C%2221%2F06%2F1989%22%2C%22195%20cm%22%2C%22Test%22%2C%0A%2C%22Conway%2C%20Adam%22%2C%22NFL_200%22%2C%22Scrum%20Half%22%2C%2212%2F09%2F1990%22%2C%2C%22Banana%2C%20Stinging%20insects%20(Including%20bees%20and%20wasps)%22%2C%22Migraines%2C%20No%20breath%20so%20good%2C%20Low%20BP%22%0A%2222%22%2C%22Albornoz%2C%20Tomas%22%2C%2C%22Second%20Row%22%2C%2C%2C%2C'
    );
    const prefix = 'data:text/csv;charset=utf-8,';
    const expectedCSV =
      '"#","Name","Player Id","Pos","Date of Birth","Height","Allergies","Alerts"\n' +
      '"44","Cannone, Niccolo","NFL_100","Hooker","21/06/1989","195 cm","Test",\n' +
      ',"Conway, Adam","NFL_200","Scrum Half","12/09/1990",,"Banana, Stinging insects (Including bees and wasps)","Migraines, No breath so good, Low BP"\n' +
      '"22","Albornoz, Tomas",,"Second Row",,,,';

    expect(decodeURIComponent(link.href.substring(prefix.length))).toEqual(
      expectedCSV
    );
    expect(link.remove).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('outputs the date of birth in the locale format', () => {
    moment.locale('en-US');
    const link = {
      click: jest.fn(),
      remove: jest.fn(),
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => link);

    const onError = jest.fn();
    const onSuccess = jest.fn();
    exportDemographicReportCSV(
      reportTitle,
      exportData,
      labels,
      onError,
      onSuccess
    );

    expect(link.target).toEqual('_blank');
    expect(link.download).toEqual('Emergency_Medical_Report_12_05_2023.csv');
    expect(link.href).toEqual(
      'data:text/csv;charset=utf-8,%22%23%22%2C%22Name%22%2C%22Player%20Id%22%2C%22Pos%22%2C%22Date%20of%20Birth%22%2C%22Height%22%2C%22Allergies%22%2C%22Alerts%22%0A%2244%22%2C%22Cannone%2C%20Niccolo%22%2C%22NFL_100%22%2C%22Hooker%22%2C%2206%2F21%2F1989%22%2C%22195%20cm%22%2C%22Test%22%2C%0A%2C%22Conway%2C%20Adam%22%2C%22NFL_200%22%2C%22Scrum%20Half%22%2C%2209%2F12%2F1990%22%2C%2C%22Banana%2C%20Stinging%20insects%20(Including%20bees%20and%20wasps)%22%2C%22Migraines%2C%20No%20breath%20so%20good%2C%20Low%20BP%22%0A%2222%22%2C%22Albornoz%2C%20Tomas%22%2C%2C%22Second%20Row%22%2C%2C%2C%2C'
    );
    const prefix = 'data:text/csv;charset=utf-8,';
    const expectedCSV =
      '"#","Name","Player Id","Pos","Date of Birth","Height","Allergies","Alerts"\n' +
      '"44","Cannone, Niccolo","NFL_100","Hooker","06/21/1989","195 cm","Test",\n' +
      ',"Conway, Adam","NFL_200","Scrum Half","09/12/1990",,"Banana, Stinging insects (Including bees and wasps)","Migraines, No breath so good, Low BP"\n' +
      '"22","Albornoz, Tomas",,"Second Row",,,,';

    expect(decodeURIComponent(link.href.substring(prefix.length))).toEqual(
      expectedCSV
    );
    expect(link.remove).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('outputs the demographic report format with severity', () => {
    moment.locale('en-IE');
    const link = {
      click: jest.fn(),
      remove: jest.fn(),
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => link);

    const onError = jest.fn();
    const onSuccess = jest.fn();
    exportDemographicReportCSV(
      reportTitle,
      { ...exportData, extraSettings: ['show_severity', 'download_csv'] },
      labels,
      onError,
      onSuccess
    );

    expect(link.target).toEqual('_blank');
    expect(link.download).toEqual('Emergency_Medical_Report_12_05_2023.csv');
    expect(link.href).toEqual(
      'data:text/csv;charset=utf-8,%22%23%22%2C%22Name%22%2C%22Player%20Id%22%2C%22Pos%22%2C%22Date%20of%20Birth%22%2C%22Height%22%2C%22Allergies%22%2C%22Alerts%22%0A%2244%22%2C%22Cannone%2C%20Niccolo%22%2C%22NFL_100%22%2C%22Hooker%22%2C%2221%2F06%2F1989%22%2C%22195%20cm%22%2C%22Test%20%5Bmild%5D%22%2C%0A%2C%22Conway%2C%20Adam%22%2C%22NFL_200%22%2C%22Scrum%20Half%22%2C%2212%2F09%2F1990%22%2C%2C%22Banana%20%5Bsevere%5D%2C%20Stinging%20insects%20(Including%20bees%20and%20wasps)%20%5Bmild%5D%22%2C%22Migraines%20%5Bsevere%5D%2C%20No%20breath%20so%20good%20%5Bmild%5D%2C%20Low%20BP%20%5Bnone%5D%22%0A%2222%22%2C%22Albornoz%2C%20Tomas%22%2C%2C%22Second%20Row%22%2C%2C%2C%2C'
    );
    const prefix = 'data:text/csv;charset=utf-8,';
    const expectedCSV =
      '"#","Name","Player Id","Pos","Date of Birth","Height","Allergies","Alerts"\n' +
      '"44","Cannone, Niccolo","NFL_100","Hooker","21/06/1989","195 cm","Test [mild]",\n' +
      ',"Conway, Adam","NFL_200","Scrum Half","12/09/1990",,"Banana [severe], Stinging insects (Including bees and wasps) [mild]","Migraines [severe], No breath so good [mild], Low BP [none]"\n' +
      '"22","Albornoz, Tomas",,"Second Row",,,,';

    expect(decodeURIComponent(link.href.substring(prefix.length))).toEqual(
      expectedCSV
    );
    expect(link.remove).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
