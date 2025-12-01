// @flow

export const CustomDrugs = {
  drug_type: 'Emr::Private::Models::CustomDrug',
  favorite_drugs: {
    favorites: [
      {
        id: 1,
        name: 'Custom_Test_1',
        drug_form: 'tablet',
        med_strength: '100',
        med_strength_unit: 'mg',
        country: 'IE',
      },
    ],
    remainder: [
      {
        id: 2,
        name: 'Custom_Test_2',
        drug_form: 'capsule',
        med_strength: '200',
        med_strength_unit: 'mg',
        country: 'GB',
      },
    ],
  },
};

export const NHSDrugs = {
  drug_type: 'Emr::Private::Models::NhsDmdDrug',
  favorite_drugs: {
    favorites: [
      {
        id: 1,
        name: 'NHS_Test1',
        vpid: '00001',
      },
      {
        id: 12,
        name: 'NHS_B',
        vpid: '00012',
      },
    ],
    remainder: [
      {
        id: 11,
        name: 'NHS_A',
        vpid: '00011',
      },
      {
        id: 2,
        name: 'NHS_Test2',
        vpid: '00003',
      },
    ],
  },
};

export const FDBDrugs = {
  drug_type: 'Emr::Private::Models::FdbDispensableDrug',
  favorite_drugs: {
    favorites: [
      {
        id: 1,
        name: 'FDB_Test1',
        dispensable_drug_id: 'FDB_001',
        med_strength: '100',
        med_strength_unit: 'mg',
        dose_form_desc: 'Take loads',
        route_desc: 'By mouth',
        drug_name_desc: 'FDB wonder drug',
      },
    ],
    remainder: [
      {
        id: 2,
        name: 'FDB_Test2',
        dispensable_drug_id: 'FDB_002',
        med_strength: '200',
        med_strength_unit: 'mg',
        dose_form_desc: 'Take a little',
        route_desc: 'Inhale',
        drug_name_desc: 'FDB super drug',
      },
    ],
  },
};
