const originUrl = new URL('http://localhost:8000/api/');

const getProfileList = () => {
    const url = new URL(`user_profile/`, originUrl);
    return fetch(url.href)
        .then(res => res.json())
        .then(profileList => {
            console.log('Profile List:', profileList);
        })
        .catch(error => {
            console.error('Error getting profile list:', error);
            throw error;
        });
};

// プロフィールリストを取得して表示する
getProfileList();
