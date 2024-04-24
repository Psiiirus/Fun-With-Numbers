import React, {useState} from 'react';

export default function CalcWidgetSetup({onStart}) {

  const [sumNumbers, setSumNumbers] = useState([]);
  // eslint-disable-next-line
  const [operations, setOperations] = useState(["+"]);
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  const clearSumNumbers = () => {
    setSumNumbers([]);
  };

  const isSumNumbersActive = (number) => {
    let index = sumNumbers.findIndex((ele)=> { return ele === number});

    return index >= 0;
  }

  const toggleSumNumbers = (number) => {
    let index = sumNumbers.findIndex((ele)=> { return ele === number});

    if(index>=0)
      removeSumNumbersItemAtIndex(index);
    else
      addSumNumberItem(number);
  }

  const finish = () =>{
    onStart(sumNumbers,operations,count);
  }

  return (<div className={'CalcWidgetSetup'}>
    <h1>🧠 Spass mit Zahlen</h1>
    <p>Mit welchen Zahlen soll gespielt werden?</p>
    <div className="SumNumbers">
      <div className={'button' + (isSumNumbersActive(1) ? ' active' : '')}
           onClick={e => toggleSumNumbers(1)}>1
      </div>
      <div className={'button' + (isSumNumbersActive(2) ? ' active' : '')}
           onClick={e => toggleSumNumbers(2)}>2
      </div>
      <div className={'button' + (isSumNumbersActive(3) ? ' active' : '')}
           onClick={e => toggleSumNumbers(3)}>3
      </div>
      <div className={'button' + (isSumNumbersActive(4) ? ' active' : '')}
           onClick={e => toggleSumNumbers(4)}>4
      </div>
      <div className={'button' + (isSumNumbersActive(5) ? ' active' : '')}
           onClick={e => toggleSumNumbers(5)}>5
      </div>
      <div className={'button' + (isSumNumbersActive(6) ? ' active' : '')}
           onClick={e => toggleSumNumbers(6)}>6
      </div>
      <div className={'button' + (isSumNumbersActive(7) ? ' active' : '')}
           onClick={e => toggleSumNumbers(7)}>7
      </div>
      <div className={'button' + (isSumNumbersActive(8) ? ' active' : '')}
           onClick={e => toggleSumNumbers(8)}>8
      </div>
      <div className={'button' + (isSumNumbersActive(9) ? ' active' : '')}
           onClick={e => toggleSumNumbers(9)}>9
      </div>
    </div>
    <button onClick={finish}>🚀 Und los!</button>
  </div>);
}
