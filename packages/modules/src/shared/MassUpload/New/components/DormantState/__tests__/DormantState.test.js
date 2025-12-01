import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { mockFilePondFiles } from '@kitman/common/src/hooks/mocks/mocksForUploads.mock';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import DormantState from '../index';

describe('<DormantState/>', () => {
  const mockProps = {
    queueState: { attachment: null },
    onAttachFile: jest.fn(),
    setAttachedFile: jest.fn(),
    onRemoveFile: jest.fn(),
    vendorOptions: [],
    setSelectedVendor: jest.fn(),
    selectedVendor: null,
    selectedIntegration: { id: null, name: null },
    importType: IMPORT_TYPES.LeagueBenchmarking,
  };

  it('should render file pond without file dock', () => {
    const { container } = renderWithRedux(<DormantState {...mockProps} />);

    expect(
      container.getElementsByClassName('filepond--wrapper')[0]
    ).toBeInTheDocument();
    expect(screen.queryByText('foobar.pdf - 6 B')).not.toBeInTheDocument();
  });

  it('should render file dock when there is an attachment', () => {
    renderWithRedux(
      <DormantState
        {...mockProps}
        queueState={{ attachment: mockFilePondFiles[0] }}
      />
    );

    expect(screen.getByText('foobar.pdf - 6 B')).toBeInTheDocument();
  });

  it('should call onRemoveFile on click of bin icon', async () => {
    const user = userEvent.setup();

    renderWithRedux(
      <DormantState
        {...mockProps}
        queueState={{ attachment: mockFilePondFiles[0] }}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(mockProps.onRemoveFile).toHaveBeenCalled();
  });

  it('should render vendor select when selectedIntegration is CSV', () => {
    renderWithRedux(
      <DormantState
        {...mockProps}
        queueState={{ attachment: mockFilePondFiles[0] }}
        selectedIntegration={{ name: 'CSV', id: 'csv' }}
      />
    );
    expect(screen.getByLabelText('Select vendor')).toBeInTheDocument();
  });

  it('should render vendor select options in alphabetical order', async () => {
    renderWithRedux(
      <DormantState
        {...mockProps}
        queueState={{ attachment: mockFilePondFiles[0] }}
        selectedIntegration={{ name: 'CSV', id: 'csv' }}
        vendorOptions={[
          { id: '3', label: 'Kitman custom' },
          { id: '1', label: 'Statsports' },
          { id: '2', label: 'Catapult' },
        ]}
      />
    );

    const selectLabel = screen.getByLabelText('Select vendor');
    await selectEvent.openMenu(selectLabel);

    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Catapult');
    expect(screen.getAllByRole('option')[1]).toHaveTextContent('Kitman custom');
    expect(screen.getAllByRole('option')[2]).toHaveTextContent('Statsports');
  });

  it('should not render vendor select when selectedIntegration is not CSV', () => {
    renderWithRedux(
      <DormantState
        {...mockProps}
        queueState={{ attachment: mockFilePondFiles[0] }}
        selectedIntegration={{ name: 'Statsport', id: 'statsport' }}
      />
    );
    expect(screen.queryByLabelText('Select vendor')).not.toBeInTheDocument();
  });
});
