FROM registry.access.redhat.com/hi/nodejs:26.3.1

LABEL org.opencontainers.image.source=https://github.com/browserslist/browsersl.ist
LABEL org.opencontainers.image.description="Browserslist REPL"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /var/app
ENV NODE_ENV=production

COPY --from=ghcr.io/tarampampam/microcheck:1.4.0 /bin/httpcheck /bin/httpcheck
COPY ./package.json /var/app/
COPY ./pnpm-lock.yaml /var/app/
COPY ./lib/ /var/app/lib/
COPY ./client/dist/ /var/app/client/dist/
COPY ./server/dist/ /var/app/server/

ENTRYPOINT ["/usr/bin/node"]
CMD ["server/index.js"]

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD ["/bin/httpcheck", "http://localhost:8080/health"]
