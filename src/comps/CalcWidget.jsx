import React, {useRef, useState} from 'react';

import CalcQuestionSummary from './CalcQuestionSummary';
import CalcWidgetSetup from './CalcWidgetSetup';
import CalcItem from './CalcItem';

function createCalcQuestions(sumNumbers =[],operations =[], count= 3) {

  function getRandomLessThan(max) {
    if (max <= 0) {
      return 0
    }
    return Math.floor(Math.random() * max);
  }

  function getRandomElementFromArray(array) {
    if (array.length === 0) {
      throw new Error("Das Array darf nicht leer sein.");
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }


  function createCalcQuestion(questionNumber,operation) {
    let sum = null
    let summand1 =  null;
    let summand2 = null;

    if(operation === '+') {
      sum = questionNumber;
      summand1 =  getRandomLessThan(questionNumber);
      summand2 = null;
    }

    return {
      operation,
      sum,
      summand1,
      summand2,
      isRight: null,
      time: null,
      answer: null,
    };
  }

  const calcList = [];
  for (let a=0;a<count;a+=1)  {
    calcList.push(createCalcQuestion(getRandomElementFromArray(sumNumbers),getRandomElementFromArray(operations)))
  }

  return calcList;
}

export default function CalcWidget() {

  const [isStarted, setStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentSum, setCurrentSum] = useState();
  const [currentSummand1, setCurrentSummand1] = useState();
  const [currentSummand2, setCurrentSummand2] = useState();

  let calcList = useRef([]);


  function startCalc(sumnumbers,operations,count) {

    calcList.current = createCalcQuestions(sumnumbers,operations,count);

    setStarted(true);
    nextCalc();
  }

  function nextCalc() {
    const questionIndex = currentQuestionIndex+1;

    if(questionIndex === calcList.current.length) {
      setFinished(true);
      setCurrentQuestionIndex(-1);
    }
    else
    {
      const calcData = calcList.current[questionIndex];

      setCurrentSum(calcData.sum)
      setCurrentSummand1(calcData.summand1)
      setCurrentSummand2(calcData.summand2)
    }

    setCurrentQuestionIndex(questionIndex);
  }

  const calcResolved = (isRight = false ,time = 0, answer = null)  => {

    calcList.current[currentQuestionIndex].isRight = isRight;
    calcList.current[currentQuestionIndex].time = time;
    calcList.current[currentQuestionIndex].answer = answer;

    nextCalc();
  }

  const onRestart = () =>{
    setStarted(false)
    setFinished(false)
    setCurrentQuestionIndex(-1)
    setCurrentSum(null)
    setCurrentSummand1(null)
    setCurrentSummand2(null)
  }

  return (<div className={'CalcWidget'}>
    {!isStarted?<CalcWidgetSetup onStart={startCalc} />:(isFinished?<CalcQuestionSummary calcList={calcList.current} onRestart={onRestart} />:<div>
    <CalcItem
        sum={currentSum}
        summand1={currentSummand1}
        summand2={currentSummand2}
        operation={calcList.current[currentQuestionIndex].operation}
        onResolve={calcResolved}
        key={currentSum+''+currentSummand1+''+currentSummand2}
    /><small>{currentQuestionIndex+1}{'/'}{calcList.current.length}</small></div>)}
  </div>);
}
