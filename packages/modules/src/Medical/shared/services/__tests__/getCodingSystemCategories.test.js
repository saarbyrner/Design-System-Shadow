import {
  getInjuryOsicsPathologies,
  getIllnessOsicsPathologies,
  getInjuryOsicsClassifications,
  getIllnessOsicsClassifications,
  getInjuryOsicsBodyAreas,
  getIllnessOsicsBodyAreas,
  getDatalysBodyAreas,
  getDatalysClassifications,
  getClinicalImpressionsClassifications,
  getClinicalImpressionsBodyAreas,
} from '@kitman/services';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { waitFor } from '@testing-library/react';
import getCodingSystemCategories from '../getCodingSystemCategories';

const osicsMockData = {
  injuries: {
    osics_pathologies: [
      { id: 1392, name: '1st CMC joint instability' },
      { id: 1394, name: '1st MCP joint instability' },
      { id: 948, name: 'AC Joint Contusion' },
    ],
    osics_classifications: [
      { id: 13, name: 'Osteoarthritis' },
      { id: 2, name: 'Osteochondral' },
      { id: 7, name: 'Dislocation' },
    ],
    osics_body_areas: [
      { id: 1, name: 'Ankle' },
      { id: 2, name: 'Buttock/pelvis' },
      { id: 3, name: 'Chest' },
    ],
  },
  illnesses: {
    osics_pathologies: [
      { id: 1168, name: 'Abdominopelvic Structural abnormality' },
      { id: 1392, name: '1st CMC Joint instability' },
      { id: 366, name: 'Accessory bone foot' },
    ],
    osics_classifications: [
      { id: 5, name: 'Structural Abnormality' },
      { id: 3, name: 'Other Pain/ unspecified' },
      { id: 1, name: 'Apophysitis' },
    ],
    osics_body_areas: [
      { id: 18, name: 'Unspecified/Crossing' },
      { id: 12, name: 'Neck' },
      { id: 16, name: 'Thoracic Spine' },
    ],
  },
};

const datalysMockData = {
  datalys_classifications: [
    { id: 13, name: 'Osteoarthritis' },
    { id: 2, name: 'Osteochondral' },
    { id: 7, name: 'Dislocation' },
  ],
  datalys_body_areas: [
    { id: 1, name: 'Ankle' },
    { id: 2, name: 'Buttock/pelvis' },
    { id: 3, name: 'Chest' },
  ],
};

const clinicalImpressionsMockData = {
  clinical_impression_classifications: [
    { id: 13, name: 'Osteoarthritis' },
    { id: 2, name: 'Osteochondral' },
    { id: 7, name: 'Dislocation' },
  ],
  clinical_impression_body_areas: [
    { id: 1, name: 'Ankle' },
    { id: 2, name: 'Buttock/pelvis' },
    { id: 3, name: 'Chest' },
  ],
};

jest.mock('@kitman/services', () => ({
  getInjuryOsicsPathologies: jest.fn(() =>
    Promise.resolve(osicsMockData.injuries.osics_pathologies)
  ),
  getIllnessOsicsPathologies: jest.fn(() =>
    Promise.resolve(osicsMockData.illnesses.osics_pathologies)
  ),
  getInjuryOsicsClassifications: jest.fn(() =>
    Promise.resolve(osicsMockData.injuries.osics_classifications)
  ),
  getIllnessOsicsClassifications: jest.fn(() =>
    Promise.resolve(osicsMockData.illnesses.osics_classifications)
  ),
  getInjuryOsicsBodyAreas: jest.fn(() =>
    Promise.resolve(osicsMockData.injuries.osics_body_areas)
  ),
  getIllnessOsicsBodyAreas: jest.fn(() =>
    Promise.resolve(osicsMockData.illnesses.osics_body_areas)
  ),
  getDatalysBodyAreas: jest.fn(() =>
    Promise.resolve(datalysMockData.datalys_body_areas)
  ),
  getDatalysClassifications: jest.fn(() =>
    Promise.resolve(datalysMockData.datalys_classifications)
  ),
  getClinicalImpressionsClassifications: jest.fn(() =>
    Promise.resolve(
      clinicalImpressionsMockData.clinical_impression_classifications
    )
  ),
  getClinicalImpressionsBodyAreas: jest.fn(() =>
    Promise.resolve(clinicalImpressionsMockData.clinical_impression_body_areas)
  ),
}));

describe('getCodingSystemCategories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct array for codingSystemKeys.OSICS_10', async () => {
    const promisesToResolve = getCodingSystemCategories(
      codingSystemKeys.OSICS_10
    );

    await waitFor(() => {
      expect(getInjuryOsicsPathologies).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsPathologies).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsClassifications).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsClassifications).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsBodyAreas).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsBodyAreas).toHaveBeenCalledTimes(1);
    });

    expect(promisesToResolve).toEqual([
      Promise.resolve(osicsMockData.injuries.osics_pathologies),
      Promise.resolve(osicsMockData.illnesses.osics_pathologies),
      Promise.resolve(osicsMockData.injuries.osics_classifications),
      Promise.resolve(osicsMockData.illnesses.osics_classifications),
      Promise.resolve(osicsMockData.injuries.osics_body_areas),
      Promise.resolve(osicsMockData.illnesses.osics_body_areas),
    ]);
  });

  it('returns the correct array for codingSystemKeys.DATALYS', async () => {
    const promisesToResolve = getCodingSystemCategories(
      codingSystemKeys.DATALYS
    );

    await waitFor(() => {
      expect(getDatalysBodyAreas).toHaveBeenCalledTimes(1);
      expect(getDatalysClassifications).toHaveBeenCalledTimes(1);
    });

    expect(promisesToResolve).toEqual([
      Promise.resolve(datalysMockData.datalys_body_areas),
      Promise.resolve(datalysMockData.datalys_classifications),
    ]);
  });

  it('returns the correct array for codingSystemKeys.CLINICAL_IMPRESSIONS', async () => {
    const promisesToResolve = getCodingSystemCategories(
      codingSystemKeys.CLINICAL_IMPRESSIONS
    );

    await waitFor(() => {
      expect(getClinicalImpressionsClassifications).toHaveBeenCalledTimes(1);
      expect(getClinicalImpressionsBodyAreas).toHaveBeenCalledTimes(1);
    });

    expect(promisesToResolve).toEqual([
      Promise.resolve(
        clinicalImpressionsMockData.clinical_impression_classifications
      ),
      Promise.resolve(
        clinicalImpressionsMockData.clinical_impression_body_areas
      ),
    ]);
  });

  it('returns the correct array for codingSystemKeys.ICD', async () => {
    const promisesToResolve = getCodingSystemCategories(codingSystemKeys.ICD);

    await waitFor(() => {
      expect(getInjuryOsicsClassifications).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsClassifications).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsBodyAreas).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsBodyAreas).toHaveBeenCalledTimes(1);
    });

    expect(promisesToResolve).toEqual([
      Promise.resolve(osicsMockData.injuries.osics_classifications),
      Promise.resolve(osicsMockData.illnesses.osics_classifications),
      Promise.resolve(osicsMockData.injuries.osics_body_areas),
      Promise.resolve(osicsMockData.illnesses.osics_body_areas),
    ]);
  });
});
