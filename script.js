const nav = document.getElementById("nav");
document.querySelector(".menu-btn").addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");

const replies = [
  {
    keys:["فين","أين","الموقع","كاينة","عنوان","العنوان"],
    answer:"المدرسة كاينة فحي الرمل تاراست بمدينة إنزكان. تقدر تشوف الخريطة فخانة «موقع المدرسة»."
  },
  {
    keys:["سميتها","اسم المدرسة","شنو الاسم","اسمها"],
    answer:"اسم المؤسسة هو: الثانوية الإعدادية الرحال بن أحمد."
  },
  {
    keys:["الهاتف","رقم","تلفون","اتصال"],
    answer:"رقم الهاتف المدرج في معلومات المؤسسة هو: 028-33-07-84."
  },
  {
    keys:["فيسبوك","فايسبوك","facebook"],
    answer:"تقدر تدخل لصفحة المدرسة على Facebook من الرابط الموجود في أسفل الموقع."
  },
  {
    keys:["صور","الصور","معرض"],
    answer:"كاين معرض للصور فيه صور من ساحة المؤسسة ومرافقها ومدخلها."
  },
  {
    keys:["مواد","الدراسة","المواد"],
    answer:"الثانوي الإعدادي كيشمل مواد متنوعة مثل العربية والفرنسية والرياضيات والعلوم والفيزياء والتاريخ والجغرافيا والتربية الإسلامية والإنجليزية والتربية البدنية."
  },
  {
    keys:["سلام","مرحبا","السلام"],
    answer:"وعليكم السلام 👋 مرحباً بك! شنو بغيتي تعرف على المدرسة؟"
  }
];

function getReply(text){
  const t = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const found = replies.find(r => r.keys.some(k => t.includes(k)));
  return found ? found.answer : "سمح ليا، أنا نسخة تجريبية ومازال محدود. جرب تسولني على اسم المدرسة، العنوان، الهاتف، الصور أو Facebook.";
}

function addMessage(text, type){
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function ask(text){
  if(!text.trim()) return;
  addMessage(text, "user");
  setTimeout(() => addMessage(getReply(text), "bot"), 350);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  ask(input.value);
  input.value = "";
});

document.querySelectorAll(".suggestions button").forEach(btn => {
  btn.addEventListener("click", () => ask(btn.dataset.q));
});
