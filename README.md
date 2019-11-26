# ArchiProject

A project that will use api's !

1. [Méthode de travail](#methodedetravail)
2. [Architecture](#architecture) 



# Méthode de travail

Une US correspond à une branche, Créer une nouvelle branche depuis develop a chaque nouvelle US que vous prenderez

1. Une fois votre tâche (US) séléctionné et les devs liée a cette tâche terminé, il va falloir assigné une personne pour effectuer le code review ( la liste Pair review sur Trello)
2. Une fois le code relu et validé ( si la personne ayant relu le code détete des erreurs les developpeurs en charge du dev devront les corriger) il passe en test
3. Une fois les tests validé par le testeur mais aussi les PO le ticket est considéré comme done 
4. Rebelotte avec les autres US (N'oubliez pas de créer une nouvelle branche depuis develop et supprmer l'ancienne branche une fois celle ci mergé)


# Architecture

### Branches

**> Toujours se placer sur la branche develop avant de créer une nouvelle branche**


Afin de bien structurer le projet les branches seront structurées comme suit.

* **Master:** La branche de production, le rendu final. Sans bug
* **Develop:** la branche sur laquelle nous allons merger nos modifications via nos differentes branches
* **feature/[Nom-de-la-branche]:** le nom de la branche sur laquelle vous allez travailler 
*Par exemple si vous êtes en charge de l'affichage de la liste des utilisateurs la branche se nommera "feature/user-list" ou "feature/view-users-list"*

> Penser à sécuriser vos branches, une branche sécuriser c'est un arbre de sauvé 
>- Voltaire

[Tuto sécuriser sa branche](Tuto_branche.md)

Une fois le travail sur la branche terminé et celle ci mergé supprimé la branche, je repète une fois la branche MERGE sur develop vous pouvez la supprimer