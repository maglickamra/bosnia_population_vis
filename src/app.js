(function(){
'use strict';
var reduce=false;
try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}

/* ---------- data (Federation of BiH in Figures 2026, chapter 5) ---------- */
var YEARS=[2022,2023,2024,2025];
var TOT={pop:2138121,k:275599,w:1451357,o:411165};
var C=[
 {id:'una',pop:258395,k:27931,w:186105,o:44359},
 {id:'pos',pop:38903,k:2766,w:28081,o:8056},
 {id:'tuz',pop:427982,k:55021,w:289363,o:83598},
 {id:'zdk',pop:348073,k:49467,w:235957,o:62649},
 {id:'bpk',pop:21240,k:2979,w:13412,o:4849},
 {id:'sbk',pop:242425,k:29595,w:169118,o:43712},
 {id:'hnk',pop:210338,k:25317,w:139791,o:45230},
 {id:'zhk',pop:92560,k:12169,w:62325,o:18066},
 {id:'sar',pop:422099,k:64139,w:276125,o:81835},
 {id:'k10',pop:76106,k:6215,w:51080,o:18811}
];
var BYID={};C.forEach(function(c){BYID[c.id]=c});
var FULL={
 una:{bs:'Unsko-sanski kanton',en:'Una-Sana Canton'},
 pos:{bs:'Kanton Posavski',en:'Posavina Canton'},
 tuz:{bs:'Tuzlanski kanton',en:'Tuzla Canton'},
 zdk:{bs:'Zeničko-dobojski kanton',en:'Zenica-Doboj Canton'},
 bpk:{bs:'Bosansko-podrinjski kanton',en:'Bosnian Podrinje Canton'},
 sbk:{bs:'Srednjobosanski kanton',en:'Central Bosnia Canton'},
 hnk:{bs:'Hercegovačko-neretvanski kanton',en:'Herzegovina-Neretva Canton'},
 zhk:{bs:'Zapadnohercegovački kanton',en:'West Herzegovina Canton'},
 sar:{bs:'Kanton Sarajevo',en:'Sarajevo Canton'},
 k10:{bs:'Kanton 10',en:'Canton 10'}
};
var SHORT={una:'Una-Sana',pos:'Posavina',tuz:'Tuzla',zdk:'Zenica-Doboj',bpk:'Bosna-Podrinje',sbk:'Srednja Bosna',hnk:'Hercegovina-Neretva',zhk:'Zapadna Hercegovina',sar:'Sarajevo',k10:'Kanton 10'};

var MV={
 pop:[2157,2150,2145,2138],
 births:[16538,16174,15883,16312],bpk1:[7.7,7.5,7.4,7.6],
 still:[69,53,58,46],
 deaths:[23187,20361,20484,21591],dpk1:[10.8,9.5,9.6,10.1],
 inf:[108,109,89,96],viol:[372,389,390,366],
 nat:[-6649,-4187,-4601,-5279],npk1:[-3.1,-1.9,-2.1,-2.5],
 marr:[11038,10740,10452,10403],mpk1:[5.1,5.0,4.9,4.9],
 div:[1703,1858,1844,1678],dvk:[154.3,173.0,176.4,161.3],
 boys:[8525,8588,8248,8483],girls:[8013,7586,7635,7829],
 dmen:[11711,10246,10322,10910],dwom:[11476,10115,10162,10681],
 amen:[71.4,70.8,71.2,71.4],awom:[76.2,76.4,76.3,76.4],atot:[73.8,73.6,73.7,73.9],
 imm:[20486,20288,21678,20410],emi:[22748,22189,23354,21491],net:[-2262,-1901,-1676,-1081]
};
var AGES=['0-4','5-9','10-14','15-19','20-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60-64','65-69','70-74','75-79','80-84','85+'];
var PF=[59,60,65,84,77,85,83,79,78,83,86,76,60,39,35,27,14,5];
var PM=[56,57,62,79,74,80,79,79,78,85,89,81,69,49,47,39,22,11];
var NB=[['Hamza',286],['Ali',232],['Ahmed',221],['Davud',206],['Omar',193],['Amar',178],['Harun',174],['Imran',161],['Adian',159],['Adin',155]];
var NG=[['Merjem',299],['Sara',224],['Asja',216],['Esma',212],['Iman',194],['Ema',176],['Hana',167],['Amina',166],['Lejla',142],['Una',132]];

/* ---------- copy ---------- */
var T={
en:{
 brand:'Federation of Bosnia and Herzegovina in Figures 2026',
 title:'Population',
 note1:'tap a wedge, switch the language, pick a year',
 note2:'longer wedge = bigger value. darker pink = bigger canton.',
 q:'How many of us live in the Federation, and who are we?',
 lede:'Chapter 5 of the Institute for Statistics yearbook as an interactive piece: cantons, age, births, deaths, names and migration.',
 popcap:'Mid-2025 estimate',
 popdelta:function(p){return nf(p,1)+'% since 2022'},
 f_b:'live births per 1,000 inhabitants, 2025',f_d:'deaths per 1,000 inhabitants, 2025',f_n:'natural change, 2025',f_m:'net migration, 2025',
 s1tag:'Table 5.4 · mid-2025',s1t:'Ten cantons, very different sizes',
 s1l:'Wedge length shows the selected measure. Switch it to see which cantons skew young and which skew old.',
 m:{pop:'Population',c:'Children 0-14 (%)',w:'Ages 15-64 (%)',o:'Ages 65+ (%)',x:'65+ per 100 children'},
 k:function(v){return nf(v/1000,0)+'k'},
 cx:'estimate',
 ofFed:function(p){return nf(p,1)+'% of the Federation'},
 old:function(a,b){return 'For every 100 children aged 0-14 there are '+nf(a)+' people aged 65+ (Federation: '+nf(b)+').'},
 s2tag:'Table 5.4 · mid-2025',s2t:'How old are the cantons?',
 s2l:'Share of residents aged 0-14, 15-64 and 65+, ordered by the 65+ share. Click a row to select a canton.',
 fed:'Federation',
 s3tag:'Table 5.1 · Census 2013',s3t:'The 2013 age pyramid',
 s3l:'Thousands of people in each five-year age group.',
 s3n:'The publication prints this chart without numbers, so these values are read off it and are approximate. Colours follow the legend printed in the chart.',
 women:'Women',men:'Men',thou:'thousands',
 s4tag:'Tables 5.3 · 5.5 · 2022-2025',s4t:'More deaths than births, every year',
 s4l:'Pick a year. Bars start at zero, and the red number under each year is natural change.',
 births:'Live births',deaths:'Deaths',natinc:'Natural change',
 lab:{pop:'Population (thousands)',births:'Live births',deaths:'Deaths',nat:'Natural change',still:'Stillbirths',inf:'Infant deaths',viol:'Violent deaths',marr:'Marriages',div:'Divorces'},
 per:{births:'per 1,000 inhabitants',deaths:'per 1,000 inhabitants',nat:'per 1,000 inhabitants',marr:'per 1,000 inhabitants',div:'per 1,000 marriages'},
 vsprev:'vs previous year',
 s5tag:'Tables 5.5 · 5.6',s5t:'Boys, girls and how long we live',
 s5l:'Average age at death by sex, and the split of births and deaths in the selected year. The vertical axis starts at 68 years.',
 avgage:'Average age at death',bornBy:'Live births by sex',diedBy:'Deaths by sex',
 boys:'Boys',girls:'Girls',
 ratio:function(r){return nf(r,1)+' boys were born for every 100 girls.'},
 gap:function(g){return 'Women who died were on average '+nf(g,1)+' years older than men.'},
 yrs:'yrs',
 s6tag:'Table 5.7 · born in 2025',s6t:'What we name the newborns',
 s6l:function(b,g){return 'The ten most common names cover '+nf(b,0)+'% of boys and '+nf(g,0)+'% of girls born in 2025.'},
 nb:'Boys',ng:'Girls',
 s7tag:'Table 5.8 · 2022-2025',s7t:'More people leave than arrive, but the gap narrows',
 s7l:function(a,b){return 'Net migration went from '+nf(a)+' in 2022 to '+nf(b)+' in 2025.'},
 imm:'Immigrants',emi:'Emigrants',netl:'Net migration',
 fsrc:'Source: Institute for Statistics of the Federation of Bosnia and Herzegovina, Federation of Bosnia and Herzegovina in Figures 2026, chapter 5 (tables 5.1 to 5.8).',
 fnote:'Table 5.2 (Census 2013 by municipality) is printed only as a map without figures and is not included. Shares, the 65+ per 100 children index and the sex ratio are calculated here from the published figures.',
 fcc:'The publication asks users to cite the source (CC BY).'
},
bs:{
 brand:'Federacija Bosne i Hercegovine u brojkama 2026',
 title:'Stanovništvo',
 note1:'dodirni isječak, promijeni jezik, odaberi godinu',
 note2:'duži isječak = veća vrijednost. tamnija ružičasta = veći kanton.',
 q:'Koliko nas živi u Federaciji i ko smo?',
 lede:'Poglavlje 5 publikacije Federalnog zavoda za statistiku kao interaktivni prikaz: kantoni, starost, rođeni, umrli, imena i migracije.',
 popcap:'Procjena sredinom 2025.',
 popdelta:function(p){return nf(p,1)+'% od 2022.'},
 f_b:'živorođenih na 1.000 stanovnika, 2025.',f_d:'umrlih na 1.000 stanovnika, 2025.',f_n:'prirodni priraštaj, 2025.',f_m:'saldo migracija, 2025.',
 s1tag:'Tabela 5.4 · sredina 2025.',s1t:'Deset kantona, vrlo različite veličine',
 s1l:'Dužina isječka prikazuje odabranu mjeru. Promijenite je da vidite koji kantoni imaju mlađe, a koji starije stanovništvo.',
 m:{pop:'Stanovništvo',c:'Djeca 0-14 (%)',w:'Dob 15-64 (%)',o:'Dob 65+ (%)',x:'65+ na 100 djece'},
 k:function(v){return nf(v/1000,0)+' hilj.'},
 cx:'procjena',
 ofFed:function(p){return nf(p,1)+'% stanovništva Federacije'},
 old:function(a,b){return 'Na svakih 100 djece od 0 do 14 godina dolazi '+nf(a)+' osoba od 65 i više godina (Federacija: '+nf(b)+').'},
 s2tag:'Tabela 5.4 · sredina 2025.',s2t:'Koliko su stari kantoni?',
 s2l:'Udio stanovnika od 0-14, 15-64 i 65+ godina, poredano po udjelu 65+. Kliknite red da odaberete kanton.',
 fed:'Federacija',
 s3tag:'Tabela 5.1 · Popis 2013.',s3t:'Starosna piramida, Popis 2013.',
 s3l:'Hiljade osoba po petogodišnjim starosnim grupama.',
 s3n:'Publikacija ovaj grafikon donosi bez brojki, pa su vrijednosti očitane s grafikona i približne. Boje prate legendu odštampanu uz grafikon.',
 women:'Žene',men:'Muškarci',thou:'hiljade',
 s4tag:'Tabele 5.3 · 5.5 · 2022-2025',s4t:'Umrlih je više nego rođenih, svake godine',
 s4l:'Odaberite godinu. Stupci počinju od nule, a crveni broj ispod godine je prirodni priraštaj.',
 births:'Živorođeni',deaths:'Umrli',natinc:'Prirodni priraštaj',
 lab:{pop:'Stanovništvo (hilj.)',births:'Živorođeni',deaths:'Umrli',nat:'Prirodni priraštaj',still:'Mrtvorođeni',inf:'Umrla dojenčad',viol:'Nasilne smrti',marr:'Zaključeni brakovi',div:'Razvedeni brakovi'},
 per:{births:'na 1.000 stanovnika',deaths:'na 1.000 stanovnika',nat:'na 1.000 stanovnika',marr:'na 1.000 stanovnika',div:'na 1.000 zaključenih brakova'},
 vsprev:'u odnosu na prethodnu godinu',
 s5tag:'Tabele 5.5 · 5.6',s5t:'Dječaci, djevojčice i koliko dugo živimo',
 s5l:'Prosječna starost umrlih po spolu te podjela rođenih i umrlih u odabranoj godini. Vertikalna osa počinje od 68 godina.',
 avgage:'Prosječna starost umrlih',bornBy:'Živorođeni po spolu',diedBy:'Umrli po spolu',
 boys:'Dječaci',girls:'Djevojčice',
 ratio:function(r){return 'Rođeno je '+nf(r,1)+' dječaka na svakih 100 djevojčica.'},
 gap:function(g){return 'Umrle žene bile su u prosjeku '+nf(g,1)+' godina starije od umrlih muškaraca.'},
 yrs:'god.',
 s6tag:'Tabela 5.7 · rođeni 2025.',s6t:'Kako zovemo novorođenčad',
 s6l:function(b,g){return 'Deset najčešćih imena nosi '+nf(b,0)+'% dječaka i '+nf(g,0)+'% djevojčica rođenih 2025.'},
 nb:'Dječaci',ng:'Djevojčice',
 s7tag:'Tabela 5.8 · 2022-2025',s7t:'Odlazi više ljudi nego što dolazi, ali razlika se smanjuje',
 s7l:function(a,b){return 'Saldo migracija je sa '+nf(a)+' u 2022. smanjen na '+nf(b)+' u 2025.'},
 imm:'Doseljeni',emi:'Odseljeni',netl:'Saldo migracija',
 fsrc:'Izvor: Federalni zavod za statistiku Federacije Bosne i Hercegovine, Federacija Bosne i Hercegovine u brojkama 2026, poglavlje 5 (tabele 5.1 do 5.8).',
 fnote:'Tabela 5.2 (Popis 2013. po općinama) u publikaciji je samo karta bez brojki i nije uključena. Udjeli, indeks 65+ na 100 djece i odnos spolova izračunati su ovdje iz objavljenih podataka.',
 fcc:'Publikacija traži od korisnika da navedu izvor (CC BY).'
}};
var state={lang:'en',metric:'pop',sel:'tuz',year:2025};
var LOC={en:'en-GB',bs:'de-DE'};
function nf(n,d){d=d||0;return new Intl.NumberFormat(LOC[state.lang],{minimumFractionDigits:d,maximumFractionDigits:d}).format(n).replace('-','−')}
function sgn(n,d){return (n>0?'+':'')+nf(n,d)}
function L(){return T[state.lang]}
function sn(id){if(id==='k10')return state.lang==='bs'?'Kanton 10':'Canton 10';return SHORT[id]}
function $(id){return document.getElementById(id)}

/* ---------- metrics ---------- */
var MET={
 pop:{f:function(c){return c.pop},max:450000,ticks:[100000,200000,300000,400000],fmt:function(v){return nf(v)}},
 c:{f:function(c){return c.k/c.pop*100},max:20,ticks:[5,10,15,20],fmt:function(v){return nf(v,1)+'%'}},
 w:{f:function(c){return c.w/c.pop*100},max:80,ticks:[20,40,60,80],fmt:function(v){return nf(v,1)+'%'}},
 o:{f:function(c){return c.o/c.pop*100},max:30,ticks:[10,20,30],fmt:function(v){return nf(v,1)+'%'}},
 x:{f:function(c){return c.o/c.k*100},max:320,ticks:[100,200,300],fmt:function(v){return nf(v)}}
};
var MORDER=['pop','c','w','o','x'];

/* ---------- rose ---------- */
var W=940,H=780,CX=470,CY=390,R0=64,R=262,N=C.length,SP=360/N;
var cur={pos:{},val:{}},tgt={pos:{},val:{},rank:{}},raf=0;
function rad(v){var m=MET[state.metric];return R0+Math.min(v,m.max)/m.max*(R-R0)}
function pt(r,a){return [CX+r*Math.cos(a),CY+r*Math.sin(a)]}
function f1(n){return n.toFixed(1)}
function wedge(r,a0,a1){
  var p0=pt(R0,a0),p1=pt(r,a0),p2=pt(r,a1),p3=pt(R0,a1);
  return 'M'+f1(p0[0])+' '+f1(p0[1])+'L'+f1(p1[0])+' '+f1(p1[1])+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+f1(p2[0])+' '+f1(p2[1])+'L'+f1(p3[0])+' '+f1(p3[1])+'A'+R0+' '+R0+' 0 0 0 '+f1(p0[0])+' '+f1(p0[1])+'Z';
}
function rankPct(rank){return 100-rank*7.5}
function drawRose(){
  var m=MET[state.metric],s='',tx=L();
  m.ticks.forEach(function(tv){
    var hi=state.metric==='x'&&tv===100;
    s+='<circle class="ring'+(hi?' ring-hi':'')+'" cx="'+CX+'" cy="'+CY+'" r="'+f1(rad(tv))+'"/>';
  });
  var items=C.map(function(c){return {c:c,pos:cur.pos[c.id],val:cur.val[c.id],rank:tgt.rank[c.id]}});
  items.sort(function(a,b){return (a.c.id===state.sel)-(b.c.id===state.sel)});
  items.forEach(function(it){
    var a0=(-90+it.pos*SP+.8)*Math.PI/180,a1=(-90+(it.pos+1)*SP-.8)*Math.PI/180;
    s+='<path class="wedge'+(it.c.id===state.sel?' on':'')+'" data-id="'+it.c.id+'" tabindex="0" role="button" aria-label="'+FULL[it.c.id][state.lang]+': '+m.fmt(m.f(it.c))+'" d="'+wedge(rad(it.val),a0,a1)+'" style="fill:color-mix(in srgb,var(--hot) '+rankPct(it.rank)+'%,var(--bg))"/>';
  });
  m.ticks.forEach(function(tv){
    var lab=state.metric==='pop'?tx.k(tv):(state.metric==='x'?String(tv):tv+'%');
    s+='<text class="tk" x="'+CX+'" y="'+f1(CY-rad(tv)+4)+'">'+lab+'</text>';
  });
  items.forEach(function(it){
    var am=(-90+(it.pos+.5)*SP)*Math.PI/180,cs=Math.cos(am),sin=Math.sin(am);
    var p=pt(R+18,am),anch=cs>.25?'start':(cs<-.25?'end':'middle');
    var y=p[1];if(sin<-.6)y-=20;else if(sin>.6)y+=14;else y-=2;
    s+='<g class="lbl'+(it.c.id===state.sel?' on':'')+'" data-id="'+it.c.id+'" style="cursor:pointer"><text class="lbl-n" x="'+f1(p[0])+'" y="'+f1(y)+'" text-anchor="'+anch+'">'+sn(it.c.id)+'</text><text class="lbl-v" x="'+f1(p[0])+'" y="'+f1(y+16)+'" text-anchor="'+anch+'">'+m.fmt(m.f(it.c))+'</text></g>';
  });
  s+='<text class="hole-y" x="'+CX+'" y="'+(CY+8)+'">2025</text><text class="hole-s" x="'+CX+'" y="'+(CY+26)+'">'+tx.cx+'</text>';
  $('rose').innerHTML=s;
}
function retarget(animate){
  var m=MET[state.metric];
  var order=C.slice().sort(function(a,b){return m.f(b)-m.f(a)});
  order.forEach(function(c,i){tgt.pos[c.id]=i;tgt.rank[c.id]=i;tgt.val[c.id]=m.f(c)});
  var first=cur.pos.una===undefined;
  if(!animate||reduce||first){C.forEach(function(c){cur.pos[c.id]=tgt.pos[c.id];cur.val[c.id]=tgt.val[c.id]});drawRose();return}
  var from={pos:{},val:{}};C.forEach(function(c){from.pos[c.id]=cur.pos[c.id];from.val[c.id]=cur.val[c.id]});
  var t0=performance.now(),D=650;cancelAnimationFrame(raf);
  (function step(now){
    var t=Math.min(1,(now-t0)/D),e=1-Math.pow(1-t,3);
    C.forEach(function(c){cur.pos[c.id]=from.pos[c.id]+(tgt.pos[c.id]-from.pos[c.id])*e;cur.val[c.id]=from.val[c.id]+(tgt.val[c.id]-from.val[c.id])*e});
    drawRose();
    if(t<1)raf=requestAnimationFrame(step);
  })(t0);
}
function renderMetrics(){
  $('metrics').innerHTML=MORDER.map(function(k){return '<button type="button" data-metric="'+k+'" aria-pressed="'+(state.metric===k)+'">'+L().m[k]+'</button>'}).join('');
}
function renderReadout(){
  var c=BYID[state.sel],tx=L();
  var pc=c.k/c.pop*100,pw=c.w/c.pop*100,po=c.o/c.pop*100;
  var x=c.o/c.k*100,xt=TOT.o/TOT.k*100;
  $('readout').innerHTML=
   '<p class="eyebrow">'+tx.m.pop+' · 2025</p>'+
   '<h3 class="disp">'+FULL[c.id][state.lang]+'</h3>'+
   '<div class="pop num">'+nf(c.pop)+'</div>'+
   '<p class="sub">'+tx.ofFed(c.pop/TOT.pop*100)+'</p>'+
   '<div class="stack" role="img" aria-label="0-14: '+nf(pc,1)+'%, 15-64: '+nf(pw,1)+'%, 65+: '+nf(po,1)+'%">'+
     '<span class="s-c" style="width:'+pc+'%">'+nf(pc,0)+'</span><span class="s-w" style="width:'+pw+'%">'+nf(pw,0)+'</span><span class="s-o" style="width:'+po+'%">'+nf(po,0)+'</span></div>'+
   '<ul class="legend" style="margin:8px 0 0"><li><i style="background:var(--pinkmid)"></i>0-14</li><li><i style="background:var(--forest)"></i>15-64</li><li><i style="background:var(--hot)"></i>65+ (%)</li></ul>'+
   '<p class="line">'+tx.old(x,xt)+'</p>';
  var m=MET[state.metric];
  $('chipgrid').innerHTML=C.slice().sort(function(a,b){return tgt.rank[a.id]-tgt.rank[b.id]}).map(function(cc){
    return '<button type="button" class="cv'+(cc.id===state.sel?' on':'')+'" data-id="'+cc.id+'"><i style="background:color-mix(in srgb,var(--hot) '+rankPct(tgt.rank[cc.id])+'%,var(--bg))"></i><b>'+sn(cc.id)+'</b><em class="num">'+m.fmt(m.f(cc))+'</em></button>';
  }).join('');
}

/* ---------- age rows ---------- */
function renderAge(){
  var tx=L();
  $('ageLegend').innerHTML='<li><i style="background:var(--pinkmid)"></i>0-14</li><li><i style="background:var(--forest)"></i>15-64</li><li><i style="background:var(--hot)"></i>65+ (%)</li>';
  function row(id,name,c,tot){
    var pc=c.k/c.pop*100,pw=c.w/c.pop*100,po=c.o/c.pop*100;
    var bar='<div class="stack"><span class="s-c" style="width:'+pc+'%">'+nf(pc,0)+'</span><span class="s-w" style="width:'+pw+'%">'+nf(pw,0)+'</span><span class="s-o" style="width:'+po+'%">'+nf(po,0)+'</span></div>';
    var title=name+': 0-14 '+nf(pc,1)+'%, 15-64 '+nf(pw,1)+'%, 65+ '+nf(po,1)+'%';
    if(tot)return '<div class="agerow tot" title="'+title+'"><span class="nm">'+name+'</span>'+bar+'</div>';
    return '<button type="button" class="agerow'+(id===state.sel?' on':'')+'" data-id="'+id+'" title="'+title+'"><span class="nm">'+name+'</span>'+bar+'</button>';
  }
  var h=row('fed',tx.fed,TOT,true);
  C.slice().sort(function(a,b){return b.o/b.pop-a.o/a.pop}).forEach(function(c){h+=row(c.id,sn(c.id),c,false)});
  $('agerows').innerHTML=h;
}

/* ---------- pyramid ---------- */
function renderPyr(){
  var tx=L(),max=110,h='';
  $('pyrF').textContent=tx.women;$('pyrM').textContent=tx.men;
  for(var i=AGES.length-1;i>=0;i--){
    var f=PF[i],m=PM[i];
    h+='<div class="pr" title="'+AGES[i]+': '+tx.women+' ≈'+f+', '+tx.men+' ≈'+m+' ('+tx.thou+')"><div class="pf"><i>'+f+'</i><b style="width:'+(f/max*86)+'%"></b></div><span class="age">'+AGES[i]+'</span><div class="pm"><b style="width:'+(m/max*86)+'%"></b><i>'+m+'</i></div></div>';
  }
  $('pyr').innerHTML=h;
}

/* ---------- grouped bars ---------- */
function gbars(o){
  var Wd=480,Ht=330,Lm=46,Rm=8,T0=22,PH=236,gw=(Wd-Lm-Rm)/4,bw=40,gap=8;
  var y=function(v){return T0+PH*(1-v/o.max)};
  var s='<svg viewBox="0 0 '+Wd+' '+Ht+'" role="group" aria-label="'+o.label+'">';
  o.ticks.concat([0]).forEach(function(tv){
    s+='<line class="grid" x1="'+Lm+'" x2="'+(Wd-Rm)+'" y1="'+y(tv)+'" y2="'+y(tv)+'"/><text class="ax" x="'+(Lm-6)+'" y="'+(y(tv)+4)+'" text-anchor="end">'+nf(tv)+'</text>';
  });
  YEARS.forEach(function(yr,i){
    var gx=Lm+i*gw,cx=gx+gw/2,on=yr===state.year,x0=cx-(2*bw+gap)/2;
    s+='<g class="grp'+(on?' on':'')+'" data-year="'+yr+'" tabindex="0" role="button" aria-label="'+yr+'">';
    s+='<rect class="band" x="'+(gx+3)+'" y="'+(T0-12)+'" width="'+(gw-6)+'" height="'+(PH+Ht-T0-PH-4+12)+'" rx="10"/>';
    o.series.forEach(function(se,j){
      var v=se.vals[i],bx=x0+j*(bw+gap),by=y(v);
      s+='<rect class="bar" x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+(y(0)-by)+'" rx="4" style="fill:'+se.color+'"/>';
      if(on)s+='<text class="val" x="'+(bx+bw/2)+'" y="'+(by-6)+'">'+nf(v)+'</text>';
    });
    s+='<text class="yr" x="'+cx+'" y="'+(T0+PH+26)+'">'+yr+'</text>';
    s+='<text class="netv" x="'+cx+'" y="'+(T0+PH+50)+'">'+nf(o.under[i])+'</text>';
    s+='</g>';
  });
  return s+'</svg>';
}

/* ---------- movement + ledger ---------- */
function spark(vals,idx){
  var w=92,h=28,p=4,mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),pts=[],dots='';
  vals.forEach(function(v,i){
    var x=p+i*(w-2*p)/3,y=h-p-(v-mn)/((mx-mn)||1)*(h-2*p);pts.push(x.toFixed(1)+','+y.toFixed(1));
    dots+='<circle class="'+(i===idx?'sp-s':'sp-d')+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(i===idx?4:2.2)+'"/>';
  });
  return '<svg viewBox="0 0 '+w+' '+h+'" aria-hidden="true"><polyline class="sp-l" points="'+pts.join(' ')+'"/>'+dots+'</svg>';
}
function renderMove(){
  var tx=L(),i=YEARS.indexOf(state.year);
  $('moveLegend').innerHTML='<li><i style="background:var(--forest)"></i>'+tx.births+'</li><li><i style="background:var(--hot)"></i>'+tx.deaths+'</li>';
  $('moveChart').innerHTML=gbars({label:tx.births+' / '+tx.deaths,max:25000,ticks:[5000,10000,15000,20000,25000],
    series:[{vals:MV.births,color:'var(--forest)'},{vals:MV.deaths,color:'var(--hot)'}],under:MV.nat});
  var rows=[['pop',MV.pop,null,0],['births',MV.births,MV.bpk1,1],['deaths',MV.deaths,MV.dpk1,1],['nat',MV.nat,MV.npk1,1],['still',MV.still,null,0],['inf',MV.inf,null,0],['viol',MV.viol,null,0],['marr',MV.marr,MV.mpk1,1],['div',MV.div,MV.dvk,1]];
  var h='';
  rows.forEach(function(r){
    var k=r[0],v=r[1][i],pv=i>0?r[1][i-1]:null;
    var per=r[2]?'<span class="per">'+nf(r[2][i],1)+' '+tx.per[k]+'</span>':'';
    var d=pv===null?' ':sgn(v-pv,0)+' '+tx.vsprev;
    h+='<div class="lrow"><div class="lab">'+tx.lab[k]+per+'</div><div><div class="v num">'+nf(v)+'</div><span class="d num">'+d+'</span></div>'+spark(r[1],i)+'</div>';
  });
  $('ledger').innerHTML=h;
}

/* ---------- sex + age at death ---------- */
function lineChart(){
  var tx=L(),Wd=480,Ht=300,Lm=46,Rm=84,T0=24,PH=226,PW=Wd-Lm-Rm,i0=YEARS.indexOf(state.year);
  var x=function(i){return Lm+i*PW/3},y=function(v){return T0+PH*(1-(v-68)/10)};
  var S=[{k:'awom',n:tx.women,c:'var(--hot)',v:MV.awom},{k:'atot',n:tx.avgage.split(' ')[0]===''?'':(state.lang==='bs'?'Ukupno':'Total'),c:'var(--fg)',v:MV.atot},{k:'amen',n:tx.men,c:'var(--forest)',v:MV.amen}];
  var s='<ul class="legend"><li>'+tx.avgage+' ('+tx.yrs+')</li></ul><svg viewBox="0 0 '+Wd+' '+Ht+'" role="group" aria-label="'+tx.avgage+'">';
  [68,70,72,74,76,78].forEach(function(tv){s+='<line class="grid" x1="'+Lm+'" x2="'+(Wd-Rm)+'" y1="'+y(tv)+'" y2="'+y(tv)+'"/><text class="ax" x="'+(Lm-6)+'" y="'+(y(tv)+4)+'" text-anchor="end">'+tv+'</text>'});
  s+='<line x1="'+x(i0)+'" x2="'+x(i0)+'" y1="'+T0+'" y2="'+(T0+PH)+'" stroke="var(--fg)" stroke-width="1.5" stroke-dasharray="4 4"/>';
  YEARS.forEach(function(yr,i){s+='<g class="grp'+(yr===state.year?' on':'')+'" data-year="'+yr+'" tabindex="0" role="button" aria-label="'+yr+'"><rect x="'+(x(i)-26)+'" y="'+T0+'" width="52" height="'+(PH+40)+'" fill="transparent"/><text class="yr" x="'+x(i)+'" y="'+(T0+PH+30)+'">'+yr+'</text></g>'});
  S.forEach(function(se){
    var pts=se.v.map(function(v,i){return x(i).toFixed(1)+','+y(v).toFixed(1)}).join(' ');
    s+='<polyline fill="none" stroke="'+se.c+'" stroke-width="3.5" stroke-linejoin="round" points="'+pts+'"/>';
    se.v.forEach(function(v,i){s+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="'+(i===i0?6:3.5)+'" style="fill:'+(i===i0?se.c:'var(--bg)')+'" stroke="'+se.c+'" stroke-width="2.5"/>'});
    s+='<text class="val" style="font-weight:800;font-size:13px" x="'+x(i0)+'" y="'+(y(se.v[i0])-12)+'">'+nf(se.v[i0],1)+'</text>';
    s+='<text class="ln-n" style="fill:'+se.c+'" x="'+(x(3)+12)+'" y="'+(y(se.v[3])+5)+'">'+se.n+'</text>';
  });
  return s+'</svg>';
}
function sbar(a,b,la,lb){
  var tot=a+b,pa=a/tot*100,pb=b/tot*100;
  return '<div class="sbar" role="img" aria-label="'+la+' '+nf(a)+', '+lb+' '+nf(b)+'"><span class="m" style="width:'+pa+'%">'+la+' '+nf(a)+'</span><span class="f" style="width:'+pb+'%">'+nf(b)+' '+lb+'</span></div>';
}
function renderSex(){
  var tx=L(),i=YEARS.indexOf(state.year);
  $('ageLine').innerHTML=lineChart();
  var r=MV.boys[i]/MV.girls[i]*100,g=MV.awom[i]-MV.amen[i];
  $('splits').innerHTML=
   '<div class="split"><h4>'+tx.bornBy+' · '+state.year+'</h4>'+sbar(MV.boys[i],MV.girls[i],tx.boys,tx.girls)+'</div>'+
   '<p class="fact"><b class="num">'+nf(r,1)+'</b>'+tx.ratio(r).replace(nf(r,1)+' ','')+'</p>'+
   '<div class="split"><h4>'+tx.diedBy+' · '+state.year+'</h4>'+sbar(MV.dmen[i],MV.dwom[i],tx.men,tx.women)+'</div>'+
   '<p class="fact"><b class="num">'+nf(g,1)+'</b>'+tx.gap(g).replace('on average '+nf(g,1)+' years older','on average years older').replace(nf(g,1)+' godina starije','godina starije')+'</p>';
}

/* ---------- names ---------- */
function renderNames(){
  var tx=L(),maxv=299;
  function list(a,cls){return a.map(function(n,i){return '<li class="nr '+cls+'"><span class="bg" style="width:'+(n[1]/maxv*100)+'%"></span><span class="rk">'+(i+1)+'</span><span class="nn">'+n[0]+'</span><span class="nc num">'+nf(n[1])+'</span></li>'}).join('')}
  $('nameB').textContent=tx.nb;$('nameG').textContent=tx.ng;
  $('listB').innerHTML=list(NB,'b');$('listG').innerHTML=list(NG,'g');
  var sb=NB.reduce(function(a,n){return a+n[1]},0)/MV.boys[3]*100,sg=NG.reduce(function(a,n){return a+n[1]},0)/MV.girls[3]*100;
  $('s6l').textContent=tx.s6l(sb,sg);
}

/* ---------- migration ---------- */
function renderMig(){
  var tx=L();
  $('migLegend').innerHTML='<li><i style="background:var(--forest)"></i>'+tx.imm+'</li><li><i style="background:var(--hot)"></i>'+tx.emi+'</li><li style="color:var(--hot);font-weight:600">'+tx.netl+'</li>';
  $('migChart').innerHTML=gbars({label:tx.imm+' / '+tx.emi,max:25000,ticks:[5000,10000,15000,20000,25000],
    series:[{vals:MV.imm,color:'var(--forest)'},{vals:MV.emi,color:'var(--hot)'}],under:MV.net});
  $('s7l').textContent=tx.s7l(MV.net[0],MV.net[3]);
}

/* ---------- hero + static ---------- */
function renderHero(){
  var tx=L();
  $('popBig').textContent=nf(TOT.pop);
  var dp=(MV.pop[3]-MV.pop[0])/MV.pop[0]*100;
  $('popCap').textContent=tx.popcap+' · '+tx.popdelta(dp);
  $('facts').innerHTML=
   '<li><b class="num">'+nf(MV.bpk1[3],1)+'</b><span>'+tx.f_b+'</span></li>'+
   '<li><b class="num">'+nf(MV.dpk1[3],1)+'</b><span>'+tx.f_d+'</span></li>'+
   '<li><b class="num">'+nf(MV.nat[3])+'</b><span>'+tx.f_n+'</span></li>'+
   '<li><b class="num">'+nf(MV.net[3])+'</b><span>'+tx.f_m+'</span></li>';
}
function renderChips(){
  var h=YEARS.map(function(y){return '<button type="button" data-year="'+y+'" aria-pressed="'+(y===state.year)+'">'+y+'</button>'}).join('');
  document.querySelectorAll('[data-chips]').forEach(function(el){el.innerHTML=h});
}
function renderStatic(){
  var tx=L();
  document.documentElement.lang=state.lang==='bs'?'bs':'en';
  document.querySelectorAll('[data-i18n]').forEach(function(el){var v=tx[el.getAttribute('data-i18n')];if(typeof v==='string')el.textContent=v});
  document.querySelectorAll('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===state.lang))});
  document.title=state.lang==='bs'?'Stanovništvo FBiH':'Stanovništvo FBiH';
}
function renderYear(){renderChips();renderMove();renderSex();renderMig()}
function renderSel(){drawRose();renderReadout();renderAge()}
function renderAll(){
  renderStatic();renderHero();renderMetrics();retarget(false);renderReadout();renderAge();renderPyr();renderNames();renderYear();
}

/* ---------- events ---------- */
document.addEventListener('click',function(e){
  var t=e.target;
  var lg=t.closest('[data-lang]');if(lg){state.lang=lg.getAttribute('data-lang');renderAll();return}
  var mt=t.closest('[data-metric]');if(mt){state.metric=mt.getAttribute('data-metric');renderMetrics();retarget(true);renderReadout();return}
  var yr=t.closest('[data-year]');if(yr){state.year=+yr.getAttribute('data-year');renderYear();return}
  var id=t.closest('[data-id]');if(id&&id.getAttribute('data-id')!=='fed'){state.sel=id.getAttribute('data-id');renderSel()}
});
$('rose').addEventListener('pointerover',function(e){
  if(e.pointerType==='touch')return;
  var id=e.target.closest('[data-id]');
  if(id&&id.getAttribute('data-id')!==state.sel){state.sel=id.getAttribute('data-id');renderSel()}
});
document.addEventListener('keydown',function(e){
  if(e.key!=='Enter'&&e.key!==' ')return;
  var el=e.target.closest&&e.target.closest('[data-id],[data-year]');
  if(el&&el.tagName!=='BUTTON'){e.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true}))}
});
function fitRose(){$('rose').setAttribute('viewBox',innerWidth<760?'180 100 580 580':'0 0 940 780')}
fitRose();addEventListener('resize',fitRose);
renderAll();
})();
