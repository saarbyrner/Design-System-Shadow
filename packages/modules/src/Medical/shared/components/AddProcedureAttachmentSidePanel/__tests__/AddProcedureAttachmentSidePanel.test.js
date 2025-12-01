import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AddProcedureAttachmentSidePanel from '..';

const props = {
  procedureId: 99,
  athleteId: 1029,
  onClose: jest.fn(),
  onFileUploadStart: jest.fn(),
  onFileUploadSuccess: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('<AddProcedureAttachmentSidePanel />', () => {
  it('renders the default form', () => {
    const { container } = render(
      <AddProcedureAttachmentSidePanel {...props} />
    );

    expect(
      screen.getByTestId('AddProcedureAttachmentSidePanel')
    ).toBeInTheDocument();

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);

    const closeIcon = buttons[0];
    expect(closeIcon).toBeInTheDocument();

    const saveAttachmentButton = buttons[1];

    expect(saveAttachmentButton).toHaveTextContent('Save');
    expect(saveAttachmentButton).toBeDisabled();
  });
});
