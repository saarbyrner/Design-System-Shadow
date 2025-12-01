import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { useGetPathologiesMultiCodingV2Query } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { osiics15MockPathologies as pathologies } from '@kitman/services/src/mocks/handlers/medical/pathologies';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetPathologiesMultiCodingV2Query: jest.fn(),
  })
);

const onSave = jest.fn();

const defaultProps = {
  multiple: true,
  fieldKey: 'pathologies',
  label: 'Pathologies',
  performServiceCall: true,
  isCached: false,
};

const getPathologyLabel = (code, pathology) => `${code} ${pathology}`;

// Setup a VirtuosoMockContext.Provider so all select options render
const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(
    <ExportSettings
      title="Test Settings"
      onSave={onSave}
      onCancel={() => {}}
      isOpen
    >
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 40 }}
      >
        <ExportSettings.CommonFields.Mui.PathologiesMultiCodingV2 {...props} />
      </VirtuosoMockContext.Provider>
    </ExportSettings>
  );

describe('PathologiesMultiCodingV2Field', () => {
  beforeEach(() => {
    useGetPathologiesMultiCodingV2Query.mockReturnValue({
      data: pathologies,
      isSuccess: true,
    });
  });
  describe('when performServiceCall is default', () => {
    it('renders the dropdown with pathologies', async () => {
      const { user } = renderComponent();

      const dropdown = screen.getByLabelText(defaultProps.label);

      expect(dropdown).toBeInTheDocument();

      await user.click(dropdown);

      const option1Label = getPathologyLabel(
        pathologies[0].code,
        pathologies[0].pathology
      );
      const option1 = screen.getByText(option1Label);

      const option2Label = getPathologyLabel(
        pathologies[1].code,
        pathologies[1].pathology
      );
      const option2 = screen.getByText(option2Label);

      const option3Label = getPathologyLabel(
        pathologies[2].code,
        pathologies[2].pathology
      );
      const option3 = screen.getByText(option3Label);

      [option1, option2, option3].forEach((option) => {
        expect(option).toBeInTheDocument();
      });

      await user.click(option2);
      await user.click(option3);

      await user.click(screen.getByRole('button', { name: 'Download' }));

      expect(onSave).toHaveBeenCalledWith(
        {
          pathologies: [
            {
              id: pathologies[1].code,
              label: option2Label,
            },
            {
              id: pathologies[2].code,
              label: option3Label,
            },
          ],
        },
        expect.anything()
      );
    });
  });
});
