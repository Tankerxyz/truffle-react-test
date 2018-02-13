import React, { Component } from 'react';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json';
import Eth from 'ethjs';

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
    };
  }

  componentDidMount() {
    const { account } = this.state;
    const eth = new Eth(new Eth.HttpProvider('http://127.0.0.1:9545'));

    const SimpleStore = eth.contract(SimpleStorageContract.abi, SimpleStorageContract.bytecode, {
      from: account,
      gas: 300000,
    });

    // setup an instance of that contract
    const simpleStore = SimpleStore.at(SimpleStorageContract.networks["4447"].address);

    this.setState({
      account,
      simpleStore,
      eth
    }, () => {
      this.getStoreValue();
    });
  }

  getStoreValue = () => {
    this.state.simpleStore.get()
      .then((res) => {
        this.setState({
          storageValue: res[0].toNumber(),
        });

        this.getAccountBalance()
      });
  };

  getAccountBalance = () => {
    const { eth, account } = this.state;

    eth.getBalance(account).then(res => {
      this.setState({
        balance: res.toString(),
      })
    });
  };

  onGenerate = () => {
    const { simpleStore } = this.state;

    simpleStore.set(~~(Math.random() * 1000))
      .then(() => this.getStoreValue())
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
