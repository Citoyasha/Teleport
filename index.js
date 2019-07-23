module.exports = function TP(mod) {

	const fs = require("fs")
	const path = require("path")
	const Vec3 = require('tera-vec3')

	let myLoc = null,
		myW = null,
		Journal = {}

	var gameId = null;
	var tLoc = 0, afterLoc = [];

	try {
		Journal = require('./Journal.json'); }
	catch(e) {
		Journal = {};
	}

	mod.command.add('tp', (arg1, arg2, arg3) => {
		if(arg1 && arg1.length > 0) arg1 = arg1.toLowerCase();
		if(arg2 && arg2.length > 0) arg2 = arg2.toLowerCase();
		if(arg3 && arg3.length > 0) arg3 = arg3.toLowerCase();
		switch (arg1) {
			case "s":
			case "save":
				if (arg2) {
					Journal[arg2] = {
						zone: mod.game.me.zone,
						x: myLoc.x,
						y: myLoc.y,
						z: myLoc.z,
						w: myW
					}
					saveBook();
				mod.command.message(`Location is Saved ${arg2}`);
			};
				break;
			case "m":
			case "move":
				if (arg2) {
					if (!Journal[arg2]) {
						mod.command.message(`Cannot find [${arg2}] in the book.`);
						break;
					} else if (Journal[arg2].zone != mod.game.me.zone){
						mod.command.message(`You are not in zone: ${Journal[arg2].zone}.`);
						break;
					}
					Move(Journal[arg2].x,Journal[arg2].y,Journal[arg2].z,Journal[arg2].w);
				};
				break;
			case "remove":
			case "delete":
			case "del":
				if (arg2) {
					if (!Journal[arg2]) {
						mod.command.message(`Cannot find [${arg2}] in the book.`);
					} else {
						delete Journal[arg2];
						saveBook();
						mod.command.message(`[${arg2}] has been removed.`);
					}
				}
				break;
			case "blink":
				blink(arg2);
				break;
			case "back":
				if (tLoc != 0) {
					if (mod.game.me.zone != tLoc.zone){
						mod.command.message(`You are not in zone: ${tLoc.zone}`);
					}else{
						Move(tLoc.x,tLoc.y,tLoc.z,tLoc.w);
					}
				} else { mod.command.message('You should blink first!') }
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
			mod.command.message(
				"Current Coord: "
				+ "\n\t - [Zone] "   +mod.game.me.zone
				+ "\n\t - [x] " + Math.round(myLoc.x)
				+ "\n\t - [y] " + Math.round(myLoc.y)
				+ "\n\t - [z] " + Math.round(myLoc.z)
				+ "\n\t - [w] "     + Math.round(myW)
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

	function blink(d) {
		tLoc = {
			zone: mod.game.me.zone,
			x: myLoc.x,
			y: myLoc.y,
			z: myLoc.z,
			w: myW
		};
		afterLoc = myLoc;
		afterLoc.x = myLoc.x + d * Math.cos(myW);
		afterLoc.y = myLoc.y + d * Math.sin(myW);
		afterLoc.z = myLoc.z + 20;
		Move(afterLoc.x,afterLoc.y,afterLoc.z,myW);
	}

	function saveBook() {
		fs.writeFileSync(path.join(__dirname, "Journal.json"), JSON.stringify(Journal, null, '\t'))
	}

}
