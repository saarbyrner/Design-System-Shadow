import { rest } from 'msw';

const data = [
  2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
  2023,
];

const handler = rest.get('/benchmark/seasons', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };
