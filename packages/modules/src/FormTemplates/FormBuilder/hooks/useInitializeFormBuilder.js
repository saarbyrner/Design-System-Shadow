// @flow

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setFormTemplateStructure,
  setOriginalFormTemplateStructure,
  setMetaDataField,
  resetFormBuilderStructure,
  setFormMenuElementTitle,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { getFormMetaData } from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import type { FormMetaData } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import { useFetchFormTemplateQuery } from '@kitman/services/src/services/formTemplates';
import { type CreateFormTemplateReturnType } from '@kitman/services/src/services/formTemplates/api/formTemplates/create';

const useInitializeFormBuilder = ({
  formTemplateId,
}: {
  formTemplateId: ?number,
}): { isError: boolean, isSuccess: boolean } => {
  const dispatch = useDispatch();
  const formMetaData: FormMetaData = useSelector(getFormMetaData);

  const {
    data = {},
    isError,
    isSuccess,
  }: {
    data: CreateFormTemplateReturnType,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useFetchFormTemplateQuery(formTemplateId, { skip: !formTemplateId });

  useEffect(() => {
    if (!formTemplateId && !data?.form_template) {
      // create a new template from scratch
      dispatch(resetFormBuilderStructure());

      if (formMetaData.title) {
        dispatch(setFormMenuElementTitle(formMetaData.title));
      }
    }
  }, [formTemplateId, data?.form_template, formMetaData.title, dispatch]);

  useEffect(() => {
    // data of an existing template from BE
    if (data?.form_template) {
      dispatch(
        setMetaDataField({
          value: data.form_template.name,
          field: 'title',
        })
      );

      dispatch(
        setMetaDataField({
          value: data.form_category ? data.form_category.name : data.category,
          field: 'category',
        })
      );

      dispatch(
        setMetaDataField({
          value: data.form_category?.product_area,
          field: 'productArea',
        })
      );
      dispatch(
        setMetaDataField({
          value: data.form_category?.id,
          field: 'formCategoryId',
        })
      );
      dispatch(
        setMetaDataField({
          value: data?.fullname,
          field: 'description',
        })
      );
      dispatch(
        setMetaDataField({
          value: data.form_type,
          field: 'type',
        })
      );
      dispatch(
        setMetaDataField({
          value: data.form_template.last_template_version.editor.fullname,
          field: 'creator',
        })
      );

      dispatch(
        setMetaDataField({
          value: data.created_at,
          field: 'createdAt',
        })
      );
      dispatch(
        setFormTemplateStructure({
          structure: data?.form_template?.last_template_version,
        })
      );
      dispatch(
        setOriginalFormTemplateStructure({
          structure: data?.form_template?.last_template_version,
        })
      );
    }
  }, [formTemplateId, data, dispatch]);

  return {
    isError,
    isSuccess: !formTemplateId ? true : isSuccess,
  };
};

export default useInitializeFormBuilder;
