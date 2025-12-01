import { render, screen } from '@testing-library/react';
import Summary from '../../components/Summary';

describe('Import Workflow <Summary /> component', () => {
  describe('TrainingSession as event', () => {
    const props = {
      event: {
        id: null,
        eventType: 'TRAINING_SESSION',
        sessionTypeId: '',
        sessionTypeName: 'Rehab',
        workloadType: '',
        workloadTypeName: 'Squad Loading',
        duration: '581',
        date: '2018-02-26',
      },
      sourceData: {
        type: 'INTEGRATION',
        integrationData: { id: 1, date: '2018-02-26', name: 'Statsports' },
        eventData: {
          event: {
            type: 'any',
            datetime: '2018-02-26T09:11:00Z',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [{ id: 1, firstname: 'Gustavo', lastname: 'Stark' }],
          nonSetupAthletesIdentifiers: ['123456'],
        },
      },
      sourceFormData: {
        loaded: true,
        integrations: [],
        fileSources: { catapult: 'Catapult' },
      },
      orgTimezone: 'Europe/Dublin',
      onForward: () => {},
      onBackward: () => {},
      t: (value) => value,
    };

    it('renders', () => {
      render(<Summary {...props} />);
      expect(screen.getByText('Start Import')).toBeInTheDocument();
    });

    it('renders the Start Import button', () => {
      render(<Summary {...props} />);
      expect(screen.getByText('Start Import')).toBeInTheDocument();
    });

    it('renders the event time', () => {
      render(<Summary {...props} />);
      expect(screen.getByText('Time')).toBeInTheDocument();
    });
  });

  describe('Game as event', () => {
    const props = {
      event: {
        id: null,
        eventType: 'GAME',
        date: '2018-02-26',
        score: '1',
        opponentScore: '2',
        fixture: {
          date: '2018-02-26',
          venueTypeId: '1',
          venueTypeName: 'Home',
          organisationTeamId: '2',
          organisationTeamName: 'Giants',
          teamId: '3',
          teamName: 'Kitman Tags',
          competitionId: '4',
          competitionName: 'World Cup',
          roundNumber: '13',
          turnaroundPrefix: 'IS',
          createTurnaroundMarker: false,
        },
      },
      sourceData: {
        type: 'INTEGRATION',
        integrationData: { id: 1, date: '2018-02-26', name: 'Statsports' },
        eventData: {
          event: {
            type: 'any',
            datetime: '2018-02-26T09:11:00Z',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [{ id: 1, firstname: 'Gustavo', lastname: 'Stark' }],
          nonSetupAthletesIdentifiers: ['123456', 'John'],
        },
      },
      sourceFormData: {
        loaded: true,
        integrations: [],
        fileSources: { catapult: 'Catapult' },
      },
      onForward: () => {},
      onBackward: () => {},
      t: (value) => value,
    };

    it('renders', () => {
      render(<Summary {...props} />);
      expect(screen.getByText('Start Import')).toBeInTheDocument();
    });

    it('renders the missing athletes', () => {
      render(<Summary {...props} />);
      expect(screen.getByText('123456')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  describe('File as source', () => {
    const props = {
      event: {
        id: null,
        eventType: 'TRAINING_SESSION',
        sessionTypeId: '',
        sessionTypeName: 'Rehab',
        workloadType: '',
        workloadTypeName: 'Squad Loading',
        duration: '581',
        date: '2018-02-26',
      },
      sourceData: {
        type: 'FILE',
        fileData: { file: { name: 'filename.csv' }, source: 'catapult' },
        eventData: {
          event: {
            type: 'any',
            datetime: '2018-02-26 09:00:00',
            duration: 25,
            uniqueIdentifier: '123',
          },
          athletes: [{ id: 1, firstname: 'Gustavo', lastname: 'Stark' }],
          nonSetupAthletesIdentifiers: ['123456'],
        },
      },
      sourceFormData: {
        loaded: true,
        integrations: [],
        fileSources: { catapult: 'Catapult Label' },
      },
      onForward: () => {},
      onBackward: () => {},
      t: (value) => value,
    };

    it('renders the file information', () => {
      render(<Summary {...props} />);
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
      expect(screen.getByText('Catapult Label')).toBeInTheDocument();
      expect(screen.getByText('filename.csv')).toBeInTheDocument();
    });
  });
});
