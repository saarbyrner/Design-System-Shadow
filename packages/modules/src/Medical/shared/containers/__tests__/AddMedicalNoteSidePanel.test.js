import { data } from '@kitman/services/src/mocks/handlers/medical/getAnnotationMedicalTypes';
import { getAnnotationTypes } from '../AddMedicalNoteSidePanel';

describe('getAnnotationTypes', () => {
  afterEach(() => {
    window.featureFlags = {};
  });

  it('excludes Document and NoCreate types', () => {
    const result = getAnnotationTypes(data, null);
    const expected = [
      {
        label: 'Medical note',
        type: 'OrganisationAnnotationTypes::Medical',
        value: 1,
      },
      {
        label: 'Nutrition note',
        type: 'OrganisationAnnotationTypes::Nutrition',
        value: 2,
      },
      {
        label: 'Diagnostic note',
        type: 'OrganisationAnnotationTypes::Diagnostic',
        value: 5,
      },
    ];
    expect(result).toEqual(expected);
  });

  it('includes rehab note when feature flags enabled', () => {
    window.featureFlags = {
      'rehab-note': true,
    };

    const result = getAnnotationTypes(data, null);
    const expected = [
      {
        label: 'Medical note',
        type: 'OrganisationAnnotationTypes::Medical',
        value: 1,
      },
      {
        label: 'Nutrition note',
        type: 'OrganisationAnnotationTypes::Nutrition',
        value: 2,
      },
      {
        label: 'Rehab Note',
        type: 'OrganisationAnnotationTypes::RehabSession',
        value: 3,
      },
      {
        label: 'Diagnostic note',
        type: 'OrganisationAnnotationTypes::Diagnostic',
        value: 5,
      },
    ];
    expect(result).toEqual(expected);
  });

  it('excludes rehab note', () => {
    window.featureFlags = {
      'rehab-note': false,
    };

    // OrganisationAnnotationTypes::Document
    const result = getAnnotationTypes(data, null);
    const expected = [
      {
        label: 'Medical note',
        type: 'OrganisationAnnotationTypes::Medical',
        value: 1,
      },
      {
        label: 'Nutrition note',
        type: 'OrganisationAnnotationTypes::Nutrition',
        value: 2,
      },
      {
        label: 'Diagnostic note',
        type: 'OrganisationAnnotationTypes::Diagnostic',
        value: 5,
      },
    ];
    expect(result).toEqual(expected);
  });

  it('excludes diagnostic and rehab note', () => {
    window.featureFlags = {
      'rehab-note': false,
    };

    // OrganisationAnnotationTypes::Document
    const result = getAnnotationTypes(data, null);
    const expected = [
      {
        label: 'Medical note',
        type: 'OrganisationAnnotationTypes::Medical',
        value: 1,
      },
      {
        label: 'Nutrition note',
        type: 'OrganisationAnnotationTypes::Nutrition',
        value: 2,
      },
      {
        label: 'Diagnostic note',
        type: 'OrganisationAnnotationTypes::Diagnostic',
        value: 5,
      },
    ];
    expect(result).toEqual(expected);
  });

  it('supports a custom filter', () => {
    const result = getAnnotationTypes(data, () => true);
    const expected = [
      {
        label: 'Medical note',
        type: 'OrganisationAnnotationTypes::Medical',
        value: 1,
      },
      {
        label: 'Nutrition note',
        type: 'OrganisationAnnotationTypes::Nutrition',
        value: 2,
      },
      {
        label: 'Rehab Note',
        type: 'OrganisationAnnotationTypes::RehabSession',
        value: 3,
      },
      {
        label: 'Diagnostic note',
        type: 'OrganisationAnnotationTypes::Diagnostic',
        value: 5,
      },
    ];
    // Noter final filter is still run that removes Document and any creation_allowed false entries
    expect(result).toEqual(expected);
  });
});
