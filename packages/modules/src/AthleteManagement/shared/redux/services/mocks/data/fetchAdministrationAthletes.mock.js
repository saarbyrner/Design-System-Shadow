const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_count: 1,
  total_pages: 1,
};

const activeAthletes = [
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    username: 'joDoe',
    avatar: 'www.avatar-url.com',
    position: 'Fullback',
    squads: 'International Squad',
    created: '2015-04-14T13:34:24.000+01:00',
    updated: '2021-04-06T18:23:37.000+01:00',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'janedoe@gmail.com',
    username: 'jaDoe',
    avatar: 'www.avatar-url.com',
    position: 'Fullback',
    squads: 'International Squad, Academy Squad',
    created: '2017-06-12T14:30:00.000+01:00',
    updated: '2022-08-07T19:40:00.000+01:00',
  },
];

const inactiveAthletes = [
  {
    id: 3,
    name: 'Philip Callahan',
    email: 'philcallahan@gmail.com',
    username: 'philCall',
    avatar: 'www.avatar-url.com',
    position: 'Fullback',
    squads: 'Academy Squad',
    created: '2015-04-08T11:30:00.000+01:00',
    updated: '2021-05-14T12:20:00.000+01:00',
  },
  {
    id: 4,
    name: 'Mark Lenders',
    email: 'marklenders@gmail.com',
    username: 'markLend',
    avatar: 'www.avatar-url.com',
    position: 'Fullback',
    squads: 'International Squad, Academy Squad',
    created: '2016-02-10T12:30:00.000+01:00',
    updated: '2022-07-07T14:20:00.000+01:00',
  },
  {
    id: 5,
    name: 'James Howlet',
    email: 'jamhowl@gmail.com',
    username: 'jamHowl',
    avatar: 'www.avatar-url.com',
    position: 'Fullback',
    squads: 'International Squad',
    created: '2017-08-12T12:28:20.000+01:00',
    updated: '2022-04-06T19:40:37.000+01:00',
  },
];

export default {
  activeAthletes: {
    meta,
    athletes: activeAthletes,
  },
  inactiveAthletes: {
    meta,
    athletes: inactiveAthletes,
  },
  allAthletes: {
    meta,
    athletes: [...activeAthletes, ...inactiveAthletes],
  },
};
