import { useRef } from "react";
import Canvas, { Ref as CanvasRef } from "./Canvas";
import "./App.css";
import api from "./api";
import Layout from "./components/Layout/Layout";

import Create from "./routes/Create/Create";
import Compete from "./routes/Compete/Compete";
import Explore from "./routes/Explore/Explore";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

function App() {
  const ref = useRef<CanvasRef>(null);
  const start = () => ref.current?.start();
  const stop = () => ref.current?.stop();
  const pause = () => ref.current?.pause();
  const onRecordEnd = (b: Blob) => {
    api.uploadFile("DEFAULT NAME", b).then(console.log).catch(console.error);
  };

  return (
    <div className="App">
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={pause}>Pause</button>
      <Canvas width={1280} height={720} {...{ ref, onRecordEnd }} />
    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="create" element={<Create />} />
          <Route path="compete" element={<Compete />} />
          <Route path="explore" element={<Explore />} />
          <Route path="" element={<Navigate to="/create" replace={true} />} />
        </Route>
        <Route path="*" element={<Navigate to="/create" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
