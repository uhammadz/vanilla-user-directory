// Global array for saving data user
let users = [];

async function fetchUsers() {
  const loadingElement = document.getElementById('loading');
  
  // 1. Tampilkan status loading sebelum fetch
  loadingElement.style.display = 'block';

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Gagal mengambil data');
    
    users = await response.json();

    renderUsers(users);

    updateStats(users);

  } catch (error) {
    console.error('Eror:', error);
    document.getElementById('user-list').innerHTML = 
      '<p style="color: red; text-align: center;">Gagal memuat data pengguna.</p>';
  } finally {
    // 2. Sembunyikan status loading setelah proses selesai (baik sukses maupun gagal)
    loadingElement.style.display = 'none';
  }
}


function renderUsers(userArray) {
  const userListElement = document.getElementById('user-list');
  userListElement.innerHTML = '';

  if (userArray.length === 0) {
    userListElement.innerHTML = '<p>Pengguna tidak ditemukan.</p>';
    return;
  }

  userArray.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <h3>${user.name}</h3>
      <p>📧 ${user.email}</p>
      <p>🏢 ${user.company.name}</p>
    `;
    userListElement.appendChild(card);
  });
}

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm)
  );

  renderUsers(filteredUsers);
});

function updateStats(dataUsers) {
  const statsElement = document.getElementById('stats-container');

  const emailDomains = dataUsers.map(user => user.mail.split('@')[1]);

  const totalNameCharacters = dataUsers.reduce((accumulator, user) => {
    return accumulator + user.name.length;
  }, 0);

  const bizEmailCount = emailDomains.reduce((count, domain) => {
    return domain.endsWith('.biz') ? count + 1 : count;
  }, 0);

  statsElement.innerHTML = `
    <p><strong>Total Pengguna:</strong> ${dataUsers.length}</p>
    <p><strong>Total Karakter Nama:</strong> ${totalNameCharacters} karakter</p>
    <p><strong>Pengguna dengan Domain .biz:</strong> ${bizEmailCount}</p>
  `;
}


fetchUsers()