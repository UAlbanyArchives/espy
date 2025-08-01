FROM ruby:2.7.7-slim-bullseye AS builder
# Should look to update to ruby:3.3.4-slim-bookworm

ENV RAILS_ENV=production

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential apt-utils git cron curl nodejs
# The regular apt install yarn isn't as up to date as we need
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

# Add crontab file in the cron directory
COPY ./config/espy-cron /etc/cron.d/espy-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/espy-cron

# Apply cron job to clean up the db
RUN crontab /etc/cron.d/espy-cron

# specifying the version is needed in older ruby image. Should not be needed in ruby 3+.
RUN gem install bundler -v 2.4.22

# Copy application code
COPY . /app

# Install gems
WORKDIR /app
RUN bundle install && \
    bundle exec ruby -rbundler/setup -e "Bundler.load.specs.each(&:full_gem_path)"

# Use build secret for master key
RUN --mount=type=secret,id=master_key \
    mkdir -p /app/config && \
    cp /run/secrets/master_key /app/config/master.key && \
    RAILS_ENV=production MASTER_KEY=$(cat /app/config/master.key) bundle exec rails assets:precompile && \
    rm /app/config/master.key

# Final image
FROM ruby:2.7.7-slim-bullseye

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential apt-utils git cron curl nodejs
# The regular apt install yarn isn't as up to date as we need
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

# Copy application code from the builder stage and install gems
COPY --from=builder /app /app
WORKDIR /app
RUN gem install bundler -v 2.4.22
RUN bundle install && \
    bundle exec ruby -rbundler/setup -e "Bundler.load.specs.each(&:full_gem_path)"

# Expose port 3000
ARG DEFAULT_PORT 3000
EXPOSE ${DEFAULT_PORT}

# Copy the entrypoint script
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

# Ensure pids exists so Puma can run
RUN mkdir -p /app/tmp/pids

# Start cron and Rails server
CMD ["sh", "-c", "cron && /usr/bin/entrypoint.sh"]

