<h2>Sécuriser sa branche</h2>

Une fois votre branche crée allé dans les [Repository Settings](https://gitlab.com/LdvcJcb/archiproject/-/settings/repository)
ou bien dans le menu de gauche Repository > Branches une fois sur la page cliquez sur le lien "project Settings".

Une fois sur la page <i>repository settings</i> aller dans la section <b>protected branches</b>

![tuto1](/images/1.png)

Cliquez sur <b>Expand</b> pour avoir accès au modification des branches

![tuto2](/images/2.png)

Vous aurez cette fenetre qui va apparaitre.

Séléctionné ensuite la branche que vous souhaité proteger

![tuto3](/images/3.jpg)

Ensuite les personnes ( ou les rôles ) pouvant effectuer un merge sur cette branche. A savoir le ou les personnes qui travailleront sur cette branche ( grosso modo celles qui sont assigné a l'US ).

<i>Préféré autoriser les profils plutots que les rôles</i>

![tuto4](/images/4.jpg)

<p>Et enfin choisissez les personnes pouvant effectuer un push sur votre branche encore une fois seul les personnes travaillant sur cette branche devront pouvoir faire un push dessus</p>

> N'oublié pas une fois votre branche mergé sur develop, vous pouvez supprimer votre branche (une case à cocher lorsque vous faite votre merge request) ou bien avec un la commande `git rm [nom_de_la_branche]`
