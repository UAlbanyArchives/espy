# Espy Project Execution Records
Rails Blacklight app for [Espy Project Execution Records](https://archives.albany.edu/espy/).


### For development

Run the app:
```
docker compose up
```

Navigate to [http://localhost:3000/espy](http://localhost:3000/espy)

You should be able to edit code in real time.

### For deployment

Building the `espy` image for production:
```
make build
```

Restarting the service:
```
make restart
```

#### For Windows

These commands don't work on Windows. For that you have to use the full build command:
```
$env:DOCKER_BUILDKIT=1; docker build --secret id=master_key,src=config/master.key -t espy .
```

Running the image in the background:
```
docker compose -f docker-compose-prod.yml up -d
```
Navigate to [http://localhost:8083/espy](http://localhost:8083/espy)

To stop:
```
docker-compose down
```

### For a terminal

If you need another terminal:
```
docker exec -it espy bash
```
