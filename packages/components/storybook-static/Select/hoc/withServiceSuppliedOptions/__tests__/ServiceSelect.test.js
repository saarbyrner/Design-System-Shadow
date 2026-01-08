import sinon from 'sinon';
import $ from 'jquery';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getTeams } from '@kitman/services/src/index';
import ServiceSelect from '../ServiceSelect';

describe('ServiceSelect', () => {
  let component;
  const mockOnChange = jest.fn();

  sinon
    .stub($, 'ajax')
    .withArgs(
      sinon.match({
        url: '/teams',
      })
    )
    .returns(
      $.Deferred().resolveWith(null, [
        [
          { id: 5097, name: 'Test Cup Team' },
          { id: 7218, name: 'Test Enemy Team' },
        ],
      ])
    );

  const componentRender = (performServiceCall) =>
    render(
      <ServiceSelect
        service={getTeams}
        dataId="team_id"
        onDataLoadingStatusChanged={jest.fn()}
        label="Opposition"
        onChange={mockOnChange}
        value="Test Opposition"
        invalid={false}
        performServiceCall={performServiceCall}
      />
    );

  describe('when performServiceCall is default', () => {
    beforeEach(async () => {
      i18nextTranslateStub();
      await act(async () => {
        component = await componentRender(undefined);
      });
    });

    it('renders the dropdown and functions', async () => {
      expect(component.getByText('Opposition')).toBeInTheDocument();
      const textBox = component.getByRole('textbox');
      expect(textBox).toBeInTheDocument();
      expect(textBox).toBeEnabled();

      await userEvent.click(textBox);
      await userEvent.click(component.getByText('Test Cup Team'));
      expect(mockOnChange).toHaveBeenCalledWith(5097);
    });
  });

  describe('when performServiceCall is true', () => {
    beforeEach(async () => {
      i18nextTranslateStub();
      await act(async () => {
        component = await componentRender(true);
      });
    });

    it('renders the dropdown and functions', async () => {
      expect(component.getByText('Opposition')).toBeInTheDocument();
      const textBox = component.getByRole('textbox');
      expect(textBox).toBeInTheDocument();
      expect(textBox).toBeEnabled();

      await userEvent.click(textBox);
      await userEvent.click(component.getByText('Test Cup Team'));
      expect(mockOnChange).toHaveBeenCalledWith(5097);
    });
  });

  describe('when performServiceCall is false', () => {
    beforeEach(async () => {
      i18nextTranslateStub();
      await act(async () => {
        component = await componentRender(false);
      });
    });

    it('renders the dropdown and functions', async () => {
      expect(component.getByText('Opposition')).toBeInTheDocument();
      const textBox = component.getByRole('textbox');
      expect(textBox).toBeInTheDocument();
      expect(textBox).toBeDisabled();
    });
  });
});
