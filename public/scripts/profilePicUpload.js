window.onload = function () {

    let img = '/uploads/default.jpg'
    const profilePic = document.getElementById("profilePics")
    const removeBtn = document.getElementById("remove-profilePics")
    const defaultPic = 'http://localhost:1000/uploads/default.jpg'


    if (profilePic.src !== defaultPic) {

        $("#remove-profilePics").on('click', () => {
            let req = new Request('/uploads/profilePics', {
                method: 'DELETE',
                mode: 'cors'
            })
            fetch(req)
                .then(res => res.json())
                .then(data => {
                    profilePic.src = img
                })
        })
    }

    else {
        removeBtn.style.display = 'none'
    }

}