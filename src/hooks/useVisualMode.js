import {useState} from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(prev => [...prev])
      history.pop();
      history.push(newMode);
      setMode(newMode);
    } else {
      setMode(newMode);
      setHistory(prev => [...prev, newMode])
    };

  };

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2])
      history.pop();
    }
  };
  
  return { mode, transition, back };
}
