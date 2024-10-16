import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from "reactstrap";

import { signInThunk } from "../../features/login/authSlice";
import type { AppDispatch, RootState } from "../../store";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleSubmit } = useForm();

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const authError = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    // Navigate after successful login, only when user is set and not null
    if (user.username !== null) {
      navigate("/books");
    }
  }, [user, navigate]);
  /* if (user?.role == "ADMIN") {
    // navigate('/adminDashboard')
    navigate("/addBook");
  } else {
    navigate("/");
  } */

  const handleSignIn = async () => {
    // console.log("Entered handle sign in");
    dispatch(
      signInThunk({
        username: email,
        password: password,
      })
    );
  };

  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bell me-2"> </i>
            Sign In
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit(handleSignIn)}>
              <FormGroup>
                <Label for="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  type="text"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
              <div className="button-group">
                <Button className="btn" color="primary" type="submit">
                  Sign In
                </Button>
                {authError ? <Alert color="danger">{authError.message}</Alert> : ""}
                <Link to="/signup">
                  <Button className="btn" color="primary" type="button">
                    {"Don't have an account? Sign Up"}
                  </Button>
                </Link>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
