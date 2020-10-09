FROM neo4j:4.0.3

ENV NEO4J_AUTH=neo4j/letmein

ENV APOC_VERSION 4.0.0.4
ENV APOC_URI https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/${APOC_VERSION}/apoc-${APOC_VERSION}-all.jar
RUN wget -P /var/lib/neo4j/plugins ${APOC_URI}

ENV KAFKA_STREAMS_URI https://github.com/neo4j-contrib/neo4j-streams/releases/download/4.0.1/neo4j-streams-4.0.1.jar
RUN wget -P /var/lib/neo4j/plugins ${KAFKA_STREAMS_URI}

EXPOSE 7474 7473 7687

CMD ["neo4j"]