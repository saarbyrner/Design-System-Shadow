import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import { useGetClinicalImpressionsBodyAreasQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import clinicalImpressionsData from '@kitman/services/src/mocks/handlers/medical/clinicalImpressions/data.mock';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetClinicalImpressionsBodyAreasQuery: jest.fn(),
}));

const onSave = jest.fn();
const bodyParts = clinicalImpressionsData.clinical_impression_body_areas;

const defaultProps = {
  multiple: true,
  fieldKey: 'bodyParts',
  label: 'Body Parts',
  performServiceCall: true,
  isCached: false,
};

// Setup a VirtuosoMockContext.Provider so all select options render
const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <ExportSettings
      title="Test Settings"
      onSave={onSave}
      onCancel={() => {}}
      isOpen
    >
      <ExportSettings.CommonFields.Mui.CIBodyParts {...props} />
    </ExportSettings>
  );

describe('CIBodyParts', () => {
  beforeEach(() => {
    useGetClinicalImpressionsBodyAreasQuery.mockReturnValue({
      data: clinicalImpressionsData.clinical_impression_body_areas,
      isSuccess: true,
    });
  });
  describe('when performServiceCall is default', () => {
    it('renders the dropdown with body parts', async () => {
      const { user } = renderComponent();

      const dropdown = screen.getByLabelText(defaultProps.label);

      expect(dropdown).toBeInTheDocument();

      await user.click(dropdown);

      const option1 = screen.getByText(bodyParts[0].name);
      const option2 = screen.getByText(bodyParts[1].name);
      const option3 = screen.getByText(bodyParts[2].name);

      [option1, option2, option3].forEach((option) => {
        expect(option).toBeInTheDocument();
      });

      await user.click(option2);
      await user.click(option3);

      await user.click(screen.getByRole('button', { name: 'Download' }));

      expect(onSave).toHaveBeenCalledWith(
        {
          bodyParts: [
            {
              id: bodyParts[1].id,
              label: bodyParts[1].name,
            },
            {
              id: bodyParts[2].id,
              label: bodyParts[2].name,
            },
          ],
        },
        expect.anything()
      );
    });
  });
});
