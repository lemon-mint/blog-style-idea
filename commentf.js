function submitForm() {
    document.getElementById("comment-form").submit();
}

var onloadCallback = function () {
    hcaptcha.render('captchabox', {
        'sitekey': '9d5069dc-c77a-4fcf-a3f8-a2fa3bfa90b6',
        'callback': submitForm
    });
};

function getURL() {
    const q = new URLSearchParams(window.location.search);
    if (q.get("url")) {
        return q.get("url")
    }
    return window.parent.location.host + window.parent.location.pathname
}
