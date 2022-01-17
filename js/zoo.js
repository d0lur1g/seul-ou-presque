$( function() {
	var buttons = $(".section button");
	var status = $("#status");

	$(".section").not('#intro').css('display','none');
	
	buttons.click( function() {
		//Récupération de l'attribut go
		var go = $(this).attr('go');

		//Aller à la section désignée
		gotoSection(go);
	});
	
	//Aller à la section sélectionner
	function gotoSection(key) {

		//Cacher toutes les sections
		$(".section").css('display','none');

		//Récupération du nom de l'image contenu dans l'attribut img
		var img = $("#" + key).attr('img');
		//Si on trouve un attribut img alors on affiche le background correspondant
		if(img!=null)
		{ 
			$("body").css("background-image","url('img/" + img + "')");
		}

		//Afficher la section key
		$("#" + key).fadeIn(300);

		//Rechercher l'action à faire
		var action = $("#" + key).find('action').attr('name');
		
		switch (action){
			case "reset":
			status.hide();
			resetInventory();
			break;

			case "start":
			startGame();
			break;
			
			case "hit":
			loseOneLife();
			break;
			
			case "day":
			dayPast();
			updatePlural();
			break;

			case "bigLoseLife":
			losePourcentLifeRandom();
			break;

			case "dayAndBigLoseLife":
			dayPast();
			losePourcentLifeRandom();
			updatePlural();
			break;

			case "inventory":
			inventory();
			updatePlural();
			break;

			case "newInventory":
			newInventory();
			updatePlural();
			break;

			case "dayAndNewInventory":
			dayPast();
			newInventory();
			updatePlural();
			break;

			case "dayAndNewFish":
			dayPast();
			newFish();
			updatePlural();
			break;

			case "addFish":
			addFish();
			updatePlural();
			break;

			case "eatAndDrink":
			eatAndDrink();
			updatePlural();
			break;

			case "suddenDeath":
			loseLifeOnce();
			endGameWithSuddenDeath();
			break;

			case "death":
			endGame();
			break;

			case "dayAndExit":
			dayPast();
			goodEndGame();
			updatePlural();
			break;

			case "exit":
			goodEndGame();
			updatePlural();
			break

			default: break;
		}
	}

////////////////////////////////////////////////////
//		FUNCTIONS
////////////////////////////////////////////////////
	function insertStatusLife() {

		var elemLife = $('<div class="life"><strong>Santé : </strong><span class="value"></span> %</div><div class="day"><strong>Jour passé : </strong><span class="value"></span></div>');
		var status = $("#status");
		var addDiv = status.html(elemLife);
	}

	//Cette fonction sert à gérer le pluriel et le singulier
	function updatePlural() {
		//Initialisation des variables à null
		var elemDay = null;
		var elemBox = null;
		var elemFish = null;
		var elemWater = null;

		//Si la donnée récupérée est > à 1 alors le texte passe au pluriel, sinon au singulier
		if(getDayPast()>1) { elemDay = $('<strong>Jours passés : </strong>'); }
		else { elemDay = $('<strong>Jour passé : </strong>'); }

		if(getBox()>1) { elemBox = $('<strong>Boîtes de conserve : </strong>'); }
		else { elemBox = $('<strong>Boîte de conserve : </strong>'); }

		if(getFish()>1) { elemFish = $('<strong>Poissons : </strong>'); }
		else { elemFish = $('<strong>Poisson : </strong>'); }

		if(getWater()>1) { elemWater = $('<strong>Bouteilles : </strong>'); }
		else { elemWater = $('<strong>Bouteille : </strong>'); }

		//On récupère l'élément souhaité où se trouve la donnée et on la stocke dans une variable
		var pluralDay = $("#status .day strong");
		//On remplace l'élément souhaité avec le contenu (pluriel ou singulier)
		var modifyDivDay = pluralDay.replaceWith(elemDay);
		
		var pluralBox = $("#status .box strong");
		var modifyDivBox = pluralBox.replaceWith(elemBox);
		var pluralFish = $("#status .fish strong");
		var modifyDivFish = pluralFish.replaceWith(elemFish);
		var pluralWater = $("#status .water strong");
		var modifyDivWater = pluralWater.replaceWith(elemWater);
	}

	function inventory() {
		var add = function insertStatus() {
			var elem = $('<div class="water"><strong>Bouteille : </strong><span class="value">--</span></div><div class="box"><strong>Boîte de conserve : </strong><span class="value">--</span></div><div class="kit"><strong>Kit : </strong><span class="value">--</span></div>');
			var status = $("#status");
			var addDiv = status.append(elem);
		}
		function addStatus(f){
			f();
		}

		addStatus(add);
		setWater(5);
		setBox(3);
		setKit(1);
	}

	function resetInventory() {
		var remove = function removeStatus() {
			var elem = $(".water, .box, .kit, .fish").remove();
		}

		function removeStatus(r){
			r();
		}
		
		removeStatus(remove);
	}

	function addFish() {
		var add = function insertStatus() {
			var elem = $('<div class="fish"><strong>Poisson : </strong><span class="value">--</span></div>');
			var status = $("#status");
			var addDiv = status.append(elem);
		}
		function addStatus(f){
			f();
		}

		addStatus(add);
		setFish(1);
	}

	function eatAndDrink() {
		setFish(getFish()-1);
		setWater(getWater()-1);
	}

	function newFish() {
		var x = Math.floor((Math.random() * 30) + 1);
		setFish(parseInt(getFish())+x);
	}

	function newInventory() {
		setBox(getBox()-1);
		setWater(getWater()-1);
	}

	function dayPast() {
		var y = Math.floor((Math.random() * 7300) + 1);

		if(getDayPast()==4){
			setDayPast(parseInt(getDayPast())+3);
		}
		else if(getDayPast()==7)
		{
			setDayPast(parseInt(getDayPast())+1);
		}
		else if(getDayPast()>=8)
		{
			setDayPast(parseInt(getDayPast())+y)
		}
		else
		{
			setDayPast(parseInt(getDayPast())+1);
		}
	}

	//Le joueur perd une vie
	function loseOneLife() {
		//Vérifier que le nombre de vie est supérieur à 1
		if(getLife()>1)
		{
			//moins 10%
			setLife(getLife()-10);
		}
		else //Il n'y avait plus qu'une vie
		{
			//Une vie perdu
			setLife(getLife()-1);

			//Le joueur n'a plus de vie : jeu terminé
			endGame();
		}
	}

	function losePourcentLifeRandom() {
		var x = Math.floor((Math.random() * 100) + 1);

		if((getLife()-x) > 1)
		{
			setLife(getLife()-x);
		}
		else
		{
			setLife(0);
			endGame();
		}
	}

	function goodEndGame() {
		setLife(0);
		setWater(0);
		setFish(0);
		setKit(0);
		setBox(0);
	}

	function loseLifeOnce() {
		endGame();
	}

	//Commencer le jeu : initialisation du nombre de vie
	function startGame() {
		status.show();
		insertStatusLife();
		setLife(100);
		setDayPast(1);
	}

	//Jeu terminé : plus de vie
	function endGame() {
		setLife(0);
		gotoSection("death");
	}

	//Jeu terminé : plus de vie
	function endGameWithSuddenDeath() {
		gotoSection("suddenDeath");
	}

////////////////////////////////////////////////////
//		GETTERS
////////////////////////////////////////////////////
	//Récupère le pourcentage de vie
	function getLife() {
		return status.find('.life span').html();
	}

	//Récupère le nombre de jours passés
	function getDayPast() {
		return status.find('.day span').html();
	}

	//Récupère le nombre d'eau
	function getWater() {
		return status.find('.water span').html();
	}

	//Récupère le nombre de conserve
	function getBox() {
		return status.find('.box span').html();
	}

	//Récupère le nombre de trousse de secours
	function getKit() {
		return status.find('.kit span').html();
	}

	//Récupère le nombre de trousse de secours
	function getFish() {
		return status.find('.fish span').html();
	}

////////////////////////////////////////////////////
//		SETTERS
////////////////////////////////////////////////////
	//Modifie le pourcentage de vie
	function setLife(v) {
		status.find('.life span').html(v);
	}

	//Modifie le nombre de jours passés
	function setDayPast(v) {
		status.find('.day span').html(v);
	}

	//Modifie le nombre d'eau
	function setWater(v) {
		status.find('.water span').html(v);
	}

	//Modifie le nombre de conserve
	function setBox(v) {
		status.find('.box span').html(v);
	}

	//Modifie le nombre de trousse de secours
	function setKit(v) {
		status.find('.kit span').html(v);
	}

	//Modifie le nombre de trousse de secours
	function setFish(v) {
		status.find('.fish span').html(v);
	}
});