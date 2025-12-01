// @flow
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

export const useGetFormAnswersSetIdFromPath = () => {
  /*
   * giving the url /forms/forms_answers_set/40211/edit
   * the formAnswersSetId is the 4th part of the URL
   * example split: ['', 'forms', 'forms_answers_set', '40211', 'edit']
   */
  const locationPathname = useLocationPathname();
  const formAnswersSetId = +locationPathname.split('/')[3];
  return formAnswersSetId;
};
