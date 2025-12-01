import data from '@kitman/services/src/mocks/handlers/exports/exportDemographicReport/emergencyContactsReportData.mock';
import emergencyContactsReportCSV from '../emergencyContactsReport';

jest.mock('@kitman/common/src/utils/downloadCSV');

describe('EmergencyContactsReport CSV', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const reportTitle = 'Emergency Contacts Report_12_05_2023';
  const labels = {
    jersey_number: '#',
    fullname: 'Name',
    contactName: 'Contact name',
    relation: 'Relation',
    phoneNumber: 'Phone Number',
    email: 'Email',
    address: 'Address',
  };

  const athleteColumns = ['jersey_number', 'fullname'];
  const contactColumns = [
    'firstname',
    'contact_relation',
    'phone_numbers',
    'email',
    'address_1',
  ];

  const exportData = {
    athletes: data.athletes,
    athleteColumns,
    contactColumns,
    extraSettings: ['download_csv'],
  };

  it('outputs the report csv', () => {
    const link = {
      click: jest.fn(),
      remove: jest.fn(),
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => link);

    const onError = jest.fn();
    const onSuccess = jest.fn();
    emergencyContactsReportCSV(
      reportTitle,
      exportData,
      labels,
      onError,
      onSuccess
    );

    expect(link.target).toEqual('_blank');
    expect(link.download).toEqual('Emergency_Contacts_Report_12_05_2023.csv');
    expect(link.href).toEqual(
      'data:text/csv;charset=utf-8,%22%23%22%2C%22Name%22%2C%22Contact%20name%22%2C%22Relation%22%2C%22Phone%20Number%22%2C%22Email%22%2C%22Address%22%0A%2244%22%2C%22Cannone%2C%20Niccolo%22%2C%2C%2C%2C%2C%0A%2C%22Conway%2C%20Adam%22%2C%2C%2C%2C%2C%0A%2222%22%2C%22Albornoz%2C%20Tomas%22%2C%22Kelly%2C%20David%22%2C%22sibling%22%2C%22%2B353%2087%20761%201662%0A%2B353%2087%20784%200304%22%2C%22david4482%40yahoo.com%22%2C%22Address%201%20Here%2C%20Address%202%20Here%2C%20Address%203%20Here%2C%20Dublin%2C%20Co.%20Dublin%2C%20Ireland%22%0A%2222%22%2C%22Albornoz%2C%20Tomas%22%2C%22Fakerson%2C%20Fake%22%2C%22parent%22%2C%22%2B353%2087%20761%201663%22%2C%22fake%40fakerson.com%22%2C%22%22'
    );
    const prefix = 'data:text/csv;charset=utf-8,';
    const expectedCSV =
      '"#","Name","Contact name","Relation","Phone Number","Email","Address"\n' +
      '"44","Cannone, Niccolo",,,,,\n' +
      ',"Conway, Adam",,,,,\n' +
      '"22","Albornoz, Tomas","Kelly, David","sibling","+353 87 761 1662\n' +
      '+353 87 784 0304","david4482@yahoo.com",' +
      '"Address 1 Here, Address 2 Here, Address 3 Here, Dublin, Co. Dublin, Ireland"\n' +
      '"22","Albornoz, Tomas","Fakerson, Fake","parent","+353 87 761 1663","fake@fakerson.com",""';

    expect(decodeURIComponent(link.href.substring(prefix.length))).toEqual(
      expectedCSV
    );
    expect(link.remove).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
