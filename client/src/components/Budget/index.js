import React, { useState, useEffect } from "react"
import transaction from "../../utils/transaction"
import { Link } from "react-router-dom";
import { TransactionList, ListItem } from "../../components/TransactionList";
import { Input, TextArea, FormBtn } from "../../components/TransactionForm";
import TransactionDeleteBtn from "../../components/TransactionDeleteBtn";
import "../Budget/index.css"

function Budget() {
  // Setting our component's initial state
  const [transactions, setTransactions] = useState([])
  const [formObject, setFormObject] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)

  // Load all transactions and store them with setBooks
  useEffect(() => {
    loadTransactions()
  }, [])

  // Loads all transactions and sets them to transactions
  function loadTransactions() {
    transaction.getTransactions()
      .then(res => {
        let total = 0;
        console.log("TEST" + res.data);
        res.data.forEach(item => {
          total += parseInt(item.price)
        })
        console.log(total)
        setTotalPrice(total)

        setTransactions(res.data)
      }

      )
      .catch(err => console.log(err));
  };

  // Deletes a transaction from the database with a given id, then reloads transactions from the db
  function deleteTransaction(id) {
    transaction.deleteTransaction(id)
      .then(res => loadTransactions())
      .catch(err => console.log(err));
  }

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({ ...formObject, [name]: value })
  };

  // When the form is submitted, use the API.saveBook method to save the transaction data
  // Then reload transactions from the database
  function handleFormSubmit(event) {
    event.preventDefault();
    if (formObject.name && formObject.location) {
      transaction.saveTransaction({
        name: formObject.name,
        location: formObject.location,
        price: formObject.price
      })
        .then(res => loadTransactions())
        .catch(err => console.log(err));
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-lg-5">
          <h4 />
            <h3>What Should I do on Vacation?</h3>
          
          <form>
            <Input
              onChange={handleInputChange}
              name="name"
              placeholder="Name"
            />
            <Input
              onChange={handleInputChange}
              name="location"
              placeholder="Location"
            />
            <Input
              onChange={handleInputChange}
              name="price"
              placeholder="Price"
            />
            <FormBtn
              disabled={!(formObject.name && formObject.location)}
              onClick={handleFormSubmit}
            >
              Submit
              </FormBtn>
          </form>
        </div>
        <div className="col-lg-5">
        <h4 />
            <h3>Things I Have Planned</h3>
          
          {transactions.length ? (
            <TransactionList>
              {transactions.map(transaction => (
                <ListItem key={transaction._id}>
                  <Link to={"/transaction/" + transaction._id}>
                    <strong>
                      {transaction.name} in {transaction.location} for {transaction.price}
                    </strong>

                  </Link>
                  <TransactionDeleteBtn onClick={() => deleteTransaction(transaction._id)} />
                </ListItem>
              ))}
            </TransactionList>
          ) : (
              <h5>Nothing Planned Yet...</h5>
            )}
        </div>
        <div className="col-lg-2">
        <h4 />
          <h3>Total Cost </h3>
            
            <p> Total Cost: ${totalPrice} </p>
        </div>
        
      </div>
    </div>
  );
}

export default Budget