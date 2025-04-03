FROM cgr.dev/chainguard/wolfi-base:latest as base

ENV NODE_VERSION 22.14.0
ENV PNPM_VERSION 10.7.1

ADD https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz /node.tar.xz
RUN tar -xf "node.tar.xz" --strip-components=1 -C /usr/local/ \
    "node-v${NODE_VERSION}-linux-x64/bin/node"
ADD https://github.com/pnpm/pnpm/releases/download/v${PNPM_VERSION}/pnpm-linux-x64 /usr/local/bin/pnpm
RUN chmod a+rx /usr/local/bin/pnpm
RUN apk add --no-cache binutils
RUN strip /usr/local/bin/node

WORKDIR /var/app
COPY . /var/app/
RUN pnpm install --prod --frozen-lockfile --ignore-scripts -F server
RUN ls node_modules/

FROM cgr.dev/chainguard/glibc-dynamic:latest
WORKDIR /var/app
ENV NODE_ENV production

COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY ./pnpm-workspace.yaml /var/app/
COPY ./package.json /var/app/
COPY ./pnpm-lock.yaml /var/app/
COPY ./lib/ /var/app/lib/
COPY ./server/ /var/app/server/
COPY ./client/dist/ /var/app/client/dist/
COPY --from=base /var/app/node_modules/ /var/app/node_modules/

USER nonroot

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["server/index.js"]

