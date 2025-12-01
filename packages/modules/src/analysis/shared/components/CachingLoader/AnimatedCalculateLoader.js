// @flow
import { useState, useEffect } from 'react';
import { colors } from '@kitman/common/src/variables';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { KitmanIconName } from '@kitman/playbook/icons';

type Props = {
  iconList?: Array<KitmanIconName>,
  animationDelay?: number,
  timeoutDuration?: number,
};

const styles = {
  squareContainer: {
    width: '24px',
    height: '24px',
    display: 'flex',
    flexDirection: 'column',
    border: `2.5px solid ${colors.grey_200}`,
    borderRadius: '3px',
  },
  rowOne: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTwo: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

const DEFAULT_ICONS = [
  KITMAN_ICON_NAMES.RemoveIcon,
  KITMAN_ICON_NAMES.Close,
  KITMAN_ICON_NAMES.DragHandleIcon,
  KITMAN_ICON_NAMES.Add,
];

const DEFAULT_ANIMATION_DELAY = 1000;
const DEFAULT_TIMEOUT_DURATION = 600;

const AnimatedCalculateLoader = (props: Props) => {
  const icons = props.iconList ?? DEFAULT_ICONS;
  const [currentIndex, setCurrentIndex] = useState(0);

  // indicates four corners of the square in clockwise direction
  const [positions, setPositions] = useState(['', '', '', '']);

  /**
   * Begins the animation loop. Adds the icons one by one into
   * the positions array after a given animation delay.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const newPositions = [...prev];
        newPositions[currentIndex] = icons[currentIndex];
        return newPositions;
      });

      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % icons.length;
        return nextIndex;
      });
    }, props.animationDelay ?? DEFAULT_ANIMATION_DELAY);

    return () => clearInterval(interval);
  }, [currentIndex, props.animationDelay, icons]);

  /**
   * Clears the icons after one loop
   * of animation is complete
   */
  useEffect(() => {
    if (currentIndex === 0) {
      const timeout = setTimeout(
        () => setPositions(() => ['', '', '', '']),
        props.timeoutDuration ?? DEFAULT_TIMEOUT_DURATION
      );
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [currentIndex, props.timeoutDuration]);

  return (
    <div data-testid="AnimatedCalculateLoader" style={styles.squareContainer}>
      <div style={styles.rowOne}>
        {positions[0] && (
          <KitmanIcon
            name={positions[0]}
            sx={{ fontSize: '0.6rem !important' }}
          />
        )}

        {positions[1] && (
          <KitmanIcon
            name={positions[1]}
            sx={{ fontSize: '0.6rem !important' }}
          />
        )}
      </div>
      <div style={styles.rowTwo}>
        {positions[2] && (
          <KitmanIcon
            name={positions[2]}
            sx={{ fontSize: '0.6rem !important' }}
          />
        )}
        {positions[3] && (
          <KitmanIcon
            name={positions[3]}
            sx={{ fontSize: '0.6rem !important' }}
          />
        )}
      </div>
    </div>
  );
};

export default AnimatedCalculateLoader;
