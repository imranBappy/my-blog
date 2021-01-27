window.onload = function () {
    // comment script start 

    const commentHolder = document.getElementById('comment-holder')

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
}