//connect to a local ganache instance
const web3 = new Web3("http://localhost:7545");
// web3.eth.getAccounts().then((result) => {
//   console.log(result);
// });
document.getElementById("connect").addEventListener("click", connectMetamask);
// document.getElementById("getCharities").addEventListener("click", getCharities);
document.getElementById("addCharity").addEventListener("click", createCharity);

let charityname = document.getElementById("charityname");
let charitydesc = document.getElementById("charitydescription");
let charityList = document.getElementById("charityList");

function getCharityTemplate(name, description, id) {
  return `<div class="card col-3 mx-2 my-2">
    <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${description}</p>
            <button class="btn btn-primary" onclick="donateToCharity(this)" data-charityid="${id}">Donate 1 ether</button>
    </div>
</div>`;
}
let address;
init();


async function connectMetamask() {
  //check metamask is installed
  if (window.ethereum) {
    // instantiate Web3 with the injected provider

    //request user to connect accounts (Metamask will prompt)
    // await window.ethereum.request({ method: "eth_requestAccounts" });

    // //get the connected accounts
    // const accounts = await web3.eth.getAccounts();
    let account = await window.ethereum.enable();

    //show the first connected account in the react page
    document.getElementById("account").innerText = account;
    address = account[0];
    getCharities();
  } else {
    alert("Please download metamask");
  }
}

let charities;

async function init() {
  await connectMetamask();
  await getCharities();
}

async function getCharities() {
  // get the deployed contract
  const json = await fetch("MyContract.json");
  const charityJson = await json.json();
  if(address){
      console.log(charityJson.networks['5777']);
      const contract = new web3.eth.Contract(charityJson.abi, charityJson.networks['5777'].address);
      const charity_count = parseInt(await contract.methods.charity_count().call());
      const rawcharities = await contract.methods.getCharities().call();
      charities = rawcharities.map((charity, index) => {
          return {
              name: charity.name,
              description: charity.description,
              id: charity.id,
              owner: charity.owner.toLowerCase()
          }
      });
      charityList.innerHTML = "";
      charities.forEach((charity) => {
        if(charity.owner != address.toLowerCase()){

          charityList.innerHTML += getCharityTemplate(charity.name, charity.description, charity.id);
        }
      });
  }else{
      alert("Please connect to metamask");
  }
}

//create charity
async function createCharity() {
  //get the deployed contract
  const json = await fetch("MyContract.json");
  const charityJson = await json.json();
  if (address) {
    // console.log(charityJson.networks['5777']);
    const contract = new web3.eth.Contract(
      charityJson.abi,
      charityJson.networks["5777"].address
    );
    const temp = await contract.methods
      .createCharity(charityname.value, charitydesc.value)
      .send({
        from: address,
        gas: 1000000,
        value: web3.utils.toWei("0.1", "ether"),
      });
    console.log(temp);
    getCharities();
  } else {
    alert("Please connect to metamask");
  }
}

async function donateToCharity(btn) {
  const json = await fetch("MyContract.json");
  const charityJson = await json.json();
  if (address) {
    const contract = new web3.eth.Contract(
      charityJson.abi,
      charityJson.networks["5777"].address
    );
    const charityId = btn.getAttribute("data-charityid");
    console.log(charityId);
    const temp = await contract.methods.donate(charityId).send({
      from: address,
      gas: 1000000,
      value: web3.utils.toWei("1", "ether"),
    });
    console.log(temp);
  } else {
    alert("Please connect to metamask");
  }
}

// add listener to btn

