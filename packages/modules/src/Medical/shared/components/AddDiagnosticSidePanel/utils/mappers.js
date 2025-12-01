// @flow

// Transform a queued diagnostics array where each item may contain multiple
// diagnosticTypes into a flattened list of items each with a single diagnosticType.
export const transformQueuedDiagnostics = (queuedDiagnostics: Array<Object>) =>
  queuedDiagnostics
    .map((item) =>
      Array.isArray(item.diagnosticTypes)
        ? item.diagnosticTypes.map((type) => ({
            ...item,
            diagnosticType: type,
            diagnosticTypes: [],
          }))
        : [item]
    )
    .flat(Infinity);

// Return a new array of questions sorted by id asc
export const sortQuestionsById = (questions: Array<any> = []) => {
  const copy = [];
  if (Array.isArray(questions)) {
    for (let i = 0; i < questions.length; i += 1) {
      copy.push(questions[i]);
    }
  }
  copy.sort((a, b) => a.id - b.id);
  return copy;
};
