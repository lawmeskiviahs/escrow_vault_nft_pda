const anchor = require("@project-serum/anchor");
const web3 = require("@solana/web3.js");
const bs58 = require("@project-serum/anchor/dist/cjs/utils/bytes/bs58");
const BN = require("bn.js");
const spl = require("@solana/spl-token")

async function main() {

  const programId = new anchor.web3.PublicKey("G9BjoQUUVH12e6gfLbeTQNpeEzjYSASJ7qb7iqebD9Sn");

  const idl = JSON.parse(
    require("fs").readFileSync("../target/idl/pda_escrow.json", "utf8")
  );

  const creator = web3.Keypair.fromSecretKey(
    bs58.decode("Py2R2BgK9XVj5CVMUzwpgsX7c52fjDuwUojGdvVpZUdkDgMR5RbN6JnWsE68mkYLEUkAP13JJTcFGYDXh6Zm5zk")
  );

  // const connection = new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
  const connection = new web3.Connection("https://wild-cool-shadow.solana-devnet.quiknode.pro/3c47aa058a1cb75c8bc2b9fcc698e0afc8ece9de/","confirmed");
  let wallet = new anchor.Wallet(creator);
  let provider = new anchor.AnchorProvider(connection,wallet,anchor.AnchorProvider.defaultOptions());

  let program = new anchor.Program(
    idl,
    programId,
    provider,
  );

  const fromTokenAccount = new anchor.web3.PublicKey("8QhuyEzMW6fuPjVXSpVr2d4Uneq5D9HKe38wS5zeDLoB");
  const mint = new anchor.web3.PublicKey("J6PXH6vJZhS8SNzVqathiRCLPwmsetAYQHSqwgadofxJ");
  // // const toAccount = new anchor.web3.PublicKey("HAWuxhwmzqt1exoiHmhR2WmzE6N8HAsDvvSqfVRyvwD8");
  // const tokenProgram = new anchor.web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

    // const tx = await program.methods.transferLamports().accounts({
    //   fromAccount: wallet.publicKey,
    //   toAccount: toAccount,
    //   systemProgram: web3.systemProgram,
    // }).signers([]).rpc();

    const [statePubkey, stateBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("state")],
      programId
    );

    const [escrowPubkey, escrowBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("blablahuehuepda")],
      programId
    );

    // console.log(statePubkey.toBase58());
    console.log(escrowPubkey.toBase58());
    

    // const tx = await program.methods.transferNft(stateBump, escrowBump).accounts({
    //   state: statePubkey,
    //   escrowWallet: escrowPubkey,
    //   sender: creator.publicKey,
    //   mint: mint,
    //   fromTokenAccount: fromTokenAccount,
    //   systemProgram: anchor.web3.SystemProgram.programId,
    //   tokenProgram: spl.TOKEN_PROGRAM_ID,
    //   // rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    // }).signers([creator]).rpc();

    // console.log("system program id", web3.SystemProgram.programId.toBase58());
    // console.log("token program id", spl.TOKEN_PROGRAM_ID.toBase58());
    // console.log("rent pubkey", anchor.web3.SYSVAR_RENT_PUBKEY.toBase58());
    
    
    

    // const tx = await program.methods.transferNft(baseAccountPDABump).accounts({
    //   fromAccount: baseAccount,
    //   fromTokenAccount: toTokenAccount,
    //   toTokenAccount: fromTokenAccount,
    //   tokenProgram: tokenProgram,
    // }).signers([]).rpc();

}

main()