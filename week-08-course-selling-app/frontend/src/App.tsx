import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import SignUp from "./pages/signup";
import LandingPage from "./pages";
import SignIn from "./pages/signIn";
import Dashboard from "./pages/dashboard";
import Course from "./pages/course";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingPage />} />
        <Route element={<SignUp />} />
        <Route element={<SignIn />} />
        <Route element={<Dashboard />} />
        <Route element={<Course />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
