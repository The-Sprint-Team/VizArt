import Layout from "./components/Layout/Layout";

import Create from "./routes/Create/Create";
import Compete from "./routes/Compete/Compete";
import Explore from "./routes/Explore/Explore";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

function App() {
  return (
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
