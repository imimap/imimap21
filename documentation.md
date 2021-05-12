# Dokumentation IMIMAP21

## Vorgehen

Für die Organisation der Aufgaben wird ein Kanban-Board in GitHub verwendet. Zudem werden in Miro Besprechungen und
Prozesse dokumentiert.

**Entscheidungen vom 24.04.2021**

Für das Requirements Engineering soll zunächst der aktuelle Stand der IMIMAP analysiert werden und in User Stories
formuliert werden. Basierend darauf ist ein Interview mit dem Praktikumsbeauftragten geplant, um zusätzliche
Anforderungen zu sammeln. Zudem könnte eine Fokusgruppe mit Studierenden durchgeführt werden, die gerade ihr Praktikum
eingetragen haben, damit auch Insights aus der Studierendenperspektive mit einbezogen werden können.

Für das weitere Vorgehen wurde die lockere Nutzung von Test Driven Development, insbesondere für das Backend festgelegt. Zudem soll sowohl im Frontend als auch im Backend Typescript verwendet werden.
Während der Entwicklung ist der Plan viel mit Pair Programming zu arbeiten.


**Notizen vom 28.04.2021**

Login Methode:
Es ist vom Rechenzentrum nicht gewünscht, dass wir LDAP für die IMI Map verwenden.
Stattdessen könnten wir einen SAML SSO Login (wie bei Zoom einrichten), der einen Token erzeugt.

Datenmodell:
Es wurde das bestehende sowie das Konzept für ein neues NoSQL Datenmodell besprochen.
Es gibt Klärungsbedarf zum Ablauf des Praktikumsprozesses (soll mit Prof. Strippgen abgesprochen werden.)

Termin mit Prof. Strippgen:
Ein Treffen mit Fragen zur Anforderung wird zeitnah angesetzt.


**Notizen vom 05.05.2021**

Besprechung des aktuellen Arbeitsstandes (States & Aläufe) mit aktuellem Praktikumsbeauftragten

Wünsche:
- mehr Automatisierung wenn möglich (ECTS automatisch überprüfen lassen, unterschriebene Dokumente aus Mail in die IMImap hochladen)
- alle Files in der IMImap speichern und einsehen können

Fazit:
hauptsache einfach und benutzbar, alle anderen weiterführenden Features kommen später!


**Notizen vom 12.05.2021**

Datenbank:
- Zur Vereinfachung werden Company branches als verschiedene Companies definiert -> Nur noch Companies-Collection, keine Branches-Collection mehr
- Event Logging anstatt Event Sourcing -> State wird im Document gespeichert und beim Erstellen eines neuen Events direkt mit geupdated

Planning:
- User Stories als Milestones im GitHub-Repo
- Für Stories werden Issues erstellt, die diese genauer beschreiben und in Sub-Tasks unterteilen; Labels für Frontend und Backend

Sonstiges:
- Kurzer Design Sprint zur Konzeption des Admin-Interfaces am Freitag, den 14.05. um 10 Uhr
- Dev-Server läuft, CD-Pipeline muss noch eingerichtet werden -> Wo sollen Secrets gespeichert werden: Auf dem Server oder im Repo? Sollen die Docker Images auf dem Server gebaut werden oder auf GitHub (in der Action) gebaut und über Docker Hub deployed werden?
