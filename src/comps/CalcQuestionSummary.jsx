import React from 'react';

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

export default function CalcQuestionSummary({calcList,onRestart}) {

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
    <h1>🧠 Spass mit Zahlen / Auswertung</h1>
    <strong>⭐️ Punkte:</strong> 100 von 100 <small><i>(tbd.)</i></small><br/>
    <strong>✅ Anzahl richtiger Lösungen:</strong> {rightAnswerCount} von {calcList.length}<br/>
    <strong>⏱️
      Geschwindigkeit</strong>: {parseFloat(parseInt(timingSummary / rightAnswerCount, 10) / 1000).toFixed(2)}s
    / Frage<br/>
    <br/>
    <button onClick={onRestart}>🚀 erneut spielen</button>
    <hr/>
    <h4>Tempotest-Auswertung</h4>
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
          <td>{!calc.isRight ? <b>{'Richtige Antwort: ' + (calc.rightAnswer)}</b> : ''}</td>
        </tr>)
      })}
      </tbody>
    </table>
  </div>)
}
