import React, {useState, useEffect} from 'react';
import {getRestTime} from '../../modules/utils';
import {constantString} from '../../modules/strings';
import './style/Timer.scss';

interface Props {
  endtime: Date,
  handleBidStatus: (isClosed: boolean) => void,
  classname: string
}

const Timer: React.FC<Props> = ({endtime, handleBidStatus, classname}) => {
  const [restTime, setRestTime] = useState<string>(getRestTime(endtime));

  useEffect(() => {
    const countdown = setInterval(() => {
      const result = getRestTime(endtime);
      setRestTime(result);
      if(result === constantString.endBid) {
        handleBidStatus(true);
        clearInterval(countdown); 
      }
    }, 1000);

    return () => clearInterval(countdown); //componenwillunmount
  }, [restTime]);

  return (
    <div className={classname}>{restTime}</div>
  );
};

export default Timer;