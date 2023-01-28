import Create from "./routes/Create/Create";
import Compete from "./routes/Compete/Compete";
import Explore from "./routes/Explore/Explore";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Create />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/compete",
    element: <Compete />,
  },
  {
    path: "/explore",
    element: <Explore />,
    // children: [
    //   {
    //     path: "events/:id",
    //     element: <Event />,
    //     loader: eventLoader,
    //   },
    // ],
  },
  { path: "*", element: <Navigate to="create" replace={true} /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
