# Cours PSE

Application Windows pour parcourir et afficher les cours de PSE rangés dans un dossier Google Drive.
Elle n'a besoin que du **lien du dossier** : pas de compte à connecter, pas de Google Cloud, pas de logiciel Google sur le poste.

- **PDF** : affichés directement.
- **Word / PowerPoint / Excel** : convertis en PDF par Microsoft Office installé sur le poste (rendu fidèle).
- **Google Docs / Slides / Sheets** : exportés en PDF par Google.
- Recherche dans tout le dossier (sous-dossiers compris), plein écran, ouverture dans Word/PowerPoint, lien vers Drive.
- Hors connexion : les cours déjà ouverts restent consultables (dernière version gardée en cache).

## Mise en route

1. Dans Google Drive : clic droit sur le dossier des cours → **Partager** → Accès général : **Tous les utilisateurs disposant du lien** (Lecteur).
2. **Copier le lien**, lancer Cours PSE et le coller (menu ⚙ → « Changer de dossier des cours »).

Par défaut, l’appli ouvre le dossier « Cours PSE » de Ben (`DEFAULT_ROOT` dans `main.js`).

Toute personne qui a le lien peut consulter les cours (pas les modifier).

## Limites

- La liste des dossiers passe par la vue publique de Google Drive (`embeddedfolderview`), une page que Google ne documente pas.
  Si Google la modifie, il faudra adapter `listFolder()` dans `main.js`.
- Sans Microsoft Office sur le poste, seuls les PDF, Google Docs et images s'affichent.

## Développement

Node.js v26 (installé via Ronnie).

```sh
npm install
npm start        # lance l'application
npm run dist     # crée l'installateur dans dist/
```

Données de l'appli (réglages, cache des cours) : `%APPDATA%\Cours PSE`.

## Modules (jeux de « PSE en jeux »)

Le bouton « Les modules » de l'accueil ouvre les jeux d'entraînement de *PSE en jeux*
(même interface : niveaux, thématiques, difficulté, étoiles), sans connexion, sans espace
enseignant et sans évaluations. Les étoiles sont gardées sur le PC.

Les jeux et les programmes sont importés depuis `../Logiciel PSE en jeux/pse-jeux.html` :

```sh
npm run importer-jeux   # après avoir ajouté ou modifié des jeux dans pse-jeux.html
```

L'import est aussi relancé automatiquement par `npm run dist`.
Fichiers générés (ne pas modifier à la main) : `renderer/modules/data.js`, `renderer/modules/jeux.css`.
Le moteur des jeux est dans `renderer/modules/modules.js`.

### Classes et espace enseignant

Comme dans *PSE en jeux*, sans élèves ni identifiants :

- **Espace enseignant** (bouton « 👩‍🏫 Enseignant » dans les modules, accès direct sans mot de passe) :
  - **Classes** : créer, renommer, supprimer ; « Modules accessibles » pour choisir les modules de chaque classe ;
  - **Résultats** : moyenne /10 de chaque module pour chaque classe, détail par classe, dernières parties, export Excel/CSV ;
  - **Réglages** : dossier de données.
- **Élèves** : en ouvrant les modules, ils choisissent leur classe ; ils ne voient que ses modules et leurs résultats sont enregistrés pour elle.

Données dans le dossier **« Donnees PSE »** créé à côté de `Cours PSE.exe` (ou celui écrit dans
`dossier-donnees.txt` à côté du logiciel, par ex. un dossier partagé du lycée pour que tous les PC
partagent classes et résultats) :
`classes.json`, `resultats\<nom du PC>.json`.
Code : `jeux-donnees.js` (stockage) et `renderer/modules/modules.js` (interface).
