// @flow
import type { FdbDispensableDrug } from '@kitman/services/src/services/medical/searchDispensableDrugs';

export type DrugType =
  | 'Emr::Private::Models::FdbDispensableDrug'
  | 'Emr::Private::Models::NhsDmdDrug'
  | 'Emr::Private::Models::CustomDrug';

export const drugTypesEnum: { [key: string]: DrugType } = {
  FdbDispensableDrug: 'Emr::Private::Models::FdbDispensableDrug',
  NhsDmdDrug: 'Emr::Private::Models::NhsDmdDrug',
  CustomDrug: 'Emr::Private::Models::CustomDrug',
};

export type MedicationSourceListName =
  | 'nhs_dmd_drugs'
  | 'fdb_dispensable_drugs'
  | 'custom_drugs';

export type MedicationListSource = {
  id: number,
  name: MedicationSourceListName,
  drug_type: DrugType,
};

export type MedicationListSources = {
  primary: MedicationListSource,
};

export type CustomDrugData = {|
  name: string,
  brand_name?: ?string,
  drug_form: string,
  med_strength: string,
  med_strength_unit: string,
  country?: ?string, // alpha2 country code
  display_name?: string,
|};

export type CustomDrugFormData = {
  ...CustomDrugData,
  med_strength_other_unit?: string,
};

export type CustomDrug = {
  ...CustomDrugData,
  id: number,
};

export type CreateCustomDrugResponse = {
  drug: CustomDrug,
};

export type NhsDmdDrugBasic = {|
  id: number,
  name: string,
  vpid: string, // Virtual medical product ID
|};

export type DrugSearchResponse =
  | {
      drug_type: 'Emr::Private::Models::FdbDispensableDrug',
      drugs: Array<FdbDispensableDrug>,
    }
  | {
      drug_type: 'Emr::Private::Models::NhsDmdDrug',
      drugs: Array<NhsDmdDrugBasic>,
    }
  | {
      drug_type: 'Emr::Private::Models::CustomDrug',
      drugs: Array<CustomDrug>,
    };

export type SearchDrugsFavoritesResponse = {
  drug_type: DrugType,
  favorite_drugs: {
    favorites: Array<NhsDmdDrugBasic> | Array<FdbDispensableDrug>,
    remainder: Array<NhsDmdDrugBasic> | Array<FdbDispensableDrug>,
  },
};
