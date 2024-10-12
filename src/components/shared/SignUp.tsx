import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { signUpThunk } from "../../features/login/authSlice";
import type { AppDispatch, RootState } from "../../store";

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
  Alert,
} from "reactstrap";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleSubmit } = useForm();

  const dispatch = useDispatch<AppDispatch>();

  const userState = useSelector((state: RootState) => state.auth);
  // console.log("user state : ", userState);
  const [showSuccess, setShowSuccess] = useState(false); // For success alert

  const handleSignUp = async () => {
    dispatch(
      signUpThunk({
        username: email,
        password: password,
      })
    );
  };

  useEffect(() => {
    if (userState.status === 200) {
      console.error("success adding user:");
      setShowSuccess(true); // Show the success alert
      setEmail("");
      setPassword("");
      // delay to fade the suucess alert
      setTimeout(() => {
        setShowSuccess(false); // Hide the success alert
      }, 2000);
    }
    
  }, [userState.status]);


  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bell me-2"> </i>
            Register as a New User
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit(handleSignUp)}>
              <FormGroup>
                <Label for="email">Email Address</Label>
                <Input
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  required
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>

              <Button className="btn" color="primary" type="submit">
                Sign Up
              </Button>

              {userState?.error?.status && (
                <Alert color="danger">{userState.error?.message}</Alert>
              )}
              {showSuccess && (
              <Alert color="success">You are registered succesfully! Please sign in to continue</Alert>
            )}
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
