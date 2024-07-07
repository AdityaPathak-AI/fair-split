import { Navigate, Route, Routes } from "react-router-dom";
import AuthMaster from "./layout/AuthMaster";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeLayout from "./layout/HomeLayout";
import Expense from "./pages/Expense";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "./actions/ authActions";
import ViewProfile from "./pages/ViewProfile";
import NotFound from "./pages/NotFound";
import { getCookie } from "./utils/refreshToken";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const refreshToken = getCookie("refreshToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (refreshToken) {
          await dispatch(getUser());
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, refreshToken]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="auth" element={<AuthMaster />}>
          <Route element={<Login />} index />
          <Route element={<Register />} path="register" />
        </Route>
        <Route
          path="/"
          element={isAuthenticated ? <HomeLayout /> : <Navigate to="/auth" />}
        >
          <Route path="group-expense/:id" element={<Expense />} />
        </Route>
        <Route
          path="/view-profile"
          element={isAuthenticated ? <ViewProfile /> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
