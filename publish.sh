ionic build --prod
docker build -t registry.gitlab.com/leon.hoppe/mahlzeitmelder/frontend:latest .
docker push registry.gitlab.com/leon.hoppe/mahlzeitmelder/frontend:latest
