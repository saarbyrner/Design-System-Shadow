import { screen, render } from '@testing-library/react';
import { data as mockData } from '@kitman/services/src/mocks/handlers/planning/getEventAttachmentCategories';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import EditForm from '../EditForm';
import { ADD_NEW_CATEGORY } from '../utils/consts';

describe('<EditForm />', () => {
  const props = {
    t: i18nextTranslateStub(),
    formData: mockData,
    onFormChange: jest.fn(),
    uniqueNames: new Set(),
  };
  it('should render the page properly', () => {
    render(<EditForm {...props} />);
    expect(screen.getByText('Category Name')).toBeInTheDocument();
    expect(screen.getByText(ADD_NEW_CATEGORY)).toBeInTheDocument();
  });

  it('should show the names of the categories', async () => {
    render(<EditForm {...props} />);
    const categoryInputs = screen.getAllByRole('textbox');
    expect(categoryInputs.length).toBe(2);
    expect(categoryInputs[0].value).toBe(mockData[0].name);
    expect(categoryInputs[1].value).toBe(mockData[1].name);
  });
});
