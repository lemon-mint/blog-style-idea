let md = new showdown.Converter();
md.setFlavor("github")
md.setOption('tasklists', 'true');
md.setOption('tables', 'true');
md.setOption('parseImgDimensions', 'true');
md.setOption('ghCodeBlocks', 'true');
md.setOption('requireSpaceBeforeHeadingText', 'true');

function md2html(markdown) {
    let Potential_threat = md.makeHtml(markdown)
    let clean = HtmlSanitizer.SanitizeHtml(DOMPurify.sanitize(Potential_threat));
    let p = new DOMParser();
    let comment_body = p.parseFromString(clean, "text/html")
    comment_body.querySelectorAll("a").forEach((el) => {
        if (!(["http:", "https:", "ftp:", "mailto:"].includes(el.protocol))) {
            console.log(el.protocol, "blocked");
            el.href = "about:blank#blocked";
        }
        el.rel = "nofollow";
    })
    return new XMLSerializer().serializeToString(comment_body)
}

const comment_root = {
    data() {
        return {
            comments: []
        }
    },
    mounted() {

        this.comments.push(
            {
                user: "lemon-mint",
                time: new Date().toISOString(),
                body: md2html("# overflow: hidden;\n[example link](https://example.com)\n")
            }
        )

    },
    delimiters: ['[[%', '%]]']
};
Vue.createApp(comment_root).mount('#vue-comment-root');

document.getElementById("url").value = window.location.host + window.location.pathname;
document.getElementById("callback").value = window.location.href;

let xhr = new XMLHttpRequest();
//xhr.withCredentials = true;
xhr.open("GET", "https://untitled-dkrvk2jo785q.runkit.sh/session/test");
xhr.onreadystatechange = () => {
    if (xhr.status == 200 && xhr.readyState == 4) {
        if (xhr.responseText == "true") {
            document.getElementById("comment-textarea").disabled = false;
            document.getElementById("form-msg").innerHTML = "";
            document.getElementById("captchabox").hidden = false;
            document.getElementById("signin-btn").hidden = true;
        }
    }
}
xhr.send();
