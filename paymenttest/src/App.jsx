import { useState } from "react";
import "./App.css";
import Payment from "./Payment";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Payment/>
    </div>
  );
}

export default App;
