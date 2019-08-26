/** ----------------------------------------
    Création des variables
------------------------------------------*/

// Tableau contenant les 8 paires de cartes
const patternsCards = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];

// Tableau des cartes non retournées
const stateCards = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

// Tableau où seront stockés les cartes retournées 
let cardsReturned = [];

// Nombre de paires de cartes retournées avec succès
let nbPairsFound=0;

// Secondes du chronomètre
let sec = 0;

// Minutes du chronomètre
let min = 0;

let norepeat = true; // Empêche le chrono de se répéter

//Fréquence du décompte du tps chrono : ici, en seconde
let timerID = 0;

// Le tableau HTML où sont s'affichent les images des cartes à retourner
const imgCards = document.getElementById("playground").getElementsByTagName("img");

// Je guette la div contenant le jeu de carte
const $game = document.getElementsByClassName("game");

// Je crée La div qui contiendra l'image Succès
const $successPlay = document.createElement("div");

$successPlay.id = "success";

// Création de l'image qui s'affichera en cas de succès
const $imgSuccess = document.createElement("div");
$imgSuccess.id = "imgSuccess"

$imgSuccess.innerHTML = '<iframe src="https://giphy.com/embed/xT0BKAB7vMb10rfnvG" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/puma-bolt-usain-puma-running-xT0BKAB7vMb10rfnvG">via GIPHY</a></p>';

$successPlay.appendChild($imgSuccess);

/** ----------------------------------------
    Création des fonctions
------------------------------------------*/

for(let i = 0;i<imgCards.length;i++){
	//Ajout de la propriété noCard à l'objet img
	imgCards[i].noCard=i; 
	// Evenement au 1er clic du joueur
	imgCards[i].onclick = function(){
		controlGame(this.noCard);

		if (norepeat == true) {
			timerID = setInterval('chrono()', 1000);
			console.log(timerID);
			norepeat = false;
		}
	}                      
}

initializeGame();

/**
 * Affichage du tapis de cartes
 * @param {number} noCard 
 */
function majDisplay(noCard){
	
	switch(stateCards[noCard]){
		case 0:
			imgCards[noCard].src = "images/verso-card.png";
			break;
		case 1:
			imgCards[noCard].src = "images/card"+patternsCards[noCard]+".png";
			break;
		case -1:
			imgCards[noCard].style.visibility = "hidden";
			break;
	}
}


/**
 * Permettre au winner de valider 
 * son inscription pour le tirage au sort
 */
function registerPlayOnSuccess(){

	// Remplacer le contenu du chrono par Bravo
	const $chrono = document.getElementById("chrono");
	$chrono.style.backgroundColor = "#e5011c";
	$chrono.style.color = "white";
	document.getElementById("chrono").innerHTML = "Bravo !";
	
	// Faire disparaître la div du tapis de cartes
	// via propriété CSS display : none dans l'index.css
	for (let i = 0; i < $game.length; i++) {
		
		const element = $game[i];
		
		element.classList.add("displayedDiv");
	}

	// Insertion du bouton activant le form en class modal pour s'enregistrer en tant que winner
	// et insertion du bouton dans la div btn-participation
	const $buttonParticipe = document.createElement("div");

	$buttonParticipe.innerHTML ='<div id="btn-playerSuccess"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#registerPlayerModal">Participez au tirage au sort</button></div>';

	const $btnParticipation = document.getElementById("btn-participation");
	
	$btnParticipation.prepend($buttonParticipe);

	// Insertion de la div SuccessPlay
	$btnParticipation.prepend($successPlay);

}

/**
 * Répartir les cartes non retournées
 * de manière aléatoire
 */
function initializeGame(){

	for(let position = patternsCards.length-1; position>=1; position--){
		const chance = Math.floor(Math.random()*(position+1));
		const save=patternsCards[position];
		patternsCards[position] = patternsCards[chance];
		patternsCards[chance] = save;
	}
}

/**
 * Gestion d'une partie de la game
 * @param {number} noCard 
 */
function controlGame(noCard){

	if(cardsReturned.length<2){

		if(stateCards[noCard] == 0){
			stateCards[noCard] = 1;
			cardsReturned.push(noCard);
			majDisplay(noCard);
		}

		if(cardsReturned.length == 2){
			let newState = 0;
			if(patternsCards[cardsReturned[0]] == patternsCards[cardsReturned[1]]){
				newState =-1;
				nbPairsFound++;
			}

			stateCards[cardsReturned[0]] = newState;
			stateCards[cardsReturned[1]] = newState;
			
			setTimeout(function(){
				majDisplay(cardsReturned[0]);
				majDisplay(cardsReturned[1]);
				cardsReturned=[];
				if(nbPairsFound == 8){
					clearInterval(timerID);
					registerPlayOnSuccess();
				} 
			},750);

		}
	}
}

/**
 * Fonction du chronomètre
 */
function chrono() { 
	
	if (sec < 59) {
		sec++;
		if (sec < 10) {
			sec = "0" + sec;
		}
	}
	else if (sec = 59) {
		min++;
		sec = "0" + 0;
	} 

	document.getElementById("chrono").innerHTML = min +' '+ '<span class="no-bold">min</span>'+ ' '+':' +' '+ sec +' '+'<span class="no-bold">sec</span>';
	console.log(sec +' '+ typeof sec);
	console.log(min +' '+ typeof min);
	
	if(sec == 59 && min == 1){
		gameOver();
	}
}

/**
 * stopper le jeu si dépassement du temps limité
 * puis recharger la page
 */
function gameOver(){
	
	clearInterval(timerID);
	alert("GAME OVER :/ Clique sur OK pour rejouer");
	location.reload();
}