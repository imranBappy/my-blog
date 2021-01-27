window.onload = function () {
    tinymce.init({
        selector: "#tiny-mce-post-body",
        plugins: [" advcode advlist lists link checklist autolink autosave code",
            'preview', 'searchreplace', 'wordcount', 'media table emoticons image imagetools'],
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | code preview',
        block_formats: 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;',
        height: 300,
        automatic_uploads: true,
        images_upload_url: '/uploads/postimage',
        relative_urls: false,
        images_upload_handler: function (blobInfo, success, failure) {
            let headers = new Headers()
            headers.append('Accept', 'Applocation/JSON')

            let formData = new FormData()
            formData.append('post-image', blobInfo.blob(), blobInfo.filename())

            let req = new Request('/uploads/postimage', {
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData
            })

            fetch(req)
                .then(res => res.json())
                .then(data => success(data.imgUrl))
                .catch(() => failure('HTTP Error'))
        }
    })
}
