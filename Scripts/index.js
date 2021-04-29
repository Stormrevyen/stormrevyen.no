db.collection('posts').onSnapshot(snapshot => {
    setupPosts(snapshot.docs);
});

const feed = document.querySelector('#feed');

//setup posts
const setupPosts = (data) => {
    let html = '';
    data.forEach(doc => {
        const post = doc.data();
        const li = `
        <li>
            <div class="content">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <h6>${post.timestamp} - ${post.author}</h6>
            </div>
        </li>
        `;
        html += li;
    });
    
    feed.innerHTML = html;
};