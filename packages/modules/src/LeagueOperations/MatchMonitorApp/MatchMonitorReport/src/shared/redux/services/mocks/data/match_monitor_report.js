export default {
  game_monitor_report_athletes: [
    {
      id: 1,
      athlete_id: 1,
      athlete: {
        id: 1,
        firstname: 'Mason',
        lastname: 'Mount',
        fullname: 'Mason Mount',
      },
      primary_squad: {
        name: 'Manchester United',
      },
      venue_type: 'home',
      compliant: true,
    },
    {
      id: 2,
      athlete_id: 2,
      athlete: {
        id: 2,
        firstname: 'Mohammad',
        lastname: 'Salah',
        fullname: 'Mohammad Salah',
      },
      primary_squad: {
        name: 'Liverpool',
      },
      venue_type: 'away',
      compliant: true,
    },
    {
      id: 3,
      athlete_id: 3,
      athlete: {
        id: 3,
        firstname: 'John',
        lastname: 'Doe',
        fullname: 'John Doe',
      },
      primary_squad: {
        name: 'Some Squad',
      },
      venue_type: 'home',
      compliant: true,
    },
  ],
  game_monitor_report_unregistered_athletes: [
    {
      id: 1,
      venue_type: 'home',
      firstname: 'Luke',
      lastname: 'Shaw',
      date_of_birth: '1994-02-26',
      registration_status: 'registered',
      notes: 'free text',
    },
    {
      id: 2,
      venue_type: 'home',
      firstname: 'John',
      lastname: 'Doe',
      date_of_birth: '1995-03-26',
      registration_status: 'unregistered',
      notes: 'some notes',
    },
  ],
  notes: 'Some players are not compliant',
  monitor_issue: true,
  submitted_by_id: 1,
};
