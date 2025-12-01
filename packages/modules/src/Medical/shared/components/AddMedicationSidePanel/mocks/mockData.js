export const mockIssues = {
  open_issues: [
    {
      id: 11523,
      occurrence_date: '2022-07-05T00:00:00+01:00',
      closed: false,
      injury_status: {
        description: 'Not affecting availability (medical attention)',
        cause_unavailability: false,
        restore_availability: true,
      },
      resolved_date: null,
      issue_type: 'Illness',
      full_pathology: 'Respiratory tract infection (bacterial or viral) [N/A]',
    },
    {
      id: 13899,
      occurrence_date: '2022-07-05T00:00:00+01:00',
      closed: false,
      injury_status: {
        description: 'Not affecting availability (medical attention)',
        cause_unavailability: false,
        restore_availability: true,
      },
      resolved_date: null,
      issue_type: 'Illness',
      full_pathology: 'Abcess Ankle (excl. Joint) [Left]',
    },
  ],
  closed_issues: [],
};

export const mockPastAthlete = {
  firstname: 'Past',
  fullname: 'Past Athlete 99',
  id: 99,
  squad_names: [],
  org_last_transfer_record: {
    transfer_type: 'Trade',
    joined_at: null,
    left_at: '2022-12-15T05:04:33-05:00',
    data_sharing_consent: true,
  },
  organisation_ids: [22],
};

export const mockSquadAthletes = [
  {
    label: 'Squad A Name',
    options: [
      {
        value: 1,
        label: 'Athlete 1 Name',
      },
      {
        value: 2,
        label: 'Athlete 2 Name',
      },
    ],
  },
  {
    label: 'Squad B Name',
    options: [
      {
        value: 3,
        label: 'Athlete 1 Name',
      },
      {
        value: 4,
        label: 'Athlete 3 Name',
      },
    ],
  },
];

export const mockStaffUsers = [
  {
    sgid: 'DAREDEVIL',
    fullname: 'Matt Murdock',
    value: 2,
  },
  {
    sgid: 'DEADPOOL',
    fullname: 'Wade Wilson',
    value: 3,
  },
];

export const mockLots = {
  stock_lots: [
    {
      id: 1,
      drug: {
        id: 2,
        name: 'drug 1',
        dispensable_drug_id: '123',
        med_strength: '400',
        med_strength_unit: 'mg',
        dose_form_desc: 'tablet',
        route_desc: 'oral',
        drug_name_desc: 'ibuprofen',
      },
      drug_type: 'FdbDispensableDrug',
      lot_number: 'ABC123',
      expiration_date: '2023-02-26',
      quantity: 20.0,
      dispensed_quantity: 0.0,
    },
  ],
  next_id: null,
};

export const mockDrugs = {
  stock_drugs: [
    {
      id: 1,
      drug: {
        id: 2,
        name: 'drug 1',
        dispensable_drug_id: '123',
        med_strength: '400',
        med_strength_unit: 'mg',
        dose_form_desc: 'tablet',
        route_desc: 'oral',
        drug_name_desc: 'ibuprofen',
      },
      quantity: 20.0,
    },
  ],
  next_id: null,
};

export const mockMedications = [
  {
    value: 2,
    stockId: 2,
    label: 'ibuprofen',
  },
  {
    value: 3,
    stockId: 3,
    label: 'advil',
  },
];
