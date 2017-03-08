FROM instructure/node:7.5-yarn

ENV APP_HOME /usr/src/app/
ENV YARN_CACHE /home/docker/.cache/yarn

COPY package.json yarn.lock $APP_HOME
RUN yarn config set ignore-optional true \
  && yarn config set ignore-scripts true \
  && yarn config set prefer-offline true \
  && yarn config set no-progress true \
  && yarn config set cache-folder $YARN_CACHE

COPY . $APP_HOME

VOLUME $YARN_CACHE
