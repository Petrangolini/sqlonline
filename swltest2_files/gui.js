var execBtn = document.getElementById("execute");
var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var commandsElm = document.getElementById('commands');
var dbFileElm = document.getElementById('dbfile');
var savedbElm = document.getElementById('savedb');
var filldbElm = document.getElementById('filldb');
var dbListElm = document.getElementById('dbList');

let db;
let tabella=[];
const paroleRiservate=["PRIMARY","CHECK","FOREIGN"];


config = {
	locateFile: filename => `./dist/${filename}`
  }
  // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
  // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
  initSqlJs(config).then(function(SQL){
	//Create the database
	db = new SQL.Database();
	
  });


// Connect to the HTML element we 'print' to
function print(text) {
	outputElm.innerHTML = text.replace(/\n/g, '<br>');
}
function error(e) {
	console.log(e);
	errorElm.style.height = '2em';
	errorElm.textContent = e.message;
}

function noerror() {
	errorElm.style.height = '0';
}




// Run a command in the database
function execute(commands) {
	try{
		let res=db.exec(commands);
		console.log(res);
		outputElm.innerHTML = "";
		for (var i = 0; i < res.length; i++) {
			outputElm.appendChild(tableCreate(res[i].columns, res[i].values));
		}

	}catch(e){
		errorElm.textContent = e;
	}
	

	//outputElm.textContent = "Fetching results...";
}

// Create an HTML table
var tableCreate = function () {
	function valconcat(vals, tagName) {
		if (vals.length === 0) return '';
		var open = '<' + tagName + '>', close = '</' + tagName + '>';
		return open + vals.join(close + open) + close;
	}
	return function (columns, values) {
		var tbl = document.createElement('table');
		var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
		var rows = values.map(function (v) { return valconcat(v, 'td'); });
		html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
		tbl.innerHTML = html;
		return tbl;
	}
}();

// Execute the commands when the button is clicked
function execEditorContents() {
	errorElm.textContent="";
	testDB.innerHTML="";

	execute(editor.getValue() + ';');
}
execBtn.addEventListener("click", execEditorContents, true);

// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
function tic() { tictime = performance.now() }
function toc(msg) {
	var dt = performance.now() - tictime;
	console.log((msg || 'toc') + ": " + dt + "ms");
}

// Add syntax highlihjting to the textarea
var editor = CodeMirror.fromTextArea(commandsElm, {
	mode: 'text/x-mysql',
	viewportMargin: Infinity,
	indentWithTabs: true,
	smartIndent: true,
	lineNumbers: true,
	matchBrackets: true,
	autofocus: true,
	extraKeys: {
		"Ctrl-Enter": execEditorContents,
		"Ctrl-S": savedb,
	}
});

// Load a db from a file
dbFileElm.onchange = function () {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function (fle) {
		let arrayBuffer=fle.target.result;
      	let uInt8Array=new Uint8Array(arrayBuffer);
		try {
			initSqlJs(config).then(function(SQL){
				//Create the database
				db = new SQL.Database(uInt8Array);
				
			  });
			
		}
		catch (exception) {
		}
	}
	r.readAsArrayBuffer(f);
}

// Save the db to a file
function savedb() {
	
	//var arraybuff = event.data.buffer;
		console.log("SOno qui")
		var blob = new Blob([db.export()]);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.setAttribute("id", "download");

		a.href = window.URL.createObjectURL(blob);
		a.download = "sql.db";
		a.onclick = function () {
			setTimeout(function () {
				console.log("ciao");
				window.URL.revokeObjectURL(a.href);
				document.getElementById("download").remove();
			}, 1500);
		};
		a.click();
}


savedbElm.addEventListener("click", savedb, true);


//Fill select
function fillOption(arr){
	let opts="";
	for (let a of arr) opts+=`<option value="${a}">${a}</option>\n`;

	dbListElm.innerHTML=opts;
}
/*
dbFileElm.onchange = function (event) {
	console.log(event.target.files);
	let fileis = event.target.files[0];
    let fileredr = new FileReader();
    fileredr.onload = function (fle) {
      let arrayBuffer=fle.target.result;
      let uInt8Array=new Uint8Array(arrayBuffer);

     // db=new SQL.Database(uInt8Array);
    };
	fileredr.readAsArrayBuffer(fileis);
}
*/
//dbListElm.addEventListener("change",selectDBchange ,true);

function createTable(){
	testDB.innerHTML="";
	try{
		let res=db.exec("SELECT * FROM sqlite_master WHERE type='table'");
		console.log(res);
		tabella=[];
		let i=0;
		//cerca attributi dall sql
		for(let valori of res[0].values){
			console.log(valori);
			if (valori[1]!='sqlite_sequence'){
				tabella.push(new Tabella(valori[4],valori[1]));
				let attr=ritornaAttributi(valori[4],valori[1]);
				console.log(attr);
				tabella[i].costruisceTable(testDB,attr);
				i++;
			}
		}
			
		

	}catch(e){
		errorElm.textContent = e;
	}
}

function ritornaAttributi(sqlCode,nome){
	let att=[];
	let def=sqlCode.substring(
				sqlCode.indexOf("(") + 1, 
				sqlCode.lastIndexOf(")"))
				.split(",").map(element => {
					if ( !element.includes("AUTOINCREMENT") && !element.includes("autoincrement") )
					return element.split(" ");
					else
					return [""];
				});
	//console.log(def);
	//return def;
	for(let e of def)
				for(let n of e)
				 if (n.trim().length>0){
					att.push(n)
					break;
				 }
	//rimuovi le foreign key
	console.log(att);
	let info=db.exec(`PRAGMA foreign_key_list(${nome});`);			 
	console.log(info);

	for (let ele of info){
		for(let elle of ele.values){
			let nome=elle[3];
			console.log(nome);
			for (let i=att.length-1;i>=0;i--){
				console.log(att[i]);
				if (att[i].trim()==nome.trim()) att.splice(i,1);
				else if ( att[i] && (att[i].toUpperCase()=="CHECK" || att[i].toUpperCase()=="PRIMARY" || att[i].toUpperCase()=="FOREIGN" || att[i].toUpperCase()=="UNIQUE")) att.splice(i,1);
			}
		}
	}
	att=att.map(e=> e.trim());
	console.log(att);
	return att;			 
}


filldbElm.addEventListener("click",createTable,true);

