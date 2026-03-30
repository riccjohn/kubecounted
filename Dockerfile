FROM node:alpine AS deps
WORKDIR /app
RUN npm install -g pnpm
# Copy lockfile and manifest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod 

FROM node:alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./
EXPOSE 3000
CMD ["node", "src/app.js"]
