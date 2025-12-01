import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import attachments from '@kitman/modules/src/Medical/forms/src/mocks/formAttachmentsMock';
import InlineAttachmentDisplay from '../InlineAttachmentDisplay';

describe('<InlineAttachmentDisplay />', () => {
  it('renders a signature attachment', () => {
    const signatureAttachment = {
      type: 'attachment',
      attachment: attachments[0],
      id: 'some attachment',
      displayType: 'signature',
      title: 'Examiner signature:',
      signatureName: 'David Kelly',
    };

    render(<InlineAttachmentDisplay inlineAttachment={signatureAttachment} />);

    const root = screen.getByTestId('InlineAttachmentDisplay');
    expect(root).toBeInTheDocument();

    const name = screen.getByTestId('InlineAttachmentDisplay');
    expect(name).toHaveTextContent('David Kelly');

    const title = screen.getByTestId('InlineAttachmentDisplay');
    expect(title).toHaveTextContent('Examiner signature:');

    const image = screen.queryByRole('img');
    expect(image).toHaveAttribute('src', 'test');
  });

  it('renders an image attachment', () => {
    const imageAttachment = {
      type: 'attachment',
      attachment: attachments[1],
      id: 'some attachment',
      displayType: 'image',
      title: 'My nice image',
    };

    render(<InlineAttachmentDisplay inlineAttachment={imageAttachment} />);

    const root = screen.getByTestId('InlineAttachmentDisplay');
    expect(root).toBeInTheDocument();

    const title = screen.getByTestId('InlineAttachmentDisplay|title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('My nice image');

    const image = screen.getByTestId('InlineAttachmentDisplay|image');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test2');

    expect(screen.getByRole('img')).toHaveAttribute('src', 'test2');
  });

  it('renders a file attachment', () => {
    const fileAttachment = {
      type: 'attachment',
      attachment: attachments[1],
      id: 'some attachment',
      displayType: 'file',
      title: 'Some file',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <InlineAttachmentDisplay inlineAttachment={fileAttachment} />
      </I18nextProvider>
    );

    const attachmentDisplay = screen.getByTestId(
      'AttachmentDisplay|AttachmentItem'
    );
    expect(attachmentDisplay).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'MyOtherImage.jpg' })
    ).toHaveAttribute('href', 'test2');
  });
});
