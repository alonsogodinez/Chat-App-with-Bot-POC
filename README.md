# Chat App

### Requirements
* Docker

### Setup
```bash
docker-compose build
docker-compose up
```
the app should be runing in  *localhost:3001*

### Troubleshooting
**If mongoDB initial credentials don't work:**

```bash 
docker-compose up --build --force-recreate --renew-anon-volumes
```
