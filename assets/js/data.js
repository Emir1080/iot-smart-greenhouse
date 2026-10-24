/* Константы и модель данных (зоны, датчики, устройства, пороги) — IoT Smart Greenhouse (учебный проект) */
const $=s=>document.querySelector(s);
const SENS={temp:['Температура','°C'],hum:['Влажность воздуха','%'],soil:['Влажность почвы','%'],light:['Освещённость','лк'],co2:['CO₂','ppm'],water:['Уровень воды','%']};
const DEV={pump:'Насос',fan:'Вентилятор',lamp:'Фитолампа',humid:'Увлажнитель',heater:'Обогрев',vent:'Форточка'};
const PAGES=[['overview','Обзор'],['zones','Зоны'],['sensors','Датчики'],['control','Управление'],['alerts','Предупреждения'],['analytics','Аналитика'],['config','Настройки'],['log','Журнал событий']];
const DEF_SET={tmin:20,tmax:28,hmin:50,hmax:80,smin:35,smax:75,lmin:12000,wcrit:15,co2max:1500,speed:4,theme:'auto'};
const mk=(id,name,t,h,s,l,c,w)=>({id,name,temp:t,hum:h,soil:s,light:l,co2:c,water:w,mode:'auto',act:{pump:0,fan:0,lamp:0,humid:0,heater:0,vent:0},h:{t:[],temp:[],hum:[],soil:[]},at:Date.now()});
const fresh=()=>({zones:[mk('Z1','Томаты',24.8,67,42,18400,820,72),mk('Z2','Огурцы',26.2,74,55,16200,760,64),mk('Z3','Зелень',22.1,62,48,21000,690,80)],alerts:[],log:[],set:{...DEF_SET},n:1});
