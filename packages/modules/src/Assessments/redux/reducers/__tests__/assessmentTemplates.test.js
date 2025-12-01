import assessmentTemplatesReducer from '../assessmentTemplates';
import {
  saveTemplateSuccess,
  deleteTemplateSuccess,
  renameTemplateSuccess,
} from '../../actions';

describe('assessmentTemplates reducer', () => {
  const initialState = [
    {
      id: 1,
      name: 'Template A',
      include_users: true,
    },
  ];

  it('returns correct state on SAVE_TEMPLATE_SUCCESS', () => {
    const newTemplate = {
      id: 2,
      name: 'Template B',
      include_users: true,
    };
    // The first argument for assessmentId is not used by this reducer, so we can pass null.
    const action = saveTemplateSuccess(null, newTemplate);

    const nextState = assessmentTemplatesReducer(initialState, action);

    expect(nextState).toEqual([...initialState, newTemplate]);
  });

  it('returns correct state on DELETE_TEMPLATE_SUCCESS', () => {
    const action = deleteTemplateSuccess(1);

    const nextState = assessmentTemplatesReducer(initialState, action);

    expect(nextState).toEqual([]);
  });

  it('returns correct state on RENAME_TEMPLATE_SUCCESS', () => {
    const action = renameTemplateSuccess(1, 'New template name');

    const nextState = assessmentTemplatesReducer(initialState, action);

    expect(nextState).toEqual([
      {
        id: 1,
        name: 'New template name',
        include_users: true,
      },
    ]);
  });
});
