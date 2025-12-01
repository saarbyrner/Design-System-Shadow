// @flow
import {
  pointerWithin,
  getFirstCollision,
  rectIntersection,
  closestCenter,
} from '@dnd-kit/core';

// $FlowIgnore Trying to type these library objects not worth it
const collisionAlgorithm = (args) => {
  const droppableContainers = args.droppableContainers;

  // Check if pointer is colliding with ExerciseListPanel if so
  // we need not continue to check other containers
  const pointerCollisions = pointerWithin({
    ...args,
    droppableContainers: droppableContainers.filter(
      ({ id }) => id === 'ExerciseListPanel'
    ),
  });

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    // Must have collided with ExerciseListPanel
    return pointerCollisions;
  }

  // TODO: can we ensure only pointerCoordinates to avoid rectIntersection
  // Assume that is keyboard sensor that would add rectIntersection maybe?
  const intersections = args.pointerCoordinates
    ? pointerWithin(args)
    : rectIntersection(args);
  const overCollision = getFirstCollision(intersections);
  let overId = overCollision?.id;
  if (overId != null) {
    if (!overCollision.data.droppableContainer.data.current?.sortable) {
      // We are not over a sortable item

      // We currently don't drop into the session, so overId has to be for a section
      // Return the closest droppable within that section ( which will be an exercise )

      const closestExerciseDroppableId = closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) =>
            container.id !== overId &&
            container.data.current?.sortable?.containerId === overId
        ),
      })[0]?.id;

      if (closestExerciseDroppableId != null) {
        overId = closestExerciseDroppableId;
      }
    }
    return [{ id: overId }];
  }

  return [];
};

export default collisionAlgorithm;
