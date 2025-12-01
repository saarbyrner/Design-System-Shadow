// @flow

const calculateLongestLabel = (
  longestLabelValue: string,
  label?: string
): string => {
  if (label && longestLabelValue.length < label?.length) {
    return label;
  }
  return longestLabelValue;
};

export default calculateLongestLabel;
