import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CartContext } from '../context/cart';
import { UserContext } from '../context/user';
import EmptyCart from '../components/Cart/EmptyCart';

import {
  CardElement,
  StripeProvider,
  Elements,
  injectStripe,
} from 'react-stripe-elements';
import submitOrder from '../strapi/submitOrder';

function Checkout(props) {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user, alert, showAlert, hideAlert } = useContext(UserContext);
  const history = useHistory();

  // states
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const isEmpty = !name || alert.show;

  const handleSubmit = async (e) => {
    showAlert({ msg: 'submitting order. please wait...' });
    e.preventDefault();
    const response = await props.stripe
      .createToken()
      .catch((error) => console.log(error));

    const { token } = response;
    if (token) {
      setError('');
      const { id } = token;
      let order = await submitOrder({
        name,
        total,
        items: cart,
        stripeTokenId: id,
        userToken: user.token,
      });

      if (order) {
        showAlert({ msg: 'your order is complete' });
        clearCart();
        history.push('/');
        return;
      } else {
        showAlert({
          msg: 'there was an error with your order. please try again!',
          type: 'danger',
        });
      }
    } else {
      hideAlert();
      setError(response.error.message);
    }
  };

  if (cart.length < 1) {
    return <EmptyCart />;
  }

  return (
    <section className="section form">
      <h2 className="section-title">Checkout</h2>
      <form className="checkout-form">
        <h3>
          order total: <span>${total}</span>
        </h3>
        {/* name element */}
        <div className="form-control">
          <label htmlFor="name">your name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        {/* end of name element */}
        {/* card element */}
        <div className="stripe-input">
          <label htmlFor="card-element">Credit or Debit Card</label>
          <p className="stripe-info">
            Test using this credit card: <span>4242 4242 4242 4242</span>
            <br />
            enter any 5 digits for the zip code
            <br />
            enter any 3 digits for CVC
          </p>
        </div>
        {/* end of card element */}
        {/* stripe element */}
        <CardElement className="card-element" />
        {/* end of stripe element */}
        {/* stipe errors */}
        {error && <p className="form-empty">{error}</p>}
        {/* empty value */}
        {isEmpty ? (
          <p className="form-empty">please fill out name field</p>
        ) : (
          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </form>
    </section>
  );
}

const CardForm = injectStripe(Checkout);

const StripeWrapper = () => {
  return (
    <StripeProvider apiKey="pk_test_gdYk4brAmtFBlYJXyFVLe43a00hlqT2rb3">
      <Elements>
        <CardForm />
      </Elements>
    </StripeProvider>
  );
};

export default StripeWrapper;
