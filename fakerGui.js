const fakerList=["random","helpers","name","address","company","finance","image","lorem","hacker","internet","phone","date","commerce","system"];
const fakerObject={"definitions":["name","address","company","lorem","hacker","phone_number","finance","internet","commerce","system","date","title","separator"],"random":["number","arrayElement","objectElement","uuid","boolean","word","words","image","locale","alphaNumeric"],"helpers":["randomize","slugify","replaceSymbolWithNumber","replaceSymbols","shuffle","mustache","createCard","contextualCard","userCard","createTransaction"],"name":["firstName","lastName","findName","jobTitle","prefix","suffix","title","jobDescriptor","jobArea","jobType"],"address":["zipCode","city","cityPrefix","citySuffix","streetName","streetAddress","streetSuffix","streetPrefix","secondaryAddress","county","country","countryCode","state","stateAbbr","latitude","longitude"],"company":["suffixes","companyName","companySuffix","catchPhrase","bs","catchPhraseAdjective","catchPhraseDescriptor","catchPhraseNoun","bsAdjective","bsBuzz","bsNoun"],"finance":["account","accountName","mask","amount","transactionType","currencyCode","currencyName","currencySymbol","bitcoinAddress"],"image":["image","avatar","imageUrl","abstract","animals","business","cats","city","food","nightlife","fashion","people","nature","sports","technics","transport"],"lorem":["word","words","sentence","sentences","paragraph","paragraphs","text","lines"],"hacker":["abbreviation","adjective","noun","verb","ingverb","phrase"],"internet":["avatar","email","exampleEmail","userName","protocol","url","domainName","domainSuffix","domainWord","ip","userAgent","color","mac","password"],"phone":["phoneNumber","phoneNumberFormat","phoneFormats"],"date":["past","future","between","recent","month","weekday"],"commerce":["color","department","productName","price","productAdjective","productMaterial","product"],"system":["fileName","commonFileName","mimeType","commonFileType","commonFileExt","fileType","fileExt","directoryPath","filePath","semver"]};

class Tabella{

    constructor(sqlCode,nome){
        this.sqlCode=sqlCode;
        this.nome=nome;
        this.attributi=[];
        this.specialField=[];
        this.specialValue=[];
    }
    costruisceTable(eleHTML,listAttri){
        this.attributi=listAttri;
        console.log(listAttri);
        //chiama il DB e fai la query
        let divTot=document.createElement("div");
        divTot.setAttribute("class","div_tot");
        divTot.id=this.nome;
        console.log("Questo e il nome "+this.nome);

        let label=document.createElement("label");
        label.textContent=this.nome;
        divTot.appendChild(label);

        let numtot=document.createElement("input");
        numtot.setAttribute("type","number");
        numtot.setAttribute("value","0");
        numtot.setAttribute("min","0");
        numtot.setAttribute("max","1000");
        numtot.setAttribute("class","num_tot");
        divTot.appendChild(numtot);


        let divVal=document.createElement('div');
        divVal.setAttribute("class","div_val_cont");
        for(let e of listAttri){

            let div=document.createElement('div');
            div.setAttribute("class","div_val2");

            let l=document.createElement("label");
            l.textContent=e;
            div.appendChild(l);
            createSelecotrArg(this.nome,div);
            divVal.appendChild(div);
        }
        divTot.appendChild(divVal);

        let divVal2=document.createElement('div');
        divVal2.setAttribute("class","div_val_cont");
        
        this.createSelect(divVal2);
        
        divTot.appendChild(divVal2);

        let briempi=document.createElement('button');
        briempi.textContent="Fill";
        briempi.setAttribute("style","width:100%;");

        briempi.addEventListener('click',fillDB)
        divTot.appendChild(briempi);


        eleHTML.appendChild(divTot);
    }

    createSelect(eleHTML){
        let div=document.createElement('div');
        div.setAttribute("class","div_val2");

        let sel=document.createElement("select");
        sel.setAttribute("class","sel_spec");

        for (let o of this.attributi){
            const opt = document.createElement("option");
            opt.value = o;
            opt.text = o;
            sel.add(opt);
        }
        div.appendChild(sel);
        let inp=document.createElement('input');
        inp.setAttribute("class","inp_special_val");
        div.appendChild(inp);

        let inp2=document.createElement('input');
        inp2.setAttribute("type","number");
        inp2.setAttribute("value","0");
        inp2.setAttribute("min","0");
        inp2.setAttribute("class","inp_special_num");
        div.appendChild(inp2);

        //aggiungiamo il bottone
        let b=document.createElement('button');
        b.textContent="Add";
        b.setAttribute("style","width:100%;");

        b.addEventListener('click',(e)=>{

            console.log(e.target.parentElement);
            //eleHTML.appendChild(div);
            console.log(e.target.parentElement.children[0].querySelector('.sel_spec'));

            let div=document.createElement('div');
            div.setAttribute("class","div_val2");

            let sel=e.target.parentElement.children[0].querySelector('.sel_spec').cloneNode(true);
            div.appendChild(sel);
            let inp=document.createElement('input');
            inp.setAttribute("class","inp_special_val");
            div.appendChild(inp);
            let inp2=document.createElement('input');
            inp2.setAttribute("type","number");
            inp2.setAttribute("value","0");
            inp2.setAttribute("min","0");
            inp2.setAttribute("class","inp_special_num");
            div.appendChild(inp2);

            let bx=document.createElement('button');
            bx.textContent='X';
            bx.addEventListener('click',(e)=>{
                //console.log(e.target.parentElement);
                e.target.parentElement.remove();
            });
            div.appendChild(bx);
        

            //e.target.parentElement.appendChild(e.target.parentElement.children[0].cloneNode(true))
            e.target.parentElement.insertBefore(div, e.target)



        })
        


        eleHTML.appendChild(div);
        eleHTML.appendChild(b);

    }

}



function createSelecotrArg(nome,contElem){

    if (document.getElementById(nome)) return;

    const sel1 = document.createElement("select");
    sel1.setAttribute("class", `f1`);
    sel1.setAttribute("nome", nome);

    for (let e of fakerList) {
        let opt =document.createElement("option");
        opt.value=e;
        opt.textContent=e;
        sel1.add(opt);
    }
    
    sel1.addEventListener('change',cambiaValore,true);

    contElem.appendChild(sel1); 

    const sel2 = document.createElement("select");
    sel2.setAttribute("class", `f2`);
    sel2.setAttribute("nome", nome);

    for (let e of fakerObject[fakerList[0]]) {
        let opt =document.createElement("option");
        opt.value=e;
        opt.textContent=e;
        sel2.add(opt);
    }   
    contElem.appendChild(sel2); 
    //sel2.addEventListener('change',testaValore,true);

}

function testaValore(event){
    let parent=event.target.parentElement.querySelector('.f2');
   }

function cambiaValore(event){
    let eleHTML=event.target.parentElement.querySelector('.f2');
    eleHTML.innerHTML="";
    for (let e of fakerObject[event.target.value]) {
        let opt =document.createElement("option");
        opt.value=e;
        opt.textContent=e;
        eleHTML.add(opt);
    }

}

//ritornami i parametri
function returnPar(func){
    if (func instanceof Function){
        let arr =func.toString().split(' ')[1].replace('(','').replace(')','').split(',').filter(word => word.length > 0 && word!=='{\n');
        return arr;
    }
    else 
        return [];

}

//check all faker
function checkFaker(){
    for (let n in fakerObject){
            for (let f in faker[n]){
                    console.log(returnPar(faker[n][f]));
            }     
        }
}
    

        

function fillDB(e){
    const cnt=e.target.parentElement;
    let nome=cnt.id;
    let numero=cnt.querySelector('.num_tot').value;
    let attr=[];
    cnt.querySelectorAll('.div_val2').forEach((e)=>{
        let field=e.querySelector('label');
        let selectors=e.querySelectorAll('select');
        if (field)
            attr.push(
                {
                    'field':field.textContent,
                    'f1':selectors[0].value,
                    'f2':selectors[1].value
                }
            )
        
    })    
    //console.log(attr)
    let riempiTabella={};
    
    for (let el of attr){
        const {field, f1, f2}=el;
        riempiTabella[field]=[];
        for (let i=0;i<numero;i++){
            riempiTabella[el['field']].push(faker[f1][f2].call());  
        }
    }
    //Inserisci le chiave estene
    console.log(`PRAGMA foreign_key_list(${nome});`);
    let info=db.exec(`PRAGMA foreign_key_list(${nome});`);
    console.log(info);
    for (let ele of info){
        for (let v of ele.values){
            console.log(v);
            const te=v[2];
            const f=v[3];
            const par=v[4];
            console.log(`SELECT ${par} FROM ${te}`);
            let dati=db.exec(`SELECT ${par} FROM ${te}`);
            console.log(dati);
            
            let fk=[];
            for(let arr of dati[0].values) fk.push(arr[0]);

            for (let i=0; i<numero-fk.length;i++) {
                let ind=Math.floor(Math.random()*fk.length);
                let elemento=fk[ind];
                fk.push(elemento);
            }


            fk=fk.sort((a,b)=>0.5-Math.random());
            console.log(fk);

            riempiTabella[f]=[];
            //allungare l'array
            for (let i=0;i<numero;i++){
                riempiTabella[f].push(fk[i]);  
            }


        }
    }			 


    console.log(riempiTabella);
    //indi
    let special=[]
    cnt.querySelectorAll('.div_val_cont')[1].querySelectorAll('.div_val2').forEach((e)=>{
        special.push({
            'field':e.querySelector('select').value,
            'value':e.querySelector('.inp_special_val').value,
            'number':e.querySelector('.inp_special_num').value,
        });
    });
    //console.log(special);

    
    for (let el of special){
        const{field,value,number}=el;
        let ind=[];
        for (let i=0;i<numero;i++) ind.push(i);
        ind=ind.sort((a,b)=>0.5-Math.random());
        for(let i=0;i<number;i++) riempiTabella[field][ind[i]]=value;
    }

    // Insert two rows: (1,111) and (2,222)
    fields="(";
    for (let ele in riempiTabella) fields+=`${ele},`;
    fields=fields.substring(0,fields.length-1);
    fields+=")";
    //console.log(fields);
    for (let i=0;i<numero;i++){
        let valori=[];
        let valoriph="(";

        for (let ele in riempiTabella) {
            valori.push(riempiTabella[ele][i]);
            valoriph+="?,";
        }
        valoriph=valoriph.substring(0,valoriph.length-1);
        valoriph+=")"
       // console.log(valoriph);
       // console.log(`INSERT INTO ${nome}  ${fields} VALUES ${valoriph}`);
       try{
        db.run(`INSERT INTO ${nome}  ${fields} VALUES ${valoriph}`, valori);
        }catch(e){
		errorElm.textContent = e;
	}

    
    }
    execute(`SELECT * FROM ${nome}`);


        

}

function testFaker(){
    for (let i of fakerList){
        for (let ele of fakerObject[i]){
            console.log(`${i}-${ele}`);
            try{
                console.log(faker[i][ele].call());
            }catch(err){
                console.log("Errore");
            }

        }
    }
}