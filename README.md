# Listen-Mint-Transfer-SOLNft
This project allows you to listen to a TRANSFER event of a specific address on Solana so you can mint and send NFT to that address.

Helius.xyz
1) Register a webhook on Helius https://dev.helius.xyz/webhooks/. The webhook should contain your js REST API end point. In our case it's https://expressjs-todos-backend-server.matiman.repl.co/transfer-webhook
2) Chose TRANSFER event, and include the account address (pubkey) you want to listen to.
3) Generate an API key to be used with your app.

Underdogprotocol.com
1) Register on Underdog and generate an API key.
2) Generate API Key
3) Also have a mint account address (that you may own) in order to be used with Underdog. This is yours.

Lastly make sure to install all the required js libraries in your project. 
   
