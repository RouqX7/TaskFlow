# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the application and build
COPY . .
RUN yarn build  # Make sure this step compiles TypeScript

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN yarn install --production

# Expose the necessary port
EXPOSE 3300

# Start the application
CMD ["node", "dist/index.js"]
