

const originUrl = new URL('http://localhost:8000/api/');

const updateProfile = (profile) => {
    const url = new URL(`user_profile/${profile.id}/`, originUrl);
    return fetch(url.href, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
    })
    .then(res => res.json());
};

const profile= {
    id: 1,
    name: 'John Doe',
    checked: false,
    gender: 'male',
    comments: 'PATCHメソッドの使用',
    items: 5,
    age: 30,
  }

updateProfile(profile);