db.collection('posts').onSnapshot(snapshot => {
    setupPosts(snapshot.docs);
});

const feed = document.querySelector('#feed');

//setup posts
const setupPosts = (data) => {
    let html = '';
    data.forEach(doc => {
        const post = doc.data();
        if(post.content != ''){
            var content = `<p>${post.content}</p>`;
        }else{
            var content = '';
        }

        if(post.linkDir != '' || post.linkTitle != ''){
            var link = `<a href="${post.linkDir}"><h1>${post.linkTitle} <i class='fas fa-arrow-right'></i></h1></a>`;
        }else{
            var link = '';
        }
        
        if(post.image != ''){
            var img = `<img src="${post.image}">`;
        }else{
            var img = '';
        }

        if(post.youtube != ''){
            var youtube = `<iframe
            src="${post.youtube}" frameborder="0" allowfullscreen="">
        </iframe>`
        }else{
            var youtube = '';
        }

        const li = `
        <li>
            <div class="content">
            <h2>${post.title}</h2>
            ${img}
            ${youtube}
            ${content}
            ${link}
            <h6>${post.timestamp} - ${post.author}</h6>
            </div>
        </li>
        `;
        html = li + html;
    }); //TODO Fiks rekkefølgen.
    
    feed.innerHTML = html;
};