import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { MassUploadModalTranslated as MassUploadModal } from '@kitman/modules/src/shared/MassUpload/components/MassUploadModal';
import Toasts from '@kitman/modules/src/Toasts';
import MassUpload from '..';

const i18nT = i18nextTranslateStub();

const actualUseParseCSV = jest.requireActual(
  '@kitman/modules/src/shared/MassUpload/hooks/useParseCSV'
);

const props = {
  userType: 'athlete',
  t: i18nT,
};

const processCSV = async (api1, api2) => {
  try {
    const response1 = await api1();
    if (!response1) {
      return false;
    }
    const response2 = await api2();
    if (!response2) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

describe('<MassUpload />', () => {
  const assertions = [
    { userType: 'user', expected: 'Upload Users' },
    { userType: 'official', expected: 'Upload Officials' },
    { userType: 'scout', expected: 'Upload Scouts' },
    { userType: 'athlete', expected: 'Upload Athletes' },
    { userType: 'match_monitor', expected: 'Upload Match Monitors' },
  ];
  describe('[PROP] userType', () => {
    assertions.forEach((assertion) => {
      it(`renders the correct button content for ${assertion.userType}`, async () => {
        renderWithProviders(
          <MassUpload {...props} userType={assertion.userType} />
        );
        const buttons = await screen.findAllByRole('button');
        expect(buttons[0]).toBeInTheDocument();
        expect(buttons[0]).toHaveTextContent(assertion.expected);
      });
    });
  });
  describe('[FEATURE-FLAG] league-ops-mass-create-pre-validate is true', () => {
    describe('when its true', () => {
      beforeEach(() => {
        window.featureFlags = {
          'league-ops-mass-create-pre-validate': true,
        };
      });

      assertions.forEach((assertion) => {
        it(`renders the correct modal title for ${assertion.userType}`, async () => {
          renderWithProviders(
            <MassUpload {...props} userType={assertion.userType} />
          );
          const buttons = await screen.findAllByRole('button');
          expect(buttons[0]).toBeInTheDocument();
          expect(buttons[0]).toHaveTextContent(assertion.expected);
          await userEvent.click(buttons[0]);

          expect(screen.getByTestId('Modal|Title')).toHaveTextContent(
            assertion.expected
          );
        });
      });
    });
    describe('when its false', () => {
      beforeEach(() => {
        window.featureFlags = {
          'league-ops-mass-create-pre-validate': false,
        };
      });

      assertions.forEach((assertion) => {
        it(`renders the correct button content for ${assertion.userType}`, async () => {
          renderWithProviders(
            <MassUpload {...props} userType={assertion.userType} />
          );
          const buttons = await screen.findAllByRole('button');
          expect(buttons[0]).toBeInTheDocument();
          expect(buttons[0]).toHaveTextContent(assertion.expected);
        });
      });
    });
  });
  describe('[FEATURE-FLAG] league-ops-mass-import', () => {
    const localState = {
      massUploadSlice: {
        massUploadModal: {
          isOpen: true,
        },
      },
    };
    const modalProps = {
      title: 'Mass Upload title',
      buttonText: 'Trigger button',
      useGrid: () => ({
        grid: {
          rows: [],
          columns: [],
          emptyTableText: '',
          id: 0,
        },
        ruleset: {},
        isLoading: false,
        isError: false,
      }),
      onProcessCSV: jest.fn(),
      expectedHeaders: [],
      t: i18nT,
    };
    describe('when its true', () => {
      let saveAttachmentApi;
      let massUploadApi;

      beforeEach(() => {
        window.featureFlags = {
          'league-ops-mass-import': true,
        };
        saveAttachmentApi = jest.fn();
        massUploadApi = jest.fn();
      });

      describe('Saving the attachment fails', () => {
        it('shows a toast', async () => {
          const user = userEvent.setup();

          saveAttachmentApi.mockResolvedValue(null);

          const localProps = {
            ...modalProps,
            onProcessCSV: async () => {
              const response = await processCSV(
                saveAttachmentApi,
                massUploadApi
              );
              return response;
            },
          };

          jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
            onRemoveCSV: () => {},
            onHandleParseCSV: () => {},
            queueState: {},
            parseResult: {},
            setParseState: () => {},
            parseState: 'COMPLETE',
            isDisabled: false,
          }));

          renderWithProviders(
            <>
              <MassUpload {...props} />
              <MassUploadModal {...localProps} />
              <Toasts />
            </>,
            {
              preloadedState: localState,
            }
          );

          await user.click(
            screen.getByRole('tab', { name: 'Upload', hidden: true })
          );

          const uploadBtn = screen.getByRole('button', {
            name: 'Upload',
            hidden: true,
          });

          expect(uploadBtn).toBeEnabled();

          await user.click(uploadBtn);

          await waitFor(() => {
            expect(screen.getByTestId('Toast')).toHaveTextContent(
              'Import failed'
            );
          });
        });
      });
      describe('Saving the attachment succeeds + mass upload fails', () => {
        it('shows a toast', async () => {
          const user = userEvent.setup();

          saveAttachmentApi.mockResolvedValue({ id: '123' });
          massUploadApi.mockResolvedValue(null);

          const localProps = {
            ...modalProps,
            onProcessCSV: async () => {
              const response = await processCSV(
                saveAttachmentApi,
                massUploadApi
              );
              return response;
            },
          };

          jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
            onRemoveCSV: () => {},
            onHandleParseCSV: () => {},
            queueState: {},
            parseResult: {},
            setParseState: () => {},
            parseState: 'COMPLETE',
            isDisabled: false,
          }));

          renderWithProviders(
            <>
              <MassUpload {...props} />
              <MassUploadModal {...localProps} />
              <Toasts />
            </>,
            {
              preloadedState: localState,
            }
          );

          await user.click(
            screen.getByRole('tab', { name: 'Upload', hidden: true })
          );

          const uploadBtn = screen.getByRole('button', {
            name: 'Upload',
            hidden: true,
          });

          expect(uploadBtn).toBeEnabled();

          await user.click(uploadBtn);

          await waitFor(() => {
            expect(screen.getByTestId('Toast')).toHaveTextContent(
              'Import failed'
            );
          });
        });
      });
      describe('Saving the attachment succeeds + mass upload succeeds', () => {
        it('shows a toast', async () => {
          const user = userEvent.setup();

          saveAttachmentApi.mockResolvedValue({ id: '123' });
          massUploadApi.mockResolvedValue(true);

          const localProps = {
            ...modalProps,
            onProcessCSV: async () => {
              const response = await processCSV(
                saveAttachmentApi,
                massUploadApi
              );
              return response;
            },
          };

          jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
            onRemoveCSV: () => {},
            onHandleParseCSV: () => {},
            queueState: {},
            parseResult: {},
            setParseState: () => {},
            parseState: 'COMPLETE',
            isDisabled: false,
          }));

          renderWithProviders(
            <>
              <MassUpload {...props} />
              <MassUploadModal {...localProps} />
              <Toasts />
            </>,
            {
              preloadedState: localState,
            }
          );

          await user.click(
            screen.getByRole('tab', { name: 'Upload', hidden: true })
          );

          const uploadBtn = screen.getByRole('button', {
            name: 'Upload',
            hidden: true,
          });

          expect(uploadBtn).toBeEnabled();

          await user.click(uploadBtn);

          await waitFor(() => {
            expect(screen.getByTestId('Toast')).toHaveTextContent(
              'Import successful'
            );
          });
        });
      });
    });
    describe('when its false', () => {
      beforeEach(() => {
        window.featureFlags = {
          'league-ops-mass-import': false,
        };
      });

      describe('CSV fails to upload', () => {
        it('does not show toast', async () => {
          const user = userEvent.setup();

          jest.spyOn(actualUseParseCSV, 'default').mockImplementation(() => ({
            onRemoveCSV: () => {},
            onHandleParseCSV: () => {},
            queueState: {},
            parseResult: {},
            setParseState: () => {},
            parseState: 'COMPLETE',
            isDisabled: false,
          }));

          renderWithProviders(
            <>
              <MassUpload {...props} />
              <MassUploadModal {...modalProps} />
              <Toasts />
            </>,
            {
              preloadedState: localState,
            }
          );

          await user.click(
            screen.getByRole('tab', { name: 'Upload', hidden: true })
          );

          const uploadBtn = screen.getByRole('button', {
            name: 'Upload',
            hidden: true,
          });

          expect(uploadBtn).toBeEnabled();

          await user.click(uploadBtn);

          expect(screen.queryByTestId('Toast')).not.toBeInTheDocument();
        });
      });
    });
  });
});
