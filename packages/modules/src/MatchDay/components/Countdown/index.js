// @flow
import { useEffect, useState } from 'react';
import { calculateTimeLeft } from '../../shared/utils';

type Props = {
  targetDate: Date,
};

const Countdown = ({ targetDate }: Props) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
};

export default Countdown;
