FROM cgr.dev/chainguard/wolfi-base:latest AS base

LABEL org.opencontainers.image.source=https://github.com/browserslist/browsersl.ist
LABEL org.opencontainers.image.description="Browserslist REPL"
LABEL org.opencontainers.image.licenses=MIT

ENV NODE_VERSION=26.3.0

ADD https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz /node.tar.xz
RUN tar -xf "node.tar.xz" --strip-components=1 -C /usr/local/ \
  "node-v${NODE_VERSION}-linux-x64/bin/node"

FROM cgr.dev/chainguard/glibc-dynamic:latest
WORKDIR /var/app
ENV NODE_ENV=production

COPY --from=ghcr.io/tarampampam/microcheck:1.3.0 /bin/httpcheck /bin/httpcheck
COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY ./package.json /var/app/
COPY ./pnpm-lock.yaml /var/app/
COPY ./lib/ /var/app/lib/
COPY ./client/dist/ /var/app/client/dist/
COPY ./server/dist/ /var/app/server/

USER nonroot

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["server/index.js"]

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD ["/bin/httpcheck", "http://localhost:8080/health"]
