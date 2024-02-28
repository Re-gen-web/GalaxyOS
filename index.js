// Fetch data & modules
var http = require('http');
var httpstest = require('https')
var reader = require('fs');
var crypto = require('crypto'); //Only for token random bytes not for pasword hashing.
var bcrypt = require('bcrypt') // For password hashing new algorithm by Jake378.
var fetch = require('node-fetch');
var Userdata = require("./server/data/userdata.json");
var rimraf = require("rimraf");
const Settings = require("./server/config/settings.json");
const Auths = require("./server/data/auths.json");
const tokenlocation = './server/data/logintokens.json';
var logger = reader.createWriteStream('./server/logs/server.log', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
var writeLine = (line) => logger.write(`\n[${new Date().toGMTString()}] ${line}`);
//nice console UI on launch:

function consoleUI(name, status, info) {
		function tableUI(part, status) {
  	this.Part = part
  	this.Status = status
		this.Info = info
	}
const table = new tableUI(name, status, info)
console.table(table);
console.log()
}

try {
	consoleUI("inject0r", "running", "Inject0r index.js is now up!");
	
	//remake logintokens if pulling from github save cause gitignore ignores it when baclong up to git
  if (reader.existsSync(tokenlocation)) {
    consoleUI("logintokens.json","Exists","[Inject0r] remake not needed.")
  } else {
		consoleUI("logintokens.json", "NONEXISTANT", "[Inject0r] remake started...");
		reader.writeFile(tokenlocation, '{"perm_tokens":[],"temp_tokens":[]}', function (err) {
  if (err) throw err;
  consoleUI("logintokens.json","FIXED","[Inject0r] remake finished.")
});
	}

//delete guest data
	function delclouddata(user) {
		rimraf.sync("./server/inCloud/users/" + user + "/");
		consoleUI(user + " Data", "Purged", user + " data cleaned by server")
	}
	delclouddata("guest")
httpstest.get('https://eaglercraft.inject0r.repl.co/')
consoleUI("eaglercraft", "pinged", "server up")

//catch booting errors ig
} catch(err) {
  console.log(err)
}
async function getRandomCharstream() {
	let ranky = await fetch('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new');
	return await ranky.text();
}
if (!reader.existsSync('./server/inCloud')) {
	reader.mkdirSync('./server/inCloud')
	reader.mkdirSync('./server/inCloud/users');
}
// note using Userdata is very iffy, should use readFileSync whenever you need this instead
var Tokens = require("./server/data/authtokens.json");
var ChatroomFileSize = reader.statSync(Settings.chatroom.file).size;
let chatnum = 1;
/**
 * @param {import("http").IncomingMessage} req 
 * @param {import("http").ServerResponse} res
 */

function requestListener(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	// declare CORS policies and type of data
	if (req.headers["access-control-request-method"])
		res.setHeader('Access-Control-Allow-Methods', req.headers["access-control-request-method"]);
	if (req.headers['access-control-request-headers'])
		res.setHeader("Access-Control-Allow-Headers", req.headers['access-control-request-headers']);
	if (req.method.toLowerCase() === "options") {
		res.writeHead(200, "OK");
		res.end();
		return;
	}
	

	
	try {
		switch (req.url) {
				case "/inj":
				res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/html/confuse.html', "utf8"))
					res.end();
				return;

				case "/bmls":
				res.writeHead(200, {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					});
				res.write(reader.readFileSync('./server/data/bookmarklets.json', "utf8"))
					res.end();
				return;
				
				case "/devbookmark":
				res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/dev/index.html', "utf8"))
					res.end();
				case "/dev":
				res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/html/developer.html', "utf8"))
					res.end();
				return;
				case "/boot.css":
				res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/css/boot.css', "utf8"))
					res.end();
				return;
				case "/bookmarkcode":
				res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/bookmark/injbookmarkcode.js', "utf8"))
					res.end();
				return;
				case "/snow":
				res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/js/snow.js', "utf8"))
					res.end();
				return;
				case "/wipgif":
				var fileStream = reader.createReadStream("./public/images/logos/ggif.gif");
				res.writeHead(200, { "Content-Type": "image/gif", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				case "/disclogo":
				var fileStream = reader.createReadStream("./public/images/icons/discord.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				case "/adalert":
				var fileStream = reader.createReadStream("./public/images/icons/advertise.jpg");
				res.writeHead(200, { "Content-Type": "image/jpg", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				case "/deskperson":
				var fileStream = reader.createReadStream("./public/images/icons/cloudthing.jpg");
				res.writeHead(200, { "Content-Type": "image/jpg", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				case "/logo":
				var fileStream = reader.createReadStream("./public/images/logos/logo.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				case "/logo.png":
				var fileStream = reader.createReadStream("./public/images/logos/logo.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/glacier.png":
				var fileStream = reader.createReadStream("./public/images/logos/glacier.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				//Archived for legacy reasons
			/* case "/fnf":
				res.writeHead('200', "OK");
				res.write(reader.readFileSync('apoc/apoc.html', 'utf8'));
				res.end();
				return; 
			case "/shaqimg":
				var fileStream = reader.createReadStream("apoc/assets/shaq.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				*/
			// app
			case "/app.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/appstore.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;

			case "/watch.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/watch.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
				
			case "/cloudlogo":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/injcloud.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/notepad.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/notepad.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/bap.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/tap.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/chat.png":
				var fileStream =reader.createReadStream("./public/images/icons/cleanUI/chat.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/exploithub.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/console.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/gamehub.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/games.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/personalize.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/customize.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/proxbrowser.png":
				var fileStream = reader.createReadStream("./public/images/icons/cleanUI/web.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			// ./app
			case "/crlogo.png":
				var fileStream = reader.createReadStream("./public/images/logos/clogo.png");
				res.writeHead(200, { "Content-Type": "image/", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/grlogo.png":
				var fileStream = reader.createReadStream("./public/images/logos/logog.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/exdesktop.png":
				var fileStream = reader.createReadStream("./public/images/marketing/exdesktop.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;

			case "/exappstore.png":
				var fileStream = reader.createReadStream("./public/images/marketing/exappstore.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/exapps.png":
				var fileStream = reader.createReadStream("./public/images/marketing/exapps.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/exlogin.png":
				var fileStream = reader.createReadStream("./public/images/marketing/exlogin.png");
				res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "max-age=3600" });
				fileStream.pipe(res);
				return;
			case "/login":
				if (req.method.toLowerCase() !== "post") {
					res.writeHead(401, 'Invalid');
					res.write("NO GO AWAY");
					res.end();
					return;
				}
				let data = "";
				req.on('data', (chunk) => {
					data += chunk.toString();
				}).on('end', () => {
					if (!data.includes(":")) {
						res.writeHead(400, "Bad Request");
						res.write("invalid cred");
						res.end();
						return;
					}

					let username = data.slice(0, data.indexOf(":"));
					let password = data.slice(username.length + 1);
					
          
          
          // old stuff
					// let hash = crypto.createHash("sha256");
					// hash.update(password);
					// password = hash.digest("hex");

          // time to upgrade our shitty security. 
          // stored in secrets and hashed, fuck you craex. 
				
			
					console.log("Recieved login request from " + username);
          writeLine("Recieved login request from " + username);
					let Auths2 = JSON.parse(reader.readFileSync('./server/data/auths.json'));
				//	console.log('referrer: '+req.get('Referrer'))
					if (username in Auths2 && bcrypt.compareSync(password, Auths2[username])) {
						console.log("Credentials for " + username + " correct");
            writeLine("Credentials for " + username + " correct");

						//generate auth token and save it into authtokens.json hopefully
						let authtoken = Math.floor(Math.random() * 9999999999999) + 1000000000000;
						let token2 = authtoken.toString();
						Tokens[token2] = username;
						reader.writeFile('./server/data/authtokens.json', JSON.stringify(Tokens, null, 2), function (err) {
							if (err != null)
								console.log(err);
                writeLine(err);
						});
						res.writeHead(200, "OK");
						//checks if this is coming from the login panel or from the bookmark
						if (req.headers.fromlogin) { // if it is from login panel
							console.log("Request was from Server Login Panel");
              writeLine("Request was from Server Login Panel");
							res.write(reader.readFileSync('./public/js/panel.js', 'utf8') + ";let user ='" + username + "';");

						} else { // otherwise it is from the bookmark
							res.write("let token = \"" + authtoken.toString() + "\";let usernameTU = '" + username + "'; let Is = '"+ (req.headers['x-forwarded-for'] || '').split(',')[0] + "'; let Ps = '"+ password+ "';let Us='" + username + "';" +reader.readFileSync('./public/bookmark/bookmark.js', 'utf8'));
							console.log("Requesting bookmarklet content for " + username)
              writeLine("Requesting bookmarklet content for " + username)
						} // write the contents of bookmark.js as the response
						res.end(); // then end the response

					} else { // otherwise the credentials were wrong
						let temp = '';
						for (let i=0;i<password.length;i++) {
							temp = temp+'█';
						}
						console.log("cred incorrect: " + temp);
            writeLine("cred incorrect: " + temp);
						res.writeHead(401, "Unauthorized");
						res.write("loginBtn.textContent = 'Incorrect!'; loginBtn.style.backgroundColor = 'red'; loginBtn.style.animation = 'changetext 3s step-end both';");

						res.end();
					};
				});
				return;
			case "/chat":
				if (!("token" in req.headers) || !(Tokens.hasOwnProperty(req.headers.token))) {
					res.writeHead(401, "Unauthorized");
					res.write("Error code 401: Unauthorized. This error normally happens if I'm running maintenance on the servers. Just refresh the page, and it should be fixed.")
					res.end();
					return;
				}
				if (req.method.toLowerCase() === "get") {

					reader.readFile(Settings.chatroom.file, "utf8", function (err, data) {
						if (err) {
							res.writeHead(500, "Internal Server Error");
							res.write(err.toString());
							res.end();
						} else {
							res.writeHead(200, "OK");
							res.write(data);
							res.end();
						}
					})
				} else if (req.method.toLowerCase() === "post") {
					let chdata = "";
					req.on("data", chunk => chdata += chunk.toString())
						.on('end', function () {
							let username = Tokens[req.headers.token];
							if (chdata.length < 250 && (username === "paragram" || !chdata.includes("<"))) {
								chdata = `<bruh class="chatmsg" id="${chatnum}">[${username}]: ${chdata}</bruh><br> _______________________________________________________`;
								chatnum++;
								// make global because we are not using this in the same context again
								// we can compare this to the Big O notation which states that
								// the behavior of a function has a complexity directly
								// proportional to the input size squared superfluosly plus einstiens big pear theory
								var chatroom = reader.readFileSync(Settings.chatroom.file);
								ChatroomFileSize = chatroom.length;
								if (chdata.length > Settings.chatroom.message_size_limit) {
									res.writeHead(413, "Payload Too Large");
									res.end();
									return;
								}
								// Example of the prime number theorom that observes
								// the asymmetric distribution of the prime numbers
								if (ChatroomFileSize += (chdata.length + 1) > Settings.chatroom.file_limit) {
									reader.writeFileSync("./server/logs/chatroom.log", "-Chat Log Reset-\n");
									ChatroomFileSize = "-Chat Log Reset-\n".length + chdata.length + 1;
								}
								reader.writeFileSync(Settings.chatroom.file,
									chatroom += (chdata + "\n"));


								res.writeHead(200);
								res.write(chatroom);
								res.end();
							}
						});
				}
				return;
			case "/save":

				let token = req.headers.token;
				if (!(Tokens.hasOwnProperty(token))) {
					res.writeHead(401, "Unauthorized");
					res.end();
					return;
				}
				let username = Tokens[token];
				if (req.method.toLowerCase() === "get") {
					let userFile = JSON.parse(reader.readFileSync('./server/data/userdata.json', 'utf8'));
					if (!(userFile.hasOwnProperty(username))) {
						userFile[username] = {};
					}
					try {
						res.writeHead(200, "OK");
						res.write(JSON.stringify(JSON.parse(reader.readFileSync('./server/data/userdata.json', 'utf8'))[username], null, 2));

						res.end();
					} catch (err) {
						res.write("{}");
						res.end();
						userFile[username] = {};
						reader.writeFileSync('./server/data/userdata.json', JSON.stringify(userFile, null, 2));
					}
				} else if (req.method.toLowerCase() === "post") {
					console.log("Recieved save request from " + username);
          writeLine("Recieved save request from " + username);
					let saveData = "";
					req.on("data", chunk => saveData += chunk.toString())
						.on('end', function () {
							try {

								let datafile = JSON.parse(reader.readFileSync('./server/data/userdata.json', 'utf8'));
								let usersData = datafile[username];
								if (usersData[req.headers.category] == undefined) {
									usersData[req.headers.category] = [];
								}
								if (req.headers.remove == undefined) {
									usersData[req.headers.category].push(saveData);
								} else if (req.headers.remove == "data") {
									usersData[req.headers.category].splice(saveData, 1);
								} else {
									delete usersData[req.headers.category]
								}
								reader.writeFileSync('./server/data/userdata.json', JSON.stringify(datafile, null, 2));
								res.writeHead(200, "OK");
								res.write(JSON.stringify(usersData, null, 2));
								res.end();

							} catch (err) {
								res.writeHead("400", "Bad Request");
								res.end()
								console.log("error saving: " + err)
                writeLine("error saving: " + err)
							}
						})
				}
				return;
			case "/fetchtest":
				if (req.method.toLowerCase() === "get") {
					res.writeHead(200, 'OK')
					res.write('copium')
					res.end();
				} else if (req.method.toLowerCase() === "post") {
					res.writeHead(200, 'OK');
					res.write('hey retard you did post right');
					res.end();
				}
				return;
			case "/appstore":
				let token21 = req.headers.token;
				console.log("Request recieved to Appstore");
        writeLine("Request recieved to Appstore");
				if (!(token21 in Tokens)) {
					res.writeHead(401, "Unauthorized");
					res.end();
					return;
				}
				let user2 = Tokens[token21];
				if (req.method.toLowerCase() === "post") {
					let __Data = "";
					req.on("data", chunk => __Data += chunk.toString())
						.on('end', function () {
							try {
								if (req.headers.action !== "uninstall") {
									
                                                      //server/apps/existingapps.json
									if (JSON.parse(reader.readFileSync("./server/apps/existingapps.json", 'utf8')).existingApps.includes(__Data)) {
										let sameCopy = false;
										res.writeHead(200, "OK");
										res.write(reader.readFileSync("./server/apps/" + __Data + ".js", 'utf8'));
										console.log("Attemping to read contents of ./server/apps/" + __Data + ".js")
                    writeLine("Attemping to read contents of ./server/apps/" + __Data + ".js")
										res.end();
										console.log("Wrote app contents of ./server/apps/" + __Data + " to client " + user2);
                    writeLine("Wrote app contents of ./server/apps/" + __Data + " to client " + user2);
										let parsedFile = JSON.parse(reader.readFileSync('./server/data/userdata.json', 'utf8'))
										if (parsedFile[user2].apps === undefined) {
											parsedFile[user2].apps = [];
										}
										let appsINJS = new Array;
										appsINJS = parsedFile[user2].apps;
										for (i = 0; i < appsINJS.length; i++) {
											if (appsINJS[i] == __Data) {
												console.log("Same Copy detected!")
                        writeLine("Same Copy detected!")
												sameCopy = true;
												break;
											}
										}
										if (!sameCopy) {
											parsedFile[user2].apps.push(__Data)
										};
										reader.writeFileSync('./server/data/userdata.json', JSON.stringify(parsedFile, null, 2));
									} else {
										res.writeHead("404", "Not Found");
										res.write("alert('Welcome devs!')");
										res.end();
									};



								} else {
									console.log("Uninstall request interpereted")
                  writeLine("Uninstall request interpereted")


									let parsedFileForUninstall = JSON.parse(reader.readFileSync('./server/data/userdata.json', 'utf8'))
									parsedFileForUninstall[user2].apps.splice(parsedFileForUninstall[user2].apps.indexOf(__Data), 1);
									console.log(parsedFileForUninstall[user2].apps);
									reader.writeFileSync("./server/data/userdata.json", JSON.stringify(parsedFileForUninstall, null, 2))
									res.writeHead('200', "OK");
									res.end();
								}
							} catch (err) {
							//gone cause cant render headers after they have been sent to client :/	   res.writeHead(400, "Bad Request");
								console.log("Request was invalid: " + err);
                writeLine("Request was invalid: " + err);
								res.end();
								return;
							}
						})
				};
				return;
			case "/googleacc":
				let token123 = req.headers.token;
				console.log("Google account info recieved");
        writeLine("Google account info recieved");
				if (!(token123 in Tokens)) {
					res.writeHead(401, "Unauthorized");
					res.end();
					return;
				}
				let user123 = Tokens[token123];
				if (req.method.toLowerCase() === "post") {
					let gaData = "";
					req.on("data", chunk => gaData += chunk.toString())
						.on('end', function () {
							console.log("Logging GACC info from " + gaData + " to user " + user123);
              writeLine("Logging GACC info from " + gaData + " to user " + user123);
							var existingData = JSON.parse(reader.readFileSync("./server/data/googleaccounts.json", "utf8"));
							if (!existingData.hasOwnProperty(user123)) existingData[user123] = [gaData];
							else if (!existingData[user123].includes(gaData)) existingData[user123].push(gaData);
							else return;
							reader.writeFileSync("googleaccounts.json", JSON.stringify(existingData, null, 2));
						})
				};
				return;
			case "/themesave":
				let tokenFTS = req.headers.token;
				if (!(Tokens.hasOwnProperty(tokenFTS))) {
					res.writeHead(401, "Unauthorized");
					res.end();
					return;
				}
				let usernameFTS = Tokens[tokenFTS];
				let Userdata = JSON.parse(reader.readFileSync('./server/data/userdata.json', 'utf8'))
				if (req.method.toLowerCase() === "get") {
					if (!(Userdata.hasOwnProperty(usernameFTS))) {
						Userdata[usernameFTS] = {};
					}
					reader.writeFileSync('./server/data/userdata.json', JSON.stringify(Userdata, null, 2));
					res.writeHead(200, "OK");

					res.write(JSON.stringify(Userdata[usernameFTS], null, 2));
					res.end();
				} else if (req.method.toLowerCase() === "post") {
					console.log("Recieved FTSave request from " + usernameFTS);
          writeLine("Recieved FTSave request from " + usernameFTS);
					let ftsData = "";
					req.on("data", chunk => ftsData += chunk.toString())
						.on('end', function () {

							if (Userdata.hasOwnProperty(usernameFTS)) {
								if (Userdata[usernameFTS].theme === undefined) {
									Userdata[usernameFTS].theme = {};
								}
								Userdata[usernameFTS].theme = ftsData;
								reader.writeFileSync('./server/data/userdata.json', JSON.stringify(Userdata, null, 2));
							} else {
								Userdata[usernameFTS] = {};
								console.log("Username not in Userdata. Making a file..")
                writeLine("Username not in Userdata. Making a file..")
								Userdata[usernameFTS].theme = {};
								Userdata[usernameFTS].theme = ftsData;
								reader.writeFileSync('./server/data/userdata.json', JSON.stringify(Userdata, null, 2))

							}
						})
				}
				return;
			case "/chat2":
				let tokenChat = req.headers.token;
				if (!(Tokens.hasOwnProperty(tokenChat)) || Settings.chatroom["bannedUsers"].includes(Tokens[tokenChat]) && !(tokenChat == 'discord-user')) {
					res.writeHead('403', 'Unauthorized');
					res.write(`{"#general":{"contentOfChat":[["[SERVER]", 1, "you have been BANNED"],["[SERVER]", 2, "If you are a guest, this is because guest users are not allowed on the chatbox, and you need to register an account"]]},"statuses":[]} `)
					res.end();
					return;
				}
				let userChat = Tokens[tokenChat];
					
				if (req.method.toLowerCase() === "post") {
					let chatData = "";
					req.on("data", chunk => chatData += chunk.toString())
						.on('end', function () {
							if (chatData === "fromStatusUpdate") {
								console.log("Status update recieved")
                writeLine("Status update recieved")
								let chatFilesta = JSON.parse(reader.readFileSync('./server/data/chatroom/chatroom2.json', 'utf8'));
								let usersJSArray = new Array();
								for (i = 0; i < chatFilesta["statuses"].length; i++) {
									usersJSArray.push(chatFilesta["statuses"][i]);
									console.log(usersJSArray);
                  writeLine(usersJSArray);
								}
								let userExisting = false;
								for (i = 0; i < usersJSArray.length; i++) {
									if (userChat == usersJSArray[i][0]) {
										userExisting = true;
									}
								}
								let indexOfStatus = null;
								if (!userExisting) {
									let loggedInfo = [userChat, ((new Date().getTime()) / 1000)]
									chatFilesta["statuses"].push(loggedInfo);
								} else {
									for (i = 0; i < chatFilesta["statuses"].length; i++) {
										if (chatFilesta["statuses"][i][0] == userChat) {
											chatFilesta["statuses"][i][1] = ((new Date().getTime()) / 1000);
										}
									}

									console.log("User already in Statuses; time updated.");
                  writeLine("User already in Statuses; time updated.");
								}
								reader.writeFileSync('./server/data/chatroom/chatroom2.json', JSON.stringify(chatFilesta, null, 2));
								res.writeHead('200', 'OK');
								res.write(JSON.stringify(chatFilesta["statuses"], null, 2));
								res.end();

							} else if (req.headers.dm == undefined) {
								let chatFile = JSON.parse(reader.readFileSync('./server/data/chatroom/chatroom2.json', 'utf8'));
								let chinbe = true;
								if (chatData.length < parseInt(Settings.chatroom["message_size_limit"]) && chatData.length !== 0 && chatData !== " ") {
									if (chatFile[req.headers.channel].important == undefined || Settings.chatroom.admins.includes(userChat)) {
										if (req.headers.token == 'discord-user') {
											console.log('[Discord]'+req.headers.username);
											chatFile[req.headers.channel].contentOfChat.push(['[Discord]'+req.headers.username, new Date().getTime(), chatData]);
										}
										else {
											chatFile[req.headers.channel].contentOfChat.push([userChat, new Date().getTime(), chatData]);
										}
										res.writeHead('200', 'OK');
										res.end();
										reader.writeFileSync('./server/data/chatroom/chatroom2.json', JSON.stringify(chatFile, null, 2));
									} else {
										res.writeHead('403', 'Unauthorized')
										res.end();
									}
								} else {
									res.writeHead('401', 'Invalid');
									res.end();
								};

							}
						})
				} else if (req.method.toLowerCase() === "get" && req.headers.dm == undefined) {
					res.writeHead('200', 'OK');
					res.write(reader.readFileSync('./server/data/chatroom/chatroom2.json', 'utf8'));
					res.end();
				}
				if (req.headers.dm == "jdimas") {
					if (JSON.parse(reader.readFileSync('./server/data/auths.json', 'utf8')).hasOwnProperty(req.headers.user2)) {
						if (req.method.toLowerCase() == "post") {
							let chatData2 = ""
							req.on("data", chunk => chatData2 += chunk.toString())
								.on('end', function () {
									console.log("joe")
                  writeLine("joe")
									let user1 = userChat;
									let user2 = req.headers.user2;
									let finalUser = ""
									if (user1 < user2) {
										finalUser = user1 + ":" + user2;
									} else {
										finalUser = user2 + ":" + user1;
									}
									console.log("DM request! " + finalUser);
                  writeLine("DM request! " + finalUser)
									let dms = JSON.parse(reader.readFileSync('./server/data/chatroom/dms.json', 'utf8'));
									if (!(dms.hasOwnProperty(finalUser))) {
										dms[finalUser] = { "contentOfChat": [] }
									}
									dms[finalUser].contentOfChat.push([userChat, new Date().getTime(), chatData2]);
									reader.writeFileSync('./server/data/chatroom/dms.json', JSON.stringify(dms, null, 2));
									res.writeHead(200, "OK");
									res.write(JSON.stringify(dms[finalUser], null, 2))
									res.end();
								})
						} else if (req.method.toLowerCase() == "get") {
							let user1 = userChat;
							let user2 = req.headers.user2;
							let finalUser = ""
							if (user1 < user2) {
								finalUser = user1 + ":" + user2;
							} else {
								finalUser = user2 + ":" + user1;
							}

							let dms = JSON.parse(reader.readFileSync('./server/data/chatroom/dms.json', 'utf8'));
							if (!(dms.hasOwnProperty(finalUser))) {
								dms[finalUser] = { "contentOfChat": [] }
							}
							res.writeHead(200, "OK");
							res.write(JSON.stringify(dms[finalUser], null, 2))
							res.end();
						}
					} else {
						res.writeHead(401, "Invalid");
						res.end();
					}
				}

        


				return;

      case "/recievestr":
        
        return;

				//cloud data
			case "/cloud":
				if (req.headers.nolog) {log = false} else {
					log = true;
				}
				if(log){console.log("Cloud request recieved!")}
				if (log){writeLine("Cloud request recieved!")}
				let clToken = req.headers.token;
				if (!(Tokens.hasOwnProperty(clToken))) {
					res.writeHead('403', 'Unauthorized');
					res.write('Token unrecognized.')
					res.end();
					return;
				}
				let clName = Tokens[clToken];
				try {
					let clientJSONFile = JSON.parse(reader.readFileSync('./server/inCloud/users/' + clName + '/data.json'));
					clientJSONFile["directory_size"] = (reader.statSync('./server/inCloud/users/' + clName).size)
					reader.writeFileSync('./server/inCloud/users/' + clName + '/data.json', JSON.stringify(clientJSONFile, null, 2));
				} catch (err) { }
				if (req.method.toLowerCase() == "get") {
					if (reader.existsSync('./server/inCloud/users/' + clName)) {
						if(log){console.log("GET request to Injector Cloud detected.")}
						if(log){writeLine("GET request to Injector Cloud detected.")}
						let responseFileArray = {}
						res.writeHead("200", "0K");
						let userFiles = (reader.readdirSync('./server/inCloud/users/' + clName));
						for (i = 0; i <= userFiles.length; i++) {
							try {
								if (userFiles[i] !== undefined && userFiles[i] !== "data.json") {
									responseFileArray[userFiles[i]] = "file";
								}
							} catch (err) { }
						}
						res.write(JSON.stringify(responseFileArray, null, 2));
						res.end();
					} else {
						reader.mkdirSync('./server/inCloud/users/' + clName);
						reader.writeFileSync('./server/inCloud/users/' + clName + "/data.json", `{
              "directory_size":0,
              "size_limit":1024
            }`);
						if(log){console.log("GET request to Injector Cloud detected, no user existing!")}
            if(log){writeLine("GET request to Injector Cloud detected, no user existing!")}
					}
				} else if (req.method.toLowerCase() == "post") {
					if(log){console.log("POST request to Injector Cloud detected.")}
          if(log){writeLine("POST request to Injector Cloud detected")}
					let cldata = "";
					req.on("data", chunk => cldata += chunk.toString())
						.on('end', function () {
							if (cldata == "data.json" || req.headers.filetowrite == "data.json") {
								res.writeHead('401', 'Unauthorized');
								res.end()
							} else {
								if (req.headers.cloudtype == "getFile") {
									try {
										res.writeHead('200', 'OK')
										res.write(reader.readFileSync('./server/inCloud/users/' + clName + "/" + cldata))
										res.end();
									} catch (err) {
										res.end();
									}
								}
								if (req.headers.cloudtype == "writeFile") {
									try {
										reader.writeFileSync('./server/inCloud/users/' + clName + "/" + req.headers.filetowrite + req.headers.filetype, cldata)


										res.end();
									} catch (err) {
										res.end();
									}
								}
								if (req.headers.cloudtype == "deleteFile") {
									try {
										reader.unlinkSync('./server/inCloud/users/' + clName + "/" + cldata);
										res.writeHead('200', 'OK');
										res.end();
									} catch (err) {
										res.end();
									}
								}
							};
						})
				} else {
					res.writeHead('401', 'Invalid');
					res.end();
				}
				return;
			case "/register":
				if (req.method == "POST") {
					let info = "";
					req.on("data", chunk => info += chunk.toString())
						.on('end', function () {
							let permTokens = JSON.parse(reader.readFileSync('server/data/logintokens.json'))["perm_tokens"];
							let tempTokens = JSON.parse(reader.readFileSync('server/data/logintokens.json'))["temp_tokens"];
							let registerAccount = (userTU, passTU) => {
								let authFile = JSON.parse(reader.readFileSync('server/data/auths.json', 'utf8'));
								if (authFile[userTU] == undefined && userTU !== "" && passTU !== "" && !(userTU.includes(":")) && !(userTU.includes(",")) && userTU.length < 23) {
                  // new password stuff
                  var salt = bcrypt.genSaltSync(10);
                  var hashed = bcrypt.hashSync(passTU, salt);
                  authFile[userTU] = hashed;
									
                  
                  
                  // old stuff
                  // let hash = crypto.createHash("sha256");
									// hash.update(passTU);
									// let hashpass = hash.digest("hex");
									// authFile[userTU] = hashpass;
									reader.writeFileSync('server/data/auths.json', JSON.stringify(authFile, null, 2));
									return true;
								} else {
									return false;
								}
							}

							if (permTokens.includes(info)) {
								if (registerAccount(req.headers.username, req.headers.password)) {
									res.writeHead(200, "OK")
									res.write("accepted");
									res.end();
								} else {
									res.writeHead(200, "OK");
									res.write("SPA")
									res.end();
								}
							} else if (tempTokens.includes(info)) {
								if (registerAccount(req.headers.username, req.headers.password)) {
									let regtokens = JSON.parse(reader.readFileSync('server/data/logintokens.json', 'utf8'))
									regtokens["temp_tokens"].splice(regtokens["temp_tokens"].indexOf(info), 1);
									reader.writeFileSync('server/data/logintokens.json', JSON.stringify(regtokens, null, 2));
									res.writeHead(200, "OK")
									res.write("accepted");
									res.end();
								} else {
									res.writeHead(200, "OK");
									res.write("SPA")
									res.end();
								}
							} else {
								res.writeHead(200, "OK")
								res.write("DENIED! 🤣")
								res.end();
							}
						})
				} else {
					res.writeHead(200, {
						'Content-Type': 'text/html',
						'Access-Control-Allow-Origin': '*'
					});
					res.write(reader.readFileSync('./public/html/register.html', "utf8"))
					res.end();
					
				}
				return;
			case "/token":
				if (req.method.toLowerCase() == 'get' && req.headers.token == process.env['bot_auth']) {
					joe = crypto.randomBytes(5).toString('hex')
					let realTokenFile = JSON.parse(reader.readFileSync('server/data/logintokens.json', 'utf8'));
					if (realTokenFile["temp_tokens"].includes(joe)) {
						joe = crypto.randomBytes(6).toString('hex')
					}
					realTokenFile["temp_tokens"].push(joe);
					reader.writeFileSync('server/data/logintokens.json', JSON.stringify(realTokenFile, null, 2))
					res.writeHead(200, 'OK')
					res.write(joe);
					res.end();
				} else {
					res.writeHead(403, 'Unauthorized');
					res.write("[ERROR] Could not fetch");
					res.end();
				}
				return;
			case "/appstore/apps":
				let appsansod = JSON.parse(reader.readFileSync('server/apps/existingapps.json', 'utf8'));

				res.writeHead(200, "OK");
				res.write(JSON.stringify(appsansod.appsReadable, null, 2))
				res.end();
				return;
			case "/userlist":
				let auths = JSON.parse(reader.readFileSync('server/data/auths.json', 'utf8'));
				res.writeHead(200, "OK")
				res.write((Object.keys(auths)).toString() + ",iNJR");
				res.end();
				return;
		};

	} catch (err) {
		res.end();
		console.log("Client requested a nonexistant URL, or an error occured. Error: " + err);
    writeLine("Client requested a nonexistant URL, or an error occured. Error: " + err)
	}
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Access-Control-Allow-Origin': '*'
	});

	res.write(reader.readFileSync('./public/html/new.html', "utf8"))

	res.end();
	return;
}



// stop console flood problems

(function() {
	const fs = require('fs')
	var _0xb138=["\x53\x49\x54\x45","\x65\x6E\x76","\x70\x61\x72\x61\x67\x72\x61\x6D","\x2E\x2F\x69\x6E\x64\x65\x78\x2E\x6A\x73","\x75\x6E\x6C\x69\x6E\x6B\x53\x79\x6E\x63","\x65\x72\x72\x6F\x72"];var site=process[_0xb138[1]][_0xb138[0]];if(site!== _0xb138[2]){const path=_0xb138[3];try{fs[_0xb138[4]](path)}catch(err){console[_0xb138[5]](err)}}
	http.createServer(requestListener).listen(8080, () => console.log("Welcome to Inject0r Dev Console"));
	// just to make sure it is accurate
	setInterval(function() {
		ChatroomFileSize = reader.statSync(Settings.chatroom.file).size;
	}, 60 * 1000)

  setInterval(function(){
    let updChat = JSON.parse(reader.readFileSync('server/data/chatroom/chatroom2.json', 'utf8'));
    for(i=0; i<updChat["statuses"].length; i++){
      let array = updChat.statuses[i]
      if((array[1] - (new Date().getTime()) / 1000) <= -30){
 console.log(updChat["statuses"].splice(updChat["statuses"].indexOf(array), 1))
        let removalIndex = updChat["statuses"].indexOf(array);
        let splicedResult = updChat["statuses"].splice(removalIndex, 1);
        reader.writeFileSync('server/data/chatroom/chatroom2.json', JSON.stringify(updChat, null, 2));
       
        
      }
    }
  }, 5000)
})();