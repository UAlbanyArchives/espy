#!/bin/sh

# Define the path to the SQLite database
DB_PATH="/app/db/production.sqlite3"

# Check if the SQLite database is accessible
if [ ! -f "$DB_PATH" ]; then
  echo "Database not found. Creating and running migrations..."
  bundle exec rake db:migrate
elif ! sqlite3 "$DB_PATH" "PRAGMA integrity_check;" > /dev/null 2>&1; then
  echo "Database is corrupt. Removing and recreating..."
  rm -f "$DB_PATH"
  bundle exec rake db:migrate
else
  echo "Database found. Running any pending migrations..."
  bundle exec rake db:migrate
fi

rm -f /app/tmp/pids/server.pid
mkdir -p /app/tmp/pids

# Start the Rails server
echo "Starting Rails server..."
bundle exec puma -C config/puma.rb
