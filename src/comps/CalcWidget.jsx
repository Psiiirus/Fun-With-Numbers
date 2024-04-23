import React, {useRef, useState} from 'react';
import Numpad from './Numpad';

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
  for (let a=0;a<=count;a+=1)  {
    calcList.push(createCalcQuestion(getRandomElementFromArray(sumNumbers),getRandomElementFromArray(operations)))
  }

  console.log('####createCalcQuestions');
  return calcList;
}

function CalcWidgetSetup({onStart}) {

  const [sumNumbers, setSumNumbers] = useState([]);
  const [operations, setOperations] = useState(["+"]);
  const [count, setCount] = useState(10);

  // Funktion zum Hinzufügen eines neuen Elements zum Array
  const addSumNumberItem = item => {
    setSumNumbers(prevItems => [...prevItems, item]);
  };

  // Funktion zum Entfernen eines Elements an einer bestimmten Indexposition
  const removeSumNumbersItemAtIndex = index => {
    setSumNumbers(prevItems => prevItems.filter((item, idx) => idx !== index));
  };

  // Funktion zum Leeren des Arrays
  const clearSumNumbers = () => {
    setSumNumbers([]);
  };

  const isSumNumbersActive = (number) => {
    let index = sumNumbers.findIndex((ele)=> { console.log({ele});return ele === number});

    return index >= 0;
  }

  const toggleSumNumbers = (number) => {
    let index = sumNumbers.findIndex((ele)=> { console.log({ele});return ele === number});

    if(index>=0)
      removeSumNumbersItemAtIndex(index);
    else
      addSumNumberItem(number);
  }

  const finish = () =>{
    onStart(sumNumbers,operations,count);
  }

  return (<div className={'CalcWidgetSetup'}>
    <p>Mit welchen Zahlen soll gespielt werden?</p>
    <div className="SumNumbers">
      <div className={'button'+(isSumNumbersActive(1)?' active':'')} onClick={e => toggleSumNumbers(1)}>1</div>
      <div className={'button'+(isSumNumbersActive(2)?' active':'')}  onClick={e => toggleSumNumbers(2)}>2</div>
      <div className={'button'+(isSumNumbersActive(3)?' active':'')}  onClick={e => toggleSumNumbers(3)}>3</div>
      <div className={'button'+(isSumNumbersActive(4)?' active':'')}  onClick={e => toggleSumNumbers(4)}>4</div>
      <div className={'button'+(isSumNumbersActive(5)?' active':'')}  onClick={e => toggleSumNumbers(5)}>5</div>
      <div className={'button'+(isSumNumbersActive(6)?' active':'')}  onClick={e => toggleSumNumbers(6)}>6</div>
      <div className={'button'+(isSumNumbersActive(7)?' active':'')}  onClick={e => toggleSumNumbers(7)}>7</div>
      <div className={'button'+(isSumNumbersActive(8)?' active':'')}  onClick={e => toggleSumNumbers(8)}>8</div>
      <div className={'button'+(isSumNumbersActive(9)?' active':'')}  onClick={e => toggleSumNumbers(9)}>9</div>
    </div>
    <button onClick={finish}>🚀 Und los!</button>
  </div>);
}


export default function CalcGame() {
  return <CalcWidget/>;
}

function CalcWidget() {

  const [isStarted, setStarted] = useState(false);
  const [isFinished, setFinished] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentSum, setCurrentSum] = useState();
  const [currentSummand1, setCurrentSummand1] = useState();
  const [currentSummand2, setCurrentSummand2] = useState();

  const [currentCalcQuestions, calcQuestions] = useState();

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

    console.log('calcResolved', {
      isRight,
      time,
      current : calcList.current[currentQuestionIndex],
      calcList: calcList.current,
      currentQuestionIndex
    });

    nextCalc();
  }

  return (<div className={'CalcWidget'}>
    <h1>🧠 Spass mit Zahlen</h1>
    {!isStarted?<CalcWidgetSetup onStart={startCalc} />:(isFinished?<CalcQuestionSummary calcList={calcList.current} />:
    <CalcItem
        sum={currentSum}
        summand1={currentSummand1}
        summand2={currentSummand2}
        operation={calcList.current[currentQuestionIndex].operation}
        onResolve={calcResolved}
        key={currentSum+''+currentSummand1+''+currentSummand2}
    />)}
  </div>);

}

function CalcQuestionSummary({calcList}) {

  const getRating =  (calcItem) =>  {

    const time = calcItem.time;

    if(!calcItem.isRight)
      return {color:'red',text:'Falsch'}

    if(time >= 10000)
      return {color:'orange',text:'Langsam'}

    if(time >= 3000)
      return {color:'yellow',text:'Okay'}

    return {color:'lightgreen',text:'Schnell'}
  }

  let rightAnswerCount = 0;
  let timingSummary = 0;

  calcList.forEach((item) => {
    if(item.isRight)
      rightAnswerCount++;

    if(item.time)
      timingSummary += item.time;

    item.rightAnswer = calcRightAnswer('+',item.sum, item.summand1, item.summand2)
  });

  return (<div className={'CalcWidget'}>
    <strong>⭐️ Punkte:</strong> 100 von 100 <small><i>(tbd.)</i></small><br/>
    <strong>✅ Anzahl richtiger Lösungen:</strong> {rightAnswerCount} von {calcList.length}<br/>
    <strong>⏱️ Geschwindigkeit</strong>: {parseFloat(parseInt(timingSummary / rightAnswerCount,10) / 1000).toFixed(2)}s / Frage
    <hr/>
    <h4>Temptest-Auswertung</h4>
    <table cellPadding={6} cellSpacing={3}>
      <tbody>
      {calcList.map((calc, index) => {

        return (<tr key={index}>
          <td>
            <strong style={{
              padding: 2,
              paddingRight: 5,
              paddingLeft: 15,
              display: 'inline-block',
              backgroundColor: getRating(calc).color
            }}>{index + 1}.</strong></td>
          <td>{calc.summand1 ?? (<span>{'_'}</span>)} + {calc.summand2 ?? (
              <span>{'_'}</span>)} =
          </td>
          <td>{calc.sum ?? (<span>{'_'}</span>)}</td>
          <td>Deine Antwort: <b>{calc.answer}</b></td>
          <td>{calc.isRight ? '✅ Gut' : '❌ Falsch'}</td>
          <td>&nbsp;</td>
          <td>{getRating(calc).text} <small>(Dauer: {calc.time / 1000} Sek.)</small></td>
          <td>{!calc.isRight ? <b>{'Richtige Antwort: '+(calc.rightAnswer)}</b>:''}</td>
        </tr>)
      })}
      </tbody>
    </table>
  </div>)
}

function calcRightAnswer(operation='+' ,sum,summand1,summand2) {
  if(operation==="+")
  {
    //3 = 1 + 2
    if(sum === null)
      return summand1+summand2;

    if(summand1 === null)
      return  sum-summand2;

    if(summand2 === null)
      return sum-summand1;
  }
}

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

function CalcItem({sum,summand1,summand2, onResolve,operation} = []) {

  const [sumEle, setSumEle] = useState(sum);
  const [summand1Ele, setSummand1Ele] = useState(summand1);
  const [summand2Ele, setSummand2Ele] = useState(summand2);

  const startTime = Date.now();

  const doResolve = (answer) =>{
    const isRight = checkIsRight(answer,sumEle,summand1Ele,summand2Ele,operation);
    const time = Date.now()- startTime;
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

  return <div className={'CalcItem'}>
    <form className={'operation_'+operation}>
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
    </form>
    {/*<button onClick={doResolve}>jetzt lösen</button>*/}
    <hr/>
    <Numpad onClick={doResolve} />
  </div>
}
