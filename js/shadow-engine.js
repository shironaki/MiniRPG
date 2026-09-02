/* Shadow Ascension — stable Phaser runtime
   This file intentionally keeps the browser prototype isolated from the Unity project.
*/
const SA = {
  floor: 1,
  room: 1,
  gold: 328450,
  gems: 1240,
  essence: 56,
  player: { level: 32, hp: 4820, maxHp: 4820, mp: 1240, maxMp: 1240, xp: 48750, next: 73200, damage: 260 },
  quest: { kills: 12, target: 20, crystals: 0, summons: 3, summonTarget: 5 },
  inventory: [
    ['⚔','Теневой клинок','Оружие',1], ['🛡','Доспех Тени','Экипировка',1], ['♜','Перчатки охотника','Экипировка',3],
    ['💎','Теневая эссенция','Материал',3], ['🔵','Зелье маны','Расходник',3], ['📦','Древний сундук','Материал',1],
    ['🧪','Зелье HP','Расходник',3], ['🟣','Тёмная сфера','Материал',3], ['🔥','Пламя бездны','Материал',3],
    ['💠','Кристалл портала','Материал',1], ['🟪','Осколок тени','Материал',24], ['🟩','Зелёный кристалл','Материал',3], ['⬜','Лунный осколок','Материал',12]
  ]
};

class ShadowScene extends Phaser.Scene {
  constructor(){ super('ShadowScene'); }

  create(){
    this.cameras.main.setBackgroundColor('#050711');
    this.physics.world.setBounds(0,0,2400,1600);
    this.walls = this.physics.add.staticGroup();
    this.enemies = [];
    this.projectiles = [];
    this.cooldowns = {Q:0,E:0,R:0,F:0};
    this.invulnerableUntil = 0;
    this.roomCleared = false;
    this.boss = null;
    this.buildFloor();
    this.createPlayer();
    this.createInput();
    this.createUI();
    this.createMinimap();
    this.spawnRoom();
    this.cameras.main.startFollow(this.player, true, 0.10, 0.10);
    this.cameras.main.setZoom(Math.min(window.innerWidth / 1150, window.innerHeight / 720));
    this.scale.on('resize', () => this.layout());
    this.layout();
    this.log('Система запущена. Добро пожаловать в Подземелье Теней.');
  }

  buildFloor(){
    const g = this.add.graphics();
    g.fillStyle(0x080a13,1).fillRect(0,0,2400,1600);
    for(let y=80;y<1520;y+=64){
      for(let x=80;x<2320;x+=64){
        const n=((x/64+y/64)%3);
        g.fillStyle(n===0?0x171a29:n===1?0x141827:0x101421,1).fillRect(x,y,61,61);
        g.lineStyle(1,0x272a3b,0.55).strokeRect(x,y,61,61);
      }
    }
    for(let i=0;i<32;i++){
      const x=100+((i*173)%2200), y=100+((i*257)%1400);
      g.lineStyle(2,0x6d35c9,0.16).lineBetween(x,y,x+18,y+8);
    }
    [[20,20,2360,60],[20,1520,2360,60],[20,20,60,1560],[2320,20,60,1560],
     [390,260,260,55],[820,260,260,55],[1280,260,360,55],[1750,260,400,55],
     [390,1220,260,55],[820,1220,260,55],[1280,1220,360,55],[1750,1220,400,55],
     [650,420,55,300],[650,820,55,300],[1260,420,55,300],[1260,820,55,300],
     [1740,420,55,300],[1740,820,55,300]].forEach(a=>this.addWall(...a));
    this.drawPortal(1200,180);
    [[130,450],[330,900],[820,150],[1100,1400],[1540,150],[2020,900],[2150,450]].forEach(p=>this.drawBrazier(...p));
    [[250,1350],[1160,1350],[1960,1350],[2200,1150]].forEach(p=>this.drawCrystal(...p));
  }

  addWall(x,y,w,h){
    const g=this.add.graphics();
    g.fillStyle(0x0b0e19,1).fillRoundedRect(x,y,w,h,8);
    g.lineStyle(3,0x343750,1).strokeRoundedRect(x,y,w,h,8);
    g.lineStyle(1,0x8051d8,0.25).strokeRoundedRect(x+5,y+5,w-10,h-10,5);
    const body=this.walls.create(x+w/2,y+h/2,null);
    body.setSize(w,h).setVisible(false);
  }

  drawBrazier(x,y){
    const g=this.add.graphics();
    g.fillStyle(0x101525,1).fillCircle(x,y,18);
    g.lineStyle(2,0x38405c,1).strokeCircle(x,y,18);
    g.fillStyle(0x6b2aff,0.35).fillCircle(x,y-12,27);
    g.fillStyle(0x8fc7ff,0.9).fillTriangle(x,y-29,x-8,y-6,x+8,y-6);
  }

  drawCrystal(x,y){
    const g=this.add.graphics();
    g.fillStyle(0x5125a0,0.25).fillCircle(x,y,30);
    g.fillStyle(0x39208b,1).fillTriangle(x,y-28,x-12,y+18,x+14,y+12);
    g.fillStyle(0x9a54ff,0.9).fillTriangle(x,y-22,x-6,y+8,x+8,y+5);
  }

  drawPortal(x,y){
    this.portalX=x; this.portalY=y;
    this.portalG=this.add.graphics().setDepth(2);
    this.portalG.lineStyle(8,0x6b22ff,0.8).strokeEllipse(x,y,130,170);
    this.portalG.lineStyle(3,0xd08cff,0.9).strokeEllipse(x,y,108,148);
    this.portalG.fillStyle(0x4b13a8,0.18).fillEllipse(x,y,105,145);
    for(let i=0;i<14;i++){
      const a=i*Math.PI*2/14;
      this.portalG.fillStyle(0xa65cff,0.9).fillCircle(x+55*Math.cos(a),y+72*Math.sin(a),4);
    }
  }

  createPlayer(){
    const c=this.add.container(1160,850).setDepth(20);
    this.player=c;
    const glow=this.add.circle(0,4,38,0x7c2cff,0.16);
    const shadow=this.add.ellipse(0,28,52,18,0x000000,0.65);
    const cloak=this.add.polygon(0,10,[-20,-4,-12,28,0,38,16,28,23,-3],0x111321,1).setStrokeStyle(2,0x5631a2);
    const body=this.add.rectangle(0,2,24,38,0x171827).setStrokeStyle(1,0x5e3caa);
    const head=this.add.circle(0,-24,13,0xc99a82);
    const hair=this.add.polygon(0,-30,[-14,-28,-9,-42,0,-35,8,-44,15,-25,5,-30],0x070914,1);
    const eye=this.add.rectangle(7,-24,5,2,0xa56bff);
    const blade=this.add.rectangle(29,4,7,62,0xeeeaff).setAngle(-38).setStrokeStyle(2,0x8e5cff);
    c.add([glow,shadow,cloak,body,head,hair,eye,blade]);
    c.setSize(32,48);
    this.physics.add.existing(c);
    c.body.setCircle(18,-18,-1);
    c.body.setCollideWorldBounds(true);
    this.physics.add.collider(c,this.walls);
    this.playerVisual={glow,blade};
  }

  createInput(){
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,Q,E,R,F');
    this.aim={x:1,y:0};
    this.input.on('pointerdown',p=>{ if(p.y<window.innerHeight*0.82) this.aimAt(p.worldX,p.worldY); });
    this.input.on('pointermove',p=>{ if(p.isDown) this.aimAt(p.worldX,p.worldY); });
    window.SA_FIRE=()=>this.attack();
    window.SA_DODGE=()=>this.dodge();
    window.SA_SKILL=k=>this.skill(k);
  }

  aimAt(x,y){
    const dx=x-this.player.x,dy=y-this.player.y,l=Math.hypot(dx,dy)||1;
    this.aim.x=dx/l; this.aim.y=dy/l;
  }

  spawnRoom(){
    this.clearEnemies();
    const positions=this.room===3
      ? [[1850,650],[1980,700],[2100,640],[2010,820]]
      : this.room===2
      ? [[760,620],[880,760],[1020,620],[1450,720]]
      : [[760,560],[900,700],[1040,560],[1480,620],[1650,720]];
    positions.forEach((p,i)=>this.spawnEnemy(p[0],p[1],i%3));
    if(this.room===3){
      this.spawnBoss(1950,1000);
      this.showCenter('ТЁМНЫЙ РЫЦАРЬ · ЭЛИТНЫЙ БОСС');
    } else {
      this.showCenter('ПОДЗЕМЕЛЬЕ ТЕНЕЙ · ЭТАЖ '+SA.floor);
    }
  }

  spawnEnemy(x,y,type){
    const data=[
      ['Теневая тварь',420,85,28,0x30324c],
      ['Теневой охотник',300,120,22,0x4d315e],
      ['Теневой маг',350,65,35,0x263d62]
    ][type];
    const c=this.add.container(x,y).setDepth(15);
    const glow=this.add.circle(0,0,34,data[4],0.13);
    const body=this.add.polygon(0,8,[-25,-4,-15,30,0,38,17,27,25,-5],data[4],1).setStrokeStyle(2,0x6f54c0);
    const head=this.add.circle(0,-17,14,0x161726);
    const eyes=this.add.rectangle(6,-18,8,3,0xff335f);
    const hpbg=this.add.rectangle(0,-43,48,5,0x170c16);
    const hp=this.add.rectangle(-24,-43,48,5,0x45d7a0).setOrigin(0,0.5);
    c.add([glow,body,head,eyes,hpbg,hp]); c.setSize(42,50);
    this.physics.add.existing(c); c.body.setCircle(20,-20,-2); c.body.setCollideWorldBounds(true);
    c.hp=data[1]; c.maxHp=data[1]; c.speed=data[2]; c.damage=data[3]; c.hpbar=hp;
    c.attackCD=0; c.alive=true; c.isBoss=false; c.name=data[0];
    this.physics.add.collider(c,this.walls);
    this.enemies.push(c);
  }

  spawnBoss(x,y){
    const c=this.add.container(x,y).setDepth(16);
    const aura=this.add.circle(0,0,70,0x9b174f,0.16);
    const body=this.add.polygon(0,10,[-38,-10,-28,50,0,70,30,48,42,-12],0x151624,1).setStrokeStyle(3,0xff304f);
    const helm=this.add.circle(0,-34,27,0x202235).setStrokeStyle(3,0x7d2945);
    const eye=this.add.rectangle(0,-34,22,5,0xff263f);
    const sword=this.add.rectangle(47,15,10,100,0xd9e3ff).setAngle(-35).setStrokeStyle(2,0xff4568);
    const hpbg=this.add.rectangle(0,-88,100,8,0x190914);
    const hp=this.add.rectangle(-50,-88,100,8,0xf22d45).setOrigin(0,0.5);
    c.add([aura,body,helm,eye,sword,hpbg,hp]); c.setSize(64,86);
    this.physics.add.existing(c); c.body.setCircle(30,-30,-8); c.body.setCollideWorldBounds(true);
    c.hp=5120; c.maxHp=5120; c.speed=52; c.damage=95; c.attackCD=0; c.hpbar=hp; c.alive=true; c.isBoss=true; c.name='Тёмный Рыцарь';
    this.physics.add.collider(c,this.walls);
    this.enemies.push(c); this.boss=c;
  }

  clearEnemies(){ this.enemies.forEach(e=>e.destroy()); this.enemies=[]; this.boss=null; }

  update(t,dt){
    const d=dt/1000;
    Object.keys(this.cooldowns).forEach(k=>this.cooldowns[k]=Math.max(0,this.cooldowns[k]-d));
    let x=(this.keys.D.isDown||this.keys.RIGHT.isDown?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown?1:0);
    let y=(this.keys.S.isDown||this.keys.DOWN.isDown?1:0)-(this.keys.W.isDown||this.keys.UP.isDown?1:0);
    const l=Math.hypot(x,y)||1;
    if(x||y){ x/=l; y/=l; this.player.body.setVelocity(x*245,y*245); this.playerVisual.glow.alpha=0.12+Math.sin(t/90)*0.04; }
    else this.player.body.setVelocity(0,0);
    if(Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.dodge();
    ['Q','E','R','F'].forEach(k=>{if(Phaser.Input.Keyboard.JustDown(this.keys[k]))this.skill(k);});
    this.enemies.forEach(e=>this.updateEnemy(e,d));
    this.updateProjectiles(d);
    this.updatePortal(t);
    this.updateHUD();
  }

  updateEnemy(e,d){
    if(!e.alive) return;
    const dx=this.player.x-e.x,dy=this.player.y-e.y,dist=Math.hypot(dx,dy)||1;
    if(dist<700) e.body.setVelocity(dx/dist*e.speed,dy/dist*e.speed); else e.body.setVelocity(0,0);
    e.attackCD=Math.max(0,e.attackCD-d);
    if(dist<60&&e.attackCD<=0){ e.attackCD=e.isBoss?1.2:1.5; this.damagePlayer(e.damage); this.burst(e.x,e.y,0xff304f,7); }
  }

  damagePlayer(n){
    if(this.time.now<this.invulnerableUntil) return;
    SA.player.hp=Math.max(0,SA.player.hp-n);
    this.log('Получен урон: -'+n);
    if(SA.player.hp<=0){ SA.player.hp=SA.player.maxHp; this.player.setPosition(1160,850); this.log('Вы были повержены и возвращены в зал.'); }
  }

  attack(){
    const now=this.time.now;
    if(this.attackUntil&&now<this.attackUntil)return;
    this.attackUntil=now+350;
    const reach=125, width=62;
    this.playerVisual.blade.setAngle(-55);
    this.tweens.add({targets:this.playerVisual.blade,angle:-38,duration:140,ease:'Quad.Out'});
    this.burst(this.player.x+this.aim.x*65,this.player.y+this.aim.y*65,0xa65cff,10);
    this.enemies.slice().forEach(e=>{
      if(!e.alive)return;
      const dx=e.x-this.player.x,dy=e.y-this.player.y,dist=Math.hypot(dx,dy);
      if(dist<=reach && Math.abs((dx*this.aim.x+dy*this.aim.y)/Math.max(dist,1))>=Math.cos(width*Math.PI/180)) this.hitEnemy(e,SA.player.damage,false);
    });
  }

  skill(k){
    const cds={Q:1.8,E:12.6,R:4.2,F:1.0};
    if(!cds[k]||this.cooldowns[k]>0)return;
    this.cooldowns[k]=cds[k];
    const damage={Q:420,E:900,R:700,F:520}[k];
    if(k==='F'){
      const p=this.add.circle(this.player.x,this.player.y,9,0x72b8ff,1).setDepth(18);
      p.vx=this.aim.x*520; p.vy=this.aim.y*520; p.life=1.8; this.projectiles.push(p);
    } else {
      const radius={Q:130,E:210,R:175}[k];
      this.burst(this.player.x,this.player.y,k==='R'?0xd58cff:0x8d45ff,k==='E'?34:24);
      this.enemies.slice().forEach(e=>{if(e.alive&&Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y)<=radius)this.hitEnemy(e,damage,k==='E');});
    }
    SA.player.mp=Math.max(0,SA.player.mp-({Q:35,E:120,R:80,F:45}[k]||0));
  }

  dodge(){
    if(this.time.now<this.invulnerableUntil)return;
    let dx=this.aim.x,dy=this.aim.y;
    const speed=720;
    this.invulnerableUntil=this.time.now+320;
    this.player.body.setVelocity(dx*speed,dy*speed);
    this.tweens.add({targets:this.playerVisual.glow,alpha:0.5,duration:80,yoyo:true});
    this.time.delayedCall(220,()=>{if(this.player&&this.player.body)this.player.body.setVelocity(0,0);});
  }

  hitEnemy(e,damage,crit){
    if(!e.alive)return;
    const actual=crit?Math.round(damage*1.5):damage;
    e.hp=Math.max(0,e.hp-actual);
    e.hpbar.width=48*(e.hp/e.maxHp);
    if(e.isBoss) e.hpbar.width=100*(e.hp/e.maxHp);
    this.damageText(e.x,e.y-55,actual,crit);
    this.burst(e.x,e.y,crit?0xffd56a:0x9b5cff,crit?16:8);
    if(e.hp<=0)this.killEnemy(e);
  }

  killEnemy(e){
    e.alive=false; e.body.setVelocity(0,0); SA.player.xp+=80; SA.quest.kills++;
    this.log('Побеждён: '+e.name+'  ·  +80 XP');
    if(e.isBoss){ this.log('Элитный босс повержен! Портал разблокирован.'); this.showCenter('ТЁМНЫЙ РЫЦАРЬ ПОВЕРЖЕН'); }
    this.tweens.add({targets:e,alpha:0,scale:0.2,duration:280,onComplete:()=>e.destroy()});
  }

  updateProjectiles(d){
    this.projectiles=this.projectiles.filter(p=>{
      if(!p.active)return false;
      p.x+=p.vx*d; p.y+=p.vy*d; p.life-=d;
      this.enemies.slice().forEach(e=>{if(e.alive&&Phaser.Math.Distance.Between(p.x,p.y,e.x,e.y)<38){this.hitEnemy(e,520,false);p.life=0;}});
      if(p.life<=0){p.destroy();return false;} return true;
    });
  }

  updatePortal(t){
    if(this.portalG)this.portalG.rotation=Math.sin(t/900)*0.015;
    const remaining=this.enemies.filter(e=>e.alive).length;
    if(remaining===0&&!this.roomCleared){
      this.roomCleared=true; this.showCenter('КОМНАТА ОЧИЩЕНА · ИЩИТЕ ПОРТАЛ'); this.log('Комната очищена. Подойдите к порталу.');
    }
    if(this.roomCleared&&Phaser.Math.Distance.Between(this.player.x,this.player.y,this.portalX,this.portalY)<100){
      this.roomCleared=false; this.room=Math.min(3,this.room+1); this.spawnRoom();
    }
  }

  createUI(){
    this.dom={
      hp:document.getElementById('hpFill'),hpText:document.getElementById('hpText'),mp:document.getElementById('mpFill'),mpText:document.getElementById('mpText'),
      xp:document.getElementById('xpFill'),level:document.getElementById('levelValue'),gold:document.getElementById('goldValue'),gem:document.getElementById('gemValue'),essence:document.getElementById('essenceValue'),
      questKills:document.getElementById('questKills'),questCrystal:document.getElementById('questCrystal'),questSummon:document.getElementById('questSummon'),floor:document.getElementById('floorValue'),
      journal:document.getElementById('journal'),bossPanel:document.getElementById('bossPanel'),bossHp:document.getElementById('bossHp'),bossHpText:document.getElementById('bossHpText'),center:document.getElementById('centerMessage'),enemyCount:document.getElementById('enemyCount')
    };
    if(this.dom.bossPanel)this.dom.bossPanel.style.display='none';
    const inv=document.getElementById('invGrid');
    if(inv){inv.innerHTML='';SA.inventory.forEach(i=>{const d=document.createElement('div');d.className='slot';d.innerHTML='<b>'+i[0]+'</b><small>'+i[1]+'</small><em>'+i[3]+'</em>';inv.appendChild(d);});}
    const ib=document.getElementById('inventoryBtn'),ci=document.getElementById('closeInventory');
    if(ib)ib.onclick=()=>{const x=document.getElementById('inventory');if(x)x.classList.toggle('open');};
    if(ci)ci.onclick=()=>{const x=document.getElementById('inventory');if(x)x.classList.remove('open');};
  }

  createMinimap(){ this.minimap=this.add.graphics().setDepth(100); }

  updateHUD(){
    const p=SA.player;
    const set=(el,v)=>{if(el)el.style.width=v+'%';};
    set(this.dom.hp,100*p.hp/p.maxHp); set(this.dom.mp,100*p.mp/p.maxMp); set(this.dom.xp,100*(p.xp%p.next)/p.next);
    if(this.dom.hpText)this.dom.hpText.textContent=p.hp+' / '+p.maxHp;
    if(this.dom.mpText)this.dom.mpText.textContent=p.mp+' / '+p.maxMp;
    if(this.dom.level)this.dom.level.textContent=p.level;
    if(this.dom.gold)this.dom.gold.textContent=SA.gold.toLocaleString('ru-RU');
    if(this.dom.gem)this.dom.gem.textContent=SA.gems.toLocaleString('ru-RU');
    if(this.dom.essence)this.dom.essence.textContent=SA.essence;
    if(this.dom.questKills)this.dom.questKills.textContent=Math.min(SA.quest.kills,SA.quest.target)+'/'+SA.quest.target;
    if(this.dom.questCrystal)this.dom.questCrystal.textContent=SA.quest.crystals+'/1';
    if(this.dom.questSummon)this.dom.questSummon.textContent=SA.quest.summons+'/'+SA.quest.summonTarget;
    if(this.dom.floor)this.dom.floor.textContent='Подземелье Теней · Этаж '+SA.floor;
    if(this.dom.enemyCount)this.dom.enemyCount.textContent=this.enemies.filter(e=>e.alive).length;
    if(this.dom.bossPanel&&this.boss&&this.boss.alive){this.dom.bossPanel.style.display='flex';set(this.dom.bossHp,100*this.boss.hp/this.boss.maxHp);if(this.dom.bossHpText)this.dom.bossHpText.textContent=this.boss.hp+' / '+this.boss.maxHp;}else if(this.dom.bossPanel)this.dom.bossPanel.style.display='none';
    document.querySelectorAll('.skill').forEach(el=>{const k=el.dataset.skill,cd=this.cooldowns[k]||0;const c=el.querySelector('.cd');if(c)c.textContent=cd>0?cd.toFixed(1):'';});
  }

  damageText(x,y,n,crit){
    const t=this.add.text(x,y,(crit?'CRIT ':'')+n,{fontFamily:'Arial',fontSize:crit?'24px':'18px',fontStyle:'bold',color:crit?'#ffd56a':'#d9c4ff',stroke:'#090612',strokeThickness:5}).setOrigin(0.5).setDepth(120);
    this.tweens.add({targets:t,y:y-45,alpha:0,duration:650,onComplete:()=>t.destroy()});
  }

  burst(x,y,color,count){
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2,s=60+Math.random()*150;
      const p=this.add.circle(x,y,2+Math.random()*3,color,0.85).setDepth(90);
      this.tweens.add({targets:p,x:x+Math.cos(a)*s,y:y+Math.sin(a)*s,alpha:0,duration:280+Math.random()*300,onComplete:()=>p.destroy()});
    }
  }

  showCenter(msg){
    if(!this.dom||!this.dom.center)return;
    this.dom.center.textContent=msg; this.dom.center.style.opacity='1';
    clearTimeout(this.centerTimer); this.centerTimer=setTimeout(()=>{if(this.dom.center)this.dom.center.style.opacity='0';},1800);
  }

  log(msg){
    const j=document.getElementById('journal'); if(!j)return;
    const line=document.createElement('div'); line.textContent='› '+msg; j.prepend(line);
    while(j.children.length>12)j.removeChild(j.lastChild);
  }

  layout(){
    const z=Math.min(window.innerWidth/1150,window.innerHeight/720);
    if(this.cameras&&this.cameras.main)this.cameras.main.setZoom(Math.max(0.55,Math.min(1.25,z)));
  }
}

window.addEventListener('load',()=>{
  if(typeof Phaser==='undefined') throw new Error('Phaser не загрузился. Проверь интернет/CDN.');
  const config={type:Phaser.AUTO,parent:'game',width:window.innerWidth,height:window.innerHeight,backgroundColor:'#050711',physics:{default:'arcade',arcade:{debug:false}},scene:[ShadowScene],scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH}};
  window.SA_GAME=new Phaser.Game(config);
});
