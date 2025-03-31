# UnderGroundArchive

Dokumentáció: https://github.com/akika47/UnderGroundArchive_Documentation
Dokumentáció futtatása:

```console
npm i

npm run dev

ctrl + klikk a linkre a konzolon.
```

Ha elakadsz akkor lejjebb görgetve a frontend dokumentáció menüpontra részletesebb segítséget találsz!

"Lépésről lépésre útmutató XAMPP, Visual Studio, Visual Studio Code, ngrok és npm telepítéséhez."


# Telepítési Útmutató

Ebben a dokumentumban lépésről lépésre bemutatjuk, hogyan telepítheted az alábbi eszközöket:

- XAMPP
- Visual Studio
- Visual Studio Code
- ngrok
- npm

## XAMPP telepítése

1. **Töltsd le a telepítőt:**
   - Nyisd meg a [XAMPP hivatalos weboldalát](https://www.apachefriends.org/index.html).
   - Válaszd ki az operációs rendszerednek megfelelő verziót (Windows, macOS, Linux).
   
2. **Futtasd a telepítőt:**
   - Indítsd el a letöltött `.exe` fájlt.
   - A telepítőben válaszd ki a szükséges komponenseket (**Kötelező:** Apache, MySQL).
   - Válaszd ki a telepítési helyet és fejezd be a telepítést.

3. **Indítsd el az XAMPP-ot:**
   - Nyisd meg a `XAMPP Control Panel`-t.
   - Indítsd el az `Apache` és `MySQL` modulokat.
   - Nyisd meg a böngészőben: `http://localhost/phpmyadmin` az adatbázis kezeléshez.

---

## Visual Studio telepítése

**Kötelező fejlesztői csomagok a visual studio-hoz:**
- Web & Cloud:
    - "ASP.Net and web developement"
- Desktop & Mobile:
    - ".NET desktop developement"
    - ".NET Multi-platform App UI developement"
- Other toolsets:
    - "Data storage and processing"

1. **Töltsd le a telepítőt:**
   - Látogass el a [Visual Studio hivatalos weboldalára](https://visualstudio.microsoft.com/).
   - Válaszd ki a szükséges verziót (Community, Professional, Enterprise).
   
2. **Telepítés:**
   - Futtasd a letöltött `.exe` fájlt.
   - Válaszd ki a szükséges fejlesztői csomagokat **Fontos!** A fent említett csomagok kötelezőek!
   - Kattints a `Telepítés` gombra és várd meg a folyamat végét.

3. **Indítás és konfiguráció:**
   - Indítsd el a Visual Studio-t és válassz egy előre beállított fejlesztői környezetet.
   - Ha szükséges, jelentkezz be a Microsoft fiókoddal.

---

## Visual Studio Code telepítése

1. **Töltsd le a telepítőt:**
   - Látogass el a [VS Code hivatalos weboldalára](https://code.visualstudio.com/).
   - Válaszd ki az operációs rendszerednek megfelelő verziót.

2. **Futtasd a telepítőt:**
   - Indítsd el a letöltött `.exe` fájlt.
   - Engedélyezd az összes ajánlott beállítást (pl. „Add to PATH”).
   - Kattints a `Telepítés` gombra.

3. **Bővítmények telepítése (opcionális):**
   - Nyisd meg a VS Code-ot és menj a `Extensions` (Bővítmények) fülre.
   - Keress rá a kívánt bővítményekre (pl. C#, Python, Prettier) és telepítsd őket.

---

## Ngrok telepítése

1. **Töltsd le a telepítőt:**
   - Nyisd meg az [ngrok hivatalos weboldalát](https://ngrok.com/download).
   - Válaszd ki az operációs rendszerednek megfelelő verziót.
   
2. **Telepítés:**
   - Kicsomagold az `ngrok.zip` fájlt egy tetszőleges helyre.
   - Nyisd meg a parancssort (CMD vagy PowerShell) és navigálj az `ngrok.exe` helyére.

3. **Fiók beállítása (opcionális, de ajánlott):**
   - Regisztrálj egy ingyenes fiókot az ngrok oldalán.
   - A bal oldali menüsávban keresd meg a `Your Authtoken` menüpontot és másold ki a saját authentikációs tokened **Fontos, hogy kimásold mert később szükség lesz rá.**

4. A program **használatáról** részletes leírást fogunk adni az [Alkalmazás Indítása 5. Mobil alkalmazás indítása](startup#3-lépés-mobil-alkalmazás-projekt-indítása) menüpontban 


## npm telepítése és használata

1. **Node.js telepítése (npm tartalmazza):**
   - Látogass el a [Node.js hivatalos weboldalára](https://nodejs.org/).
   - Válassz egy verziót:
     - `LTS` (hosszú távon támogatott) – ajánlott
     - `Current` (legújabb funkciók, de kevésbé stabil)
   - Telepítsd a letöltött `.msi` vagy `.pkg` fájlt.
   
2. **Ellenőrizd a telepítést:**
   - Nyiss egy parancssort vagy terminált és futtasd:
     ```sh
     node -v
     ```
     Ha sikeres, a kimenet például: `v18.16.0`
   - Majd futtasd:
     ```sh
     npm -v
     ```
     Ha sikeres, a kimenet például: `9.5.1`
   
3. **npm használata:**
   - Új projekt inicializálása:
     ```sh
     npm init -y
     ```
   - Csomag telepítése:
     ```sh
     npm install <csomag_neve>
     ```
   - Fejlesztési függőség telepítése:
     ```sh
     npm install <csomag_neve> --save-dev
     ```
   - Csomag frissítése:
     ```sh
     npm update
     ```
   - Csomag eltávolítása:
     ```sh
     npm uninstall <csomag_neve>
     ```

---

## Git telepítése

### Letöltés

``` markdown
- Hivatalos oldal: [https://git-scm.com/downloads](https://git-scm.com/downloads)
```

###  Telepítés

``` markdown
1. Futtasd a telepítőt.
2. A legtöbb beállítás maradhat alapértelmezett.
3. A `PATH` beállításnál válaszd: `Git from the command line and also from 3rd-party software`
4. Fejezd be a telepítést.
```

### Manuális használat (opcionális)

``` markdown
- Letöltheted a `PortableGit` verziót innen: [https://github.com/git-for-windows/git/releases](https://github.com/git-for-windows/git/releases)
- Csomagold ki egy mappába, és futtasd a `git-bash.exe` fájlt onnan.
```

---


##  7-Zip telepítése (opcionális/ajánlott)

>  **Csak akkor szükséges, ha nincs telepítve más fájlcsomagoló program** (pl. WinRAR vagy a Windows beépített ZIP-kezelője).

### Letöltés

- Látogass el a hivatalos weboldalra: [https://www.7-zip.org/](https://www.7-zip.org/)
- Válaszd ki a rendszeredhez illő verziót (32-bit vagy 64-bit).

###  Telepítés

1. Futtasd a letöltött `.exe` fájlt.
2. Kövesd a telepítő utasításait.
3. A végén kattints a `Finish` vagy `Befejezés` gombra.

### Manuális használat (opcionális)

Ha nem szeretnél teljes telepítést:

- Töltsd le a `7z.exe` és `7z.dll` fájlokat (portable verzió).
- Másold egy tetszőleges mappába.
- Innen parancssorból használhatod a `7z` parancsot például:

```bash
7z x file.7z

## Telepítések és előkészületek

A következő szoftverek telepítése szükséges a rendszer működéséhez. Ha már rendelkezel valamelyikkel, a telepítést kihagyhatod.

---

``` markdown
- Látogass el a hivatalos weboldalra: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Válaszd ki a legfrissebb stabil verziót.
```

###  Telepítés

``` markdown
1. Futtasd a letöltött telepítőt.
2. Fontos: Jelöld be az `Add Python to PATH` opciót a telepítés elején.
3. Kattints az `Install Now` gombra.
```

### Manuális telepítés (opcionális)

``` markdown
- Tömörítsd ki a letöltött `.exe` fájlt egy mappába (pl. 7-Zip segítségével).
- Futtasd a `python.exe` fájlt közvetlenül ebből a mappából.
```

---

##  WinRAR telepítése (opcionális)

>  **Szintén csak akkor szükséges, ha nincs más csomagolóprogramod.**

### Letöltés

```markdown
- Látogass el a hivatalos weboldalra: [https://www.rarlab.com/](https://www.rarlab.com/)
- Válaszd ki a nyelvet és verziót (pl. magyar, 64-bit).
```

###  Telepítés

```markdown
1. Futtasd a letöltött `winrar-x64-hu.exe` fájlt.
2. Válaszd ki a célmappát, majd kattints a `Telepítés` gombra.
3. A megjelenő ablakban állítsd be, hogy milyen fájltípusokat társítson a WinRAR.
4. Ha szeretnél, létrehozhatsz parancsikonokat az Asztalon vagy Start menüben.
5. Kattints az `OK` majd a `Kész` gombra.
```

### Megjegyzés

- A WinRAR 40 napos próbaverzióval indul, de a legtöbb funkció továbbra is elérhető a próbaidő után is.


Ez a dokumentum segít az alapvető telepítési lépések elvégzésében. Ha elakadnál, mindig érdemes a hivatalos dokumentációkat is átnézni!


# Telepítési Útmutató

## Repository klónozása

Klónozd le a [GITHUB](https://github.com/Marcellnagy05/UnderGroundArchive) repositoryt az alábbi módok egyike közül:

### 1. Lehetőség: Manuális letöltés
1. Nyisd meg a repositoryt: [GITHUB](https://github.com/Marcellnagy05/UnderGroundArchive).
2. A jobb oldali menüsávon kattints a zöld **CODE** gombra.
3. Válaszd a **Download ZIP** lehetőséget.
4. Miután a letöltés befejeződött, csomagold ki a tömörített állományt az alábbi lépésekkel:
   - Jobbklikk a letöltött ZIP fájlra.
   - Válassz egy megfelelő tömörítő programot (pl. WinRAR, 7-Zip), majd bontsd ki az állományt egy kívánt mappába.

### 2. Lehetőség: Git klónozás

1. Lépj be egy általad választott mappába. 
2. Felső sávon ahol az útvonal van. **Példa útvonal:** `D:\Prog\Vizsgaremek\UnderGroundArchive`
3. Kattints rá és írd be hogy **cmd** majd nyomj egy **entert**.
4. Ha a Git telepítve van a rendszereden, a konzolon keresztül is letöltheted a projektet az alábbi parancs futtatásával:
```sh
  git clone https://github.com/Marcellnagy05/UnderGroundArchive.git
```

Ez a parancs letölti a teljes repositoryt az aktuális munkakönyvtárba. Ezzel a projekt fileok letöltése befejeződött.

# Projekt előkészítése és indítása

Miután letöltötted az állományt és kicsomagoltad a következő lépés az hogy lépj bele a kicsomagolt mappába.
A mappa struktúrája a következő lesz:

```sh
$ tree UnderGroundArchive
    UnderGroundArchive/
    ┌⎯⎯ .github/     (Github mappa)
    ├── frontend/    (Frontend projekt)
    ├── backend/     (Backend projekt)
    ├── wpf/         (WPF projekt)
    └── mobile/      (Mobile projekt)
```
## Lépésenkét így néz ki a projekt indítása:

---

### 1. XAMPP (Adatbázis) elindítása:
    1. XAMPP program elindítása
    2. APACHE és MYSQL modul melletti start gomb megnyomása

> **Az adatbázis indítása befejeződött.**

### 2. Backend elindítása:
    1. Kiválasztjuk a backend mappát.
    2. A benne lévő `UnderGroundArchive_Backend.sln` file-ra duplán kattintva meg fog nyílni a `Visual Studio`.
    3. Amint megnyílt a legfelső sávon a zöld `➤ https` gombra kattintva elindul a backend.

> **A Backend alkalmazás indítása befejeződött.**

---

### 3. Frontend elindítása:
    1. Visual studio code (VSCode) elindítása.
    2. Bal felső sarokban a Fájl menüpontra kell kattintani.
    3. Ott a mappa megnyitására kell kattintani.
    4. Ki kell keresni azt a mappát ahová leklónoztuk/letöltöttük a projektet.
    5. A `frontend` mappára kattintva rá kell nyomni alul a **Megnyitás** gombra. Ezután meg fog nyilni a mappánk a VSCode-ban.
    6. Legfelső sávban a `Terminal` menüpontban, az **Új terminál megnyitása** gombra kell kattintani.
    7. A terminálba a következő parancsot kiadva:
    ```sh 
    npm i
    ```
    Telepűlni fognak a szükséges csomagok a projekt inditásához.
    8. A szükséges csomagok telepítése után a következő parancs kiadásával elindíthatjuk a **frontendünket**:
    ```sh
    npm run dev
    ```
    9. A terminálban meg fog jelenni a link a következő képpen:

    ```sh
    PS D:\Prog\Vizsgaremek\UnderGroundArchive\asd\UnderGroundArchive\frontend> npm run dev

    > undergroundarchive_frontend@0.0.0 dev
    > vite


    VITE v6.0.11  ready in 284 ms

    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose
    ➜  press h + enter to show help    
    ```
    10. a `CTRL` billentyűt nyomva tartva bal egérgombbal rákattintunk az alábbi linkre `http://localhost:5173/`.

> **A Frontend alkalmazás indítása befejeződött.**

---

### 4. Asztali alkalmazás indítása:
    1. A fő mappában lépj bele a `wpf` nevű mappába.
    2. Ezen a mappán belül lépj bele a `UnderGroundArchive_WPF` nevű mappába.
    3. Ezután kattints a `UnderGroundArchive_WPF.sln` filera duplán ezután el fog indulni a `Visual Studio`.
    4. A felső menüsávban a **➤ UnderGroundArchive_WPF** gombra kattintva el fog indulni az asztali alkalmazásunk.

> **Az Asztali alkalmazás indítása befejeződött.**
---

### 5. Mobil alkalmazás indítása:
    - A mobil alkalmazás indítása 4 lépésből fog állni:
        1. Az Első lépésben a `XAMPP` alkalmazást indítjuk el.
        2. A második lépésben `backend` alkalmazás elindítása.
        3. A harmadik lépésben pedig az `ngrok` nevezetű **api gateaway** programot fogjuk fel konfigurálni.
        4. A negyedik lépésben el fogjuk indítani a `mobil` alkalmazás projektünket.

    ##### 1. Lépés: **XAMPP** alkalmazás indítása a [1. XAMPP (Adatbázis) elindítása](#1-xampp-adatbázis-elindítása) pont alapján.

    ##### 2. Lépés: **Backend** alkalmazás indítása a [2. Backend elindítása:](#2-backend-elindítása) pont alapján.

    ##### 3. Lépés: **Ngrok** alkalmazás letöltése, telepítése, és konfigurálása
            1. Az alkalmazás letöltéséhez és telepítéséhez a segédlet a [Ngrok telepítése](installation#ngrok-telepítése) menüpontban található.
            2. Az Ngrok Konfigurálása a következőképpen történik:
                - Keressük meg az ngrok telepítési mappáját és nyissuk meg az `ngrok.exe` filet. Ezután meg fog jelenni egy termibál az alábbi módon:
                ```sh
                C:\Users\marci\OneDrive\Asztali gép\ngrok-v3-stable-windows-amd64>         
                ```
                - 
            3. A következő lépésben a parancssorba kell a következőket beírni **! Fontos hogy ebben a sorrendben:** 
            
            > **Fontos:** A parancssorban a tokened elé **NEM KELL** a dollár jel (`$`).
            ```sh
            ngrok config add-authtoken $A_KIMÁSOLT_AUTENTIKÁCIÓS_TOKENED          
            ``` 

            ```sh
            ngrok http https://localhost:7197            
            ```

            Ez meg fog nyitni egy "Kaput" a backendhez amivel a mobil alkalmazásunk fog tudni kommunikálni vele és adatokat lekérni. Ezután a parancssorod igy fog kinézni:

            ```sh
            ngrok
            Route traffic by anything: https://ngrok.com/r/iep
            Session Status      online
            Account             $SAJÁT_ACCOUNTOD
            Update              $VERZIÓ_FÜGGŐ
            Version             $SAJÁT_VERZIÓD
            Region              $SAJÁT_RÉGIÓ
            Latency             $SAJÁT_PING
            Web Intreface       http://127.0.0.1:4040
            Forwarding          $SAJÁT_NGROK_URL Példa url-> https://41a9-94-44-119-194.ngrok-free.app -> https://localhost:7197 
            ```

            4. A következő lépés, az hogy kimásolod a `Forwarding` linket;
            
    ####   5. Lépés: **Mobil** alkalmazás projekt indítása
    ##### 1. Mobil alkalmazás indítása előtti beállítások:
        1. Megnyitjuk a mobil alkalmazásunkat a `Undergroundarchive_Mobile.sln` filera duplán kattintva.
        2. A jobb oldali sávon meg fog nyílni egy **Solution Explorer** nevű menü.
        3. Megkeressük a `Services` mappát amit lenyitva ezt fogjuk látni:
        ```sh
        $ tree Services
        Services/
        ┌⎯⎯ ApiService.cs
        └── AuthService.cs
        ```
        4. Dupla kattintással megnyitjuk az `ApiService.cs`-t.
        5. A fileban erre a helyre kell másolnunk az előbb kimásolt `Ngrok` linkünket:
        ```c#
        //Másolás előtt:
        public ApiService()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(""); // <--- SAJÁT_NGROK_URL !!!

            // Statikus JWT token beállítása (csak teszteléshez)
            string jwtToken = "YOUR_JWT_TOKEN_HERE";  // Itt add meg a saját tokenedet!
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
        }

        //Másolás után:
        public ApiService()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://41a9-94-44-119-194.ngrok-free.app"); // <--- SAJÁT_NGROK_URL !!!

            // Statikus JWT token beállítása (csak teszteléshez)
            string jwtToken = "YOUR_JWT_TOKEN_HERE";  // Itt add meg a saját tokenedet!
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
        }
        ```
    ##### 2. A mobil alkalmazás indítása:

    ###### 1. Android emulátoron:
       
        >Ide jön majd az android emulátor configja 
    ###### 2. Saját eszközön:
        >**! Fontos: A saját eszközön való indítás CSAK androidos készüléken lehetséges.**

        1. Az android eszközünkön be kell lépnünk a beállításokba.
        2. Meg kell keressük az **Eszköz információk** menüpontot.
        3. Itt a **Build szám** menüpontot kell megkeressük, majd meg kell nyomjuk míg azt nem írja a készülék, hogy "Fejlesztői beállítások feloldva".
        4. Azután megkeressük a feloldott menüpontot, beírjuk a beállítások keresőjébe, vagy megkeressük a beállítások főoldalán.
        5. Miután megtaláltuk és rákattintottunk, itt a `Usb debugging` vagy `Usb hibakeresés` menüpontot kell keresnünk és engedélyeznünk kell azt.
        6. A következő lépés, a telefon rácsatlakoztatása **usb kábellel** a számítógépünkre amelyiken a projektet szeretnénk indítani.
        7. Az eszközön a felugró ablakokat mindet el kell fogadnunk és engedélyeznünk kell.
        8. Már nincs más dolgunk mint a a mobil projekten belül amit már megnyitottunk felül ahol el tudjuk indítani az alkalmazásunkat, a mellette lévő kis nyilat lenyitni.
        9. Lenyitás után olyat kell keressünk, hogy `Android Local Devices`, és itt ki kell választanunk az eszközünket
        10. Utolsó lépésként nem kell mást tennünk mint a nyíl melletti gombbal amivel a többi alkalmazást is indítottuk elindítjük az alkalmazásunkat.
    
> **A Mobil alkalmazás indítása befejeződött.**
