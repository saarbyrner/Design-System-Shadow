export const data = [
  {
    id: 115,
    address: null,
    handle: 'klgalaxy',
    logo_full_path: 'kitman_logo_full_bleed.png',
    name: 'KL Galaxy',
    registration_balance: 1000,
    payment_details: null,
    shortname: 'KL Galaxy',
    total_athletes: 0,
    total_squads: 6,
    total_staff: 0,
  },
  {
    id: 116,
    address: null,
    handle: 'klearthquakes',
    logo_full_path: 'kitman_logo_full_bleed.png',
    name: 'KL Earthquakes',
    registration_balance: 1000,
    payment_details: {
      balance: {
        paid: 0,
        unpaid: 0,
        total: 0,
        wallet: 1500,
      },
    },
    shortname: 'KL Quakes',
    total_athletes: 0,
    total_squads: 6,
    total_staff: 0,
  },

  {
    id: 117,
    address: null,
    handle: 'klearthquakes',
    logo_full_path: null,
    name: null,
    registration_balance: null,
    payment_details: null,
    shortname: 'KL Quakes',
    total_athletes: null,
    total_squads: -1,
    total_staff: '12',
  },
];
export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};
