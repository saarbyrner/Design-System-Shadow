import { rest } from 'msw';

const data = {
  id: 45232125,
  firstname: 'tom',
  lastname: 'Selleck',
  full_name: 'Tom Selleck',
  athlete: false,
  avatar_url: 'https://ui-avatars.com/api/?name=Tom+Selleck',
  squad: 'U16',
  address: {
    state: 'Nebraska',
    city: 'Hickory',
  },
  emergency_contact: {
    firstname: 'John',
    lastname: 'Doe',
    relation: 'Father',
    email: 'johndoe@email.com',
    phone_number1: '571-234-0891',
    phone_number2: '571-234-0891',
  },
  date_of_birth: '09/22/06',
  type: 'guest',
  status: 'incomplete',
  paid: true,
  club_id: 8,
  country: 'USA',
  jersey_number: '5',
  email: 'johndoe@email.com',
  phone_number: '571-234-0891',
  joined: '09/22/06',
  age: '15',
  registration: {
    required: false,
  },
};

const handler = rest.get('/ui/current_user', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
