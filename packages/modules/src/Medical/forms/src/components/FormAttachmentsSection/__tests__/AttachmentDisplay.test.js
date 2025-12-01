import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment-timezone';
import AttachmentDisplay from '../AttachmentDisplay';
import formAttachmentsMock from '../../../mocks/formAttachmentsMock';

describe('<AttachmentDisplay />', () => {
  let locale;
  beforeEach(() => {
    locale = moment.locale();
    moment.locale('en');
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.locale(locale);
    moment.tz.setDefault();
  });

  const props = {
    attachment: formAttachmentsMock[0],
    t: i18nextTranslateStub(),
  };

  it('renders expected fields', () => {
    render(<AttachmentDisplay {...props} />);

    expect(screen.getByRole('link', { name: 'MyImage1.jpg' })).toHaveAttribute(
      'href',
      'test'
    );

    expect(screen.getByText('David Kelly')).toBeInTheDocument();
    expect(screen.getByText('Aug 25, 2022')).toBeInTheDocument();
  });
});
