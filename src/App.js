import React, { Component } from 'react';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json';
import Web3 from 'web3';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      account: '0x2191ef87e392377ec08e7c08eb105ef5448eced5',
      balance: 0,
      eth: null,
      web3: null,
      simpleStorage: null,
    };
  }

  componentDidMount() {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
    const eth = web3.eth;

    const deployedSimpleStorage = new web3.eth.Contract(SimpleStorageContract.abi, SimpleStorageContract.networks['4447'].address, {
      gasPrice: '1',
      gas: 100000
    });

    this.setState({
      web3,
      eth,
      simpleStorage: deployedSimpleStorage,
    }, () => {
      this.getStorageValue();
      this.getAccountBalance()
    });
  }

  getStorageValue = () => {
    this.state.simpleStorage.methods.get().call()
      .then((storageValue) => {
        this.setState({ storageValue });
      });
  };

  getAccountBalance = () => {
    const { eth, account } = this.state;

    eth.getBalance(account).then((balance) => {
      this.setState({ balance });
    });
  };

  onGenerate = () => {
    const { simpleStorage, account } = this.state;
    const n = ~~(Math.random() * 1000);

    simpleStorage.methods.set(n)
      .send({ from: account }, (error, transactionAddress) => {
        console.log(error, transactionAddress);

        this.updateActualState();
      })
  };

  updateActualState = () => {
    this.getAccountBalance();
    this.getStorageValue();
  };

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by
                default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The current account is: { this.state.account }</p>
              <p>The stored value is: { this.state.storageValue }</p>
              <p>Balance: { this.state.balance }</p>
              <button className="generateNew" onClick={ this.onGenerate }>Generate</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
