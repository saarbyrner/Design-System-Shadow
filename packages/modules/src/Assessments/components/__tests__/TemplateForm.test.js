import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TemplateForm from '../TemplateForm';

describe('TemplateForm component', () => {
  const baseProps = {
    assessment: {
      id: 1,
      assessment_template: { id: 1, name: 'Template name' },
      assessment_date: '2020-06-04T23:00:00.000Z',
      name: 'Assessment 1',
      items: [],
    },
    viewType: 'LIST',
    onClickSubmit: jest.fn(),
    onClickClose: jest.fn(),
    t: i18nextTranslateStub() || 'Save',
  };

  beforeEach(() => {
    baseProps.onClickSubmit.mockClear();
    baseProps.onClickClose.mockClear();
  });

  it('renders correctly', () => {
    render(<TemplateForm {...baseProps} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Staff Members')).toBeInTheDocument();
  });

  it('does not render the checkbox when viewType is GRID', () => {
    render(<TemplateForm {...baseProps} viewType="GRID" />);
    expect(screen.queryByLabelText('Staff Members')).not.toBeInTheDocument();
  });

  describe('when clicking save', () => {
    it('saves the new template properly', async () => {
      const user = userEvent.setup();
      render(<TemplateForm {...baseProps} />);

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'Template name' },
      });
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(baseProps.onClickSubmit).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickSubmit).toHaveBeenCalledWith({
        assessment_id: 1,
        name: 'Template name',
        include_users: true,
      });
    });

    describe('when the "assessments-multiple-athletes" feature flag is enabled', () => {
      beforeEach(() => {
        window.featureFlags['assessments-multiple-athletes'] = true;
      });
      afterEach(() => {
        window.featureFlags['assessments-multiple-athletes'] = false;
      });

      it('saves the new template properly', async () => {
        const user = userEvent.setup();
        render(<TemplateForm {...baseProps} />);

        fireEvent.change(screen.getByLabelText('Name'), {
          target: { value: 'Template name' },
        });
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(baseProps.onClickSubmit).toHaveBeenCalledWith({
          assessment_group_id: 1,
          name: 'Template name',
          include_users: true,
        });
      });

      it('saves without including users when the checkbox is unticked', async () => {
        const user = userEvent.setup();
        render(<TemplateForm {...baseProps} />);

        fireEvent.change(screen.getByLabelText('Name'), {
          target: { value: 'Template name' },
        });
        await user.click(screen.getByLabelText('Staff Members'));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(baseProps.onClickSubmit).toHaveBeenCalledWith({
          assessment_group_id: 1,
          name: 'Template name',
          include_users: false,
        });
      });

      it('saves without including users when the viewType is GRID', async () => {
        const user = userEvent.setup();
        render(<TemplateForm {...baseProps} viewType="GRID" />);

        fireEvent.change(screen.getByLabelText('Name'), {
          target: { value: 'Template name' },
        });
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(baseProps.onClickSubmit).toHaveBeenCalledWith({
          assessment_group_id: 1,
          name: 'Template name',
          include_users: false,
        });
      });
    });
  });
});
