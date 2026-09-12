const game=document.getElementById("game"),brush=document.getElementById("brush"),moodEl=document.getElementById("mood"),cleanEl=document.getElementById("clean"),text=document.getElementById("text"),dialogue=document.querySelector(".dialogue");
let dragging=false,last={x:0,y:0},clean=18,mood=48,speed=0,dialogueIndex=0;
const lines=[
"안녕... 오늘은 머리 좀 빗어줄래?",
"응... 천천히 해줘. 머리가 길어서 잘 엉키거든.",
"아... 거기 조금 엉켰어. 살살 부탁할게!",
"우와, 머릿결이 점점 부드러워지고 있어.",
"헤헤... 기분 좋아.",
"이렇게 정성스럽게 빗어주는 사람은 처음이야.",
"조금만 더 빗으면 완벽할 것 같아!",
"와아... 다 됐다! 정말 고마워 ♡"
];
function stats(){cleanEl.style.width=Math.min(clean,100)+"%";moodEl.style.width=Math.min(mood,100)+"%"}stats();
function pos(e){let r=game.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function hairZone(x,y){let r=game.getBoundingClientRect(),nx=x/r.width,ny=y/r.height;return (nx>.18&&nx<.72&&ny>.17&&ny<.82)}
function sparkle(x,y){let s=document.createElement("div");s.className="spark";s.textContent=Math.random()>.5?"✦":"✧";s.style.left=x+"px";s.style.top=y+"px";game.appendChild(s);setTimeout(()=>s.remove(),550)}
function trail(x,y){let t=document.createElement("div");t.className="brush-trail";t.style.left=x+"px";t.style.top=y+"px";game.appendChild(t);setTimeout(()=>t.remove(),500)}
function say(){text.textContent=lines[Math.min(dialogueIndex,lines.length-1)];dialogueIndex++;if(dialogueIndex>=lines.length)dialogueIndex=0}
dialogue.addEventListener("click",say);
function down(e){e.preventDefault();dragging=true;let p=pos(e);last=p;brush.setPointerCapture?.(e.pointerId)}
function move(e){if(!dragging)return;e.preventDefault();let p=pos(e),dx=p.x-last.x,dy=p.y-last.y;speed=Math.hypot(dx,dy);brush.style.left=p.x-brush.offsetWidth/2+"px";brush.style.top=p.y-brush.offsetHeight/2+"px";let on=hairZone(p.x,p.y);
if(on){brush.classList.add("brushing");sparkle(p.x,p.y);trail(p.x,p.y);if(speed>20){mood=Math.max(0,mood-1);text.textContent="아앗! 너무 빨라... 천천히 해줘!";}else{clean=Math.min(100,clean+.8);mood=Math.min(100,mood+.25);if(Math.random()<.035)say();}stats()}last=p}
function up(e){dragging=false;brush.classList.remove("brushing");brush.releasePointerCapture?.(e.pointerId)}
brush.addEventListener("pointerdown",down);brush.addEventListener("pointermove",move);brush.addEventListener("pointerup",up);brush.addEventListener("pointercancel",up);



const form=document.getElementById("guestForm"),list=document.getElementById("guestList");
function render(){list.innerHTML="";let data=JSON.parse(localStorage.getItem("mikuGuestbook")||"[]");data.slice().reverse().forEach(x=>{let d=document.createElement("div");d.className="entry";d.innerHTML=`<b>${escapeHtml(x.name)}</b><p>${escapeHtml(x.msg)}</p>`;list.appendChild(d)})}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
form.addEventListener("submit",e=>{e.preventDefault();let n=document.getElementById("guestName").value.trim(),m=document.getElementById("guestMessage").value.trim();if(!n||!m)return;let data=JSON.parse(localStorage.getItem("mikuGuestbook")||"[]");data.push({name:n,msg:m});localStorage.setItem("mikuGuestbook",JSON.stringify(data));form.reset();render()});render();

document.getElementById("soundBtn").addEventListener("click",()=>{document.getElementById("soundBtn").textContent=document.getElementById("soundBtn").textContent.includes("ON")?"♫ OFF":"♫ ON"});
// 눈 깜빡임: 캐릭터 원본 이미지 위에서 눈 영역을 직접 가릴 수 있도록 작은 애니메이션 레이어를 사용.
const blink=document.createElement("div");blink.style.cssText="position:absolute;left:50%;top:40.2%;width:72px;height:6px;transform:translateX(-50%);z-index:4;pointer-events:none;opacity:0;border-radius:50%;background:#bfeaf0;filter:blur(1px);";game.appendChild(blink);
function doBlink(){blink.animate([{opacity:0},{opacity:.82,offset:.45},{opacity:0}],{duration:180,easing:"ease-in-out"});setTimeout(doBlink,2500+Math.random()*4200)}setTimeout(doBlink,1800);
