import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { defaultRehabPermissions } from '@kitman/common/src/contexts/PermissionsContext/rehab/index';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { renderHook, act } from '@testing-library/react-hooks';
import { data as orgData } from '@kitman/services/src/mocks/handlers/getOrganisation';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  getInjuryReport,
  getRehabReport,
  getCoachesReport,
} from '@kitman/services/src/services/medical';
import { data } from '@kitman/services/src/mocks/handlers/medical/getInjuryReport';
import { data as rehabData } from '@kitman/services/src/mocks/handlers/medical/getRehabReport';
import { groupedData as coachesGroupedData } from '@kitman/services/src/mocks/handlers/medical/getCoachesReport';
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import useReportData from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/hooks';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import ReportManager from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/common/src/hooks/useCSVExport');
jest.mock('@kitman/common/src/utils/downloadCSV', () => jest.fn()); // These tests don't use the full mock
jest.mock('@kitman/services/src/services/medical/getInjuryReport');
jest.mock('@kitman/services/src/services/medical/getRehabReport');
jest.mock('@kitman/services/src/services/medical/getCoachesReport');
jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetPermissionsQuery: jest.fn(),
  useGetPreferencesQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/medical', () => {
  const original = jest.requireActual('@kitman/services/src/services/medical');
  return {
    ...original,
    getInjuryReport: jest.fn(),
    getRehabReport: jest.fn(),
    getCoachesReport: jest.fn(),
  };
});

const defaultProps = {
  squads: [1],
  t: i18nextTranslateStub(),
};

const defaultPermissions = {
  medical: {
    ...defaultMedicalPermissions,
  },
  rehab: {
    ...defaultRehabPermissions,
  },
};

const mockTrackEvent = jest.fn();

const waitForLoading = async () =>
  waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Loading report data...' })
    ).not.toBeInTheDocument()
  );

const renderComponent = ({
  props = defaultProps,
  permissions = defaultPermissions,
} = {}) => {
  useGetPermissionsQuery.mockReturnValue({
    data: {
      ...defaultPermissions,
      ...permissions,
    },
  });

  return {
    user: userEvent.setup(),
    ...renderWithRedux(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <ReportManager {...{ ...defaultProps, ...props }} />
      </LocalizationProvider>,
      {
        useGlobalStore: false,
        preloadedState: { globalApi: {}, medicalApi: {} },
      }
    ),
  };
};

describe('RosterOverviewTab | <ReportManager />', () => {
  let jsdomPrint;
  const windowDotPrint = jest.fn();

  beforeEach(() => {
    jsdomPrint = window.print;
    jest.spyOn(window, 'print').mockImplementation(windowDotPrint);
    useGetOrganisationQuery.mockReturnValue({
      data: {
        ...orgData,
        coding_system_key: codingSystemKeys.OSICS_10,
      },
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: defaultPermissions,
    });
    useGetPreferencesQuery.mockReturnValue({
      data: {},
    });
    getRehabReport.mockResolvedValue(rehabData);
    getCoachesReport.mockResolvedValue({
      ...coachesGroupedData,
      groupingType: 'single',
    });
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  afterEach(() => {
    window.print = jsdomPrint;
  });

  it('renders nothing when there is no feature flags or permissions activated', () => {
    // this test is deliberately not asyncronous as we want to make sure no requests are being
    // fired as well
    const { container } = renderComponent();

    expect(container).toBeEmptyDOMElement();
  });

  describe('when only one report is available', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-report'] = false;
      window.featureFlags['rehab-print-multi-player'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-report'] = false;
      window.featureFlags['rehab-print-multi-player'] = false;
    });

    it('renders only one button', async () => {
      renderComponent({
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: true,
          },
        },
      });

      await waitForLoading();

      await waitFor(() =>
        expect(
          screen.getByRole('button', {
            name: 'Rehab Report',
          })
        ).toBeEnabled()
      );
    });
  });

  describe('when more than one report is available', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-report'] = true;
      window.featureFlags['rehab-print-multi-player'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-report'] = false;
      window.featureFlags['rehab-print-multi-player'] = false;
    });

    it('renders the tooltip menu', async () => {
      const { user } = renderComponent({
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: true,
          },
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      expect(
        screen.queryByRole('button', {
          name: 'Injury Report PDF',
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Injury Report CSV',
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Rehab Report',
        })
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] nfl-coaches-report', () => {
    beforeEach(() => {
      getCoachesReport.mockResolvedValue({
        ...coachesGroupedData,
        groupingType: 'single',
      });
      window.featureFlags['nfl-coaches-report'] = true;
    });

    afterEach(() => {
      getCoachesReport.mockClear();
      window.featureFlags['nfl-coaches-report'] = false;
    });

    it('triggers the coaches report settings when clicked', async () => {
      const { user } = renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await user.click(
        screen.getByRole('button', {
          name: 'Coaches Report',
        })
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Squads')).toBeVisible();
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Body Part')).toBeVisible();
        expect(screen.getByLabelText('Onset Date')).toBeVisible();
      });

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId('Printing|CoachesReport')
        ).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the coaches report button when multiple squads are selected', async () => {
      renderComponent({
        props: { squads: [1, 3] },
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Coaches Report',
        })
      ).toBeEnabled();
    });

    describe('PDF Export', () => {
      it('triggers the coaches report print view when clicked', async () => {
        const { user } = renderComponent({
          permissions: {
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          },
        });

        await waitForLoading();

        expect(
          screen.getByRole('button', {
            name: 'Coaches Report',
          })
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole('button', {
            name: 'Coaches Report',
          })
        );

        const downloadButton = within(
          screen.getByTestId('CoachesReportComponent')
        ).getByRole('button', { name: 'Download' });

        await user.click(downloadButton);

        await waitFor(() =>
          expect(
            screen.queryByTestId('Printing|CoachesReport')
          ).toBeInTheDocument()
        );
        expect(windowDotPrint).toHaveBeenCalled();
      });
    });
  });

  describe('[feature-flag] nfl-injury-report', () => {
    beforeEach(() => {
      getInjuryReport.mockResolvedValue(
        data[codingSystemKeys.CLINICAL_IMPRESSIONS]
      );
      window.featureFlags['nfl-injury-report'] = true;
    });

    afterEach(() => {
      getInjuryReport.mockClear();
      window.featureFlags['nfl-injury-report'] = false;
    });

    it('triggers the injury report settings when clicked', async () => {
      const { user } = renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await user.click(
        screen.getByRole('button', {
          name: 'Injury Report PDF',
        })
      );

      await waitFor(() => {
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Athlete Name')).toBeVisible();
        expect(screen.getByLabelText('Pathology')).toBeVisible();
        expect(screen.getByLabelText('Onset Date')).toBeVisible();
      });

      await user.click(
        within(screen.getByTestId('InjuryReportComponent')).getByRole(
          'button',
          {
            name: 'Download',
          }
        )
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId('Printing|InjuryReports')
        ).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the injury report button when multiple squads are selected', async () => {
      const { user } = renderComponent({
        props: { squads: [1, 3] },
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      expect(
        screen.getByRole('button', {
          name: 'Injury Report PDF',
        })
      ).toBeEnabled();
    });

    describe('PDF Export', () => {
      it('triggers the injury report pdf settings when clicked', async () => {
        const { user } = renderComponent({
          permissions: {
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          },
        });

        await waitForLoading();

        expect(
          screen.getByRole('button', {
            name: 'Download',
          })
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole('button', {
            name: 'Download',
          })
        );

        await user.click(
          screen.getByRole('button', {
            name: 'Injury Report PDF',
          })
        );

        expect(screen.getByLabelText('Athlete Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Athlete Name')).toBeChecked();
        expect(screen.getByLabelText('Athlete Name')).toHaveAttribute(
          'aria-disabled',
          'true'
        );
        expect(screen.getByLabelText('Issue Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Issue Name')).toHaveAttribute(
          'aria-disabled',
          'true'
        );
        expect(screen.getByLabelText('Onset Date')).toBeInTheDocument();
        expect(screen.getByLabelText('Onset Date')).toHaveAttribute(
          'aria-disabled',
          'true'
        );
        expect(screen.getByLabelText('Player ID')).toBeInTheDocument();
        expect(screen.getByLabelText('Player ID')).not.toBeChecked();
        expect(screen.getByLabelText('Jersey Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Jersey Number')).not.toBeChecked();
        expect(screen.getByLabelText('Position')).toBeInTheDocument();
        expect(screen.getByLabelText('Position')).not.toBeChecked();
        expect(screen.getByLabelText('Pathology')).toBeInTheDocument();
        expect(screen.getByLabelText('Pathology')).not.toBeChecked();
        expect(screen.getByText('Injury Status')).toBeInTheDocument();
        expect(screen.getByText('Injury Status')).not.toBeChecked();
        expect(screen.getByText('Latest Note')).toBeInTheDocument();
        expect(screen.getByText('Latest Note')).not.toBeChecked();

        // Field not visible by default
        expect(
          screen.queryByRole('group', { name: 'Issue Type' })
        ).not.toBeInTheDocument();

        await user.click(
          within(screen.getByTestId('InjuryReportComponent')).getByRole(
            'button',
            {
              name: 'Download',
            }
          )
        );

        await waitFor(() =>
          expect(
            screen.queryByTestId('Printing|InjuryReports')
          ).toBeInTheDocument()
        );
        expect(windowDotPrint).toHaveBeenCalled();
      });

      describe('when the report fails', () => {
        const downloadReport = async () => {
          const { user } = renderComponent({
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                issues: {
                  ...defaultMedicalPermissions.issues,
                  canExport: true,
                },
              },
            },
          });

          await waitForLoading();

          expect(
            screen.getByRole('button', {
              name: 'Download',
            })
          ).toBeInTheDocument();

          await user.click(
            screen.getByRole('button', {
              name: 'Download',
            })
          );

          await user.click(
            screen.getByRole('button', {
              name: 'Injury Report PDF',
            })
          );

          await user.click(
            within(screen.getByTestId('InjuryReportComponent')).getByRole(
              'button',
              {
                name: 'Download',
              }
            )
          );
        };

        describe('for standard errors', () => {
          beforeEach(() => {
            getInjuryReport.mockRejectedValue();
            window.featureFlags['nfl-injury-report'] = true;
          });

          afterEach(() => {
            getInjuryReport.mockClear();
            window.featureFlags['nfl-injury-report'] = false;
          });

          it('handles the error by displaying a toast', async () => {
            await downloadReport();

            await waitFor(() => {
              expect(
                screen.queryByText('There was an error loading your report.')
              ).toBeInTheDocument();
            });
          });
        });

        describe('for timeout errors', () => {
          beforeEach(() => {
            getInjuryReport.mockRejectedValue({
              responseText:
                'Timeout::Error in Medical::Rehab::SessionsController#multi_athlete_report',
            });
            window.featureFlags['nfl-injury-report'] = true;
          });

          afterEach(() => {
            getInjuryReport.mockClear();
            window.featureFlags['nfl-injury-report'] = false;
          });

          it('handles error with a warning message', async () => {
            await downloadReport();

            await waitFor(() => {
              expect(
                screen.queryByText('Unable to download')
              ).toBeInTheDocument();
              expect(
                screen.queryByText(
                  'Report too large. Try to reduce the number of squads selected.'
                )
              ).toBeInTheDocument();
            });
          });
        });
      });

      describe('[feature-flag] injury-report-issue-type-field', () => {
        beforeEach(() => {
          window.featureFlags['nfl-injury-report'] = true;
          window.featureFlags['injury-report-issue-type-field'] = true;
        });

        afterEach(() => {
          window.featureFlags['nfl-injury-report'] = false;
          window.featureFlags['injury-report-issue-type-field'] = false;
        });

        it('renders the issue type field', async () => {
          const { user } = renderComponent({
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                issues: {
                  ...defaultMedicalPermissions.issues,
                  canExport: true,
                },
              },
            },
          });

          await waitForLoading();

          expect(
            screen.getByRole('button', {
              name: 'Download',
            })
          ).toBeInTheDocument();

          await user.click(
            screen.getByRole('button', {
              name: 'Download',
            })
          );

          await user.click(
            screen.getByRole('button', {
              name: 'Injury Report PDF',
            })
          );

          expect(
            screen.getByRole('group', { name: 'Issue Type' })
          ).toBeInTheDocument();
        });
      });

      describe('squads field', () => {
        beforeEach(() => {
          window.featureFlags['nfl-injury-report'] = true;
        });

        afterEach(() => {
          window.featureFlags['nfl-injury-report'] = false;
        });

        it('renders the squads field', async () => {
          const { user } = renderComponent({
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                issues: {
                  ...defaultMedicalPermissions.issues,
                  canExport: true,
                },
              },
            },
          });

          await waitForLoading();

          expect(
            screen.getByRole('button', {
              name: 'Download',
            })
          ).toBeInTheDocument();

          await user.click(
            screen.getByRole('button', {
              name: 'Download',
            })
          );

          await user.click(
            screen.getByRole('button', {
              name: 'Injury Report PDF',
            })
          );
          const injuryReport = screen.getByTestId('InjuryReportComponent');

          expect(
            within(injuryReport).getByLabelText('Squads')
          ).toBeInTheDocument();
        });

        it('renders the squads field when no squad id', async () => {
          const { user } = renderComponent({
            props: { squadId: null },
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                issues: {
                  ...defaultMedicalPermissions.issues,
                  canExport: true,
                },
              },
            },
          });

          await waitForLoading();

          expect(
            screen.getByRole('button', {
              name: 'Download',
            })
          ).toBeInTheDocument();

          await user.click(
            screen.getByRole('button', {
              name: 'Download',
            })
          );

          await user.click(
            screen.getByRole('button', {
              name: 'Injury Report PDF',
            })
          );
          const injuryReport = screen.getByTestId('InjuryReportComponent');

          expect(
            within(injuryReport).getByLabelText('Squads')
          ).toBeInTheDocument();
        });

        it('sends the correct parameters', async () => {
          const { user } = renderComponent({
            permissions: {
              medical: {
                ...defaultMedicalPermissions,
                issues: {
                  ...defaultMedicalPermissions.issues,
                  canExport: true,
                },
              },
            },
          });

          await waitForLoading();

          expect(
            screen.getByRole('button', {
              name: 'Download',
            })
          ).toBeInTheDocument();

          await user.click(
            screen.getByRole('button', {
              name: 'Download',
            })
          );

          await user.click(
            screen.getByRole('button', {
              name: 'Injury Report PDF',
            })
          );

          const injuryReport = screen.getByTestId('InjuryReportComponent');

          await user.click(
            within(injuryReport).getByRole('button', {
              name: 'Download',
            })
          );

          expect(getInjuryReport).toHaveBeenCalledWith(
            expect.objectContaining({
              population: [
                {
                  all_squads: false,
                  applies_to_squad: false,
                  athletes: [],
                  context_squads: [1],
                  position_groups: [],
                  positions: [],
                  squads: [1],
                },
              ],
            })
          );
        });
      });
    });

    describe('CSV Export', () => {
      beforeEach(() => {
        window.featureFlags['emr-multiple-coding-systems'] = true;
      });

      afterEach(() => {
        window.featureFlags['emr-multiple-coding-systems'] = true;
      });

      const downloadReport = async () => {
        const { user } = renderComponent({
          permissions: {
            medical: {
              ...defaultMedicalPermissions,
              issues: {
                ...defaultMedicalPermissions.issues,
                canExport: true,
              },
            },
          },
        });

        await waitForLoading();

        expect(
          screen.getByRole('button', {
            name: 'Download',
          })
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole('button', {
            name: 'Download',
          })
        );

        await user.click(
          screen.getByRole('button', {
            name: 'Injury Report CSV',
          })
        );
      };

      const setupPDFExportTest = async () => {
        await downloadReport();

        await waitFor(() => {
          expect(getInjuryReport).toHaveBeenCalled();
        });

        await waitFor(() => {
          expect(downloadCSV).toHaveBeenCalled();
        });
      };

      const testStaticFields = (expectedFields) => {
        // Getting the filename, data and config passed into the
        // download function to test it is correct
        const fieldConfig = downloadCSV.mock.calls[0][2];

        // Going through the expected fields
        // Making sure that they appear in the field config
        // passed into the downloadCSV function
        expectedFields.forEach((field) => {
          expect(fieldConfig.fields).toEqual(
            expect.arrayContaining([expect.objectContaining(field)])
          );
        });
      };

      const testFormattedFields = (expectedFormattedFields, testData) => {
        const fieldConfig = downloadCSV.mock.calls[0][2];

        // Going through fields that require formatting and
        // checking that they format the data correctly
        expectedFormattedFields.forEach((field) => {
          const expectedData = Object.values(testData).flat();

          const relatedField = fieldConfig.fields.find(
            (configField) => configField.label === field.label
          );

          expectedData.forEach((row, index) => {
            expect(relatedField.value(row)).toBe(field.expectedOutput[index]);
          });
        });
      };

      describe('[coding-system] icd', () => {
        beforeEach(() => {
          getInjuryReport.mockResolvedValue(data[codingSystemKeys.ICD]);
          useGetOrganisationQuery.mockReturnValue({
            data: {
              ...orgData,
              coding_system_key: codingSystemKeys.ICD,
            },
            isSuccess: 'SUCCESS',
          });
        });

        afterEach(() => {
          getInjuryReport.mockClear();
        });

        it('calls the injury report with the correct titles', async () => {
          expect.hasAssertions();

          await setupPDFExportTest();

          const expectedFormattedFields = [
            {
              label: 'Latest Note',
              // Expected output for each row of data expected
              expectedOutput: ['Test with markup', null, null, null],
            },
            {
              label: 'Pathology',
              expectedOutput: [
                'ICD pathology 1',
                'ICD pathology 2',
                'ICD pathology 3',
                'ICD pathology 4',
              ],
            },
            {
              label: 'Modifications',
              // Expected output for each row of data expected
              expectedOutput: [
                'Modification 1\n---\nModification 2',
                '',
                'Modification in limited',
                '',
              ],
            },
          ];

          const expectedStaticFields = [
            { label: 'Name', value: 'athlete.name' },
            { label: '#', value: 'squad_number' },
            { label: 'Pos', value: 'position' },
            { label: 'Body Area', value: 'body_area' },
            { label: 'Injury', value: 'injury' },
            { label: 'Status', value: 'status.description' },
            { label: 'Roster', value: 'squads.name' },
            {
              label: 'Contact type',
              value: 'issue_contact_type.name',
            },
            {
              label: 'Time of Injury',
              value: 'occurrence_min',
            },
            {
              label: 'Position When Injured',
              value: 'position_when_injured',
            },
            {
              label: 'Mechanism',
              value: 'activity',
            },
            {
              label: 'Primary Mode',
              value: 'onset',
            },
          ];

          testFormattedFields(
            expectedFormattedFields,
            data[codingSystemKeys.ICD]
          );
          testStaticFields(expectedStaticFields);
        });
      });

      describe('[coding-system] osics', () => {
        beforeEach(() => {
          getInjuryReport.mockResolvedValue(data[codingSystemKeys.OSICS_10]);
          useGetOrganisationQuery.mockReturnValue({
            data: {
              ...orgData,
              coding_system_key: codingSystemKeys.OSICS_10,
            },
            isSuccess: 'SUCCESS',
          });
        });

        afterEach(() => {
          getInjuryReport.mockClear();
        });

        it('calls the injury report with the correct titles', async () => {
          expect.hasAssertions();

          await setupPDFExportTest();

          const expectedFormattedFields = [
            {
              label: 'Latest Note',
              // Expected output for each row of data expected
              expectedOutput: ['Test with markup', null, null, null],
            },
            {
              label: 'Pathology',
              expectedOutput: [
                'OSICS pathology 1',
                'OSICS pathology 2',
                'OSICS pathology 3',
                'OSICS pathology 4',
              ],
            },
            {
              label: 'Modifications',
              // Expected output for each row of data expected
              expectedOutput: [
                'Modification 1\n---\nModification 2',
                '',
                'Modification in limited',
                '',
              ],
            },
          ];

          const expectedStaticFields = [
            { label: 'Name', value: 'athlete.name' },
            { label: '#', value: 'squad_number' },
            { label: 'Pos', value: 'position' },
            { label: 'Body Area', value: 'body_area' },
            { label: 'Injury', value: 'injury' },
            { label: 'Status', value: 'status.description' },
            { label: 'Roster', value: 'squads.name' },
            {
              label: 'Contact type',
              value: 'issue_contact_type.name',
            },
            {
              label: 'Time of Injury',
              value: 'occurrence_min',
            },
            {
              label: 'Position When Injured',
              value: 'position_when_injured',
            },
            {
              label: 'Mechanism',
              value: 'activity',
            },
            {
              label: 'Primary Mode',
              value: 'onset',
            },
            {
              label: 'Classification',
              value: 'coding.osics_10.classification.name',
            },
            {
              label: 'Body area',
              value: 'coding.osics_10.body_area.name',
            },
            {
              label: 'Code',
              value: 'coding.osics_10.osics_code',
            },
            {
              label: 'Side',
              value: 'coding.osics_10.side.name',
            },
          ];

          testFormattedFields(
            expectedFormattedFields,
            data[codingSystemKeys.OSICS_10]
          );
          testStaticFields(expectedStaticFields);
        });
      });

      describe('[coding-system] datalys', () => {
        beforeEach(() => {
          getInjuryReport.mockResolvedValue(data[codingSystemKeys.DATALYS]);
          useGetOrganisationQuery.mockReturnValue({
            data: {
              ...orgData,
              coding_system_key: codingSystemKeys.DATALYS,
            },
            isSuccess: 'SUCCESS',
          });
        });

        beforeEach(() => {
          getInjuryReport.mockClear();
        });

        it('calls the injury report with the correct titles', async () => {
          expect.hasAssertions();

          await setupPDFExportTest();

          const expectedFormattedFields = [
            {
              label: 'Latest Note',
              // Expected output for each row of data expected
              expectedOutput: ['Test with markup', null, null, null],
            },
            {
              label: 'Pathology',
              expectedOutput: [
                'Datalys pathology 1',
                'Datalys pathology 2',
                'Datalys pathology 3',
                'Datalys pathology 4',
              ],
            },
            {
              label: 'Modifications',
              // Expected output for each row of data expected
              expectedOutput: [
                'Modification 1\n---\nModification 2',
                '',
                'Modification in limited',
                '',
              ],
            },
          ];

          const expectedStaticFields = [
            { label: 'Name', value: 'athlete.name' },
            { label: '#', value: 'squad_number' },
            { label: 'Pos', value: 'position' },
            { label: 'Body Area', value: 'body_area' },
            { label: 'Injury', value: 'injury' },
            { label: 'Status', value: 'status.description' },
            { label: 'Roster', value: 'squads.name' },
            {
              label: 'Contact type',
              value: 'issue_contact_type.name',
            },
            {
              label: 'Time of Injury',
              value: 'occurrence_min',
            },
            {
              label: 'Position When Injured',
              value: 'position_when_injured',
            },
            {
              label: 'Mechanism',
              value: 'activity',
            },
            {
              label: 'Primary Mode',
              value: 'onset',
            },
            {
              label: 'Classification',
              value: 'coding.datalys.datalys_classification.name',
            },
            {
              label: 'Body area',
              value: 'coding.datalys.datalys_body_area.name',
            },
            {
              label: 'Tissue type',
              value: 'coding.datalys.datalys_tissue_type.name',
            },
            {
              label: 'Side',
              value: 'coding.datalys.side.name',
            },
          ];

          testFormattedFields(
            expectedFormattedFields,
            data[codingSystemKeys.DATALYS]
          );
          testStaticFields(expectedStaticFields);
        });
      });

      describe('[coding-system] clinical_impressions', () => {
        beforeEach(() => {
          getInjuryReport.mockResolvedValue(
            data[codingSystemKeys.CLINICAL_IMPRESSIONS]
          );
          useGetOrganisationQuery.mockReturnValue({
            data: {
              ...orgData,
              coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
            },
            isSuccess: 'SUCCESS',
          });
        });

        afterEach(() => {
          getInjuryReport.mockClear();
        });

        it('calls the injury report with the correct titles', async () => {
          expect.hasAssertions();

          await setupPDFExportTest();

          const expectedFormattedFields = [
            {
              label: 'Latest Note',
              // Expected output for each row of data expected
              expectedOutput: ['Test with markup', null, null, null],
            },
            {
              label: 'Pathology',
              expectedOutput: [
                'Clinical impressions pathology 1',
                'Clinical impressions pathology 2',
                'Clinical impressions pathology 3',
                'Clinical impressions pathology 4',
              ],
            },
            {
              label: 'Modifications',
              // Expected output for each row of data expected
              expectedOutput: [
                'Modification 1\n---\nModification 2',
                '',
                'Modification in limited',
                '',
              ],
            },
          ];

          const expectedStaticFields = [
            { label: 'Name', value: 'athlete.name' },
            { label: '#', value: 'squad_number' },
            { label: 'Pos', value: 'position' },
            { label: 'Body Area', value: 'body_area' },
            { label: 'Injury', value: 'injury' },
            { label: 'Status', value: 'status.description' },
            { label: 'Roster', value: 'squads.name' },
            {
              label: 'Contact type',
              value: 'issue_contact_type.name',
            },
            {
              label: 'Time of Injury',
              value: 'occurrence_min',
            },
            {
              label: 'Position When Injured',
              value: 'position_when_injured',
            },
            {
              label: 'Mechanism',
              value: 'activity',
            },
            {
              label: 'Primary Mode',
              value: 'onset',
            },
            {
              label: 'Primary Classification',
              value:
                'coding.clinical_impressions.clinical_impression_classification.name',
            },
            {
              label: 'Primary Body Area',
              value:
                'coding.clinical_impressions.clinical_impression_body_area.name',
            },
            {
              label: 'Primary Side',
              value: 'coding.clinical_impressions.side.name',
            },
            {
              label: 'Primary Code',
              value: 'coding.clinical_impressions.code',
            },
            {
              label: 'Secondary CI Code',
              value:
                'coding.clinical_impressions.secondary_pathologies.record.pathology',
            },
            {
              label: 'Secondary Classification',
              value:
                'coding.clinical_impressions.secondary_pathologies.record.clinical_impression_classification.name',
            },
            {
              label: 'Secondary Body Area',
              value:
                'coding.clinical_impressions.secondary_pathologies.record.clinical_impression_body_area.name',
            },
            {
              label: 'Secondary Side',
              value:
                'coding.clinical_impressions.secondary_pathologies.side.name',
            },
            {
              label: 'Secondary Code',
              value:
                'coding.clinical_impressions.secondary_pathologies.record.code',
            },
          ];

          testFormattedFields(
            expectedFormattedFields,
            data[codingSystemKeys.CLINICAL_IMPRESSIONS]
          );
          testStaticFields(expectedStaticFields);
        });
      });

      describe('when the report fails', () => {
        describe('for standard errors', () => {
          beforeEach(() => {
            getInjuryReport.mockRejectedValue();
            window.featureFlags['nfl-injury-report'] = true;
          });

          afterEach(() => {
            getInjuryReport.mockClear();
            window.featureFlags['nfl-injury-report'] = false;
          });

          it('handles the error by displaying a toast', async () => {
            await downloadReport();

            await waitFor(() => {
              expect(
                screen.queryByText('There was an error loading your report.')
              ).toBeInTheDocument();
            });
          });
        });

        describe('for timeout errors', () => {
          beforeEach(() => {
            getInjuryReport.mockRejectedValue({
              responseText:
                'Timeout::Error in Medical::Rehab::SessionsController#multi_athlete_report',
            });
            window.featureFlags['nfl-injury-report'] = true;
          });

          afterEach(() => {
            getInjuryReport.mockClear();
            window.featureFlags['nfl-injury-report'] = false;
          });

          it('handles error with a warning message', async () => {
            await downloadReport();

            await waitFor(() => {
              expect(
                screen.queryByText('Unable to download')
              ).toBeInTheDocument();
              expect(
                screen.queryByText(
                  'Report too large. Try to reduce the number of squads selected.'
                )
              ).toBeInTheDocument();
            });
          });
        });
      });
    });
  });

  describe('[feature-flag] rehab-print-multi-player', () => {
    beforeEach(() => {
      window.featureFlags['rehab-print-multi-player'] = true;
    });

    afterEach(() => {
      window.featureFlags['rehab-print-multi-player'] = false;
    });

    it('triggers the rehab report settings when clicked', async () => {
      const { user } = renderComponent({
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: true,
          },
        },
      });

      await waitForLoading();

      await user.click(
        screen.getByRole('button', {
          name: 'Rehab Report',
        })
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Date')).toBeVisible();
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Player Name')).toBeVisible();
        expect(screen.getByLabelText('Body area')).toBeVisible();
      });

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await waitFor(() =>
        expect(screen.queryByTestId('Printing|RehabReport')).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the rehab report button when multiple squads are selected', async () => {
      renderComponent({
        props: { squads: [1, 3] },
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: true,
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Rehab Report',
        })
      ).toBeEnabled();
    });

    it('filters the report by date when setting the date', async () => {
      const { user } = renderComponent({
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: true,
          },
        },
      });

      await waitForLoading();

      // Navigate to the report
      await user.click(
        screen.getByRole('button', {
          name: 'Rehab Report',
        })
      );

      // Wait for the date input to be visible
      const dateInput = await screen.findByLabelText('Date');

      fireEvent.change(dateInput, {
        target: { value: '2023-03-11T00:00:00Z' },
      });

      // Trigger the download/report generation
      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      const report = await screen.findByTestId('Printing|RehabReport');
      const reportDate = await within(report).findByText(/Mar 11, 2023/);

      expect(reportDate).toBeInTheDocument();
      expect(windowDotPrint).toHaveBeenCalled();
    });

    describe('when the report fails', () => {
      const downloadReport = async () => {
        const { user } = renderComponent({
          permissions: {
            rehab: {
              ...defaultRehabPermissions,
              canView: true,
            },
          },
        });

        await waitForLoading();

        await user.click(
          screen.getByRole('button', {
            name: 'Rehab Report',
          })
        );

        await user.click(
          screen.getByRole('button', {
            name: 'Download',
          })
        );
      };

      describe('for standard errors', () => {
        beforeEach(() => {
          getRehabReport.mockRejectedValue();
          window.featureFlags['rehab-print-multi-player'] = true;
        });

        afterEach(() => {
          window.featureFlags['rehab-print-multi-player'] = false;
        });

        it('handles the error by displaying a toast', async () => {
          await downloadReport();

          await waitFor(() => {
            expect(
              screen.queryByText('There was an error loading your report.')
            ).toBeInTheDocument();
          });
        });
      });

      describe('for timeout errors', () => {
        beforeEach(() => {
          getRehabReport.mockRejectedValue({
            responseText:
              'Timeout::Error in Medical::Rehab::SessionsController#multi_athlete_report',
          });
          window.featureFlags['rehab-print-multi-player'] = true;
        });

        afterEach(() => {
          window.featureFlags['rehab-print-multi-player'] = false;
        });

        it('handles error with a warning message', async () => {
          await downloadReport();

          await waitFor(() => {
            expect(
              screen.queryByText('Unable to download')
            ).toBeInTheDocument();
            expect(
              screen.queryByText(
                'Report too large. Try to reduce the number of squads selected.'
              )
            ).toBeInTheDocument();
          });
        });
      });
    });

    describe('[feature-flag] rehab-report-enhancements', () => {
      beforeEach(() => {
        window.featureFlags['rehab-print-multi-player'] = true;
        window.featureFlags['rehab-report-enhancements'] = true;
      });

      afterEach(() => {
        window.featureFlags['rehab-print-multi-player'] = false;
        window.featureFlags['rehab-report-enhancements'] = false;
      });

      it('renders the squads field', async () => {
        const { user } = renderComponent({
          permissions: {
            rehab: {
              ...defaultRehabPermissions,
              canView: true,
            },
          },
        });

        await waitForLoading();

        await user.click(
          screen.getByRole('button', {
            name: 'Rehab Report',
          })
        );

        const injuryReport = screen.getByTestId('RehabReportComponent');

        expect(
          within(injuryReport).getByLabelText('Squads')
        ).toBeInTheDocument();
      });

      it('sends the correct parameters', async () => {
        const { user } = renderComponent({
          permissions: {
            rehab: {
              ...defaultRehabPermissions,
              canView: true,
            },
          },
        });

        await waitForLoading();

        await user.click(
          screen.getByRole('button', {
            name: 'Rehab Report',
          })
        );

        const injuryReport = screen.getByTestId('RehabReportComponent');

        expect(
          within(injuryReport).getByLabelText('Squads')
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole('button', {
            name: 'Download',
          })
        );

        expect(getRehabReport).toHaveBeenCalledWith(
          expect.objectContaining({
            population: [
              {
                all_squads: false,
                applies_to_squad: false,
                athletes: [],
                context_squads: [1],
                position_groups: [],
                positions: [],
                squads: [1],
              },
            ],
          })
        );

        getRehabReport.mockRestore();
      });
    });
  });

  describe('[permission] permissions.rehab.canView', () => {
    beforeEach(() => {
      window.featureFlags['rehab-print-multi-player'] = true;
    });

    afterEach(() => {
      window.featureFlags['rehab-print-multi-player'] = false;
    });

    it('has the rehab report trigger when true', async () => {
      renderComponent({
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: true,
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Rehab Report',
        })
      ).toBeInTheDocument();
    });

    it('doesnt display the rehabreport when false', async () => {
      renderComponent({
        permissions: {
          rehab: {
            ...defaultRehabPermissions,
            canView: false,
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Rehab Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] emergency-contacts-report', () => {
    beforeEach(() => {
      window.featureFlags['emergency-contacts-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['emergency-contacts-report'] = false;
    });

    it('triggers the emergency contacts report settings when clicked', async () => {
      const { user } = renderComponent();

      await waitForLoading();

      await user.click(
        screen.getByRole('button', {
          name: 'Emergency Contacts Report',
        })
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Squads')).toBeVisible();
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Player Name')).toBeVisible();
        expect(screen.getByLabelText('Contact name')).toBeVisible();
      });

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId('Printing|AthleteEmergencyContactsReport')
        ).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the emergency contacts report button when multiple squads are selected', async () => {
      renderComponent({ props: { squads: [1, 3] } });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Emergency Contacts Report',
        })
      ).toBeEnabled();
    });
  });

  describe('[feature-flag] emergency-medical-report', () => {
    beforeEach(() => {
      window.featureFlags['emergency-medical-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['emergency-medical-report'] = false;
    });

    it('triggers the emergency medical report settings when clicked', async () => {
      const { user } = renderComponent();

      await waitForLoading();

      await user.click(
        screen.getByRole('button', {
          name: 'Emergency Medical Report',
        })
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Squads')).toBeVisible();
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Player Name')).toBeVisible();
        expect(screen.getByLabelText('Date of Birth')).toBeVisible();
      });

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId('Printing|AthleteDemographicReport')
        ).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the emergency medical report button when multiple squads are selected', async () => {
      renderComponent({ props: { squads: [1, 3] } });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Emergency Medical Report',
        })
      ).toBeEnabled();
    });
  });

  describe('[feature-flag] x-ray-game-day-report', () => {
    beforeEach(() => {
      window.featureFlags['x-ray-game-day-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['x-ray-game-day-report'] = false;
    });

    it('triggers the x-ray game day report settings when clicked', async () => {
      const { user } = renderComponent();

      await waitForLoading();

      await user.click(
        screen.getByRole('button', {
          name: 'X-Ray Game Day Report',
        })
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Squads')).toBeVisible();
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Player Name')).toBeVisible();
        expect(screen.getByLabelText('Date of Birth')).toBeVisible();
      });

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId('Printing|AthleteDemographicReport')
        ).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the x-ray game day report button when multiple squads are selected', async () => {
      renderComponent({ props: { squads: [1, 3] } });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'X-Ray Game Day Report',
        })
      ).toBeEnabled();
    });
  });

  describe('[feature-flag] medications-report', () => {
    beforeEach(() => {
      window.featureFlags['medications-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['medications-report'] = false;
    });

    it('triggers the medications report settings when clicked', async () => {
      const { user } = renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      await user.click(
        screen.getByRole('button', {
          name: 'Medication Report PDF',
        })
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Squads')).toBeVisible();
        // Check for a couple of Column options:
        expect(screen.getByLabelText('Player Name')).toBeVisible();
        expect(screen.getByLabelText('Medication')).toBeVisible();
      });

      await user.click(
        within(screen.getByTestId('MedicationsReportComponent')).getByRole(
          'button',
          {
            name: 'Download',
          }
        )
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId('Printing|MedicationReports')
        ).toBeInTheDocument()
      );
      expect(windowDotPrint).toHaveBeenCalled();
    });

    it('enables the medications report button when multiple squads are selected', async () => {
      const { user } = renderComponent({
        props: { squads: [1, 3] },
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
          },
        },
      });

      await waitForLoading();

      expect(
        screen.getByRole('button', {
          name: 'Download',
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'Download',
        })
      );

      expect(
        screen.getByRole('button', {
          name: 'Medication Report PDF',
        })
      ).toBeEnabled();
    });
  });

  describe('[hook] useReportData', () => {
    it('returns a function to fetch data and sets correct status at each stage', async () => {
      const fetchDataMock = jest.fn().mockResolvedValue({ my: 'data' });

      const { result, waitForNextUpdate } = renderHook(() =>
        useReportData(fetchDataMock)
      );

      expect(result.current.status).toBe('DORMANT');

      act(() => {
        result.current.fetchData();
      });

      expect(result.current.status).toBe('PENDING');

      await waitForNextUpdate();

      expect(result.current.status).toBe('SUCCESS');
      expect(result.current.data.my).toBe('data');
    });

    it('fetches data with supplied parameters', async () => {
      const fetchDataMock = jest.fn().mockResolvedValue({ my: 'data' });

      const { result, waitForNextUpdate } = renderHook(() =>
        useReportData(fetchDataMock, { has: 'params' })
      );

      expect(result.current.status).toBe('DORMANT');

      act(() => {
        result.current.fetchData();
      });

      await waitForNextUpdate();

      expect(fetchDataMock).toHaveBeenCalledWith({ has: 'params' });
    });

    it('sets the status as an error status if the service throws an error', async () => {
      const fetchDataMock = jest.fn().mockRejectedValue({ my: 'error' });

      const { result, waitForNextUpdate } = renderHook(() =>
        useReportData(fetchDataMock, { has: 'params' })
      );

      expect(result.current.status).toBe('DORMANT');

      act(() => {
        result.current.fetchData();
      });

      await waitForNextUpdate();

      expect(result.current.status).toBe('ERROR');
      expect(result.current.data).toBe(null);
      expect(result.current.error.my).toBe('error');
    });
  });

  describe('[feature-flag] nba-show-longitudinal-ankle-export on', () => {
    beforeEach(() => {
      window.featureFlags['nba-show-longitudinal-ankle-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['nba-show-longitudinal-ankle-export'] = false;
    });

    it('displays the Longitudinal Ankle Prophylactic Form button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Longitudinal Ankle Prophylactic Form',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Longitudinal Ankle Prophylactic Form button when false', async () => {
      renderComponent({
        data: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: false,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Longitudinal Ankle Prophylactic Form',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nba-show-longitudinal-ankle-export off', () => {
    beforeEach(() => {
      window.featureFlags['nba-show-longitudinal-ankle-export'] = false;
    });

    it('does not display the Longitudinal Ankle Prophylactic Form button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Longitudinal Ankle Prophylactic Form',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nba-combined-ankle-export on', () => {
    beforeEach(() => {
      window.featureFlags['nba-combined-ankle-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['nba-combined-ankle-export'] = false;
    });

    it('displays the Ankle Form buttons', async () => {
      const { user } = renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      const download = screen.getByRole('button', {
        name: 'Download',
      });
      expect(download).toBeInTheDocument();
      await user.click(download);

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (AT)',
        })
      ).toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (EM)',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Ankle Form buttons when false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: false,
            },
          },
        },
      });

      await waitForLoading();

      const download = screen.queryByRole('button', {
        name: 'Download',
      });
      expect(download).not.toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (AT)',
        })
      ).not.toBeInTheDocument();
      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (EM)',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nba-combined-ankle-export off', () => {
    beforeEach(() => {
      window.featureFlags['nba-combined-ankle-export'] = false;
    });

    it('does not display the Ankle Form buttons', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      const download = screen.queryByRole('button', {
        name: 'Download',
      });
      expect(download).not.toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (AT)',
        })
      ).not.toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (EM)',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nfl-injury-detail-report-export on', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-detail-report-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-detail-report-export'] = false;
    });

    it('displays the Injury Detail Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await expect(
        screen.getByRole('button', {
          name: 'Injury Detail Report',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Injury Detail Report Button when canExport false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: false,
            },
          },
        },
      });

      await expect(
        screen.queryByRole('button', {
          name: 'Injury Detail Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nfl-injury-detail-report-export off', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-detail-report-export'] = false;
    });

    it('does not display the Injury Detail Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await expect(
        screen.queryByRole('button', {
          name: 'Injury Detail Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] time-loss-activities-report-export on', () => {
    beforeEach(() => {
      window.featureFlags['time-loss-activities-report-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['time-loss-activities-report-export'] = false;
    });

    it('displays the Time Loss All Activities Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      expect(
        screen.getByRole('button', {
          name: 'Time Loss (All Activities)',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Time Loss All Activities Report button when canExport false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: false,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Time Loss (All Activities)',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] time-loss-activities-report-export off', () => {
    beforeEach(() => {
      window.featureFlags['time-loss-activities-report-export'] = false;
    });

    it('does not display the report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      expect(
        screen.queryByRole('button', {
          name: 'Time Loss (All Activities)',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] time-loss-body-area-report on', () => {
    beforeEach(() => {
      window.featureFlags['time-loss-body-area-report'] = true;
    });

    afterEach(() => {
      window.featureFlags['time-loss-body-area-report'] = false;
    });

    it('displays the Time Loss Body Part Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      expect(
        screen.getByRole('button', {
          name: 'Time Loss (Body Part)',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Time Loss Body Part Report button when canExport false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: false,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Time Loss (Body Part)',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] time-loss-body-area-report off', () => {
    beforeEach(() => {
      window.featureFlags['time-loss-body-area-report'] = false;
    });

    it('does not display the report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      expect(
        screen.queryByRole('button', {
          name: 'Time Loss (Body Part)',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[preference] osha_300_report on', () => {
    beforeEach(() => {
      useGetPreferencesQuery.mockReturnValue({
        data: {
          osha_300_report: true,
        },
      });
    });

    it('displays the OSHA 300 Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'OSHA 300 Report',
        })
      ).toBeInTheDocument();
    });

    it('does not display the OSHA 300 Report button when canExport false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: false,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'OSHA 300 Report',
        })
      ).not.toBeInTheDocument();
    });

    it('calls trackEvent when button is clicked', async () => {
      const { user } = renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      const button = screen.queryByRole('button', {
        name: 'OSHA 300 Report',
      });

      expect(button).toBeInTheDocument();

      await user.click(button);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        'Click Download -> OSHA 300 Report',
        { level: 'team', tab: tabHashes.OVERVIEW }
      );
    });
  });

  describe('[preference] osha_300_report off', () => {
    beforeEach(() => {
      useGetPreferencesQuery.mockReturnValue({
        data: {
          osha_300_report: false,
        },
      });
    });

    it('does not display the report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'OSHA 300 Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nfl-injury-medication-report-export on', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-medication-report-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-medication-report-export'] = false;
    });

    it('displays the Injury Medications report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Appendix BB Report',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Injury Medications report button when canView Medications permission false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: false,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Appendix BB Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] nfl-injury-medication-report-export off', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-medication-report-export'] = false;
    });

    it('does not display the Injury Medications report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Appendix BB Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] medications-report-export on', () => {
    beforeEach(() => {
      window.featureFlags['medications-report-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['medications-report-export'] = false;
    });

    it('displays the Medication Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Medication Report',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Medication Report button when permissions.medications.canView = false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: false,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Medication Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] medications-report-export off', () => {
    beforeEach(() => {
      window.featureFlags['medications-report-export'] = false;
    });

    it('does not display the Injury Report button', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            medications: {
              ...defaultMedicalPermissions.medications,
              canView: true,
            },
            issues: {
              ...defaultMedicalPermissions.issues,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      await expect(
        screen.queryByRole('button', {
          name: 'Medication Report',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[permission] permissions.medical.forms.canExport', () => {
    beforeEach(() => {
      window.featureFlags['nba-show-longitudinal-ankle-export'] = true;
      window.featureFlags['nba-combined-ankle-export'] = true;
    });

    afterEach(() => {
      window.featureFlags['nba-show-longitudinal-ankle-export'] = false;
      window.featureFlags['nba-combined-ankle-export'] = false;
    });

    it('has the Ankle Form buttons true', async () => {
      const { user } = renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: true,
            },
          },
        },
      });

      await waitForLoading();

      const download = screen.getByRole('button', {
        name: 'Download',
      });
      expect(download).toBeInTheDocument();
      await user.click(download);

      await expect(
        screen.queryByRole('button', {
          name: 'Longitudinal Ankle Prophylactic Form',
        })
      ).toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (AT)',
        })
      ).toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (EM)',
        })
      ).toBeInTheDocument();
    });

    it('does not display the Ankle Forms buttons when false', async () => {
      renderComponent({
        permissions: {
          medical: {
            ...defaultMedicalPermissions,
            forms: {
              ...defaultMedicalPermissions.forms,
              canExport: false,
            },
          },
        },
      });

      await waitForLoading();

      const download = screen.queryByRole('button', {
        name: 'Download',
      });
      expect(download).not.toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Longitudinal Ankle Prophylactic Form',
        })
      ).not.toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (AT)',
        })
      ).not.toBeInTheDocument();

      await expect(
        screen.queryByRole('button', {
          name: 'Prophylactic Ankle Support (EM)',
        })
      ).not.toBeInTheDocument();
    });
  });
});
