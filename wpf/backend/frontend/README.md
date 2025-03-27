# UnderGroundArchive

Projekt indításához szükséges programok:

```html
<div classname="Programok">
  <ul>
    <li>Visual studio</li>
    <li>Visual Studio Code</li>
    <li>Xampp Control Panel</li>
  </ul>
</div>
```

Projekt indításának feltételei:

- Ajánlott klónozási folyamat:\
  &nbsp;

  - Fő mappa létrehozása: jobbklikk > új > mappa (Ajánlkott név: UnderGroundArchive)\
    &nbsp;
  - Almappák létrehozása: Frontend, Backend, WPF, Mobile\
    &nbsp;

- Fő mappa megnyitása cmd segítségével:\
  &nbsp;

  - 1.lépés: Útvonalsáv kijelölése (példa útvonal: D:\Prog\Vizsgaremek\Frontend\undergroundarchive_frontend)\
    &nbsp;
  - 2.lépés: Útvonalsáv kijelölése és tartalmának törlése\
    &nbsp;
  - 3.lépés: Az alábbi parancs beírása:\
    &nbsp;

  ```console
    cmd
  ```

  #### Ezáltal meg fog nyílni a cmd (parancssor) a projektünk fő mappájában és le tudjuk klónotni a repositoryjainkat az alábbi módon:

  <span style="color:Red; font-weight:bold; font-size:1.5rem;">FONTOS:</span>
  <span style="color:Red; font-weight:bold; font-size:1.2rem;">! Hozzuk létre előre a mappákat az anya mappában a gördülékenység végett </span> \
   &nbsp;

- Repok klónozása cmd-ből:

```console
Frontend:
  pushd .
  cd ./Frontend
  git clone https://github.com/Marcellnagy05/UnderGroundArchive_Frontend/
  popd
Backend:
  pushd .
  cd ./Backend
  git clone https://github.com/Marcellnagy05/UnderGroundArchive_Backend/
  popd
WPF:
  pushd .
  cd ./WPF
  git clone https://github.com/Marcellnagy05/UnderGroundArchive_WPF/
  popd
Mobile:
  pushd .
  cd ./Mobile
  git clone https://github.com/Marcellnagy05/UnderGroundArchive_Mobile/
  popd
```

- Az útvonal sávba felül belekattintani és a következőt beírni majd kitörölni:

```console
  D:\Prog\Vizsgaremek\Frontend\undergroundarchive_frontend
```

- Majd beírjuk, hogy:

```console
cmd
```

<span style="color:Red; font-weight:bold; font-size:1.5rem;">FONTOS:</span>
<span style="color:Red; font-weight:bold; font-size:1.2rem;">! Mindezek előtt telepitenünk kell a visual studio code-ot </span>

- ezután meg fog nyílni nekünk a parancssor amibe simán ennyit kell beirnunk:

```console
  code .
```

# Csapattagok és feladataik:

```js
const Frontend_Developer = new Developer("Nagy Marcell János", "Frontend");
const Backend_Developer = new Developer("Ötvös Ákos", "Backend");

Frontend_Developer.AddRole(".NetMauiApp_Developer");
Backend_Developer.AddRole("WPFApp_Developer");
Backend_Developer.AddRole("Jira");
```
