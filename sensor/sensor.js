var Web3 = require('web3');
// Interaction with GPIO
var Gpio = require('onoff').Gpio

// defaults (if no command line parameter provided)
var ethNode = 'http://192.168.1.76:8545'
var secrKey = "c464c006c8ecfff00da7d20003fccf39bed9c6d0178fdd3d90928255f77b9468";
var contr_addr = "0x77e5045e57c55acb45c57e7d24a7e98856a68964";

var gasPrice = '20000000000'; // default gas price in wei, 20 gwei in this case
var gas = '3000000';

if (process.argv.slice(2).length) {ethNode = process.argv.slice(2)[0]};
if (process.argv.slice(3).length) {secrKey = process.argv.slice(3)[0]};
if (process.argv.slice(4).length) {contr_addr = process.argv.slice(4)[0]};
if (process.argv.slice(5).length) {gasPrice = process.argv.slice(5)[0]};
if (process.argv.slice(6).length) {gas = process.argv.slice(6)[0]};

var abi_file = "abi.json";

var measurement = 0;

// components connected to the RPi
var greenLed = new Gpio(14, 'out')
// var redLed = new Gpio(15, 'out')
var button = new Gpio(18, 'in', 'rising')

web3 = new Web3(new Web3.providers.HttpProvider(ethNode)); 

web3.eth.accounts.wallet.add('0x'+secrKey);
var sens_addr = web3.eth.accounts.wallet[0].address;

var fs = require('fs');
 
var abi = fs.readFileSync(abi_file, 'utf8');
// console.log(abi);

var Contract = new web3.eth.Contract(JSON.parse(abi), contr_addr, {from: sens_addr, gasPrice: gasPrice});

Contract.methods.current_measurement().call().then(result => {measurement = result});

function checkState() {
    Contract.methods.status_lease().call().then(result => {
        var i = result ? 1 : 0;
        greenLed.writeSync(i);
        console.log(i)
    });
  console.log('checkState');
}

function update_mesurement(newM) {
    Contract.methods.update_mesurement(newM).send({gas: '3000000'}).on('transactionHash', function(hash){
        console.log('hash');
        console.log(hash);
    }).on('receipt', function(receipt){
        console.log('receipt');
        console.log(receipt);
    }).on('error', console.error);
}

// checkTimeout = setTimeout(checkState, 3000);
checkIntervalId = setInterval(checkState, 3000);
// clearInterval(checkIntervalId);

// watch event on the button
button.watch(function (err, value) {
    if (err) {
        throw err
    }

    measurement++;
    update_mesurement(measurement);
})
