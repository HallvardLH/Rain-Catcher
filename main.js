// Look on my works, ye mighty, and despair!
/*=====================================================================================
									 Helper functions
=======================================================================================*/
function hide(id) {
    document.getElementById(id).style.display = "none";
}

function display(id) {
    document.getElementById(id).style.display = "block";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var byId = function(id) {
	return document.getElementById(id);
}

function boolean(variable) {
	window[variable] = !window[variable];
}

function playSound(sound) {
	var audio = document.getElementById(sound);
	audio.currentTime = 0;
	audio.play();
}

creditsDisplayed = false;
function credits() {
	if(creditsDisplayed) {
		display('credits');
		hide('creditsButton');
	} else {
		hide('credits');
	}
}

function shorten(string) {
	byId(string).innerHTML = byId(string).innerHTML.substring(0, byId(string).innerHTML.length - 1);
}

/*=====================================================================================
									 Game code
=======================================================================================*/
var storage = window.localStorage; // Shorthand

function play() {
	reset(); // Resets game
	hide('menu');
	display('gameArea');
}

var score = 0;
setInterval(function() {
	if(!pause) { // Only moves drops of the game is unpaused
		moveDrop();
		moveGolden();
	}
	save();
	credits(); // Updates credits
	byId('score').innerHTML = score;
	byId('highscore').innerHTML = 'Best: ' + highscore;
	var elem = document.getElementsByClassName("gold");
	for(var i = 0; i < elem.length; i++) {
		elem[i].innerHTML = goldenRaindrops;
	}
}, 10) // Runs 100 times every second

var speeds = []; // Individual speeds are kept to avoid changes in speed in existing drops
var rainSpeed = 0.4; // Gradually increased while playing
var speed = rainSpeed;
var iterations = 0;
var frequency = 450; // Gradually decreased while playing
var drops = 0;
var pause = true;
spawnDrop(); // Calls the function on load
async function spawnDrop() {
	if(!pause) {
		var str = document.createElement('div');
		str.innerHTML = '<img draggable="false" class="raindrop" name="raindrop" onclick="tap(' + iterations + ')" id="' + iterations + '" src="images/raindrop.png"/>';
		byId("dropAnchor").prepend(str);

		speeds.splice(iterations, 0, rainSpeed);

		byId(iterations).style.right = Math.floor(Math.random() * 86) + -20 + '%'; // A random value between 66 and -20

		if((iterations % 10) == 0 && speed < 0.55) { // Speed is increased every ten drops if speed is smaller than 0.55
			speed += 0.01;
		} else if((iterations % 50) == 0) {
			speed += 0.01;
		}
		iterations++;
		drops++;
		if(frequency > 400) {
			frequency -= 2;
		} else if(frequency > 300) {
			frequency -= 1;
		} else if(frequency > 250) {
			frequency -= 0.5;
		}
	}
	await sleep(frequency); // Function calls itself after a certain amount of time
	if(!pause) {
		dropPos.splice(dropPos.length+1, 0, -20); // Adds a new index to the dropPos array
	}
	spawnDrop();
}

var dropPos = [-20]; // Negative so that it starts off-screen
var dropRemoved = -100;
function moveDrop() {
	for(var i = dropRemoved; i < drops; i++) { // Loops through all existing drops and moves them
		if(byId(i) != null) {
			if(byId(i).offsetTop >= window.innerHeight-window.innerHeight * 30 / 100 && byId(i).name == 'raindrop') {
				gameOver();
	    	}
	    }
	    if(byId(i) != null) { // Checking if the element still exists
			byId(i).style.top = dropPos[i] + '%' // Finds the drop and changes its top value, moving it downwards
			dropPos[i] += speeds[i];
		}
	}
}

async function tap(num, golden) {
	if(golden) {
		num = num + 'golden'; // Distinguishing normal drops from golden ones
	}
	byId(num).onclick = ""; // Removes the onclick event
	if(golden) {
		goldenRaindrops++;
		goldenScore++;
		playSound("gold1");
		byId(num).src = 'images/goldenTap1.png'; // Golden drop explosion animations
		await sleep(50);
		byId(num).src = 'images/goldenTap2.png';
		await sleep(50);
		byId(num).src = 'images/goldenTap3.png';
	} else {
		score++;
		playSound("water" + Math.ceil(Math.random() * 3));
		byId(num).src = 'images/raindropTap1.png'; // Water drop explosion animations
		await sleep(50);
		byId(num).src = 'images/raindropTap2.png';
		await sleep(50);
		byId(num).src = 'images/raindropTap3.png';
		await sleep(50);
		byId(num).src = 'images/raindropTap4.png';
	}
	var elem = byId(num);
   	elem.parentNode.removeChild(elem);
}

var highscore = 0;
function gameOver() {
	playSound('gameOver');
	byId('modal').style.display = "block";
	byId('thisScore').innerHTML = 'Score: ' + score + '<br />Gold:&nbsp; ' + goldenScore;
	pause = true;
	if(score > highscore) {
		highscore = score;
	}
}

function reset() {
	for(var i = dropRemoved; i < 1000; i++) { // Loops through all existing drops and removes them
		if(byId(i) != null) {
	    	var elem = document.getElementById(i);
   			elem.parentNode.removeChild(elem);
   		}
   		if(byId(i + 'golden') != null) {
	    	var elem = document.getElementById(i + 'golden');
   			elem.parentNode.removeChild(elem);
   		}
   	}
   	// Resetting all game values
	score = 0;
	speeds = [];
	speed = rainSpeed;
	iterations = 0;
	frequency = 450;
	drops = 0;
	dropPos = [-20];
	dropRemoved = -100;

	iterationsGolden = 0;
	dropsGolden = 0;
	dropPosGolden = [-20];
	dropRemovedGolden = -100;
	goldenScore = 0;

	display('gameArea');
	hide('modal');
	pause = false;
}

var grayCat = true;
var brownCat = false;
var blackCat = false;
var whiteCat = false;
var orangeCat = false;
var pinkCat = false;
var colors = ['gray', 'brown', 'black', 'white', 'orange', 'pink'];
var catColor = 'gray';
function switchCat(color) {
	if(window[color + 'Cat']) {
		catColor = color;
		for(var i = 0; i < 6; i++) {
			byId(colors[i] + 'Cat').style.outline = ''; // Removes outline from all images
		}
		byId('cat').src = 'images/' + color + 'Cat.gif'; // Changes the cat image in game area
		byId(color + 'Cat').style.outline = '10px outset rgb(144, 75, 107)'; // Adds outline to chosen image
		byId('buyCat').innerHTML = color + ' cat chosen'; // Changes button contents
	} else  {
		byId('buyCat').innerHTML = 'Click to buy ' + color + ' cat<br /><br />100 gold';
		byId('buyCat').onclick = async function() {
			playSound('tap')
			if(goldenRaindrops >= 100 && !window[color + 'Cat']) { // If you don't have enough and you don't have the cat
				window[color + 'Cat'] = true;
				goldenRaindrops -= 100;
				byId('buyCat').innerHTML = color + ' cat purchased';
				switchCat(color);
			} else {
				byId('buyCat').innerHTML = 'Play to get more gold!<br /><br />' + (100 - goldenRaindrops) + ' remaining'; // Temporarily shows messages...
				await sleep(2000);
				byId('buyCat').innerHTML = 'Click to buy ' + color + ' cat<br /><br />100 gold'; // ...Before replacing it with default
			}
		}
	}
}

var rainUpgrade = 0;
var goldUpgrade = 0;
function upgrade(which, load)  {
	switch(which) {
		case('rainUpgrade'):
			if(goldenRaindrops >= 100 || load) {
				if(rainUpgrade < 10 || load) {
					if(!load) {
						goldenRaindrops -= 100;
						rainUpgrade++;
					}
					rainSpeed -= 0.02;
					shorten('rainRed');
					byId('rainGreen').innerHTML += '.';
				}
			}
			break;
		case('goldUpgrade'):
			if(goldenRaindrops >= 100 || load) {
				if(goldUpgrade < 10 || load) {
					if(!load) {
						goldenRaindrops -= 100;
						goldUpgrade++;
					}
					goldenChance += 0.05;
					shorten('goldRed');
					byId('goldGreen').innerHTML += '.';
				}
			}
			break;
	}
}

/*=====================================================================================
									 Golden raindrops
=======================================================================================*/
var goldenRaindrops = 0;
var speedsGolden = []; // Individual speeds are kept to avoid changes in speed in existing drops
var iterationsGolden = 0;
var dropsGolden = 0;
var goldenExists = false;
var goldenChance = 0.2;
spawnGolden();
async function spawnGolden() {
	if(!pause && score > 1) {
		if(Math.random() <= goldenChance) {
			goldenExists = true;
			var str = document.createElement('div');
			str.innerHTML = '<img draggable="false" class="raindrop" onclick="tap(' + iterationsGolden + ', true)" id="' + iterationsGolden + 'golden" src="images/goldenRaindrop.png"/>';
			byId("dropAnchor").prepend(str);

			speedsGolden.splice(iterationsGolden, 0, 0.6);

			byId(iterationsGolden + 'golden').style.right = Math.floor(Math.random() * 86) + -20 + '%'; // A random value between 66 and -20

			iterationsGolden++;
			dropsGolden++;
		}
	}
	await sleep(1000); // Function calls itself after a certain wait time
	if(!pause) {
		dropPosGolden.splice(dropPosGolden.length+1, 0, -20); // Adds a new index to the dropPosGolden array
	}
	spawnGolden();
}

var dropPosGolden = [-20];
var dropRemovedGolden = -100;
function moveGolden() {
	if(goldenExists)
	for(var i = dropRemovedGolden; i < dropsGolden; i++) { // Loops through all existing drops and moves them
		if(byId(i + 'golden') != null) {
			if(byId(i + 'golden').offsetTop >= window.innerHeight) {
				var elem = byId(i + 'golden');
   				elem.parentNode.removeChild(elem);
	    	}
	    }
	    if(byId(i + 'golden') != null) { // Checking if the element still exists
			byId(i + 'golden').style.top = dropPosGolden[i] + '%' // Finds the drop and changes its top value, moving it downwards
			dropPosGolden[i] += speedsGolden[i];
		}
	}
}


/*=====================================================================================
									 Saving
=======================================================================================*/
function save() {
	storage.setItem('highscore', highscore);
	storage.setItem('catColor', catColor);
	storage.setItem('goldenRaindrops', goldenRaindrops);
	// Upgrades
	storage.setItem('rainUpgrade', rainUpgrade);
	storage.setItem('goldUpgrade', goldUpgrade);
	// Cats
	for (var i = 0; i < 6; i++) {
		storage.setItem(colors[i] + 'Cat', window[colors[i] + 'Cat']);
	}
}

if(storage.getItem("highscore") != null) {
	highscore = Number(storage.getItem("highscore"));
	catColor = storage.getItem("catColor")
	goldenRaindrops = Number(storage.getItem('goldenRaindrops'));
	// Upgrades
	rainUpgrade = Number(storage.getItem('rainUpgrade'));
	goldUpgrade = Number(storage.getItem('goldUpgrade'));

	doubleTime = Number(storage.getItem('doubleTime'));
	// Cats
	for (var i = 0; i < 6; i++) {
		window[colors[i] + 'Cat'] = JSON.parse(storage.getItem(colors[i] + 'Cat'));
	}
}
console.log(catColor);
switchCat(catColor); // Assures that the correct cat is displayed

unlockUpgrades('rainUpgrade');
unlockUpgrades('goldUpgrade');
function unlockUpgrades(which) {
	for (var i = 0; i < window[which]; i++) {
		upgrade(which, true);
	}
}
