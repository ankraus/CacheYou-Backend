# IA5 Webapp Backend
## Inhaltsverzeichnis
- [IA5 Webapp Backend](#ia5-webapp-backend)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Installation](#installation)
    - [Voraussetzungen](#voraussetzungen)
    - [Starten der Containerkomposition](#starten-der-containerkomposition)
      - [Duplicate mount point error](#duplicate-mount-point-error)
    - [Stoppen der Containerkomposition](#stoppen-der-containerkomposition)
    - [Initialisierung und Rücksetzen der Datenbank](#initialisierung-und-rücksetzen-der-datenbank)
  - [Nutzung](#nutzung)
    - [Servererreichbarkeit](#servererreichbarkeit)
    - [Routen](#routen)
## Installation
### Voraussetzungen
Klonen Sie dieses Repository auf Ihre Maschine:  
```
git clone https://gitlab.multimedia.hs-augsburg.de/cacheemall/cacheemall-backend.git  
```
Stellen Sie sicher, dass [docker](https://www.docker.com/get-started) und [docker-compose](https://docs.docker.com/compose/install/) auf Ihrem System installiert und funktionsfähig sind.  
Der Server und die Datenbank laufen in kleinen, virtuellen Maschinen, genannt Docker container, um konsistente Entwicklungsumgebung bei allen Entwicklern und im Deployment zu garantieren.
Es wurden folgende Docker images verwendet:
- [postgres](https://hub.docker.com/_/postgres): Relationale Datenbank
- [mhart/alpine-node](https://hub.docker.com/r/mhart/alpine-node/): platzsparendes Linux image mit NodeJS
### Starten der Containerkomposition
**Achtung: Alle folgenden Befehle müssen im Wurzelverzeichnis des Repositories oder einem seiner Unterverzeichnisse ausgeführt werden. Sollten Sie mit Ihrem Terminal nicht im richtigen Order sein, werden die Befehle nicht funktionieren.**  
Um Datenbank und Server zu starten nutzen Sie folgendes Kommando in Ihrem Terminal:
```
docker-compose up --build
```
Beim ersten Start der Datenbank sollten Sie die [Initialisierung](#initialisierung-und-rücksetzen-der-datenbank) ausführen.  
Der Befehl `docker-compose up` startet die Komposition der beiden Docker container, die Flag `--build` stellt sicher, dass die Docker container immer aus dem aktuellen Quellcode erstellt werden. Sollten Sie am Quellcode nichts geändert haben, muss die `--build` Flag nicht gesetzt werden.  
#### Duplicate mount point error
Sollte beim Start eine Fehlermeldung mit dem Inhalt `duplicate mount point` auftreten, führen Sie bitte das Kommando zum [Stoppen der Containerkomposition](#stoppen-der-containerkomposition) aus. Danach sollte sich die Komposition wieder mit dem gewohnten Kommando starten lassen.
### Stoppen der Containerkomposition
Um Datenbank und Server zu stoppen nutzen Sie folgendes Kommando in Ihrem Terminal:
```
docker-compose down
```
### Initialisierung und Rücksetzen der Datenbank
Um die Datenbank zu initialisieren und Beispieldaten einzupflegen oder um die Datenbank auf ihren Ursprungszustand zurückzusetzen wird aktuell ein SQL-Skrip genutzt. Führen Sie dieses bei gestarteter Komposition (entweder in einem zweiten Terminal oder im detached mode: [Startkommando](#starten-der-containerkomposition) mit der Flag `-d`) mit folgendem Befehl aus:
```
docker-compose exec database psql ia5 -h localhost -d testdatabase -f /testdata.sql
```
Der Befehl `docker-compose exec database` führt einen nachfolgenden Befehl innerhalb des Datenbankcontainers aus. Der Befehl führt mit dem CLI der postgres Datenbank als Nutzer `ia5` auf dem Host `localhost` in der Datenbank `testdatabase` das Skript in der Datei `/testdata.sql` aus.
Sie sollten als Ausgabe einige `CREATE TABLE` und `INSERT` Zeilen sehen. Falls Fehlermeldungen auftreten kontaktieren Sie bitte den Maintainer dieses Repositories.
## Nutzung
### Servererreichbarkeit
Der lokale Server ist standardmäßig über localhost:8080 erreichbar.  
Desweiteren gibt es eine fürs erste öffentlich zugängliche Version auf ia5.akr.cx.  
*(Es ist nicht garantiert, dass diese Version immer den aktuellsten Entwicklungsstand widerspiegelt.)*
### Routen
Der Server liefert bei Anfrage an die Root-Route (localhost:8080/) eine Liste aller aktuell verfügbaren Routen aus.  
Aktuell sind folgende Routen verfügbar:  
**Alle "_id" Parameter sind uuids. Sollte der übergebene Wert nicht dem Format einer uuid entsprechen wird der Server (aktuell) einen Fehlercode 500 zurückliefern.**
| Route                       | Beschreibung                                                                |
| --------------------------- | --------------------------------------------------------------------------- |
| /                           | alle Routen                                                                 |
| /users                      | alle User                                                                   |
| /users/:user_id/follows     | alle User, denen der User mit :user_id folgt                                |
| /users/:user_id/collected   | alle Einträge, bei denen der User mit :user_id einen Cache eingesammelt hat |
| /users/:user_id/created     | alle Caches, die von dem User mit :user_id erstellt wurden                  |
| /users/:user_id/collections | alle Collections des Users mit :user_id                                     |
| /caches                     | alle Caches                                                                 |
| /caches/:cache_id/images    | alle Bilder, die zum Cache mit :cache_id gehören                            |
| /caches/:cache_id/comments  | alle Kommentare, die zum Cache mit :cache_id gehören                        |
| /caches/:cache_id/collected | alle Einträge, bei denen der Cache mit :cache_id eingesammelt wurde         |
| /images/:image_id           | das Bild mit :image_id (i.d.R. als png)                                     |
| /collections                | alle Collections                                                            |
| /collections/:collection_id | die Collection mit :collection_id                                           |
