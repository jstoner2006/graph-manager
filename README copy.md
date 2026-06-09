The first real entry into this readme, is to define the project structure. Hopefully the project structure will remain consistent but this text will be gone.

my-nextjs-app/
├── prisma/ # Prisma schema and migrations (kept at root)
│ ├── schema.prisma
│ └── migrations/
├── public/ # Static assets (images, fonts)
├── src/ # Main application source
│ ├── app/ # Next.js App Router (Routing & Pages only)
│ │ ├── page/ # Dashboard route
│ │ ├── layout.tsx
│ │ └── page.tsx

│ ├── components/ there maybe an issue with components/ui/table.tsx
│ ├── features/ # THE CORE: Domain-driven modules (See breakdown below)
│ ├── hooks/ # Global React hooks
│ ├── lib/ # Core utilities & third-party initializations
│ │ ├── prisma.ts # Prisma client singleton
│ │ └── utils.ts
│ ├── queries/ #storing globally useful queries
│ └── types/ # Global TypeScript definitions
├── .env
├── package.json
└── tsconfig.json
