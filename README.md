# Espy Project Execution Records
Rails Blacklight app for [Espy Project Execution Records](https://archives.albany.edu/espy/).


### For development

Run the app:
```
docker-compose -f docker-compose-dev.yml up
```

Navigate to [http://localhost:3000/espy](http://localhost:3000/espy)

You should be able to edit code in real time.

When you're done:
```
docker-compose down
```

### For deployment

Building the `espy` image locally:
```
DOCKER_BUILDKIT=1 docker build --secret id=master_key,src=config/master.key -t espy .
```
On Windows:
```
$env:DOCKER_BUILDKIT=1; docker build --secret id=master_key,src=config/master.key -t espy .
```

Running the image
```
docker-compose up -d
```
Navigate to [http://localhost:8080/espy](http://localhost:8080/espy)

&#8594; In production, this should be set up to run as a service.

To stop:
```
docker-compose down
```

### For a terminal

If you need another terminal:
```
docker exec -it espy bash
```
