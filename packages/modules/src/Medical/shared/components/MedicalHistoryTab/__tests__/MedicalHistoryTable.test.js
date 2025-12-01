import { render, screen } from '@testing-library/react';
import moment from 'moment';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';
import MedicalHistoryTable from '../MedicalHistoryTable';

describe('<MedicalHistoryTable />', () => {
  const columns = [
    {
      Header: 'First name',
      accessor: 'firstName',
    },
    {
      Header: 'Last name',
      accessor: 'lastName',
    },
    {
      Header: 'Age',
      accessor: 'age',
    },
    {
      Header: 'Expiry',
      accessor: 'expiry',
      Cell: ({ value }) => <span>{moment(value).format('MMM D, YYYY')}</span>,
    },
  ];

  const data = [
    {
      id: 123,
      firstName: 'John',
      lastName: 'Doe',
      age: 29,
      expiry: '2022-01-01',
    },
    {
      id: 345,
      firstName: 'James',
      lastName: 'Robert',
      age: 32,
      expiry: '2023-01-01',
    },
  ];

  const t = i18nextTranslateStub();

  it('renders correctly', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-06-01'));

    render(
      <TestProviders
        store={{
          addTUESidePanel: {
            isOpen: false,
            initialInfo: {
              isAthleteSelectable: false,
            },
          },
        }}
      >
        <MedicalHistoryTable columns={columns} data={data} t={t} />
      </TestProviders>
    );

    const rows = screen.getAllByRole('row');

    expect(rows[0]).toHaveTextContent('First name');
    expect(rows[0]).toHaveTextContent('Last name');
    expect(rows[0]).toHaveTextContent('Age');
    expect(rows[0]).toHaveTextContent('Expiry');

    expect(rows[1]).toHaveTextContent('Active');

    expect(rows[2]).toHaveTextContent('James');
    expect(rows[2]).toHaveTextContent('Robert');
    expect(rows[2]).toHaveTextContent(32);
    expect(rows[2]).toHaveTextContent('Jan 1, 2023');

    expect(rows[3]).toHaveTextContent('Expired');

    expect(rows[4]).toHaveTextContent('John');
    expect(rows[4]).toHaveTextContent('Doe');
    expect(rows[4]).toHaveTextContent(29);
    expect(rows[4]).toHaveTextContent('Jan 1, 2022');
  });
});
