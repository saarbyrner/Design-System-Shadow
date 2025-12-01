import { renderHook } from '@testing-library/react-hooks';
import { TestProviders } from '@kitman/common/src/utils/test_utils';
import useImports from '../useImports';

describe('useImports', () => {
  it('returns initial data', async () => {
    const {
      result: { current },
    } = renderHook(() => useImports(), {
      wrapper: ({ children }) => (
        <TestProviders
          store={{
            toasts: [
              {
                description: 'You can find the download link here:',
                id: 1,
                links: [{ id: 1, link: '/settings/imports', text: 'Imports' }],
                status: 'INFO',
                title: 'Import in progress',
              },
            ],
            closeToast: jest.fn(),
            importReports: jest.fn(),
          }}
        >
          {children}
        </TestProviders>
      ),
    });

    expect(current).toHaveProperty('closeToast');
    expect(current).toHaveProperty('importReports');
    expect(current).toHaveProperty('isToastDisplayed');
    expect(current).toHaveProperty('requestStatus');
    expect(current).toHaveProperty('toasts');
  });
});
