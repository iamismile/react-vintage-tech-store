import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

// strapi function
import loginUser from '../strapi/loginUser';
import registerUser from '../strapi/registerUser';

// handle user
import { UserContext } from '../context/user';

function Login() {
  const history = useHistory();
  const { userLogin, alert, showAlert } = useContext(UserContext);

  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('default');
  const [isMember, setIsMember] = useState(true);

  let isEmpty = !email || !password || !username || alert.show;

  const toggleMember = () => {
    setIsMember((prevMember) => {
      let isMember = !prevMember;
      isMember ? setUsername('default') : setUsername('');
      return isMember;
    });
  };

  const handleSubmit = async (e) => {
    showAlert({
      msg: 'Accessing user data. Please wait...',
    });
    e.preventDefault();
    let response;
    if (isMember) {
      response = await loginUser({ email, password });
    } else {
      response = await registerUser({ email, password, username });
    }

    if (response) {
      const {
        jwt: token,
        user: { username },
      } = response.data;

      const newUser = { username, token };
      userLogin(newUser);
      showAlert({
        msg: `you are logged in: ${username}. shop away my friend.`,
      });
      history.push('/products');
    } else {
      // show alert
      showAlert({
        msg: 'there was an error. please try again...',
        type: 'danger',
      });
    }
  };

  return (
    <section className="form section">
      <h2 className="section-title">{isMember ? 'Sign in' : 'Register'}</h2>
      <form className="login-form">
        <div className="form-control">
          <label htmlFor="email">email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isMember && (
          <div className="form-control">
            <label htmlFor="username">username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        {isEmpty && (
          <p className="form-empty">please fill out all form fields</p>
        )}
        {!isEmpty && (
          <button
            type="submit"
            className="btn btn-block btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
        <p className="register-link">
          {isMember ? 'need to register' : 'already a member'}
          <button type="button" onClick={toggleMember}>
            click here
          </button>
        </p>
      </form>
    </section>
  );
}

export default Login;
