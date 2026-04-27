
/* ================= BANK SOAL ================= */
const bankSoal={
1:[
{tanya:"No 1. Ibukota Indonesia?",opsi:["Bandung","Jakarta","Surabaya"],benar:1},
{tanya:"2 + 2 = ?",opsi:["3","4","5"],benar:1},
{tanya:"Pulau terbesar Indonesia?",opsi:["Jawa","Sumatra","Kalimantan"],benar:2}
],
2:[
{tanya:"No 2. Planet terbesar?",opsi:["Mars","Jupiter","Venus"],benar:1},
{tanya:"5 x 5 = ?",opsi:["20","25","30"],benar:1},
{tanya:"Air jadi es pada?",opsi:["0°C","100°C","50°C"],benar:0}
],
3:[
{tanya:"No 3. - Bahasa Inggris buku?",opsi:["Book","Pen","Table"],benar:0},
{tanya:"10 - 3 = ?",opsi:["7","8","6"],benar:0},
{tanya:"Hewan 4 kaki?",opsi:["Kucing","Burung","Ikan"],benar:0}
]
};

/* ================= STATE ================= */
let latihan=1;
let soal=[];
let index=0;
let jawaban=[];
let namaUser="";
let mode="quiz";

let timer;
let waktu=300;

/* ================= MENU ================= */
function halamanMenu(){
document.getElementById("app").innerHTML=`
<div class="menu-wrap">

<div class="menu-header">
    <img src="BrainPrep.png" class="menu-logo">
    <h1 class="menu-title">Welcome to BrainPrep<br>Latihan Soal Online Gratis</h1>
</div>

<div class="menu-sub">Pilih latihan</div>

<div class="menu-grid">

<div class="menu-card" onclick="buka(1)">
<div class="menu-icon">📘</div><div>Latihan 1</div>
</div>

<div class="menu-card" onclick="buka(2)">
<div class="menu-icon">📗</div><div>Latihan 2</div>
</div>

<div class="menu-card" onclick="buka(3)">
<div class="menu-icon">📙</div><div>Latihan 3</div>
</div>

</div>

</div>`;
}

/* ================= PILIH ================= */
function buka(n){
latihan=n;
halamanInput();
}

/* ================= INPUT ================= */
function halamanInput(){
document.getElementById("app").innerHTML=`
<div class="input-wrapper">

<div class="input-card">

<img src="BrainPrep.png" class="logo-input">
<h2 class="input-title">BrainPrep</h2>
<div class="latihan-label">Latihan ${latihan}</div>

<input id="nama" placeholder="Nama peserta">

<button onclick="mulai()">Mulai</button>

<button onclick="halamanMenu()" style="background:#64748b;margin-top:8px;">
Kembali
</button>

</div>

</div>`;
}


/* ================= MULAI ================= */
function mulai(){
namaUser=document.getElementById("nama").value;
if(!namaUser) return alert("Isi nama dulu yaa");

soal=bankSoal[latihan];
jawaban=new Array(soal.length).fill(null);
index=0;
mode="quiz";

waktu=300;
clearInterval(timer);

load();
tampil();
startTimer();
}

function load(){
document.getElementById("app").innerHTML=`
    <div class="app">
        <div class="main">

            <div class="header">
                <div class="header-left">
                    <img src="BrainPrep.png" class="logo">
                    <div class="app-title">BrainPrep</div>
                </div>

                <div class="header-center">
                    Latihan ${latihan} - ${namaUser}
                </div>

                <div class="timer-box" id="timer">
                    ${mode==="quiz"?"00:00":""}
                </div>
            </div>

            <div id="info"></div>
            <div id="quiz"></div>

            <div style="display:flex;justify-content:space-between;margin-top:10px;gap:10px;">

<button onclick="prev()" style="
    padding:6px 12px;
    font-size:12px;
    border-radius:6px;
    width:80px;
    background:#64748b;
">
Prev
</button>

<button id="nextBtn" onclick="next()" style="
    padding:6px 12px;
    font-size:12px;
    border-radius:6px;
    width:80px;
    background:#3b82f6;
">
Next
</button>

</div>

</div>

<!-- RIGHT SIDE -->
<div class="sidebar">
<div class="grid" id="grid"></div>
</div>

</div>`;
}


/* ================= SOAL ================= */
function tampil(){
let q=soal[index];

document.getElementById("info").innerHTML=
`Soal ${index+1}/${soal.length}`;

let html=`<h3>${q.tanya}</h3>`;

q.opsi.forEach((o,i)=>{
let cls="option";

if(mode==="quiz"){
if(jawaban[index]===i) cls+=" selected";
}

if(mode==="review"){
if(i===q.benar) cls+=" correct";
if(jawaban[index]===i) cls+=" user";
}

html+=`<div class="${cls}" onclick="pilih(${i})">${o}</div>`;
});

document.getElementById("quiz").innerHTML=html;
grid();

/* ================= TOMBOL SUBMIT ================= */
let btn=document.getElementById("nextBtn");

if(btn){

if(index===soal.length-1){

    if(mode==="quiz"){
        btn.innerText="SUBMIT";
        btn.style.background="#facc15";
        btn.style.color="black";
    } else if(mode==="review"){
        btn.innerText="HASIL";
        btn.style.background="#22c55e";
        btn.style.color="white";
    }

} else {
    btn.innerText="Next";
    btn.style.background="#3b82f6";
    btn.style.color="white";
}
}
}

/* ================= GRID ================= */
function grid(){
let html="";
soal.forEach((s,i)=>{
let cls="";
if(i===index) cls="active";
else if(jawaban[i]!=null) cls="answered";
html+=`<div class="${cls}" onclick="goto(${i})">${i+1}</div>`;
});
document.getElementById("grid").innerHTML=html;
}


/* ================= ACTION ================= */
function pilih(i){if(mode==="quiz") jawaban[index]=i;tampil();}
function prev(){if(index>0){index--;tampil();}}
function goto(i){index=i;tampil();}

/* ================= NEXT ================= */
function next(){

// kalau belum terakhir
if(index < soal.length - 1){
    index++;
    tampil();
    return;
}

// kalau terakhir
if(index === soal.length - 1){

    if(mode==="quiz"){
        let yakin = confirm("Yakin mau submit jawaban?");
        if(yakin) hasil();
    }

    if(mode==="review"){
        hasil(); // 🔥 balik ke hasil
    }

}
}

/* ================= HASIL ================= */
function hasil(){

let benar=0;
soal.forEach((s,i)=>{
if(jawaban[i]===s.benar) benar++;
});

let persen=Math.round((benar/soal.length)*100);
let salah=soal.length-benar;

document.getElementById("app").innerHTML=`
<div class="menu-wrap">


<div class="menu-header">
    <img src="BrainPrep.png" class="menu-logo">
    <h1 class="menu-title">Hasil Ujian - Latihan ${latihan} <br> ${namaUser} </h1>
</div>

<h1 style="font-size:50px;color:#c2dcff;">
${persen}%
</h1>

<div style="display:flex;justify-content:space-around;margin:20px 0;">

<div style="background:#22c55e;padding:15px;border-radius:12px;width:120px;">
<h3>${benar}</h3><p>Benar</p>
</div>

<div style="background:#ef4444;padding:15px;border-radius:12px;width:120px;">
<h3>${salah}</h3><p>Salah</p>
</div>

<div style="background:#3b82f6;padding:15px;border-radius:12px;width:120px;">
<h3>${soal.length}</h3><p>Total</p>
</div>

</div>

<div style="background:#334155;height:18px;border-radius:20px;overflow:hidden;">
<div style="width:${persen}%;background:#3b82f6;height:100%;"></div>
</div>

<br>

<button class="review-btn" onclick="mulaiReview()">Pembahasan</button>
<button onclick="halamanMenu()" class="review-btn">Menu</button>

</div>`;


simpanHasil(persen, benar, salah); // ✅ di sini

}


async function simpanHasil(persen, benar, salah){

    try{
        await addDoc(collection(db, "hasil"), {
            nama: namaUser,
            latihan: latihan,
            skor: persen,
            benar: benar,
            salah: salah,
            waktu: 300 - waktu,
            tanggal: new Date()
        });

        console.log("Berhasil simpan!");
    } catch(e){
        console.error("Gagal:", e);
    }

}

/* ================= REVIEW ================= */
function mulaiReview(){
mode="review";
clearInterval(timer); // 🔥 STOP TIMER
index=0;
load();
tampil();
}

/* ================= TIMER ================= */
function startTimer(){

timer=setInterval(()=>{

waktu--;

let m=Math.floor(waktu/60);
let s=waktu%60;

document.getElementById("timer").innerHTML=
String(m).padStart(2,'0')+":"+String(s).padStart(2,'0');

if(waktu<=0){
clearInterval(timer);
hasil();
}

},1000);
}

/* INIT */
window.onload = function () {
    halamanMenu();
};