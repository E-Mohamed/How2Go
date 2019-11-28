# Tutorial Leaflet

Nous allons voir ici dans un premier temps comment intégrer une map Leaflet open source à son code, puis nous allos voir comment ajouter un 'marker' en récupérant des données via une api opensource à la carte.

1. [Intégrer une map](#integrerunemap)
2. [Ajouter des marker](#ajouterdesmarker)

## Intégrer une map

Afin d'intégrer une map dans votre appli web angular il faut dans un premier temps dans votre template de votre composant qui affichera la carte afficher le code ci dessous.

*Si vous souhaitez l'ajouter dans votre composant app alors ajouter ce code dans app.component.html*

``` html
<div id="map">
</div>
```
Ici nous definissons un Id ( que j'appelle 'map' mais vous pouvez l'appeller comme bon vous semble mais le nom doit respecter certaines norme ici notre div va contenir une carte leaflet donc l'ID doit être parlant (carte, leaflet, map ... ) )

Une fois le contenaire de notre map definis VOUS DEVEZ DEFINIR LE CSS de votre composant ( à savoir pour nous *app.component.scss* ), lui attribuer un width et un height

``` css
#map {
    height : 350px;
    width : 100%;
}
```

Une fois ceci prêt, dans le script de votre composant app *app.component.ts*
Dans un premier temps importer <b>Leaflet</b>

``` typescript
import * as map from 'leaflet';
```

puis à l'interieur de votre ```ngOnInit``` copiez ce code

``` typescript
ngOnInit() {
    const myMap = map.map('map').setView([48.936616, 2.324789], 13);

    // Pour les devs on peut faire des fonction privé et mettre
    // le code dedans puis appelé ces fonctions depuis le ngOnInit
    map
      .tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Moha Map'
      })
      .addTo(myMap);
}
```
Nous définissons dans un premier temps notre carte ```myMap``` dont nous settons la position initial en dur ( sans géolocalisation pour le moment features à venir) avec **setView** qui prend la latitude et la longitude en parametre puis le scale de notre carte ( le zoom sur la carte plus le chiffre est élevée plus le zoom est proche il me smeble la valeur max avec leaflet est 19 ou 20 je suis pas sûre de ca c'est a vérifié )

Ensuite nous ajoutons l'image de a carte à notre map  via tileLayer

Voilà à ce stade vous devriez avoir une map lors du lancement de votre appli (via la commande ng serve bien evidement)

## Ajouter des marker

Afin de rentre notre carte utile nous souhaitons ajouter des points  de repères situant les trottinette et scooter en libre service sur notre map. Pour cela nous récupererons via les API des forunisseurs respectives les coordonées necessaire, mais pour ce tuto nous appelerons une API externe libre d'accès renvoyant 10 positions corespondant a des "podotactile" ( ne me demandez pas je sais pas c'est quoi) sur la ville de Lille ( donc pour verifier vos résultats scrollez la carte jusqu'a Lille elle est actuellement centré chez moi )

Il faudrat pour ca

* Importer le HTTPmodule
* Créer le service qui va appeler l'api
* Récuperer les données dans notre composant
* Les afficher sur la carte




