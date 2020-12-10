# IA5 Webapp Backend
## Inhaltsverzeichnis
- [IA5 Webapp Backend](#ia5-webapp-backend)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
- [Installation](#installation)
    - [Brauche ich eine lokale Version des Backends?](#brauche-ich-eine-lokale-version-des-backends)
    - [Voraussetzungen](#voraussetzungen)
    - [Starten der Containerkomposition](#starten-der-containerkomposition)
      - [Duplicate mount point error](#duplicate-mount-point-error)
    - [Stoppen der Containerkomposition](#stoppen-der-containerkomposition)
    - [Initialisierung und Rücksetzen der Datenbank](#initialisierung-und-rücksetzen-der-datenbank)
- [Nutzung](#nutzung)
  - [Servererreichbarkeit](#servererreichbarkeit)
- [Routen](#routen)
  - [Users](#users)
    - [Liste aller Nutzer](#liste-aller-nutzer)
    - [Einzelner Nutzer](#einzelner-nutzer)
    - [Registrierung](#registrierung)
    - [Login](#login)
    - [Logout](#logout)
    - [Nutzerdaten ändern](#nutzerdaten-ändern)
    - [Alle von einem Nutzer gesammelten Caches](#alle-von-einem-nutzer-gesammelten-caches)
    - [Alle von einem Nutzer erstellten Caches](#alle-von-einem-nutzer-erstellten-caches)
    - [Alle Nutzer, denen ein Nutzer folgt](#alle-nutzer-denen-ein-nutzer-folgt)
  - [Caches](#caches)
    - [Liste aller Caches](#liste-aller-caches)
    - [Einzelner Cache](#einzelner-cache)
    - [Liste aller Tags](#liste-aller-tags)
    - [Cache erstellen](#cache-erstellen)
    - [Liste aller Bilder eines Caches](#liste-aller-bilder-eines-caches)
    - [Liste aller Einsammlungen eines Caches](#liste-aller-einsammlungen-eines-caches)
    - [Liste aller Kommentare eines Caches](#liste-aller-kommentare-eines-caches)
  - [Collections](#collections)
    - [Liste aller Collections](#liste-aller-collections)
    - [Einzelne Collection](#einzelne-collection)
  - [Images](#images)
    - [Einzelnes Bild](#einzelnes-bild)
    - [Informationen zu einzelnem Bild](#informationen-zu-einzelnem-bild)
    - [Profilbild posten (aktuell eingeloggter Nutzer)](#profilbild-posten-aktuell-eingeloggter-nutzer)
    - [Cachebild posten](#cachebild-posten)
    - [Coverbild posten](#coverbild-posten)
    - [Bild löschen](#bild-löschen)
- [Fehlermeldungen](#fehlermeldungen)
- [Repositorystruktur, Branches und Entwicklung](#repositorystruktur-branches-und-entwicklung)
  - [Entwickler](#entwickler)
# Installation
### Brauche ich eine lokale Version des Backends?
**Für die Entwicklung des Frontends sollte die [öffentlich zugängliche Version des Backends](#servererreichbarkeit) vollkommen ausreichen! Da docker bei der Installation oft Probleme macht empfehle ich nur Backend-Entwicklern die Verwendung des lokalen Servers.**  
Desweiteren sind für Frontendentwickler hauptsächlich die [Routen](#routen) interessant.
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
# Nutzung
## Servererreichbarkeit
Der lokale Server ist standardmäßig über [localhost:8080](http://localhost:8080/) erreichbar.  
Desweiteren gibt es eine fürs erste öffentlich zugängliche Version auf [ia5.akr.cx](https://ia5.akr.cx).  
*(Es ist nicht garantiert, dass diese Version immer den aktuellsten Entwicklungsstand widerspiegelt.)*
# Routen  
Der Server liefert bei Anfrage an die Root-Route (localhost:8080/) eine Liste aller aktuell verfügbaren Routen aus.  
Aktuell sind folgende Routen verfügbar:  
## Users

---
### Liste aller Nutzer
**Route**: `/users`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**: 
```json
{
  "users": [
    {
      "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109",
      "username": "TestyMcTestersson",
      "image_id": "166fc680-8dc3-4707-8f49-dfd223e58e2c",
      "interests": [
        "streetart",
        "kurios"
      ]
    },
    ...
  ]
}
```
---
### Einzelner Nutzer
**Route**: `/users/:user_id`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**: 
```json
{
  "user": {
    "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109",
    "username": "TestyMcTestersson",
    "image_id": "166fc680-8dc3-4707-8f49-dfd223e58e2c",
    "interests": [
      "kurios",
      "streetart"
    ]
  }
}
```
---
### Registrierung
**Route**: `/users/register`  
**Methode**: `POST`  
**Anfrage**: 
```json
{
	"email":"testuser@example.com",
	"password":"testuser123567",
  "username": "testuser_123",
  "interests": [
      "streetart",
      "kurious"
    ],
  "license": true,
  "privacy_policy": true,
  "terms_of_use": true
}
```
**Antwort**:
```
Created
```
---
### Login
**Route**: `/users/login`  
**Methode**: `POST`  
**Anfrage**: 
```json
{
	"email": "testuser@example.com",
	"password": "testuser123567"
}
```
**Antwort**:
```
OK
```
---
### Logout
**Route**: `/users/logout`  
**Methode**: `POST`  
**Anfrage**: -  
**Antwort**:
```
OK
```
---
### Nutzerdaten ändern
**Route**: `/users/current`  
**Methode**: `PUT`  
**Anfrage**: *Mindestens einer der drei Parameter muss übergeben werden.*
```json
{
	"email":"testuser@example.com",
	"password":"testuser123567",
	"username": "testuser_123",
  "interests": [
    "wassersystem"
  ],
  "terms_of_use":true,
  "privacy_policy":false,
  "license":false
}
```
**Antwort**:
```
OK
```
---
### Alle von einem Nutzer gesammelten Caches
**Route**: `/users/:user_id/collected`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "collected": [
    {
      "user": {
        "user_id": "94eff975-1414-4fe4-8d5d-8871dc23c4f4",
        "username": "dummy789"
      },
      "cache": {
        "cache_id": "e6d4abc1-a627-4d78-8f82-0bfd81a582f0",
        "tags": [
          "kultur"
        ],
        "title": "Zur Brezn",
        "image_id": "4b3c7735-cec5-40ef-b416-27dcdad3a646"
      },
      "liked": false,
      "created_at": "2020-11-26T20:28:10.412Z"
    }
  ]
}
```
---
### Alle von einem Nutzer erstellten Caches
**Route**: `/users/:user_id/created`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "created": [
    {
      "cache_id": "2967319e-5ee6-4ed0-a251-aaa1fa9deb56",
      "tags": [
        "streetart"
      ],
      "title": "Wandgemälde bei der Esso Tankstelle",
      "created_at": "2020-10-30T05:31:08.808Z",
      "cover_image_id":"2155e963-6f90-4370-af16-f2b3d4f05f5a"
    },
    {
      "cache_id": "d80ee03b-90df-4541-8567-e4932198848a",
      "tags": [
        "wassersystem"
      ],
      "title": "Unterer Brunnenturm",
      "created_at": "2020-08-11T08:23:54.000Z",
      "cover_image_id": "36a9575e-fd78-4a8d-927b-1fba938854ea"
    }
  ]
}
```
---
### Alle Nutzer, denen ein Nutzer folgt
**Route**: `/users/:user_id/follows`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "follows": [
    {
      "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109",
      "username": "TestyMcTestersson"
    }
  ]
}
```
---
## Caches

---
### Liste aller Caches
**Route**: `/caches`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "caches": [
    {
      "cache_id": "2967319e-5ee6-4ed0-a251-aaa1fa9deb56",
      "cover_image_id": "36a9575e-fd78-4a8d-927b-1fba938854ea",
      "latitude": "48.3717700000",
      "longitude": "10.8892950000",
      "title": "Wandgemälde bei der Esso Tankstelle",
      "description": "Dies ist ein großes Wandgemälde an einer großen Wand gemalt wurde.",
      "link": null,
      "tags": [
        "streetart"
      ],
      "creator": {
        "username": "dummy789",
        "user_id": "94eff975-1414-4fe4-8d5d-8871dc23c4f4"
      },
      "created_at": "2020-10-13T21:38:44.844Z"
    },
    ...
  ]
}
```
---
### Einzelner Cache
**Route**: `/caches/:cache_id`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "cache": {
    "cache_id": "2967319e-5ee6-4ed0-a251-aaa1fa9deb56",
    "latitude": "48.3717700000",
    "longitude": "10.8892950000",
    "title": "Wandgemälde bei der Esso Tankstelle",
    "description": "Dies ist ein großes Wandgemälde an einer großen Wand gemalt wurde.",
    "link": null,
    "tags": [
      "streetart"
    ],
    "image_ids": [
      "e8643294-a0b8-4d76-adea-5a5599e3525b"
    ],
    "creator": {
      "username": "dummy789",
      "user_id": "94eff975-1414-4fe4-8d5d-8871dc23c4f4"
    },
    "created_at": "2020-10-30T18:04:03.153Z"
  }
}
```
---
### Liste aller Tags
**Route**: `/caches/tags`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "tags": [
    "streetart",
    "kurios",
    "kultur",
    "wassersystem"
  ]
}
```
---
### Cache erstellen
**Route**: `/caches`  
**Methode**: `POST`  
**Anfrage**:
```json
{
	"description": "Dies ist ein Cache mit einer Testbeschreibung",
	"title": "Testcache mit Testtitel",
	"longitude": -111.693987,
	"latitude": 33.384195,
	"public": true,
	"tags": ["kurios"]
}
```
**Antwort**:
```json
{
  "cache_id": "78be3f17-f724-4bda-8023-ea3aa689b7f1"
}
```
---
### Liste aller Bilder eines Caches
**Route**: `/caches/:cache_id/images`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "image_ids": [
    "2155e963-6f90-4370-af16-f2b3d4f05f5a"
  ]
}
```
---
### Liste aller Einsammlungen eines Caches
**Route**: `/caches/:cache_id/collected`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "collected": [
    {
      "user": {
        "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109",
        "username": "TestyMcTestersson"
      },
      "cache": {
        "cache_id": "2967319e-5ee6-4ed0-a251-aaa1fa9deb56",
        "tags": [
          "streetart"
        ],
        "title": "Wandgemälde bei der Esso Tankstelle"
      },
      "liked": true,
      "created_at": "2020-11-26T20:28:10.412Z"
    }
  ]
}
```
---
### Liste aller Kommentare eines Caches
**Route**: `/caches/:cache_id/comments`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "comments": [
    {
      "comment_id": "2b267676-dd66-403b-b4c9-757f8ce54281",
      "user": {
        "username": "TestyMcTestersson",
        "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109"
      },
      "content": "Ganz schön groß, dieses Gemälde!",
      "created_at": "2020-11-26T20:26:42.986Z"
    }
  ]
}
```
---
## Collections

---
### Liste aller Collections
**Route**: `/collections`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "collections": [
    {
      "collection_id": "fae23c30-eea9-45be-9080-64eccf69c85f",
      "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109",
      "public": true,
      "title": "Alle Augsburger Caches"
    },
    {
      "collection_id": "f32144f3-892b-4adc-9dd1-49a2e2c8b0ca",
      "user_id": "94eff975-1414-4fe4-8d5d-8871dc23c4f4",
      "public": false,
      "title": "Kneipentour"
    }
  ]
}
```
---
### Einzelne Collection
**Route**: `/collections/:collection_id`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "collection": {
    "title": "Alle Augsburger Caches",
    "creator": {
      "user_id": "05200483-43b9-4fe4-b96f-1cc173bb8109",
      "username": "TestyMcTestersson"
    },
    "caches": [
      {
        "collection_id": "fae23c30-eea9-45be-9080-64eccf69c85f",
        "cache_id": "2967319e-5ee6-4ed0-a251-aaa1fa9deb56",
        "latitude": "48.3717700000",
        "longitude": "10.8892950000",
        "title": "Wandgemälde bei der Esso Tankstelle",
        "description": "Dies ist ein großes Wandgemälde an einer großen Wand gemalt wurde.",
        "link": null,
        "creator_username": "dummy789",
        "creator_id": "94eff975-1414-4fe4-8d5d-8871dc23c4f4",
        "created_at": "2020-10-30T05:31:08.808Z",
        "tags": [
          "streetart"
        ]
      },
      ...
    ]
  }
}
```
---
## Images

---
### Einzelnes Bild
**Route**: `/images/:image_id`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**: Das Bild als Binärdaten

---
### Informationen zu einzelnem Bild
**Route**: `/images/:image_id/info`  
**Methode**: `GET`  
**Anfrage**: -  
**Antwort**:
```json
{
  "image_id": "36a9575e-fd78-4a8d-927b-1fba938854ea",
  "user_id": "94eff975-1414-4fe4-8d5d-8871dc23c4f4",
  "username": "dummy789",
  "created_at": "2020-12-09T22:27:28.382Z",
  "mimetype": "image/png"
}
```
---
### Profilbild posten (aktuell eingeloggter Nutzer)
**Route**: `/images/profile/`  
**Methode**: `POST`  
**Anfrage**: Das Bild als Binärdaten, Anfragetyp gleich Mimetype  
**Antwort**:
```json
{
  "image_id": "4fed05a3-b680-4830-833a-4c93cb25b09a"
}
```
---
### Cachebild posten
**Route**: `/images/caches/:cache_id`  
**Methode**: `POST`  
**Anfrage**: Das Bild als Binärdaten, Anfragetyp gleich Mimetype  
**Antwort**:
```json
{
  "image_id": "4fed05a3-b680-4830-833a-4c93cb25b09a"
}
```
---
### Coverbild posten
**Route**: `/images/caches/:cache_id/cover`  
**Methode**: `POST`  
**Anfrage**: Das Bild als Binärdaten, Anfragetyp gleich Mimetype  
**Antwort**:
```json
{
  "image_id": "4fed05a3-b680-4830-833a-4c93cb25b09a"
}
```
---
### Bild löschen
**Route**: `/images/:image_id`  
**Methode**: `DELETE`  
**Anfrage**: -  
**Antwort**:
```
OK
```

---
# Fehlermeldungen
| Fehlercode  | Fehlermeldung               | mögl. Ursache                                 | Behebung                                |
| ---         | ---                         | ---                                           | ---                                     |
| 400         | Already exists              | Ressource existiert bereits                   | Nutzername/email ändern                 |
| 400         | Bad request                 | Anfrage nicht in richtiger Form               | Anfrage überprüfen, siehe Fehlermeldung |
| 400         | Validation Error            | Parameter in Anfrage nicht in richtiger Form  | Anfrage überprüfen, siehe Fehlermeldung |
| 400         | Invalid syntax              | Anfrage in fehlerhaftem JSON                  | Anfrage überprüfen, siehe Fehlermeldung |
| 401         | Wrong username or password  | Anmeldedaten falsch                           | richtige Anmeldedaten verwendern        |
| 401         | No token in request         | Cookie wurde nicht gesendet                   | withCredentials überprüfen              |
| 403         | token invalid               | Token abgelaufen                              | Nutzer neu einloggen                    |
| 404         | Not found                   | Ressource existiert nicht                     | Id überprüfen                           |
| 500         | Database Error              | Fehlerhafte anfrage an die DB                 | Backend ist schuld                      |
| 500         | Hashing Error               | Hashing Fehlerhaft                            | Backend ist schuld                      |

# Repositorystruktur, Branches und Entwicklung
- Es gibt immer einen `master` und einen `dev` Branch. 
- Einzelne Features werden in eigenen Branches (benannt nach Jira-Task z.B. `WW-59 - README Backend`) implementiert und dann in den `dev` Branch gemerged.
- Wenn ein Sprint abgeschlossen ist oder ein Feature abgeschlossen wurde, das vom Frontendteam dringend benötigt wird, wird der `dev` Branch in den `master` gemerged und auf den öffentlichen Server deployed.
## Entwickler
Dieses Repository wird von folgenden Entwicklern betreut:
- [Andreas Kraus](@krauandr)
- [Andreas Barth](@barthand)