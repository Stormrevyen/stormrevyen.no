//** Create post
const createForm = document.querySelector('#create-form');
var time = Date.now();
var date = new Date(time);
var dato = "0" + date.getDate();
var month = "0" + (date.getMonth() + 1);
var year = date.getFullYear()
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
var formattedTime = dato.substr(-2) + "." + month.substr(-2) + "." + year + " - " + hours + ":" + minutes.substr(-2);

createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('posts').add({
        title: createForm['title'].value,
        content: createForm['content'].value,
        image: createForm['image'].value,
        linkDir: createForm['linkDir'].value,
        linkTitle: createForm['linkTitle'].value,
        youtube: createForm['youtube'].value,
        author: createForm['author'].value,
        timestamp: formattedTime,
    }).then(() => {
        createForm.reset();
        location.replace("https://stormrevyen.no")
    }).catch(err => {
        console.log(err.message);
    });
});