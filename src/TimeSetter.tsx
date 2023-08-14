import { FaArrowDown, FaArrowUp } from "react-icons/fa"

interface TimeSetterProps {
   time: number;
   setTime: (time: number) => void;
   min: number;
   max: number;
   interval: number;
   type: "break" | "session";
}

const TimeSetter: React.FC<TimeSetterProps> = ({
   time,
   setTime,
   min,
   max,
   interval,
   type,
}) => {
   return (
      <div>
         <button
            id={`${type}-decrement`}
            onClick={() => (time > min && setTime(time - interval))}
         >
            <FaArrowDown />
         </button>
         
         <span id={`${type}-length`}>{time / interval}</span>

         <button
            id={`${type}-increment`}
            onClick={() => (time < max && setTime(time + interval))}
         >
            <FaArrowUp />
         </button>
         
      </div>
   )
}

export default TimeSetter