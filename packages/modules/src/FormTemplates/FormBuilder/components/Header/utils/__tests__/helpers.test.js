import { formTypeEnumLike } from '@kitman/modules/src/FormTemplates/shared/enum-likes';
import { buildCreateFormTemplateRequestBody } from '../helpers';

describe('helpers', () => {
  describe('buildCreateFormTemplateRequestBody', () => {
    it('should build the request body properly', () => {
      const formMetaData = {
        category: 'medical',
        type: formTypeEnumLike.assessment,
        description: 'Describing Pokémons',
        title: 'Pikachu Caring',
        formCategoryId: 1,
        productArea: 'medical',
      };

      const formMenu = [
        {
          id: 1,
          order: 1,
          config: {},
          element_type: 'some_type',
          visible: true,
          form_elements: [
            {
              id: 2,
              order: 2,
              config: {},
              element_type: 'some other type',
              visible: true,
              form_elements: [
                {
                  id: 3,
                  order: 3,
                  config: {},
                  element_type: 'nested',
                  visible: true,
                },
              ],
            },
            {
              id: 4,
              order: 4,
              config: {},
              element_type: 'not so nested',
              visible: true,
              form_elements: [],
            },
          ],
        },
      ];

      const formStructure = {
        form_elements: formMenu,
      };

      const input = {
        formMetaData,
        formStructure,
      };

      const expectedFormStructure = [
        {
          id: 1,
          order: 1,
          config: {},
          element_type: 'some_type',
          visible: true,
          form_elements: [
            {
              id: 2,
              order: 1,
              config: {},
              element_type: 'some other type',
              visible: true,
              form_elements: [
                {
                  id: 3,
                  order: 1,
                  config: {},
                  element_type: 'nested',
                  visible: true,
                },
              ],
            },
            {
              id: 4,
              order: 2,
              config: {},
              element_type: 'not so nested',
              visible: true,
              form_elements: [],
            },
          ],
        },
      ];

      const expectedOutput = {
        form: {
          category: formMetaData.category,
          group: 'default_group', // to be changed in the future, once we have more clarity from the BE
          form_type: formMetaData.type,
          key: 'default_key', // to be changed in the future, once we have more clarity from the BE
          name: formMetaData.title,
          fullname: formMetaData.description,
          config: null, // to be changed in the future, once we have more clarity from the BE
          enabled: true,
        },
        form_template: { name: formMetaData.title },
        form_category_id: formMetaData.formCategoryId,
        form_elements: expectedFormStructure,
        form_template_version: {
          name: formMetaData.title,
          config: null,
          form_elements: expectedFormStructure,
        },
      };

      expect(buildCreateFormTemplateRequestBody(input)).toEqual(expectedOutput);
    });
  });
});
