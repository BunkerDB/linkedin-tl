#LinkedIn Social - Transform & Load Microservice

###### Instrucciones para correr MS localmente:

\*Pre-Requisitos:  
`-NodeJS/NPM, Docker y Docker-Compose instalados.`

`-Archivo .env en directorio raiz del proyecto, con las variables descriptas en el .env.DEV.example.`

1. _Clonar el proyecto:_ `git clone git@github.com:BunkerDB/linkedin-tl.git`
2. _Crear contenedores de Docker:_ Dentro de la raiz del proyecto ejecutar `docker-compose up -d`
3. _Permisos:_ Ingresar en `/data` y ejecutar el siguiente comando para dar permiso de escritura a los directorios de configuracion: `sudo chown -R 1001:{user} zookeeper/ kafka/ kafka-connect/`
4. _Reiniciar Servicios (Siempre en este orden):_ `docker restart zookeper kafka connect` (Puede que haya que reiniciar Kafka y Connect varias veces hasta que inicie correctamente con los nuevos permisos)
5. _Crear Conector de Debezium/Kafka_ (Pasando en el Body/Raw el payload que esta debajo de todo el README.md):

   `POST http://localhost:8083/connectors/`

6. _Verificar que este corriendo correctamente el worker creado en el paso anterior:_

   `GET http://localhost:8083/connectors/linkedinads-etl/tasks/0/status`

7. _Instalar dependencias:_ `npm install`

8. _Crear estructura de DB/Migracion:_ `npm run db:create`

9. _Ejecutar el Server y los Tasks_ (Leer scripts en package.json para mas opciones):

   `npm run watch:task:web` (Server)

   `npm run watch:task:00` (Primer Tarea)

10. _Chequear que el MS este corriendo correctamente, mediante los endpoints `/ping` y `/status`._
    `GET http://localhost:5001/ping`

    `GET http://localhost:5001/status`

---

\*En la siguiente collection de Postman se encuentran estos endpoints y el necesario para crear una nueva solicitud de Reporte:
https://www.getpostman.com/collections/b74a11bc1ecae6896374

---

DEBEZIUM-CONNECTOR

```shell script
curl --location --request POST 'http://localhost:8083/connectors/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "linkedin-etl",
    "config": {
        "connector.class": "io.debezium.connector.mysql.MySqlConnector",
        "tasks.max": "1",
        "database.hostname": "db",
        "database.port": "3306",
        "database.user": "debezium",
        "database.password": "dbz",
        "database.server.id": "184054",
        "database.server.name": "db_etl_linkedin",
        "database.include.list": "db_etl_linkedin",
        "database.history.kafka.bootstrap.servers": "kafka:9092",
        "database.history.kafka.topic": "schema-changes.db_etl_linkedin"
    }
}'
```

TODO:
#"\_message":"Retry's limit exceeded undefined"
#HTTP Circuit Breaker
