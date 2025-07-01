import { Route, Routes } from "react-router";
import TestPage from "./test/TestPage";
import LoginPage from "./Page/Auth/LoginPage";
import NotFoundPage from "./Page/NotFoundPage";
import SignUpPage from "./Page/Auth/SignUpPage";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./Page/Home/HomePage";
import ProtectLayout from "./components/layout/ProtectLayout";
import ProfileSettings from "./Page/User/ProfileSettings";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectLayout />}>
          <Route path="/user/setting" element={<ProfileSettings />} />
        </Route>
      </Route>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
