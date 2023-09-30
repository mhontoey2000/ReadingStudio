import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import axios from "axios";
import Home from "./home";
import Login from "./login";
import Register from "./register";
import Bookdetail from "./bookdetail";
import Bookarticle from "./bookarticle";
import Exampage from "./exampage";
import Profile from "./profile";
import One from "./one";
import Allbookadmin from "./admin/allbookadmin";
import Typebook from "./typebook";
import Addbook from "./addbook";
import Adminpage from "./admin/adminpage";
import Allexamadmin from "./admin/allexamadmin";
import Alluseradmin from "./admin/alluseradmin";
import Reportbook from "./reportbook";
import Addexam from "./addexam";
import Notification from "./admin/notification";
import LoadingIndicator from "./LoadingIndicator";
import Addvocab from "./addvocab";
import Addarticle from "./addarticle";
import Editbook from "./admin/editbook";
import Editarticle from "./admin/editarticle";
import Editexam from "./admin/editexam";
import Allarticleadmin from "./admin/allarticleadmin";
import { useEffect, useState } from "react";

const App = () => {
  const user_data = localStorage.getItem("access_token");
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize to null

  useEffect(() => {
    // Show loading indicator while the request is in progress
    setIsAuthenticated(null);

    if (user_data) {
      axios
        .get("http://localhost:5004/api/token_check", {
          headers: {
            Authorization: `${user_data}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("Token is valid");
            setIsAuthenticated(true); // Set to true if the token is valid
          } else {
            console.log("Token is invalid");
            setIsAuthenticated(false); // Set to false if the token is invalid
          }
        })
        .catch((error) => {
          console.log("Error:", error);
          setIsAuthenticated(false); // Set to false if there's an error
        });
    } else {
      setIsAuthenticated(false); // Set to false if there's no token
    }
  }, [user_data]);
  console.log(isAuthenticated);
  if (isAuthenticated === null) {
    // Show loading indicator or splash screen
    return <LoadingIndicator />;
  }

  return (
    <Router>
      <Switch>
        <Route
          path="/Page/login"
          render={() =>
            isAuthenticated ? <Redirect to="/Page/home" /> : <Login />
          }
        />
        <Route
          path="/Page/register"
          render={() =>
            isAuthenticated ? <Redirect to="/Page/home" /> : <Register />
          }
        />
        <Route
          path="/Page/home"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Home />
          }
        />
        <Route path="/Page/one" render={() => <One />} />
        <Route
          path="/Page/bookdetail"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Bookdetail />
          }
        />
        <Route
          path="/Page/bookarticle"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Bookarticle />
          }
        />
        <Route
          path="/Page/exampage"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Exampage />
          }
        />
        <Route
          path="/Page/profile"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Profile />
          }
        />
        <Route
          path="/Page/allbookadmin"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Allbookadmin />
          }
        />
        <Route
          path="/Page/alluseradmin"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Alluseradmin />
          }
        />
        <Route
          path="/Page/typebook"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Typebook />
          }
        />
        <Route
          path="/Page/addbook"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Addbook />
          }
        />
        <Route
          path="/Page/addarticle"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Addarticle />
          }
        />
        <Route
          path="/Page/addvocab"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Addvocab />
          }
        />
        <Route
          path="/Page/addexam"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Addexam />
          }
        />
        <Route
          path="/Page/reportbook"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Reportbook />
          }
        />
        <Route
          path="/Page/adminpage"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Adminpage />
          }
        />
        <Route
          path="/Page/allexamadmin"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Allexamadmin />
          }
        />
        <Route
          path="/Page/notification"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Notification />
          }
        />
        <Route
          path="/Page/editbook"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Editbook />
          }
        />
        <Route
          path="/Page/editarticle"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Editarticle />
          }
        />
        <Route
          path="/Page/editexam"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Editexam />
          }
        />
        <Route
          path="/Page/allarticleadmin"
          render={() =>
            !isAuthenticated ? <Redirect to="/Page/one" /> : <Allarticleadmin />
          }
        />

        <Redirect to="/Page/one" />

      </Switch>
    </Router>
  );
};

export default App;