FROM node:18-slim

LABEL maintainer="Antonio Martin <tonitim13@gmail.com>"
LABEL name="scraper-proxy"
LABEL version="latest"

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production

RUN apt-get update -y && apt-get install gnupg wget curl tor obfs4proxy -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    chmod 700 /var/lib/tor && \
    tor --version

COPY --chown=debian-tor:root torrc /etc/tor/
COPY package*.json ./
COPY ./src ./src/

RUN npm ci --omit=dev
RUN npm install pm2 -g

HEALTHCHECK --timeout=10s --start-period=60s \
    CMD curl --fail --socks5-hostname localhost:9150 -I -L 'https://check.torproject.org/' || exit 1

USER debian-tor
EXPOSE 8853/udp 9150/tcp 8000/tcp

CMD ["/bin/bash", "-c", "/usr/bin/tor -f /etc/tor/torrc & pm2-runtime npm -- start"]
