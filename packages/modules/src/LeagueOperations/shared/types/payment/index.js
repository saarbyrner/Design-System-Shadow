// @flow
export type ClubPayment = {
  season: string,
  count: {
    registration: number,
    registered: number,
  },
  price: {
    user: number,
  },
  balance: {
    paid: number,
    unpaid: number,
    total: number,
    wallet: number,
  },
  payment_method: {
    full_name: string,
    last_four_digits: string,
    exp_date: string,
    zip_code: string,
    country: string,
  },
};

export type Item = {
  label: string,
  value: string | number | null,
};
