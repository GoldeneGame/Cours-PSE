// Généré automatiquement par tools/importer-jeux.js — ne pas modifier à la main.
// Source : pse-jeux.html (18/11/2026 20:26:21)
'use strict';

const GAMES = {

/* ---------------- THÉMATIQUE A : capital santé ---------------- */
"sante-acteurs": {type:"match", title:"Qui fait quoi dans le système de santé ?", pairs:[
  ["Médecin traitant","Coordonne mon parcours de soins"],
  ["Pharmacien","Délivre les médicaments et conseille"],
  ["Assurance maladie (Sécurité sociale)","Rembourse une partie des frais de santé"],
  ["Complémentaire santé (mutuelle)","Rembourse tout ou partie du reste à charge"],
  ["Agence régionale de santé (ARS)","Pilote la politique de santé dans la région"],
  ["Infirmier(ère) scolaire","Accueille, écoute et oriente les élèves au lycée"]
]},
"sante-quiz": {type:"quiz", title:"Mon parcours de soins", questions:[
  {q:"À partir de quel âge doit-on déclarer un médecin traitant pour être bien remboursé ?", c:["12 ans","16 ans","18 ans","21 ans"], a:1, e:"Dès 16 ans, on déclare soi-même son médecin traitant pour respecter le parcours de soins coordonnés."},
  {q:"Que se passe-t-il si je consulte un spécialiste sans passer par mon médecin traitant (hors exceptions) ?", c:["Rien, c'est pareil","Je suis moins bien remboursé","La consultation est interdite","Je paie une amende"], a:1, e:"Hors parcours de soins, le remboursement de l'Assurance maladie est réduit (sauf gynécologue, ophtalmologue, psychiatre pour les 16-25 ans, dentiste…)."},
  {q:"Que permet la carte Vitale ?", c:["Payer ses achats","Être remboursé plus vite, sans feuille papier","Avoir des soins gratuits partout","Remplacer la carte d'identité"], a:1, e:"La carte Vitale transmet directement la feuille de soins électronique à l'Assurance maladie."},
  {q:"La Complémentaire santé solidaire (C2S) s'adresse à…", c:["Tout le monde","Les personnes aux ressources modestes","Les seuls étudiants","Les seuls retraités"], a:1, e:"La C2S est une complémentaire gratuite ou à faible coût, attribuée sous conditions de ressources."}
]},
"sommeil-quiz": {type:"quiz", title:"Le sommeil, un rythme biologique", questions:[
  {q:"Combien d'heures de sommeil sont recommandées pour un adolescent ?", c:["5 à 6 h","6 à 7 h","8 à 10 h","11 à 13 h"], a:2, e:"À l'adolescence, le besoin de sommeil se situe autour de 8 à 10 heures par nuit."},
  {q:"Quelle hormone favorise l'endormissement ?", c:["L'adrénaline","La mélatonine","L'insuline","Le cortisol"], a:1, e:"La mélatonine est sécrétée quand la lumière baisse : c'est l'hormone « signal de la nuit »."},
  {q:"Combien de temps dure environ un cycle de sommeil ?", c:["15 min","45 min","90 min","4 h"], a:2, e:"Une nuit compte 4 à 6 cycles d'environ 90 minutes (sommeil lent léger, lent profond, paradoxal)."},
  {q:"Pourquoi éviter les écrans juste avant de dormir ?", c:["Ils fatiguent les bras","Leur lumière bleue retarde la sécrétion de mélatonine","Ils font baisser la température","Aucune raison"], a:1, e:"La lumière bleue trompe l'horloge biologique et décale l'endormissement."},
  {q:"En hôtellerie-restauration, avec des horaires en coupure, quel est le meilleur conseil ?", c:["Faire une sieste de 2 h","Boire beaucoup de café le soir","Faire une sieste courte (20 min max) et garder des horaires réguliers","Dormir uniquement le week-end"], a:2, e:"Une sieste courte récupère sans perturber la nuit ; la régularité des horaires aide l'horloge biologique."}
]},
"sommeil-vf": {type:"vf", title:"Vrai ou faux : le sommeil", items:[
  {s:"Le rythme veille-sommeil dure environ 24 heures : c'est un rythme circadien.", v:true, e:"« Circa diem » = environ un jour."},
  {s:"On peut rattraper totalement une semaine de manque de sommeil en dormant tard le dimanche.", v:false, e:"La « dette de sommeil » se rattrape mal et décale l'horloge biologique."},
  {s:"Le manque de sommeil augmente le risque d'accident du travail.", v:true, e:"Baisse de vigilance, réflexes ralentis : coupures et brûlures sont plus fréquentes."},
  {s:"Le sommeil paradoxal est la phase où l'on rêve le plus.", v:true, e:"C'est la phase des rêves, avec des mouvements rapides des yeux."},
  {s:"Faire du sport intense juste avant de dormir aide toujours à s'endormir.", v:false, e:"Un effort intense le soir peut retarder l'endormissement ; mieux vaut le pratiquer plus tôt."}
]},
"activite-tri": {type:"tri", title:"Les bienfaits de l'activité physique", cats:["Physiques","Psychologiques","Sociaux"], items:[
  {t:"Renforce le cœur et les muscles",c:0},{t:"Aide à garder un poids de forme",c:0},{t:"Renforce les os",c:0},
  {t:"Réduit le stress",c:1},{t:"Améliore l'estime de soi",c:1},{t:"Favorise un meilleur sommeil",c:1},
  {t:"Permet de se faire des amis",c:2},{t:"Apprend le respect des règles et l'esprit d'équipe",c:2}
]},
"activite-quiz": {type:"quiz", title:"Bouger plus, rester moins assis", questions:[
  {q:"Selon l'OMS, combien de temps d'activité physique par jour pour un jeune de 5 à 17 ans ?", c:["15 min","30 min","60 min en moyenne","3 h"], a:2, e:"Au moins 60 minutes par jour en moyenne d'activité d'intensité modérée à soutenue."},
  {q:"Rester 3 heures assis devant une série, c'est…", c:["De l'inactivité physique","De la sédentarité","Du repos actif","Une activité modérée"], a:1, e:"La sédentarité = temps passé assis ou allongé éveillé. L'inactivité = ne pas atteindre les recommandations d'activité."},
  {q:"Pour un adulte, l'OMS recommande par semaine…", c:["30 min","Au moins 150 min d'activité modérée","10 h d'activité intense","Aucune recommandation"], a:1, e:"150 à 300 minutes d'activité d'endurance modérée par semaine."},
  {q:"Un serveur parcourt des kilomètres pendant son service. Est-ce suffisant comme activité physique ?", c:["Oui, totalement","Non, l'activité pro ne compte jamais","Ça compte en partie, mais il faut aussi des activités qui renforcent et détendent","Il doit arrêter tout sport"], a:2, e:"L'activité au travail compte, mais elle sollicite souvent les mêmes muscles : étirements et loisirs sportifs restent utiles."}
]},
"addictions-tri": {type:"tri", title:"Classer les conduites addictives", cats:["Substance licite","Substance illicite","Addiction sans substance"], items:[
  {t:"Tabac",c:0,e:"Licite mais vente interdite aux mineurs."},{t:"Alcool",c:0,e:"Licite mais vente interdite aux mineurs."},{t:"Caféine (boissons énergisantes)",c:0},
  {t:"Cannabis",c:1},{t:"Cocaïne",c:1},{t:"Ecstasy (MDMA)",c:1},
  {t:"Jeux d'argent en ligne",c:2},{t:"Jeux vidéo (usage excessif)",c:2},{t:"Réseaux sociaux (usage excessif)",c:2}
]},
"addictions-quiz": {type:"quiz", title:"Addictions : s'informer, se protéger", questions:[
  {q:"La vente d'alcool aux mineurs est…", c:["Autorisée à partir de 16 ans","Interdite","Autorisée pour la bière","Autorisée accompagné d'un adulte"], a:1, e:"Depuis 2009, la vente et l'offre d'alcool aux moins de 18 ans sont interdites. En restauration, on doit demander une preuve de majorité."},
  {q:"Qu'est-ce que la dépendance ?", c:["Consommer une fois","Ne plus pouvoir se passer d'un produit ou d'un comportement malgré ses effets négatifs","Aimer un produit","Avoir déjà goûté"], a:1, e:"On distingue dépendance physique (manque physique) et psychique (envie irrépressible)."},
  {q:"Quel numéro gratuit pour parler du tabac ?", c:["39 89 – Tabac Info Service","15","17","3114"], a:0, e:"Tabac Info Service : 39 89. Drogues Info Service : 0 800 23 13 13. Alcool Info Service : 0 980 980 930."},
  {q:"Dans une brigade de cuisine, un collègue boit pendant le service. Quel risque principal ?", c:["Aucun","Accidents (coupures, brûlures, chutes) pour lui et les autres","Meilleure efficacité","Il travaille plus vite"], a:1, e:"L'alcool diminue la vigilance et les réflexes : il augmente fortement le risque d'accident du travail."}
]},
"contraception-vf": {type:"vf", title:"Sexualité et contraception : vrai ou faux ?", items:[
  {s:"Le préservatif (externe ou interne) est la seule contraception qui protège aussi des IST.", v:true, e:"C'est pourquoi on parle de « double protection » : préservatif + autre contraception."},
  {s:"La contraception d'urgence (pilule du lendemain) est disponible en pharmacie sans ordonnance.", v:true, e:"Elle est gratuite et sans ordonnance pour toutes, à prendre le plus tôt possible après un rapport à risque."},
  {s:"Les préservatifs sont gratuits en pharmacie pour les moins de 26 ans.", v:true, e:"Depuis 2023, certains préservatifs sont délivrés gratuitement en pharmacie aux moins de 26 ans."},
  {s:"Avoir accepté une fois signifie qu'on est d'accord pour toutes les fois suivantes.", v:false, e:"Le consentement doit être libre, éclairé, et peut être retiré à tout moment."},
  {s:"La pilule contraceptive protège des infections sexuellement transmissibles.", v:false, e:"Non : elle évite la grossesse mais ne protège pas des IST."},
  {s:"On peut s'informer anonymement et gratuitement dans un centre de santé sexuelle.", v:true, e:"Les centres de santé sexuelle (ex-planning familial) accueillent gratuitement, y compris les mineurs."}
]},
"ist-vf": {type:"vf", title:"Les IST : vrai ou faux ?", items:[
  {s:"Une IST peut ne donner aucun symptôme.", v:true, e:"Ex. : la chlamydia est souvent silencieuse, d'où l'importance du dépistage."},
  {s:"Le VIH se transmet par un baiser ou en partageant un verre.", v:false, e:"Le VIH se transmet par le sang, les rapports sexuels non protégés et de la mère à l'enfant."},
  {s:"Il existe un vaccin contre les papillomavirus (HPV).", v:true, e:"Il est recommandé pour les filles et les garçons à partir de 11 ans."},
  {s:"On peut faire un test VIH en laboratoire sans ordonnance, pris en charge à 100 %.", v:true, e:"Depuis 2022, sans ordonnance ni rendez-vous. Les CeGIDD proposent aussi des dépistages gratuits."},
  {s:"Une IST guérie ne peut jamais revenir.", v:false, e:"On peut être de nouveau contaminé si l'on ne se protège pas."},
  {s:"Le préservatif réduit fortement le risque de transmission des IST.", v:true, e:"C'est le moyen de prévention de référence, avec le dépistage et la vaccination."}
]},
"alimentation-match": {type:"match", title:"Les nutriments et leurs rôles", pairs:[
  ["Glucides (féculents, fruits)","Fournissent l'énergie rapidement utilisable"],
  ["Protéines (viande, poisson, œufs, légumineuses)","Construisent et réparent les tissus"],
  ["Lipides (huiles, beurre)","Énergie et réserves ; certains sont indispensables (oméga 3)"],
  ["Fibres (légumes, céréales complètes)","Facilitent le transit intestinal"],
  ["Calcium (produits laitiers)","Solidité des os et des dents"],
  ["Eau","Hydrate et régule la température du corps"]
]},
"alimentation-quiz": {type:"quiz", title:"Bien manger quand on travaille en restauration", questions:[
  {q:"Combien de portions de fruits et légumes recommande-t-on par jour ?", c:["1","Au moins 5","10","Aucune recommandation"], a:1, e:"Repère du Programme national nutrition santé (PNNS) : au moins 5 fruits et légumes par jour."},
  {q:"Un commis prend son repas debout en 5 minutes entre deux services. Quel conseil ?", c:["Sauter le repas","Prévoir un vrai repas équilibré, assis, aux horaires de la brigade","Grignoter les restes","Boire un soda"], a:1, e:"Le repas du personnel est un moment important : équilibré, régulier et pris au calme."},
  {q:"Quelle boisson privilégier pendant le service ?", c:["Soda","Boisson énergisante","Eau","Café toutes les heures"], a:2, e:"L'eau est la seule boisson indispensable ; en cuisine il fait chaud, il faut s'hydrater régulièrement."},
  {q:"Pourquoi éviter de sauter le petit-déjeuner ?", c:["Ce n'est pas important","Il apporte l'énergie pour la matinée et évite les coups de fatigue","Il fait grossir","Il remplace le déjeuner"], a:1, e:"Après le jeûne de la nuit, le petit-déjeuner évite la baisse de vigilance et le grignotage."}
]},
"stress-tri": {type:"tri", title:"Reconnaître les signes du stress", cats:["Physiques","Émotionnels / psychologiques","Comportementaux"], items:[
  {t:"Maux de tête",c:0},{t:"Cœur qui bat vite",c:0},{t:"Tensions musculaires",c:0},
  {t:"Irritabilité, nervosité",c:1},{t:"Difficultés de concentration",c:1},{t:"Anxiété",c:1},
  {t:"Troubles du sommeil",c:2},{t:"Consommation accrue de café ou de tabac",c:2},{t:"Isolement des collègues",c:2}
]},
"stress-quiz": {type:"quiz", title:"Gérer le stress au quotidien", questions:[
  {q:"Quelles hormones sont libérées en situation de stress ?", c:["Mélatonine et insuline","Adrénaline et cortisol","Œstrogènes","Hormone de croissance"], a:1, e:"L'adrénaline prépare l'action immédiate, le cortisol mobilise l'énergie sur la durée."},
  {q:"Le stress peut-il être positif ?", c:["Jamais","Oui, ponctuellement il peut stimuler et motiver","Toujours","Seulement la nuit"], a:1, e:"Un stress ponctuel aide à se mobiliser (examen, coup de feu). C'est le stress chronique qui est nocif."},
  {q:"Pendant le « coup de feu » en cuisine, quelle stratégie aide le plus ?", c:["Crier sur les collègues","Bien préparer sa mise en place et respirer calmement","Accélérer sans vérifier","Quitter son poste"], a:1, e:"Anticiper (mise en place), s'organiser et respirer lentement réduisent la pression."},
  {q:"Laquelle n'est PAS une bonne stratégie face au stress ?", c:["Faire du sport","En parler à quelqu'un","Augmenter sa consommation d'alcool","Bien dormir"], a:2, e:"L'alcool ou les drogues soulagent à court terme mais aggravent la situation."}
]},
"secu-alim-quiz": {type:"quiz", title:"Sécurité alimentaire en cuisine", questions:[
  {q:"À quelle température conserve-t-on les produits surgelés ?", c:["0 °C","-5 °C","-18 °C ou moins","+4 °C"], a:2, e:"Les produits surgelés doivent être conservés à -18 °C ou moins."},
  {q:"En liaison chaude, un plat doit être maintenu à…", c:["+30 °C","+45 °C","+63 °C minimum","+100 °C"], a:2, e:"Au-dessus de +63 °C, la multiplication des bactéries est freinée."},
  {q:"Le refroidissement rapide d'un plat cuisiné doit passer de +63 °C à +10 °C en…", c:["Moins de 2 heures","Moins de 6 heures","Une nuit","24 heures"], a:0, e:"En cellule de refroidissement : moins de 2 h pour traverser la zone où les bactéries se multiplient."},
  {q:"Que signifie « DLC » ?", c:["Date limite de cuisson","Date limite de consommation","Date de livraison client","Durée légale de conservation"], a:1, e:"Après la DLC (« à consommer jusqu'au »), le produit ne doit plus être consommé. La DDM (« de préférence avant ») concerne surtout le goût."},
  {q:"Qu'est-ce qu'une TIAC ?", c:["Une technique de cuisson","Une toxi-infection alimentaire collective","Un label bio","Une norme d'hygiène des mains"], a:1, e:"Au moins 2 cas de symptômes similaires (souvent digestifs) dus à un même aliment."},
  {q:"Combien d'allergènes majeurs doivent être signalés aux clients ?", c:["4","8","14","30"], a:2, e:"14 allergènes réglementaires (gluten, lait, œufs, arachides, fruits à coque, poissons, crustacés…)."}
]},
"secu-alim-vf": {type:"vf", title:"Hygiène : vrai ou faux ?", items:[
  {s:"La « marche en avant » évite que le propre croise le sale.", v:true, e:"Les denrées avancent du sale vers le propre, sans retour en arrière."},
  {s:"On peut recongeler un produit décongelé sans risque.", v:false, e:"Pendant la décongélation, les bactéries se sont multipliées ; on ne recongèle pas un produit décongelé cru."},
  {s:"Les œufs crus peuvent transmettre des salmonelles.", v:true, e:"D'où les précautions pour la mayonnaise, la mousse au chocolat, le tiramisu…"},
  {s:"Se laver les mains n'est utile qu'en arrivant au travail.", v:false, e:"Il faut se laver les mains à chaque changement de tâche, après les toilettes, après avoir touché des déchets ou des produits crus."},
  {s:"Un produit qui sent bon est forcément sans danger.", v:false, e:"Beaucoup de bactéries pathogènes ne modifient ni l'odeur ni le goût."}
]},

/* ---------------- THÉMATIQUE B : environnement ---------------- */
"labels-match": {type:"match", title:"Les labels de l'alimentation durable", pairs:[
  ["AB – Agriculture biologique","Sans pesticides ni engrais chimiques de synthèse"],
  ["Label Rouge","Qualité gustative supérieure"],
  ["AOP","Produit lié à un terroir et à un savoir-faire"],
  ["MSC","Poisson issu d'une pêche durable"],
  ["Commerce équitable","Rémunération juste des producteurs"]
]},
"saison-tri": {type:"tri", title:"En hiver, de saison ou pas ?", cats:["De saison en hiver","Hors saison en hiver"], items:[
  {t:"Poireau",c:0},{t:"Chou",c:0},{t:"Potiron",c:0},{t:"Pomme",c:0},{t:"Clémentine",c:0},{t:"Endive",c:0},
  {t:"Tomate",c:1,e:"Fruit d'été : en hiver elle vient de serres chauffées ou de loin."},{t:"Fraise",c:1},{t:"Courgette",c:1},{t:"Melon",c:1}
]},
"ecoresp-quiz": {type:"quiz", title:"Alimentation écoresponsable", questions:[
  {q:"Environ combien de tonnes de nourriture sont gaspillées chaque année en France ?", c:["10 000 t","1 million de t","10 millions de t","1 milliard de t"], a:2, e:"Selon l'ADEME, environ 10 millions de tonnes par an, sur toute la chaîne (production, distribution, restauration, foyers)."},
  {q:"Qu'est-ce qu'un circuit court ?", c:["Un menu rapide","Au plus un intermédiaire entre le producteur et le consommateur","Un plat cuit vite","Un produit importé par avion"], a:1, e:"Moins d'intermédiaires = producteur mieux rémunéré et souvent moins de transport."},
  {q:"En restauration, quel geste limite le gaspillage ?", c:["Servir de très grosses portions","Adapter les portions et proposer le « doggy bag »","Jeter les épluchures sans trier","Cuisiner toujours le double"], a:1, e:"Ajuster les quantités, valoriser les restes, proposer d'emporter : ce sont des gestes anti-gaspi."},
  {q:"La loi EGalim impose en restauration collective…", c:["100 % de produits importés","Au moins 50 % de produits durables et de qualité, dont 20 % bio","Des menus sans légumes","Uniquement des plats surgelés"], a:1, e:"Objectif de 50 % de produits durables et de qualité, dont au moins 20 % de produits bio."}
]},
"risques-tri": {type:"tri", title:"Naturel ou technologique ?", cats:["Risque naturel","Risque technologique"], items:[
  {t:"Inondation",c:0},{t:"Séisme",c:0},{t:"Tempête",c:0},{t:"Feu de forêt",c:0},{t:"Avalanche",c:0},
  {t:"Accident nucléaire",c:1},{t:"Explosion d'une usine chimique",c:1},{t:"Rupture de barrage",c:1},{t:"Accident de transport de matières dangereuses",c:1}
]},
"risques-quiz": {type:"quiz", title:"Réagir face à un risque majeur", questions:[
  {q:"À quoi ressemble le signal national d'alerte (sirène) ?", c:["Un bip court","Un son montant et descendant, 3 fois 1 min 41 s","Une musique","Un son continu de 30 s"], a:1, e:"Le son continu de 30 s annonce la fin de l'alerte."},
  {q:"Pendant l'alerte, que faut-il éviter ?", c:["Se mettre à l'abri","Écouter la radio","Aller chercher les enfants à l'école","Suivre les consignes"], a:2, e:"Les enfants sont pris en charge par l'école ; se déplacer exposerait les parents et encombrerait les routes."},
  {q:"Comment s'appelle le système qui envoie des alertes sur les téléphones en France ?", c:["FR-Alert","SMS Météo","Alerte Info","112-Push"], a:0, e:"FR-Alert envoie une notification à tous les téléphones présents dans une zone en danger."},
  {q:"Qu'est-ce qu'un risque majeur ?", c:["Un risque fréquent sans gravité","Un événement rare mais très grave pour les personnes, les biens et l'environnement","Une petite panne","Un accident de cuisine"], a:1, e:"Faible fréquence, énorme gravité : c'est la définition du risque majeur."}
]},
"bruit-quiz": {type:"quiz", title:"Le bruit au quotidien", questions:[
  {q:"Quelle est l'unité du niveau sonore ?", c:["Le hertz","Le décibel dB(A)","Le watt","Le lux"], a:1, e:"Le décibel mesure l'intensité sonore ; le hertz mesure la fréquence (grave/aigu)."},
  {q:"À partir de quel niveau sur une journée de travail l'employeur doit-il fournir des protections auditives ?", c:["40 dB(A)","60 dB(A)","80 dB(A)","130 dB(A)"], a:2, e:"Dès 80 dB(A) sur 8 h, protections à disposition ; à 85 dB(A), leur port est obligatoire."},
  {q:"Le seuil de douleur se situe vers…", c:["50 dB(A)","80 dB(A)","120 dB(A)","200 dB(A)"], a:2, e:"Vers 120 dB(A), le son devient douloureux et peut léser l'oreille immédiatement."},
  {q:"Que signifie +3 dB ?", c:["Rien de notable","L'énergie sonore est doublée","Le bruit est divisé par deux","Le son devient aigu"], a:1, e:"L'échelle est logarithmique : +3 dB = deux fois plus d'énergie sonore."},
  {q:"Quel trouble peut apparaître après une exposition à un bruit trop fort ?", c:["Acouphènes (sifflements)","Myopie","Allergie","Carie"], a:0, e:"Acouphènes et perte d'audition peuvent devenir définitifs."}
]},
"bruit-match": {type:"match", title:"Associer la source au niveau sonore", pairs:[
  ["Chuchotement","≈ 30 dB(A)"],
  ["Conversation au restaurant","≈ 60 dB(A)"],
  ["Cuisine pendant le coup de feu","≈ 80–85 dB(A)"],
  ["Concert ou discothèque","≈ 100–105 dB(A)"],
  ["Avion au décollage (proche)","≈ 130 dB(A)"]
]},
"eau-quiz": {type:"quiz", title:"L'eau, une ressource à préserver", questions:[
  {q:"Quelle part de l'eau sur Terre est de l'eau douce ?", c:["Moins de 3 %","25 %","50 %","97 %"], a:0, e:"Environ 97 % de l'eau est salée ; une petite partie de l'eau douce seulement est facilement accessible."},
  {q:"Combien de litres d'eau un Français utilise-t-il en moyenne par jour à la maison ?", c:["10 L","Environ 150 L","500 L","1 000 L"], a:1, e:"Environ 150 L par jour, dont la plus grande part pour l'hygiène et les toilettes."},
  {q:"Où l'eau du robinet est-elle rendue potable ?", c:["Station d'épuration","Usine de production d'eau potable","Château d'eau","Barrage"], a:1, e:"L'usine de potabilisation traite l'eau ; la station d'épuration nettoie les eaux usées avant rejet."},
  {q:"En plonge, quel geste économise l'eau ?", c:["Laisser couler le robinet","Faire tourner le lave-vaisselle à moitié vide","Remplir le lave-vaisselle et racler les assiettes à sec","Rincer chaque verre à l'eau chaude"], a:2, e:"Débarrasser à sec et ne lancer que des machines pleines réduit fortement la consommation."},
  {q:"Une douche de 5 min consomme environ…", c:["5 L","60 à 80 L","300 L","1 000 L"], a:1, e:"Un bain consomme environ 150 à 200 L : la douche courte est plus économe."}
]},
"energie-tri": {type:"tri", title:"Renouvelable ou pas ?", cats:["Énergie renouvelable","Énergie non renouvelable"], items:[
  {t:"Solaire",c:0},{t:"Éolien",c:0},{t:"Hydraulique",c:0},{t:"Géothermie",c:0},{t:"Biomasse (bois)",c:0},
  {t:"Pétrole",c:1},{t:"Charbon",c:1},{t:"Gaz naturel",c:1},{t:"Uranium (nucléaire)",c:1,e:"L'uranium est une ressource minérale épuisable, même si le nucléaire émet peu de CO₂."}
]},
"energie-quiz": {type:"quiz", title:"Économiser l'énergie à l'hôtel et au restaurant", questions:[
  {q:"À l'hôtel, la carte magnétique à insérer dans la chambre sert à…", c:["Décorer","Couper l'électricité quand le client sort","Ouvrir le minibar","Appeler la réception"], a:1, e:"Lumières et climatisation s'éteignent quand le client quitte la chambre."},
  {q:"Quelle lampe consomme le moins ?", c:["Halogène","Incandescente","LED","Néon ancien"], a:2, e:"Les LED consomment jusqu'à 80 % de moins que les ampoules à incandescence."},
  {q:"Sur l'étiquette énergie d'un appareil, la classe la plus économe est…", c:["A","D","G","Z"], a:0, e:"L'échelle va de A (le plus économe) à G."},
  {q:"En cuisine, quel geste réduit la consommation d'énergie ?", c:["Laisser les fours allumés toute la journée","Couvrir les casseroles et éteindre les appareils inutilisés","Ouvrir souvent la chambre froide","Mettre un plat chaud dans le réfrigérateur sans le refroidir"], a:1, e:"Couvrir une casserole permet de chauffer plus vite avec moins d'énergie."},
  {q:"La combustion des énergies fossiles libère surtout…", c:["De l'oxygène","Du CO₂, un gaz à effet de serre","De l'eau pure","De l'azote"], a:1, e:"Le CO₂ renforce l'effet de serre et le réchauffement climatique."}
]},

/* ---------------- THÉMATIQUE C : milieu professionnel ---------------- */
"sst-tri": {type:"tri", title:"Les enjeux de la santé et sécurité au travail", cats:["Humains","Économiques","Juridiques"], items:[
  {t:"Douleur et handicap pour la victime",c:0},{t:"Souffrance de la famille",c:0},{t:"Dégradation du climat dans l'équipe",c:0},
  {t:"Coût des soins et des indemnités",c:1},{t:"Perte de production, remplacement du salarié",c:1},{t:"Atteinte à l'image de l'établissement",c:1},
  {t:"Obligation de sécurité de l'employeur",c:2},{t:"Sanctions pénales en cas de faute",c:2}
]},
"sst-quiz": {type:"quiz", title:"Santé et sécurité au travail : l'essentiel", questions:[
  {q:"Qu'est-ce qu'un accident du travail ?", c:["Un accident survenu pendant les vacances","Un accident survenu par le fait ou à l'occasion du travail","Une maladie liée à l'âge","Un retard"], a:1, e:"Il survient soudainement, au temps et au lieu de travail, et provoque une lésion."},
  {q:"Les jeunes de moins de 25 ans sont-ils plus touchés par les accidents du travail ?", c:["Non, moins","Oui, surtout en début d'emploi","Ils ne peuvent pas avoir d'accident","Seulement les apprentis en bureau"], a:1, e:"Manque d'expérience et méconnaissance des risques : les premiers mois sont les plus dangereux."},
  {q:"Qui a l'obligation d'assurer la sécurité et de protéger la santé des salariés ?", c:["Le client","L'employeur","Le fournisseur","La mairie"], a:1, e:"L'employeur a une obligation générale de sécurité (Code du travail). Le salarié doit aussi prendre soin de sa sécurité et de celle des autres."},
  {q:"En hôtellerie-restauration, quel accident est le plus fréquent ?", c:["Chute de plain-pied, glissade","Électrocution","Noyade","Chute d'avion"], a:0, e:"Sols mouillés ou gras, précipitation : les chutes de plain-pied, coupures et brûlures dominent."}
]},
"notions-match": {type:"match", title:"Le vocabulaire de la prévention (exemple en cuisine)", pairs:[
  ["Danger","Le couteau tranchant"],
  ["Situation dangereuse","Le commis émince des oignons avec ce couteau"],
  ["Événement déclencheur","Le couteau glisse sur l'oignon"],
  ["Dommage","Coupure profonde à l'index"],
  ["Mesure de prévention","Planche antidérapante et technique de la griffe"],
  ["Mesure de protection individuelle","Gant anti-coupure"]
]},
"notions-quiz": {type:"quiz", title:"Du danger au dommage", questions:[
  {q:"Qu'est-ce qu'un danger ?", c:["La probabilité d'un accident","Ce qui a la capacité de causer un dommage","La blessure elle-même","L'assurance"], a:1, e:"Le danger est une propriété : un produit corrosif, une friteuse chaude, un sol glissant…"},
  {q:"Une situation dangereuse apparaît quand…", c:["Il n'y a personne","Une personne est exposée à un danger","Le danger a disparu","On porte des gants"], a:1, e:"Danger + personne exposée = situation dangereuse."},
  {q:"Parmi ces mesures, laquelle est la plus efficace ?", c:["Porter des gants","Afficher une consigne","Supprimer le danger à la source","Prévenir le collègue"], a:2, e:"On commence par supprimer ou réduire le danger (prévention intrinsèque), puis la protection collective, puis individuelle."},
  {q:"Une hotte d'aspiration en cuisine est une protection…", c:["Individuelle","Collective","Juridique","Inutile"], a:1, e:"Elle protège toutes les personnes présentes : c'est une protection collective."}
]},
"acteurs-match": {type:"match", title:"Les acteurs de la prévention", pairs:[
  ["Employeur","Évalue les risques et met en place la prévention"],
  ["Salarié","Prend soin de sa santé et de celle des autres"],
  ["Inspection du travail","Contrôle l'application du Code du travail"],
  ["Médecin du travail (SPST)","Surveille la santé des salariés"],
  ["CSE","Représente les salariés, notamment pour la santé et la sécurité"],
  ["CARSAT","Conseille les entreprises et gère les AT/MP"],
  ["INRS","Produit études et documents de prévention"]
]},
"egalite-vf": {type:"vf", title:"Égalité de traitement au travail : vrai ou faux ?", items:[
  {s:"Refuser un candidat à cause de son nom ou de son origine est une discrimination punie par la loi.", v:true, e:"La loi interdit plus de 25 critères de discrimination (origine, sexe, âge, handicap, apparence…)."},
  {s:"Un employeur peut payer moins une femme qu'un homme pour le même travail.", v:false, e:"À travail égal, salaire égal : c'est une obligation légale."},
  {s:"Exiger une tenue professionnelle (uniforme de salle) est une discrimination.", v:false, e:"Une exigence justifiée par la nature du poste et proportionnée est autorisée."},
  {s:"Le Défenseur des droits peut être saisi gratuitement par une victime de discrimination.", v:true, e:"Il peut aider la victime, enquêter et proposer des solutions."},
  {s:"Le harcèlement sexuel au travail est puni par la loi.", v:true, e:"Il est sanctionné par le Code pénal et le Code du travail ; l'employeur doit le prévenir."},
  {s:"Un salarié en situation de handicap n'a pas le droit d'occuper un poste en hôtellerie.", v:false, e:"Au contraire, l'employeur doit prévoir des aménagements raisonnables du poste."}
]},
"prevention-tri": {type:"tri", title:"Classer les mesures de prévention", cats:["Supprimer / réduire le danger","Protection collective","Protection individuelle (EPI)","Formation / information"], items:[
  {t:"Remplacer un détergent corrosif par un produit moins dangereux",c:0},{t:"Utiliser un coupe-légumes à la place du couteau",c:0},
  {t:"Sol antidérapant en cuisine",c:1},{t:"Hotte d'aspiration",c:1},{t:"Chariot pour transporter les casiers",c:1},
  {t:"Chaussures de sécurité antidérapantes",c:2},{t:"Gants de protection pour la plonge",c:2},
  {t:"Formation gestes et postures",c:3},{t:"Affichage des consignes de sécurité",c:3}
]},
"duerp-quiz": {type:"quiz", title:"Analyser les risques professionnels", questions:[
  {q:"Que signifie DUERP ?", c:["Document unique d'évaluation des risques professionnels","Diplôme universitaire","Déclaration d'urgence","Dossier unique d'embauche"], a:0, e:"Il recense les risques de chaque unité de travail et les actions de prévention."},
  {q:"Le DUERP est obligatoire…", c:["À partir de 50 salariés","Dès le premier salarié","Seulement dans l'industrie","Jamais"], a:1, e:"Toute entreprise employant au moins un salarié doit le rédiger et le tenir à jour."},
  {q:"On évalue un risque principalement à partir de…", c:["Sa couleur","Sa gravité et sa fréquence (probabilité)","Son prix","L'avis du client"], a:1, e:"Gravité × fréquence permet de hiérarchiser les risques et de choisir les priorités."},
  {q:"Quel est le premier des principes généraux de prévention ?", c:["Porter des EPI","Éviter les risques","Former les salariés","Afficher les consignes"], a:1, e:"Les 9 principes de prévention commencent par « éviter les risques », puis évaluer ceux qui ne peuvent être évités."}
]},
"pictos-match": {type:"match", title:"Les pictogrammes des produits chimiques", pairs:[
  ["🔥 Flamme","Inflammable"],
  ["🧪 Corrosion (main et surface rongées)","Brûle la peau, les yeux, les métaux"],
  ["❗ Point d'exclamation","Irritant, nocif, allergisant"],
  ["☠️ Tête de mort","Toxique, peut tuer rapidement"],
  ["🧍 Silhouette étoilée","Dangers graves pour la santé (cancer, mutation…)"],
  ["🐟 Arbre et poisson","Dangereux pour l'environnement aquatique"],
  ["🛢️ Bouteille de gaz","Gaz sous pression"]
]},
"chimique-vf": {type:"vf", title:"Produits d'entretien : vrai ou faux ?", items:[
  {s:"Mélanger de l'eau de Javel avec un détartrant acide peut dégager un gaz toxique.", v:true, e:"Il se dégage du chlore gazeux, très irritant pour les voies respiratoires. Ne jamais mélanger."},
  {s:"On peut transvaser un produit dans une bouteille d'eau vide pour gagner de la place.", v:false, e:"Risque d'ingestion par erreur ! Un produit reste dans son emballage d'origine, étiqueté."},
  {s:"La fiche de données de sécurité (FDS) indique les dangers et les précautions d'emploi.", v:true, e:"L'employeur doit la tenir à disposition des salariés."},
  {s:"Plus on met de produit, mieux on nettoie.", v:false, e:"Il faut respecter le dosage : un surdosage augmente le risque sans améliorer le nettoyage."},
  {s:"Le port de gants et de lunettes est recommandé pour manipuler un produit corrosif.", v:true, e:"Ce sont des équipements de protection individuelle adaptés au risque chimique."}
]},
"suivi-sante-vf": {type:"vf", title:"Le suivi de la santé au travail", items:[
  {s:"Tout salarié bénéficie d'une visite d'information et de prévention (VIP) après son embauche.", v:true, e:"Elle a lieu en principe dans les 3 mois suivant la prise de poste."},
  {s:"Pour un mineur ou un travailleur de nuit, cette visite a lieu avant la prise de poste.", v:true, e:"Ces salariés bénéficient d'un suivi renforcé dès l'affectation."},
  {s:"Le médecin du travail est payé par le salarié.", v:false, e:"Le service de prévention et de santé au travail est financé par l'employeur ; la visite est gratuite pour le salarié."},
  {s:"Le médecin du travail peut proposer un aménagement de poste.", v:true, e:"Il peut proposer des aménagements ou déclarer une inaptitude."},
  {s:"Le médecin du travail raconte à l'employeur les maladies du salarié.", v:false, e:"Il est tenu au secret médical ; il transmet seulement un avis (apte, aménagement, inapte)."},
  {s:"Certaines vaccinations peuvent être recommandées selon le métier exercé.", v:true, e:"Le médecin du travail conseille sur les vaccinations utiles au poste."}
]},
"at-mp-quiz": {type:"quiz", title:"Accident du travail et maladie professionnelle", questions:[
  {q:"Après un accident du travail, la victime doit informer son employeur dans un délai de…", c:["24 heures","1 semaine","1 mois","Aucun délai"], a:0, e:"La victime informe l'employeur dans la journée ou au plus tard dans les 24 h."},
  {q:"L'employeur doit déclarer l'accident à la CPAM dans un délai de…", c:["24 h","48 h (hors dimanches et jours fériés)","15 jours","3 mois"], a:1, e:"La déclaration d'accident du travail est faite par l'employeur dans les 48 heures."},
  {q:"Un accident survenu sur le trajet domicile-travail est…", c:["Un accident de trajet, pris en charge","Non couvert","Une maladie professionnelle","Un accident domestique"], a:0, e:"L'accident de trajet est pris en charge comme un accident du travail s'il survient sur le trajet habituel."},
  {q:"Comment une maladie est-elle reconnue comme professionnelle ?", c:["Par le client","Si elle figure dans un tableau de maladies professionnelles (ou après avis d'un comité)","Par un collègue","Automatiquement pour toutes les maladies"], a:1, e:"Les tableaux précisent la maladie, le délai de prise en charge et les travaux concernés."},
  {q:"Que remet l'employeur à la victime pour qu'elle n'avance pas les frais ?", c:["Une feuille d'accident","Un chèque","Un bon d'achat","Rien"], a:0, e:"La feuille d'accident permet une prise en charge des soins sans avance de frais."}
]},
"tms-vf": {type:"vf", title:"TMS et manutention : vrai ou faux ?", items:[
  {s:"Les TMS sont la première cause de maladie professionnelle reconnue en France.", v:true, e:"Ils représentent plus de 80 % des maladies professionnelles reconnues."},
  {s:"Pour soulever un casier, on garde le dos droit et on plie les jambes.", v:true, e:"On rapproche aussi la charge du corps et on évite les torsions."},
  {s:"Porter un plateau toujours du même côté n'a aucune conséquence.", v:false, e:"Les gestes répétitifs et les postures prolongées favorisent les TMS de l'épaule et du poignet."},
  {s:"Le froid (chambre froide) et le stress augmentent le risque de TMS.", v:true, e:"Ce sont des facteurs aggravants, avec la répétitivité, l'effort et les postures."},
  {s:"S'échauffer et s'étirer ne sert à rien au travail.", v:false, e:"Un échauffement prépare les muscles et les articulations aux efforts du service."},
  {s:"Un chariot de service est une mesure de prévention des TMS.", v:true, e:"Il supprime le port de charges : c'est une aide à la manutention."}
]},
"tms-quiz": {type:"quiz", title:"Les risques liés à l'activité physique", questions:[
  {q:"Que signifie TMS ?", c:["Troubles musculosquelettiques","Travail manuel sécurisé","Taux maximal de stress","Temps moyen de service"], a:0, e:"Ils touchent muscles, tendons et nerfs : épaule, coude, poignet, dos."},
  {q:"Quel facteur n'est PAS un facteur de risque de TMS ?", c:["Répétitivité des gestes","Efforts importants","Postures contraignantes","Pauses régulières"], a:3, e:"Les pauses et la rotation des tâches font au contraire partie de la prévention."},
  {q:"Une femme de chambre fait 15 lits par jour. Quelle aide limite les TMS ?", c:["Lits sur roulettes ou rehausseurs","Travailler plus vite","Porter le linge à bout de bras","Aucune"], a:0, e:"Les lits rehaussables et les chariots de linge réduisent les flexions du dos."}
]},
"rps-match": {type:"match", title:"Les facteurs de risques psychosociaux", pairs:[
  ["Service en coupure, tard le soir et le week-end","Intensité et temps de travail"],
  ["Client agressif à la réception","Exigences émotionnelles"],
  ["Aucune marge pour organiser son travail","Manque d'autonomie"],
  ["Conflits avec le chef, pas de soutien","Rapports sociaux dégradés"],
  ["Devoir servir un plat qu'on juge raté","Conflits de valeurs"],
  ["Contrats courts, peur de perdre son emploi","Insécurité de la situation de travail"]
]},
"rps-vf": {type:"vf", title:"Risques psychosociaux : vrai ou faux ?", items:[
  {s:"Le stress au travail, le harcèlement et l'épuisement professionnel (burn-out) sont des risques psychosociaux.", v:true, e:"Les RPS regroupent stress, violences internes et externes, épuisement…"},
  {s:"Les RPS ne concernent que les cadres.", v:false, e:"Tous les salariés peuvent être concernés, notamment dans les métiers au contact du public."},
  {s:"L'employeur doit évaluer les RPS dans le document unique.", v:true, e:"Ce sont des risques professionnels comme les autres."},
  {s:"Le soutien de l'équipe et la reconnaissance du travail protègent des RPS.", v:true, e:"Ce sont des facteurs protecteurs importants."}
]},
"activite-travail-tri": {type:"tri", title:"Travail prescrit ou travail réel ?", cats:["Travail prescrit (ce qui est demandé)","Travail réel (ce qui est fait)"], items:[
  {t:"La fiche technique de la recette",c:0},{t:"Le planning de nettoyage des chambres",c:0},{t:"La procédure d'accueil des clients",c:0},
  {t:"Le commis adapte la recette car un produit manque",c:1},{t:"La femme de chambre gère un client resté dans la chambre",c:1},{t:"Le réceptionniste répond au téléphone en accueillant un client",c:1}
]},
"activite-travail-match": {type:"match", title:"Les composantes d'une situation de travail", pairs:[
  ["Individu","Le salarié : âge, formation, expérience, état de santé"],
  ["Tâche","Ce qu'il doit faire : dresser 80 couverts avant 12 h"],
  ["Matériel","Plateaux, chariot, vaisselle, nappes"],
  ["Milieu","Salle bruyante, sol carrelé, chaleur"]
]},
"urgence-match": {type:"match", title:"Les numéros d'urgence", pairs:[
  ["15","SAMU – urgence médicale"],
  ["18","Sapeurs-pompiers"],
  ["17","Police / gendarmerie"],
  ["112","Numéro d'urgence européen"],
  ["114","Urgences par SMS (personnes sourdes, malentendantes ou ne pouvant parler)"],
  ["3114","Prévention du suicide"],
  ["119","Enfance en danger"]
]},
"urgence-quiz": {type:"quiz", title:"Protéger, examiner, alerter, secourir", questions:[
  {q:"Face à un accident, quelle est la première action ?", c:["Alerter","Protéger pour éviter un sur-accident","Déplacer la victime","Lui donner à boire"], a:1, e:"On supprime ou isole le danger (couper le gaz, la friteuse…) avant toute autre action."},
  {q:"Un message d'alerte doit contenir…", c:["Seulement le nom de la victime","Le lieu précis, ce qui s'est passé, l'état de la victime, les gestes faits","Son adresse e-mail","Rien, on raccroche vite"], a:1, e:"Et on ne raccroche que lorsque l'interlocuteur le demande."},
  {q:"Une victime ne répond pas mais respire. Que faire ?", c:["La laisser sur le dos","La mettre en position latérale de sécurité (PLS) et alerter","Lui donner de l'eau","La secouer fort"], a:1, e:"La PLS évite l'étouffement ; on surveille sa respiration en attendant les secours."},
  {q:"Une victime ne répond pas et ne respire pas. Que faire ?", c:["Attendre les secours sans rien faire","Alerter, masser (RCP) et utiliser un défibrillateur (DAE)","La mettre en PLS","La faire asseoir"], a:1, e:"Chaque minute compte : massage cardiaque + défibrillateur automatisé externe."},
  {q:"Un commis se brûle la main à l'huile chaude. Premier geste ?", c:["Mettre du beurre","Refroidir sous l'eau tempérée pendant au moins 10 minutes","Percer les cloques","Mettre de la glace directement"], a:1, e:"Refroidir rapidement, longtemps, et alerter si la brûlure est grave ou étendue."}
]},

/* ---------------- CAP – spécifiques ---------------- */
"contrats-match": {type:"match", title:"Les différents contrats de travail", pairs:[
  ["CDI","Contrat sans date de fin, forme normale de l'emploi"],
  ["CDD","Contrat avec une date de fin, pour un motif précis"],
  ["Contrat saisonnier","CDD lié à la saison touristique (été, ski…)"],
  ["Intérim (travail temporaire)","Relation à trois : salarié, agence et entreprise"],
  ["Contrat d'apprentissage","Alterne formation au CFA et travail en entreprise"],
  ["Période d'essai","Début du contrat où chacun peut y mettre fin facilement"]
]},
"contrats-vf": {type:"vf", title:"Contrat de travail : vrai ou faux ?", items:[
  {s:"Un CDD doit obligatoirement être écrit.", v:true, e:"Sans écrit, le CDD peut être requalifié en CDI."},
  {s:"Le contrat de travail fixe notamment le poste, le salaire et la durée du travail.", v:true, e:"Ce sont des éléments essentiels du contrat."},
  {s:"L'employeur peut modifier le salaire sans l'accord du salarié.", v:false, e:"La rémunération est un élément essentiel : sa modification nécessite l'accord du salarié."},
  {s:"Un apprenti est un salarié.", v:true, e:"Il a un contrat de travail, perçoit un salaire et bénéficie des droits des salariés."},
  {s:"La convention collective des Hôtels, cafés, restaurants (HCR) complète le Code du travail.", v:true, e:"Elle fixe des règles propres au secteur (salaires minimum, avantages en nature repas…)."}
]},
"assurance-match": {type:"match", title:"Le vocabulaire de l'assurance", pairs:[
  ["Assuré","Personne protégée par le contrat"],
  ["Cotisation (prime)","Somme payée à l'assureur"],
  ["Sinistre","Événement qui cause le dommage (vol, dégât des eaux…)"],
  ["Franchise","Somme qui reste à la charge de l'assuré"],
  ["Responsabilité civile","Couvre les dommages causés aux autres"],
  ["Constat amiable","Document rempli après un accident de la route"]
]},
"assurance-vf": {type:"vf", title:"Assurance : vrai ou faux ?", items:[
  {s:"Pour un scooter ou une voiture, l'assurance responsabilité civile est obligatoire.", v:true, e:"Rouler sans assurance est un délit."},
  {s:"Un locataire doit assurer son logement.", v:true, e:"L'assurance habitation (au moins risques locatifs) est obligatoire pour le locataire."},
  {s:"Une assurance « tous risques » couvre absolument tout sans aucune limite.", v:false, e:"Le contrat comporte toujours des exclusions, des plafonds et souvent une franchise."},
  {s:"Il faut déclarer un sinistre à son assureur dans les délais prévus par le contrat.", v:true, e:"En général 5 jours ouvrés (2 jours pour un vol)."}
]},
"budget-tri": {type:"tri", title:"Construire son budget", cats:["Ressources","Dépenses fixes","Dépenses variables"], items:[
  {t:"Salaire d'apprenti",c:0},{t:"Aide au logement (APL)",c:0},{t:"Bourse",c:0},
  {t:"Loyer",c:1},{t:"Forfait téléphone",c:1},{t:"Assurance",c:1},{t:"Abonnement transport",c:1},
  {t:"Sorties et loisirs",c:2},{t:"Vêtements",c:2},{t:"Courses alimentaires",c:2}
]},
"budget-quiz": {type:"quiz", title:"Gérer son argent", questions:[
  {q:"Un budget est équilibré quand…", c:["Les dépenses sont supérieures aux ressources","Les ressources couvrent les dépenses","On n'a aucune dépense","On utilise le découvert chaque mois"], a:1, e:"Si les ressources dépassent les dépenses, on peut épargner."},
  {q:"Qu'est-ce que le découvert bancaire ?", c:["De l'argent gratuit","Un compte en négatif, qui entraîne des frais (agios)","Une épargne","Un cadeau de la banque"], a:1, e:"Le découvert coûte cher : agios et frais de rejet éventuels."},
  {q:"Qui aider en cas de difficultés financières ?", c:["Personne","Un conseiller (banque, CCAS, assistante sociale), la Banque de France pour le surendettement","Un inconnu sur Internet","Un crédit rapide en ligne"], a:1, e:"Il existe des dispositifs d'accompagnement : il ne faut pas rester seul."}
]},
"achats-quiz": {type:"quiz", title:"Consommer malin", questions:[
  {q:"Pour un achat sur Internet, de combien de jours dispose-t-on pour se rétracter ?", c:["7 jours","14 jours","30 jours","Aucun"], a:1, e:"14 jours à compter de la réception du bien, sans avoir à se justifier."},
  {q:"Pour un achat en magasin, le droit de rétractation légal…", c:["Est de 14 jours","N'existe pas (le remboursement est un geste commercial)","Est de 1 an","Est automatique"], a:1, e:"En magasin, l'échange ou le remboursement dépend de la politique du vendeur."},
  {q:"La garantie légale de conformité d'un produit neuf dure…", c:["6 mois","1 an","2 ans","10 ans"], a:2, e:"2 ans pour les biens neufs achetés à un professionnel."},
  {q:"Pour comparer deux paquets de tailles différentes, on regarde…", c:["La couleur","Le prix au kilo ou au litre","La marque","La taille de l'emballage"], a:1, e:"Le prix à l'unité de mesure est obligatoirement affiché en rayon."},
  {q:"Sur un site marchand, quel indice montre un paiement sécurisé ?", c:["Une adresse en « https » et un cadenas","Beaucoup de publicités","Des prix très bas","Un site sans mentions légales"], a:0, e:"Méfiez-vous aussi des prix trop beaux et vérifiez les mentions légales."}
]}
};

const TH = {
  A:"L'individu responsable de son capital santé",
  B:"L'individu responsable dans son environnement",
  C:"L'individu acteur de prévention dans son milieu professionnel",
  Ccap:"L'individu dans son milieu professionnel, impliqué dans la prévention des risques",
  D:"L'individu consommateur averti"
};
const LEVELS = [
 {id:"seconde", label:"Seconde", sub:"Bac Pro", themes:[
   {k:"A", t:TH.A, modules:[
     {c:"A1",t:"Le système de santé",g:["sante-acteurs","sante-quiz"],ev:"ev-A1"},
     {c:"A2",t:"Les rythmes biologiques, le sommeil",g:["sommeil-quiz","sommeil-vf"],ev:"ev-A2"},
     {c:"A3",t:"L'activité physique",g:["activite-quiz","activite-tri"],ev:"ev-A3"},
     {c:"A4",t:"Les addictions",g:["addictions-tri","addictions-quiz"],ev:"ev-A4"},
     {c:"A5",t:"La sexualité, la contraception",g:["contraception-vf"],ev:"ev-A5"}]},
   {k:"B", t:TH.B, modules:[
     {c:"B1",t:"L'alimentation écoresponsable",g:["ecoresp-quiz","labels-match","saison-tri"],ev:"ev-B1"},
     {c:"B2",t:"Les risques majeurs",g:["risques-tri","risques-quiz"],ev:"ev-B2"}]},
   {k:"C", t:TH.C, modules:[
     {c:"C1",t:"Les enjeux de la santé et sécurité au travail",g:["sst-quiz","sst-tri"],ev:"ev-C1"},
     {c:"C2",t:"Les notions de base en prévention des risques professionnels",g:["notions-match","notions-quiz"],ev:"ev-C2"}]}
 ]},
 {id:"premiere", label:"Première", sub:"Bac Pro", themes:[
   {k:"A", t:TH.A, modules:[
     {c:"A6",t:"Les infections sexuellement transmissibles",g:["ist-vf"],ev:"ev-A6"},
     {c:"A7",t:"Les pratiques alimentaires",g:["alimentation-match","alimentation-quiz"],ev:"ev-A7"},
     {c:"A8",t:"Le stress au quotidien",g:["stress-tri","stress-quiz"],ev:"ev-A8"}]},
   {k:"B", t:TH.B, modules:[
     {c:"B3",t:"Le bruit au quotidien",g:["bruit-quiz","bruit-match"],ev:"ev-B3"},
     {c:"B4",t:"L'eau et le développement durable",g:["eau-quiz"],ev:"ev-B4"}]},
   {k:"C", t:TH.C, modules:[
     {c:"C3",t:"Les acteurs de prévention",g:["acteurs-match"],ev:"ev-C3"},
     {c:"C4",t:"L'assistance et le secours en milieu professionnel",g:["urgence-quiz","urgence-match"],ev:"ev-C12"},
     {c:"C5",t:"L'analyse des risques professionnels",g:["duerp-quiz","prevention-tri"],ev:"ev-C5"},
     {c:"C6",t:"Le risque spécifique au secteur professionnel",g:["pictos-match","chimique-vf"],ev:"ev-C6"}]}
 ]},
 {id:"terminale", label:"Terminale", sub:"Bac Pro", themes:[
   {k:"A", t:TH.A, modules:[
     {c:"A9",t:"La sécurité alimentaire",g:["secu-alim-quiz","secu-alim-vf"],ev:"ev-A9"}]},
   {k:"B", t:TH.B, modules:[
     {c:"B5",t:"Les ressources en énergie et le développement durable",g:["energie-tri","energie-quiz"],ev:"ev-B5"}]},
   {k:"C", t:TH.C, modules:[
     {c:"C7",t:"Le suivi de la santé au travail",g:["suivi-sante-vf"],ev:"ev-C7"},
     {c:"C8",t:"Déclaration et réparation des accidents du travail et des maladies professionnelles",g:["at-mp-quiz"],ev:"ev-C8"},
     {c:"C9",t:"Les risques psychosociaux",g:["rps-match","rps-vf"],ev:"ev-C10"},
     {c:"C10",t:"Les risques liés à l'activité physique",g:["tms-vf","tms-quiz"],ev:"ev-C9"},
     {c:"C11",t:"L'analyse d'une situation de travail",g:["activite-travail-tri","activite-travail-match"],ev:"ev-C11"},
     {c:"C12",t:"L'égalité de traitement au travail",g:["egalite-vf"],ev:"ev-C4"}]}
 ]},
 {id:"cap", label:"CAP", sub:"1re & 2e année", themes:[
   {k:"A", t:TH.A, modules:[
     {c:"A1",t:"Le système de santé",g:["sante-acteurs","sante-quiz"],ev:"ev-A1"},
     {c:"A2",t:"Le sommeil, un rythme biologique",g:["sommeil-quiz","sommeil-vf"],ev:"ev-A2"},
     {c:"A3",t:"L'activité physique",g:["activite-quiz","activite-tri"],ev:"ev-A3"},
     {c:"A4",t:"Les addictions",g:["addictions-tri","addictions-quiz"],ev:"ev-A4"},
     {c:"A5",t:"La sexualité, la contraception",g:["contraception-vf"],ev:"ev-A5"},
     {c:"A6",t:"Prévenir les infections sexuellement transmissibles",g:["ist-vf"],ev:"ev-A6"},
     {c:"A7",t:"L'alimentation adaptée à son activité",g:["alimentation-quiz","alimentation-match"],ev:"ev-A7"}]},
   {k:"B", t:TH.B, modules:[
     {c:"B1",t:"Les ressources en eau",g:["eau-quiz"],ev:"ev-B4"},
     {c:"B2",t:"Les risques majeurs",g:["risques-tri","risques-quiz"],ev:"ev-B2"},
     {c:"B3",t:"Les ressources en énergie",g:["energie-tri","energie-quiz"],ev:"ev-B5"},
     {c:"B4",t:"Le bruit au quotidien",g:["bruit-quiz","bruit-match"],ev:"ev-B3"}]},
   {k:"C", t:TH.Ccap, modules:[
     {c:"C1",t:"Les différents contrats de travail",g:["contrats-match","contrats-vf"],ev:"ev-capC1"},
     {c:"C2",t:"Les enjeux de la santé et sécurité au travail",g:["sst-quiz","sst-tri"],ev:"ev-C1"},
     {c:"C3",t:"La démarche de prévention appliquée à une activité de travail",g:["notions-match","prevention-tri"],ev:"ev-C2"},
     {c:"C4",t:"La démarche de prévention appliquée à un risque spécifique au métier",g:["pictos-match","chimique-vf"],ev:"ev-C6"},
     {c:"C5",t:"Les risques liés à l'activité physique du métier",g:["tms-vf","tms-quiz"],ev:"ev-C9"},
     {c:"C6",t:"Les acteurs et les organismes de la prévention",g:["acteurs-match"],ev:"ev-C3"},
     {c:"C7",t:"Le suivi médical des salariés et la vaccination",g:["suivi-sante-vf"],ev:"ev-C7"},
     {c:"C8",t:"La gestion des situations d'urgence",g:["urgence-quiz","urgence-match"],ev:"ev-C12"}]},
   {k:"D", t:TH.D, modules:[
     {c:"D1",t:"L'assurance",g:["assurance-match","assurance-vf"],ev:"ev-D1"},
     {c:"D2",t:"Le budget",g:["budget-tri","budget-quiz"],ev:"ev-D2"},
     {c:"D3",t:"Les achats",g:["achats-quiz"],ev:"ev-D3"}]}
 ]}
];
