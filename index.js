
const express = require('express');
const bodyParser = require('body-parser');

const sdk = require('api')('@underdog/v2.0#b56qhmt17lnnslr0u');

sdk.auth('6d995013ad5cd2.de5e890d141e4f2eb028d35dd922e69a');// put back to ENV var.
sdk.server('https://devnet.underdogprotocol.com');

const app = express();
const port = 3000;

let nftId; //the id underground generates after minting NFT to be sent to the customer.
const customerAccount="FQWz9u4rjUtSm1FbjKm8rDbjoKjdWLcToKVcDmwHu7NL"; //the customer acct we listen to on Helius and where we send NFT
const heliusUrl = `https://mainnet.helius-rpc.com/?api-key=6e2a4999-9008-4a86-9ac0-47a0701d97af`;//replace API keys with yours

app.use(bodyParser.json());

app.post('/transfer-webhook', async (req, res) => {

  console.log("----************ Webhook info **************---");

  try {
    const payload = req.body;
    //Parsing Transfer object from Helius payload
    if (Array.isArray(payload) && payload.length > 0) {
      const transaction = payload[0];
      const instructions = transaction.instructions;
      const accountsData = instructions[2].accounts;
      console.log("account data _____________");
      console.log(accountsData);
      
      if (accountsData.includes(customerAccount)) {
        console.log(`The string '${customerAccount}' exists in accountsData.`);
        try {
          mintUndergroundNFT();
          res.status(200).send('Transaction parsed successfully.');
          
        } catch (error) {
           res.status(400).send('minting NFT failed...');
        }
      } else {
        console.log(`The string '${customerAccount}' does not exist in accountsData.`);
      }
    } else {
      res.status(400).send('Invalid payload format.');
    }
  } catch (error) {
    console.error('Error parsing the transaction:', error);
    res.status(500).send('Error parsing the transaction.');
  }

  console.log("----**************************---");
  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//This should be done using compressed NFT (cNFT) in the future
const mintUndergroundNFT = async () => {
  sdk
    .postV2ProjectsProjectidNfts({
      name: 'Christ NFT',
      symbol: 'ChrisNFT',
      image: 'www.yahoo.com/imagw', // Replace with the actual image URL.
      receiverAddress: '8DoEBo8UNi3MZbaneqD2UdDV7jbktwZVV9Hv8xoTt52r', // The mint address (yours acct not customer acct)
      delegated: true, // If this is not true, Underground won't be able to transfer NFTs so transferNFT will fail.
      description: 'Gaming NFT',
      upsert: true
    }, { projectId: '1' }) // Change ProjectId to your Underground project id
    .then(async ({ data }) => {
      console.log(data);
      nftId = data.nftId;
      /* Wait for 1 seconds since it takes sometime for the NFT to be minted and its status to be updated from pending to confirmed.
      This may not be a neat way(esp if network is congested and it takes > 1 second to recieve confirmation) 
      but can be replaced by another Helius webhook where we register the NFT id and customer address to be automatically 
      and listen to its status update, confirmed. Then call transferNFT method.
      */
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Call transferNFT after waiting
      transferNFT();
    })
    .catch(err => console.error(err));
};

const transferNFT = async () => {
  sdk
    .postV2ProjectsProjectidNftsNftidTransfer({
      receiverAddress: customerAccount
    }, { projectId: '1', nftId: nftId })
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));
};
