import { render, screen } from '@testing-library/react';
import { inactiveData as mockedInactiveAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import InactiveAthletesGrid from '../components/InactiveAthletesGrid';

const firstSquadAthletes = mockedInactiveAthletes.squads[0].athletes;
const secondSquadAthletes = mockedInactiveAthletes.squads[1].athletes.slice(1);

describe('<InactiveAthletesGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
    grid: {
      rows: [...firstSquadAthletes, ...secondSquadAthletes],
    },
  };

  it('renders the correct content', async () => {
    render(<InactiveAthletesGrid {...props} />);

    const table = screen.getByRole('table');
    const tableRows = table.querySelectorAll('tr');
    const [firstRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow] =
      tableRows;

    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(secondRow.querySelectorAll('td')[0]).toHaveTextContent(
      firstSquadAthletes[0].fullname
    );
    expect(thirdRow.querySelectorAll('td')[0]).toHaveTextContent(
      firstSquadAthletes[1].fullname
    );
    expect(fourthRow.querySelectorAll('td')[0]).toHaveTextContent(
      firstSquadAthletes[2].fullname
    );
    expect(fifthRow.querySelectorAll('td')[0]).toHaveTextContent(
      secondSquadAthletes[0].fullname
    );
    expect(sixthRow.querySelectorAll('td')[0]).toHaveTextContent(
      secondSquadAthletes[1].fullname
    );
  });

  it('renders the correct content when we have no data', async () => {
    render(<InactiveAthletesGrid {...props} grid={{ rows: [] }} />);

    const table = screen.getByRole('table');
    const tableRows = table.querySelectorAll('tr');
    const [firstRow] = tableRows;

    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(
      await screen.findByText('No inactive athletes for this period')
    ).toBeInTheDocument();
  });

  it('renders the correct links for each athlete', async () => {
    render(<InactiveAthletesGrid {...props} />);
    firstSquadAthletes.forEach((athlete) => {
      expect(screen.getByText(athlete.fullname).closest('a')).toHaveAttribute(
        'href',
        `/medical/athletes/${athlete.id}`
      );
    });
  });
});
