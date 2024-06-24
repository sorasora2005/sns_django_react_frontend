const originUrl = new URL('http://localhost:8000/api/');

// 簡易新規作成用
const postCreateProfile = (name) => {
    const url = new URL('user_profile/', originUrl);
    return fetch(url.href, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name
          })
    })
    .then(res => res.json());
};
postCreateProfile('son6');