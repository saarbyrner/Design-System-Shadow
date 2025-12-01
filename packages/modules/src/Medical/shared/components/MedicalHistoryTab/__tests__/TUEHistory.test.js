import { render, screen } from '@testing-library/react';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';
import TUEHistory from '../TUEHistory';

const mockData = [
  {
    id: 1246220,
    date: '2022-07-11',
    note: "I'm from the future. I came here in a Time Machine that you invented. Now I need your help to get back to the year 1985. -- Perferendis ipsam exercitationem numquam perspiciatis aut voluptates.",
    created_by: {
      id: 95239,
      firstname: 'Vicki',
      lastname: 'Anderson',
      fullname: 'Vicki Anderson',
    },
    restricted: false,
    psych_only: false,
    medical_meta: {
      note_medical_type: 'TUE',
      medical_name: 'Dextroamphetamine and amphetamine',
      expiration_date: '2022-12-02',
      renewal_date: null,
    },
    attachments: [],
  },
  {
    id: 1246229,
    date: '2022-07-09',
    note: "Roads? Where we're going, we don't need roads. -- Omnis est et.",
    created_by: {
      id: 95239,
      firstname: 'Vicki',
      lastname: 'Anderson',
      fullname: 'Vicki Anderson',
    },
    restricted: false,
    psych_only: false,
    medical_meta: {
      note_medical_type: 'TUE',
      medical_name: 'Steroid for Chest Infection',
      expiration_date: '2022-07-15',
      renewal_date: null,
    },
    attachments: [
      {
        filetype: 'binary/octet-stream',
        filesize: 15874053,
        filename: 'Hodge.301.avi',
        url: 'http://s3:9000/injpro-staging/kitman-staff/kitman-staff.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dummy1234%2F20221130%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20221130T144539Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=1437806f382f73da84dc00315583c93aa204d134e8987d6a923cdbb1a56219d8',
      },
    ],
  },
];

const commonProps = {
  t: i18nextTranslateStub(),
};

const renderComponent = (component) => {
  return render(
    <TestProviders
      store={{
        addTUESidePanel: {
          isOpen: false,
          initialInfo: {
            isAthleteSelectable: false,
          },
        },
        medicalHistory: {},
        medicalApi: {},
      }}
    >
      {component}
    </TestProviders>
  );
};

describe('<TUEHistory />', () => {
  it('renders correctly', () => {
    window.setFlag('pm-show-tue', true);
    jest.useFakeTimers().setSystemTime(new Date('2022-10-01'));

    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
      />
    );

    expect(screen.getByText('Therapeutic use exemptions')).toBeInTheDocument();
    expect(
      screen.getByText('Add therapeutic use exemptions')
    ).toBeInTheDocument();

    const rows = screen.getAllByRole('row');

    expect(rows[0]).toHaveTextContent('Issue Date');
    expect(rows[0]).toHaveTextContent('Expiry');
    expect(rows[0]).toHaveTextContent('TUE name');
    expect(rows[0]).toHaveTextContent('Notes');
    expect(rows[0]).toHaveTextContent('Attachment');

    expect(rows[1]).toHaveTextContent('Active');

    expect(rows[2]).toHaveTextContent('Jul 11, 2022');
    expect(rows[2]).toHaveTextContent('Dec 2, 2022');
    expect(rows[2]).toHaveTextContent('Dextroamphetamine and amphetamine');
    expect(rows[2]).toHaveTextContent(mockData[0].note);

    expect(rows[3]).toHaveTextContent('Expired');

    expect(rows[4]).toHaveTextContent('Jul 9, 2022');
    expect(rows[4]).toHaveTextContent('Jul 15, 2022');
    expect(rows[4]).toHaveTextContent('Steroid for Chest Infection');
    expect(rows[4]).toHaveTextContent(mockData[1].note);
    expect(rows[4]).toHaveTextContent('Hodge.301.avi');
  });

  it('shows TUE history when canView permission is on', () => {
    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
      />
    );

    expect(screen.getByTestId('TUEHistory')).toBeInTheDocument();
  });

  it('hides TUE history when canView permission is false', () => {
    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: false }}
        data={mockData}
      />
    );

    expect(screen.queryByTestId('TUEHistory')).not.toBeInTheDocument();
  });

  it('shows add TUE button when canCreate permission is on', () => {
    window.setFlag('pm-show-tue', true);
    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
      />
    );

    expect(
      screen.getByText('Add therapeutic use exemptions')
    ).toBeInTheDocument();
  });

  it('hides add TUE button when pm-show-tue flag is off', () => {
    window.setFlag('pm-show-tue', false);
    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
      />
    );

    expect(
      screen.queryByText('Add therapeutic use exemptions')
    ).not.toBeInTheDocument();
  });

  it('hides add TUE button when canCreate permission is false', () => {
    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: false, canView: true }}
        data={mockData}
      />
    );

    expect(
      screen.queryByText('Add therapeutic use exemptions')
    ).not.toBeInTheDocument();
  });
});

describe('TRIAL ATHLETE - Add therapeutic use exemptions button', () => {
  const renderWithHiddenFilters = (hiddenFilters = []) => {
    renderComponent(
      <TUEHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
        hiddenFilters={hiddenFilters}
      />
    );
  };
  it('does render the with the correct permissions', async () => {
    window.setFlag('pm-show-tue', true);
    renderWithHiddenFilters([]);
    expect(
      screen.getByRole('button', { name: 'Add therapeutic use exemptions' })
    ).toBeInTheDocument();
  });
  it('does not render when hidden', async () => {
    renderWithHiddenFilters(['add_tue_button']);

    expect(() =>
      screen.getByRole('button', { name: 'Add therapeutic use exemptions' })
    ).toThrow();
  });
});
