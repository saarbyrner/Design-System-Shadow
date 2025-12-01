import { rest } from 'msw';

const data = {
  id: 37,
  active: true,
  attachment: null,
  name: 'Kitman Football ',
  handle: 'testing',
  logo_path: 'kitman_logo_full_bleed.png',
  logo_full_path:
    'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0\u0026fit=fill\u0026trim=off\u0026bg=00FFFFFF',
  shortname: 'KF',
  timezone: 'EST',
  locale: 'en-US',
  localisation_id: 1,
  sport_id: 3,
  logo: null,
  last_privacy_policy: null,
  coding_system_key: 'clinical_impressions',
  coding_system: {
    id: 4,
    name: 'Clinical Impressions',
    key: 'clinical_impressions',
  },
  redox_orderable: false,
  extended_attributes: {},
  address: null,
  ambra_configurations: [],
  tso_application: {
    base_web_url: 'https://tso.base.url/',
  },
  association_admin: false,
  supervised_by: false,
};

const handler = rest.get(
  '/ui/organisation/organisations/current',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
