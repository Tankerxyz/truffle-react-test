import React, { Component } from 'react';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json';
import Eth from 'ethjs';
import EthContract from 'ethjs-contract';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
    };
  }

  componentDidMount() {

    console.log('Eth: ', Eth);
    const eth = new Eth(new Eth.HttpProvider('http://127.0.0.1:9545'));
    const contract = EthContract(eth);
    console.log('eth: ', eth, contract);

    const etherValue = Eth.toWei(72, 'ether');

    console.log('etherValue: ', etherValue);

    const account = "0xf17f52151ebef6c7334fad080c5704d77216b732";

    const SimpleStore = eth.contract(SimpleStorageContract.abi, SimpleStorageContract.bytecode, {
      from: account,
      gas: 300000,
    });
    //
    console.log(SimpleStore);

    // setup an instance of that contract
    const simpleStore = SimpleStore.at('0x82d50ad3c1091866e258fd0f1a7cc9674609d254');

    this.setState({
      account,
      simpleStore,
    });
    simpleStore.get().then((res) => {
      this.setState({
          storageValue: res[0].toNumber(),
      })
    });
  }

  onGenerate = () => {
    const { simpleStore } = this.state;

    simpleStore.set(~~(Math.random() * 1000))
      .then(() => simpleStore.get())
      .then((res) => {
        this.setState({
          storageValue: res[0].toNumber(),
        })
      })
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
              <p>The stored value is: { this.state.storageValue }</p>
              <button className="generateNew" onClick={this.onGenerate}>Generate</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
