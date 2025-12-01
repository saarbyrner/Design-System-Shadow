import { render, act } from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import clinicalImpressionsData from '@kitman/services/src/mocks/handlers/medical/clinicalImpressions/data.mock';
import CIBodyPartsField from '../components/CommonFields/CIBodyParts';

describe('CIBodyParts', () => {
  let component;
  const onSave = jest.fn();
  // Setup a VirtuosoMockContext.Provider so all select options render
  const componentRender = () =>
    render(
      <ExportSettings
        title="Test Settings"
        onSave={onSave}
        onCancel={() => {}}
        isOpen
      >
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 40 }}
        >
          <CIBodyPartsField
            fieldKey="testKey"
            defaultValue={[]}
            label="Test CI Body Part"
            isMulti
            performServiceCall
            t={i18nextTranslateStub()}
          />
        </VirtuosoMockContext.Provider>
      </ExportSettings>
    );

  describe('when performServiceCall is default', () => {
    beforeEach(async () => {
      i18nextTranslateStub();
      await act(async () => {
        component = await componentRender();
      });
    });

    it('renders the dropdown with body parts', async () => {
      const select = component.queryByLabelText('Test CI Body Part');
      selectEvent.openMenu(select);

      const option1 = component.getByText(
        clinicalImpressionsData.clinical_impression_body_areas[0].name
      );
      expect(option1).toBeInTheDocument();

      const option2 = component.getByText(
        clinicalImpressionsData.clinical_impression_body_areas[1].name
      );
      expect(option2).toBeInTheDocument();

      const option3 = component.getByText(
        clinicalImpressionsData.clinical_impression_body_areas[2].name
      );
      expect(option3).toBeInTheDocument();

      await selectEvent.select(
        select,
        clinicalImpressionsData.clinical_impression_body_areas[1].name
      );

      await selectEvent.select(
        select,
        clinicalImpressionsData.clinical_impression_body_areas[2].name
      );

      await userEvent.click(
        component.getByRole('button', { name: 'Download' })
      );

      expect(onSave).toHaveBeenCalledWith(
        {
          testKey: [
            clinicalImpressionsData.clinical_impression_body_areas[1].id,
            clinicalImpressionsData.clinical_impression_body_areas[2].id,
          ],
        },
        expect.anything()
      );
    });
  });
});
