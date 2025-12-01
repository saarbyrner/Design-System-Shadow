import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Note from '../Note';

describe('<Note/>', () => {
  const props = {
    note: {
      annotation_date: '2021-04-03T08:21:06+01:00',
      annotationable_id: 123,
      annotationable_type: 'Athlete',
      organisation_annotation_type: {
        type: 'OrganisationAnnotationTypes::Modification',
        name: 'Medical note',
      },
      attachments_attributes: [
        {
          fileSize: 502683,
          fileType: 'image/jpeg',
          filename: 'clouds.jpg',
        },
      ],
      title: 'Fake title',
      content: '<p>Fake content</p>',
      injuries: [1],
      illnesses: [2],
      draft: false,
      organisation_annotation_type_id: 1,
      restricted_to_doc: true,
      restricted_to_psych: false,
    },
    t: i18nextTranslateStub(),
  };

  it('renders successfully', () => {
    const { container } = render(<Note {...props} />);
    expect(screen.getByTestId('Note|Title')).toHaveTextContent('Fake title');
    expect(screen.getByTestId('Note|Tag')).toHaveTextContent('Active');
    expect(screen.getByTestId('Note|Date')).toHaveTextContent('Apr 3, 2021');
    expect(
      container.getElementsByClassName('richTextDisplay')[0]
    ).toHaveTextContent('Fake content');
  });
});
