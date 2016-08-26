/*
 * Monopoly - Socialism Plugin
 *
 * Guise on Couch
 *
 * Author: Travis Heller
 *
 * Version 0.2.2 - June 3, 2016
 *
 *
 * Includes player data handling and classic gameplay
 */

// Global variable for the player list object
var Players;

// Global variable for economic system setting
var econSystem;


/*
 * PlayerList linked list of Player nodes
 */
var PlayerList = function() {
	var front = null;
	var size = 0;
	var totalScore = 0;
	var curr = null;
	var baseMoney = 1500;

	/*
	 * Adds a player to the game
	 */
	this.add = function(name) {
		name = cleanString(name);
		if (size == 0) {
			size += 1;
			var thePlayer = new Player(name);
			front = thePlayer;
			curr = this.getFront();
			curr.setNext(front);
			totalScore += Number(baseMoney);
			return;
		}
		var current = front;

		for (var i = 0; i < size-1; i++) {
			current = current.getNext();
		}
		size += 1;
		var playerTemp = new Player(name);
		current.setNext(playerTemp);
		totalScore += Number(baseMoney);
	}

	this.getPlayerByName = function(name) {
		var current = front;
		for (var i = 0; i < size; i++) {
			if (current.getName() === name) {
				return current;
			}
		current = current.getNext();
		}
		return null;
	}

	this.getPlayerById = function(id) {
		var current = front;
		for (var i = 0; i < size; i++) {
			if (current.getId() == id) {
				return current;
			}
			current = current.getNext();
		}
		return null;
	}

	this.next = function() {
		curr = curr.getNext();
	}

	this.getTotalScore = function() {
		return totalScore;
	}

	this.setFront = function(aPlayer) {
		front = aPlayer;
	}

	this.getFront = function() {
		return front;
	}

	this.getSize = function() {
		return size;
	}

	this.setSize = function(newSize) {
		size = newSize;
	}

	this.getCurr = function() {
		return curr;
	}

	this.displayPlayers = function() {
		var playerStr = "";
		for (var i = 0; i < size; i++) {

			playerStr += curr.getName();
			if (i != size -1) {
				playerStr += ", ";
			}
		
		this.next();
		
		}
		alert("Players: " + playerStr);
	}

	this.getFront = function() {
		return front;
	}

	this.setBaseMoney = function(money) {
		baseMoney = money;
	}

	/*
	 * Player node data class
	 */
	var Player = function(aName) {
		var score = baseMoney;
		var money = baseMoney;
		var id = 0;
		var next = front;
		var name;

		if (aName == "") {
	        name = "Player " + size;
	        } else {
	           name = aName;
	        }
	    id = size;

	    this.getName = function() {
	    	return name;
	    }

	    this.getId = function() {
	    	return id;
	    }

	    this.getNext = function() {
	    	return next;
	    }

	    this.setNext = function(object) {
	    	next = object;
	    }

	    this.getMoney = function() {
	    	return money;
	    }

	    this.getScore = function() {
	    	return score;
	    }

	    this.changeScore = function(change) {
	    	change = cleanString(change);
	    	if (!isNaN(change)) {
	    		score = Number(score) + Number(change);
	    		totalScore = Number(totalScore) + Number(change);
	    	}
	    }

	    this.changeMoney = function(change) {
	    	change = cleanString(change);
	    	if (!isNaN(change)){
		    	money = Number(money) + Number(change);
		    	score = Number(score) + Number(change);
		    	totalScore = Number(totalScore) + Number(change);
		    } else {
		    	alert('Error: "' + change + '" is not a number.');
		    }
	    }
	}

	/*
	function Player(name, baseMoney) {
		var score = baseMoney;
		var money = baseMoney;
		var id = 0;
		var next = front;

		if (name == "") {
	        this.name = "Player " + (size+1);
	        } else {
	           this.name = name;
	        }
	    id = size+1;

	    this.getName = function() {
	    	return name;
	    }

	    this.getNext = function() {
	    	return next;
	    }
	}
	*/
}


// handlePlayers()
// Creates player data from inputs
function handlePlayers() {
	var numPlayers = document.getElementById("numPlayers").value;
	Players = new PlayerList();
	Players.setBaseMoney(document.getElementById("startMoney").value)
	for (var i = 1; i <= numPlayers; i++) {
		Players.add(prompt("Player " + i + " name:"));
	}
	econSystem = document.getElementById("system").value;

	//Players.displayPlayers();
	//alert("Size: " + Players.getSize());
	buildPlayerListDisplay();
	document.getElementById("setup").style.display = "none";
	document.getElementById("game").style.display = "block";

	document.getElementById("heading").innerHTML = econSystem;
	play();

}

function validatePlayers() {
	var num = document.getElementById("numPlayers").value;
	if (num < 1) {
		num = 1;
	}
}

function buildPlayerListDisplay() {
	var size = Players.getSize();
	var current = Players.getCurr();
	var list = "";
	for (var i = 0; i < size; i++) {
		var name = current.getName();
		var id = current.getId();
		list += "<div class='list-group-item' id='pl"+id+"'>\n"+name+"\n<button class='btn btn-xs pull-right' onclick='transaction("+id+")'><span class='glyphicon glyphicon-usd'></span></button>\n</div>\n";
		current = current.getNext();
	}
	document.getElementById("playerlist").innerHTML = list;
}

function play() {
	var currentPlayer = Players.getCurr();
	var id = currentPlayer.getId();
	document.getElementById("pl"+id).className = 'list-group-item active';
	document.getElementById("playerName").innerHTML = currentPlayer.getName();
	//document.getElementById("playerImg").src = currentPlayer.getImg();
	document.getElementById("money").innerHTML = "$" + currentPlayer.getMoney();
	document.getElementById("score").innerHTML = currentPlayer.getScore();
	document.getElementById("totalScore").innerHTML = Players.getTotalScore();
}

function nextPlayer() {
	var pid = Players.getCurr().getId();
	document.getElementById("pl"+pid).classList.remove('active');
	Players.next();
	play();
}

function changeMoney() {
	var currentPlayer = Players.getCurr();
	currentPlayer.changeMoney(prompt("How much?"));
	document.getElementById("money").innerHTML = "$" + currentPlayer.getMoney();
	document.getElementById("score").innerHTML = currentPlayer.getScore();
	document.getElementById("totalScore").innerHTML = Players.getTotalScore();
}

function transaction(id) {
	var fromPlayer = Players.getCurr();
	var fromName = fromPlayer.getName();
	var toPlayer = Players.getPlayerById(id);
	var toName = toPlayer.getName();
	var change = prompt("How much would you like to transfer to "+toName+"?");
	fromPlayer.changeMoney(-1*change);
	toPlayer.changeMoney(change);
	var currentPlayer = fromPlayer;
	document.getElementById("money").innerHTML = "$" + currentPlayer.getMoney();
	document.getElementById("score").innerHTML = currentPlayer.getScore();
	document.getElementById("totalScore").innerHTML = Players.getTotalScore();
}

function buy() {
	alert("Buy is not implemented");
}

function cleanString(input) {
	if (isNaN(input)) {
		var clean = input.replace(/<[^>]+>/ig,"");
		return clean;
	} else {
		return input;
	}
}
