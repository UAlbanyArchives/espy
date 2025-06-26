# dockerized_rails
A stock example repo for dockerizing Rails apps, particularly Blacklight apps that use an external Solr and SQLite

## Note on DBs

This set up makes some assumputions about your production database.

This installs two cronjobs via `config/app_name-cron`, one of which assumes that this is a Blacklight app. The first cronjob will clear the Blacklight DB of searches using `rails blacklight:delete_old_searches`. This will raise an error if Blacklight is not installed.


`entrypoint.sh`, assumes you are using a sqlite db in production. On startup, if it doesn't find `/app/db/production.sqlite3` it will re-run database migrations. Remove this block if you're using an external db.


### For development

Run the app:
```
docker-compose -f docker-compose-dev.yml up
```

Navigate to [http://localhost:3000/app_name](http://localhost:3000/app_name)

You should be able to edit code in real time.

When you're done:
```
docker-compose down
```

### For deployment

Building the `app_name` image locally:
```
DOCKER_BUILDKIT=1 docker build --secret id=master_key,src=config/master.key -t app_name .
```
On Windows:
```
$env:DOCKER_BUILDKIT=1; docker build --secret id=master_key,src=config/master.key -t app_name .
```

Running the image
```
docker-compose up -d
```
Navigate to [http://localhost:8080/app_name](http://localhost:8080/app_name)

&#8594; In production, this should be set up to run as a service.

To stop:
```
docker-compose down
```

### For a terminal

If you need another terminal:
```
docker exec -it app_name bash
```

## Ports

This example repo is set to serve to 8080. Each app should serve on a different port so this should be changed on lines 8 and 20.

## Potential Gotchas

The source code, Dockerfile and compose files are all managed in the same repo for versioning, but deployment uses a prebuilt image, with only certain files/directories mounted:
	* ./config/master.key
	* ./db
	* ./log

The master.key is excluded from the repo and must be manually copied over to ./config. The app needs this to run so its mounted inside the image.

The db directory holds the `production.sqlite3` database file. This should be persistant when the image is re-built, so it is managed directly on the host and mounted within the image via `docker-compose.yml`.
	* There is a cron job set within the image that will clear blacklight searches each month.

Simmilar to the db, the `log` directly also persists outside the image. These should be set up to rotate on the server.

Everything else gets copied into the image during the deployment build stage.

## Health checks

The deployment compose file is set to run a healthcheck to makesure the app responds and restarts if not. For this to work properly, that route needs to be added to `config/routes.rb`. For it to work in the subpath properly, this should be within the `scope 'app_name' do` block.

```
# For docker healthcheck
get 'health', to: proc { [200, {}, ['OK']] }
```

## About dot files

Files in `.dockerignore` don't get copied into the image. This is important for `master.key` and other mounted data.

`.gitattributes` enforces LF line endings, which can cause issues if we're working cross-platform.

`.gitignore` is the stock Rails one that should already be in repos.
