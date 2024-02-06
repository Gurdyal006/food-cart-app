import { useContext } from "react";
import Modal from "../UI/Modal";
import CartContext from "../store/CartContext";
import Input from "../UI/Input";
import UserProgressContext from "../store/UserProgressContext";
import Button from "../UI/Button";
import useHttpCustom from "../hooks/useHttpCustom";
import Error from "./Error";

const configRequest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    sendRequest,
    error,
    clearData,
  } = useHttpCustom("http://localhost:4000/orders", configRequest);

  const cartTotal = cartCtx.items.reduce(
    (totalprice, item) => totalprice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData(e.target);
    const customerData = Object.fromEntries(fd.entries()); // {name: 'Test', age: 20}

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );

    // fetch("http://localhost:3000/orders", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     order: {
    //       items: cartCtx.items,
    //       customer: customerData,
    //     },
    //   }),
    // });
  }

  let ButtonActions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    ButtonActions = <span>Sending Order data.....</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose} open={userProgressCtx.progress === "checkout"}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {cartTotal}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {/* Error show */}
        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">
          {ButtonActions}
          {/* <Button type="button" textOnly onClick={handleClose}>
            Close
          </Button>
          <Button>Submit Order</Button> */}
        </p>
      </form>
    </Modal>
  );
}
