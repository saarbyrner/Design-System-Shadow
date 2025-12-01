/* eslint-disable jest/no-conditional-expect */
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  IMPORT_TYPES,
  IMPORT_TYPES_WITH_TEMPLATE,
  IMPORT_TYPES_WITH_EDITABLE_FEATURES,
} from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import {
  mockValidRows,
  mockInvalidRows,
  mockRows,
  mockColumns,
} from '@kitman/modules/src/shared/MassUpload/New/utils/test_utils';
import { mockFilePondFiles } from '@kitman/common/src/hooks/mocks/mocksForUploads.mock';
import { PARSE_STATE } from '@kitman/modules/src/shared/MassUpload/utils/consts';
import { data as mockIntegrationData } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/getIntegrationData';

import Uploader from '../index';

jest.mock('@kitman/modules/src/shared/MassUpload/services/massUpload');

const actualUseParseCSV = jest.requireActual(
  '@kitman/modules/src/shared/MassUpload/hooks/useParseCSV'
);

describe('<Uploader />', () => {
  const i18nT = i18nextTranslateStub();

  const mockProps = {
    useGrid: () => ({
      grid: {
        rows: [],
        columns: [],
        emptyTableText: '',
        id: 0,
      },
      ruleset: null,
      isLoading: false,
      isError: false,
    }),
    expectedHeaders: [],
    optionalExpectedHeaders: [],
    importType: IMPORT_TYPES.LeagueBenchmarking,
    activeStep: 0,
    setActiveStep: jest.fn(),
    setHasErrors: jest.fn(),
    uploadSteps: [
      { title: 'Upload file', caption: 'Must be a .CSV' },
      { title: 'Preview import', caption: 'Check for errors' },
    ],
    selectedIntegration: { id: 'null', name: 'null' },
    setSelectedIntegration: jest.fn(),
    selectedVendor: null,
    setSelectedVendor: jest.fn(),
    integrationData: null,
    hasErrors: false,
    eventTime: '2025-10-16',
    eventType: 'Session',
    integrationEvents: null,
    selectedApiImport: null,
    setSelectedApiImport: jest.fn(),
    setHasPartialErrors: jest.fn(),
    setAttachedFile: jest.fn(),
    toastDispatch: jest.fn(),
    toasts: [],
    t: i18nT,
  };

  const mockIntegrations = [
    {
      source_identifier: 'statsports',
      name: 'Statsport',
    },
    {
      source_identifier: 'polar',
      name: 'Polar',
    },
    {
      source_identifier: 'oura',
      name: 'Oura Ring',
    },
  ];

  const mockRuleSet = (
    <div>
      <h1>Title</h1>
      <p>Body</p>
    </div>
  );

  const renderComponent = (overrideProps) => ({
    ...renderWithRedux(<Uploader {...{ ...mockProps, ...overrideProps }} />),
    user: userEvent.setup(),
  });

  describe('Instructions drawer', () => {
    it('renders the instructions', async () => {
      renderComponent({
        useGrid: () => ({
          grid: {
            rows: [],
            columns: [],
            emptyTableText: '',
            id: 0,
          },
          ruleset: mockRuleSet,
          isLoading: false,
          isError: false,
        }),
      });

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
    });
  });

  describe('parseState === DORMANT', () => {
    it('should render file pond without file dock when no attachment', () => {
      const { container } = renderComponent();

      expect(
        container.getElementsByClassName('filepond--wrapper')[0]
      ).toBeInTheDocument();
      expect(screen.queryByText('foobar.pdf - 6 B')).not.toBeInTheDocument();
    });

    it('should render file pond with file dock when attachment exists', () => {
      jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
        onRemoveCSV: () => {},
        onHandleParseCSV: () => {},
        queueState: { attachment: mockFilePondFiles[0] },
        parseResult: {},
        setParseState: () => {},
        parseState: PARSE_STATE.Dormant,
        isDisabled: false,
      }));
      const { container } = renderComponent();

      expect(
        container.getElementsByClassName('filepond--wrapper')[0]
      ).toBeInTheDocument();
      expect(screen.queryByText('foobar.pdf - 6 B')).toBeInTheDocument();
    });

    describe('Integration selection', () => {
      it('should not render integration selection when importType is not event_data', () => {
        renderComponent({ importType: IMPORT_TYPES.GrowthAndMaturation });

        expect(
          screen.queryByRole('button', { name: 'CSV file' })
        ).not.toBeInTheDocument();
      });

      it(
        'should render CSV file button when importType is event_data, activeStep is 0 and' +
          'there is no integrations passed',
        () => {
          renderComponent({ importType: IMPORT_TYPES.EventData });

          expect(
            screen.getByRole('button', { name: 'CSV file' })
          ).toBeInTheDocument();
        }
      );

      it(
        'should render integration buttons when importType is event_data, activeStep is 0 and' +
          'there are integrations passed',
        () => {
          renderComponent({
            importType: IMPORT_TYPES.EventData,
            integrationData: {
              integrations: mockIntegrations,
            },
          });

          expect(
            screen.getByRole('button', { name: 'CSV file' })
          ).toBeInTheDocument();
          mockIntegrations.forEach((integration) => {
            expect(
              screen.getByRole('button', { name: `${integration.name} logo` })
            ).toBeInTheDocument();
          });
        }
      );
    });

    describe('Integration imports table', () => {
      it('should render when importType is EventData, active step is 1 and selectedIntegration is not CSV', () => {
        renderComponent({
          importType: IMPORT_TYPES.EventData,
          integrationData: {
            integrations: mockIntegrations,
          },
          activeStep: 1,
          selectedIntegration: { id: 'statsports', name: 'Statsport' },
          integrationEvents: mockIntegrationData.events,
        });

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Date' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Statsport name' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Duration' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Session time' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Participants' })
        ).toBeInTheDocument();
      });

      it('should not render when importType is EventData, active step is 1 and selectedIntegration is CSV', () => {
        renderComponent({
          importType: IMPORT_TYPES.EventData,
          integrationData: {
            integrations: mockIntegrations,
          },
          activeStep: 1,
          selectedIntegration: { id: 'csv', name: 'CSV' },
          integrationEvents: mockIntegrationData.events,
        });

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });

      it('should not render when importType is not EventData', () => {
        renderComponent({
          importType: IMPORT_TYPES.GrowthAndMaturation,
          integrationData: {
            integrations: mockIntegrations,
          },
          activeStep: 1,
          selectedIntegration: { id: 'statsports', name: 'Statsport' },
          integrationEvents: mockIntegrationData.events,
        });

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });
    });

    describe('Integration import detail table', () => {
      it('should render when importType is EventData, active step is 2 and there is a selected import', () => {
        renderComponent({
          importType: IMPORT_TYPES.EventData,
          integrationData: {
            integrations: mockIntegrations,
          },
          activeStep: 2,
          selectedIntegration: { id: 'statsports', name: 'Statsport' },
          integrationEvents: mockIntegrationData.events,
          selectedApiImport: '2025-09-29',
        });

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Import name' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Time' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('columnheader', { name: 'Included athletes' })
        ).toBeInTheDocument();
      });

      it('should not render if there is no selected import', () => {
        renderComponent({
          importType: IMPORT_TYPES.EventData,
          integrationData: {
            integrations: mockIntegrations,
          },
          activeStep: 2,
          selectedIntegration: { id: 'statsports', name: 'Statsport' },
          integrationEvents: mockIntegrationData.events,
          selectedApiImport: null,
        });

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });

      it('should not render if importType is not EventData', () => {
        renderComponent({
          importType: IMPORT_TYPES.GrowthAndMaturation,
          integrationData: {
            integrations: mockIntegrations,
          },
          activeStep: 2,
          selectedIntegration: { id: 'statsports', name: 'Statsport' },
          integrationEvents: mockIntegrationData.events,
          selectedApiImport: null,
        });

        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });
    });
  });

  describe('parseState === PROCESSING', () => {
    it('should render <CircularProgress />', () => {
      jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
        onRemoveCSV: () => {},
        onHandleParseCSV: () => {},
        queueState: { attachment: mockFilePondFiles[0] },
        parseResult: {},
        setParseState: () => {},
        parseState: PARSE_STATE.Processing,
        isDisabled: false,
      }));
      const { container } = renderComponent();

      expect(
        container.getElementsByClassName('MuiCircularProgress-svg')[0]
      ).toBeInTheDocument();
    });
  });

  describe('parseState === ERROR', () => {
    beforeEach(() => {
      jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
        onRemoveCSV: () => {},
        onHandleParseCSV: () => {},
        queueState: { attachment: mockFilePondFiles[0] },
        parseResult: {},
        setParseState: () => {},
        parseState: PARSE_STATE.Error,
        isDisabled: false,
      }));
    });

    it('should render <ErrorState />', () => {
      renderComponent();

      expect(
        screen.getByText('There is an error in your provided CSV file')
      ).toBeInTheDocument();
    });

    it('should fail gracefully and show error message if optionalExpectedFields is undefined', () => {
      renderComponent({
        expectedHeaders: ['E'],
        optionalExpectedHeaders: undefined,
      });

      expect(screen.getByText('Missing column(s): E')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try again' })
      ).toBeInTheDocument();
    });

    [...IMPORT_TYPES_WITH_TEMPLATE, 'import_type_without_template'].forEach(
      (importType) => {
        it('should render Download a CSV file template if import type has template', () => {
          renderComponent({ importType });

          if (importType === 'import_type_without_template') {
            expect(
              screen.queryByText('Download a CSV file template for')
            ).not.toBeInTheDocument();
          } else {
            expect(
              screen.getByText('Download a CSV file template for')
            ).toBeInTheDocument();
          }
        });
      }
    );

    it('calls `setHasErrors` with `false` if `activeStep` is `0`', () => {
      renderComponent({ activeStep: 0 });

      expect(mockProps.setHasErrors).toHaveBeenCalledWith(false);
    });

    it('calls `setHasErrors` with `true` if `activeStep` is `1`', () => {
      renderComponent({ activeStep: 1 });

      expect(mockProps.setHasErrors).toHaveBeenCalledWith(true);
    });
  });

  describe('parseState === COMPLETE', () => {
    beforeEach(() => {
      jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
        onRemoveCSV: () => {},
        onHandleParseCSV: () => {},
        queueState: { attachment: mockFilePondFiles[0] },
        parseResult: {},
        setParseState: () => {},
        parseState: PARSE_STATE.Complete,
        isDisabled: false,
      }));
    });

    const mockUseGridWithMixedData = {
      useGrid: () => ({
        grid: {
          rows: mockRows,
          columns: mockColumns,
          emptyTableText: '',
          id: 0,
        },
        ruleset: mockRuleSet,
        isLoading: false,
        isError: false,
      }),
    };

    describe('Grid data', () => {
      it('should show correct values in toggle buttons', () => {
        renderComponent(mockUseGridWithMixedData);

        expect(
          screen.getByText(`All (${mockRows.length})`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`Valid (${mockValidRows.length})`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`Invalid (${mockInvalidRows.length})`)
        ).toBeInTheDocument();
      });

      it('should render correct amount of rows when filtered by All', () => {
        renderComponent(mockUseGridWithMixedData);
        expect(screen.getAllByRole('row')).toHaveLength(mockRows.length + 1); // Row length + header row
      });

      it('should render correct amount of rows when filtered by Valid', async () => {
        const { user } = renderComponent(mockUseGridWithMixedData);

        await user.click(
          screen.getByRole('button', {
            name: `Valid (${mockValidRows.length})`,
          })
        );

        expect(screen.getAllByRole('row')).toHaveLength(
          mockValidRows.length + 1 // Row length + header row
        );
      });

      it('should render correct amount of rows when filtered by Invalid', async () => {
        const { user } = renderComponent(mockUseGridWithMixedData);

        await user.click(
          screen.getByRole('button', {
            name: `Invalid (${mockInvalidRows.length})`,
          })
        );

        expect(screen.getAllByRole('row')).toHaveLength(
          mockInvalidRows.length + 1 // Row length + header row
        );
      });
    });

    it('calls `setHasErrors` with `false`', () => {
      renderComponent();

      expect(mockProps.setHasErrors).toHaveBeenCalledWith(false);
    });

    describe('Editable features', () => {
      describe('Cell editing', () => {
        it('should allow editing of cells for IMPORT_TYPES with edit enabled when the FF is true', async () => {
          window.setFlag('pac-mass-upload-editing-features', true);

          const { user } = renderComponent({
            ...mockUseGridWithMixedData,
            importType: IMPORT_TYPES_WITH_EDITABLE_FEATURES[0],
          });

          await user.dblClick(screen.getByRole('gridcell', { name: 'John' }));
          expect(screen.getByRole('textbox')).toBeInTheDocument();

          fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'Some other name' },
          });
          fireEvent.keyDown(screen.getByRole('textbox'), {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
          });

          expect(
            await screen.findByText('Some other name')
          ).toBeInTheDocument();
        });

        it(
          'should not allow editing of cells for IMPORT_TYPES with edit disabled and' +
            'the FF is false',
          async () => {
            window.setFlag('pac-mass-upload-editing-features', false);

            const { user } = renderComponent({
              ...mockUseGridWithMixedData,
              importType: IMPORT_TYPES.GrowthAndMaturation,
            });

            await user.dblClick(screen.getByRole('gridcell', { name: 'John' }));
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
          }
        );
      });

      describe('Row deletion', () => {
        it('should allow deletion of rows for IMPORT_TYPES with delete enabled', async () => {
          window.setFlag('pac-mass-upload-editing-features', true);

          const { user } = renderComponent({
            ...mockUseGridWithMixedData,
            importType: IMPORT_TYPES_WITH_EDITABLE_FEATURES[0],
          });

          const firstRowCheckbox = screen.getAllByRole('checkbox')[1];
          await user.click(firstRowCheckbox);

          expect(screen.getByText('1 item selected')).toBeInTheDocument();
          expect(
            screen.getByRole('button', { name: 'Delete' })
          ).toBeInTheDocument();
        });

        it('should not allow deletion of rows for IMPORT_TYPES with delete disabled', async () => {
          window.setFlag('pac-mass-upload-editing-features', false);

          renderComponent({
            ...mockUseGridWithMixedData,
            importType: IMPORT_TYPES.LeagueBenchmarking,
          });

          expect(screen.queryAllByRole('checkbox')[1]).toBeUndefined();
        });
      });
    });
  });
});
