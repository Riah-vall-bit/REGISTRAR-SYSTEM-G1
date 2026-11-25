// CampusConnect Student Portal - demo front-end application
const DEMO_ID = "2026-0001";
const DEMO_PASSWORD = "student123";
const STORAGE_KEY = "campusconnect_student_portal_v1";

const defaultData = {
  profile: {
    id: DEMO_ID, firstName: "Alex", lastName: "Santos", age: 19, gender: "Prefer not to say",
    birthday: "2007-03-15", address: "Tagum City, Davao del Norte", contact: "0912 345 6789",
    email: "alex.santos@example.com", course: "BS Information Systems", year: "1st Year", section: "BSIS 1-A"
  },
  enrollment: { status: "Enrolled", schoolYear: "2026–2027", semester: "1st Semester", units: 20,
    history: [
      { schoolYear: "2026–2027", semester: "1st Semester", status: "Enrolled", date: "Nov 04, 2026" },
      { schoolYear: "2025–2026", semester: "Summer", status: "Completed", date: "Jun 10, 2026" }
    ] },
  subjects: [
    { code: "CC101", name: "Introduction to Computing", instructor: "Mr. Daniel Cruz", units: 3, grade: "1.75" },
    { code: "PROG101", name: "Computer Programming 1", instructor: "Ms. Maria Reyes", units: 3, grade: "1.50" },
    { code: "GE101", name: "Understanding the Self", instructor: "Ms. Angela Flores", units: 3, grade: "1.75" },
    { code: "GE102", name: "Mathematics in the Modern World", instructor: "Mr. John Garcia", units: 3, grade: "2.00" },
    { code: "IS101", name: "Fundamentals of Information Systems", instructor: "Mr. Paolo Lim", units: 3, grade: "1.50" },
    { code: "NSTP1", name: "National Service Training Program 1", instructor: "Ms. Carla Mendoza", units: 2, grade: "—" },
    { code: "PE101", name: "Physical Education 1", instructor: "Mr. Mark Dizon", units: 3, grade: "—" }
  ],
  attendance: { present: 42, absent: 2, late: 3, total: 47 },
  schedule: [
    { subject: "Introduction to Computing", instructor: "Mr. Daniel Cruz", day: "Monday", time: "8:00 AM – 10:00 AM", room: "Lab 1" },
    { subject: "Computer Programming 1", instructor: "Ms. Maria Reyes", day: "Monday", time: "10:30 AM – 12:30 PM", room: "Computer Lab" },
    { subject: "Understanding the Self", instructor: "Ms. Angela Flores", day: "Wednesday", time: "8:00 AM – 10:00 AM", room: "Room 204" },
    { subject: "Mathematics in the Modern World", instructor: "Mr. John Garcia", day: "Wednesday", time: "10:30 AM – 12:30 PM", room: "Room 204" },
    { subject: "Fundamentals of Information Systems", instructor: "Mr. Paolo Lim", day: "Friday", time: "8:00 AM – 11:00 AM", room: "Room 302" },
    { subject: "NSTP 1 / PE 1", instructor: "Various instructors", day: "Friday", time: "1:00 PM – 4:00 PM", room: "Campus Grounds" }
  ],
  payments: { tuition: 18500, miscellaneous: 3500, paid: 12000, history: [
    { date: "Nov 02, 2026", description: "Initial payment", amount: 8000, reference: "PAY-26002" },
    { date: "Oct 15, 2026", description: "Reservation / down payment", amount: 4000, reference: "PAY-26015" }
  ] },
  announcements: [
    { type: "Examination", title: "Midterm examination schedule", date: "Nov 16, 2026", body: "The midterm examination schedule will be posted by the registrar. Please check your class group for room assignments." },
    { type: "Event", title: "Campus student orientation", date: "Nov 10, 2026", body: "All first-year students are encouraged to attend the student orientation at the university auditorium." },
    { type: "Notice", title: "Library account reminders", date: "Nov 08, 2026", body: "Please return borrowed materials on or before their due dates to avoid library fines." },
    { type: "Holiday", title: "Bonifacio Day", date: "Nov 30, 2026", body: "There will be no regular classes in observance of the national holiday." }
  ],
  library: [
    { title: "Introduction to Information Systems", author: "R. Stair", borrowed: "Oct 28, 2026", due: "Nov 11, 2026", status: "Borrowed", fine: 0 },
    { title: "Programming Fundamentals", author: "T. Gaddis", borrowed: "Oct 10, 2026", due: "Oct 24, 2026", status: "Overdue", fine: 25 },
    { title: "Mathematics for Computing", author: "S. Lipschutz", borrowed: "Sep 15, 2026", due: "Sep 29, 2026", status: "Returned", fine: 0 }
  ]
};

let data = loadData();
let currentPage = "dashboard";

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultData); }
  catch { return JSON.parse(JSON.stringify(defaultData)); }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function money(value) { return "₱" + Number(value).toLocaleString("en-PH", { maximumFractionDigits: 2 }); }
function initials() { return `${data.profile.firstName[0] || ""}${data.profile.lastName[0] || ""}`.toUpperCase(); }
function fullName() { return `${data.profile.firstName} ${data.profile.lastName}`; }
function escapeHTML(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }
function tag(text, color = "") { return `<span class="tag ${color}">${escapeHTML(text)}</span>`; }
function stat(label, value, icon, note = "") {
  return `<div class="card stat"><div><div class="card-sub">${label}</div><div class="number">${value}</div>${note ? `<div class="card-sub">${note}</div>` : ""}</div><div class="stat-icon">${icon}</div></div>`;
}
function info(label, value) { return `<div class="info-item"><small>${label}</small><strong>${escapeHTML(value || "—")}</strong></div>`; }
function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.join("") : `<tr><td colspan="${headers.length}" class="empty">No records available.</td></tr>`}</tbody></table></div>`;
}
function row(cells) { return `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`; }
function pageTitle(title, subtitle, action = "") {
  return `<div class="section-title"><div><h2>${title}</h2><p>${subtitle}</p></div>${action}</div>`;
}

const pages = {
  dashboard() {
    const p = data.profile, e = data.enrollment, a = data.attendance;
    const attendancePct = Math.round(a.present / Math.max(a.total, 1) * 100);
    const balance = data.payments.tuition + data.payments.miscellaneous - data.payments.paid;
    return `
      <div class="welcome"><div><p class="eyebrow">YOUR CAMPUS, AT A GLANCE</p><h1>Welcome back, ${escapeHTML(p.firstName)}!</h1><p>Here is your student activity and academic overview.</p></div><div class="welcome-badge">✦</div></div>
      <div class="grid stats">
        ${stat("ENROLLMENT STATUS", tag(e.status, "green"), "▤", `${e.schoolYear} · ${e.semester}`)}
        ${stat("TOTAL SUBJECTS", data.subjects.length, "▣", `${e.units} enrolled units`)}
        ${stat("ATTENDANCE RATE", attendancePct + "%", "◷", `${a.present} days present`)}
        ${stat("REMAINING BALANCE", money(balance), "₱", "Based on demo payment records")}
      </div>
      <div class="grid two-col">
        <div class="card"><div class="card-head"><h3>Student Profile</h3><button class="btn secondary" data-go="profile">View profile</button></div>
          <div class="profile-mini"><div class="profile-photo">${initials()}</div><div><h3>${escapeHTML(fullName())}</h3><p>${escapeHTML(p.id)} · ${escapeHTML(p.course)}</p><p>${escapeHTML(p.year)} · ${escapeHTML(p.section)}</p></div></div>
          <div class="info-grid" style="margin-top:22px">${info("EMAIL ADDRESS",p.email)}${info("CONTACT NUMBER",p.contact)}</div>
        </div>
        <div class="card"><div class="card-head"><h3>Academic Overview</h3><button class="btn secondary" data-go="academics">View grades</button></div>
          <div class="info-grid">${info("CURRENT GPA","1.70")}${info("ACADEMIC STANDING","Good Standing")}${info("SCHOOL YEAR",e.schoolYear)}${info("SEMESTER",e.semester)}</div>
          <div class="progress"><span style="width:${attendancePct}%"></span></div><div class="card-sub">Attendance: ${attendancePct}%</div>
        </div>
      </div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Quick Access</h3><span class="card-sub">Go to a portal service</span></div>
        <div class="quick-links">${[["enrollment","▤","Enrollment"],["academics","▣","Grades"],["schedule","▦","Schedule"],["payments","₱","Payments"],["attendance","◷","Attendance"],["library","▥","Library"],["announcements","◉","Notices"],["settings","⚙","Settings"]].map(x=>`<button class="quick-link" data-go="${x[0]}"><span>${x[1]}</span>${x[2]}</button>`).join("")}</div>
      </div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Latest Announcements</h3><button class="btn secondary" data-go="announcements">View all</button></div>
        ${data.announcements.slice(0,2).map(n=>`<div class="announcement"><strong>${escapeHTML(n.title)}</strong><p>${escapeHTML(n.body)}</p><span class="card-sub">${escapeHTML(n.date)} · ${tag(n.type)}</span></div>`).join("")}
      </div>`;
  },
  profile() {
    const p = data.profile;
    return `${pageTitle("Student Profile","View and update your personal and contact details.")}
      <form id="profileForm" class="card"><div class="profile-mini"><div class="profile-photo">${initials()}</div><div><h3>${escapeHTML(fullName())}</h3><p>Student ID: ${escapeHTML(p.id)}</p></div></div>
      <div class="field-grid" style="margin-top:15px">
        ${field("Student ID","id",p.id,"text",true)}${field("First Name","firstName",p.firstName)}${field("Last Name","lastName",p.lastName)}
        ${field("Age","age",p.age,"number")}${selectField("Gender","gender",p.gender,["Female","Male","Prefer not to say"])}${field("Birthday","birthday",p.birthday,"date")}
        ${field("Address","address",p.address)}${field("Contact Number","contact",p.contact,"tel")}${field("Email Address","email",p.email,"email")}
        ${field("Course","course",p.course)}${selectField("Year Level","year",p.year,["1st Year","2nd Year","3rd Year","4th Year"])}${field("Section","section",p.section)}
      </div><div class="form-actions"><button class="btn primary" type="submit">Save changes</button></div></form>`;
  },
  enrollment() {
    const e=data.enrollment;
    return `${pageTitle("Enrollment Management","Current enrollment information and previous enrollment records.")}
      <div class="grid three-col">
        <div class="card">${info("ENROLLMENT STATUS",e.status)}<div style="margin-top:12px">${tag(e.status,"green")}</div></div>
        <div class="card">${info("SCHOOL YEAR",e.schoolYear)}</div><div class="card">${info("SEMESTER",e.semester)}</div>
      </div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Enrolled Subjects</h3><strong>${e.units} Total Units</strong></div>
      ${table(["Subject Code","Subject Description","Units"],data.subjects.map(s=>row([escapeHTML(s.code),escapeHTML(s.name),s.units])))}</div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Enrollment History</h3></div>
      ${table(["School Year","Semester","Status","Date"],e.history.map(h=>row([h.schoolYear,h.semester,tag(h.status,h.status==="Enrolled"?"green":""),h.date])))}</div>`;
  },
  academics() {
    const graded=data.subjects.filter(s=>s.grade!=="—");
    const gpa=graded.length?(graded.reduce((sum,s)=>sum+Number(s.grade),0)/graded.length).toFixed(2):"—";
    return `${pageTitle("Academic Management","Review your enrolled subjects, instructors, grades, and academic standing.")}
      <div class="grid three-col"><div class="card">${info("CURRENT GPA",gpa)}</div><div class="card">${info("ACADEMIC STANDING","Good Standing")}</div><div class="card">${info("GRADED SUBJECTS",`${graded.length} of ${data.subjects.length}`)}</div></div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Subject List and Grades</h3><span class="card-sub">Sample academic records</span></div>
      ${table(["Subject Code","Subject Description","Instructor","Units","Grade"],data.subjects.map(s=>row([escapeHTML(s.code),escapeHTML(s.name),escapeHTML(s.instructor),s.units,s.grade==="—"?tag("Pending","amber"):tag(s.grade,"green")])))}
      <p class="card-sub" style="margin-top:14px">GPA shown here is a simple average of available sample grades. Official GPA and standing must be confirmed by the registrar.</p></div>`;
  },
  attendance() {
    const a=data.attendance, pct=(a.present/Math.max(a.total,1)*100).toFixed(1);
    return `${pageTitle("Attendance Management","Monitor your class attendance records and attendance percentage.")}
      <div class="grid stats">${stat("PRESENT",a.present,"✓")}${stat("ABSENT",a.absent,"×")}${stat("LATE",a.late,"◷")}${stat("TOTAL ATTENDANCE",a.total,"▣")}</div>
      <div class="card"><div class="card-head"><h3>Attendance Percentage</h3><strong>${pct}%</strong></div><div class="progress"><span style="width:${pct}%"></span></div><p class="card-sub">Present days divided by total recorded attendance days.</p></div>
      <div class="card" style="margin-top:18px"><h3>Attendance Records</h3><div class="empty">Detailed daily attendance entries have not been added to this demo account.</div></div>`;
  },
  schedule() {
    const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return `${pageTitle("Class Schedule","Your weekly class timetable and room assignments.")}
      <div class="card"><div class="card-head"><h3>Weekly Schedule</h3><span class="card-sub">1st Semester · S.Y. 2026–2027</span></div>
      ${table(["Subject","Instructor","Day","Time","Room Number"],data.schedule.map(s=>row([escapeHTML(s.subject),escapeHTML(s.instructor),tag(s.day),escapeHTML(s.time),escapeHTML(s.room)])))}</div>`;
  },
  payments() {
    const p=data.payments,total=p.tuition+p.miscellaneous,balance=total-p.paid;
    return `${pageTitle("School Fees / Payments","View your fee assessment, payment history, and remaining balance.")}
      <div class="grid stats">${stat("TUITION FEE",money(p.tuition),"₱")}${stat("MISCELLANEOUS FEES",money(p.miscellaneous),"＋")}${stat("TOTAL ASSESSMENT",money(total),"▤")}${stat("REMAINING BALANCE",money(balance),"₱")}</div>
      <div class="card"><div class="card-head"><h3>Payment Status</h3>${tag(balance<=0?"Fully Paid":"With Balance",balance<=0?"green":"amber")}</div>
        <div class="info-grid">${info("TOTAL ASSESSMENT",money(total))}${info("TOTAL PAID",money(p.paid))}${info("REMAINING BALANCE",money(balance))}${info("PAYMENT STATUS",balance<=0?"Fully Paid":"Partial Payment")}</div>
        <div class="progress"><span style="width:${Math.min(100,p.paid/total*100)}%"></span></div><p class="card-sub">${(p.paid/total*100).toFixed(0)}% of assessed fees paid</p>
      </div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Payment History</h3></div>
      ${table(["Date","Description","Reference Number","Amount"],p.history.map(h=>row([h.date,escapeHTML(h.description),escapeHTML(h.reference),money(h.amount)])))}
      <p class="card-sub" style="margin-top:12px">This demo does not process payments. Please use official school payment channels.</p></div>`;
  },
  announcements() {
    return `${pageTitle("Announcements","School events, examination schedules, holidays, and important notices.")}
      <div class="grid two-col">${data.announcements.map(n=>`<article class="card"><div class="card-head">${tag(n.type,n.type==="Holiday"?"amber":"")}<span class="card-sub">${escapeHTML(n.date)}</span></div><h3>${escapeHTML(n.title)}</h3><p class="muted" style="line-height:1.7">${escapeHTML(n.body)}</p></article>`).join("")}</div>`;
  },
  library() {
    const borrowed=data.library.filter(b=>b.status==="Borrowed").length, overdue=data.library.filter(b=>b.status==="Overdue").length, fines=data.library.reduce((s,b)=>s+b.fine,0);
    return `${pageTitle("Library Management","Track borrowed and returned books, due dates, overdue items, and fines.")}
      <div class="grid three-col"><div class="card">${info("BORROWED BOOKS",borrowed)}</div><div class="card">${info("OVERDUE BOOKS",overdue)}</div><div class="card">${info("LIBRARY FINES",money(fines))}</div></div>
      <div class="card" style="margin-top:18px"><div class="card-head"><h3>Library Records</h3></div>
      ${table(["Book Title","Author","Date Borrowed","Due Date","Status","Fine"],data.library.map(b=>row([escapeHTML(b.title),escapeHTML(b.author),b.borrowed,b.due,tag(b.status,b.status==="Overdue"?"red":b.status==="Returned"?"green":"amber"),money(b.fine)])))}</div>`;
  },
  settings() {
    return `${pageTitle("Settings","Manage your account security and contact information.")}
      <div class="grid two-col">
        <form id="passwordForm" class="card"><h3>Change Password</h3><p class="card-sub">Update the password used to sign in to this demo portal.</p>
          <div class="field"><label>Current Password</label><input name="current" type="password" required></div>
          <div class="field"><label>New Password</label><input name="next" type="password" minlength="6" required></div>
          <div class="field"><label>Confirm New Password</label><input name="confirm" type="password" minlength="6" required></div>
          <div class="form-actions"><button class="btn primary">Update password</button></div>
        </form>
        <div class="card"><h3>Account Information</h3><div class="setting-row"><div><strong>Student ID</strong><p>${escapeHTML(data.profile.id)}</p></div>${tag("Active","green")}</div>
          <div class="setting-row"><div><strong>Account Name</strong><p>${escapeHTML(fullName())}</p></div></div>
          <div class="setting-row"><div><strong>Email Address</strong><p>${escapeHTML(data.profile.email)}</p></div></div>
          <div class="setting-row"><div><strong>Update Contact Information</strong><p>Edit your phone and email in Student Profile.</p></div><button class="btn secondary" data-go="profile">Edit profile</button></div>
          <div class="setting-row"><div><strong>Log Out</strong><p>End your current portal session.</p></div><button class="btn primary" id="settingsLogout">Log out</button></div>
        </div>
      </div>`;
  }
};

function field(label,name,value,type="text",disabled=false) {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${escapeHTML(value)}" ${disabled?"disabled":""}></div>`;
}
function selectField(label,name,value,options) {
  return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options.map(o=>`<option ${o===value?"selected":""}>${escapeHTML(o)}</option>`).join("")}</select></div>`;
}

function render(page=currentPage) {
  currentPage=page;
  document.getElementById("pageHeading").textContent = ({
    dashboard:"Dashboard",profile:"Student Profile",enrollment:"Enrollment Management",academics:"Academic Management",
    attendance:"Attendance Management",schedule:"Class Schedule",payments:"School Fees / Payments",
    announcements:"Announcements",library:"Library Management",settings:"Settings"
  })[page] || "Dashboard";
  document.getElementById("pageContent").innerHTML = pages[page]();
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("topAvatar").textContent=initials();
  document.getElementById("sidebar").classList.remove("open");
}

function showApp() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  render("dashboard");
}
function logout() {
  document.getElementById("app").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("loginPassword").value="";
}

document.getElementById("loginForm").addEventListener("submit",event=>{
  event.preventDefault();
  const id=document.getElementById("loginId").value.trim();
  const password=document.getElementById("loginPassword").value;
  const savedPassword=localStorage.getItem("campusconnect_demo_password") || DEMO_PASSWORD;
  if(id===data.profile.id && password===savedPassword) {
    document.getElementById("loginError").textContent="";
    showApp();
  } else document.getElementById("loginError").textContent="Incorrect Student ID or password. Please try again.";
});
document.getElementById("navigation").addEventListener("click",event=>{
  const button=event.target.closest("[data-page]");
  if(button) render(button.dataset.page);
});
document.getElementById("pageContent").addEventListener("click",event=>{
  const go=event.target.closest("[data-go]");
  if(go) render(go.dataset.go);
  if(event.target.id==="settingsLogout") logout();
});
document.getElementById("logoutBtn").addEventListener("click",logout);
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));

document.getElementById("pageContent").addEventListener("submit",event=>{
  event.preventDefault();
  if(event.target.id==="profileForm") {
    const form=new FormData(event.target);
    ["firstName","lastName","age","gender","birthday","address","contact","email","course","year","section"].forEach(k=>{
      if(form.has(k)) data.profile[k]=form.get(k);
    });
    data.profile.age=Number(data.profile.age);
    saveData(); render("profile"); alert("Your profile has been updated.");
  }
  if(event.target.id==="passwordForm") {
    const form=new FormData(event.target), current=form.get("current"), next=form.get("next"), confirm=form.get("confirm");
    const savedPassword=localStorage.getItem("campusconnect_demo_password") || DEMO_PASSWORD;
    if(current!==savedPassword) return alert("Your current password is incorrect.");
    if(next!==confirm) return alert("The new passwords do not match.");
    localStorage.setItem("campusconnect_demo_password",next);
    event.target.reset(); alert("Password updated successfully.");
  }
});

// Start on the sign-in screen. Demo account details are shown below the login form.
