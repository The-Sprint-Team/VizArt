import { useRef } from "react";
import Canvas, { Ref as CanvasRef } from "./Canvas";
import "./App.css";

function App() {
  const ref = useRef<CanvasRef>(null);
  const start = () => ref.current?.start();
  const stop = () => ref.current?.stop();
  const pause = () => ref.current?.pause();
  const onRecordEnd = (b: Blob) => console.log(b);

  return (
    <div className="App">
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={pause}>Pause</button>
      <Canvas width={1280} height={720} {...{ ref, onRecordEnd }} />
    </div>
  );
}

export default App;
