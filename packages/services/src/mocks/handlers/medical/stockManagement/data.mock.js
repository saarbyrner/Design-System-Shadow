export const mockedDrugStocks = {
  total: 41,
  count: 41,
  page: 1,
  next_page: null,
  options: [
    { id: '151939', name: 'pseudoephedrine-ibuprofen 30 mg-200 mg tablet' },
    { id: '156812', name: 'hydrocodone 7.5 mg-ibuprofen 200 mg tablet' },
    { id: '173420', name: 'ibuprofen 800 mg tablet' },
    { id: '182478', name: 'ibuprofen 200 mg capsule' },
    { id: '227645', name: 'ibuprofen (bulk) 100 % powder' },
    { id: '237650', name: 'ibuprofen 50 mg/1.25 mL oral drops,suspension' },
    { id: '250621', name: 'ibuprofen 400 mg tablet' },
    { id: '256217', name: 'ibuprofen 200 mg tablet' },
    { id: '275877', name: 'ibuprofen 600 mg tablet' },
    { id: '278995', name: 'ibuprofen 100 mg/5 mL oral suspension' },
    { id: '281309', name: 'Ibuprofen IB 200 mg tablet' },
    { id: '298404', name: 'ibuprofen 100 mg chewable tablet' },
    {
      id: '436727',
      name: "Children's Ibuprofen 100 mg/5 mL oral suspension",
    },
    {
      id: '449425',
      name: 'Ibuprofen Cold-Sinus (with pseudoephedrine) 30 mg-200 mg tablet',
    },
    {
      id: '449511',
      name: "Infant's Ibuprofen 50 mg/1.25 mL oral drops,suspension",
    },
    {
      id: '449584',
      name: 'chlorpheniramine-pseudoephedrine-ibuprofen 2 mg-30 mg-200 mg tablet',
    },
    { id: '469644', name: 'hydrocodone 5 mg-ibuprofen 200 mg tablet' },
  ],
};

export const mockedSavedDrugStock = {
  id: 11,
  kind: 'in',
  quantity: 865.0,
  user: {
    id: 133302,
    firstname: 'Kevin',
    lastname: 'Doocey',
    fullname: 'Kevin Doocey',
  },
};

export const mockedDrugLots = {
  stock_lots: [
    {
      id: 54,
      drug_type: 'FdbDispensableDrug',
      drug: {
        id: 28,
        name: 'aminolevulinic acid HCl 20 % topical solution',
        dispensable_drug_id: '150124',
        med_strength: '20',
        med_strength_unit: '%',
        dose_form_desc: 'solution',
        route_desc: 'topical',
        drug_name_desc: 'aminolevulinic acid HCl',
      },
      lot_number: 'ee',
      expiration_date: '2023-02-24',
      quantity: 5.0,
      dispensed_quantity: 0.0,
    },
    {
      id: 2,
      drug_type: 'FdbDispensableDrug',
      drug: {
        id: 2,
        name: 'Bard Latex Leg Straps',
        dispensable_drug_id: '257978',
        med_strength: null,
        med_strength_unit: null,
        dose_form_desc: 'Miscellaneous',
        route_desc: 'miscellaneous',
        drug_name_desc: 'Bard Latex Leg Straps',
      },
      lot_number: '23',
      expiration_date: '2023-02-06',
      quantity: 4.0,
      dispensed_quantity: 0.0,
    },
  ],
  next_id: null,
};
