const originUrl = new URL('http://localhost:8000/api/');

// 簡易新規作成用
export const postCreateProfile = (newProfile) => {
    const url = new URL('user_profile/', originUrl);
    return fetch(url.href, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProfile)
    })
    .then(res => res.json());
};

// 詳細作成＆修正用
export const updateProfile = (changedprofile) => {
    const url = new URL(`user_profile/${changedprofile.id}/`, originUrl);
    return fetch(url.href, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(changedprofile)
    })
    .then(res => res.json());
};

// プロファイルリスト取得用
export const getProfileList = () => {
    const url = new URL(`user_profile/`, originUrl);
    return fetch(url.href)
    .then(res => res.json())
    .catch(error => {
        console.error('Error getting profile list:', error);
        throw error;
    });
};

// プロフィールにチェックをつける用
export const patchCheckProfile = (id, check) => {
    const url = new URL(`user_profile/${id}/`, originUrl);
    return fetch(url.href, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            checked: check
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to patch profile');
        }
    });
};

// プロフィール削除用
export const deleteProfile = (id) => {
    const url = new URL(`user_profile/${id}/`, originUrl);
    return fetch(url.href, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to delete profile');
        }
        return res.text(); // DELETEが204 No Contentを返す場合があるため、textで処理
    })
    .then(data => {
        console.log('Profile deleted successfully:', data);
    })
    .catch(error => {
        console.error('Error deleting profile:', error);
        throw error;
    });
};
