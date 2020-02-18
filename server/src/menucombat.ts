///Chargement de l'inventaire
var composition: Composition = new Composition();
var inventaire: Inventaire = new Inventaire();
var joueur: Joueur = new Joueur("Cyrkill", inventaire, composition);
joueur.inventaire.addHero("superMack");
/////////

///Affichage de l'inventaire dans la liste
var i: number = 0;
while(inventaire.getHeros().hasNext()) {
    document.getElementById('liste').innerHTML += inventaire.getHeros().get().getName() + '\n';
    inventaire.getHeros().Next();
}
/////////