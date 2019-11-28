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

Tout d'abord nous allons créer le service qui lui importera le module HTTP et fera l'appelle necessaire à notre API

Lancer la commande suivante
``` bash
ng generate service position
```
Cela va créer le service ```position.service.ts```

Importer ensuite le module HTTPClient ainsi que notre ami Observable

``` typescript
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
```

Ensuite il nous faut injecter ( comme nous l'avons vu en cours ) dans le constructeur le module HTTP

``` typescript
constructor(private http: HttpClient) {}
```

Une fois injecter il nous reste plus qu'a créer notre fonction qui va nous permettre d'appeler l'API

```typescript
getPos(): Observable<any> {
    const url = 'https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=bornes-podotactiles';
    return this.http
      .get<any>(url)
      .pipe();
  }
```

Ici je fais un appelle GET tout simple je ne gere même pas les erreurs (flemme dsl). Il retourne un Observable de type any car je n'avais pas plus d'information sur l'api que j'utlise, 

NB : en typescript le type any permet de définir un type à une données dont on ne connait pas forcément le type et nous disons ainsi au transpiller que cet objet n'a aucun type nous pouvons donc effectuer tout type d'operation dessus

> <h5>Petite notion de clean code</h5>
> Ici j'ai définit l'url de l'api dans ma fonction, mais il serait préferable de la définir en dehors de la fonction si à l'avenir nous avons plusieur fonctions faisant appelle à cette url ( surement avec different parametres ), mais aussi dans le pipe() dans le quel nous pouvons definir la methode catchError()

Une fois notre fonction créer retournons a nor=tre composant *app.component.ts* et importons comme précedemment notre service que nous injecterons dans le contructeur

``` typescript
import { PositionService } from './position.service';
```

``` typescript
constructor(private positionService: PositionService) {}
````

Maintenant place au code en utilisant les methode de Leaflet.

Nous avons précedemment importé ```map``` qui est la libraire de leaflet nous allons maintenant utilisé certaine de ces méthode pour :

* créer une icone de marker avec une popup
* définir l'emplacement des marker récupérer depuis l'API

``` typescript
myIcon = map.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
    iconSize: [26, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
  });
```
Ici nous définissons notre icone avec la methode ```icon()``` de la librairie leaflet elle prend plusieurs paramètres :
* **iconUrl** : le chemin vers l'image de notre marker qui s'affichera sur lacarte
* **iconSize** : la taille en pixel de notre icon en [width, height] 
* **iconAnchor** : Le point "d'ancrage" de notre marker à savoir quel point de notre icone va "pointer" sur la map les coordonées sont en [x,y] et le point d'origine [0,0] se situe en en haut a gauche de l'iamge donc pour que notre image de 26x41 px aient un point d'ancrage en bas au milieu on lui donne les coordonnées suivant [13, 41] donc 13 pixel en partant de la gauche puis 41 pixel en partant du haut vers le bas 
* **popuAnchor** : Le point d'ancrage de la popup lorsque l'on clique dessus ici le point d'ancrage, le repère se fait par rapport au point d'iconAnchor definit précedemment 

> Voici le lien de la doc leaflet à ce sujet : [lien](https://leafletjs.com/examples/custom-icons/)

> Mais perso c'est ici que j'ai compris comment ca fonctionnait : [lien](https://stackoverflow.com/questions/46101450/explanation-of-leaflet-custom-icon-latlng-vs-xy-coordinates)

Une fois l'icon définit, appellons notre méthodes pour récupérer les emplacement a mettre sur la carte.

dans notre ```ngOnInit``` a la suite du code précedent ajoutons ce code 

``` typescript
this.positionService.getPos().subscribe((data: any) => {
      data.records.forEach(point => {
        map.marker(
            [
              point.geometry.coordinates[1],
              point.geometry.coordinates[0]
            ],
            { icon: this.myIcon }
          ).bindPopup('bla bla de la trottinette')
          .addTo(myMap);
      });
    });
```
```this.positionService.getPos().subscribe()``` ici nous appelons notre methode getPos du service que nous avons définis à la quel nous "souscrivons" maniere de recupérer le flux de données renvoyé par la methode ( pattern PubSub vu avec Herbault en Archi-Framework, )

ensuite nous récupérons la reponse de l'api dans ce que nous avons appellé ```data``` qui est un objet de type any et qui contient plusieurs information à savoir ```records``` et ```parameters```(actuellement vous ne pouvez pas savoir ce que retourne l'api si vous ne l'avez pas développé vous même ou consulté la doc de l'api ou alors tester directement en debuggant pour voir ce qui est retourné), 

Nous parcourons la données ```records``` avec un foreach ```records.foreach``` la données records contients les informations sur chaques points donc pour chaque points que nous récuperons nous ajoutons a notre carte ( que nous avons appelleé map ) comme ceci avec la methode ```marker()``` ```map.marker()```, qui prend en parametre les coordonées du points ainsi que l'icon que nous avons définis précedemment. ensuite nous utilisons la methode ```bindPopup()``` pour définir le text de la popup qui apparait au moment du clic sur le marker.

Et enfin avec la methode ```addTo()``` nous l'ajoutons à notre map ```myMap``` que nous avons définis précedemment.






