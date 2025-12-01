import demographicReportData from '@kitman/services/src/mocks/handlers/exports/exportDemographicReport/exportDemographicReportData.mock';
import emergencyContactsReportData from '@kitman/services/src/mocks/handlers/exports/exportDemographicReport/emergencyContactsReportData.mock';
import {
  sortDemographicAthletes,
  sortEmergencyContactAthletes,
} from '../sortingHelpers';

describe('sortingHelpers', () => {
  it('can sort athletes by lastname first with sortDemographicAthletes', () => {
    const sortKeys = { primary: 'lastname', secondary: 'firstname' };
    const sortedAthletes = sortDemographicAthletes(
      [...demographicReportData.athletes],
      sortKeys
    );

    expect(sortedAthletes[0].lastname).toEqual('Albornoz');
    expect(sortedAthletes[1].lastname).toEqual('Cannone');
    expect(sortedAthletes[2].lastname).toEqual('Conway');
  });

  it('can sort athletes by firstname first with sortDemographicAthletes', () => {
    const sortKeys = { primary: 'firstname', secondary: 'lastname' };
    const sortedAthletes = sortDemographicAthletes(
      [...demographicReportData.athletes],
      sortKeys
    );

    expect(sortedAthletes[0].firstname).toEqual('Adam');
    expect(sortedAthletes[1].firstname).toEqual('Niccolo');
    expect(sortedAthletes[2].firstname).toEqual('Tomas');
  });

  it('can sort athletes without a secondary sort with sortDemographicAthletes', () => {
    const sortKeys = { primary: 'lastname' };
    const sortedAthletes = sortDemographicAthletes(
      [...demographicReportData.athletes],
      sortKeys
    );

    expect(sortedAthletes[0].lastname).toEqual('Albornoz');
    expect(sortedAthletes[1].lastname).toEqual('Cannone');
    expect(sortedAthletes[2].lastname).toEqual('Conway');
  });

  it('can sort athletes by lastname first with sortEmergencyContactAthletes', () => {
    const sortKeys = { primary: 'lastname', secondary: 'firstname' };
    const sortedAthletes = sortEmergencyContactAthletes(
      [...emergencyContactsReportData.athletes],
      sortKeys
    );

    expect(sortedAthletes[0].lastname).toEqual('Albornoz');
    expect(sortedAthletes[1].lastname).toEqual('Cannone');
    expect(sortedAthletes[2].lastname).toEqual('Conway');
  });

  it('can sort athletes by firstname first with sortEmergencyContactAthletes', () => {
    const sortKeys = { primary: 'firstname', secondary: 'lastname' };
    const sortedAthletes = sortEmergencyContactAthletes(
      [...emergencyContactsReportData.athletes],
      sortKeys
    );

    expect(sortedAthletes[0].firstname).toEqual('Adam');
    expect(sortedAthletes[1].firstname).toEqual('Niccolo');
    expect(sortedAthletes[2].firstname).toEqual('Tomas');
  });

  it('can sort athletes without a secondary sort with sortEmergencyContactAthletes', () => {
    const sortKeys = { primary: 'lastname' };
    const sortedAthletes = sortEmergencyContactAthletes(
      [...emergencyContactsReportData.athletes],
      sortKeys
    );

    expect(sortedAthletes[0].lastname).toEqual('Albornoz');
    expect(sortedAthletes[1].lastname).toEqual('Cannone');
    expect(sortedAthletes[2].lastname).toEqual('Conway');
  });
});
