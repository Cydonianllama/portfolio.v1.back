## Typescript

1. Instala TypeScript
npm install -D typescript ts-node nodemon
npm install -D @types/node

Y para Express:

npm install -D @types/express

Si usas otras librerías:

npm install -D @types/jsonwebtoken
npm install -D @types/cors
npm install -D @types/cookie-parser

2. Crea un tsconfig
npx tsc --init



3. si configuro paths
npm install tsconfig-paths
{
  "scripts": {
    "dev": "ts-node -r tsconfig-paths/register src/index.ts"
  }
}

---------------------> 

reemplazar nodemon y ts-node por tsx
Si usas tsx (mi recomendación)

Instala:

npm install -D tsx

{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts"
  }
}

----------------------<>