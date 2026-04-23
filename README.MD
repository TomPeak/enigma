# Enigma – Eine Frage, eine Maschine, eine Anwendung

Die Anwendung beginnt nicht mit Code, sondern mit einer einfachen Frage:

Wie lange würde es dauern, eine Enigma-Nachricht aus dem Zweiten Weltkrieg zu entschlüsseln?

Die intuitive Antwort ist: sehr lange. Die Enigma galt als praktisch unknackbar. Mit ihren Rotoren, dem Steckerbrett und den täglichen Schlüsselwechseln erzeugte sie einen nahezu unüberschaubaren Schlüsselraum. Eine naive Suche aller Möglichkeiten würde länger dauern als jede sinnvolle Zeitspanne.

Und doch wurde sie gebrochen.

Nicht durch rohe Rechenleistung, sondern durch Struktur, Wiederholung und Annahmen über den Inhalt der Nachrichten.

Diese Anwendung ist aus genau diesem Spannungsfeld entstanden.

---

## Die Idee hinter der Umsetzung

Statt nur eine Enigma zu simulieren, steht hier die ursprüngliche Frage im Mittelpunkt:
Was bedeutet es eigentlich, sie zu entschlüsseln?

Die App bildet eine typische Konfiguration der Wehrmacht-Enigma nach:

* Drei aktive Rotoren
* Fünf Walzen zur Auswahl
* Reflektor UKW-B
* Ein Steckerbrett mit bis zu zehn Verbindungen

Damit wird nicht nur Verschlüsselung möglich, sondern auch das Nachvollziehen der Bedingungen, unter denen reale Nachrichten entstanden sind.

---

## Das Steckerbrett

Du erwähnst, dass du zehn Steckverbindungen für das Alphabet vorgesehen hast. Das entspricht genau der historischen Praxis.

Das Steckerbrett ist kein optionales Detail, sondern einer der Hauptgründe für die enorme Komplexität. Es vertauscht Buchstaben paarweise und wirkt vor und nach den Rotoren. Dadurch vervielfacht sich der Suchraum drastisch.

Wichtig ist dabei:

* Jede Verbindung ist bidirektional
* Kein Buchstabe darf doppelt gesteckt sein
* Nicht gesteckte Buchstaben bleiben unverändert

Wenn das in deiner Implementierung sauber umgesetzt ist, bist du sehr nah am historischen Verhalten.

---

## Wie die Entschlüsselung tatsächlich funktionierte

Die Enigma wurde nicht „geknackt“, indem man alles ausprobierte. Der entscheidende Ansatz war, dass man nie im Dunkeln suchte.

Man ging immer von etwas aus, das man zu kennen glaubte.

Diese bekannten oder vermuteten Textstellen nennt man „Cribs“. Typische Beispiele waren standardisierte Formulierungen, Wetterberichte oder militärische Floskeln. Sie tauchten immer wieder auf, oft zur gleichen Tageszeit oder in ähnlichem Kontext.

### Typische Crib-Phrasen

Einige häufig verwendete oder vermutete Begriffe waren:

* KEINE BESONDEREN EREIGNISSE
* WETTERVORHERSAGE
* WETTERBERICHT
* AN DIE GRUPPE
* HEIL HITLER
* OBERKOMMANDO
* LAGEBERICHT
* FUNKSPRUCH
* NACHRICHT
* MORGEN / ABEND / NACHT
* POSITION
* ANGRIFF / ABWEHR

Diese Phrasen waren nicht garantiert vorhanden, aber oft wahrscheinlich genug, um sie als Ansatzpunkt zu nutzen.

---

Sobald man ein solches Fragment annahm, konnte man es gegen den verschlüsselten Text legen und prüfen, ob es überhaupt möglich ist. Eine wichtige Eigenschaft der Enigma hilft dabei: Ein Buchstabe wird niemals auf sich selbst abgebildet.

Allein diese Regel eliminiert sofort viele falsche Annahmen.

Aus wenigen richtigen Annahmen wurde ein stark eingeschränkter Suchraum. Und erst dann kam maschinelle Unterstützung ins Spiel.

---

## Was mit „Angriffsmodus“ gemeint ist

Mit einem Angriffsmodus ist kein „Hack“ im modernen Sinn gemeint, sondern eine Perspektivänderung innerhalb deiner Anwendung.

Im normalen Modus nutzt man die Enigma wie damals:
Man kennt die Einstellungen und verschlüsselt oder entschlüsselt Text.

Im Angriffsmodus hingegen kennt man die Einstellungen nicht.

Stattdessen hat man:

* Einen verschlüsselten Text
* Eine Vermutung über ein Wort oder eine Phrase (ein Crib)

Die Anwendung würde dann systematisch prüfen:

* Welche Rotorstellungen könnten dieses Wort erzeugen?
* Welche Einstellungen sind ausgeschlossen, weil sie gegen Enigma-Regeln verstoßen?
* Welche wenigen Kandidaten bleiben übrig?

Ein solcher Modus könnte zum Beispiel:

* automatisch durch Rotorpositionen iterieren
* das „kein Buchstabe wird zu sich selbst“-Kriterium anwenden
* Treffer hervorheben, die plausiblen Klartext ergeben

Das Ziel ist nicht vollständige Automatisierung, sondern das Sichtbarmachen des eigentlichen Prinzips:
Entschlüsselung ist ein Prozess des Ausschließens, nicht des blinden Suchens.

---

## Warum diese Perspektive wichtig ist

Die ursprüngliche Frage nach der Dauer führt leicht in die Irre. Sie suggeriert, dass Zeit das zentrale Problem ist.

Historisch war es das nicht.

Der entscheidende Vorteil lag darin, dass man wusste, wonach man sucht.
Oder zumindest glaubte, es zu wissen.

Diese Anwendung kann genau diesen Unterschied zeigen:

Zwischen einer Maschine, die alles kann,
und einem System, das nur dann verständlich wird, wenn man gezielt Fragen stellt.

---

## Fazit

Aus der Frage „Wie lange dauert es?“ wird eine andere, interessantere Frage:

Was muss ich wissen, damit es überhaupt schnell geht?

Die Antwort darauf liegt nicht im Code allein, sondern in der Struktur der Enigma selbst.
Und genau diese Struktur wird in dieser Anwendung greifbar.

## Link
[https://enigma.tompeak.com Enigma by Tom Peak]
