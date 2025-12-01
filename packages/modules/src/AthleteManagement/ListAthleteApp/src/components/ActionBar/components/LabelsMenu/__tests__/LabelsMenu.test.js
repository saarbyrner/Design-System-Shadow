import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LabelsMenu from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/components/LabelsMenu';

describe('LabelsMenu', () => {
  const t = i18nextTranslateStub();
  const labelsOptions = [
    {
      value: 1,
      label: 'Test label',
      color: '#729bc3',
    },
    {
      value: 2,
      label: 'NBA',
      color: '#e97f16',
    },
    {
      value: 3,
      label: 'NFL',
      color: '#5ec55e',
    },
  ];

  const defaultProps = {
    t,
    anchorEl: true,
    areLabelsDataFetching: false,
    isBulkUpdateAthleteLabelsLoading: false,
    labelsOptions,
    selectedLabelIds: [1, 2, 3],
    onSaveClick: jest.fn(),
    onCloseMenu: jest.fn(),
    handleLabelChange: jest.fn(),
  };

  const renderComponent = (props = defaultProps) => {
    render(<LabelsMenu {...props} />);
  };

  it('should render properly', () => {
    renderComponent();

    expect(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /save/i,
      })
    ).toBeInTheDocument();

    labelsOptions.forEach((labelOption) => {
      expect(screen.getByText(labelOption.label)).toBeInTheDocument();
    });
  });

  it('should trigger the action callbacks', async () => {
    const user = userEvent.setup();
    renderComponent();

    const saveButton = screen.getByRole('button', {
      name: /save/i,
    });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(defaultProps.onSaveClick).toHaveBeenCalled();
    expect(defaultProps.onCloseMenu).toHaveBeenCalledTimes(1);
    expect(defaultProps.handleLabelChange).toHaveBeenCalledTimes(1);

    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(cancelButton).toBeEnabled();

    await user.click(cancelButton);

    expect(defaultProps.onCloseMenu).toHaveBeenCalledTimes(2);
    expect(defaultProps.handleLabelChange).toHaveBeenCalledTimes(2);
  });
});
