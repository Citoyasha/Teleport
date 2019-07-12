module.exports = function TP(mod) {
	const fs = require("fs")
	const path = require("path")
	const Vec3 = require('tera-vec3')
	const Message = require('../tera-message')
	const MSG = new Message(mod)

	let myLoc = null,
		myW = null,
		aBook = {}

	var gameId = null;
	var tLoc = 0, afterLoc = [];
	var radius = [ 0, 50, 90, 125, 150, 170, 180 ];

	try {
		aBook = require('./book.json'); }
	catch(e) {
		aBook = {};
	}

	mod.command.add('tp', (arg1, arg2, arg3) => {
		if(arg1 && arg1.length > 0) arg1 = arg1.toLowerCase();
		if(arg2 && arg2.length > 0) arg2 = arg2.toLowerCase();
		if(arg3 && arg3.length > 0) arg3 = arg3.toLowerCase();
		switch (arg1) {
			case "s":
			case "save":
				if (arg2) {
					aBook[arg2] = {
						zone: mod.game.me.zone,
						x: myLoc.x,
						y: myLoc.y,
						z: myLoc.z,
						w: myW
					}
					saveBook();
				MSG.BLU(`Location is Saved ${arg2}`);
			};
				break;
			case "m":
			case "move":
				if (arg2) {
					if (!aBook[arg2]) {
						MSG.RED(`Cannot find [${arg2}] in the book.`);
						break;
					} else if (aBook[arg2].zone != mod.game.me.zone){
						MSG.RED(`You are not in zone: ${aBook[arg2].zone}.`);
						break;
					}
					Move(aBook[arg2].x,aBook[arg2].y,aBook[arg2].z,aBook[arg2].w);
				};
				break;
			case "remove":
			case "delete":
			case "del":
				if (arg2) {
					if (!aBook[arg2]) {
						MSG.RED(`Cannot find [${arg2}] in the book.`);
					} else {
						delete aBook[arg2];
						saveBook();
						MSG.BLU(`[${arg2}] has been removed.`);
					}
				}
				break;
			case "blink":
				blink();
				break;
			case "back":
				if (tLoc != 0) {
					if (mod.game.me.zone != tLoc.zone){
						MSG.RED(`You are not in zone: ${tLoc.zone}`);
					}else{
						Move(tLoc.x,tLoc.y,tLoc.z,tLoc.w);
					}
				} else { MSG.RED('You should blink first!') }
				break;
			case "up":
				if (!arg2) {break;}
				Move(myLoc.x,myLoc.y,myLoc.z+Number(arg2),myW);
				break;
			case "down":
				if (!arg2) {break;}
				Move(myLoc.x,myLoc.y,myLoc.z-Number(arg2),myW);
				break;
			case "coord":
			case "where":
			case "loc":
			case "location":
			MSG.chat(
				"Current Coord: "
				+ "\n\t - [Zone] "  + MSG.BLU(mod.game.me.zone)
				+ "\n\t - [x] " + MSG.BLU(Math.round(myLoc.x))
				+ "\n\t - [y] " + MSG.BLU(Math.round(myLoc.y))
				+ "\n\t - [z] " + MSG.BLU(Math.round(myLoc.z))
				+ "\n\t - [w] "     + MSG.BLU(Math.round(myW))
			)
				break;
			default:
				if (arg1 && arg2 && arg3) {
					Move(Number(arg1),Number(arg2),Number(arg3),myW);
				}
				break;
		}
		});

	mod.hook('C_PLAYER_LOCATION', 5, (event) => {
		myLoc = event.loc
		myW = event.w

		if (event.type == 2 || event.type == 10) {
			return false
		}
	})

	function Move(x, y, z, w) {
		mod.send('S_INSTANT_MOVE', 3, {
			gameId: mod.game.me.gameId,
			loc: new Vec3(x, y, z),
			w: w
		})
	}

	function blink() {
		tLoc = {
			zone: mod.game.me.zone,
			x: myLoc.x,
			y: myLoc.y,
			z: myLoc.z,
			w: myW
		};
		afterLoc = myLoc;

		if (myW > -1365 && myW < 1365){
			afterLoc.x = +myLoc.x + radius[6];
			afterLoc.y = +myLoc.y + radius[0];
		};
		if (myW > 1365 && myW < 4095){
			afterLoc.x = +myLoc.x + radius[5];
			afterLoc.y = +myLoc.y + radius[1];
		};
		if (myW > 4095 && myW < 6825){
			afterLoc.x = +myLoc.x + radius[4];
			afterLoc.y = +myLoc.y + radius[2];
		};
		if (myW > 6825 && myW < 9555){
			afterLoc.x = +myLoc.x + radius[3];
			afterLoc.y = +myLoc.y + radius[3];
		};
		if (myW > 9555 && myW < 12285){
			afterLoc.x = +myLoc.x + radius[2];
			afterLoc.y = +myLoc.y + radius[4];
		};
		if (myW > 12285 && myW < 15015){
			afterLoc.x = +myLoc.x + radius[1];
			afterLoc.y = +myLoc.y + radius[5];
		};
		if (myW > 15015 && myW < 17745){
			afterLoc.x = +myLoc.x + radius[0];
			afterLoc.y = +myLoc.y + radius[6];
		};
		if (myW > 17745 && myW < 20475){
			afterLoc.x = +myLoc.x - radius[1];
			afterLoc.y = +myLoc.y + radius[5];
		};
		if (myW > 20475 && myW < 23205){
			afterLoc.x = +myLoc.x - radius[2];
			afterLoc.y = +myLoc.y + radius[4];
		};
		if (myW > 23205 && myW < 25935){
			afterLoc.x = +myLoc.x - radius[3];
			afterLoc.y = +myLoc.y + radius[3];
		};
		if (myW > 25935 && myW < 28665){
			afterLoc.x = +myLoc.x - radius[4];
			afterLoc.y = +myLoc.y + radius[2];
		};
		if (myW > 28665 && myW < 31395){
			afterLoc.x = +myLoc.x - radius[5];
			afterLoc.y = +myLoc.y + radius[1];
		};
		if (myW > 31395 && myW < 32767){
			afterLoc.x = +myLoc.x - radius[6];
			afterLoc.y = +myLoc.y + radius[0];
		};
		if (myW > -32767 && myW < -31402){
			afterLoc.x = +myLoc.x - radius[6];
			afterLoc.y = +myLoc.y + radius[0];
		};
		if (myW > -31402 && myW < -28672){
			afterLoc.x = +myLoc.x - radius[5];
			afterLoc.y = +myLoc.y - radius[1];
		};
		if (myW > -28672 && myW < -25942){
			afterLoc.x = +myLoc.x - radius[4];
			afterLoc.y = +myLoc.y - radius[2];
		};
		if (myW > -25942 && myW < -23212){
			afterLoc.x = +myLoc.x - radius[3];
			afterLoc.y = +myLoc.y - radius[3];
		};
		if (myW > -23212 && myW < -20482){
			afterLoc.x = +myLoc.x - radius[2];
			afterLoc.y = +myLoc.y - radius[4];
		};
		if (myW > -20482 && myW < -17752){
			afterLoc.x = +myLoc.x - radius[1];
			afterLoc.y = +myLoc.y - radius[5];
		};
		if (myW > -17752 && myW < -15022){
			afterLoc.x = +myLoc.x - radius[0];
			afterLoc.y = +myLoc.y - radius[6];
		};
		if (myW > -15022 && myW < -12292){
			afterLoc.x = +myLoc.x + radius[1];
			afterLoc.y = +myLoc.y - radius[5];
		};
		if (myW > -12292 && myW < -9562){
			afterLoc.x = +myLoc.x + radius[2];
			afterLoc.y = +myLoc.y - radius[4];
		};
		if (myW > -9562 && myW < -6832){
			afterLoc.x = +myLoc.x + radius[3];
			afterLoc.y = +myLoc.y - radius[3];
		};
		if (myW > -6832 && myW < -4102){
			afterLoc.x = +myLoc.x + radius[4];
			afterLoc.y = +myLoc.y - radius[2];
		};
		if (myW > -4102 && myW < -1365){
			afterLoc.x = +myLoc.x + radius[5];
			afterLoc.y = +myLoc.y - radius[1];
		};
		Move(afterLoc.x,afterLoc.y,afterLoc.z,myW);
	}


	function saveBook() {
		fs.writeFileSync(path.join(__dirname, "book.json"), JSON.stringify(aBook, null, '\t'))
	}


}
