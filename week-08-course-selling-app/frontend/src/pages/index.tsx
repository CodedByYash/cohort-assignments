import { useNavigate } from "react-router";

const navigate = useNavigate();

const LandingPage = () => {
  return (
    <>
      <div>Welcome to the Course Selling website</div>
      <p>You will get courses at a good and affordable cost</p>
      <button onClick={() => navigate("/signup")}>SignUp</button>
      <button onClick={() => navigate("/signin")}>Login</button>
    </>
  );
};

export default LandingPage;
