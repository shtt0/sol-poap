This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

「.env.local」の「NEXT_PUBLIC_PAYER_SECRET_KEY」に秘密鍵を入れます。

不明な場合は、solana playground でこちらを「client.ts」に入れて実行しましょう。

```
import { Keypair } from "@solana/web3.js";

const testKeypair = new Keypair();

console.log("wallet address", testKeypair.publicKey.toBase58());

// Convert the secret key Uint8Array to a comma-separated string and enclose it in square brackets
const secretKeyString = `[${Array.from(testKeypair.secretKey).toString()}]`;

console.log("secret key", secretKeyString);

```

得られた wallet address に対して、テストトークンを入れて、ここで得られた秘密鍵を設定してください。
