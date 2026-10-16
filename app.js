const A=window.ARTICLES,C=window.CATEGORIES,$=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slugify=t=>t.toLowerCase().replace(/&/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const findCat=k=>{k=slugify(decodeURIComponent(k||""));return C.find(c=>c.id===k||slugify(c.name)===k||slugify(c.name).startsWith(k+"-"))};
const cat=id=>C.find(c=>c.id===id)||{name:id};
const ls={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const user=()=>ls.get("witw_user",null),uid=()=>user()?user().id:"guest";
const favs=()=>ls.get("witw_favs_"+uid(),[]);
function toggleFav(slug){let f=favs();f=f.includes(slug)?f.filter(s=>s!==slug):[...f,slug];ls.set("witw_favs_"+uid(),f);route()}
function toggleNav(){const n=$("#nav"),o=n.classList.toggle("open");$(".burger").setAttribute("aria-expanded",o)}
const fmt=d=>new Date(d).toLocaleDateString("en",{year:"numeric",month:"long",day:"numeric"});
const cover=a=>`<div class="cover" style="background:linear-gradient(135deg,hsl(${a.hue},35%,28%),hsl(${a.hue+30},40%,48%))">${a.glyph}${a.img?`<img src="${esc(a.img)}" alt="" loading="lazy" onerror="this.remove()">`:""}</div>`;
const portrait=p=>`<div class="pt">${esc(p.name[0])}<img src="${wiki(p.img)}" alt="Portrait of ${esc(p.name)}" loading="lazy" onerror="this.remove()"></div>`;
const card=(a,big)=>`<article class="card ${big?"big":""}"><button class="fav ${favs().includes(a.slug)?"on":""}" aria-label="Toggle favorite" onclick="toggleFav('${a.slug}')">${favs().includes(a.slug)?"★":"☆"}</button><a href="#/article/${a.slug}">${cover(a)}<div class="in"><div class="cat">${esc(cat(a.cat).name)}</div><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p><div class="meta">${esc(a.author)} · ${fmt(a.date)} · ${a.mins} min read</div></div></a></article>`;
const CI={philosophy:"the-socratic-method",facts:"surprising-facts-about-earth",space:"how-do-stars-form",physics:"why-does-time-move-forward",chemistry:"periodic-table",biology:"evolution-biodiversity",history:"ancient-egypt",minds:"marie-curie",inventions:"history-of-the-telescope"};
const cat2old=id=>{const c=C.find(x=>x.id===id);return`<a class="card" href="#/category/${c.id}"><div class="in"><span class="ic">${c.icon}</span><h3>${c.name}</h3><p class="meta">${c.desc}</p></div></a>`};
const cat2=id=>{const c=C.find(x=>x.id===id),a=A.find(x=>x.slug===CI[id]),h=({space:25,physics:210,chemistry:175,biology:110,history:40,philosophy:270,minds:340,inventions:230,facts:15})[id]||30;
return`<a class="cc" href="#/category/${c.id}" style="background:linear-gradient(135deg,hsl(${h},35%,26%),hsl(${h+30},40%,44%))"><span class="ic">${c.icon}</span>${a&&a.img?`<img src="${esc(a.img)}" alt="" loading="lazy" onerror="this.remove()">`:""}<span class="ov"></span><span class="tx"><b>${c.name}</b><small>${c.desc}</small></span></a>`};
const grid=l=>l.length?`<div class="grid">${l.map(a=>card(a)).join("")}</div>`:`<div class="empty"><h2>Nothing here yet</h2><p>Try another category or search.</p></div>`;
const byNew=l=>[...l].sort((a,b)=>b.date.localeCompare(a.date));
function search(q){q=q.toLowerCase().trim();if(!q)return[];return A.map(a=>{let s=0;const t=(x,w)=>{if(String(x).toLowerCase().includes(q))s+=w};
t(a.title,5);t(a.tags.join(" "),4);t(a.author,2);t(cat(a.cat).name,3);t(a.excerpt,2);t(a.body.replace(/<[^>]+>/g," "),1);return{a,s}}).filter(r=>r.s).sort((x,y)=>y.s-x.s).map(r=>r.a)}
function doSearch(e){e.preventDefault();location.hash="#/search/"+encodeURIComponent($("#q").value);$("#sug").innerHTML="";return false}
$("#q").addEventListener("input",e=>{const r=search(e.target.value).slice(0,5);$("#sug").innerHTML=r.map(a=>`<a href="#/article/${a.slug}" onclick="$('#sug').innerHTML=''">${esc(a.title)}</a>`).join("")});
const pages={
home(){const f=A.find(a=>a.featured)||A[0],ids=["space","physics","chemistry","biology","history","philosophy","minds","inventions","facts"];
return`<section class="herop" style="background-image:linear-gradient(rgba(43,25,18,.55),rgba(43,25,18,.88)),url('${HERO}')"><div><div class="kick">A magazine of ideas</div><h1>Discover the World Beyond What You Know.</h1><p>Explore the ideas, discoveries, people, and mysteries that shape our understanding of the universe.</p><a class="btn gold" href="#/explore">Start exploring</a></div></section>
<h2 class="sh">Featured Story</h2><article class="feat"><button class="fav ${favs().includes(f.slug)?"on":""}" aria-label="Toggle favorite" onclick="toggleFav('${f.slug}')">${favs().includes(f.slug)?"★":"☆"}</button>${cover(f)}<div class="in"><div class="cat">${esc(cat(f.cat).name)}</div><h2>${esc(f.title)}</h2><p>${esc(f.excerpt)}</p><p class="meta">${esc(f.author)} · ${fmt(f.date)} · ${f.mins} min read</p><a class="btn" href="#/article/${f.slug}">Read Article</a></div></article>
<h2 class="sh">Explore Categories</h2><div class="ccs">${ids.map(id=>cat2(id)).join("")}</div>
<h2 class="sh">Great Minds</h2><div class="sci">${SCIENTISTS.map(p=>`<div class="card">${portrait(p)}<div class="in"><h3>${p.name}</h3><div class="meta">${p.years}</div><p>${p.bio}</p><a href="#/article/${p.link}">Read related article →</a></div></div>`).join("")}</div>
<h2 class="sh">Latest Articles</h2><div class="grid grid3">${byNew(A).filter(a=>a.slug!==f.slug).slice(0,6).map(a=>card(a)).join("")}</div>
<h2 class="sh">Editor's Picks</h2><div class="picks">${[...A].filter(a=>a.slug!==f.slug).sort((x,y)=>y.pop-x.pop).slice(0,3).map(a=>card(a)).join("")}</div>`},
explore(){return`<h1>Explore</h1>${grid(byNew(A))}`},
categories(){return`<h1>Categories</h1><div class="grid">${C.map(c=>`<a class="card" href="#/category/${c.id}"><div class="in"><div style="font-size:1.8rem;color:var(--caramel)">${c.icon}</div><h3>${c.name}</h3><p class="meta">${c.desc} (${A.filter(a=>a.cat===c.id).length})</p></div></a>`).join("")}</div>`},
category(id,p){const c=findCat(id);if(!c)return pages.nf();const sort=new URLSearchParams(p).get("sort")||"new";id=c.id;let l=A.filter(a=>a.cat===id);l=sort=="pop"?[...l].sort((a,b)=>b.pop-a.pop):byNew(l);
const tags=[...new Set(l.flatMap(a=>a.tags))];
return`<section class="hero"><div class="cat">Category</div><h1>${c.icon} ${c.name}</h1><p class="sub">${c.desc}</p></section><label>Sort: <select onchange="location.hash='#/category/${id}?sort='+this.value"><option value="new" ${sort=="new"?"selected":""}>Newest</option><option value="pop" ${sort=="pop"?"selected":""}>Most popular</option></select></label>${l.length?`<p class="meta">${l.length} article${l.length==1?"":"s"}</p>${grid(l)}`:`<div class="empty"><h2>New articles are on the way</h2><p>We have not published any articles in ${c.name} yet. Meanwhile, try these related areas or search the whole library.</p><p>${C.filter(x=>x.id!==id&&A.some(a=>a.cat===x.id)).slice(0,4).map(x=>`<a class="tag" href="#/category/${x.id}">${x.name}</a>`).join("")}</p><a class="btn" href="#/explore">Browse all articles</a></div>`}<p>${tags.map(t=>`<a class="tag" href="#/search/${encodeURIComponent(t)}">${esc(t)}</a>`).join("")}</p><p>Other categories: ${C.filter(x=>x.id!==id).slice(0,5).map(x=>`<a href="#/category/${x.id}">${x.name}</a>`).join(" · ")}</p>`},
article(slug){const i=A.findIndex(a=>a.slug===slug);if(i<0)return pages.nf();const a=A[i];document.title=a.title+" — What Is This World?";
const heads=[...a.body.matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1]);let n=0;const body=a.body.replace(/<h2>/g,()=>`<h2 id="s${n++}">`);
const rel=A.filter(x=>x.slug!==slug&&(x.cat===a.cat||x.tags.some(t=>a.tags.includes(t)))).slice(0,3),on=favs().includes(slug);
return`<div class="art"><div class="cat">${esc(cat(a.cat).name)}</div><h1>${esc(a.title)}</h1><p class="sub">${esc(a.sub)}</p><p class="meta">By ${esc(a.author)} · ${fmt(a.date)} · ${a.mins} min read</p>
<p><button class="btn" onclick="toggleFav('${slug}')">${on?"★ Saved":"☆ Save"}</button> <button class="btn" onclick="share('${slug}')">Share</button> <span id="shmsg" class="small"></span></p>${cover(a)}
${heads.length>1?`<nav class="toc" aria-label="Contents"><strong>Contents</strong><ol>${heads.map((h,k)=>`<li><a href="#" onclick="document.getElementById('s${k}').scrollIntoView({behavior:'smooth'});return false">${h}</a></li>`).join("")}</ol></nav>`:""}
${body}<p>${a.tags.map(t=>`<a class="tag" href="#/search/${encodeURIComponent(t)}">${esc(t)}</a>`).join("")}</p>
<div class="pn">${i>0?`<a href="#/article/${A[i-1].slug}">← ${esc(A[i-1].title)}</a>`:"<span></span>"}${i<A.length-1?`<a href="#/article/${A[i+1].slug}">${esc(A[i+1].title)} →</a>`:""}</div></div><h2>Related articles</h2>${grid(rel)}`},
search(q){q=decodeURIComponent(q||"");const r=search(q);return`<h1>Search</h1><p>${q?`${r.length} result${r.length==1?"":"s"} for “${esc(q)}”`:"Type something in the search box."}</p>${q&&!r.length?`<div class="empty"><h2>No matches</h2><p>Try a broader word like “star”, “Curie” or “time”.</p></div>`:grid(r)}`},
favorites(){const f=favs(),l=A.filter(a=>f.includes(a.slug));return`<h1>Favorites</h1><p class="meta">Saved in this browser for ${user()?esc(user().name):"guest"}.</p>${l.length?grid(l):`<div class="empty"><h2>No saved articles yet</h2><p>Tap ☆ on any article to keep it here.</p><a class="btn" href="#/explore">Explore articles</a></div>`}`},
signin(){return`<h1>Sign in</h1><p class="meta"><strong>Local demo mode:</strong> no real account or password is created. Real authentication needs a backend service, which is not configured yet.</p>${authForm("Continue")}`},
signup(){return`<h1>Create account</h1><p class="meta"><strong>Local demo mode:</strong> this only saves a display name in your browser. No password is collected.</p>${authForm("Create demo profile")}`},
profile(){const u=user();if(!u)return`<div class="empty"><h2>You are not signed in</h2><a class="btn" href="#/signin">Sign in</a> <a class="btn" href="#/signup">Sign up</a></div>`;
return`<h1>Profile</h1><div style="width:80px;height:80px;border-radius:50%;background:var(--brown);color:#fff;display:flex;align-items:center;justify-content:center;font-size:2rem">${esc(u.name[0].toUpperCase())}</div><h2>${esc(u.name)}</h2><p class="meta">Demo account · ${favs().length} saved articles</p>
<form class="f" onsubmit="return saveName(event)"><label>Display name <input id="dn" value="${esc(u.name)}" required maxlength="40"></label><button class="btn">Save settings</button></form><p><button class="btn" onclick="signOut()">Sign out</button></p>`},
about(){return`<h1>About</h1><p>What Is This World? is an educational magazine about science, history and ideas. All sample articles are original.</p>`},
contact(){return`<h1>Contact</h1><p>Contact details are a placeholder. Add your email in app.js.</p>`},
nf(){document.title="Not found — What Is This World?";return`<div class="empty"><h1>Page not found</h1><p>That page doesn't exist.</p><a class="btn" href="#/">Back home</a></div>`}};
const authForm=b=>`<form class="f" onsubmit="return signIn(event)"><label>Display name <input id="dn" required maxlength="40"></label><button class="btn">${b}</button></form>`;
function signIn(e){e.preventDefault();const n=$("#dn").value.trim();if(!n)return false;ls.set("witw_user",{id:"u_"+n.toLowerCase().replace(/\W+/g,"_"),name:n});location.hash="#/profile";route();return false}
function saveName(e){e.preventDefault();const u=user();u.name=$("#dn").value.trim()||u.name;ls.set("witw_user",u);route();return false}
function signOut(){localStorage.removeItem("witw_user");location.hash="#/";route()}
async function share(slug){const url=location.href,a=A.find(x=>x.slug===slug);try{if(navigator.share){await navigator.share({title:a.title,url});return}await navigator.clipboard.writeText(url);$("#shmsg").textContent="Link copied!"}catch(e){$("#shmsg").textContent="Copy this link: "+url}}
function route(){const h=location.hash.replace(/^#\/?/,""),[path,qs]=h.split("?"),[p,arg]=path.split("/");document.title="What Is This World?";
try{app.innerHTML=(pages[p||"home"]||pages.nf)(arg,qs)}catch(e){app.innerHTML=`<div class="empty"><h2>Something went wrong</h2></div>`}
$("#favn").textContent=favs().length||"";$("#acct").textContent=user()?user().name:"Sign in";$("#acct").href=user()?"#/profile":"#/signin";$("#nav").classList.remove("open");if(!qs)scrollTo(0,0)}
addEventListener("hashchange",route);route();
