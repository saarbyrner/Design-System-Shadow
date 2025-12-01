// @flow
import { axios } from '@kitman/common/src/utils/services';

export const generateDeleteFormCategoryByIdUrl = (categoryId: number) =>
  `/forms/categories/${categoryId}`;

const deleteFormCategory = async (props: {
  categoryId: number,
}): Promise<void> => {
  const url = generateDeleteFormCategoryByIdUrl(props.categoryId);

  const { data } = await axios.delete(url);

  return data;
};

export default deleteFormCategory;
