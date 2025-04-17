import { marked, type TokenizerAndRendererExtension, type Tokens } from 'marked';

import hljs from 'highlight.js';


const collapse: TokenizerAndRendererExtension = {
    name: 'collapse',
    level: 'block',    // 这是 block-level 还是 inline-level 解析?
    start(src) { return src.match(/\[\/collapse\]/)?.index; }, // 提示 Marked.js 停止并检查是否匹配
    tokenizer(src, tokens) {
        const rule = /^\[collapse title="(.*?)"\]([\s\S]+?)\[\/collapse\]/;    // Regex for the complete token, anchor to string start
        const match = rule.exec(src);
        if (match) {
            const token: Tokens.Generic = {
                type: 'collapse',                               // 应该匹配上面的“name”
                raw: match[0],                                  // 原始内容 
                title: match[1],
                text: match[2],
                tokens: [],                                      // 将生成子内联标记的数组
            };
            this.lexer.blockTokens(token.text, token.tokens);   // 使用 blockTokens 解析块级标记
            return token;
        }
    },
    renderer(token) {
        let text = ''
        if (token.tokens) {
            text = this.parser.parse(token.tokens);             // 使用 parse 解析块级标记
        }
        // 创建一个 xControl div
        let html = `<details class="collapse">
    <summary class="collapse-title">${token.title}</summary>
    <div class="collapse-content">${text}</div>
    </details>
    `;
        return html;
    },
}

/**
 * 解析视频地址
 * @param url
 * @returns {string}
 */
function convert_url(url: string) {
    if (!url) return '';
    url = url
        .replace(/www\.bilibili\.com\/video\/av([\d]+|\?).*/i, 'player.bilibili.com/player.html?aid=$1')
        .replace(/www\.bilibili\.com\/video\/BV([\w]+|\?).*/i, 'player.bilibili.com/player.html?bvid=BV$1') /*B站视频*/

        .replace(/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, 'player.youku.com/embed/$1')
        .replace(/player\.youku\.com\/embed\/([\w\-=]+)\./i, 'player.youku.com/embed/$1')/*优酷视频*/

        .replace(/youtu.be\/(\w+)$/i, 'www.youtube.com/embed/$1')
        .replace(/(www\.)?youtube\.com\/watch\?v=([\w\-]+)/i, "www.youtube.com/embed/$2")/*YouTube视频*/

        .replace(/v\.qq\.com\/cover\/[\w]+\/[\w]+\/([\w]+)\.html/i, "v.qq.com/txp/iframe/player.html?vid=$1")
        .replace(/v\.qq\.com\/x\/page\/([\w]+)\.html/i, 'v.qq.com/txp/iframe/player.html?vid=$1')
        .replace(/v\.qq\.com\/.+[\?\&]vid=([^&]+).*$/i, "v.qq.com/txp/iframe/player.html?vid=$1")/*腾讯视频*/

        .replace(/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i, 'player.youku.com/embed/$1')
        .replace(/video\.tudou\.com\/v\/([\w]+)/, 'player.youku.com/embed/$1')/*土豆视频*/

    return url;
}
const video: TokenizerAndRendererExtension = {
    name: 'video',
    level: 'inline',    // 这是 block-level 还是 inline-level 解析? 
    start(this, src: string) { return 0; }, // 提示 Marked.js 停止并检查是否匹配
    tokenizer(this, src, tokens) {

        const rule = /\[video\](.*[^\s^\[])\[\/video\]/;    // Regex for the complete token, anchor to string start
        const match = rule.exec(src);
        if (match) {

            const token: Tokens.Generic = {              // 
                type: 'video',                                  // 应该匹配上面的“name”
                raw: match[0],                                  // 原始内容 
                text: match[1],                                  // Text to consume from the source
                tokens: [],                                      // 将生成子内联标记的数组
            };
            this.lexer.inline(token.text, token.tokens);        // 将此数据排队以处理内联令牌
            return token;
        }
    },
    renderer(this, token) {
        let arr = ['qq', 'youku', 'tudou', 'youtube', 'video', 'youtu.be']
        // 判断是否是视频地址
        if (!arr.some(item => token.text.includes(item))) return token.text;

        let arr2 = ['bilibili']
        // 判断是否是b站视频
        if (arr2.some(item => token.text.includes(item))) return token.text;


        let url = convert_url(token.text);
        return `<iframe height="375" width="500" style="max-width:100%" src="${url}" frameborder="no" allowfullscreen="true"></iframe>`;    // 返回 HTML
    }
}

function cleanUrl(href: string) {
    try {
        href = encodeURI(href).replace(/%25/g, '%');
    } catch {
        return null;
    }
    return href;
}


marked.options({
    breaks: true,
    async: false,
    gfm: true,
    pedantic: false,
    silent: false,
    // toc:true,
    renderer: (() => {
        let renderer = new marked.Renderer()
        renderer.link = function ({ href, title, tokens }: Tokens.Link) {
            const text = this.parser.parseInline(tokens);
            const cleanHref = cleanUrl(href);
            if (cleanHref === null) {
                return text;
            }
            href = cleanHref;
            return `<a href="${href}" target="_blank" title="${title}">${text}</a> `
        }
        renderer.code = function ({ text, lang, escaped }: Tokens.Code) {
            let codehtml = ''
            try {
                if (lang) {
                    let html = hljs.highlight(text, { language: lang }).value
                    codehtml = `<pre><code>${html}</code></pre>`
                } else {
                    let html = hljs.highlightAuto(text).value
                    codehtml = `<pre><code>${html}</code></pre>`
                }
            } catch (error) {
                console.log(error);
                let html = hljs.highlightAuto(text).value
                codehtml = `<pre><code>${html}</code></pre>`
            }
            return codehtml
        }

        renderer.heading = function ({ text, depth, tokens }: Tokens.Heading) {
            const textHtml = this.parser.parseInline(tokens);
            let id = ''
            if (depth == 2) {
                id = `id="${text}"`
            }
            return `<h${depth} ${id}>${textHtml}</h${depth}>`
        }

        return renderer
    })()
})

marked.use({ extensions: [collapse, video] })


export default marked