import "./styles.css";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [size, setSize] = useState(3);
  const [numbers, setNumbers] = useState([]);
  const [isHidden, setIsHidden] = useState([]);
  const prevSelected = useRef(null);
  useEffect(() => {
    handleSizeChange(size);
  }, [size]);

  useEffect(() => {
    setIsHidden(Array.from({ length: numbers.length }).fill(true));
  }, [numbers]);

  function handleSizeChange(size) {
    let n = size % 2 === 0 ? size * size : size * size - 1;
    setNumbers(generateRandomArray(n));
    prevSelected.current = null;
  }

  function handleInputChange(val) {
    if (val <= 2) setSize(2);
    else setSize(val);
  }

  function generateRandomArray(n) {
    const arr = [...Array(n / 2).keys()]
      .map((x) => x + 1)
      .flatMap((x) => [x, x]);
    return arr.sort(() => Math.random() - 0.5);
  }

  function handleElementClick(index) {
    let newHiddenArr = [...isHidden];
    newHiddenArr[index] = false;
    setIsHidden(newHiddenArr);
  }

  function handleMatching(index) {
    if (prevSelected.current === null) {
      prevSelected.current = index;
    } else {
      if (numbers[prevSelected.current] === numbers[index]) {
        prevSelected.current = null;
        return;
      } else {
        setTimeout(() => {
          let newHiddenArr = [...isHidden];
          newHiddenArr[prevSelected.current] = true;
          prevSelected.current = null;
          newHiddenArr[index] = true;
          setIsHidden(newHiddenArr);
        }, 1000);
      }
    }
  }

  return (
    <div className="container">
      <h1>Memory Game</h1>
      <div className="input-container">
        <span>Grid Size:</span>
        <input
          type="number"
          name="size"
          id="size"
          width={4}
          value={size}
          onChange={(e) => handleInputChange(parseInt(e.target.value))}
        />
      </div>
      <div className="grid" style={{ "--grid-size": size }}>
        {Array.from({
          length: size % 2 === 0 ? size * size : size * size - 1,
        }).map((_, index) => (
          <div
            key={index}
            className={`gridElement ${isHidden[index] ? "hidden" : "active"}`}
            onClick={() => {
              handleElementClick(index);
              handleMatching(index);
            }}
          >
            {isHidden[index] ? "" : numbers[index]}
          </div>
        ))}
      </div>
      <button onClick={() => handleSizeChange(size)}>Reset</button>
    </div>
  );
}
