# Prioritetai ir Darbų Eiga

## PIRMINIAI PRIORITETAI (Dabar)
1. Sutvarkyti booking sistemą:
   - Patikrinti rezervacijos formą
   - Užtikrinti, kad duomenys saugomi į Firestore
   - Patikrinti kalendoriaus veikimą
   - Validuoti laikų pasirinkimą

2. Sutvarkyti admin panelę:
   - Užsakymų sąrašo atvaizdavimas
   - Užsakymų statusų keitimas
   - Užsakymų filtravimas
   - Statistikos rodymas

3. Ištaisyti esamas klaidas:
   - Peržiūrėti Firebase emuliatorių logs
   - Sutvarkyti duomenų užkrovimo klaidas
   - Patikrinti visus kritinius komponentus
   - Užtikrinti stabilų veikimą su emuliatoriais

## ATIDĖTA VĖLESNIAM LAIKUI
1. ~~Autentifikacijos sistema~~
2. ~~UI/UX patobulinimai~~
3. ~~Mygtukų spalvos~~
4. ~~Navigacijos atnaujinimai~~

## Šiandien Atlikta (2024-03-21)
1. ✅ Atnaujinta Firebase konfigūracija
2. ✅ Sukurtas LoadingSpinner
3. ✅ Paleisti Firebase emuliatoriai
4. ✅ Peržiūrėti prioritetai

## Testavimo Prioritetai
1. Rezervacijos proceso testavimas
2. Admin panelės funkcionalumo testavimas
3. Duomenų išsaugojimo testavimas
4. Emuliatorių veikimo stabilumas

## Dokumentacija
1. Atnaujinti README su bazinėmis funkcijomis
2. Dokumentuoti žinomus bug'us
3. Aprašyti paleidimo instrukcijas

## Žinomi Bugs (Spręsti Dabar)
1. Duomenų užkrovimo klaidos
2. Emuliatorių ryšio problemos
3. Komponentų rendering klaidos

## Sprendimų Strategija
1. Pradėti nuo Firebase emuliatorių paleidimo
2. Naudoti Emulator UI debuginimui
3. Sekti error logs
4. Spręsti problemas pagal prioritetą:
   - Pirma: Duomenų išsaugojimas/užkrovimas
   - Antra: Admin panelės funkcionalumas
   - Trečia: Rezervacijos sistema 