import React, {useRef, useState} from 'react';

export default function Numpad({onClick} = []) {

  return <div className="Numpad">
    <div className="button" onClick={e => onClick(1)}>1</div>
    <div className="button"  onClick={e => onClick(2)}>2</div>
    <div className="button"  onClick={e => onClick(3)}>3</div>
    <div className="button"  onClick={e => onClick(4)}>4</div>
    <div className="button"  onClick={e => onClick(5)}>5</div>
    <div className="button"  onClick={e => onClick(6)}>6</div>
    <div className="button"  onClick={e => onClick(7)}>7</div>
    <div className="button"  onClick={e => onClick(8)}>8</div>
    <div className="button"  onClick={e => onClick(9)}>9</div>
    <div className="button"  onClick={e => onClick(0)}>0</div>
  </div>
}
