import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PdaEscrow } from "../target/types/pda_escrow";

describe("pda_escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PdaEscrow as Program<PdaEscrow>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
