FROM mongo:latest

COPY mongod.conf /etc/mongod.conf
COPY mongo-init.js /docker-entrypoint-initdb.d/

RUN mkdir -p /var/log/mongodb && \
    chown -R mongodb:mongodb /var/log/mongodb && \
    touch /var/log/mongodb/mongod.log && \
    chown mongodb:mongodb /var/log/mongodb/mongod.log

CMD ["mongod"]