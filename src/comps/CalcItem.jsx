import React, {useState,useEffect,useRef} from 'react';
import Numpad from './Numpad';
import ProgressBar from '@ramonak/react-progress-bar';

function checkIsRight(answer, sum,summand1,summand2,operation) {

  if (operation === "+") {
    if (sum === null)
      return answer === (summand1 + summand2);

    if (summand1 === null)
      return sum === (answer + summand2);

    if (summand2 === null)
      return sum === (summand1 + answer);
  }


  return false;
}

export default function CalcItem({sum,summand1,summand2, onResolve,operation} = []) {

  const Ref = useRef(null);

  const [sumEle, setSumEle] = useState(sum);
  const [summand1Ele, setSummand1Ele] = useState(summand1);
  const [summand2Ele, setSummand2Ele] = useState(summand2);
  const defaultTimerSeconds = 10;
  const [timer, setTimer] = useState(defaultTimerSeconds);

  const startTimeCalced = Date.now();

  const doResolve = (answer) =>{
    const isRight = checkIsRight(answer,sumEle,summand1Ele,summand2Ele,operation);
    const time = Date.now()- startTimeCalced;
    /*
    let answer = 0;

    if(sum === null)
      answer = sumEle;

    if(summand1 === null)
      answer = summand1Ele;

    if(summand2 === null)
      answer = summand2Ele;
   */
    onResolve(isRight,time,answer);
  }

  const getTimeRemaining = (e) => {
    const total =
        Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor(
        (total / 1000 / 60) % 60
    );
    const hours = Math.floor(
        (total / 1000 / 60 / 60) % 24
    );
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + defaultTimerSeconds);
    return deadline;
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } =
        getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(seconds);

      //setTimer(
      //    (hours > 9 ? hours : "0" + hours) +
      //    ":" +
      //    (minutes > 9
      //        ? minutes
      //        : "0" + minutes) +
      //    ":" +
      //    (seconds > 9 ? seconds : "0" + seconds)
      //);
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer(defaultTimerSeconds);

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  return <div className={'CalcItem'}>
    <ProgressBar className={'ProgressBar'} completed={timer} maxCompleted={defaultTimerSeconds} transitionDuration={'1s'} customLabel={timer+' s'} transitionTimingFunction={'linear'}/>

    <div className="controls">
      <form className={'operation_'+operation}>
        <fieldset>
          <input
              placeholder={'?'}
              id={'sum'}
              value={sumEle ?? ''}
              onChange={e => setSumEle(parseInt(e.target.value))}
          />
          <span className={'equal'}>=</span>
          <input
              placeholder={'?'}
              id={'summand1'}
              value={summand1Ele ?? ''}
              onChange={e => setSummand1Ele(parseInt(e.target.value))}
          />
          <span className={'operation'}>{operation}</span>
          <input
              placeholder={'?'}
              id={'summand2'}
              value={summand2Ele ?? ''}
              onChange={e => setSummand2Ele(parseInt(e.target.value))}
          />
        </fieldset>
        <div className={'text'}>Welche Zahl muss in die Lücke, damit die beiden unteren Zahlen zusammen die <b>{sumEle}</b> im Dach ergeben?</div>
      </form>
      {/*<button onClick={doResolve}>jetzt lösen</button>*/}
      <hr/>
      <Numpad onClick={doResolve} />
    </div>
  </div>
}
