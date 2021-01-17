import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { AuthProvider } from "../contexts/AuthContext";
import { StoreProvider } from "../contexts/StoreContext";
import { CloudProvider } from "../contexts/CloudContext";
import Container from "@material-ui/core/Container";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Navbar from "./Navbar";
import Admin from "./Admin";

import { styled } from "@material-ui/core/styles";

const PageWrapper = styled(Container)({
  paddingTop: "2rem",
});

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <StoreProvider>
          <CloudProvider>
            <Router>
              <Navbar />
              <PageWrapper>
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <PrivateRoute path="/admin" component={Admin} />

                  {/* <PrivateRoute path="/update-profile" component={UpdateProfile} /> */}
                  <Route path="/signup" component={Signup} />
                  <Route path="/login" component={Login} />
                  {/* <Route path="/forgot-password" component={ForgotPassword} /> */}
                </Switch>
              </PageWrapper>
            </Router>
          </CloudProvider>
        </StoreProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
