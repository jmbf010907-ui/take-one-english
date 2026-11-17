(function(){
"use strict";
var L=window.LEVELS, T=window.TOEFL, PH=window.PHRASES, QU=window.QUOTES, FI=window.FILMS, PL=window.PLACEMENT;
var app=document.getElementById("app");
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
var byId=function(id){for(var i=0;i<L.length;i++)if(L[i].id===id)return L[i];return null;};
var IC={
 play:'<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',
 slow:'<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2 3v10l6-5zM9 3v10l6-5z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
 mic:'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5" fill="currentColor"/><path d="M3 7.5a5 5 0 0010 0M8 12.5v2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

/* ---------- Progreso (solo en este navegador) ---------- */
var S={done:{},exam:{},place:null};
try{var raw=JSON.parse(localStorage.getItem("takeone-v1")||"{}");if(raw&&typeof raw==="object"){S.done=raw.done||{};S.exam=raw.exam||{};S.place=raw.place||null;}}catch(e){}
function save(){try{localStorage.setItem("takeone-v1",JSON.stringify(S));}catch(e){}}
function parts(lv){var k=[];lv.units.forEach(function(u,i){k.push(lv.id+"-u"+(i+1));});k.push(lv.id+"-escena",lv.id+"-speaking",lv.id+"-examen");return k;}
function pct(lv){var k=parts(lv),n=0;k.forEach(function(x){if(S.done[x])n++;});return Math.round(n/k.length*100);}
function totalPct(){var a=0;L.forEach(function(lv){a+=pct(lv);});return Math.round(a/L.length);}

/* ---------- Audio: voz de Claude si está disponible; si no, la voz del navegador ---------- */
var TTS=null,DICT=null,DS=null;
var VOICES=["buttery","airy","glassy","rounded"];
var synth=("speechSynthesis" in window)?window.speechSynthesis:null;
function say(lines,slow){
  var arr=(typeof lines==="string")?[{text:lines,voice:0}]:lines;
  if(TTS){
    var r=slow?0.75:1;
    var payload=arr.map(function(l){return{text:l.text,voice:VOICES[l.voice||0],rate:r,language:"en"};});
    var p;
    try{p=payload.length===1?TTS.speak(payload[0].text,{voice:payload[0].voice,rate:r,language:"en"}):TTS.speak(payload);}catch(e){p=null;}
    if(p&&p.catch)p.catch(function(e){if(e&&e.code==="not_granted"){TTS=null;}});
    return;
  }
  if(synth){
    try{
      synth.cancel();
      arr.forEach(function(l){var u=new SpeechSynthesisUtterance(l.text);u.lang="en-US";u.rate=slow?0.7:0.95;u.pitch=[1,1.3,0.8,1.15][l.voice||0];synth.speak(u);});
    }catch(e){}
  }
}
function stopAudio(){try{if(TTS)TTS.stop();}catch(e){}try{if(synth)synth.cancel();}catch(e){}}
function initCaps(){
  if(!window.claude||!window.claude.use)return false;
  window.claude.use("tts").then(function(t){
    if(!t)return;TTS=t;
    if(t.onState)t.onState(function(o){document.body.classList.toggle("speaking",o.state==="speaking");});
  }).catch(function(){});
  window.claude.use("dictation").then(function(d){
    if(!d)return;DICT=d;document.body.classList.add("has-mic");
    d.onPartial(function(o){if(DS){DS.partial=o.text||"";paintDS();}});
    d.onFinal(function(o){if(DS){DS.text=(DS.text+" "+(o.text||"")).trim();DS.partial="";paintDS();if(DS.auto){d.stop().catch(function(){});}}});
    d.onState(function(o){
      if(o.state==="idle"&&DS){var s=DS;DS=null;clearTimer();
        document.querySelectorAll(".mic.on").forEach(function(b){b.classList.remove("on");});
        s.onDone((s.text||s.partial||"").trim());}
    });
  }).catch(function(){});
  return true;
}
if(!initCaps()){setTimeout(initCaps,1200);}
function paintDS(){var el=document.getElementById(DS.out);if(el)el.textContent=(DS.text+" "+DS.partial).trim()||"Escuchando…";}
function toggleMic(btn,out,auto,onDone){
  if(!DICT)return;
  if(DS){DICT.stop().catch(function(){});return;}
  stopAudio();
  DS={out:out,text:"",partial:"",auto:auto,onDone:onDone};
  btn.classList.add("on");
  var el=document.getElementById(out);if(el)el.textContent="Escuchando… habla ahora";
  DICT.start().catch(function(e){
    DS=null;btn.classList.remove("on");clearTimer();
    if(el)el.textContent="No se pudo usar el micrófono. Puedes escribir tu respuesta.";
    if(e&&e.code==="not_granted"){DICT=null;document.body.classList.remove("has-mic");}
  });
}

/* ---------- Comparación de lo dicho con la frase objetivo ---------- */
function words(s){return String(s).toLowerCase().replace(/[’`]/g,"'").replace(/[^a-z0-9' ]+/g," ").split(/\s+/).filter(Boolean);}
function compare(target,said){
  var a=words(target),b=words(said),n=a.length,m=b.length,i,j;
  var dp=[];for(i=0;i<=n;i++){dp.push(new Array(m+1).fill(0));}
  for(i=1;i<=n;i++)for(j=1;j<=m;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  var hit=new Array(n).fill(false);i=n;j=m;
  while(i>0&&j>0){if(a[i-1]===b[j-1]){hit[i-1]=true;i--;j--;}else if(dp[i-1][j]>=dp[i][j-1])i--;else j--;}
  return{pct:n?Math.round(dp[n][m]/n*100):0,hit:hit};
}
function markTarget(target,hit){
  var k=0;return target.split(/\s+/).map(function(w){var has=words(w).length>0;var c=has?(hit[k]?"hit":"miss"):"";if(has)k+=words(w).length;return'<span class="'+c+'">'+esc(w)+"</span>";}).join(" ");
}

/* ---------- Componentes ---------- */
function sayBtn(text,label,slow){return'<button type="button" class="say'+(label?"":" round")+'" data-act="say" data-say="'+esc(text)+'"'+(slow?' data-slow="1"':"")+' aria-label="'+(label?esc(label):"Escuchar")+'">'+(slow?IC.slow:IC.play)+(label?" "+esc(label):"")+"</button>";}
var SP={};
function speakItem(key,text,hide){
  SP[key]=text;
  return'<div class="sp"><p class="sp-t'+(hide?" hidden":"")+'" id="t-'+key+'">'+esc(text)+"</p>"+
  '<div class="row">'+sayBtn(text,"Escuchar")+sayBtn(text,"Lento",true)+
  '<button type="button" class="mic" data-act="mic" data-key="'+key+'">'+IC.mic+" Repetir</button>"+
  '<div class="nomic"><input type="text" id="in-'+key+'" aria-label="Escribe la frase" placeholder="Sin micrófono: repítela en voz alta y escríbela aquí" autocomplete="off"><button type="button" class="say" data-act="typed" data-key="'+key+'">Comprobar</button></div></div>'+
  '<p class="sp-out" id="out-'+key+'"></p><p class="sp-score" id="sc-'+key+'"></p></div>';
}
function scoreSpeak(key,said){
  var t=SP[key];if(!t)return;
  var r=compare(t,said),el=document.getElementById("t-"+key),sc=document.getElementById("sc-"+key),out=document.getElementById("out-"+key);
  if(out)out.textContent=said?"Se entendió: "+said:"No se captó nada. Intenta de nuevo.";
  if(el){el.classList.remove("hidden");el.innerHTML=markTarget(t,r.hit);}
  if(sc)sc.textContent=r.pct+"% de coincidencia. "+(r.pct>=85?"Excelente.":r.pct>=60?"Casi. Repite las palabras marcadas.":"Escucha la versión lenta y vuelve a intentarlo.");
}
var timerId=null;
function clearTimer(){if(timerId){clearInterval(timerId);timerId=null;}}
function startTimer(elId,secs,onEnd){
  clearTimer();var left=secs,el=document.getElementById(elId);
  var paint=function(){if(el)el.textContent="0:"+(left<10?"0":"")+left;};paint();
  timerId=setInterval(function(){left--;paint();if(left<=0){clearTimer();if(onEnd)onEnd();}},1000);
}
function talkBox(key,prompt,secs,audio){
  return'<div class="sp"><p class="mono">Respuesta libre · '+secs+" segundos</p><p class=\"sp-t\">"+esc(prompt)+"</p>"+
  '<div class="row">'+(audio?sayBtn(prompt,"Escuchar pregunta"):"")+
  '<button type="button" class="mic" data-act="talk" data-key="'+key+'" data-secs="'+secs+'">'+IC.mic+" Grabar respuesta</button>"+
  '<button type="button" class="say" data-act="timer" data-key="'+key+'" data-secs="'+secs+'">Iniciar cronómetro</button>'+
  '<span class="timer" id="tm-'+key+'">0:'+(secs<10?"0":"")+secs+"</span></div>"+
  '<p class="sp-out" id="out-'+key+'"></p><p class="sp-score" id="sc-'+key+'"></p></div>';
}

var QZ={};
function quiz(id,items,o){o=o||{};QZ[id]={items:items,ans:items.map(function(){return null;}),exam:!!o.exam,done:false,onDone:o.onDone,msg:""};return'<div class="quiz" id="qz-'+id+'">'+quizInner(id)+"</div>";}
function quizInner(id){
  var z=QZ[id],n=z.items.length,answered=0,h="";
  z.items.forEach(function(it,i){
    var a=z.ans[i];if(a!==null)answered++;
    var reveal=z.exam?z.done:a!==null;
    h+='<div class="q '+(reveal?(a===it[2]?"ok":"ko"):"")+'"><p class="legend"><span class="qn">'+(i+1<10?"0":"")+(i+1)+"</span>"+it[0]+"</p>";
    if(it[4])h+='<div class="row">'+sayBtn(it[4],"Escuchar audio")+sayBtn(it[4],"Lento",true)+"</div>";
    h+='<div class="opts">';
    it[1].forEach(function(op,j){
      h+='<button type="button" class="opt'+(a===j&&!reveal?" sel":"")+(reveal&&j===it[2]?" right":"")+(reveal&&a===j&&j!==it[2]?" wrong":"")+'" data-act="ans" data-q="'+id+'" data-i="'+i+'" data-j="'+j+'"'+(reveal?" disabled":"")+">"+esc(op)+"</button>";
    });
    h+="</div>";
    if(reveal&&it[3])h+='<p class="why">'+it[3]+"</p>";
    if(reveal&&it[4])h+='<p class="why">Audio: <i>'+esc(it[4])+"</i></p>";
    h+="</div>";
  });
  if(z.done){
    var ok=0;z.items.forEach(function(it,i){if(z.ans[i]===it[2])ok++;});var p=Math.round(ok/n*100);
    h+='<div class="result '+(p>=70?"pass":"fail")+'"><b class="big">'+ok+"/"+n+"</b><div><b>"+p+"%</b> "+(z.msg||"")+'</div><button type="button" class="btn ghost" data-act="retry" data-q="'+id+'">Repetir</button></div>';
  }else if(z.exam){
    h+='<div class="submit"><span>'+answered+" de "+n+' respondidas</span><button type="button" class="btn" data-act="submit" data-q="'+id+'"'+(answered<n?" disabled":"")+">Entregar</button></div>";
  }
  return h;
}
function finish(id){
  var z=QZ[id];z.done=true;var ok=0;z.items.forEach(function(it,i){if(z.ans[i]===it[2])ok++;});
  var p=Math.round(ok/z.items.length*100);z.msg=z.onDone?(z.onDone(p,ok)||""):"";
}
function repaint(id){var el=document.getElementById("qz-"+id);if(el)el.innerHTML=quizInner(id);}
function sceneBlock(key,sc,transcriptOpen){
  SCN[key]=sc.lines;
  return'<div class="row"><button type="button" class="btn" data-act="scene" data-key="'+key+'">'+IC.play+' Reproducir</button><button type="button" class="btn ghost" data-act="scene" data-key="'+key+'" data-slow="1">'+IC.slow+" Más lento</button></div>"+
  "<details"+(transcriptOpen?" open":"")+"><summary>Ver el guion (primero intenta sin leer)</summary><ul class=\"script\">"+sc.lines.map(function(l){return"<li><b>"+esc(l[1])+"</b><span>"+esc(l[2])+"</span></li>";}).join("")+"</ul></details>";
}
var SCN={};
function bar(p,color){return'<div class="bar" style="--c:'+color+'"><i style="width:'+p+'%"></i></div>';}

/* ---------- Vistas ---------- */
var heroIdx=0;
function heroScreen(){
  var q=QU[heroIdx%QU.length];
  return'<div class="frame"><div class="meta"><span>'+esc(q.film)+" · "+q.year+"</span><span>Nivel "+q.level+"</span></div>"+
  '<p class="en">'+esc(q.q)+'</p><p class="note">'+q.note+"</p></div>"+
  '<div class="ctl"><div class="row">'+sayBtn(q.q,"Escuchar")+sayBtn(q.q,"Lento",true)+'</div><button type="button" class="say" data-act="nextq">Siguiente frase</button></div>';
}
function ticket(lv){
  var p=pct(lv);
  return'<a class="ticket" href="#'+lv.id+'" style="--c:'+lv.color+'"><div class="stub"><b>'+lv.name+"</b><span>"+esc(lv.title.split("-")[0])+"</span></div>"+
  '<div class="body"><h3>'+esc(lv.es)+"</h3><p>"+esc(lv.desc)+'</p><div class="barlabel"><span>'+lv.units.length+" lecciones · escena · speaking · examen</span><span>"+p+"%</span></div>"+bar(p,lv.color)+"</div></a>";
}
function viewHome(){
  var next=null;L.some(function(lv){return parts(lv).some(function(k){if(!S.done[k]){next=k;return true;}return false;});});
  var tp=totalPct();
  return'<div class="hero"><div class="stack"><p class="mono">Curso completo · A1 a C2 · TOEFL</p>'+
  "<h1>Inglés de la primera toma al <em>corte final</em>.</h1>"+
  '<p class="lead">Seis niveles con gramática explicada en español, escenas originales para entrenar el oído, práctica de pronunciación con micrófono y un examen por nivel. Al final, preparación para el TOEFL con su formato vigente.</p>'+
  '<div class="row"><a class="btn" href="#'+(next||"a1")+'">'+(tp>0?"Continuar donde me quedé":"Empezar en A1")+'</a><a class="btn ghost" href="#nivelacion">Hacer prueba de nivel</a></div>'+
  (S.place?'<p class="hint">Tu prueba de nivel sugirió empezar en <a href="#'+S.place+'">'+S.place.toUpperCase()+"</a>.</p>":"")+
  '</div><div class="screen" id="screen">'+heroScreen()+"</div></div>"+
  '<section><div class="row" style="justify-content:space-between;margin-bottom:18px"><h2>Elige tu función</h2><span class="mono">Avance total '+tp+"%</span></div>"+
  '<div class="tickets">'+L.map(ticket).join("")+
  '<a class="ticket" href="#toefl" style="--c:#B8860B"><div class="stub"><b style="font-size:1.35rem">TOEFL</b><span>iBT</span></div><div class="body"><h3>Preparación TOEFL</h3><p>Formato vigente desde enero de 2026, práctica de las cuatro secciones, estrategias y plan de cuatro semanas.</p><div class="barlabel"><span>Reading · Listening · Writing · Speaking</span></div></div></a>'+
  "</div></section>"+
  '<section><h2>Cómo se estudia aquí</h2><div class="grid3">'+
  '<div class="card skill"><p class="mono">Gramática y vocabulario</p><h3>30 lecciones</h3><p>Cada una explica una estructura, da ejemplos con audio y termina con práctica corregida al instante.</p></div>'+
  '<div class="card skill"><p class="mono">Listening</p><h3>Escenas de película</h3><p>Diálogos originales en seis géneros, con voces distintas, velocidad lenta y preguntas de comprensión.</p></div>'+
  '<div class="card skill"><p class="mono">Speaking</p><h3>Repite y compárate</h3><p>Escuchas la frase, la dices al micrófono y ves qué palabras se entendieron y cuáles no.</p></div>'+
  '<div class="card skill"><p class="mono">Exámenes</p><h3>Uno por nivel</h3><p>Doce preguntas con audio incluido. Apruebas con 70% y desbloqueas tu constancia del nivel.</p></div>'+
  "</div></section>"+
  '<section><div class="grid2"><div class="card stack"><p class="mono">Cine</p><h3>Frases famosas y qué ver según tu nivel</h3><p class="hint">Doce líneas de película explicadas, recomendaciones por nivel y un método de cinco pasos para aprender con cualquier clip.</p><div><a class="btn ghost" href="#cine">Ir a Cine</a></div></div>'+
  '<div class="card stack"><p class="mono">Frases</p><h3>Lo que de verdad se dice</h3><p class="hint">Frases listas para viajes, restaurante, trabajo, universidad y emergencias, todas con audio.</p><div><a class="btn ghost" href="#frases">Ir a Frases</a></div></div></div></section>';
}

function viewLevel(lv){
  var p=pct(lv),rows="";
  lv.units.forEach(function(u,i){var k=lv.id+"-u"+(i+1);
    rows+='<li><a href="#'+k+'" style="--c:'+lv.color+'"><span class="n">'+(i+1<10?"0":"")+(i+1)+"</span><span><b>"+esc(u.t)+"</b><small>"+esc(u.g)+"</small></span>"+(S.done[k]?'<span class="pill ok">Completada</span>':'<span class="pill">Lección</span>')+"</a></li>";});
  var extra=[["escena","Escena: "+lv.scene.title,"Listening · "+lv.scene.genre,"Listening"],["speaking","Speaking del nivel","Repite, compárate y habla un minuto","Speaking"],["examen","Examen final "+lv.name,"12 preguntas · apruebas con 70%"+(S.exam[lv.id]!=null?" · mejor resultado "+S.exam[lv.id]+"%":""),"Examen"]];
  extra.forEach(function(x,i){var k=lv.id+"-"+x[0];
    rows+='<li><a href="#'+k+'" style="--c:'+lv.color+'"><span class="n">'+(lv.units.length+i+1<10?"0":"")+(lv.units.length+i+1)+"</span><span><b>"+esc(x[1])+"</b><small>"+esc(x[2])+"</small></span>"+(S.done[k]?'<span class="pill ok">Completado</span>':'<span class="pill">'+x[3]+"</span>")+"</a></li>";});
  return'<div class="lvhead" style="--c:'+lv.color+'"><div class="code">'+lv.name+'</div><div><p class="mono">'+esc(lv.title)+"</p><h1 style=\"font-size:clamp(1.8rem,4.5vw,3rem)\">"+esc(lv.es)+"</h1><p>"+esc(lv.desc)+'</p><div class="chips">'+lv.cando.map(function(c){return'<span class="chip">'+esc(c)+"</span>";}).join("")+"</div></div></div>"+
  '<section><div class="barlabel" style="margin-bottom:6px"><span>Tu avance en '+lv.name+"</span><span>"+p+"%</span></div>"+bar(p,lv.color)+"</section>"+
  '<section><h2>Programa</h2><ol class="prog">'+rows+"</ol></section>"+
  (S.done[lv.id+"-examen"]?'<section><div class="card stack" style="border:2px solid '+lv.color+'"><p class="mono">Constancia</p><h3>Nivel '+lv.name+" aprobado con "+S.exam[lv.id]+"%</h3><p class=\"hint\">Buen trabajo. "+(nextLevel(lv)?'Sigue con <a href="#'+nextLevel(lv).id+'">'+nextLevel(lv).name+"</a>.":'Estás listo para la <a href="#toefl">preparación TOEFL</a>.')+"</p></div></section>":"");
}
function nextLevel(lv){var i=L.indexOf(lv);return L[i+1]||null;}
function crumb(lv,label){return'<p class="crumb"><a href="#inicio">Inicio</a> / <a href="#'+lv.id+'">'+lv.name+" "+esc(lv.es)+"</a> / "+esc(label)+"</p>";}

function viewUnit(lv,n){
  var u=lv.units[n-1];if(!u)return viewLevel(lv);
  var key=lv.id+"-u"+n;
  var prev=n>1?lv.id+"-u"+(n-1):lv.id, next=n<lv.units.length?lv.id+"-u"+(n+1):lv.id+"-escena";
  return'<div class="lesson stack">'+crumb(lv,"Lección "+n)+
  '<p class="mono" style="color:'+lv.color+'">'+esc(u.g)+"</p><h1 style=\"font-size:clamp(1.9rem,5vw,3.2rem)\">"+esc(u.t)+"</h1>"+
  '<section class="stack" style="margin-top:20px"><h2>Cómo funciona</h2><div class="card exp">'+u.exp+"</div></section>"+
  '<section class="stack"><h2>Ejemplos</h2><ul class="exlist">'+u.ex.map(function(e){return"<li>"+sayBtn(e[0])+'<div><div class="en">'+esc(e[0])+'</div><div class="es">'+esc(e[1])+"</div></div></li>";}).join("")+"</ul></section>"+
  '<section class="stack"><h2>Vocabulario</h2><div class="vocab">'+u.vocab.map(function(v){return"<div><b>"+esc(v[0])+"</b>"+sayBtn(v[0].replace(/\s*\(.*?\)/g,"").replace(/ \/ /g,", ").replace(/\+ -ing/g,""))+"<span>"+v[1]+"</span></div>";}).join("")+"</div></section>"+
  '<section class="stack"><h2>Práctica</h2>'+quiz(key,u.quiz,{onDone:function(p){if(p>=70){S.done[key]=true;save();return"Lección completada.";}return"Necesitas 70% para completarla. Repasa la explicación y repite.";}})+"</section>"+
  '<div class="pager"><a class="btn ghost" href="#'+prev+'">Anterior</a><a class="btn" href="#'+next+'">'+(n<lv.units.length?"Siguiente lección":"Ir a la escena")+"</a></div></div>";
}
function viewScene(lv){
  var sc=lv.scene,key=lv.id+"-escena";
  return'<div class="lesson stack">'+crumb(lv,"Escena")+
  '<p class="mono" style="color:'+lv.color+'">Listening · '+esc(sc.genre)+'</p><h1 style="font-size:clamp(1.9rem,5vw,3.2rem)">'+esc(sc.title)+"</h1>"+
  '<p class="hint">'+esc(sc.ctx)+" Escucha dos veces sin leer, responde y después revisa el guion.</p>"+
  sceneBlock(key,sc)+
  '<section class="stack"><h2>Expresiones de la escena</h2><div class="vocab">'+sc.gloss.map(function(g){return"<div><b>"+esc(g[0])+"</b>"+sayBtn(g[0])+"<span>"+esc(g[1])+"</span></div>";}).join("")+"</div></section>"+
  '<section class="stack"><h2>Comprensión</h2>'+quiz(key,sc.q,{onDone:function(p){if(p>=66){S.done[key]=true;save();return"Escena completada.";}return"Vuelve a escuchar la escena e inténtalo otra vez.";}})+"</section>"+
  '<div class="pager"><a class="btn ghost" href="#'+lv.id+'">Volver al nivel</a><a class="btn" href="#'+lv.id+'-speaking">Ir a speaking</a></div></div>';
}
function micNote(){return'<p class="hint">El micrófono funciona en Chrome y en la app de escritorio de Claude, y la primera vez pide permiso. Sin micrófono puedes repetir en voz alta y escribir la frase para comprobarla.</p>';}
function viewSpeaking(lv){
  var key=lv.id+"-speaking";
  return'<div class="lesson stack">'+crumb(lv,"Speaking")+
  '<p class="mono" style="color:'+lv.color+'">Speaking</p><h1 style="font-size:clamp(1.9rem,5vw,3.2rem)">Repite y compárate</h1>'+micNote()+
  '<section class="stack" style="margin-top:20px"><h2>Shadowing</h2>'+lv.speak.map(function(t,i){return speakItem(lv.id+"s"+i,t);}).join("")+"</section>"+
  '<section class="stack"><h2>Habla un minuto</h2>'+talkBox(lv.id+"talk",lv.talk,60)+"</section>"+
  '<div class="pager"><button type="button" class="btn ghost" data-act="markdone" data-key="'+key+'">'+(S.done[key]?"Práctica completada":"Marcar práctica como completada")+'</button><a class="btn" href="#'+lv.id+'-examen">Ir al examen</a></div></div>';
}
function viewExam(lv){
  var key=lv.id+"-examen";
  return'<div class="lesson stack">'+crumb(lv,"Examen final")+
  '<p class="mono" style="color:'+lv.color+'">Examen final</p><h1 style="font-size:clamp(1.9rem,5vw,3.2rem)">Examen '+lv.name+"</h1>"+
  '<p class="hint">Doce preguntas de gramática, vocabulario y comprensión auditiva. Las respuestas se muestran al entregar. Apruebas con 70%.</p>'+
  quiz(key,lv.exam,{exam:true,onDone:function(p){S.exam[lv.id]=Math.max(S.exam[lv.id]||0,p);if(p>=70)S.done[key]=true;save();var nx=nextLevel(lv);return p>=70?"Aprobaste el nivel "+lv.name+". "+(nx?'<a href="#'+nx.id+'">Continuar con '+nx.name+"</a>":'<a href="#toefl">Ir a la preparación TOEFL</a>'):"Aún no. Repasa las lecciones marcadas en rojo y vuelve a intentarlo.";}})+
  '<div class="pager"><a class="btn ghost" href="#'+lv.id+'">Volver al nivel</a></div></div>';
}

function viewCine(){
  return'<div class="stack"><p class="mono">Cine</p><h1>Aprende con la pantalla grande</h1><p class="hint" style="max-width:60ch">Las películas tienen derechos de autor, así que aquí no se incrustan clips. Encontrarás escenas originales escritas para cada nivel, frases célebres muy breves explicadas y enlaces para buscar el tráiler oficial de cada recomendación.</p></div>'+
  '<section><h2>Escenas originales del curso</h2><div class="tickets">'+L.map(function(lv){return'<a class="ticket" href="#'+lv.id+'-escena" style="--c:'+lv.color+'"><div class="stub"><b>'+lv.name+"</b><span>Escena</span></div><div class=\"body\"><h3>"+esc(lv.scene.title)+'</h3><p class="mono">'+esc(lv.scene.genre)+"</p><p>"+esc(lv.scene.ctx)+"</p></div></a>";}).join("")+"</div></section>"+
  '<section><h2>Frases de película</h2><div class="grid3">'+QU.map(function(q){var lv=byId(q.level.toLowerCase());return'<div class="card quote"><div class="row" style="justify-content:space-between"><span class="src">'+esc(q.film)+" · "+q.year+'</span><span class="pill lv" style="--c:'+lv.color+'">'+q.level+'</span></div><p class="q-en">'+esc(q.q)+'</p><p class="hint">'+q.note+'</p><div class="row">'+sayBtn(q.q,"Escuchar")+sayBtn(q.q,"Lento",true)+"</div></div>";}).join("")+"</div></section>"+
  '<section><h2>Qué ver según tu nivel</h2><div class="card tablewrap"><table><thead><tr><th>Nivel</th><th>Por qué</th><th>Películas (abre la búsqueda del tráiler oficial)</th></tr></thead><tbody>'+
  FI.map(function(f){return'<tr><td class="num">'+f.level+"</td><td>"+esc(f.why)+"</td><td>"+f.list.map(function(m){return'<a href="https://www.youtube.com/results?search_query='+encodeURIComponent(m+" official trailer")+'" target="_blank" rel="noopener">'+esc(m)+"</a>";}).join(" · ")+"</td></tr>";}).join("")+"</tbody></table></div></section>"+
  '<section><h2>Método para aprender con cualquier clip</h2><ol class="steps"><li><b>Mira sin subtítulos</b>Dos minutos como máximo. Anota de qué crees que trata.</li><li><b>Subtítulos en inglés</b>Repite el clip y apunta cinco palabras o frases nuevas.</li><li><b>Pausa y repite</b>Imita cada línea con el mismo ritmo y entonación.</li><li><b>Sin sonido</b>Di tú el diálogo mientras corre la imagen.</li><li><b>Úsalo mañana</b>Escribe tres oraciones tuyas con lo que aprendiste.</li></ol></section>';
}
function viewFrases(){
  return'<div class="stack"><p class="mono">Frases</p><h1>Lo que de verdad se dice</h1><p class="hint">Toca el botón para escuchar cada frase. Repítela en voz alta tres veces.</p></div>'+
  PH.map(function(c){return'<section><h2>'+esc(c.cat)+'</h2><ul class="exlist">'+c.items.map(function(e){return"<li>"+sayBtn(e[0])+'<div><div class="en">'+esc(e[0])+'</div><div class="es">'+esc(e[1])+"</div></div></li>";}).join("")+"</ul></section>";}).join("");
}
function viewPlacement(){
  return'<div class="lesson stack"><p class="mono">Prueba de nivel</p><h1>¿Por dónde empiezo?</h1><p class="hint">Dieciocho preguntas que suben de dificultad. Si no sabes una, elige la que te suene mejor. El resultado te sugiere un nivel de inicio.</p>'+
  quiz("place",PL,{exam:true,onDone:function(p,ok){var i=Math.min(5,Math.floor(Math.max(0,ok-1)/3));var lv=L[i];S.place=lv.id;save();return"Nivel sugerido: <b>"+lv.name+" "+lv.es+'</b>. <a href="#'+lv.id+'">Empezar en '+lv.name+"</a>";}})+"</div>";
}

/* ---------- TOEFL ---------- */
var tab="formato",BS=[];
function shuffle(a){var b=a.slice(),i,j,t,tries=0;do{for(i=b.length-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=b[i];b[i]=b[j];b[j]=t;}tries++;}while(b.join(" ")===a.join(" ")&&tries<5);return b;}
function buildHTML(i){
  var s=BS[i],it=T.build[i];
  return'<p class="hint">'+esc(it.es)+'</p><div class="pool ans '+(s.state||"")+'" aria-label="Tu oración">'+s.picked.map(function(w,k){return'<button type="button" class="word" data-act="unpick" data-b="'+i+'" data-k="'+k+'">'+esc(w)+"</button>";}).join("")+"</div>"+
  '<div class="pool">'+s.pool.map(function(w,k){return'<button type="button" class="word" data-act="pick" data-b="'+i+'" data-k="'+k+'">'+esc(w)+"</button>";}).join("")+"</div>"+
  '<div class="row"><button type="button" class="say" data-act="checkb" data-b="'+i+'">Comprobar</button>'+(s.state==="ok"?'<span class="pill ok">Correcto</span>':s.state==="ko"?'<span class="hint">Respuesta: '+esc(it.a)+"</span>":"")+"</div>";
}
function ctwHTML(){
  var c=T.ctw;
  return esc(c.text).replace(/\{(\d+)\}/g,function(m,k){var g=c.gaps[+k];return'<span class="gap">'+esc(g[0])+'<input type="text" id="ctw-'+k+'" size="'+(g[1].length+1)+'" maxlength="'+g[1].length+'" aria-label="Completa la palabra '+(+k+1)+'" autocomplete="off" autocapitalize="off" spellcheck="false"></span>';});
}
function writeBox(id,ph){return'<textarea id="'+id+'" data-count="'+id+'-n" placeholder="'+esc(ph)+'"></textarea><p class="mono" id="'+id+'-n">0 palabras</p>';}
function viewToefl(){
  var tabs=[["formato","Formato y puntaje"],["reading","Reading"],["listening","Listening"],["writing","Writing"],["speaking","Speaking"],["plan","Estrategias y plan"]];
  var h='<div class="stack"><p class="mono">Preparación TOEFL iBT</p><h1>El examen, sección por sección</h1><p class="hint" style="max-width:62ch">Práctica con los tipos de tarea del formato que entró en vigor el 21 de enero de 2026. Los textos y audios son originales del curso, no reactivos oficiales.</p></div>'+
  '<div class="tabs" role="tablist">'+tabs.map(function(t){return'<button type="button" role="tab" aria-selected="'+(tab===t[0])+'" class="'+(tab===t[0]?"on":"")+'" data-act="tab" data-tab="'+t[0]+'">'+t[1]+"</button>";}).join("")+"</div>";
  if(tab==="formato"){
    h+='<div class="grid2"><div class="card tablewrap"><h3 style="margin-bottom:10px">Estructura</h3><table><thead><tr><th>Sección</th><th>Tipos de tarea</th></tr></thead><tbody>'+T.format.map(function(f){return"<tr><td><b>"+f.s+"</b></td><td>"+f.tasks.join("<br>")+'<br><span class="hint">'+f.tip+"</span></td></tr>";}).join("")+"</tbody></table></div>"+
    '<div class="card tablewrap"><h3 style="margin-bottom:10px">Escala de 1 a 6 y su equivalencia MCER</h3><table><thead><tr><th>Puntaje</th><th>MCER</th><th>Descripción</th></tr></thead><tbody>'+T.scale.map(function(s){return'<tr><td class="num">'+s[0]+"</td><td><b>"+s[1]+"</b></td><td>"+s[2]+"</td></tr>";}).join("")+"</tbody></table>"+
    '<p class="hint" style="margin-top:12px">Cada sección y el total se reportan de 1 a 6 en pasos de 0.5; el total es el promedio de las cuatro. Durante la transición también aparece un puntaje comparable de 0 a 120. Orden del examen: Reading, Listening, Writing y Speaking. Confirma duración, costos y requisitos de tu universidad en <a href="https://www.ets.org/toefl" target="_blank" rel="noopener">ets.org/toefl</a>.</p></div></div>'+
    '<section><h2>Qué nivel necesitas</h2><p class="hint" style="max-width:62ch">La mayoría de los posgrados pide un resultado en la zona de B2 alto o C1. Termina al menos el nivel <a href="#b2">B2</a> de este curso antes de enfocarte en simulacros.</p></section>';
  }
  if(tab==="reading"){
    h+='<section class="stack" style="margin-top:0"><h2>Complete the Words</h2><p class="hint">A cada palabra incompleta le falta la segunda mitad. Escribe las letras que faltan.</p><div class="card"><p class="ctw" id="ctw">'+ctwHTML()+'</p><div class="row" style="margin-top:14px"><button type="button" class="btn" data-act="ctw">Comprobar</button><span id="ctw-res" class="hint"></span></div></div></section>'+
    '<section class="stack"><h2>Read in Daily Life</h2><p class="mono">'+esc(T.daily.title)+'</p><div class="card pre">'+esc(T.daily.text)+"</div>"+quiz("t-daily",T.daily.q)+"</section>"+
    '<section class="stack"><h2>Read an Academic Passage</h2><div class="card"><h3 style="margin-bottom:10px">'+esc(T.passage.title)+'</h3><p class="pre" style="max-width:68ch">'+esc(T.passage.text)+"</p></div>"+quiz("t-pass",T.passage.q)+"</section>";
  }
  if(tab==="listening"){
    h+='<section class="stack" style="margin-top:0"><h2>Listen and Choose a Response</h2><p class="hint">Escucha la pregunta una sola vez y elige la respuesta más natural.</p>'+quiz("t-resp",T.respond.map(function(r){return["Elige la mejor respuesta.",r[1],r[2],r[3],r[0]];}))+"</section>"+
    '<section class="stack"><h2>Listen to a Conversation</h2><p class="mono">'+esc(T.conv.title)+"</p>"+sceneBlock("t-conv",T.conv)+quiz("t-conv",T.conv.q)+"</section>"+
    '<section class="stack"><h2>Listen to an Announcement</h2><p class="mono">'+esc(T.announce.title)+'</p><div class="row">'+sayBtn(T.announce.text,"Reproducir anuncio")+"</div><details><summary>Ver transcripción</summary><p>"+esc(T.announce.text)+"</p></details>"+quiz("t-ann",T.announce.q)+"</section>"+
    '<section class="stack"><h2>Listen to an Academic Talk</h2><p class="mono">'+esc(T.talk.title)+'</p><div class="row">'+sayBtn(T.talk.text,"Reproducir charla")+sayBtn(T.talk.text,"Lento",true)+"</div><details><summary>Ver transcripción</summary><p>"+esc(T.talk.text)+"</p></details>"+quiz("t-talk",T.talk.q)+"</section>";
  }
  if(tab==="writing"){
    if(!BS.length)T.build.forEach(function(it){BS.push({pool:shuffle(it.a.split(" ")),picked:[],state:""});});
    h+='<section class="stack" style="margin-top:0"><h2>Build a Sentence</h2><p class="hint">Toca las palabras en orden para formar la oración.</p>'+T.build.map(function(it,i){return'<div class="card stack" id="bs-'+i+'">'+buildHTML(i)+"</div>";}).join("")+"</section>"+
    '<section class="stack"><h2>Write an Email</h2><div class="card stack"><p>'+esc(T.email.prompt)+'</p><p class="hint">Apunta a unas 100 a 130 palabras en unos siete minutos.</p>'+writeBox("w-email","Dear Customer Service Team, …")+'<ul class="hint">'+T.email.checklist.map(function(c){return"<li>"+esc(c)+"</li>";}).join("")+'</ul><details><summary>Ver respuesta modelo</summary><p class="pre">'+esc(T.email.model)+"</p></details></div></section>"+
    '<section class="stack"><h2>Write for an Academic Discussion</h2><div class="card stack"><div class="post"><b>Profesora</b>'+esc(T.discuss.prof)+"</div>"+T.discuss.posts.map(function(p){return'<div class="post"><b>'+esc(p[0])+"</b>"+esc(p[1])+"</div>";}).join("")+'<p class="hint">Escribe al menos 100 palabras en diez minutos: postura, razón, ejemplo y una idea que nadie haya dicho.</p>'+writeBox("w-disc","In my view, …")+'<details><summary>Ver respuesta modelo</summary><p class="pre">'+esc(T.discuss.model)+"</p></details></div></section>";
  }
  if(tab==="speaking"){
    h+=micNote()+'<section class="stack" style="margin-top:18px"><h2>Listen and Repeat</h2><p class="hint">La oración está oculta, como en el examen. Escúchala, repítela y entonces se revela con tu resultado.</p>'+T.repeat.map(function(t,i){return speakItem("tr"+i,t,true);}).join("")+"</section>"+
    '<section class="stack"><h2>Take an Interview</h2><p class="hint">Responde cada pregunta durante 45 segundos: respuesta directa, una razón y un ejemplo.</p>'+T.interview.map(function(q,i){return talkBox("ti"+i,q,45,true);}).join("")+"</section>";
  }
  if(tab==="plan"){
    h+='<section class="stack" style="margin-top:0"><h2>Estrategias por sección</h2><div class="grid2">'+T.strategies.map(function(s){return'<div class="card skill"><p class="mono">'+s[0]+"</p><p style=\"color:var(--ink)\">"+s[1]+"</p></div>";}).join("")+"</div></section>"+
    '<section class="stack"><h2>Plan de cuatro semanas</h2><div class="card tablewrap"><table><tbody>'+T.plan.map(function(p){return'<tr><td class="num">'+p[0]+"</td><td>"+p[1]+"</td></tr>";}).join("")+"</tbody></table></div></section>"+
    '<section class="stack"><h2>Plantillas útiles</h2><ul class="exlist">'+[["I am writing to let you know that…","Correo: abrir con el motivo"],["I would appreciate it if you could…","Correo: pedir algo con cortesía"],["While I see why some people believe that…, I think…","Discusión: conceder y tomar postura"],["One reason for this is that…","Speaking: dar una razón"],["For instance, last year I…","Speaking: dar un ejemplo personal"]].map(function(e){return"<li>"+sayBtn(e[0])+'<div><div class="en">'+esc(e[0])+'</div><div class="es">'+esc(e[1])+"</div></div></li>";}).join("")+"</ul></section>";
  }
  return h;
}

/* ---------- Ruteo por hash ---------- */
function render(){
  stopAudio();clearTimer();
  var h=(location.hash||"#inicio").slice(1)||"inicio",m,html,nav=h;
  if((m=h.match(/^(a1|a2|b1|b2|c1|c2)(?:-(u(\d)|escena|speaking|examen))?$/))){
    var lv=byId(m[1]);nav=m[1];
    html=!m[2]?viewLevel(lv):m[3]?viewUnit(lv,+m[3]):m[2]==="escena"?viewScene(lv):m[2]==="speaking"?viewSpeaking(lv):viewExam(lv);
  }else if(h==="cine")html=viewCine();
  else if(h==="frases")html=viewFrases();
  else if(h==="toefl")html=viewToefl();
  else if(h==="nivelacion")html=viewPlacement();
  else{nav="inicio";html=viewHome();}
  app.innerHTML=html;
  document.querySelectorAll(".nav a").forEach(function(a){var on=a.dataset.nav===nav;a.classList.toggle("on",on);if(on&&a.scrollIntoView){try{a.scrollIntoView({block:"nearest",inline:"nearest"});}catch(e){}}});
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",render);

/* ---------- Eventos ---------- */
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-act]");if(!b)return;
  var a=b.dataset.act,z,i,s,key;
  if(a==="say"){say(b.dataset.say,!!b.dataset.slow);}
  else if(a==="stop"){stopAudio();document.body.classList.remove("speaking");}
  else if(a==="scene"){var ls=SCN[b.dataset.key];if(ls)say(ls.map(function(l){return{text:l[2],voice:l[0]};}),!!b.dataset.slow);}
  else if(a==="nextq"){heroIdx++;var sc=document.getElementById("screen");if(sc)sc.innerHTML=heroScreen();}
  else if(a==="ans"){z=QZ[b.dataset.q];if(!z||z.done)return;i=+b.dataset.i;if(!z.exam&&z.ans[i]!==null)return;z.ans[i]=+b.dataset.j;
    if(!z.exam&&z.ans.every(function(x){return x!==null;}))finish(b.dataset.q);repaint(b.dataset.q);}
  else if(a==="submit"){finish(b.dataset.q);repaint(b.dataset.q);var el=document.querySelector("#qz-"+b.dataset.q+" .result");if(el&&el.scrollIntoView)el.scrollIntoView({block:"center"});}
  else if(a==="retry"){z=QZ[b.dataset.q];z.ans=z.items.map(function(){return null;});z.done=false;z.msg="";repaint(b.dataset.q);var q=document.getElementById("qz-"+b.dataset.q);if(q&&q.scrollIntoView)q.scrollIntoView({block:"start"});}
  else if(a==="mic"){key=b.dataset.key;toggleMic(b,"out-"+key,true,function(said){scoreSpeak(key,said);});}
  else if(a==="typed"){key=b.dataset.key;var inp=document.getElementById("in-"+key);scoreSpeak(key,inp?inp.value:"");}
  else if(a==="talk"){key=b.dataset.key;var secs=+b.dataset.secs;var was=!!DS;
    toggleMic(b,"out-"+key,false,function(said){var n=words(said).length,sc2=document.getElementById("sc-"+key);if(sc2)sc2.textContent=n?n+" palabras. "+(n>=secs*1.6?"Buen ritmo y extensión.":"Intenta desarrollar más: añade una razón y un ejemplo."):"No se captó nada.";});
    if(!was&&DS)startTimer("tm-"+key,secs,function(){if(DICT&&DS)DICT.stop().catch(function(){});});}
  else if(a==="timer"){startTimer("tm-"+b.dataset.key,+b.dataset.secs,null);}
  else if(a==="markdone"){S.done[b.dataset.key]=true;save();b.textContent="Práctica completada";}
  else if(a==="tab"){tab=b.dataset.tab;stopAudio();app.innerHTML=viewToefl();}
  else if(a==="pick"||a==="unpick"){s=BS[+b.dataset.b];var k=+b.dataset.k;if(a==="pick"){s.picked.push(s.pool.splice(k,1)[0]);}else{s.pool.push(s.picked.splice(k,1)[0]);}s.state="";document.getElementById("bs-"+b.dataset.b).innerHTML=buildHTML(+b.dataset.b);}
  else if(a==="checkb"){s=BS[+b.dataset.b];s.state=s.picked.join(" ")===T.build[+b.dataset.b].a?"ok":"ko";document.getElementById("bs-"+b.dataset.b).innerHTML=buildHTML(+b.dataset.b);}
  else if(a==="ctw"){var ok=0;T.ctw.gaps.forEach(function(g,k2){var inp2=document.getElementById("ctw-"+k2);if(!inp2)return;var good=inp2.value.trim().toLowerCase()===g[1];if(good)ok++;inp2.classList.toggle("ok",good);inp2.classList.toggle("ko",!good);if(!good)inp2.title="Respuesta: "+g[0]+g[1];});
    var res=document.getElementById("ctw-res");if(res)res.textContent=ok+" de "+T.ctw.gaps.length+" correctas."+(ok<T.ctw.gaps.length?" Respuestas: "+T.ctw.gaps.map(function(g){return g[0]+g[1];}).join(", ")+".":"");}
});
document.addEventListener("input",function(e){
  var t=e.target;if(t.dataset&&t.dataset.count){var n=t.value.trim()?t.value.trim().split(/\s+/).length:0;var el=document.getElementById(t.dataset.count);if(el)el.textContent=n+(n===1?" palabra":" palabras");}
});
document.addEventListener("keydown",function(e){
  if(e.key==="Enter"&&e.target.id&&e.target.id.indexOf("in-")===0){var k=e.target.id.slice(3);scoreSpeak(k,e.target.value);}
});
render();
})();
