window.onload = function () {
    // comment script start 
    const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder')


    comment.addEventListener('keypress', e => {
        if (e.key === 'Enter') {

            if (e.target.value) {
                let postId = comment.dataset.post

                let data = {
                    body: e.target.value
                }

                let req = generateReq(`/comments/${postId}`, 'POST', data)

                fetch(req)
                    .then(res => res.json())
                    .then(data => {

                        let commentElement = createdComment(data)

                        commentHolder.insertBefore(commentElement, commentHolder.children[0])
                        e.target.value = ''
                    })
                    .catch(err => {
                        alert(err.message)
                    })

            } else {
                alert('Please Enter A Valid Comment')
            }
        }
    })


    commentHolder.addEventListener('keypress', e => {

        if (commentHolder.hasChildNodes(e.target)) {
            if (e.key === 'Enter') {
                let commentId = e.target.dataset.comment
                let value = e.target.value
                if (value) {
                    let data = {
                        body: value
                    }
                    let req = generateReq(`/comments/replies/${commentId}`, 'POST', data)
                    fetch(req)
                        .then(response => response.json())
                        .then(data => {
                            let replyElement = createReplyElement(data)
                            let parent = e.target.parentElement
                            parent.previousElementSibling.appendChild(replyElement)
                            e.target.value = ''
                        })
                        .catch(err => {
                            alert(err.message);
                        })

                } else {
                    alert('Please Enter A Valid Reply')
                }

            }
        }
    })




    function generateReq(url, method, body) {
        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        let req = new Request(`/api${url}`, {
            method,
            headers,
            body: JSON.stringify(body),
            mode: 'cors'
        })

        return req
    }


    function createdComment(comment) {

        let innerHTML = `
                <img src="${comment.user.profilePics}" class="rounded-circle mx-3 my-2" style="width:40px">
                <span>${comment.name}</span>
                
                <div class="media-body my-1">
                    <p class ="mx-5">
                       ${comment.body}
                       <br>
                       
                    </p>
                    <div class="mx-3 mb-3">
                        <input data-comment=${comment._id} name="reply" type="text" class="form-control"
                            placeholder="Press enter to reply">
                    </div>
                </div>
                `
        let div = document.createElement('div')
        div.className = 'media border'
        div.innerHTML = innerHTML
        return div
    }


    function createReplyElement(comment) {

        let innerHTML = `
                <img src="${comment.profilePics}" class="rounded-circle mx-3 my-2" style="width:30px">
                <span>
                ${comment.name}
                </span>
                <div class="media-body ">
                    <p class="py-2 mx-5" >
                       ${comment.body}
                    </p>
                   
                </div>
                `
        let div = document.createElement('div')
        div.className = 'media mt-3'
        div.innerHTML = innerHTML

        return div

    }

    // comment script end

    // bookmark script start

    const bookmarks = document.getElementsByClassName('bookmark')
        ;[...bookmarks].forEach(bookmark => {
            bookmark.style.cursor = 'pointer'
            bookmark.addEventListener('click', e => {
                let target = e.target.parentElement
                let headers = new Headers()
                headers.append('Accept', 'Applocation/JSON')

                let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                    method: 'GET',
                    headers,
                    mode: 'cors'
                })
                fetch(req)
                    .then(res => res.json())
                    .then(data => {
                        if (data.bookmark) {
                            target.innerHTML = '<i class="fas fa-bookmark"></i>'
                        } else {
                            target.innerHTML = '<i class="far fa-bookmark"></i>'
                        }
                    })
                    .catch(err => {

                        alert(err.response.data.error)
                    })
            })
        })
    // bookmark script end

    // like disline script start



    let likeBtn = document.getElementById('likeBtn')
    let dislikeBtn = document.getElementById('dislikeBtn')
    likeBtn.addEventListener('click', e => {

        let postId = likeBtn.dataset.post
        reqLikeDislike('likes', postId)
            .then(response => response.json())
            .then(data => {
                let likeText = data.Liked ? 'Liked' : 'Like'
                likeText = likeText + ` ( ${data.totalLikes} ) `
                let dislikeText = `Dislike ( ${data.totalDislikes} ) `
                likeBtn.innerHTML = likeText
                dislikeBtn.innerHTML = dislikeText
            })
            .catch(err => {
                alert(err.response.data.error)
            })
    })


    dislikeBtn.addEventListener('click', e => {
        let postId = dislikeBtn.dataset.post
        reqLikeDislike('dislikes', postId)
            .then(response => response.json())
            .then(data => {
                let dislikeText = data.Liked ? 'Disliked' : 'Dislike'
                dislikeText = dislikeText + ` ( ${data.totalDislikes} ) `
                let likeText = `Like ( ${data.totalLikes} ) `
                dislikeBtn.innerHTML = dislikeText
                likeBtn.innerHTML = likeText
            })
            .catch(err => {
                alert(err.response.data.error)
            })
    })



    function reqLikeDislike(type, postId) {
        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }




    ///////////////////////////////////////////////////

}


