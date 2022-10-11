import xrpl from "xrpl";
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

const secret = "sn5vRZ5MpQgHWPdNhxhWEiNLYrNNu"; //rf71VdYQwx4oQtZ8ptd1YhwWTbjs52CdiD
//const master = xrpl.get(secret);

const master = xrpl.Wallet.fromSeed(secret);

//1st signer address : secret1 : ss6UbZmnARb7p8wiqkxt926XRQ2ym (activated account on ledger) //rNpZStFd3gafwjxboS7DvreUTHjTsCSp1E
const secret1 = "ss6UbZmnARb7p8wiqkxt926XRQ2ym";
//const account1 = xrpl.familySeed(secret1);

const account1 = xrpl.Wallet.fromSeed(secret1);

//2nd signer address : secret2 : shN6xsajpixgrPgje4TsqMPCgNWRW (activated account on ledger) //rUtpE32eFRw6sjMu7nUciizenisTUPoNhv
const secret2 = "shN6xsajpixgrPgje4TsqMPCgNWRW";
//const account2 = xrpl.familySeed(secret2);
const account2 = xrpl.Wallet.fromSeed(secret2);

//3rd signer address : secret3 : ssbiDBU7rWk2u6ZG8jmT2VyMM7rGF : mathematical address(not activated account on ledger) //rHYiLBMquAgymTsezcKrCPK9Zhra6HV1VQ
const secret3 = "ssbiDBU7rWk2u6ZG8jmT2VyMM7rGF";
//const account3 = xrpl.familySeed(secret3);
const account3 = xrpl.Wallet.fromSeed(secret3);

//destination : secret : shrDBMMTesiYi5nFEa4D3fxJdxRYH
const destination = "rERQxhyT8i7ZfVV3qKyDHWQmFb2LK37B2w";

const main = async () => {
  const account_data = await client.request({
    command: "account_info",
    account: master.address,
    ledger_index: "validated",
  });
  // console.log(account_data);

  //setting signer list

  // const payload = await client.autofill({
  //   TransactionType: "SignerListSet",
  //   Account: master.address,
  //   Fee: "10", // always get the fee information from ledger directly
  //   Sequence: account_data.result.account_data.Sequence,
  //   SignerQuorum: 3,
  //   SignerEntries: [
  //     {
  //       SignerEntry: {
  //         Account: account1.classicAddress,
  //         SignerWeight: 2,
  //       },
  //     },
  //     {
  //       SignerEntry: {
  //         Account: account2.classicAddress,
  //         SignerWeight: 1,
  //       },
  //     },
  //     {
  //       SignerEntry: {
  //         Account: account3.classicAddress,
  //         SignerWeight: 1,
  //       },
  //     },
  //   ],
  // });

  // multi signed payment transaction

  const payload = await client.autofill({
    TransactionType: "Payment",
    Account: master.address,
    Destination: destination,
    Amount: "1000000", //1XRP
    Fee: String((2 + 1) * 20),
    Sequence: account_data.result.account_data.Sequence,
  });

  const wallet = xrpl.Wallet.fromSeed(secret);
  console.log("wallet", account1, account2);
  const signed = wallet.sign(payload);
  console.log("result", signed);
  const tx = await client.submitAndWait(signed.tx_blob);
  console.log("result", JSON.stringify(tx, null, "\t"));

  client.disconnect();
};
main();
