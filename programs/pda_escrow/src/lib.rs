use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{CloseAccount, Mint, Token, TokenAccount, Transfer}};

declare_id!("G9BjoQUUVH12e6gfLbeTQNpeEzjYSASJ7qb7iqebD9Sn");

#[program]
pub mod pda_escrow {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.sender = ctx.accounts.sender.key().clone();
        state.amount = 1;
        state.mint = ctx.accounts.mint.key().clone();
        state.escrow = ctx.accounts.escrow_wallet.key().clone();

        let inner = vec![
            b"state".as_ref(),
        ];
        let outer = vec![inner.as_slice()];

        let transfer_instruction = Transfer{
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.escrow_wallet.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );

        anchor_spl::token::transfer(cpi_ctx, state.amount)?;

        Ok(())
    }
    pub fn transfer_nft(ctx: Context<TransferNFT>, state_bump:u8, _wallet_bump:u8) -> Result<()> {
        // let state = &mut ctx.accounts.state;
        let plate_bump = state_bump.to_le_bytes();
        let inner = vec![
            b"state".as_ref(),
            plate_bump.as_ref(),
        ];
        let outer = vec![inner.as_slice()];

        let transfer_instruction = Transfer{
            from: ctx.accounts.escrow_wallet.to_account_info(),
            to: ctx.accounts.from_token_account.to_account_info(),
            authority: ctx.accounts.state.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice(),
        );

        anchor_spl::token::transfer(cpi_ctx, ctx.accounts.state.amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = sender,
        space = 300,
        seeds=[
            b"state".as_ref()
            ],
        bump,
    )]
    state: Account<'info, State>,
    #[account(
        init, 
        payer = sender,
        seeds = [
            b"blablahuehuepda".as_ref(),
            ],
        token::mint = mint,
        token::authority = state, 
        bump)]
    escrow_wallet: Account<'info, TokenAccount>,
    #[account(mut)]
    sender: Signer<'info>,
    mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint=from_token_account.owner == sender.key(),
        constraint=from_token_account.mint == mint.key()
    )]
    from_token_account: Account<'info, TokenAccount>,
    /// CHECK xyz
    system_program: AccountInfo<'info>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
#[instruction(state_bump: u8, wallet_bump: u8)]
pub struct TransferNFT<'info> {
    #[account(mut, 
        seeds = [
            b"state".as_ref()
            ],
        bump = state_bump,
    )]
    state: Account<'info, State>,
    #[account(mut,
        seeds = [
            b"blablahuehuepda".as_ref(),
            ], 
        bump = wallet_bump)]
    escrow_wallet: Account<'info, TokenAccount>,
    #[account(mut)]
    sender: Signer<'info>,
    mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint=from_token_account.owner == sender.key(),
        constraint=from_token_account.mint == mint.key()
    )]
    from_token_account: Account<'info, TokenAccount>,
    /// CHECK xyz
    system_program: AccountInfo<'info>,
    token_program: Program<'info, Token>,
    // rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Default)]
pub struct State {
    sender: Pubkey,
    receiver: Pubkey,
    mint: Pubkey,
    escrow: Pubkey,
    amount: u64,
}