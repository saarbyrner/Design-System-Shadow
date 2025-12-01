// @flow
import { useParams } from 'react-router-dom';

/**
 * A helper hook to get the formAnswersSetId from the URL's :formAnswersSetId parameter.
 * It correctly handles the 'new' case, returning null if the ID is the literal string 'new',
 * which signifies that we are in "create mode".
 */
const useGetFormAnswersSetIdFromPath = (): ?string => {
  const { formAnswersSetId } = useParams();

  if (formAnswersSetId === 'new') {
    return null;
  }

  return formAnswersSetId;
};

export default useGetFormAnswersSetIdFromPath;
