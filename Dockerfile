FROM instructure/node:12

ENV APP_HOME /usr/src/app/
ENV YARN_CACHE /home/docker/.cache/yarn

COPY --chown=docker:docker . $APP_HOME

USER docker

RUN mkdir -p $APP_HOME/coverage $APP_HOME/node_modules $APP_HOME/lib $YARN_CACHE

RUN yarn config set prefer-offline true \
  && yarn config set no-progress true \
  && yarn config set cache-folder $YARN_CACHE

CMD tail -f /dev/null
