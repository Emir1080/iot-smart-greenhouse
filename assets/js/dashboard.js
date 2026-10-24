/* Интерфейс: страницы, отрисовка, обработчики событий — IoT Smart Greenhouse (учебный проект) */
const FILE={overview:'index.html',zones:'zones.html',sensors:'sensors.html',control:'control.html',alerts:'alerts.html',analytics:'analytics.html',config:'settings.html',log:'event-log.html'};
// ---------- представления
const f={z:'all',s:'all'};
const zopt=()=>'<option value="all">Все зоны</option>'+S.zones.map(z=>`<option value="${z.id}"${f.z===z.id?' selected':''}>${z.name}</option>`).join('');
const fz=a=>f.z==='all'?a:a.filter(x=>x.z===f.z);
const fmt=(z,k)=>k==='light'?(z[k]/1000).toFixed(1)+'k':(+z[k]).toFixed(k==='temp'?1:0);
const pct={temp:z=>(z.temp-14)/24*100,hum:z=>z.hum,soil:z=>z.soil,light:z=>z.light/400,co2:z=>(z.co2-400)/17,water:z=>z.water};
const rtag=r=>r>=50?'<span class="tag c">Риск '+r+'</span>':r>=20?'<span class="tag w">Риск '+r+'</span>':'<span class="tag">Риск '+r+'</span>';
function zoneCard(z){return `<div class="zone"><h3>${z.name}<span>${rtag(risk(z))}</span></h3><div class="sub" style="margin:0 0 6px;font-size:13px">${z.mode==='auto'?'Авторежим':'Ручной режим'}</div>`+
 Object.keys(SENS).map(k=>`<div class="row"><span>${SENS[k][0]}</span><div class="bar${bad(z,k)?' bad':''}"><i style="width:${clamp(pct[k](z),2,100)}%"></i></div><span class="v">${fmt(z,k)} ${SENS[k][1]}</span></div>`).join('')+'</div>'}
const V={
overview(){const open=S.alerts.filter(a=>a.st==='open'),on=S.zones.reduce((n,z)=>n+Object.values(z.act).reduce((a,b)=>a+b,0),0),avg=S.zones.reduce((n,z)=>n+z.temp,0)/S.zones.length;
 return `<h1>Обзор системы</h1><p class="sub">Три зоны, 18 симулируемых датчиков и 6 виртуальных устройств на каждую зону. Реальное оборудование не подключено.</p>
 <div class="kpis"><div class="kpi"><b>${avg.toFixed(1)} °C</b><span>средняя температура</span></div><div class="kpi"><b>${open.length}</b><span>открытых предупреждений</span></div><div class="kpi"><b>${on}</b><span>устройств включено</span></div><div class="kpi"><b>${Math.max(...S.zones.map(risk))}</b><span>максимальный риск</span></div></div>
 <h2>Зоны выращивания</h2><div class="zones">${S.zones.map(zoneCard).join('')}</div>
 <h2>Последние предупреждения</h2>${alertRows(S.alerts.slice(0,4))}<h2>Последние события</h2>${logRows(S.log.slice(0,5))}`},
zones(){return `<h1>Зоны</h1><p class="sub">Показания, состояние устройств и риск по каждой зоне.</p><div class="zones">${S.zones.map(z=>zoneCard(z)+'').join('')}</div>
 <h2>Включённые устройства</h2><div class="panel"><table><tr><th>Зона</th><th>Устройства</th></tr>${S.zones.map(z=>`<tr><td>${z.name}</td><td>${Object.keys(DEV).filter(k=>z.act[k]).map(k=>`<span class="tag">${DEV[k]}</span>`).join(' ')||'<span class="tag o">всё выключено</span>'}</td></tr>`).join('')}</table></div>`},
sensors(){const rows=[];S.zones.filter(z=>f.z==='all'||z.id===f.z).forEach(z=>Object.keys(SENS).forEach(k=>rows.push(`<tr><td>${SENS[k][0]}</td><td>${z.name}</td><td><b>${fmt(z,k)}</b> ${SENS[k][1]}</td><td>${bad(z,k)?'<span class="tag w">Вне нормы</span>':'<span class="tag">В норме</span>'}</td><td>${new Date(z.at).toLocaleTimeString('ru-RU')}</td></tr>`)));
 return `<h1>Датчики</h1><p class="sub">Текущие значения всех датчиков в сети.</p><div class="tools"><select data-f="z">${zopt()}</select></div><div class="panel"><table><tr><th>Датчик</th><th>Зона</th><th>Значение</th><th>Состояние</th><th>Обновлён</th></tr>${rows.join('')}</table></div>`},
control(){return `<h1>Управление</h1><p class="sub">В авторежиме устройства управляются порогами из настроек. В ручном режиме их включаете вы.</p><div class="zones">${S.zones.map(z=>`<div class="zone"><h3>${z.name}<button data-mode="${z.id}" class="${z.mode==='auto'?'p':''}">${z.mode==='auto'?'Авто':'Ручной'}</button></h3>
 <div class="devs">${Object.keys(DEV).map(k=>`<div class="dev${z.act[k]?' on':''}"><span>${DEV[k]}</span><button data-dev="${z.id}:${k}" ${z.mode==='auto'?'disabled title="Переключите в ручной режим"':''}>${z.act[k]?'Выкл':'Вкл'}</button></div>`).join('')}</div></div>`).join('')}</div>`},
alerts(){const l=fz(S.alerts).filter(a=>f.s==='all'||a.st===f.s);return `<h1>Предупреждения</h1><p class="sub">Появляются при выходе показаний за пороги и закрываются сами, когда значения вернулись в норму.</p>
 <div class="tools"><select data-f="z">${zopt()}</select><select data-f="s"><option value="all">Любой статус</option><option value="open"${f.s==='open'?' selected':''}>Открытые</option><option value="resolved"${f.s==='resolved'?' selected':''}>Закрытые</option></select><button class="d" data-clear="1">Очистить закрытые</button></div>${alertRows(l)}`},
analytics(){return `<h1>Аналитика</h1><p class="sub">Динамика за последние измерения, оценка риска и рекомендации. Вычисления идут локально, без внешних сервисов.</p>
 <div class="charts"><div class="panel"><canvas id="c1"></canvas></div><div class="panel"><canvas id="c2"></canvas></div><div class="panel"><canvas id="c3"></canvas></div><div class="panel"><canvas id="c4"></canvas></div></div>
 <h2>Рекомендации</h2>${S.zones.map(z=>{const r=recs(z);return `<h3 style="margin:14px 0 4px;font-size:15px">${z.name} ${rtag(risk(z))}</h3>`+(r.length?r.map(x=>`<div class="rec ${x[0]}"><b>${x[1]}</b><small>Почему важно: ${x[2]}</small><small>Что сделать: ${x[3]}</small></div>`).join(''):'<div class="rec"><b>Всё в норме</b><small>Показания в заданных пределах, действий не требуется.</small></div>')}).join('')}`},
config(){const s=S.set,n=(k,l)=>`<label>${l}<input type="number" step="any" data-set="${k}" value="${s[k]}"></label>`;
 return `<h1>Настройки</h1><p class="sub">Пороги учебные и не заменяют агрономические нормы: для реальной культуры их нужно подбирать отдельно.</p>
 <div class="form">${n('tmin','Температура, мин °C')}${n('tmax','Температура, макс °C')}${n('hmin','Влажность воздуха, мин %')}${n('hmax','Влажность воздуха, макс %')}${n('smin','Почва, включить полив ниже %')}${n('smax','Почва, выключить полив от %')}${n('lmin','Свет, мин лк')}${n('wcrit','Вода, критический уровень %')}${n('co2max','CO₂, макс ppm')}${n('speed','Шаг симуляции, сек')}
 <label>Тема<select data-set="theme"><option value="auto"${s.theme==='auto'?' selected':''}>Как в системе</option><option value="light"${s.theme==='light'?' selected':''}>Светлая</option><option value="dark"${s.theme==='dark'?' selected':''}>Тёмная</option></select></label></div>
 <div class="tools" style="margin-top:14px"><button class="d" data-reset="1">Сбросить все данные</button></div>`},
log(){return `<h1>Журнал событий</h1><p class="sub">Действия автоматики и оператора.</p><div class="tools"><select data-f="z">${zopt()}</select></div>${logRows(fz(S.log))}`}
};
let page=document.body.dataset.page||'overview';
function paint(fromTick){
 $('#nav').innerHTML=PAGES.map(p=>`<a href="${FILE[p[0]]}" class="${p[0]===page?'on':''}">${p[1]}</a>`).join('');
 $('#simInfo').textContent='Симуляция: шаг '+S.set.speed+' с. Данные хранятся в этом браузере.';
 if(fromTick&&page==='config')return;
 const el=document.activeElement;if(fromTick&&el&&el.tagName==='SELECT'&&$('#view').contains(el))return;
 $('#view').innerHTML=V[page]();if(page==='analytics')drawCharts()}
function theme(){const t=S.set.theme;if(t==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',t)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.mode){const z=zn(b.dataset.mode);z.mode=z.mode==='auto'?'manual':'auto';logEv(z,'оператор','Режим: '+(z.mode==='auto'?'авто':'ручной'))}
 else if(b.dataset.dev){const[i,k]=b.dataset.dev.split(':'),z=zn(i);setAct(z,k,!z.act[k],'оператор')}
 else if(b.dataset.clear)S.alerts=S.alerts.filter(a=>a.st==='open');
 else if(b.dataset.reset){if(!confirm('Удалить все показания, события и настройки?'))return;S=fresh();theme()}
 else return;save();paint(false)});
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.f){f[t.dataset.f]=t.value;paint(false)}
 else if(t.dataset.set){const k=t.dataset.set;S.set[k]=k==='theme'?t.value:Math.max(k==='speed'?1:-100,+t.value||0);if(k==='theme')theme();save();if(k==='speed')schedule();$('#simInfo').textContent='Симуляция: шаг '+S.set.speed+' с. Данные хранятся в этом браузере.'}});
theme();
paint(false);tick();
