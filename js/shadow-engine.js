/* Shadow Ascension — Phaser 3 rebuild
   Engine: Phaser 3 (CDN), Arcade Physics, procedural dungeon/VFX.
   The old Canvas classes are intentionally bypassed; gameplay is rebuilt around Scene/GameObjects.
*/
const SA = {
  floor: 1, room: 1, gold: 328450, gems: 1240, essence: 56,
  player: { level: 32, hp: 4820, maxHp: 4820, mp: 1240, maxMp: 1240, xp: 48750, next: 73200, damage: 260 },
  inventory: [
    ['⚔','Теневой клинок','Оружие',1],['🛡','Доспех Тени','Экипировка',1],['♜','Перчатки охотника','Экипировка',3],['💎','Теневая эссенция','Материал',3],['🔵','Зелье маны','Расходник',3],
    ['📦','Древний сундук','Материал',1],['🧪','Зелье HP','Расходник',3],['🟣','Тёмная сфера','Материал',3],['🔥','Пламя бездны','Материал',3],['💠','Кристалл портала','Материал',1],
    ['🟪','Осколок тени','Материал',24],['🟩','Зелёный кристалл','Материал',3],['⬜','Лунный осколок','Материал',12]
  ],
  quest: { kills: 12, target: 20, crystals: 0, summons: 3, summonTarget: 5 },
  skills: [
    {key:'Q', name:'Теневой разрез', cd:1.8, color:0x9b5cff}, {key:'E', name:'Разрыв тени', cd:12.6, color:0x7c3cff},
    {key:'R', name:'Сумеречный взрыв', cd:1.2, color:0xd58cff}, {key:'F', name:'Стрела тени', cd:1.0, color:0x65a8ff}
  ]
};

class ShadowScene extends Phaser.Scene {
  constructor(){ super('ShadowScene'); }
  create(){
    this.cameras.main.setBackgroundColor('#050711');
    this.physics.world.setBounds(0,0,2400,1600);
    this.walls=this.physics.add.staticGroup(); this.enemies=[]; this.projectiles=[]; this.fx=[];
    this.cooldowns={Q:0,E:0,R:0,F:0}; this.attackReady=true; this.roomCleared=false; this.boss=null;
    this.buildFloor(); this.createPlayer(); this.createInput(); this.createUI(); this.createMinimap(); this.spawnRoom();
    this.cameras.main.startFollow(this.player, true, 0.10, 0.10); this.cameras.main.setZoom(Math.min(window.innerWidth/1150, window.innerHeight/720));
    this.scale.on('resize',()=>this.layout()); this.layout();
  }
  buildFloor(){
    this.worldG=this.add.graphics();
    this.worldG.fillStyle(0x080a13,1).fillRect(0,0,2400,1600);
    // dungeon floor grid / slabs
    for(let y=80;y<1520;y+=64) for(let x=80;x<2320;x+=64){
      const n=((x/64+y/64)%3); this.worldG.fillStyle(n===0?0x171a29:n===1?0x141827:0x101421,1).fillRect(x,y,61,61);
      this.worldG.lineStyle(1,0x272a3b,0.55).strokeRect(x,y,61,61);
    }
    // decorative purple seams
    for(let i=0;i<30;i++){ const x=100+((i*173)%2200), y=100+((i*257)%1400); this.worldG.lineStyle(2,0x6d35c9,0.16); this.worldG.lineBetween(x,y,x+18,y+8); }
    // perimeter walls
    this.addWall(20,20,2360,60); this.addWall(20,1520,2360,60); this.addWall(20,20,60,1560); this.addWall(2320,20,60,1560);
    // rooms separated by corridors; deliberately open door gaps
    [[60,80,360,55],[500,80,520,55],[1060,80,520,55],[1620,80,700,55],
     [60,1465,500,55],[700,1465,600,55],[1500,1465,820,55],
     [60,80,55,410],[60,590,55,500],[60,1180,55,285],[2285,80,55,420],[2285,620,55,430],[2285,1130,55,355],
     [390,260,260,55],[820,260,260,55],[1280,260,360,55],[1750,260,400,55],
     [390,1220,260,55],[820,1220,260,55],[1280,1220,360,55],[1750,1220,400,55],
     [650,420,55,300],[650,820,55,300],[1260,420,55,300],[1260,820,55,300],[1740,420,55,300],[1740,820,55,300]].forEach(a=>this.addWall(...a));
    // central portal platform
    this.drawPortal(1200,180);
    // braziers / crystals
    for(const p of [[130,450],[330,900],[820,150],[1100,1400],[1540,150],[2020,900],[2150,450]]) this.drawBrazier(p[0],p[1]);
    for(const p of [[250,1350],[1160,1350],[1960,1350],[2200,1150]]) this.drawCrystal(p[0],p[1]);
  }
  addWall(x,y,w,h){ const g=this.add.graphics(); g.fillStyle(0x0b0e19,1).fillRoundedRect(x,y,w,h,8); g.lineStyle(3,0x343750,1).strokeRoundedRect(x,y,w,h,8); g.lineStyle(1,0x8051d8,0.25).strokeRoundedRect(x+5,y+5,w-10,h-10,5); const body=this.walls.create(x+w/2,y+h/2,null); body.setSize(w,h).setVisible(false); }
  drawBrazier(x,y){ const g=this.add.graphics(); g.fillStyle(0x101525,1).fillCircle(x,y,18); g.lineStyle(2,0x38405c,1).strokeCircle(x,y,18); g.fillStyle(0x6b2aff,0.35).fillCircle(x,y-12,27); g.fillStyle(0x8fc7ff,0.9).fillTriangle(x,y-29,x-8,y-6,x+8,y-6); g.fillStyle(0xd4e9ff,1).fillTriangle(x,y-23,x-4,y-8,x+5,y-8); }
  drawCrystal(x,y){ const g=this.add.graphics(); g.fillStyle(0x5125a0,0.25).fillCircle(x,y,30); g.fillStyle(0x39208b,1).fillTriangle(x,y-28,x-12,y+18,x+14,y+12); g.fillStyle(0x9a54ff,0.9).fillTriangle(x,y-22,x-6,y+8,x+8,y+5); }
  drawPortal(x,y){ this.portalG=this.add.graphics(); this.portalG.lineStyle(8,0x6b22ff,0.8).strokeEllipse(x,y,130,170); this.portalG.lineStyle(3,0xd08cff,0.9).strokeEllipse(x,y,108,148); this.portalG.fillStyle(0x4b13a8,0.18).fillEllipse(x,y,105,145); for(let i=0;i<14;i++){const a=i*Math.PI*2/14;this.portalG.fillStyle(0xa65cff,0.9).fillCircle(x+55*Math.cos(a),y+72*Math.sin(a),4);} this.portalG.setDepth(2); }
  createPlayer(){
    const c=this.add.container(1160,850); c.setDepth(20); this.player=c;
    const glow=this.add.circle(0,4,38,0x7c2cff,0.16); const shadow=this.add.ellipse(0,28,52,18,0x000000,0.65);
    const cloak=this.add.polygon(0,10,[-20,-4,-12,28,0,38,16,28,23,-3],0x111321,1).setStrokeStyle(2,0x5631a2);
    const body=this.add.rectangle(0,2,24,38,0x171827).setStrokeStyle(1,0x5e3caa); const head=this.add.circle(0,-24,13,0xc99a82);
    const hair=this.add.polygon(0,-30,[-14,-28,-9,-42,0,-35,8,-44,15,-25,5,-30],0x070914,1); const eye=this.add.rectangle(7,-24,5,2,0xa56bff);
    const blade=this.add.rectangle(29,4,7,62,0xeeeaff).setAngle(-38).setStrokeStyle(2,0x8e5cff); const aura=this.add.circle(0,-4,48,0x7c2cff,0.06);
    c.add([glow,shadow,aura,cloak,body,head,hair,eye,blade]); c.setSize(32,48); this.physics.add.existing(c); c.body.setCircle(18, -18,-1); c.body.setCollideWorldBounds(true);
    this.physics.add.collider(c,this.walls); this.playerVisual={glow,blade};
  }
  createInput(){
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,Q,E,R,F');
    this.input.on('pointerdown',p=>{ if(p.y<window.innerHeight*0.75)this.aimAt(p.worldX,p.worldY); });
    this.input.on('pointerup',()=>{});
    this.aim={x:1,y:0}; this.input.on('pointermove',p=>{if(p.isDown)this.aimAt(p.worldX,p.worldY);});
    window.SA_FIRE=()=>this.attack(); window.SA_DODGE=()=>this.dodge(); window.SA_SKILL=k=>this.skill(k);
  }
  aimAt(x,y){ const dx=x-this.player.x,dy=y-this.player.y,l=Math.hypot(dx,dy)||1;this.aim.x=dx/l;this.aim.y=dy/l; }
  spawnRoom(){
    this.clearEnemies(); const room=this.room;
    const positions = room===3 ? [[1850,650],[1980,700],[2100,640],[2010,820]] : room===2 ? [[760,620],[880,760],[1020,620],[1450,720]] : [[760,560],[900,700],[1040,560],[1480,620],[1650,720]];
    positions.forEach((p,i)=>this.spawnEnemy(p[0],p[1],i%3));
    if(room===3){ this.spawnBoss(1950,1000); this.showCenter('ТЁМНЫЙ РЫЦАРЬ · ЭЛИТНЫЙ БОСС'); }
    else this.showCenter('ПОДЗЕМЕЛЬЕ ТЕНЕЙ · ЭТАЖ '+SA.floor);
  }
  spawnEnemy(x,y,type){
    const data=[['Теневая тварь',420,85,28,0x30324c],['Теневой охотник',300,120,22,0x4d315e],['Теневой маг',350,65,35,0x263d62]][type];
    const c=this.add.container(x,y).setDepth(15); const glow=this.add.circle(0,0,34,data[4],0.13); const body=this.add.polygon(0,8,[-25,-4,-15,30,0,38,17,27,25,-5],data[4],1).setStrokeStyle(2,0x6f54c0); const head=this.add.circle(0,-17,14,0x161726); const eyes=this.add.rectangle(6,-18,8,3,0xff335f); const hpbg=this.add.rectangle(0,-43,48,5,0x170c16); const hp=this.add.rectangle(-24,-43,48,5,0x45d7a0).setOrigin(0,0.5); c.add([glow,body,head,eyes,hpbg,hp]); c.setSize(42,50); this.physics.add.existing(c); c.body.setCircle(20,-20,-2); c.hp=data[1]; c.maxHp=data[1]; c.speed=data[2]; c.damage=data[3]; c.hpbar=hp; c.attackCD=0; c.type=type; c.alive=true; c.name=data[0]; this.physics.add.collider(c,this.walls); this.enemies.push(c); }
  spawnBoss(x,y){ const c=this.add.container(x,y).setDepth(16); const aura=this.add.circle(0,0,70,0x9b174f,0.16); const body=this.add.polygon(0,10,[-38,-10,-28,50,0,70,30,48,42,-12],0x151624,1).setStrokeStyle(3,0xff304f); const helm=this.add.circle(0,-34,27,0x202235).setStrokeStyle(3,0x7d2945); const eye=this.add.rectangle(0,-34,22,5,0xff263f); const sword=this.add.rectangle(47,15,10,100,0xd9e3ff).setAngle(-35).setStrokeStyle(2,0xff4568); const hpbg=this.add.rectangle(0,-88,100,8,0x190914); const hp=this.add.rectangle(-50,-88,100,8,0xf22d45).setOrigin(0,0.5); c.add([aura,body,helm,eye,sword,hpbg,hp]); c.setSize(64,86); this.physics.add.existing(c); c.body.setCircle(30,-30,-8); c.hp=5120;c.maxHp=5120;c.speed=52;c.damage=95;c.attackCD=0;c.hpbar=hp;c.alive=true;c.isBoss=true;c.name='Тёмный Рыцарь';this.physics.add.collider(c,this.walls);this.enemies.push(c);this.boss=c; }
  clearEnemies(){this.enemies.forEach(e=>e.destroy());this.enemies=[];this.boss=null;}
  update(t,dt){
    const d=dt/1000; this.cooldowns=Object.fromEntries(Object.entries(this.cooldowns).map(([k,v])=>[k,Math.max(0,v-d)]));
    let x=(this.keys.D.isDown||this.keys.RIGHT.isDown?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown?1:0), y=(this.keys.S.isDown||this.keys.DOWN.isDown?1:0)-(this.keys.W.isDown||this.keys.UP.isDown?1:0); const l=Math.hypot(x,y)||1; if(x||y){x/=l;y/=l;this.player.body.setVelocity(x*245,y*245);this.playerVisual.glow.scaleX=1+Math.sin(t/90)*.08;}
    else this.player.body.setVelocity(0,0);
    if(Phaser.Input.Keyboard.JustDown(this.keys.SPACE))this.dodge(); ['Q','E','R','F'].forEach(k=>{if(Phaser.Input.Keyboard.JustDown(this.keys[k]))this.skill(k);});
    this.enemies.forEach(e=>this.updateEnemy(e,d)); this.updateProjectiles(d); this.updatePortal(t); this.updateHUD();
  }
  updateEnemy(e,d){ if(!e.alive)return; const dx=this.player.x-e.x,dy=this.player.y-e.y,dist=Math.hypot(dx,dy)||1; e.body.setVelocity(dist<700?dx/dist*e.speed:0,dist<700?dy/dist*e.speed:0); e.attackCD=Math.max(0,e.attackCD-d); if(dist<60&&e.attackCD<=0){e.attackCD=e.isBoss?1.2:1.5;this.damagePlayer(e.damage);this.burst(e.x,e.y,0xff304f,7);} }
  damagePlayer(n){ if(this.dodgeUntil&&this.time.now<this.dodgeUntil)return;SA.player.hp=Math.max(0,SA.player.hp-n);this.cameras.main.shake(90,0.004);this.log('Получен урон: -'+n,'#ff6b76');if(SA.player.hp<=0){SA.player.hp=SA.player.maxHp;this.player.setPosition(1160,850);this.showCenter('ТЕНЬ ВОЗВРАЩАЕТСЯ');}}
  attack(){ if(!this.attackReady)return;this.attackReady=false;this.time.delayedCall(220,()=>this.attackReady=true); const a=Math.atan2(this.aim.y,this.aim.x); const arc=this.add.arc(this.player.x+this.aim.x*30,this.player.y+this.aim.y*30,65,a-.9,a+.9,false,0xb96cff,0.8).setDepth(18);this.tweens.add({targets:arc,scale:1.3,alpha:0,duration:220,onComplete:()=>arc.destroy()});this.playerVisual.blade.angle=Phaser.Math.RadToDeg(a)-38; let hit=0;this.enemies.forEach(e=>{if(!e.alive)return;const dx=e.x-this.player.x,dy=e.y-this.player.y,dist=Math.hypot(dx,dy);if(dist<105&&(dx*this.aim.x+dy*this.aim.y)/dist>0.15){hit++;this.hitEnemy(e,SA.player.damage);}});if(hit) this.burst(this.player.x+this.aim.x*60,this.player.y+this.aim.y*60,0xb76cff,12); }
  hitEnemy(e,damage){ e.hp-=damage;this.showDamage(e.x,e.y-48,damage,false);e.hpbar.width=Math.max(0,48*(e.hp/e.maxHp));this.tweens.add({targets:e,x:e.x-this.aim.x*12,y:e.y-this.aim.y*12,duration:80,yoyo:true});if(e.hp<=0)this.killEnemy(e); }
  killEnemy(e){e.alive=false;SA.quest.kills=Math.min(SA.quest.target,SA.quest.kills+1);SA.player.xp+=Math.floor(e.maxHp*3.5);SA.gold+=48;SA.essence+=1;this.log('Получено: Золото +48','#e6b84d');this.log('Получено: Теневая эссенция +1','#b987ff');this.burst(e.x,e.y,e.isBoss?0xff2f66:0x9a5cff,30);this.tweens.add({targets:e,scale:0,alpha:0,duration:320,onComplete:()=>e.destroy()});this.checkRoom(); }
  checkRoom(){const alive=this.enemies.filter(e=>e.alive);if(alive.length===0&&!this.roomCleared){this.roomCleared=true;if(this.room<3){this.log('Комната очищена — путь открыт','#a78bfa');this.showCenter('КОМНАТА ОЧИЩЕНА');this.spawnPortalDoor();}else{SA.quest.crystals=1;this.showCenter('ЭТАЖ ОЧИЩЕН · ПОРТАЛ АКТИВЕН');this.log('Получен Древний кристалл 1/1','#70d7ff');this.spawnPortalDoor(true);}}}
  spawnPortalDoor(final=false){const g=this.add.graphics().setDepth(3);g.fillStyle(0x3a126d,0.25).fillCircle(1200,180,90);g.lineStyle(6,0xa65cff,0.8).strokeCircle(1200,180,76);g.setInteractive(new Phaser.Geom.Circle(1200,180,80),Phaser.Geom.Circle.Contains);g.on('pointerdown',()=>this.usePortal(final));this.exitPortal=g;}
  updatePortal(t){if(this.exitPortal){this.exitPortal.rotation=Math.sin(t/500)*.03;if(Phaser.Math.Distance.Between(this.player.x,this.player.y,1200,180)<100)this.showCenter('E · ТЕНЕВОЙ ПОРТАЛ');}}
  usePortal(final){ if(final){SA.floor++;SA.room=1;SA.quest.kills=0;this.roomCleared=false;this.spawnRoom();this.player.setPosition(1160,850);this.log('Переход на этаж '+SA.floor,'#c68cff');}else{SA.room++;this.roomCleared=false;this.exitPortal?.destroy();this.spawnRoom();this.player.setPosition(1160,850);}}
  dodge(){const v=this.player.body.velocity;let x=v.x,y=v.y;if(!x&&!y){x=this.aim.x*245;y=this.aim.y*245;}const l=Math.hypot(x,y)||1;this.player.body.setVelocity(x/l*720,y/l*720);this.dodgeUntil=this.time.now+180;this.burst(this.player.x,this.player.y,0x9b5cff,14);this.time.delayedCall(180,()=>{if(this.player.active)this.player.body.setVelocity(0,0);});}
  skill(k){if(this.cooldowns[k]>0)return;const s=SA.skills.find(a=>a.key===k);this.cooldowns[k]=s.cd;if(k==='Q')this.attack(); if(k==='E'){this.enemies.forEach(e=>{if(e.alive&&Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y)<220)this.hitEnemy(e,SA.player.damage*2.2);});this.burst(this.player.x,this.player.y,0x8b45ff,45);this.cameras.main.shake(180,.007);} if(k==='R'){this.enemies.forEach(e=>{if(e.alive&&Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y)<150)this.hitEnemy(e,SA.player.damage*1.6);});this.burst(this.player.x,this.player.y,0xe59cff,65);} if(k==='F'){const p=this.add.circle(this.player.x+this.aim.x*30,this.player.y+this.aim.y*30,8,0xbfdcff,1).setDepth(22);p.vx=this.aim.x*500;p.vy=this.aim.y*500;p.life=1.4;this.projectiles.push(p);} this.log(s.name,'#c9a4ff'); }
  updateProjectiles(d){this.projectiles=this.projectiles.filter(p=>{p.x+=p.vx*d;p.y+=p.vy*d;p.life-=d;let alive=p.life>0&&p.x>40&&p.x<2360&&p.y>40&&p.y<1560;if(alive)this.enemies.forEach(e=>{if(e.alive&&Phaser.Math.Distance.Between(p.x,p.y,e.x,e.y)<38){this.hitEnemy(e,SA.player.damage*1.25);p.life=0;}});if(!alive)p.destroy();return alive;});}
  burst(x,y,color,n){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=40+Math.random()*180,p=this.add.circle(x,y,2+Math.random()*4,color,0.9).setDepth(25);this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,scale:0,duration:300+Math.random()*350,onComplete:()=>p.destroy()});}}
  showDamage(x,y,n,crit){const t=this.add.text(x,y,(crit?'CRIT! ':'-')+Math.floor(n),{fontFamily:'Arial',fontSize:crit?'24px':'17px',fontStyle:'bold',color:crit?'#ffbd43':'#f0d7ff',stroke:'#160a24',strokeThickness:5}).setOrigin(.5).setDepth(40);this.tweens.add({targets:t,y:y-45,alpha:0,duration:650,onComplete:()=>t.destroy()});}
  showCenter(msg){const el=document.getElementById('centerMessage');if(el){el.textContent=msg;el.classList.add('show');clearTimeout(this.msgTimer);this.msgTimer=setTimeout(()=>el.classList.remove('show'),1600);}}
  log(msg,color){const box=document.getElementById('journal');if(!box)return;const row=document.createElement('div');row.innerHTML='<span style="color:'+color+'">◆</span> '+msg;box.prepend(row);while(box.children.length>7)box.lastChild.remove();}
  createUI(){
    const inv=document.getElementById('inventory');document.getElementById('inventoryBtn').onclick=()=>inv.classList.toggle('open');document.getElementById('closeInventory').onclick=()=>inv.classList.remove('open');
    document.getElementById('settingsBtn').onclick=()=>this.showCenter('НАСТРОЙКИ · СИСТЕМА ГОТОВА');document.getElementById('skillsBtn').onclick=()=>this.showCenter('НАВЫКИ: Q E R F');
    const grid=document.getElementById('invGrid');grid.innerHTML='';SA.inventory.forEach(i=>{const d=document.createElement('div');d.className='item';d.innerHTML='<b>'+i[0]+'</b><span>'+i[3]+'</span><small>'+i[1]+'</small>';grid.appendChild(d);});
    this.log('Вы вошли: Подземелье Теней, Этаж 1','#e4b04f');this.log('Получен: Теневая эссенция +3','#a875ff');
  }
  createMinimap(){this.mapG=this.add.graphics().setScrollFactor(0).setDepth(50);}
  updateHUD(){
    const p=SA.player;document.getElementById('hpFill').style.width=(p.hp/p.maxHp*100)+'%';document.getElementById('mpFill').style.width=(p.mp/p.maxMp*100)+'%';document.getElementById('xpFill').style.width=Math.min(100,p.xp/p.next*100)+'%';document.getElementById('levelValue').textContent=p.level;document.getElementById('hpText').textContent=Math.ceil(p.hp)+' / '+p.maxHp;document.getElementById('mpText').textContent=p.mp+' / '+p.maxMp;document.getElementById('goldValue').textContent=pFloor(SA.gold);document.getElementById('gemValue').textContent=pFloor(SA.gems);document.getElementById('essenceValue').textContent=pFloor(SA.essence);document.getElementById('questKills').textContent=SA.quest.kills+'/'+SA.quest.target;document.getElementById('questCrystal').textContent=SA.quest.crystals+'/1';document.getElementById('questSummon').textContent=SA.quest.summons+'/'+SA.quest.summonTarget;document.getElementById('floorValue').textContent='Подземелье Теней · Этаж '+SA.floor;document.getElementById('enemyCount').textContent=this.boss&&this.boss.alive?'ТЁМНЫЙ РЫЦАРЬ · Lv. 28':'Тени в комнате';if(this.boss&&this.boss.alive){document.getElementById('bossPanel').classList.add('show');document.getElementById('bossHp').style.width=(this.boss.hp/this.boss.maxHp*100)+'%';document.getElementById('bossHpText').textContent=Math.max(0,Math.ceil(this.boss.hp)).toLocaleString()+' / '+this.boss.maxHp.toLocaleString();}else document.getElementById('bossPanel').classList.remove('show');SA.skills.forEach(s=>{const el=document.querySelector('[data-skill="'+s.key+'"]');if(el){el.querySelector('.cd').textContent=this.cooldowns[s.key]>0?this.cooldowns[s.key].toFixed(1):'';el.classList.toggle('ready',this.cooldowns[s.key]<=0);}});
  }
  layout(){const z=Math.min(window.innerWidth/1150,window.innerHeight/720);this.cameras.main.setZoom(Math.max(.72,Math.min(1.25,z)));}
}
function pFloor(n){return Math.floor(n).toLocaleString('ru-RU');}
window.addEventListener('load',()=>{window.SA_GAME=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:window.innerWidth,height:window.innerHeight,backgroundColor:'#050711',physics:{default:'arcade',arcade:{debug:false,gravity:{x:0,y:0}}},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[ShadowScene]});});
