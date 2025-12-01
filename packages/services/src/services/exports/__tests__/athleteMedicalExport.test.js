import $ from 'jquery';
import athleteMedicalExport from '../athleteMedicalExport';

describe('athleteMedicalExport', () => {
  let athleteMedicalExportRequest;

  const filterExport = {
    athleteId: 1234,
    name: 'Albornaz Tomas Medical Export.zip',
    startDate: '2023-01-01',
    endDate: '2023-06-01',
    issues: [
      {
        issue_type: 'injury',
        issue_id: 1,
      },
      {
        issue_type: 'injury',
        issue_id: 2,
      },
    ],
    entityFilters: [
      'procedures',
      'files',
      'medications',
      'rehab_sessions',
      'notes',
      'maintenances',
      'allergies',
    ],
    noteTypes: [
      'OrganisationAnnotationTypes::Medical',
      'OrganisationAnnotationTypes::Nutrition',
      'OrganisationAnnotationTypes::RehabSession',
    ],
    unrelatedEntities: true,
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    athleteMedicalExportRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        attachments: [],
        created_at: '2022-09-02T17:10:26+01:00',
        export_type: 'athlete_medical_export',
        id: 24,
        name: 'Albornaz Tomas Medical Export.zip',
        status: 'pending',
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value with no filters', async () => {
    const returnedData = await athleteMedicalExport({
      athleteId: 1234,
      name: 'Albornaz Tomas Medical Export.zip',
    });
    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(athleteMedicalExportRequest).toHaveBeenCalledTimes(1);
    expect(athleteMedicalExportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1234,
        name: 'Albornaz Tomas Medical Export.zip',
      }),
    });
  });

  it('calls the correct endpoint and returns the correct value with filters', async () => {
    const returnedData = await athleteMedicalExport(filterExport);
    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(athleteMedicalExportRequest).toHaveBeenCalledTimes(1);
    expect(athleteMedicalExportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1234,
        name: 'Albornaz Tomas Medical Export.zip',
        start_date: '2023-01-01',
        end_date: '2023-06-01',
        issues: [
          {
            issue_type: 'injury',
            issue_id: 1,
          },
          {
            issue_type: 'injury',
            issue_id: 2,
          },
        ],
        entities_to_include: [
          'procedures',
          'files',
          'medications',
          'rehab_sessions',
          'notes',
          'maintenances',
          'allergies',
        ],
        note_types: [
          'OrganisationAnnotationTypes::Medical',
          'OrganisationAnnotationTypes::Nutrition',
          'OrganisationAnnotationTypes::RehabSession',
        ],
        include_entities_not_related_to_any_issue: true,
      }),
    });
  });

  // Printer friendly
  it('calls the correct endpoint and includes printer_friendly parameter when isPrinterFriendly is true', async () => {
    const returnedData = await athleteMedicalExport({
      athleteId: 1234,
      name: 'Albornaz Tomas Medical Export.zip',
      isPrinterFriendly: true,
    });

    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(athleteMedicalExportRequest).toHaveBeenCalledTimes(1);
    expect(athleteMedicalExportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1234,
        name: 'Albornaz Tomas Medical Export.zip',
        printer_friendly: true,
      }),
    });
  });

  it('does not include printer_friendly parameter when isPrinterFriendly is false', async () => {
    const returnedData = await athleteMedicalExport({
      athleteId: 1234,
      name: 'Albornaz Tomas Medical Export.zip',
      isPrinterFriendly: false,
    });

    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(athleteMedicalExportRequest).toHaveBeenCalledTimes(1);
    expect(athleteMedicalExportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1234,
        name: 'Albornaz Tomas Medical Export.zip',
      }),
    });
  });

  // Email notification
  it('calls the correct endpoint and includes skip_notification parameter when skipNotification is true', async () => {
    const returnedData = await athleteMedicalExport({
      athleteId: 1234,
      name: 'Albornaz Tomas Medical Export.zip',
      skipNotification: true,
    });

    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(athleteMedicalExportRequest).toHaveBeenCalledTimes(1);
    expect(athleteMedicalExportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1234,
        name: 'Albornaz Tomas Medical Export.zip',
        skip_notification: true,
      }),
    });
  });

  it('does not include skip_notification parameter when skipNotification is false', async () => {
    const returnedData = await athleteMedicalExport({
      athleteId: 1234,
      name: 'Albornaz Tomas Medical Export.zip',
      skipNotification: false,
    });

    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(athleteMedicalExportRequest).toHaveBeenCalledTimes(1);
    expect(athleteMedicalExportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/athlete_medical_export',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1234,
        name: 'Albornaz Tomas Medical Export.zip',
      }),
    });
  });
});
