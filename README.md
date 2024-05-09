![cover_image](https://fstpay.vercel.app/img/cover.jpg)

## FastPay Overview

FastPay is Dapp that enable users create one-time or recurring payment links without sharing long wallet addresses. Payments go directly to their wallet address.

## Problem

Web3 users must share long wallet addresses to receive payments, posing typo risks and unintentional errors risking revene loss.

## Solution

FastPay lets users generate payment links using their wallet addresses, and receive USDT payments directly to their wallet. It's great for small businesses, donations, and community contributions. Its design makes blockchain interaction simple for users.

## Demo & Transaction

- [Live Dapp](https://fstpay.vercel.app)

- [Video Demo](https://youtu.be/aPA05ZTg8Ik)

- [Screenshots](https://drive.google.com/drive/folders/15uX-fBDJaNlSHdzhMhUeBEAKUCPq2LJT?usp=sharing)

- [Subgraph Query URL ](https://api.studio.thegraph.com/query/74190/fastpay/v1)

- [Payment Transaction on Demo Video (Base Sepolia)](https://base-sepolia.blockscout.com/tx/0x2f728dd8b6fcce32e03b3af74519ec0293bd0a75fa7fa9b4a2299843441078c9)
- [Another payment link transation (Base Sepolia)](https://base-sepolia.blockscout.com/tx/0xa093f8eae4e149d4f222676ea89bd2a4f0168178b86af21316837b649bccffce)

## Tech Stack

- **Backend**: NextJs API routes, The Graph Protocol, Base Sepolia

- **Frontend**: NextJs, Wagmi library for blockchain interaction

- **Approach**: Associate links with wallet addresses, then Watch USDT payments on the links using The Graph Protocol on Base Sepolia.

## Future Plans

- Add support for more stablecoins
- Add Offramp (NGN, KSH, GHC), so users can convert their received funds into local currency
