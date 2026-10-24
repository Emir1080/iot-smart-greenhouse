/* Симулятор датчиков и цикл обновления — IoT Smart Greenhouse (учебный проект) */
function tick(){const lbl=new Date().toLocaleTimeString('ru-RU');
 S.zones.forEach(z=>{const a=z.act;
  z.temp+=rnd(-.5,.55)+(a.fan?-.7:0)+(a.vent?-.5:0)+(a.heater?.8:0)+(a.lamp?.1:0)+(z.temp>25?.05:.12-.1);
  z.hum+=rnd(-1.5,1.5)+(a.humid?2.5:0)+(a.vent?-.8:0);
  z.soil+=rnd(-1.4,.2)+(a.pump?5:0);
  z.light+=rnd(-1800,1800)+(a.lamp?2500:-300)+(18000-z.light)*.04;
  z.co2+=rnd(-45,50)+(a.vent?-60:5);
  if(a.pump)z.water-=rnd(.8,1.6);else z.water-=rnd(0,.15);
  z.temp=clamp(z.temp,14,38);z.hum=clamp(z.hum,25,98);z.soil=clamp(z.soil,8,95);z.light=clamp(z.light,3000,40000);z.co2=clamp(z.co2,400,2100);z.water=clamp(z.water,0,100);
  z.at=Date.now();if(z.mode==='auto')automate(z);checkAlerts(z);
  const h=z.h;h.t.push(lbl);h.temp.push(+z.temp.toFixed(1));h.hum.push(+z.hum.toFixed(0));h.soil.push(+z.soil.toFixed(0));
  Object.keys(h).forEach(k=>{if(h[k].length>24)h[k].shift()})});
 save();paint(true);schedule()}
let timer;function schedule(){clearTimeout(timer);timer=setTimeout(tick,S.set.speed*1000)}
