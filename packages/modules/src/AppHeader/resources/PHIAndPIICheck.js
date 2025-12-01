// @flow
const MEDICAL_URL = '/medical';

const PHI_URLS = [
  '/athletes/\\d+',
  '/athletes/availability',
  '/athletes/availability_report',
  '/analysis/injuries',
];

const PII_URLS = [
  '/administration/athletes',
  '/user_profile/edit',
  '/users',
  '/users/\\d+/edit',
  '/settings/athletes/\\d+/edit',
  '/settings/athletes/\\d+/user_details/edit',
  '/settings/athletes/\\d+/emergency_contacts/new',
  '/settings/athletes/\\d+/insurance_policies/new',
];
export type PHIAndPIICheckType = {
  isMedicalPage: boolean,
  isPHI: boolean,
  isPII: boolean,
};

const PHIAndPIICheck = () => {
  const currentURL = window.location.href;

  let isPHI = false;
  let isPII = false;
  let isMedicalPage = false;

  if (PHI_URLS.some((item) => new RegExp(item).test(currentURL))) {
    isPHI = true;
  }

  if (PII_URLS.some((item) => new RegExp(item).test(currentURL))) {
    isPII = true;
  }

  if (currentURL.includes(MEDICAL_URL)) {
    isMedicalPage = true;
    isPHI = true;
  }

  return { isPII, isPHI, isMedicalPage };
};

export default PHIAndPIICheck;
