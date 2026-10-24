/* Автоматика: пороги, гистерезис, защита насоса — IoT Smart Greenhouse (учебный проект) */
function automate(z){const s=S.set,A='автоматика';
 if(z.soil<s.smin&&z.water>s.wcrit)setAct(z,'pump',1,A);
 if(z.soil>=s.smax||z.water<=s.wcrit){if(z.act.pump&&z.water<=s.wcrit)logEv(z,A,'Насос заблокирован: мало воды');setAct(z,'pump',0,A)}
 if(z.temp>s.tmax)setAct(z,'fan',1,A);else if(z.temp<s.tmax-1)setAct(z,'fan',0,A);
 if(z.temp>s.tmax+2)setAct(z,'vent',1,A);else if(z.temp<s.tmax)setAct(z,'vent',0,A);
 if(z.temp<s.tmin)setAct(z,'heater',1,A);else if(z.temp>s.tmin+1)setAct(z,'heater',0,A);
 if(z.light<s.lmin)setAct(z,'lamp',1,A);else if(z.light>s.lmin*1.2)setAct(z,'lamp',0,A);
 if(z.hum<s.hmin)setAct(z,'humid',1,A);else if(z.hum>s.hmin+8)setAct(z,'humid',0,A)}
