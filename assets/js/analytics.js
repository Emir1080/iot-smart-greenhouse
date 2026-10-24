/* Аналитика: риск, рекомендации, графики Chart.js — IoT Smart Greenhouse (учебный проект) */
function risk(z){const s=S.set;let r=0;if(z.temp>s.tmax)r+=25;if(z.temp<s.tmin)r+=20;if(z.hum<s.hmin)r+=10;if(z.hum>s.hmax)r+=10;if(z.soil<s.smin)r+=25;if(z.light<s.lmin)r+=10;if(z.co2>s.co2max)r+=15;if(z.water<=s.wcrit)r+=30;return Math.min(r,100)}
function recs(z){const s=S.set,o=[];
 if(z.soil<s.smin)o.push(['w','Почва суше нормы ('+z.soil.toFixed(0)+'%)','Растения недополучают воду.',z.water>s.wcrit?'Включить полив или проверить автоматику.':'Сначала пополнить бак: насос заблокирован.']);
 if(z.water<=s.wcrit)o.push(['c','Критически мало воды ('+z.water.toFixed(0)+'%)','Автополив остановлен защитой.','Долить воду в резервуар.']);
 if(z.temp>s.tmax)o.push(['w','Жарко: '+z.temp.toFixed(1)+' °C','Перегрев тормозит рост и усиливает испарение.','Проверить вентилятор и форточку.']);
 if(z.temp<s.tmin)o.push(['w','Холодно: '+z.temp.toFixed(1)+' °C','Низкая температура замедляет развитие.','Проверить обогрев.']);
 if(z.light<s.lmin)o.push(['w','Мало света ('+(z.light/1000).toFixed(1)+'k лк)','Растениям не хватает энергии для фотосинтеза.','Включить фитолампу.']);
 if(z.co2>s.co2max)o.push(['w','Много CO₂ ('+z.co2.toFixed(0)+' ppm)','Воздух застоялся.','Проветрить теплицу.']);
 const h=z.h.temp,n=h.length;if(n>1&&Math.abs(h[n-1]-h[n-2])/(h[n-2]||1)*100>=8)o.push(['w','Резкий скачок температуры','Изменение более 8% за один шаг.','Проверить датчик и работу устройств.']);
 return o}
function drawCharts(){charts.forEach(c=>c.destroy());charts=[];if(!window.Chart)return;
 const cols=['#2f7d4f','#d08a12','#3b7fc4'],h=S.zones[0].h;
 const line=(id,key,title)=>charts.push(new Chart($('#'+id),{type:'line',data:{labels:h.t,datasets:S.zones.map((z,i)=>({label:z.name,data:z.h[key],borderColor:cols[i],backgroundColor:cols[i],tension:.3,pointRadius:0,borderWidth:2}))},options:{animation:false,maintainAspectRatio:false,plugins:{title:{display:true,text:title},legend:{position:'bottom'}},scales:{x:{ticks:{maxTicksLimit:5}}}}}));
 line('c1','temp','Температура, °C');line('c2','hum','Влажность воздуха, %');line('c3','soil','Влажность почвы, %');
 charts.push(new Chart($('#c4'),{type:'bar',data:{labels:S.zones.map(z=>z.name),datasets:[{label:'Риск',data:S.zones.map(risk),backgroundColor:cols},{label:'Вода, %',data:S.zones.map(z=>+z.water.toFixed(0)),backgroundColor:'#9db8a6'}]},options:{animation:false,maintainAspectRatio:false,plugins:{title:{display:true,text:'Риск и запас воды по зонам'},legend:{position:'bottom'}},scales:{y:{min:0,max:100}}}}))}
