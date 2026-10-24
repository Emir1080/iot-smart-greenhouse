/* Состояние и localStorage, журнал событий, управление устройствами — IoT Smart Greenhouse (учебный проект) */
let S;try{S=JSON.parse(localStorage.getItem('tp1'))}catch(e){}
if(!S||!S.zones)S=fresh();
const save=()=>{try{localStorage.setItem('tp1',JSON.stringify(S))}catch(e){}};
const rnd=(a,b)=>Math.random()*(b-a)+a, clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const now=()=>new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
const zn=id=>S.zones.find(z=>z.id===id);
function logEv(z,src,msg){S.log.unshift({id:S.n++,z:z.id,src,msg,t:now()});S.log.length=Math.min(S.log.length,150)}
function setAct(z,k,v,src){v=v?1:0;if(z.act[k]===v)return;z.act[k]=v;logEv(z,src,DEV[k]+(v?' включён':' выключен'))}
