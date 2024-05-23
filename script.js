
document.addEventListener('DOMContentLoaded', function() {
    class ArenaEmbed extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            const url = this.textContent.trim();
            const slug = this.extractSlugFromUrl(url);
            if (slug) {
                this.fetchArenaBlockData(slug);
            } else {
                this.shadowRoot.innerHTML = '<p>Invalid URL.</p>';
            }
        }

        extractSlugFromUrl(url) {
            const match = url.match(/\/block\/(\d+)/);
            return match ? match[1] : null;
        }

        async fetchArenaBlockData(slug) {
            try {
                const response = await fetch(`https://api.are.na/v2/blocks/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    this.render(data);
                } else {
                    this.shadowRoot.innerHTML = '<p>Failed to fetch data.</p>';
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                this.shadowRoot.innerHTML = '<p>Error fetching data.</p>';
            }
        }

        render(data) {
            const style = document.createElement('style');
            style.textContent = `

              img,
              picture,
              video,
              canvas,
              svg {
                display: block;
                max-width: 100%;
                width: 100%;
                object-fit: cover;
                -o-object-fit: cover; /* for older versions of Opera */
                object-position: center; /* for older versions of Safari */
              }
              
              button,
              textarea,
              select {
                font: inherit;
                border: 0;
                line-height: 1;
                background: none;
                color: #414141;
              }
              
              input,
              textarea,
              select {
                display: block;
                width: 100%;
              }
              
              button {
                cursor: pointer;
                background: none;
              }
            
              a {
                color: inherit;
                text-decoration: none;
              }
            
              a:hover {
                color: #ccc;
              }
            
              mark {
                background-color: #e3fcdc;
              }
            
              hr {
                height: 1px; /* Specifies the thickness of the hr */
                background-color: #767676; /* Color of the hr */
                border: none; /* Removes the default border */
              }
              
              p,
              h1,
              h2,
              h3,
              h4,
              h5,
              h6 {
                font-size: 1rem;
                font-weight: 400;
                overflow-wrap: break-word;
              }
            
              ul {
                list-style-type: none;
                margin-left: 1rem;
              }
              
              ul li:before,
              ol ul li:before {
                position: absolute;
                margin-left: -1rem;
                content: "•";
                margin-right: 0.5rem;
              }
              
              ol {
                list-style-type: none;
                margin-left: 1rem;
                counter-reset: list;
              }
              
              ol li:before {
                position: absolute;
                margin-left: -1rem;
                margin-right: 0.5rem;
                content: counter(list) ".";
                counter-increment: list;
              }
            
              code {
                font-family: space;
                background-color: #eee;
              }
            
            
            /* Research Reader --------------------------------------------------------------- */
            
            .research-item {
              width: 100%;
              max-width: 600px;
              /* padding: 0.5rem; */
              border-style: solid;
              border-width: 1px;
              border-color: #ccc;
              border-radius: 0.25rem;
              margin-bottom: 1rem;
            }
            
            .research-item:last-of-type {
              margin-bottom: 2rem;
            }
            
            .item-content, .item-content img {
              border-top-right-radius: 0.25rem;
              border-top-left-radius: 0.25rem;
            }
            
            .attachment .item-content, .media .item-content {
              display: flex;
              aspect-ratio: 3/2;
              justify-content: center;
              background-color: #eee;
              position: relative;
            }
            
            .link .item-content {
              display: flex;
              aspect-ratio: 1/1;
              justify-content: center;
              background-color: #eee;
              position: relative;
            }
            
            .item-content:hover a.extension {
              display: inline-flex;
            }
            
            
        
            
            .extension {
              background-color: #ccc;
              color: #767676;
              padding: 0.25rem;
              border-radius: 0.25rem;
              line-height: 100%;
              position: absolute;
              text-transform: uppercase;
              display: flex;
              gap: 0.25rem;
              align-items: center;
              top: 1rem;
              right: 1rem;
              z-index: 40;
              font-family: monospace;
              font-size: 0.8rem;
            }
            
            .extension:hover {
              color: #414141;
            }
            
            .no-cover-container {
              color: #767676;
              align-items: center;
              display: flex;
              justify-content: center;
              flex-direction: column;
              gap: 1rem;
            }
            
            .item-content .no-cover-container p {
              margin-bottom: 0;
            }
            
            
            
            
            
            .text .item-content {
              padding: 1rem;
            }
            
            
            
            
            .item-content h1,
            .item-content h2,
            .item-content h3,
            .item-content h4,
            .item-content a,
            .item-content ul,
            .item-content ol,
            .item-content hr,
            .item-content p {
              margin-bottom: 1rem;
              margin-top: 0;
            }
            
            .item-content :last-child {
              margin-bottom: 0;
            }
            
            .item-meta {
              display: flex;
              justify-content: space-between;
              gap: 1rem;
              padding: 0.5rem;
              color: #767676;
              border-top: 1px solid #ccc;
            }
            
            .item-meta .meta-title {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .item-meta span {
              text-align: right;
              white-space: nowrap;
            }
            
            
            .done-loading {
              display: none;
            }
            
            button {
              display: none;
            }
            
            button.able-to-load {
              display: block;
            }
            
            button {
              color: #767676;
              text-decoration: none;
            }
            
            button:hover {
              color: #ccc;
              text-decoration: underline;
            }
            
            iframe {
              border-radius: 0.25rem;
            }
            `;

            const div = document.createElement('div');
            div.classList.add('research-item');

            const title = data.title || 'No title';

            if (data.class === 'Text') {
                div.classList.add('text');
                div.innerHTML = `
                    <div class="item-content">${data.content_html}</div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
            } else if (data.class === 'Image') {
                div.classList.add('image');
                div.innerHTML = `
                    <div class="item-content">
                        <img src="${data.image.display.url}" loading="lazy">
                    </div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
            } else if (data.class === 'Link') {
                div.classList.add('link');
                div.innerHTML = `
                    <div class="item-content">
                        <img src="${data.image.display.url}" loading="lazy">
                        <a href="${data.source.url}" target="_blank" class="extension">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg> www 
                        </a>          
                    </div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
            } else if (data.class === 'Media') {
                div.classList.add('media');
                div.innerHTML = `
                    <div class="item-content">
                        <img src="${data.image.display.url}" loading="lazy">
                        <a href="${data.source.url}" target="_blank" class="extension">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg> ${data.source.provider.name}
                        </a>          
                    </div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
            } else if (data.class === 'Attachment') {
                div.classList.add('attachment');
                if (data.attachment.content_type.includes('mp4')) {
                    div.innerHTML = `
                    <div class="item-content">
                        <video controls>
                            <source src="${data.attachment.url}" type="${data.attachment.content_type}">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
                } else if (data.attachment.content_type.includes('pdf')) {
                    div.innerHTML = `
                    <div class="item-content">
                        <iframe src="${data.attachment.url}" width="100%" frameborder="0"></iframe>
                    </div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
                } else if (data.image) {
                    div.innerHTML = `
                    <div class="item-content">
                        <img src="${data.image.thumb.url}" loading="lazy">
                    </div>
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
                } else {
                    div.innerHTML = `
                    <div class="item-content">
                        <div class="no-cover-container">
                            <p class="cover"> no cover </p>
                            <svg width="99" height="99" viewBox="0 0 99 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M49.5 97C62.0978 97 74.1796 91.9956 83.0876 83.0876C91.9956 74.1796 97 62.0978 97 49.5C97 36.9022 91.9956 24.8204 83.0876 15.9124C74.1796 7.00445 62.0978 2 49.5 2C36.9022 2 24.8204 7.00445 15.9124 15.9124C7.00445 24.8204 2 36.9022 2 49.5C2 62.0978 7.00445 74.1796 15.9124 83.0876C24.8204 91.9956 36.9022 97 49.5 97Z" stroke="#D2D2D2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M25.386 56.8075C29.0398 69.9614 43.6552 77.9998 56.8091 74.346C64.8475 71.4229 71.4245 64.846 73.6168 56.8075M33.4244 38.1729C32.9399 38.1729 32.4752 37.9804 32.1326 37.6378C31.79 37.2952 31.5975 36.8305 31.5975 36.346C31.5975 35.8614 31.79 35.3968 32.1326 35.0541C32.4752 34.7115 32.9399 34.519 33.4244 34.519C33.909 34.519 34.3737 34.7115 34.7163 35.0541C35.0589 35.3968 35.2514 35.8614 35.2514 36.346C35.2514 36.8305 35.0589 37.2952 34.7163 37.6378C34.3737 37.9804 33.909 38.1729 33.4244 38.1729ZM65.5783 38.1729C65.0938 38.1729 64.6291 37.9804 64.2865 37.6378C63.9438 37.2952 63.7514 36.8305 63.7514 36.346C63.7514 35.8614 63.9438 35.3968 64.2865 35.0541C64.6291 34.7115 65.0938 34.519 65.5783 34.519C66.0628 34.519 66.5275 34.7115 66.8701 35.0541C67.2127 35.3968 67.4052 35.8614 67.4052 36.346C67.4052 36.8305 67.2127 37.2952 66.8701 37.6378C66.5275 37.9804 66.0628 38.1729 65.5783 38.1729Z" stroke="#D2D2D2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p class="cover"> available </p>
                        </div>
                        <a href="${data.attachment.url}" target="_blank" class="extension">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg> ${data.attachment.extension}
                        </a>  
                    </div>            
                    <div class="item-meta">
                        <a target="_blank" href="https://www.are.na/block/${data.id}/" class="meta-title">${title}</a>
                        <span>added by <a target="_blank" href="https://www.are.na/${data.user.slug}/" class="meta-so">${data.user.username}</a></span>
                    </div>`;
                }
            } else {
                div.classList.add('text');
                div.innerHTML = `
                    <p>${data.class}</p>
                    <p>added by ${data.user.username}</p>`;
            }

            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(div);
        }
    }

    customElements.define('arena-embed', ArenaEmbed);
});



