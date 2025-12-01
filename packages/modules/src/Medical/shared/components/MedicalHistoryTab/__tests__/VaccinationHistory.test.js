import { render, screen } from '@testing-library/react';
import {
  i18nextTranslateStub,
  TestProviders,
} from '@kitman/common/src/utils/test_utils';
import VaccinationsHistory from '../VaccinationsHistory';

const mockData = [
  {
    id: 1246260,
    date: '2022-07-04',
    note: "Yes. Yes. I'm George. George McFly. I'm your density. I mean, your destiny. -- Et soluta qui dignissimos excepturi voluptatem natus quibusdam. Modi omnis adipisci non sequi nam officiis vitae. Autem reprehenderit accusamus. Id eligendi facilis repudiandae quisquam rerum exercitationem. Incidunt necessitatibus natus deserunt nihil et et. Et maiores tempora labore.",
    created_by: {
      id: 95239,
      firstname: 'Vicki',
      lastname: 'Anderson',
      fullname: 'Vicki Anderson',
    },
    restricted: false,
    psych_only: false,
    medical_meta: {
      note_medical_type: 'Vaccination',
      medical_name: 'Hepatitis A',
      expiration_date: '2023-07-04',
      batch_number: 'OVUH89yhf9',
      renewal_date: '2023-07-05',
    },
    attachments: [],
  },
];

const renderComponent = (component) => {
  return render(
    <TestProviders
      store={{
        addVaccinationSidePanel: {
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

const commonProps = {
  t: i18nextTranslateStub(),
};

describe('<VaccinationsHistory />', () => {
  it('renders correctly', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-10-01'));

    renderComponent(
      <VaccinationsHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
      />
    );

    const rows = screen.getAllByRole('row');

    expect(screen.getByText('Vaccinations')).toBeInTheDocument();
    expect(screen.getAllByText('Add vaccination')).toHaveLength(2);

    expect(rows[0]).toHaveTextContent('Current Vaccination');
    expect(rows[0]).toHaveTextContent('Issue Date');
    expect(rows[0]).toHaveTextContent('Batch number');
    expect(rows[0]).toHaveTextContent('Expiry');
    expect(rows[0]).toHaveTextContent('Notes');
    expect(rows[0]).toHaveTextContent('Renewal');
    expect(rows[0]).toHaveTextContent('Attachment');

    expect(rows[1]).toHaveTextContent('Active');

    expect(rows[2]).toHaveTextContent('Hepatitis A');
    expect(rows[2]).toHaveTextContent('Jul 4, 2022');
    expect(rows[2]).toHaveTextContent('OVUH89yhf9');
    expect(rows[2]).toHaveTextContent('Jul 4, 2023');
    expect(rows[2]).toHaveTextContent(mockData[0].note);
    expect(rows[2]).toHaveTextContent('Jul 5, 2023');
  });

  it('hides TUE history when canView is false', () => {
    renderComponent(
      <VaccinationsHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: false }}
        data={mockData}
      />
    );

    expect(screen.queryByTestId('VaccinationsHistory')).not.toBeInTheDocument();
  });

  it('hides add TUE button when canCreate is false', () => {
    renderComponent(
      <VaccinationsHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: false, canView: true }}
        data={mockData}
      />
    );

    const addTUEButton = screen.queryByText('Add therapeutic use exemptions');

    expect(addTUEButton).not.toBeInTheDocument();
  });
});

describe('TRIAL ATHLETE - Add vaccination button', () => {
  const renderWithHiddenFilters = (hiddenFilters = []) => {
    renderComponent(
      <VaccinationsHistory
        {...commonProps}
        athleteId={123}
        permissions={{ canCreate: true, canView: true }}
        data={mockData}
        hiddenFilters={hiddenFilters}
      />
    );
  };
  it('does render the with the correct permissions', async () => {
    renderWithHiddenFilters([]);
    expect(
      screen.getByRole('button', { name: 'Add vaccination' })
    ).toBeInTheDocument();
  });
  it('does not render when hidden', async () => {
    renderWithHiddenFilters(['add_vaccination_button']);

    expect(() =>
      screen.getByRole('button', { name: 'Add vaccination' })
    ).toThrow();
  });
});
