#Chat App

### Pre-requirements
* Docker

### Setup
```bash
docker-compose build
docker-compose up
```


### Troubleshooting
**If mongoDB initial credentials don't work:**

```bash 
docker-compose up --build --force-recreate --renew-anon-volumes
```