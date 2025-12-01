import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import FormAttachmentsSection from '@kitman/modules/src/Medical/forms/src/components/FormAttachmentsSection/index';
import formAttachmentsMock from '@kitman/modules/src/Medical/forms/src/mocks/formAttachmentsMock';

describe('<FormAttachmentsSection />', () => {
  const props = {
    attachments: formAttachmentsMock,
    t: i18nextTranslateStub(),
  };

  it('renders expected number of attachment links', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FormAttachmentsSection {...props} />
      </I18nextProvider>
    );
    expect(screen.getByRole('link', { name: 'MyImage1.jpg' })).toHaveAttribute(
      'href',
      'test'
    );

    expect(
      screen.getByRole('link', { name: 'MyOtherImage.jpg' })
    ).toHaveAttribute('href', 'test2');
  });
});
