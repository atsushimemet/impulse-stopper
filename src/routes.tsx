import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { AddExpense } from "./components/AddExpense";
import { Timer } from "./components/Timer";
import { Stats } from "./components/Stats";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/add",
    Component: AddExpense,
  },
  {
    path: "/timer",
    Component: Timer,
  },
  {
    path: "/stats",
    Component: Stats,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);
