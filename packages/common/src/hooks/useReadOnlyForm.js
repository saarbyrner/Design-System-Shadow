// @flow
import { useEffect } from 'react';

const toggleDisabledState = (element: HTMLElement, value: boolean) => {
  if (
    element instanceof HTMLButtonElement ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    // eslint-disable-next-line no-param-reassign
    element.disabled = value;
  }
  // eslint-disable-next-line no-param-reassign
  element.style.cursor = value ? 'not-allowed' : 'auto';
};

const getElementsToDisable = (id: string, excludeSelectors: string[]) => {
  const container = document.getElementById(id);
  const allElements: ?NodeList<HTMLElement> = container?.querySelectorAll('*');

  const excludeSelector = excludeSelectors.join(',');
  const excludedElements: ?NodeList<HTMLElement> = !excludeSelector
    ? null
    : container?.querySelectorAll(excludeSelector);

  const elementsToDisable: Array<any> = Array.from(allElements || []).filter(
    (element) =>
      excludedElements?.length
        ? !Array.from(excludedElements).includes(element)
        : true
  );

  return elementsToDisable;
};

const preventClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const toggleDisableElements = (elements: any[], value: boolean) => {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.addEventListener('mousedown', preventClick);
    element.addEventListener('click', preventClick);
    toggleDisabledState(element, value);
  }
};

type UseReadOnlyFormProps = {
  enabled: boolean,
  containerId: string,
  excludeSelectors?: Array<string>,
};

const useReadOnlyForm = ({
  enabled,
  containerId,
  excludeSelectors = [],
}: UseReadOnlyFormProps): void => {
  useEffect(() => {
    if (!enabled) return () => {};

    const elementsToDisable = getElementsToDisable(
      containerId,
      excludeSelectors
    );

    toggleDisableElements(elementsToDisable, true);

    return () => {
      toggleDisableElements(elementsToDisable, false);
    };
  }, [enabled, containerId, excludeSelectors]);
};

export default useReadOnlyForm;
