const LINK_TYPES = ['account', 'ct', 'demagog', 'dvtv', 'facebook', 'instagram', 'interview24', 'prezident21', 'twitter', 'web', 'wiki'];

const URL_TRANSFORMATIONS = {
    // String
    account: 'Transparentní účet',
    ct: 'Den s prezidentským kandidátem',
    demagog: 'Profil na Demagog.cz',
    dvtv: 'Rozhovor v DVTV',
    interview24: 'Rozhovor v Interview ČT24',
    prezident21: 'Profil na Prezident 21',
    wiki: 'Wikipedia',
    // RegExp
    facebook: /facebook.com\/([a-z0-9_.]*)(\/)?/i,
    instagram: /instagram.com\/([a-z0-9_.]*)(\/)?/i,
    twitter: /twitter.com\/([a-z0-9_.]*)/i,
    web: /([a-z0-9-]*\.cz)/i,
};

let generateLinkEl = (url, type) => {
    let el;

    if (url) {
        el = document.createElement('a');
        el.href = url;
        el.target = '_blank';
        el.textContent = generateLinkText(url, type);
    } else {
        el = document.createElement('span');
        el.className = 'c__missing';
        el.textContent = (typeof URL_TRANSFORMATIONS[type] === 'object') ? '✖' : URL_TRANSFORMATIONS[type];
    }

    return el;
};

let generateLinkText = (url, type) => {
    // RegExp
    if (typeof URL_TRANSFORMATIONS[type] === 'object') {
        return url.match(URL_TRANSFORMATIONS[type])[1];
    }

    // String
    return URL_TRANSFORMATIONS[type];
};

// Fetch candidates
fetch('./data/candidates.json')
    .then(response => response.json())
    .then(json => {
        let candidates = json;
        let candidatesTpl = document.querySelector('.tpl-candidates');
        let candidatesEl = document.querySelector('.js-candidates');

        // Render candidates
        candidates.forEach(candidate => {
            let tplEl = document.importNode(candidatesTpl.content, true);

            tplEl.querySelector('.js-name').textContent = candidate.name;
            tplEl.querySelector('.js-degree').textContent = candidate.degree;
            tplEl.querySelector('.js-bio').textContent = candidate.bio;
            tplEl.querySelector('.js-nominated-by').textContent = candidate.nominatedBy;
            tplEl.querySelector('.js-affiliation').textContent = candidate.affiliation;
            tplEl.querySelector('.js-image').src = `./img/${candidate.image}`;
            tplEl.querySelector('.js-image').alt = candidate.name;
            tplEl.querySelector('.js-id').dataset.id = candidate.id;

            LINK_TYPES.forEach(type => {
                let linkEl = generateLinkEl(candidate.links[type], type);
                tplEl.querySelector(`.js-link-${type}`).appendChild(linkEl);
            });

            candidatesEl.appendChild(tplEl);
        });
    });

// Fetch debates
fetch('./data/debates.json')
    .then(response => response.json())
    .then(json => {
        let debates = json;
        let debatesTpl = document.querySelector('.tpl-debates');
        let debatesEl = document.querySelector('.js-debates');

        // Render candidates
        debates.forEach(debate => {
            let tplEl = document.importNode(debatesTpl.content, true);

            tplEl.querySelector('.js-title').textContent = debate.title;
            tplEl.querySelector('.js-date').textContent = debate.date;
            tplEl.querySelector('.js-duration').textContent = debate.duration;
            tplEl.querySelector('.js-url').textContent = debate.url;
            tplEl.querySelector('.js-url').href = debate.url;

            debatesEl.appendChild(tplEl);
        });
    });
