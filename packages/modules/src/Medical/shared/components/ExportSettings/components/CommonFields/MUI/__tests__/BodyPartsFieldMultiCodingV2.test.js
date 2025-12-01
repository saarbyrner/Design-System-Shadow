import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import { useGetBodyAreasMultiCodingV2Query } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import bodyAreasMultiCodingV2Mock from '@kitman/services/src/mocks/handlers/medical/pathologies/data.mock';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetBodyAreasMultiCodingV2Query: jest.fn(),
  })
);

const onSave = jest.fn();
const bodyParts = bodyAreasMultiCodingV2Mock;

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
      <ExportSettings.CommonFields.Mui.BodyPartsFieldMultiCodingV2 {...props} />
    </ExportSettings>
  );

describe('BodyPartsFieldMultiCodingV2', () => {
  beforeEach(() => {
    useGetBodyAreasMultiCodingV2Query.mockReturnValue({
      data: bodyAreasMultiCodingV2Mock,
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
